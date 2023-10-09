import express from 'express';

// import from Product Controller
import {
	getProducts,
	getProductById,
} from '../controllers/productController.js';

import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Base route
router.route('/').get(getProducts);

// Product route
router.route('/:id').get(getProductById);

export default router;
