import express from 'express';

// import from Product Controller
import {
	getProducts,
	getProductById,
} from '../controllers/productController.js';

import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Base route
router.route('/').get(protect, getProducts);

// Product route
router.route('/:id').get(protect, getProductById);

export default router;
