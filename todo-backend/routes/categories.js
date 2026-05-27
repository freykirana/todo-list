import express from 'express';
import { getCategories, createCategory } from '../controllers/categoryController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes are protected with authMiddleware
router.use(authMiddleware);

// Get all categories
router.get('/', getCategories);

// Create new category
router.post('/', createCategory);

export default router;
