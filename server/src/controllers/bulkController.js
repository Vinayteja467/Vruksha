import { inMemoryStore } from '../config/inMemoryStore.js';
import { BulkInquiry } from '../models/BulkInquiry.js';
import { isConnectedToMongo } from '../config/db.js';

export const submitInquiry = async (req, res, next) => {
  try {
    const { name, company, email, phone, product, requiredQuantity, packagingPreference, location, message } = req.body;

    if (!name || !company || !email || !phone || !product || !requiredQuantity || !location) {
      return res.status(400).json({ success: false, message: 'Please fill out all required fields' });
    }

    if (isConnectedToMongo) {
      const inquiry = await BulkInquiry.create({
        name,
        company,
        email,
        phone,
        product,
        requiredQuantity,
        packagingPreference,
        location,
        message
      });
      return res.status(201).json({ success: true, inquiry, message: 'Bulk quote inquiry submitted successfully' });
    } else {
      const inquiry = inMemoryStore.createBulkInquiry({
        name,
        company,
        email,
        phone,
        product,
        requiredQuantity,
        packagingPreference,
        location,
        message
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
