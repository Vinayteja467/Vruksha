import mongoose from 'mongoose';

const bulkInquirySchema = new mongoose.Schema({
  name: { type: String, required: true },
  company: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  product: { type: String, required: true },
  requiredQuantity: { type: String, required: true },
  packagingPreference: { type: String, default: 'Standard Bulk Packaging' },
  location: { type: String, required: true },
  message: { type: String, default: '' },
  status: { type: String, default: 'Pending', enum: ['Pending', 'Contacted', 'Quoted', 'Closed'] },
  createdAt: { type: Date, default: Date.now }
});

export const BulkInquiry = mongoose.models.BulkInquiry || mongoose.model('BulkInquiry', bulkInquirySchema);
