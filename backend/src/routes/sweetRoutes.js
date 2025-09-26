import express from 'express';
import {
  getAllSweets,
  createSweet,
  searchSweets,
  getSweetById,
  updateSweet,
  deleteSweet,
  purchaseSweet,
  restockSweet,
  upload,
  uploadImage
} from '../controllers/sweetController.js';
import { authenticateToken } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/admin.js';

const router = express.Router();

// Public routes (require authentication)
router.get('/', authenticateToken, getAllSweets);
router.get('/search', authenticateToken, searchSweets);
router.get('/:id', authenticateToken, getSweetById);

// Image upload route
router.post('/upload', authenticateToken, requireAdmin, upload.single('image'), uploadImage);

// Inventory routes
router.post('/:id/purchase', authenticateToken, purchaseSweet);           // Any user can purchase
router.post('/:id/restock', authenticateToken, requireAdmin, restockSweet); // Admin only

// Admin only routes
router.post('/', authenticateToken, requireAdmin, createSweet);
router.put('/:id', authenticateToken, requireAdmin, updateSweet);
router.delete('/:id', authenticateToken, requireAdmin, deleteSweet);

export default router;