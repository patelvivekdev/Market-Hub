import express from 'express';
import { uploader } from '../middleware/uploadMiddleware.js';

// import from Product Controller
import {
	getProducts,
	getProductById,
	createProduct,
	getProductsByVendor,
} from '../controllers/productController.js';

import {
	protect,
	admin,
	adminOrVendor,
	vendor,
} from '../middleware/authMiddleware.js';

const router = express.Router();

// Base route
router
	.route('/')
	.get(getProducts)
	.post(protect, vendor, uploader, createProduct);

// Product route
router.route('/:id').get(getProductById);

// Edit product route
// router.route('/:id/edit').put(protect, adminOrVendor, editProduct);

// Delete product route
// router.route('/:id').delete(protect, adminOrVendor, deleteProduct);

// get all products by vendor id
router.route('/vendor/:id').get(getProductsByVendor);

export default router;
