import express from 'express';

// import from Category Controller
import {
	getCategories,
	getCategoryById,
	createCategory,
	updateCategory,
	deleteCategory,
} from '../controllers/categoryController.js';

import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Base route
router.route('/').get(getCategories).post(protect, admin, createCategory);

// route
router
	.route('/:id')
	.get(getCategoryById)
	.put(protect, admin, updateCategory)
	.delete(protect, admin, deleteCategory);

export default router;
