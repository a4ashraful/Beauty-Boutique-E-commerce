export const SITE = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || 'Beauty Boutique By Tandra',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL || '',
  instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL || '',
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP || '',
  supportPhone: process.env.NEXT_PUBLIC_SUPPORT_PHONE || '',
  supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || '',
};

export const PAYMENT = {
  bkash: process.env.NEXT_PUBLIC_BKASH_NUMBER || '',
  nagad: process.env.NEXT_PUBLIC_NAGAD_NUMBER || '',
  bankName: process.env.NEXT_PUBLIC_BANK_NAME || '',
  bankAccount: process.env.NEXT_PUBLIC_BANK_ACCOUNT || '',
  bankBranch: process.env.NEXT_PUBLIC_BANK_BRANCH || '',
};

export const PAGE_SIZE = 24;
export const LOW_STOCK_THRESHOLD = 5;