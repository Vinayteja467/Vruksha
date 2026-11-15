import { inMemoryStore } from '../config/inMemoryStore.js';
import { BulkInquiry } from '../models/BulkInquiry.js';
import { isConnectedToMongo } from '../config/db.js';

export const submitInquiry = async (req, res, next) => {
  try {
    const { name, company, email, phone, product, requiredQuantity, packagingPreference, location, message } = req.body;

    if (!name || !company || !email || !phone || !product || !requiredQuantity || !location) {
      return res.status(400).json({ success: false, message: 'Please fill out all required fields' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(String(email).trim())) {
      return res.status(400).json({ success: false, message: 'Please provide a valid business email address' });
    }

    const cleanPhone = String(phone).trim().replace(/[\s-]/g, '');
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      return res.status(400).json({ success: false, message: 'Please provide a valid 10-digit Indian mobile number' });
    }

    if (isConnectedToMongo) {
      const inquiry = await BulkInquiry.create({
        name: String(name).trim(),
        company: String(company).trim(),
        email: String(email).trim().toLowerCase(),
        phone: cleanPhone,
        product: String(product).trim(),
        requiredQuantity: String(requiredQuantity).trim(),
        packagingPreference: packagingPreference ? String(packagingPreference).trim() : '',
        location: String(location).trim(),
        message: message ? String(message).trim() : ''
      });
      return res.status(201).json({ success: true, inquiry, message: 'Bulk quote inquiry submitted successfully' });
    } else {
      const inquiry = inMemoryStore.createBulkInquiry({
        name: String(name).trim(),
        company: String(company).trim(),
        email: String(email).trim().toLowerCase(),
        phone: cleanPhone,
        product: String(product).trim(),
        requiredQuantity: String(requiredQuantity).trim(),
        packagingPreference: packagingPreference ? String(packagingPreference).trim() : '',
        location: String(location).trim(),
        message: message ? String(message).trim() : ''
      });
      return res.status(201).json({ success: true, inquiry, message: 'Bulk quote inquiry submitted successfully' });
    }
  } catch (err) {
    next(err);
  }
};

export const getInquiries = async (req, res, next) => {
  try {
    if (isConnectedToMongo) {
      const inquiries = await BulkInquiry.find().sort({ createdAt: -1 });
      return res.json({ success: true, inquiries });
    }
    res.json({ success: true, inquiries: inMemoryStore.getBulkInquiries() });
  } catch (err) {
    next(err);
  }
};

export const updateInquiryStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (isConnectedToMongo) {
      const updated = await BulkInquiry.findByIdAndUpdate(id, { status }, { new: true });
      return res.json({ success: true, inquiry: updated });
    } else {
      const inquiry = inMemoryStore.bulkInquiries.find(b => b.id === id);
      if (!inquiry) return res.status(404).json({ success: false, message: 'Inquiry not found' });
      inquiry.status = status;
      return res.json({ success: true, inquiry });
    }
  } catch (err) {
    next(err);
  }
};
