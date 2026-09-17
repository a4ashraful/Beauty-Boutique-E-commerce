/**
 * Seeds initial categories, brands, delivery zones, sample products.
 * Run: npx tsx scripts/seed.ts
 */
import { config } from 'dotenv';
config({ path: '.env.local' });
import { adminDb } from '../lib/firebase/admin';
import { FieldValue } from 'firebase-admin/firestore';

async function seed() {
  const now = FieldValue.serverTimestamp();

  const categories = [
    { name: 'Skincare',    slug: 'skincare',    order: 1 },
    { name: 'Makeup',      slug: 'makeup',      order: 2 },
    { name: 'Hair Care',   slug: 'hair-care',   order: 3 },
    { name: 'Body Care',   slug: 'body-care',   order: 4 },
    { name: 'Fragrance',   slug: 'fragrance',   order: 5 },
    { name: 'Accessories', slug: 'accessories', order: 6 },
  ];

  for (const c of categories) {
    await adminDb.collection('categories').doc(c.slug).set({
      ...c, isActive: true, createdAt: now, updatedAt: now,
    }, { merge: true });
  }

  const brands = ['Tandra Beauty', 'GlowLab', 'LuxeCare', 'Herbal BD', 'Maybeline'];
  for (const name of brands) {
    const slug = name.toLowerCase().replace(/\s+/g, '-');
    await adminDb.collection('brands').doc(slug).set({
      name, slug, isActive: true, createdAt: now, updatedAt: now,
    }, { merge: true });
  }

  const zones = [
    { name: 'Inside Dhaka',  charge: 60,  divisions: ['Dhaka'], districts: ['Dhaka', 'Gazipur', 'Narayanganj'] },
    { name: 'Outside Dhaka', charge: 120, divisions: [],         districts: [] },
  ];
  for (const z of zones) {
    await adminDb.collection('deliveryZones').add({
      ...z, isActive: true, createdAt: now,
    });
  }

  console.log('✅ Seed complete');
  process.exit(0);
}

seed().catch((e) => { console.error(e); process.exit(1); });
