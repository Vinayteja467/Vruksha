import bcrypt from 'bcryptjs';
import { products as seedProducts, categories as seedCategories, coupons as seedCoupons, sampleReviews } from '../data/seedData.js';

class InMemoryStore {
  constructor() {
    this.users = [];
    this.products = [...seedProducts];
    this.categories = [...seedCategories];
    this.orders = [];
    this.coupons = [...seedCoupons];
    this.reviews = [...sampleReviews];
    this.bulkInquiries = [];

    this.initializeDefaults();
  }

  async initializeDefaults() {
    // Hash demo passwords
    const salt = await bcrypt.genSalt(10);
    const adminHash = await bcrypt.hash('Admin@123', salt);
    const userHash = await bcrypt.hash('User@123', salt);

    this.users = [
      {
        id: 'usr-admin-01',
        name: 'PureHarvest Admin',
        email: 'admin@pureharvest.in',
        phone: '9876543210',
        password: adminHash,
        role: 'admin',
        addresses: [
          {
            id: 'addr-01',
            fullName: 'HQ Admin Office',
            phone: '9876543210',
            house: 'No. 42, Green Orchard Estate',
            street: 'MG Road, Indiranagar',
            city: 'Bengaluru',
            state: 'Karnataka',
            pincode: '560038',
            isDefault: true
          }
        ],
        wishlist: ['beetroot-powder', 'moringa-leaf-powder'],
        createdAt: new Date().toISOString()
      },
      {
        id: 'usr-demo-02',
        name: 'Aarav Patel',
        email: 'user@pureharvest.in',
        phone: '9812345678',
        password: userHash,
        role: 'user',
        addresses: [
          {
            id: 'addr-02',
            fullName: 'Aarav Patel',
            phone: '9812345678',
            house: 'Flat 402, Lotus Residency',
            street: '14th Cross, Bandra West',
            city: 'Mumbai',
            state: 'Maharashtra',
            pincode: '400050',
            isDefault: true
          }
        ],
        wishlist: ['amla-powder'],
        createdAt: new Date().toISOString()
      }
    ];

    // Seed 2 initial sample orders
    this.orders = [
      {
        id: 'ord-1001',
        orderNumber: 'PH-ORD-94821',
        user: 'usr-demo-02',
        customerInfo: {
          fullName: 'Aarav Patel',
          email: 'user@pureharvest.in',
          phone: '9812345678'
        },
        shippingAddress: {
          house: 'Flat 402, Lotus Residency',
          street: '14th Cross, Bandra West',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400050'
        },
        items: [
          {
            product: 'prod-001',
            name: 'Pure Beetroot Powder',
            slug: 'beetroot-powder',
            image: 'https://images.unsplash.com/photo-1590779033100-9f60a05a013d?auto=format&fit=crop&w=800&q=80',
            size: '250g',
            price: 499,
            quantity: 1
          },
          {
            product: 'prod-002',
            name: 'Organic Moringa Leaf Powder',
            slug: 'moringa-leaf-powder',
            image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
            size: '150g',
            price: 319,
            quantity: 1
          }
        ],
        deliveryMethod: 'standard',
        paymentMethod: 'upi',
        paymentStatus: 'paid',
        paymentId: 'pay_UPI_9482181923',
        orderStatus: 'Shipped',
        subtotal: 818,
        shippingFee: 0,
        discountAmount: 81.8,
        couponApplied: 'PURE10',
        total: 736.2,
        timeline: [
          { status: 'Order Placed', date: '2026-09-28T10:30:00.000Z', description: 'Order confirmed and payment verified' },
          { status: 'Confirmed', date: '2026-09-28T11:00:00.000Z', description: 'Order confirmed by fulfillment team' },
          { status: 'Packed', date: '2026-09-28T16:45:00.000Z', description: 'Hygienically packed in protective eco-pouches' },
          { status: 'Shipped', date: '2026-09-29T09:15:00.000Z', description: 'Dispatched via Express Courier (AWB #DELHIVERY9832)' }
        ],
        createdAt: '2026-09-28T10:30:00.000Z'
      },
      {
        id: 'ord-1002',
        orderNumber: 'PH-ORD-94822',
        user: 'usr-demo-02',
        customerInfo: {
          fullName: 'Aarav Patel',
          email: 'user@pureharvest.in',
          phone: '9812345678'
        },
        shippingAddress: {
          house: 'Flat 402, Lotus Residency',
          street: '14th Cross, Bandra West',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400050'
        },
        items: [
          {
            product: 'prod-003',
            name: 'Wild Amla Powder',
            slug: 'amla-powder',
            image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80',
            size: '250g',
            price: 399,
            quantity: 2
          }
        ],
        deliveryMethod: 'standard',
        paymentMethod: 'cod',
        paymentStatus: 'pending',
        orderStatus: 'Confirmed',
        subtotal: 798,
        shippingFee: 0,
        discountAmount: 0,
        couponApplied: '',
        total: 798,
        timeline: [
          { status: 'Order Placed', date: '2026-10-01T14:10:00.000Z', description: 'Order placed via Cash on Delivery' },
          { status: 'Confirmed', date: '2026-10-01T15:00:00.000Z', description: 'Delivery address and phone verified' }
        ],
        createdAt: '2026-10-01T14:10:00.000Z'
      }
    ];

    // Sample initial bulk inquiries
    this.bulkInquiries = [
      {
        id: 'inq-001',
        name: 'Vikram Sengupta',
        company: 'Artisan Bakery Co.',
        email: 'vikram@artisanbakery.in',
        phone: '9822334455',
        product: 'Beetroot Powder & Sweet Potato Powder',
        requiredQuantity: '50 KG+',
        packagingPreference: '25 KG Kraft Drum with Double Poly Liner',
        location: 'Pune, Maharashtra',
        message: 'Looking for natural red food coloring powders for our sourdough and artisanal bread line. Please share lab COA and bulk pricing.',
        status: 'Contacted',
        createdAt: '2026-09-24T11:20:00.000Z'
      }
    ];
  }

  // User Operations
  async findUserByEmail(email) {
    return this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  async findUserById(id) {
    const user = this.users.find(u => u.id === id);
    if (!user) return null;
    const { password, ...safeUser } = user;
    return safeUser;
  }

  async createUser(userData) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);
    const newUser = {
      id: `usr-${Date.now()}`,
      name: userData.name,
      email: userData.email.toLowerCase(),
      phone: userData.phone || '',
      password: hashedPassword,
      role: 'user',
      addresses: [],
      wishlist: [],
      createdAt: new Date().toISOString()
    };
    this.users.push(newUser);
    const { password, ...safeUser } = newUser;
    return safeUser;
  }

  async updateUser(id, updates) {
    const index = this.users.findIndex(u => u.id === id);
    if (index === -1) return null;
    this.users[index] = { ...this.users[index], ...updates };
    const { password, ...safeUser } = this.users[index];
    return safeUser;
  }

  // Product Operations
  getProducts({ category, search, minPrice, maxPrice, rating, sort, inStock, limit, page = 1 }) {
    let list = [...this.products];

    if (category && category !== 'all') {
      const catLower = category.toLowerCase();
      list = list.filter(p => 
        p.categorySlug === catLower || 
        p.category.toLowerCase() === catLower ||
        (catLower === 'combos' && p.categorySlug === 'popular-combos')
      );
    }

    if (search && search.trim() !== '') {
      const q = search.toLowerCase().trim();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.ingredients.toLowerCase().includes(q)
      );
    }

    if (minPrice !== undefined && minPrice !== '') {
      list = list.filter(p => p.price >= Number(minPrice));
    }

    if (maxPrice !== undefined && maxPrice !== '') {
      list = list.filter(p => p.price <= Number(maxPrice));
    }

    if (rating !== undefined && rating !== '') {
      list = list.filter(p => p.rating >= Number(rating));
    }

    if (inStock === 'true' || inStock === true) {
      list = list.filter(p => p.stock > 0);
    }

    // Sorting
    switch (sort) {
      case 'price-asc':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        list.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        list.sort((a, b) => b.id.localeCompare(a.id));
        break;
      default: // featured
        list.sort((a, b) => (b.bestSeller ? 1 : 0) - (a.bestSeller ? 1 : 0));
        break;
    }

    const total = list.length;
    if (limit) {
      const start = (Number(page) - 1) * Number(limit);
      list = list.slice(start, start + Number(limit));
    }

    return { products: list, total, page: Number(page), totalPages: limit ? Math.ceil(total / Number(limit)) : 1 };
  }

  getProductBySlug(slug) {
    return this.products.find(p => p.slug === slug);
  }

  getProductById(id) {
    return this.products.find(p => p.id === id);
  }

  createProduct(data) {
    const priceNum = Number(data.price);
    const originalPriceNum = Number(data.originalPrice) || Math.round(priceNum * 1.25);

    let sizes = data.sizes;
    if (sizes && sizes.length > 0) {
      sizes = sizes.map((s, idx) => ({
        size: s.size,
        price: idx === 0 ? priceNum : Number(s.price),
        originalPrice: idx === 0 ? originalPriceNum : Number(s.originalPrice || s.price * 1.25),
        inStock: s.inStock !== false
      }));
    } else {
      sizes = [
        { size: '100g', price: priceNum, originalPrice: originalPriceNum, inStock: true }
      ];
    }

    const newProd = {
      ...data,
      id: `prod-${Date.now()}`,
      price: priceNum,
      originalPrice: originalPriceNum,
      sizes,
      slug: data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
      rating: data.rating || 5.0,
      reviewCount: data.reviewCount || 0,
      discount: originalPriceNum > priceNum ? Math.round(((originalPriceNum - priceNum) / originalPriceNum) * 100) : 0,
      createdAt: new Date().toISOString()
    };
    this.products.unshift(newProd);
    return newProd;
  }

  updateProduct(id, updates) {
    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) return null;

    let price = updates.price !== undefined ? Number(updates.price) : this.products[index].price;
    let originalPrice = updates.originalPrice !== undefined ? Number(updates.originalPrice) : (this.products[index].originalPrice || Math.round(price * 1.25));

    let sizes = updates.sizes || this.products[index].sizes;
    if (sizes && sizes.length > 0) {
      sizes = sizes.map((s, idx) => ({
        size: s.size,
        price: idx === 0 && updates.price !== undefined ? price : Number(s.price),
        originalPrice: idx === 0 && updates.originalPrice !== undefined ? originalPrice : Number(s.originalPrice || s.price * 1.25),
        inStock: s.inStock !== false
      }));
    } else {
      sizes = [
        { size: '100g', price, originalPrice, inStock: true }
      ];
    }

    const updated = {
      ...this.products[index],
      ...updates,
      price,
      originalPrice,
      sizes,
      discount: originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0
    };
    this.products[index] = updated;
    return updated;
  }

  deleteProduct(id) {
    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) return false;
    this.products.splice(index, 1);
    return true;
  }

  // Orders
  createOrder(orderData) {
    const orderNumber = `PH-ORD-${Math.floor(100000 + Math.random() * 900000)}`;
    const newOrder = {
      id: `ord-${Date.now()}`,
      orderNumber,
      timeline: [
        {
          status: 'Order Placed',
          date: new Date().toISOString(),
          description: orderData.paymentMethod === 'cod' ? 'Order placed with Cash on Delivery' : 'Payment authorized and verified'
        }
      ],
      orderStatus: 'Placed',
      createdAt: new Date().toISOString(),
      ...orderData
    };
    this.orders.unshift(newOrder);

    // Update stock levels
    if (orderData.items && Array.isArray(orderData.items)) {
      orderData.items.forEach(item => {
        const prod = this.products.find(p => p.id === item.product || p.slug === item.slug);
        if (prod) {
          prod.stock = Math.max(0, prod.stock - (item.quantity || 1));
        }
      });
    }

    return newOrder;
  }

  getOrdersByUser(userId) {
    return this.orders.filter(o => o.user === userId || (o.customerInfo && o.customerInfo.email === userId));
  }

  getOrderById(idOrOrderNum) {
    return this.orders.find(o => o.id === idOrOrderNum || o.orderNumber === idOrOrderNum);
  }

  getAllOrders() {
    return [...this.orders];
  }

  updateOrderStatus(orderId, status) {
    const order = this.orders.find(o => o.id === orderId || o.orderNumber === orderId);
    if (!order) return null;
    order.orderStatus = status;
    order.timeline.push({
      status,
      date: new Date().toISOString(),
      description: `Status transitioned to ${status}`
    });
    return order;
  }

  // Reviews
  getReviews(productId) {
    return this.reviews.filter(r => r.productId === productId || r.product === productId);
  }

  getAllReviews() {
    return [...this.reviews];
  }

  addReview(reviewData) {
    const newReview = {
      id: `rev-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      isApproved: true,
      verifiedPurchase: true,
      ...reviewData
    };
    this.reviews.unshift(newReview);
    return newReview;
  }

  // Coupons
  getCoupons() {
    return this.coupons.filter(c => c.isActive);
  }

  validateCoupon(code, orderSubtotal) {
    const c = this.coupons.find(cp => cp.code.toUpperCase() === code.toUpperCase() && cp.isActive);
    if (!c) {
      return { valid: false, message: 'Invalid or expired coupon code' };
    }
    if (orderSubtotal < c.minOrderAmount) {
      return { valid: false, message: `Minimum order amount of ₹${c.minOrderAmount} required for ${c.code}` };
    }
    let discount = 0;
    if (c.discountPercent) {
      discount = Math.round((orderSubtotal * c.discountPercent) / 100);
    }
    return {
      valid: true,
      coupon: c,
      discountAmount: discount,
      freeShipping: !!c.freeShipping,
      message: `Coupon ${c.code} applied successfully!`
    };
  }

  createCoupon(data) {
    const newCoupon = {
      ...data,
      code: data.code.toUpperCase(),
      isActive: true,
      createdAt: new Date().toISOString()
    };
    this.coupons.push(newCoupon);
    return newCoupon;
  }

  // Bulk Inquiries
  createBulkInquiry(data) {
    const inq = {
      id: `inq-${Date.now()}`,
      status: 'Pending',
      createdAt: new Date().toISOString(),
      ...data
    };
    this.bulkInquiries.unshift(inq);
    return inq;
  }

  getBulkInquiries() {
    return [...this.bulkInquiries];
  }

  // Admin Metrics
  getAdminStats() {
    const totalSales = this.orders.reduce((sum, o) => sum + (o.paymentStatus === 'paid' ? o.total : 0), 0);
    const totalOrders = this.orders.length;
    const totalCustomers = this.users.filter(u => u.role !== 'admin').length;
    const totalProducts = this.products.length;
    const lowStock = this.products.filter(p => p.stock < 50).length;
    const pendingBulk = this.bulkInquiries.filter(b => b.status === 'Pending').length;

    return {
      totalSales: Math.round(totalSales),
      totalOrders,
      totalCustomers: totalCustomers || 12, // demo representation
      totalProducts,
      lowStock,
      pendingBulk,
      recentOrders: this.orders.slice(0, 5),
      salesTrend: [
        { month: 'May', sales: 48000 },
        { month: 'Jun', sales: 62000 },
        { month: 'Jul', sales: 79000 },
        { month: 'Aug', sales: 94000 },
        { month: 'Sep', sales: 112000 },
        { month: 'Oct', sales: 135000 }
      ]
    };
  }
}

export const inMemoryStore = new InMemoryStore();
