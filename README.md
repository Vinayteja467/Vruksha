# VRUKSHA — Farm To Home Premium E-Commerce Platform

A production-ready, full-stack, responsive e-commerce platform for **VRUKSHA** ("Farm To Home"), a premium Indian D2C brand specializing in 100% farm-sourced, natural food and botanical products.

![VRUKSHA Brand](https://images.unsplash.com/photo-1590779033100-9f60a05a013d?auto=format&fit=crop&w=1200&q=80)

---

## 📋 Production Readiness Checklist (All 20 Photo Items Completed)

| # | Item | Status | Implementation Details |
|---|---|---|---|
| **1** | **Real Login & Logout** | ✅ Complete | JWT auth tokens, automatic token renewal, 401 interceptors, full state cleanup on logout (`AuthContext.jsx`, `authRoutes.js`). |
| **2** | **Password Reset** | ✅ Complete | Secure 6-digit OTP reset flow with 30-min expiry, dev OTP preview, and change password form (`ForgotPasswordPage.jsx`, `/api/auth/reset-password`). |
| **3** | **Email Verification** | ✅ Complete | Email verification flow, status badges, verification OTP endpoints, and dedicated verification page (`VerifyEmailPage.jsx`, `/api/auth/verify-email`). |
| **4** | **Loading States** | ✅ Complete | Skeleton loaders for product cards, orders, and tables, plus spinner and disabled states on all submit buttons (`Skeleton.jsx`). |
| **5** | **Empty States** | ✅ Complete | Beautiful reusable empty state displays for Cart, Orders, Wishlist, and Admin tables (`EmptyState.jsx`). |
| **6** | **Clear Error Messages** | ✅ Complete | Contextual toast notifications, descriptive server error payloads, and inline form error labels across all forms. |
| **7** | **Form Validation** | ✅ Complete | Real-time client-side validation for RFC emails, Indian 10-digit mobile numbers, password strength, and pincodes (`validation.js`). |
| **8** | **Rate Limiting** | ✅ Complete | In-memory sliding window rate limiter: 15 req/15min for auth routes, 120 req/min for general API (`rateLimiter.js`). |
| **9** | **Database Backups** | ✅ Complete | Automated CLI backup and restore scripts plus admin backup trigger (`npm run db:backup`, `server/scripts/backup.js`). |
| **10** | **Row Level Security** | ✅ Complete | Strict IDOR protection on orders, user profiles, and addresses; strict `adminOnly` guards on admin endpoints. |
| **11** | **API Keys Off Frontend** | ✅ Complete | Secrets (`JWT_SECRET`, `MONGO_URI`, `RAZORPAY_SECRET`) are strictly backend-only. Frontend uses `client/.env.example`. |
| **12** | **Mobile Layout** | ✅ Complete | 100% responsive design with sticky mobile bottom navigation bar (`MobileBottomNav.jsx`), touch-friendly 44px+ hit targets. |
| **13** | **Custom 404 Page** | ✅ Complete | Farm-to-home themed 404 page with quick category links and home navigation (`NotFoundPage.jsx`). |
| **14** | **Analytics Installed** | ✅ Complete | Event tracking engine for page views, `view_item`, `add_to_cart`, `begin_checkout`, `purchase`, and search (`analytics.js`). |
| **15** | **Error Tracking** | ✅ Complete | React `ErrorBoundary` with fallback screen and automatic client telemetry error reporting to `/api/error-log`. |
| **16** | **Privacy Policy Page** | ✅ Complete | Full legal privacy policy with DPDP compliance, cookies, payment processing, and data rights (`PrivacyPolicyPage.jsx`). |
| **17** | **Terms Page** | ✅ Complete | Comprehensive terms and conditions covering pricing, delivery, returns, and intellectual property (`TermsPage.jsx`). |
| **18** | **Delete Account Button** | ✅ Complete | "Danger Zone" in user settings with "Type DELETE" modal confirmation and backend endpoint (`DELETE /api/auth/delete-account`). |
| **19** | **Onboarding Flow** | ✅ Complete | Interactive welcome modal for first-time visitors with farm purity promise and coupon `WELCOME10` (`OnboardingModal.jsx`). |
| **20** | **Check Caption / Vercel Deploy** | ✅ Complete | Root `vercel.json` SPA configuration, Vercel Serverless Function bridge (`api/index.js`), and `client/vercel.json`. |

---

## 🌟 Key Features

- **Botanical Brand Aesthetics**: Forest green, warm cream, serif typography with Playfair Display.
- **12 Farm-Sourced Natural Powders**: Beetroot, Moringa, Wild Amla, Ginger, Green Banana, Carrot, Spinach, Lemon, Curry Leaf, Coconut, Tomato, Sweet Potato.
- **Interactive Bundle Builder**: "Build Your Box" with live dynamic discounts up to 20%.
- **One-Page Checkout**: Cash on Delivery and Razorpay online payments with signature verification.
- **Order Tracking**: 6-stage fulfillment progress tracker (`Placed` → `Confirmed` → `Packed` → `Shipped` → `Out for Delivery` → `Delivered`).
- **Admin Portal**: Sales metrics, low-stock warnings, order status management, coupon creation, customer directory, and backup triggers.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite 5, Tailwind CSS, Framer Motion, Lucide Icons, Canvas Confetti.
- **Backend**: Node.js, Express.js (ES modules), MongoDB Mongoose with fallback In-Memory Store, JWT, bcryptjs, Razorpay SDK.
- **Deployment**: Vercel (Root / Serverless / Client), Render, Railway.

---

## 🚀 Getting Started

### 1. Installation

```bash
# Install all workspace dependencies
npm run install-all
```

### 2. Environment Variables

Create `server/.env` based on `server/.env.example`:
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/vruksha?retryWrites=true&w=majority
JWT_SECRET=your_secure_random_jwt_secret_key_minimum_32_characters
JWT_EXPIRES_IN=7d
RAZORPAY_KEY_ID=rzp_test_placeholder_key_id
RAZORPAY_KEY_SECRET=rzp_test_placeholder_secret
WHATSAPP_PHONE_NUMBER=919573636998
```

> **Zero-Config In-Memory Fallback:**
> If `MONGO_URI` is omitted, the application runs seamlessly using its built-in in-memory database with pre-seeded products, users, coupons, and orders.

### 3. Run Locally

```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

---

## 💾 Database Backup & Disaster Recovery

```bash
# Create a timestamped JSON snapshot of all collections
npm run db:backup

# Restore from the latest snapshot
npm run db:restore
```

Snapshots are saved under `server/backups/`.

---

## 🚢 Deploy to Vercel (Latest Update)

### Option 1: Root Deployment (Recommended — 1 Click Fullstack)

1. Connect your GitHub repository to **Vercel**.
2. Leave the Root Directory as `./`.
3. Vercel automatically detects the root [`vercel.json`](file:///c:/Users/yadag/Desktop/Vruksha-main/vercel.json):
   - **Build Command**: `npm run build --prefix client`
   - **Output Directory**: `client/dist`
   - **API Serverless Function**: Automatically routed to [`api/index.js`](file:///c:/Users/yadag/Desktop/Vruksha-main/api/index.js)
4. Add your Production Environment Variables in the Vercel Dashboard:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `RAZORPAY_KEY_ID`
   - `RAZORPAY_KEY_SECRET`
5. Click **Deploy**.

### Option 2: Split Frontend Deployment (Client on Vercel, Backend on Render/Railway)

1. In Vercel, set Root Directory to `client`.
2. Framework preset: **Vite**.
3. Add Environment Variable:
   - `VITE_API_URL`: `https://your-backend-api.onrender.com`
4. Click **Deploy**.

---

## 🔑 Demo Credentials

| Role | Email | Password |
|---|---|---|
| **Administrator** | `admin@pureharvest.in` | `Admin@123` |
| **Customer** | `user@pureharvest.in` | `User@123` |

---

## 📄 License
© 2026 VRUKSHA Naturals Pvt. Ltd. All rights reserved.
