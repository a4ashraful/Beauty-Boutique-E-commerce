# Admin Guide — Beauty Boutique By Tandra

Welcome! This guide explains how to run your store from the admin panel at `/admin`.

---

## 🔐 Logging In

1. Go to `https://yourdomain.com/admin/login`
2. Enter your admin email + password
3. You'll land on the Dashboard

**Forgot password?** Ask your developer to reset it in Firebase Console, or use the "Forgot Password" link on `/login` (the customer login) — it also resets admin passwords.

---

## 📊 Dashboard

Shows a quick snapshot:
- **Total / Today's Orders**, **Pending**, **Completed**, **Cancelled**
- **Total Sales**, **Today's Sales**
- **Total Products**, **Low Stock** (≤ 5), **Out of Stock**
- **Total Customers**, **Product Views**
- **Sales chart** (last 7 days)
- **Best Sellers** (top 5 by units sold)
- **Recent Orders** (latest 8)

Use this daily to spot pending orders that need attention.

---

## 🛍️ Products

### Add a new product
1. Products → **+ Add Product**
2. Fill in:
   - **Name** (required)
   - **Category** (required for filtering)
   - **Brand**
   - **Short description** (shows on cards and PDP top)
   - **Full description** (PDP Description tab)
   - **Regular price** (required)
   - **Sale price** (optional — discount % auto-calculated)
   - **Stock** (or leave to auto-sum from variants)
   - **SKU**
   - **Size** (e.g., 30ml)
3. Upload images:
   - Click the upload area → select 1–5 images
   - First image is automatically set as **MAIN**
   - Drag images to reorder
   - Hover an image and click the star to change which is MAIN
   - Click trash to remove
4. **Variants** (for shades/sizes):
   - Click **+ Add Variant**
   - Give each a name (e.g., "Ruby Red"), price, stock
   - Optionally paste an image URL for that variant
5. Fill in **Ingredients**, **Benefits**, **How to Use**
6. Toggle **Suitable Skin Types** and **Skin Concerns**
7. Enter **Country of Origin** and **Expiry/Batch** info if applicable
8. (Optional) Set **SEO Title** and **Meta Description**
9. Flags on the right:
   - **Active** → visible on site
   - **Featured** → shown in "Featured Products"
   - **Best seller** → shown in "Best Sellers"
   - **New arrival** → shown in "New Arrivals"
10. Click **Publish Product**

> ✅ Once published, the product immediately appears on the shop, category, and search pages.

### Edit / Duplicate / Delete
- **Edit**: click the pencil icon
- **Duplicate**: click the copy icon (creates a draft copy)
- **Delete**: click trash (irreversible)
- **Publish/Unpublish**: click the eye icon
- **Bulk actions**: check the boxes on the left → choose action at the top

### Search
Use the search bar to filter by name, SKU, or brand.

---

## 📂 Categories

1. Categories → **+ Add Category**
2. Fill in:
   - **Name**
   - **Slug** (URL) — auto-generated from name
   - **Parent** — leave empty for top-level, or choose a parent for subcategory
   - **Description**
   - **Image** (upload)
   - **Display order** (lower = first)
   - **Active** toggle
3. Save

Categories appear on the homepage and `/categories`.

---

## 🏷️ Brands

Same flow as categories. Upload the brand logo (recommended: transparent PNG, ~200×100px).

---

## 📦 Orders

### Viewing orders
- Orders list shows all orders with filter tabs: All / Pending / Confirmed / Processing / Shipped / Out for Delivery / Delivered / Cancelled
- Use the search box to find by order number, customer name, phone or email
- Click **Export CSV** to download the current view

### Processing an order
1. Click on an order to open its detail page
2. **Verify payment** (if bKash/Nagad/Bank):
   - Open your bKash/Nagad app and check the customer's TrxID
   - In the right sidebar, you'll see the reference the customer submitted
   - Click **Mark as Paid** or **Mark Failed**
3. **Update status** using the buttons:
   - `Mark as Confirmed` after payment verified
   - `Mark as Processing` when packing
   - `Mark as Shipped` → fill in **Courier Name** + **Tracking Number** below
   - `Mark as Out for Delivery` (if your courier sends this status)
   - `Mark as Delivered` when complete
4. **Cancel Order** if needed — customer is auto-notified
5. **Add admin notes** (private, only you see them)

**Every status change automatically notifies the customer** in their account notifications.

### Courier entry
Scroll to **Courier Information** section:
- Courier Name (e.g., Pathao, Steadfast, RedX)
- Tracking Number
- Click **Save Courier Info** → order status becomes "Shipped"

---

## 👥 Customers

List shows all registered customers with:
- Total orders
- Total spent (৳)
- Last order date

Click any row to see:
- Full order history
- Saved addresses
- Ability to **Disable Account** (blocks new orders/logins)

> Note: Guest orders don't appear here.

---

## 🎟️ Coupons

### Create a coupon
1. Coupons → **+ Add Coupon**
2. Code (e.g., `WELCOME10`)
3. Type:
   - **Percentage** → e.g., 10 = 10% off
   - **Fixed** → e.g., 100 = ৳100 off
4. Value
5. **Min Order** (optional) — coupon only applies above this subtotal
6. **Max Discount** (for percentage) — caps the max discount
7. Start/End dates
8. Usage Limit — max redemptions (0 = unlimited)
9. Active toggle
10. Save

Copy the code from the list with the copy icon and share on Facebook/WhatsApp.

---

## 🖼️ Homepage Banners

Three positions:
- **Hero Slider** — big banner at top (recommended 1920×800)
- **Promo Banner** — 2 columns below hero (recommended 800×400)
- **Sidebar Banner** — reserved for future use

### Add a banner
1. Choose **Position**
2. Upload image
3. Title (headline)
4. Subtitle (smaller text)
5. Button Text + Link (e.g., "Shop Now" → `/shop`)
6. Display Order (lower = first in slider)
7. Active toggle
8. Save

Banners with `Active=false` are hidden but preserved.

---

## 🚚 Delivery Zones

Configure delivery charges by region.

### Add a zone
1. Name (e.g., "Inside Dhaka")
2. Charge (৳)
3. **Divisions** — optionally select matching divisions
4. **Districts** — optionally select matching districts
5. Save

**Priority**: When checkout determines the charge, **district match beats division match**. If neither matches, the first zone with no restrictions is used.

Example setup:
- Zone 1: "Inside Dhaka" — districts: Dhaka, Gazipur, Narayanganj — ৳60
- Zone 2: "Outside Dhaka" — no divisions/districts — ৳120

---

## 💳 Payment Settings

Toggle payment methods on/off and enter your manual payment details:
- **Cash on Delivery** (recommended ON)
- **bKash** — enter your Personal number
- **Nagad** — enter your Personal number
- **Bank Transfer** — enter bank name, account number, branch

When enabled, customers see these instructions at checkout and must submit a Transaction ID for bKash/Nagad/Bank.

---

## ⚙️ Store Settings

- **Store Name**, **Support Address**
- **Support Phone**, **Support Email** — shown in footer and contact page
- **Facebook URL**, **Instagram URL**, **WhatsApp Number**, **YouTube URL** — shown in social sections
- **Require review approval** — when ON, reviews won't appear publicly until approved
- **Newsletter signup** — toggle footer newsletter form

---

## ⭐ Reviews

Three tabs: Pending / Approved / Featured / All

For each review:
- **Approve** — makes it visible on the product page
- **Hide** — removes from public (keeps in DB)
- **Feature** — highlights in "What Our Customers Say" carousel
- **Delete** — permanently removes

---

## 🔔 Daily Workflow Checklist

**Morning:**
- [ ] Check Dashboard for new orders
- [ ] Verify any bKash/Nagad payments
- [ ] Confirm pending orders

**During the day:**
- [ ] Update shipped orders with tracking numbers
- [ ] Respond to customer calls/WhatsApp

**Evening:**
- [ ] Mark deliveries as Delivered
- [ ] Review new product reviews
- [ ] Add new products if needed
- [ ] Update banners for upcoming promos

**Weekly:**
- [ ] Check low-stock products and restock
- [ ] Review best sellers — feature them
- [ ] Check expired coupons
- [ ] Review sales chart

---

## ❓ Common Tasks

**How do I change the hero banner?**
Homepage Banners → find the active hero banner → click pencil → upload new image → save.

**How do I mark a product as a best seller?**
Products → edit product → toggle "Best seller" → save.

**How do I add a new shade to an existing product?**
Products → edit product → Variants section → + Add Variant → fill name/price/stock → save.

**How do I refund a customer?**
1. Manually send refund via bKash/bank
2. Orders → open the order → Mark as Refunded
3. Mark status as "Returned"

**How do I hide a category temporarily?**
Categories → edit → toggle Active off. Products stay but the category page returns 404.

**How do I see how many orders I have this month?**
Orders → Export CSV → filter in Excel.

---

## 🆘 Getting Help

If something isn't working:
1. Refresh the page (sometimes Firestore rules take a second to propagate)
2. Check the browser console (F12) for red error messages
3. Contact your developer with:
   - What you tried to do
   - The exact error message
   - A screenshot

---

Happy selling! 💄