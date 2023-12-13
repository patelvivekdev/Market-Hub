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
	addProductReview,
	getTopProducts,
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

// Top products route
router.route('/top').get(getTopProducts);

// Product route
router
	.route('/:id')
	.get(getProductById)
	.put(protect, adminOrVendor, updateProduct)
	.delete(protect, adminOrVendor, deleteProduct);

// Change product image
router.route('/:id/image').put(protect, vendor, uploader, changeProductImage);

// Add review to product
router.route('/:id/review').post(protect, addProductReview);

// get all products by category id
router.route('/category/:id').get(getProductsByCategory);

// get all products by vendor id
router.route('/vendor/:id').get(getProductsByVendor);

export default router;
