import { ContactInquiry } from '../models/ContactInquiry.js';
import { inMemoryStore } from '../config/inMemoryStore.js';
import { isConnectedToMongo } from '../config/db.js';

export const submitContactInquiry = async (req, res, next) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Name, email, and message are required' });
    }

    const referenceId = `VRK-INQ-${Math.floor(100000 + Math.random() * 900000)}`;

    if (isConnectedToMongo) {
      const inquiry = await ContactInquiry.create({
        referenceId,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone ? phone.trim() : '',
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
        phone: phone ? phone.trim() : '',
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
