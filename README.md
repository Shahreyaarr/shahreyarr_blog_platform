# 🌍 Sahr E Yaar — Travel Photography Platform

A full-featured travel photography blog and e-commerce platform built with React, Firebase, Cloudinary, and EmailJS. Fully admin-managed, real-time, and deployed on Firebase Hosting.

**Live Site:** [shahreyarr.com](https://shahreyarr.com)  
**Firebase Hosting:** [shareyarr-blog.web.app](https://shareyarr-blog.web.app)

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | React 18 + TypeScript | UI framework |
| Build Tool | Vite | Fast bundler |
| Styling | Tailwind CSS | Utility-first CSS |
| Routing | React Router v6 | Client-side routing |
| State | Zustand | Global state management |
| Database | Firebase Firestore | Blogs, gallery, shop, destinations data |
| Realtime | Firebase Realtime DB | Live chat (user ↔ admin) |
| Hosting | Firebase Hosting | Website deployment |
| Images | Cloudinary | Direct image upload & CDN delivery |
| Email | EmailJS | Order confirmation + dispatch emails |
| Payments | Razorpay | Shop checkout |
| Icons | Lucide React | UI icons |

---

## 📁 Project Structure

```
sahr-e-yaar/
├── src/
│   ├── admin/                    # Admin panel pages
│   │   ├── AdminLogin.tsx        # Login (Alaska / DubAi@687)
│   │   ├── AdminLayout.tsx       # Sidebar layout
│   │   ├── AdminDashboard.tsx    # Stats overview
│   │   ├── AdminBlogs.tsx        # Blog & vlog management
│   │   ├── AdminGallery.tsx      # Photo gallery management
│   │   ├── AdminVideos.tsx       # YouTube video management
│   │   ├── AdminDestinations.tsx # Travel destinations
│   │   ├── AdminCountries.tsx    # Countries visited
│   │   ├── AdminJourneys.tsx     # Upcoming journeys
│   │   ├── AdminShop.tsx         # Products management
│   │   ├── AdminOrders.tsx       # Orders + dispatch emails
│   │   ├── AdminChat.tsx         # Live chat with users
│   │   ├── AdminMessages.tsx     # Contact form messages
│   │   └── AdminSettings.tsx     # Site settings
│   ├── components/
│   │   ├── Chat.tsx              # User-facing live chat widget
│   │   ├── ImageUpload.tsx       # Reusable direct upload component
│   │   ├── GalleryPicker.tsx     # Pick from existing gallery
│   │   ├── Navbar.tsx            # Top navigation
│   │   └── Footer.tsx            # Footer
│   ├── pages/
│   │   ├── HomePage.tsx          # Landing page
│   │   ├── BlogPage.tsx          # Blog listing
│   │   ├── SingleBlogPage.tsx    # Individual blog post
│   │   ├── GalleryPage.tsx       # Photo gallery
│   │   ├── GalleryCategoryPage.tsx
│   │   ├── DestinationsPage.tsx  # Travel destinations
│   │   ├── SingleDestinationPage.tsx
│   │   ├── CountriesPage.tsx     # Countries visited
│   │   ├── JourneysPage.tsx      # Upcoming journeys
│   │   ├── ShopPage.tsx          # Shop listing
│   │   ├── ProductPage.tsx       # Individual product
│   │   ├── CartPage.tsx          # Cart + checkout + Razorpay
│   │   └── ContactPage.tsx       # Contact form
│   ├── lib/
│   │   ├── firebase.ts           # Firebase config + Firestore helpers
│   │   └── email.ts              # EmailJS email functions
│   ├── store/
│   │   └── index.ts              # All Zustand stores
│   ├── App.tsx                   # Routes + auth guards
│   └── main.tsx                  # Entry point
├── firebase.json                 # Firebase hosting config
├── .firebaserc                   # Firebase project config
├── tailwind.config.js
├── vite.config.ts
└── package.json
```

---

## 🔧 Third-Party Services Configuration

### 1. Firebase

**Project:** `shareyarr-blog`  
**Console:** [console.firebase.google.com](https://console.firebase.google.com/project/shareyarr-blog)

**Config** (in `src/lib/firebase.ts`):
```ts
const config = {
  apiKey: "AIzaSyDtuI13hTabEhq83hJA4ZTr_8rLrnihSe4",
  authDomain: "shareyarr-blog.firebaseapp.com",
  projectId: "shareyarr-blog",
  storageBucket: "shareyarr-blog.firebasestorage.app",
  messagingSenderId: "671119246316",
  appId: "1:671119246316:web:72936560055cf45ac3b6c9",
  databaseURL: "https://shareyarr-blog-default-rtdb.asia-southeast1.firebasedatabase.app",
};
```

**Services used:**
- **Firestore** — stores blogs, gallery, destinations, countries, journeys, products, orders, messages, settings, videos
- **Realtime Database** — live chat messages (path: `chat/{sessionId}/msgs`)
- **Hosting** — website deployed here

**Firestore Rules** (set in Firebase Console):
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read: if true;
      allow write: if true;
    }
  }
}
```

**Realtime Database Rules:**
```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

---

### 2. Cloudinary

**Account:** `dvsy8yo4g`  
**Dashboard:** [console.cloudinary.com](https://console.cloudinary.com)  
**Upload Preset:** `sahr_uploads` (Unsigned mode)

**Config** (in `src/components/ImageUpload.tsx` and `src/components/Chat.tsx`):
```ts
const CLOUD_NAME    = 'dvsy8yo4g';
const UPLOAD_PRESET = 'sahr_uploads';
```

**Upload URL:**
```
https://api.cloudinary.com/v1_1/dvsy8yo4g/upload
```

**Folder structure:**
| Folder | Used for |
|---|---|
| `sahr_gallery/` | Gallery photos |
| `sahr_blog/` | Blog featured images + content images |
| `sahr_hero/` | Homepage hero background images |
| `sahr_profile/` | About/profile photo |
| `sahr_destinations/` | Destination hero + gallery images |
| `sahr_countries/` | Country photos |
| `sahr_shop/` | Product images |
| `sahr_chat/` | Chat image uploads (users) |
| `sahr_voice/` | Voice note uploads (chat) |
| `sahr_admin/` | Admin chat image uploads |

**Free Tier:** 25GB storage, 25GB bandwidth/month — no credit card required.

---

### 3. EmailJS

**Account:** shahreyarr  
**Dashboard:** [dashboard.emailjs.com](https://dashboard.emailjs.com)

**Config** (in `src/lib/email.ts`):
```ts
const SERVICE_ID         = 'service_q6uwpyi';   // Gmail connected
const PUBLIC_KEY         = 'zSSbh_Za3vqogYyFo';
const TPL_ORDER_CONFIRM  = 'template_zioa4hl';   // Order confirmation
const TPL_ORDER_DISPATCH = 'template_a6657ed';   // Order dispatched
```

**Templates:**

| Template ID | Name | Trigger | Variables |
|---|---|---|---|
| `template_zioa4hl` | Order Confirmation | Customer places order | `customer_name`, `customer_email`, `order_id`, `order_items`, `order_total`, `delivery_address` |
| `template_a6657ed` | Order Dispatched | Admin marks order as "Shipped" | `customer_name`, `customer_email`, `order_id`, `order_items`, `delivery_address`, `tracking_id` |

**Free Tier:** 200 emails/month — no credit card required.

---

### 4. Razorpay

**Dashboard:** [razorpay.com/dashboard](https://razorpay.com/dashboard)

Set your Razorpay Live Key from:  
**Admin Panel → Settings → Social → Razorpay Live Key**

Format: `rzp_live_xxxxxxxxxxxx`

---

## 🚀 Local Development

### Prerequisites
- Node.js v20+ (use `nvm install 20 && nvm use 20`)
- Firebase CLI (`npm install -g firebase-tools`)

### Setup

```bash
# Clone the repo
git clone https://github.com/Shahreyaarr/shahreyarr_blog_platform.git
cd shahreyarr_blog_platform

# Install dependencies
npm install

# Start dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## 🏗️ Build & Deploy

```bash
# Build for production
npm run build

# Login to Firebase (first time only)
firebase login

# Deploy to Firebase Hosting
firebase deploy
```

**Live URLs after deploy:**
- `https://shareyarr-blog.web.app`
- `https://shahreyarr.com` (custom domain via Hostinger DNS)

---

## 🔐 Admin Panel

**URL:** `/admin-login`

**Credentials:**
```
Username: Alaska
Password: DubAi@687
```

### Admin Features

| Section | What you can do |
|---|---|
| **Dashboard** | View stats — blogs, gallery, orders, messages |
| **Blog & Vlogs** | Create/edit/delete posts with rich content blocks. Support for YouTube vlogs |
| **Gallery** | Upload photos directly (Cloudinary), manage categories |
| **Videos** | Add YouTube video links for homepage video section |
| **Destinations** | Add travel destinations with hero image + gallery |
| **Countries** | Add countries visited with photos |
| **Journeys** | Create upcoming journey listings |
| **Shop** | Add/edit products with multiple images, manage stock |
| **Orders** | View all orders, update status, send dispatch emails with tracking |
| **Live Chat** | Real-time chat with website visitors, send images + voice notes + video calls |
| **Messages** | View and reply to contact form submissions |
| **Settings** | Update site name, hero images, about text, profile photo, social links, stats, Razorpay key |

---

## 💬 Live Chat System

Built on **Firebase Realtime Database**.

**Data path:** `chat/{sessionId}/`

**Structure:**
```
chat/
  {sessionId}/
    name: "User Name"
    email: "user@email.com"
    lastMsg: "Hello"
    lastTs: 1234567890
    unread: 1
    msgs/
      {pushId}/
        type: "text" | "image" | "audio" | "video_call"
        text: "Hello"        # for text messages
        url: "https://..."   # for image/audio/video_call
        by: "u" | "a"        # u = user, a = admin
        ts: 1234567890
        read: false
```

**Features:**
- Text messages
- Image upload (via Cloudinary)
- Voice notes (recorded in browser, uploaded to Cloudinary)
- Video calls (via Jitsi Meet — free, no account needed)
- Double tick (grey = sent, blue = read)
- Unread count badge
- Notification sound + haptic vibration (only after user first opens chat)
- Admin notification sound (only for new messages, not on page load)

---

## 📧 Email System

### Order Confirmation
**Triggered:** Automatically when Razorpay payment succeeds in `CartPage.tsx`

```ts
await sendOrderConfirmation({
  orderId, customerName, customerEmail, items, total, address
});
```

### Dispatch Email
**Triggered:** When admin changes order status to **"Shipped"** in `AdminOrders.tsx`

```ts
await sendOrderDispatched({
  orderId, customerName, customerEmail, items, address, trackingId
});
```

Admin can also manually resend with a new tracking ID using the **"Resend Email"** button.

---

## 🖼️ Image Upload System

Reusable `ImageUpload` component in `src/components/ImageUpload.tsx`.

**Single image upload:**
```tsx
<ImageUpload
  value={form.imageUrl}
  onChange={url => setForm({...form, imageUrl: url})}
  folder="sahr_gallery"
  label="Photo"
  previewClass="h-40 w-full"
/>
```

**Multiple image upload:**
```tsx
<MultiImageUpload
  values={form.images}
  onChange={urls => setForm({...form, images: urls})}
  folder="sahr_shop"
  label="Product Images"
  max={8}
/>
```

Both components support:
- Direct file upload (click to browse)
- URL paste option
- Upload progress bar
- Image preview with delete button

---

## 🌐 Domain Setup

**Registrar:** Hostinger  
**DNS Records required:**

| Type | Name | Value |
|---|---|---|
| A | @ | 199.36.158.100 |
| TXT | @ | hosting-site=shareyarr-blog |
| CNAME | www | shahreyarr.com |

---

## 📦 Firestore Collections

| Collection | Documents contain |
|---|---|
| `blogs` | title, slug, excerpt, content[], featuredImage, category, country, tags[], isPublished, youtubeUrl, isVlog |
| `gallery` | title, url, caption, category, location, isFeatured |
| `gallery_categories` | name, description, coverImage |
| `destinations` | name, country, state, type, description, heroImage, images[], sections[], isVisited |
| `countries` | name, code, description, images[], isVisited, visitDate |
| `journeys` | title, description, startDate, endDate, maxPeople, price, image, registrations[] |
| `products` | name, description, price, originalPrice, images[], category, stock, isActive |
| `orders` | orderId, items[], total, customer{}, status, paymentId |
| `messages` | name, email, subject, message, reply, isRead |
| `videos` | title, youtubeUrl, thumbnail, order, isActive |
| `settings` | siteName, tagline, heroTitle, heroImages[], aboutText, aboutImage, email, location, instagram, youtube, statsKm, statsCountries, razorpayKey |

---

## 🔄 Updating the Project

After making changes locally:

```bash
npm run build
firebase deploy
```

To push code to GitHub:

```bash
git add -A
git commit -m "your message"
git push origin main
```

---

## 📝 Environment Notes


## 🔑 Environment Variables

Admin credentials are stored in a `.env` file — **never committed to Git**.

```bash
# Copy the example file
cp .env.example .env

# Edit with your credentials
VITE_ADMIN_USER=Alaska
VITE_ADMIN_PASS=DubAi@687
```

> ⚠️ `.env` is in `.gitignore` — it will never be pushed to GitHub.  
> `.env.example` is safe to commit — it has no real values.


> Note: Firebase, Cloudinary and EmailJS keys are intentionally public (frontend-safe). Only admin credentials need to be in .env.

---

No `.env` file needed for Firebase/Cloudinary/EmailJS — all those keys are embedded in source files:
- Firebase keys are public (safe for frontend)
- Cloudinary unsigned preset is intentionally public
- EmailJS public key is safe for frontend use
- Razorpay key is set via Admin Panel (stored in Firestore)

---

## 👤 Author

**Shahreyarr**  
Travel Photographer · Content Creator  
📸 [instagram.com/shahreyarr._](https://instagram.com/shahreyarr._)  
🌐 [shahreyarr.com](https://shahreyarr.com)  
📧 travelwithshahreyarr@gmail.com

---

## 📄 License

Private project — all rights reserved © 2026 Sahr E Yaar
