# VRUKSHA — Farm To Home Premium E-Commerce Platform

A production-ready, full-stack, responsive e-commerce platform for **VRUKSHA** ("Farm To Home"), a premium Indian D2C brand specializing in 100% farm-sourced, natural food and botanical products.

![VRUKSHA Brand](https://images.unsplash.com/photo-1590779033100-9f60a05a013d?auto=format&fit=crop&w=1200&q=80)

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
