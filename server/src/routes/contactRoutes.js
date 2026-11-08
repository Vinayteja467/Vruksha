import express from 'express';
import { submitContactInquiry, getContactInquiries } from '../controllers/contactController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', submitContactInquiry);
router.get('/', protect, adminOnly, getContactInquiries);

export default router;
