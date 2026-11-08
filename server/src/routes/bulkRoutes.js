import express from 'express';
import { submitInquiry, getInquiries, updateInquiryStatus } from '../controllers/bulkController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', submitInquiry);
router.get('/', protect, adminOnly, getInquiries);
router.put('/:id/status', protect, adminOnly, updateInquiryStatus);

export default router;
