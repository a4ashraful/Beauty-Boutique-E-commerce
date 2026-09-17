# Beauty Boutique By Tandra

A complete, modern e-commerce platform for a Bangladesh-based cosmetics and beauty products store.

**Stack**: Next.js 14 (App Router) · TypeScript · Tailwind CSS · Firebase Firestore · ImgBB · Vercel

---

## ✨ Features

### Customer Storefront
- Modern beauty-focused homepage with hero slider, categories, brands, featured/new/best-seller/discounted sections
- Full product catalog with advanced filters (category, brand, price, skin type, skin concern, rating, availability)
- Product detail page with image gallery, variant selector, ingredients, benefits, reviews
- Cart drawer + full cart page with coupon support
- Mobile-first checkout with **manual bKash / Nagad / Bank transfer** verification
- Guest checkout (no account required)
- Order tracking (public — order number + phone)
- Customer accounts: profile, order history, saved addresses, wishlist
- Product reviews with admin moderation

### Admin Dashboard
- Overview stats (orders, sales, products, customers, low stock)
- 7-day sales chart
- Full product CRUD with:
  - Multi-image upload (ImgBB)
  - Drag-to-reorder images + set main
  - Variant editor (shades, sizes)
  - Skin type/concern tagging
  - SEO fields
- Category & brand management
- Order management with:
  - Status workflow (Pending → Confirmed → Processing → Shipped → Out for Delivery → Delivered)
  - **Manual payment verification** (mark Paid / Failed / Refunded)
  - Courier + tracking number entry
  - Admin notes
- Coupon/discount manager (fixed or % with caps, date ranges, usage limits)
- Homepage banner manager (hero / promo / sidebar)
- Delivery zone manager (per-district or per-division charges)
- Payment method toggles
- Store settings (contact info, social links, features)
- Review moderation (approve / hide / feature)

---

## 🚀 Quick Start

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd beauty-boutique
npm install
```

### 2. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com) → Create project
2. Enable **Authentication** → Sign-in method → Email/Password
3. Enable **Firestore Database** → Start in production mode
4. (Optional) Enable Google sign-in
5. Get your **Web App config** (Project Settings → General → Your apps → Web)
6. Get **Service Account credentials** (Project Settings → Service Accounts → Generate new private key)

### 3. ImgBB Setup

1. Sign up at [api.imgbb.com](https://api.imgbb.com/)
2. Copy your API key

### 4. Environment Variables

Copy `.env.example` to `.env.local` and fill in:

```bash
# Firebase Client
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...

# Firebase Admin
FIREBASE_PROJECT_ID=...
FIREBASE_CLIENT_EMAIL=...
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# ImgBB
IMGBB_API_KEY=...

# Manual payment info shown to customers
NEXT_PUBLIC_BKASH_NUMBER=01XXXXXXXXX
NEXT_PUBLIC_NAGAD_NUMBER=01XXXXXXXXX
NEXT_PUBLIC_BANK_NAME=
NEXT_PUBLIC_BANK_ACCOUNT=
NEXT_PUBLIC_BANK_BRANCH=

# Site
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_SITE_NAME=Beauty Boutique By Tandra
NEXT_PUBLIC_FACEBOOK_URL=
NEXT_PUBLIC_INSTAGRAM_URL=
NEXT_PUBLIC_WHATSAPP=8801XXXXXXXXX
NEXT_PUBLIC_SUPPORT_PHONE=01XXXXXXXXX
NEXT_PUBLIC_SUPPORT_EMAIL=
```

> **Note**: The `FIREBASE_PRIVATE_KEY` must preserve `\n` characters. In Vercel, paste the entire key and Vercel will handle the escaping when you use the `admin.ts` helper that does `.replace(/\\n/g, '\n')`.

### 5. Deploy Firestore Rules & Indexes

```bash
# Install Firebase CLI globally if needed
npm install -g firebase-tools

firebase login
firebase init firestore    # choose existing project, use provided files
firebase deploy --only firestore:rules,firestore:indexes
```

### 6. Seed Initial Data

```bash
npm run seed
```

This creates:
- 6 categories (Skincare, Makeup, Hair Care, Body Care, Fragrance, Accessories)
- 5 brands
- 2 delivery zones (Inside/Outside Dhaka)

### 7. Create Your First Admin

1. In your running app, register a user at `/register`
2. In Firebase Console → Authentication → Users, copy the user's UID
3. Run:

```bash
npx tsx scripts/set-admin.ts <UID-or-email>
```

4. Log in at `/admin/login`

### 8. Run Locally

```bash
npm run dev
```

- Storefront: http://localhost:3000
- Admin: http://localhost:3000/admin

---

## 📁 Project Structure

```
app/
  (shop)/              # Customer-facing pages
    page.tsx           # Homepage
    shop/              # Catalog
    product/[slug]/    # Product detail
    category/[slug]/   # Category
    brand/[slug]/      # Brand
    cart/              # Cart page
    checkout/          # Checkout
    order-success/     # Post-order
    track-order/       # Public tracking
    account/           # Protected customer area
    wishlist/          # Wishlist
    login/, register/  # Auth
    pages/             # Static pages (about, faq, etc.)
  admin/               # Admin dashboard (protected)
    login/
    products/
    categories/
    brands/
    orders/
    customers/
    coupons/
    banners/
    reviews/
    delivery-zones/
    payments/
    settings/
  api/
    upload/            # ImgBB upload
    orders/            # Server-side order creation
    admin/session/     # Admin session cookie

components/
  shop/                # Customer UI
  admin/               # Admin UI
  ui/                  # shadcn primitives

lib/
  firebase/            # client, admin, collections
  firestore/           # Data access layer
  imgbb.ts
  utils.ts
  validators.ts
  seo.ts
  constants.ts

hooks/                 # useAuth, useCart, useWishlist, etc.
types/                 # TypeScript interfaces
scripts/               # Seed + admin scripts
```

---

## 🔐 Security

- Firestore rules restrict writes to admins only
- Admin routes protected by session cookie + custom claims
- Server-side price re-validation on order creation
- Firestore transactions prevent overselling
- File uploads validated server-side (type + size)
- Password hashing handled by Firebase Auth
- HTTP security headers configured in `next.config.js`
- Rate limiting recommended via Vercel/Cloudflare for `/api/*`

---

## 🚀 Deployment

See `DEPLOYMENT.md` for detailed step-by-step instructions.

TL;DR:
1. Push to GitHub
2. Import repo at [vercel.com](https://vercel.com)
3. Add all environment variables
4. Deploy
5. Add custom domain

---

## 📖 Admin Guide

For the store owner: see `ADMIN-GUIDE.md`.

---

## 📄 License

Proprietary. All rights reserved © Beauty Boutique By Tandra.