import express from 'express';

import { uploader } from '../middleware/uploadMiddleware.js';

// import from Product Controller
import {
	getProducts,
	getProductById,
	createProduct,
	updateProduct,
	deleteProduct,
	changeProductImage,
	getProductsByVendor,
	getProductsByCategory,
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
router
	.route('/:id')
	.get(getProductById)
	.put(protect, adminOrVendor, updateProduct)
	.delete(protect, adminOrVendor, deleteProduct);

// Change product image
router.route('/:id/image').put(protect, vendor, uploader, changeProductImage);

// get all products by category id
router.route('/category/:id').get(getProductsByCategory);

// get all products by vendor id
router.route('/vendor/:id').get(getProductsByVendor);

export default router;
