import { NextRequest, NextResponse } from 'next/server';
import { placeOrder } from '@/lib/firestore/orders';
import { adminAuth, adminDb } from '@/lib/firebase/admin';
import { FieldValue } from 'firebase-admin/firestore';
import { headers } from 'next/headers';
import { z } from 'zod';

export const runtime = 'nodejs';

const bodySchema = z.object({
  customerId: z.string().optional(),
  customerName: z.string().min(2).max(100),
  phone: z.string().regex(/^01[3-9]\d{8}$/),
  email: z.string().email().optional().or(z.literal('')),
  division: z.string().min(2),
  district: z.string().min(2),
  area: z.string().min(2),
  address: z.string().min(5),
  items: z.array(z.object({
    productId: z.string(),
    variantId: z.string().optional(),
    name: z.string(),
    variantName: z.string().optional(),
    image: z.string().optional(),
    price: z.number().min(0),
    qty: z.number().int().min(1),
    sku: z.string().optional(),
  })).min(1),
  couponCode: z.string().optional(),
  paymentMethod: z.enum(['cod', 'bkash', 'nagad', 'bank', 'manual']),
  paymentReference: z.string().optional(),
  paymentNote: z.string().optional(),
  deliveryZoneId: z.string(),
  deliveryCharge: z.number().min(0),
  notes: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    // Rate limiting would go here in production
    const json = await req.json();
    const parsed = bodySchema.parse(json);

    // Optional auth: if bearer token provided, verify for customerId
    const authHeader = headers().get('authorization');
    if (authHeader?.startsWith('Bearer ')) {
      try {
        const token = authHeader.split(' ')[1];
        const decoded = await adminAuth.verifyIdToken(token);
        parsed.customerId = decoded.uid;
      } catch {
        // anonymous OK
      }
    }

    // 🔥 Server-side re-fetch prices to prevent tampering
    const itemsWithVerifiedPrices = await Promise.all(
      parsed.items.map(async (it) => {
        const snap = await adminDb.collection('products').doc(it.productId).get();
        if (!snap.exists) throw new Error(`Product ${it.name} not found`);
        const p = snap.data()!;

        let price = p.salePrice ?? p.regularPrice;
        let variantName = it.variantName;
        let image = p.images?.[0]?.url;

        if (it.variantId) {
          const v = (p.variants || []).find((x: any) => x.id === it.variantId);
          if (!v) throw new Error(`Variant unavailable`);
          price = v.price;
          variantName = v.name;
          image = v.image || image;
        }

        return { ...it, price, variantName, image, name: p.name };
      })
    );

    const result = await placeOrder({
      ...parsed,
      items: itemsWithVerifiedPrices,
    });

    // Create notification for admin (fire & forget)
    adminDb.collection('notifications').add({
      userId: null,
      orderId: result.orderId,
      title: 'New Order',
      message: `Order ${result.orderNumber} placed by ${parsed.customerName}`,
      type: 'order',
      read: false,
      createdAt: FieldValue.serverTimestamp(),
    }).catch(() => {});

    return NextResponse.json(result);
  } catch (err: any) {
    console.error('Order error:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to place order' },
      { status: 400 }
    );
  }
}
