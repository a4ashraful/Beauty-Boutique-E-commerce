# Deployment Guide

## Prerequisites

- GitHub account
- [Vercel](https://vercel.com) account (free)
- Firebase project (Blaze plan required for admin SDK — pay-as-you-go, free tier is generous)
- ImgBB account
- (Optional) Custom domain (e.g., beautyboutiquebytandra.com)

---

## Step 1 — Firebase Production Setup

### 1.1 Create project
- [Firebase Console](https://console.firebase.google.com) → Add Project

### 1.2 Enable services
- **Authentication** → Sign-in methods:
  - Enable **Email/Password**
  - (Optional) Enable **Google**
- **Firestore Database** → Create database (production mode)
  - Choose a region close to Bangladesh (e.g., `asia-southeast1` Singapore)

### 1.3 Get credentials
- **Web App config**: Project Settings → General → Your apps → Web App
- **Service Account**: Project Settings → Service Accounts → Generate new private key → downloads a JSON file

Extract from JSON:
- `project_id` → `FIREBASE_PROJECT_ID`
- `client_email` → `FIREBASE_CLIENT_EMAIL`
- `private_key` → `FIREBASE_PRIVATE_KEY` (paste as-is including `\n`)

### 1.4 Deploy Firestore rules
```bash
firebase login
firebase use --add    # select your project
firebase deploy --only firestore:rules,firestore:indexes
```

---

## Step 2 — ImgBB

1. Sign up at [api.imgbb.com](https://api.imgbb.com/)
2. Go to API → Copy your key → `IMGBB_API_KEY`

---

## Step 3 — Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<your-username>/beauty-boutique.git
git push -u origin main
```

Make sure `.env.local` is **NOT** committed (it's in `.gitignore`).

---

## Step 4 — Deploy to Vercel

### 4.1 Import project
1. Go to [vercel.com/new](https://vercel.com/new)
2. Select your GitHub repo
3. Framework preset: **Next.js** (auto-detected)
4. Don't change build settings

### 4.2 Add Environment Variables

In Vercel Project Settings → Environment Variables, add each variable from your `.env.local`.

**Important**: For `FIREBASE_PRIVATE_KEY`, paste the entire value (with real line breaks). Vercel will store it correctly and our `admin.ts` handles `\n` unescaping.

### 4.3 Deploy
Click **Deploy**. First deploy takes ~2–3 minutes.

---

## Step 5 — Post-Deploy

### 5.1 Set site URL
Update `NEXT_PUBLIC_SITE_URL` in Vercel to your live URL (e.g., `https://beauty-boutique.vercel.app`).

Redeploy to apply.

### 5.2 Create admin user
1. Visit `https://your-app.vercel.app/register`
2. Register with your email
3. In Firebase Console → Authentication → find your UID
4. Locally run:
   ```bash
   npx tsx scripts/set-admin.ts <your-uid>
   ```
   (Uses the same Firebase project)
5. Log in at `https://your-app.vercel.app/admin/login`

### 5.3 Seed initial data (optional but recommended)
```bash
npx tsx scripts/seed.ts
```

---

## Step 6 — Custom Domain

1. Vercel → Project → Settings → Domains → Add Domain
2. Enter your domain (e.g., `beautyboutiquebytandra.com`)
3. Update DNS at your registrar:
   - **A record**: `76.76.21.21`
   - **CNAME (www)**: `cname.vercel-dns.com`
4. Wait 5–30 min for propagation
5. SSL is auto-provisioned

Update `NEXT_PUBLIC_SITE_URL` to the domain and redeploy.

---

## Step 7 — Google Analytics & Meta Pixel (Optional)

### GA4
1. Create GA4 property → copy Measurement ID (`G-XXXXXXX`)
2. Add `NEXT_PUBLIC_GA_ID=G-XXXXXXX` to Vercel env vars
3. Redeploy

### Meta Pixel
1. Meta Business → Events Manager → Data Sources → Add Pixel
2. Copy Pixel ID
3. Add `NEXT_PUBLIC_META_PIXEL_ID=...` to Vercel env vars
4. Redeploy

Both will auto-inject via `components/shop/Analytics.tsx`.

---

## Step 8 — Backups

Firestore supports scheduled exports (Blaze plan):

```bash
# Create a Cloud Storage bucket
gcloud storage buckets create gs://bbt-backups

# Schedule daily backups (Firestore → Backups → Schedule)
```

Or manually:
```bash
gcloud firestore export gs://bbt-backups/$(date +%Y%m%d)
```

---

## Step 9 — Monitoring

- **Vercel Analytics**: enable in dashboard (free tier)
- **Firebase Console → Firestore → Usage**: monitor reads/writes
- **Firebase Console → Authentication → Users**: monitor signups
- **Error tracking**: consider [Sentry](https://sentry.io) (free tier)

---

## Common Issues

### "Permission denied" on Firestore
- Rules not deployed → run `firebase deploy --only firestore:rules`
- User role missing → run `set-admin.ts`

### "Missing or insufficient permissions" for reads
- Rules check `isActive == true`. Ensure products/categories have this field.

### Images not loading
- Confirm `i.ibb.co` is in `next.config.js` `images.remotePatterns`

### "FIREBASE_PRIVATE_KEY" error
- In Vercel, paste the entire key from the JSON file. It should start with `-----BEGIN PRIVATE KEY-----` and end with `-----END PRIVATE KEY-----\n`

### Admin login redirects back
- Check `/api/admin/session` returns 200
- Verify custom claim is set: Firebase Console → Authentication → User → Custom Claims should show `{"role":"admin"}`

---

## Rollback

Vercel → Deployments → Previous → Promote to Production.

Firestore: use Firebase Console → Backups to restore from a snapshot.