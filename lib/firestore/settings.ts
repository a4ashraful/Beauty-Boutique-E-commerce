import {
  doc, getDoc, setDoc, serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/client';

export interface SiteSettings {
  // Payment
  codEnabled?: boolean;
  bkashEnabled?: boolean;
  bkashNumber?: string;
  nagadEnabled?: boolean;
  nagadNumber?: string;
  bankEnabled?: boolean;
  bankName?: string;
  bankAccount?: string;
  bankBranch?: string;

  // Store
  storeName?: string;
  supportPhone?: string;
  supportEmail?: string;
  supportAddress?: string;

  // Social
  facebookUrl?: string;
  instagramUrl?: string;
  whatsappNumber?: string;
  youtubeUrl?: string;

  // Features
  reviewsRequireApproval?: boolean;
  newsletterEnabled?: boolean;

  updatedAt?: any;
}

const DEFAULT: SiteSettings = {
  codEnabled: true,
  bkashEnabled: true,
  bkashNumber: process.env.NEXT_PUBLIC_BKASH_NUMBER || '',
  nagadEnabled: true,
  nagadNumber: process.env.NEXT_PUBLIC_NAGAD_NUMBER || '',
  bankEnabled: false,
  bankName: process.env.NEXT_PUBLIC_BANK_NAME || '',
  bankAccount: process.env.NEXT_PUBLIC_BANK_ACCOUNT || '',
  bankBranch: process.env.NEXT_PUBLIC_BANK_BRANCH || '',
  storeName: process.env.NEXT_PUBLIC_SITE_NAME || 'Beauty Boutique By Tandra',
  supportPhone: process.env.NEXT_PUBLIC_SUPPORT_PHONE || '',
  supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || '',
  supportAddress: 'Dhaka, Bangladesh',
  facebookUrl: process.env.NEXT_PUBLIC_FACEBOOK_URL || '',
  instagramUrl: process.env.NEXT_PUBLIC_INSTAGRAM_URL || '',
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP || '',
  youtubeUrl: '',
  reviewsRequireApproval: true,
  newsletterEnabled: true,
};

const ref = () => doc(db, 'settings', 'site');

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const snap = await getDoc(ref());
    if (!snap.exists()) return DEFAULT;
    return { ...DEFAULT, ...(snap.data() as SiteSettings) };
  } catch {
    return DEFAULT;
  }
}

export async function saveSiteSettings(patch: Partial<SiteSettings>) {
  await setDoc(ref(), { ...patch, updatedAt: serverTimestamp() }, { merge: true });
}