import asyncHandler from 'express-async-handler';

import { uploadImage, deleteImage } from '../utils/firebase.js';
import Order from '../models/orderModel.js';
import Product from '../models/productModel.js';

// Create Endpoint to get all products
// @route GET /api/v1/products

const getProducts = asyncHandler(async (req, res) => {
	// page number
	const pageSize = process.env.PAGE_SIZE || 3;
	const page = Number(req.query.pageNumber) || 1;

	// vendor
	const vendor = req.query.vendor || '';

	// category
	const category = req.query.category || '';

	const filters = {};

	if (vendor && vendor !== 'All') {
		filters.vendor = vendor;
	}

	if (category && category !== 'All') {
		filters.category = category;
	}

	const totalProducts = await Product.countDocuments(filters);

	const products = await Product.find(filters)
		.limit(pageSize)
		.skip(pageSize * (page - 1))
		.populate('vendor')
		.populate('category');

	// Return the products and the page number
	res.json({ products, page, pages: Math.ceil(totalProducts / pageSize) });
});

// Create Endpoint to get single product
// @route GET /api/v1/products/:id

const getProductById = asyncHandler(async (req, res) => {
	const product = await Product.findById(req.params.id)
		.populate('vendor')
		.populate('category')
		.populate('reviews.reviewer');
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
		numReviews: 0,
	});

	if (image_url) {
		product.image = image_url;
	} else {
		// Set default image
		product.image =
			'https://firebasestorage.googleapis.com/v0/b/market-hub-1937e.appspot.com/o/default.jpg?alt=media&token=9ddd7635-4413-4594-b8d4-530aec97b7ac';
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
		await Product.findByIdAndDelete(req.params.id);

		// Delete image from firebase storage
		await deleteImage(product.image);

		return res
			.status(201)
			.json({ message: 'Product deleted successfully' });
	} catch (error) {
		// Handle error appropriately
		return res
			.status(500)
			.json({ message: 'Failed to delete product.' + error });
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
	} else {
		return res.status(400).json({
			message: 'Please select an image',
		});
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

// Create new review
// @route POST /api/v1/products/:id/reviews

const addProductReview = asyncHandler(async (req, res) => {
	const { rating, reviewMessage } = req.body;
	const productId = req.params.id;

	const reviewer = req.user._id;

	// Validate data
	if (!rating || !reviewMessage) {
		return res
			.status(400)
			.json({ message: 'Please provide rating and review message' });
	}

	try {
		const product = await Product.findById(productId);

		if (!product) {
			return res.status(404).json({ message: 'Product not found' });
		}

		// Check if the user has already reviewed this product
		const alreadyReviewed = product.reviews.find(
			(review) => review.reviewer.toString() === reviewer.toString()
		);

		if (alreadyReviewed) {
			return res.status(400).json({
				message: 'You have already reviewed this product',
			});
		}

		// Check if the user has ordered this product
		const hasOrdered = await Order.exists({
			user: reviewer,
			orderItems: {
				$elemMatch: {
					product: productId,
				},
			},
			isPaid: true,
			isDelivered: true,
		});

		if (!hasOrdered) {
			return res.status(401).json({
				message: 'You can only review products you have ordered (paid AND delivered)!',
			});
		}
		// Create the review
		const newReview = {
			rating,
			reviewMessage,
			reviewer,
		};

		// Add the review to the product's reviews array
		product.reviews.push(newReview);
		product.numReviews = product.reviews.length;
		// Calculate the new average rating if needed and update the product's overall rating
		if (product.numReviews > 1) {
			product.rating =
				product.reviews.reduce(
					(acc, item) => item.rating + acc,
					0
				) / product.reviews.length;
		} else {
			product.rating = rating;
		}

		await product.save();

		return res.status(201).json({ message: 'Review added successfully' });
	} catch (error) {
		return res
			.status(500)
			.json({ message: 'Failed to add review', error: error });
	}
});

// @desc    Get top rated products
// @route   GET /api/products/top
const getTopProducts = asyncHandler(async (req, res) => {
	const products = await Product.find({})
		.sort({ rating: -1 })
		.limit(3)
		.populate('vendor')
		.populate('category');

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
	addProductReview,
	getTopProducts,
};
