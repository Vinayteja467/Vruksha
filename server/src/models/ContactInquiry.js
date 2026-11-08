import mongoose from 'mongoose';

const contactInquirySchema = new mongoose.Schema({
  referenceId: { type: String, required: true, unique: true },
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  phone: { type: String, trim: true },
  message: { type: String, required: true },
  status: {
    type: String,
    enum: ['New', 'In Progress', 'Resolved', 'Closed'],
    default: 'New'
  },
  createdAt: { type: Date, default: Date.now }
});

export const ContactInquiry =
  mongoose.models.ContactInquiry || mongoose.model('ContactInquiry', contactInquirySchema);
