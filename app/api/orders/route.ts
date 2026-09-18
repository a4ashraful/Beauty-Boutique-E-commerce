import { NextRequest, NextResponse } from 'next/server';
import { placeOrderAdmin } from '@/lib/firestore/placeOrderAdmin';
import { adminAuth, adminDb } from '@/lib/firebase/admin';
import { FieldValue } from 'firebase-admin/firestore';
import { z } from 'zod';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

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

/** Firestore rejects `undefined` field values — strip them before writing. */
function clean<T extends Record<string, any>>(obj: T): T {
  const out: any = {};
  Object.entries(obj).forEach(([k, v]) => {
    if (v !== undefined) out[k] = v;
  });
  return out;
}

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const parsed = bodySchema.parse(json);

    // Optional auth: if a bearer token is provided, verify it for customerId
    const authHeader = req.headers.get('authorization');
    if (authHeader?.startsWith('Bearer ')) {
      try {
        const token = authHeader.split(' ')[1];
        const decoded = await adminAuth.verifyIdToken(token);
        parsed.customerId = decoded.uid;
      } catch {
        // anonymous checkout is fine
      }
    }

    // Verify the delivery charge server-side too
    let deliveryCharge = parsed.deliveryCharge;
    try {
      const zoneSnap = await adminDb
        .collection('deliveryZones')
        .doc(parsed.deliveryZoneId)
        .get();
      if (zoneSnap.exists) {
        const z = zoneSnap.data() as any;
        if (typeof z?.charge === 'number') deliveryCharge = z.charge;
      }
    } catch {
      // fall back to the client-supplied charge
    }

    // Server-side re-fetch of prices to prevent tampering
    const itemsWithVerifiedPrices = await Promise.all(
      parsed.items.map(async (it) => {
        const snap = await adminDb.collection('products').doc(it.productId).get();
        if (!snap.exists) throw new Error(`Product ${it.name} not found`);
        const p = snap.data()!;

        let price = p.salePrice ?? p.regularPrice;
        let variantName = it.variantName;
        let image =
          p.images?.find((i: any) => i.isMain)?.url || p.images?.[0]?.url || it.image;

        if (it.variantId) {
          const v = (p.variants || []).find((x: any) => x.id === it.variantId);
          if (!v) throw new Error('Variant unavailable');
          price = v.price;
          variantName = v.name;
          image = v.image || image;
        }

        return clean({
          productId: it.productId,
          variantId: it.variantId,
          sku: it.sku || p.sku,
          qty: it.qty,
          price: Number(price) || 0,
          name: p.name,
          variantName,
          image,
        }) as any;
      })
    );

    const result = await placeOrderAdmin({
      ...parsed,
      deliveryCharge,
      items: itemsWithVerifiedPrices,
    });

    // Notify admin (fire & forget — never block the order on this)
    adminDb
      .collection('notifications')
      .add({
        userId: null,
        orderId: result.orderId,
        title: 'New Order',
        message: `Order ${result.orderNumber} placed by ${parsed.customerName}`,
        type: 'order',
        read: false,
        createdAt: FieldValue.serverTimestamp(),
      })
      .catch(() => {});

    return NextResponse.json(result);
  } catch (err: any) {
    console.error('Order error:', err);
    const message =
      err instanceof z.ZodError
        ? 'Please check the form — some fields are invalid.'
        : err?.message || 'Failed to place order';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
