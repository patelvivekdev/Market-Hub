import Product from '../models/productModel.js';
import asyncHandler from 'express-async-handler';

// Create Endpoint to get all products
// @route GET /api/v1/products

const getProducts = asyncHandler(async (req, res) => {
	const products = await Product.find({}).populate('vendor');
	res.json(products);
});

// Create Endpoint to get single product
// @route GET /api/v1/products/:id

const getProductById = asyncHandler(async (req, res) => {
	const product = await Product.findById(req.params.id);
	if (product) {
		res.json(product);
	} else {
		res.status(404).json({
			message: 'Product not found',
		});
		throw new Error('--> Error: Product not found');
	}
});

export { getProducts, getProductById };
