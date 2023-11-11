import asyncHandler from 'express-async-handler';

import { uploadImage, deleteImage } from '../utils/firebase.js';
import Product from '../models/productModel.js';

// Create Endpoint to get all products
// @route GET /api/v1/products

const getProducts = asyncHandler(async (req, res) => {
	// populate vendor field and category field
	const products = await Product.find({})
		.populate('vendor')
		.populate('category');

	return res.json(products);
});

// Create Endpoint to get single product
// @route GET /api/v1/products/:id

const getProductById = asyncHandler(async (req, res) => {
	const product = await Product.findById(req.params.id)
		.populate('vendor')
		.populate('category');
	if (product) {
		return res.json(product);
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
	const { name, price, category, countInStock, description } = req.body;

	// Get vendor from token
	const vendor = req.user.profile._id;

	// Validate data
	if (!name || !price || !category || !countInStock || !description) {
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
		return res.status(201).json({
			_id: createdProduct._id,
			name: createdProduct.name,
			price: createdProduct.price,
			vendor: createdProduct.vendor,
			category: createdProduct.category,
			countInStock: createdProduct.countInStock,
			description: createdProduct.description,
			image: createdProduct.image,
			message: 'Product created successfully',
		});
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
	const { name, price, category, countInStock, description } = req.body;

	// Get vendor from token
	const vendor = req.user.profile._id;

	// Validate data
	if (!name || !price || !category || !countInStock || !description) {
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
		// Upload new image to firebase storage
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
		// Delete old image from firebase storage
		if (product.image !== '') {
			await deleteImage(product.image);
		}
		product.image = image_url;
	}

	// Save product to the database
	try {
		const updatedProduct = await product.save();

		return res.status(201).json({
			_id: updatedProduct._id,
			name: updatedProduct.name,
			price: updatedProduct.price,
			vendor: updatedProduct.vendor,
			category: updatedProduct.category,
			countInStock: updatedProduct.countInStock,
			description: updatedProduct.description,
			image: updatedProduct.image,
			message: 'Product updated successfully',
		});
	} catch (error) {
		// Handle error appropriately
		if (image_url) {
			await deleteImage(file.originalname);
		}
		return res.status(500).json({ message: 'Failed to update product' });
	}
});

// Create Endpoint to delete a product
// @route DELETE /api/v1/products/:id

const deleteProduct = asyncHandler(async (req, res) => {
	const product = await Product.findById(req.params.id);

	if (!product) {
		return res.status(404).json({
			message: 'Product not found',
		});
	}

	// Delete product from the database
	try {
		await product.findByIdAndDelete(req.params.id);

		// Delete image from firebase storage
		await deleteImage(product.image);

		return res
			.status(201)
			.json({ message: 'Product deleted successfully' });
	} catch (error) {
		// Handle error appropriately
		return res.status(500).json({ message: 'Failed to delete product' });
	}
});

// create Endpoint to change product image
// @route PUT /api/v1/products/:id/image

const changeProductImage = asyncHandler(async (req, res) => {
	// Get product from the database
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
		// Upload new image to firebase storage
		image_url = await uploadImage(file);
	}

	if (image_url) {
		// Delete old image from firebase storage
		if (product.image !== '') {
			await deleteImage(product.image);
		}
		// Update product
		product.image = image_url;
	}

	// Save product to the database
	try {
		const updatedProduct = await product.save();

		return res.status(201).json({
			_id: updatedProduct._id,
			image: updatedProduct.image,
			message: 'Product image updated successfully',
		});
	} catch (error) {
		// Handle error appropriately
		if (image_url) {
			await deleteImage(file.originalname);
		}
		return res
			.status(500)
			.json({ message: 'Failed to update product image' });
	}
});

// Create Endpoint to get all products by a vendor
// @route GET /api/v1/products/vendor/:id

const getProductsByVendor = asyncHandler(async (req, res) => {
	const products = await Product.find({ vendor: req.params.id })
		.populate('vendor')
		.populate('category');
	return res.json(products);
});

// Create Endpoint to get all products by a category
// @route GET /api/v1/products/category/:id

const getProductsByCategory = asyncHandler(async (req, res) => {
	const products = await Product.find({ category: req.params.id }).populate(
		'vendor'
	);
	return res.json(products);
});

export {
	getProducts,
	getProductById,
	createProduct,
	updateProduct,
	deleteProduct,
	changeProductImage,
	getProductsByVendor,
	getProductsByCategory,
};
