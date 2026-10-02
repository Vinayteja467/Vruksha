import { inMemoryStore } from '../config/inMemoryStore.js';
import { Order } from '../models/Order.js';
import { Product } from '../models/Product.js';
import { User } from '../models/User.js';
import { BulkInquiry } from '../models/BulkInquiry.js';
import { isConnectedToMongo } from '../config/db.js';

export const getDashboardStats = async (req, res, next) => {
  try {
    if (isConnectedToMongo) {
      const orders = await Order.find();
      const products = await Product.find();
      const users = await User.find({ role: 'user' });
      const bulkInquiries = await BulkInquiry.find();

      const totalSales = orders.reduce((sum, o) => sum + (o.paymentStatus === 'paid' ? o.total : 0), 0);
      const lowStock = products.filter(p => p.stock < 50).length;
      const pendingBulk = bulkInquiries.filter(b => b.status === 'Pending').length;

      return res.json({
        success: true,
        stats: {
          totalSales: Math.round(totalSales),
          totalOrders: orders.length,
          totalCustomers: users.length,
          totalProducts: products.length,
          lowStock,
          pendingBulk,
          recentOrders: orders.slice(0, 5),
          salesTrend: [
            { month: 'May', sales: 48000 },
            { month: 'Jun', sales: 62000 },
            { month: 'Jul', sales: 79000 },
            { month: 'Aug', sales: 94000 },
            { month: 'Sep', sales: 112000 },
            { month: 'Oct', sales: 135000 }
          ]
        }
      });
    }

    const stats = inMemoryStore.getAdminStats();
    res.json({ success: true, stats });
  } catch (err) {
    next(err);
  }
};

export const getCustomers = async (req, res, next) => {
  try {
    if (isConnectedToMongo) {
      const users = await User.find({ role: 'user' }).select('-password');
      return res.json({ success: true, customers: users });
    }

    const customers = inMemoryStore.users
      .filter(u => u.role !== 'admin')
      .map(({ password, ...u }) => ({
        ...u,
        totalOrders: inMemoryStore.orders.filter(o => o.user === u.id).length,
        totalSpent: inMemoryStore.orders
          .filter(o => o.user === u.id)
          .reduce((sum, o) => sum + o.total, 0)
      }));

    res.json({ success: true, customers });
  } catch (err) {
    next(err);
  }
};
