import express from 'express';
import {
  getLeads,
  createLead,
  updateLeadStatus,
  deleteLead,
} from '../controllers/leadController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/').get(getLeads).post(createLead);
router.route('/:id').put(updateLeadStatus).delete(deleteLead);

export default router;
