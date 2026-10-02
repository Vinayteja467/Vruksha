# Vruksha — Farm To Home

A production-ready, full-stack, responsive e-commerce platform for **VRUKSHA** ("Farm To Home"), a premium Indian D2C brand specializing in 100% farm-sourced, natural food and botanical products.

![VRUKSHA Brand](https://images.unsplash.com/photo-1590779033100-9f60a05a013d?auto=format&fit=crop&w=1200&q=80)

---

## 🌟 Features & Highlights

- **Visual Brand & Aesthetics**:
  - Premium Indian D2C botanical visual identity with Deep Forest Green, Fresh Leaf Green, Warm Cream, and Earthy Sand tones.
  - Serif typography with Playfair Display and modern UI readability with Plus Jakarta Sans.
- **12 Farm-Sourced Sample Powders**:
  - Beetroot Powder, Moringa Leaf Powder, Wild Amla Powder, Sun-Dried Ginger Powder, Raw Green Banana Powder, Sweet Carrot Powder, Tender Spinach Powder, Zesty Lemon Powder, Curry Leaf Powder, Creamy Coconut Powder, Sun-Ripened Tomato Powder, Sweet Potato Powder.
  - Complete nutritional tables, culinary usage guides, storage tips, and size variants (`100g`, `150g`, `250g`, `500g`, `1kg`).
- **Interactive Homepage (12 Premium Sections)**:
  1. **Hero**: Headline, CTAs, floating product cards, Framer Motion animations.
  2. **Trust Bar**: 4 badges (Quality Ingredients, Carefully Processed, Secure Packaging, Fast Delivery).
  3. **Shop by Category**: 5 cards (Fruit, Vegetable, Leafy, Wellness, Popular Combos).
  4. **Best Sellers**: Interactive product cards with size badges, quick add, and wishlist toggle.
  5. **Why PureHarvest?**: Editorial split-screen showcasing ethical sourcing and zero additives.
  6. **Product Spotlight**: Beetroot Powder split-screen showcase with benefits, recipes, and direct cart add.
  7. **Build Your Box**: Interactive custom bundle builder (select 3+ products, calculate dynamic bundle discount up to 20%, live savings display, one-click add to cart).
  8. **How It Works**: 4-step chronological timeline (Select -> Order -> Pack -> Enjoy).
  9. **Bulk Orders (B2B)**: Targeted section for cafes, bakeries, food brands with package sizes (1kg, 5kg, 10kg, 25kg) and quote CTAs.
  10. **Customer Reviews**: Testimonial carousel with verified purchase badges and star ratings.
  11. **FAQ**: 8 animated accordions answering powder storage, shelf-life, COD, return policy, and bulk ordering.
  12. **Newsletter**: 10% instant discount incentive on first purchase.
- **E-Commerce Customer Journey**:
  - Global Search Modal with live autocomplete suggestions.
  - Faceted Catalog Filter: Price slider, ratings, package sizes, categories, and in-stock filters.
  - Slide-Over Cart Drawer & Full Cart Page with real-time Free Shipping progress bar (threshold ₹499).
  - Discount Coupon Engine (`PURE10`, `WELCOME20`, `FREESHIP`).
  - One-Page Indian Checkout with PIN-code validation, address persistence, and payment options (Razorpay, UPI, Credit/Debit Card, Net Banking, and COD).
  - Order Confirmation screen with celebration confetti and direct tracking link.
  - User Account Dashboard with orders, saved addresses, wishlist, and profile management.
  - Live 6-Stage Fulfillment Timeline (Placed → Confirmed → Packed → Shipped → Out for Delivery → Delivered).
  - B2B Wholesale Portal with quantity selection (5kg to 50kg+), quote inquiry submission, and dynamic WhatsApp chat builder.
  - Farm-to-Pouch illustrated 8-stage production journey.
  - Full Admin Console: Sales velocity charts, Product management (CRUD, stock, sizes), Order status transitions, Customers list, Categories, Coupons, Review moderation, and Bulk inquiries.
  - Floating WhatsApp Widget with pre-filled dynamic messages.

---

## 🛠️ Technology Stack

- **Frontend**:
  - React 18 + Vite
  - Tailwind CSS + Custom Design System
  - Framer Motion (Page and component micro-interactions)
  - Lucide React Icons
  - React Router DOM v6
  - Canvas Confetti
- **Backend**:
  - Node.js & Express.js REST APIs
  - Dual-Mode Persistence: MongoDB Atlas via Mongoose + Built-in zero-config In-Memory Engine
  - JWT Authentication + bcryptjs password hashing
  - Razorpay integration structure
  - Cloudinary upload architecture
  - CORS, Dotenv, error handling middlewares

---

## 🚀 Getting Started

### 1. Installation

From the project root:
```bash
# Install root, backend and frontend dependencies
npm run install-all
```

Or individually:
```bash
cd server && npm install
cd ../client && npm install
```

### 2. Environment Configuration

The backend contains a `.env.example` file:
```env
PORT=5000
CLIENT_URL=http://localhost:3000
MONGO_URI=mongodb+srv://<user>:<password>@cluster0.example.mongodb.net/pureharvest?retryWrites=true&w=majority
JWT_SECRET=pureharvest_super_secure_jwt_secret_key_2026_d2c
JWT_EXPIRES_IN=7d
RAZORPAY_KEY_ID=rzp_test_placeholder_key_id
RAZORPAY_KEY_SECRET=rzp_test_placeholder_secret
WHATSAPP_PHONE_NUMBER=919876543210
```

> **Note on Zero-Config Database:**
> If `MONGO_URI` is omitted or cannot be reached, the server boots seamlessly into its **In-Memory Engine** pre-seeded with all 12 products, categories, sample user, demo admin, reviews, and sample orders. Everything is 100% interactive and testable immediately!

### 3. Run in Development

```bash
# Run backend (port 5000) and frontend (port 3000) concurrently:
npm run dev
```

Or in separate terminal tabs:
```bash
# Terminal 1: Backend
npm run server

# Terminal 2: Frontend
npm run client
```

Open your browser at `http://localhost:3000`.

---

## 🔑 Demo Accounts

For immediate testing, use the 1-click demo buttons on the Login page or log in with:

| Role | Email | Password |
|---|---|---|
| **Administrator** | `admin@pureharvest.in` | `Admin@123` |
| **Customer** | `user@pureharvest.in` | `User@123` |

---

## 🚢 Deployment Guide

### Deploy Frontend (Vercel)
1. Push code to your GitHub repository.
2. In Vercel, import the repo and set the Root Directory to `client`.
3. Set the Framework Preset to `Vite`.
4. Add environment variable `VITE_API_URL` pointing to your deployed backend URL.
5. Click **Deploy**.

### Deploy Backend (Render / Railway)
1. In Render, create a new **Web Service** connected to your repo.
2. Set Root Directory to `server`.
3. Build Command: `npm install`
4. Start Command: `npm start`
5. Configure Environment Variables (`PORT=5000`, `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`, `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`).
6. Click **Create Web Service**.

---

## 📄 License
© 2026 PUREHARVEST Naturals Pvt. Ltd. All rights reserved.
