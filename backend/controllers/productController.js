import asyncHandler from 'express-async-handler';
import Product from '../models/productModel.js';

import { uploadImage, deleteImage } from '../utils/firebase.js';

// Create Endpoint to get all products
// @route GET /api/v1/products

const getProducts = asyncHandler(async (req, res) => {
	const products = await Product.find({}).populate('vendor');
	res.json(products);
});

// Create Endpoint to get single product
// @route GET /api/v1/products/:id

const getProductById = asyncHandler(async (req, res) => {
	const product = await Product.findById(req.params.id).populate('vendor');
	if (product) {
		res.json(product);
	} else {
		res.status(404).json({
			message: 'Product not found',
		});
		throw new Error('--> Error: Product not found');
	}
});

// Create Endpoint to create a product
// @route POST /api/v1/products
const createProduct = asyncHandler(async (req, res) => {
	const { name, price, vendor, category, countInStock, description } =
		req.body;

	// Validate data
	if (
		!name ||
		!price ||
		!vendor ||
		!category ||
		!countInStock ||
		!description
	) {
		return res.status(400).json({
			message: 'Please enter all fields',
		});
	}
	// Check if product already exists in the database Check with name and vendor
	const productExists = await Product.findOne({ name, vendor });

	if (productExists) {
		return res.status(400).json({
			message: 'Product already exists',
		});
	}

	// Save image to firebase storage and get URL if product does not exist
	let image_url = '';
	const file = req.file;

	if (file) {
		image_url = await uploadImage(file);
	}

	// Create product
	const product = new Product({
		name,
		price,
		vendor,
		category,
		countInStock,
		description,
	});

	if (image_url) {
		product.image = image_url;
	} else {
		// Set default image
		product.image =
			'https://firebasestorage.googleapis.com/v0/b/market-hub-1937e.appspot.com/o/default.jpg?alt=media&token=4222dffe-31c0-47de-9c1d-37b2e290dd7c';
	}

	// Save product to the database
	try {
		const createdProduct = await product.save();
		res.status(201).json(createdProduct);
	} catch (error) {
		// Handle error appropriately
		if (image_url) {
			await deleteImage(file.originalname);
		}
		res.status(500).json({ message: 'Failed to save product' });
	}
});

// Create Endpoint to update a product
// @route PUT /api/v1/products/:id

const updateProduct = asyncHandler(async (req, res) => {
	const { name, price, vendor, category, countInStock, description } =
		req.body;

	// Validate data
	if (
		!name ||
		!price ||
		!vendor ||
		!category ||
		!countInStock ||
		!description
	) {
		return res.status(400).json({
			message: 'Please enter all fields',
		});
	}

	// Check if product exists
	const product = await Product.findById(req.params.id);

	if (!product) {
		return res.status(404).json({
			message: 'Product not found',
		});
	}

	// Save image to firebase storage and get URL if product does not exist
	let image_url = '';
	const file = req.file;

	if (file) {
		image_url = await uploadImage(file);
	}

	// Update product
	product.name = name;
	product.price = price;
	product.vendor = vendor;
	product.category = category;
	product.countInStock = countInStock;
	product.description = description;

	if (image_url) {
		product.image = image_url;
	}

	// Save product to the database
	try {
		const updatedProduct = await product.save();
		res.status(201).json(updatedProduct);
	} catch (error) {
		// Handle error appropriately
		if (image_url) {
			await deleteImage(file.originalname);
		}
		res.status(500).json({ message: 'Failed to update product' });
	}
});

// Create Endpoint to get all products by a vendor
// @route GET /api/v1/products/vendor/:id

const getProductsByVendor = asyncHandler(async (req, res) => {
	const products = await Product.find({ vendor: req.params.id }).populate(
		'vendor'
	);
	res.json(products);
});

export {
	getProducts,
	getProductById,
	createProduct,
	updateProduct,
	getProductsByVendor,
};
