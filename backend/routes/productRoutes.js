import express from 'express';

// import from Product Controller
import {
	getProducts,
	getProductById,
	createProduct,
} from '../controllers/productController.js';

import {
	protect,
	admin,
	adminOrVendor,
	vendor,
} from '../middleware/authMiddleware.js';
import { uploader } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Base route
router.route('/').get(getProducts).post(adminOrVendor, uploader, createProduct);

// Product route
router.route('/:id').get(getProductById);

// Edit product route
// router.route('/:id/edit').put(protect, adminOrVendor, editProduct);

// Delete product route
// router.route('/:id').delete(protect, adminOrVendor, deleteProduct);

export default router;
