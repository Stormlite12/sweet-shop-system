import express from 'express';
import {
  getAllSweets,
  createSweet,
  searchSweets,
  getSweetById,
  updateSweet,
  deleteSweet,
  purchaseSweet,
  restockSweet
} from '../controllers/sweetController.js';
import { authenticateToken } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/admin.js';

const router = express.Router();

// Public routes (NO authentication required for viewing)
router.get('/', getAllSweets);
router.get('/search', searchSweets);
router.get('/:id', getSweetById);

// Purchase requires authentication
router.post('/:id/purchase', authenticateToken, purchaseSweet);
router.post('/:id/restock', authenticateToken, requireAdmin, restockSweet);

// Admin only routes
router.post('/', authenticateToken, requireAdmin, createSweet);
router.put('/:id', authenticateToken, requireAdmin, updateSweet);
router.delete('/:id', authenticateToken, requireAdmin, deleteSweet);

export default router;