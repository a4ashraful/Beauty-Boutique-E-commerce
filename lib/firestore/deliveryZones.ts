import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import type { DeliveryZone } from '@/types';

const col = collection(db, 'deliveryZones');

export async function getActiveDeliveryZones(): Promise<DeliveryZone[]> {
  const snap = await getDocs(query(col, where('isActive', '==', true)));
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<DeliveryZone, 'id'>) }));
}

export function findZoneForAddress(
  zones: DeliveryZone[],
  division: string,
  district: string
): DeliveryZone | null {
  // prefer specific district match, then division, then fallback (first zone with no restriction)
  const exact = zones.find((z) => z.districts?.includes(district));
  if (exact) return exact;

  const byDiv = zones.find((z) => z.divisions?.includes(division));
  if (byDiv) return byDiv;

  const fallback = zones.find((z) => !z.districts?.length && !z.divisions?.length);
  return fallback ?? null;
}