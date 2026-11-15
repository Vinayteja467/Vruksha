import { ContactInquiry } from '../models/ContactInquiry.js';
import { inMemoryStore } from '../config/inMemoryStore.js';
import { isConnectedToMongo } from '../config/db.js';

export const submitContactInquiry = async (req, res, next) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Name, email, and message are required' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email address' });
    }

    let cleanPhone = '';
    if (phone && phone.trim()) {
      cleanPhone = phone.trim().replace(/[\s-]/g, '');
      if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
        return res.status(400).json({ success: false, message: 'Please provide a valid 10-digit Indian phone number' });
      }
    }

    const referenceId = `VRK-INQ-${Math.floor(100000 + Math.random() * 900000)}`;

    if (isConnectedToMongo) {
      const inquiry = await ContactInquiry.create({
        referenceId,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: cleanPhone,
        message: message.trim(),
        status: 'New'
      });

      return res.status(201).json({
        success: true,
        referenceId,
        message: 'Your inquiry has been successfully received by customer support.',
        inquiry
      });
    } else {
      const inquiry = {
        id: `inq-${Date.now()}`,
        referenceId,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: cleanPhone,
        message: message.trim(),
        status: 'New',
        createdAt: new Date().toISOString()
      };
      if (!inMemoryStore.contactInquiries) {
        inMemoryStore.contactInquiries = [];
      }
      inMemoryStore.contactInquiries.push(inquiry);

      return res.status(201).json({
        success: true,
        referenceId,
        message: 'Your inquiry has been successfully received by customer support.',
        inquiry
      });
    }
  } catch (err) {
    next(err);
  }
};

export const subscribeNewsletter = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email || !email.trim()) {
      return res.status(400).json({ success: false, message: 'Email address is required' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email address' });
    }

    const referenceId = `VRK-SUB-${Math.floor(100000 + Math.random() * 900000)}`;

    if (isConnectedToMongo) {
      await ContactInquiry.findOneAndUpdate(
        { email: cleanEmail },
        {
          referenceId,
          name: 'Newsletter Subscriber',
          email: cleanEmail,
          phone: '',
          message: 'Subscribed to VRUKSHA seasonal offers and newsletter',
          status: 'Subscribed'
        },
        { upsert: true, new: true }
      );
    } else {
      if (!inMemoryStore.contactInquiries) inMemoryStore.contactInquiries = [];
      const existing = inMemoryStore.contactInquiries.find(c => c.email === cleanEmail);
      if (!existing) {
        inMemoryStore.contactInquiries.push({
          id: `sub-${Date.now()}`,
          referenceId,
          name: 'Newsletter Subscriber',
          email: cleanEmail,
          phone: '',
          message: 'Subscribed to VRUKSHA seasonal offers and newsletter',
          status: 'Subscribed',
          createdAt: new Date().toISOString()
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Thank you for subscribing! Your 10% coupon code is VRUKSHA10',
      coupon: 'VRUKSHA10'
    });
  } catch (err) {
    next(err);
  }
};

export const getContactInquiries = async (req, res, next) => {
  try {
    if (isConnectedToMongo) {
      const inquiries = await ContactInquiry.find().sort({ createdAt: -1 });
      return res.json({ success: true, inquiries });
    }
    res.json({ success: true, inquiries: inMemoryStore.contactInquiries || [] });
  } catch (err) {
    next(err);
  }
};
