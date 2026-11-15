import express from 'express';
import { submitContactInquiry, getContactInquiries, subscribeNewsletter } from '../controllers/contactController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', submitContactInquiry);
router.post('/newsletter', subscribeNewsletter);
router.get('/', protect, adminOnly, getContactInquiries);

export default router;
