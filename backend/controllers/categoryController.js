import asyncHandler from 'express-async-handler';
import Category from '../models/categoryModel.js';
import Product from '../models/productModel.js';

// Create Endpoint to get all categories
// @route GET /api/v1/categories

const getCategories = asyncHandler(async (req, res) => {
	const categories = await Category.find({});
	res.json(categories);
});

// Create Endpoint to get single category
// @route GET /api/v1/categories/:id

const getCategoryById = asyncHandler(async (req, res) => {
	const category = await Category.findById(req.params.id);
	if (category) {
		res.json(category);
	} else {
		res.status(404).json({
			message: 'Category not found',
		});
		throw new Error('--> Error: Category not found');
	}
});

// Create Endpoint to create a category
// @route POST /api/v1/categories

const createCategory = asyncHandler(async (req, res) => {
	const { name, description } = req.body;

	// Validate data
	if (!name || !description) {
		return res.status(400).json({
			message: 'Please enter all fields',
		});
	}
	// Check if category already exists in the database Check with name
	const categoryExists = await Category.findOne({ name });

	if (categoryExists) {
		return res.status(400).json({
			message: 'Category already exists',
		});
	}

	// Create new category
	const category = await Category.create({
		name,
		description,
	});

	if (category) {
		return res.status(201).json({
			_id: category._id,
			name: category.name,
			description: category.description,
			message: 'Category created!',
		});
	} else {
		return res.status(400).json({
			message: 'Invalid category data',
		});
	}
});

// Create Endpoint to update a category
// @route PUT /api/v1/categories/:id

const updateCategory = asyncHandler(async (req, res) => {
	const { name, description } = req.body;

	// Validate data
	if (!name || !description) {
		return res.status(400).json({
			message: 'Please enter all fields',
		});
	}
	// Check if category already exists in the database Check with name
	const categoryExists = await Category.findOne({ name });

	if (categoryExists) {
		return res.status(400).json({
			message: 'Category already exists',
		});
	}

	// Create new category
	const category = await Category.create({
		name,
		description,
	});

	if (category) {
		return res.status(201).json({
			_id: category._id,
			name: category.name,
			description: category.description,
			message: 'Category updated!',
		});
	} else {
		return res.status(400).json({
			message: 'Invalid category data',
		});
	}
});

// Create Endpoint to delete a category
// @route DELETE /api/v1/categories/:id

const deleteCategory = asyncHandler(async (req, res) => {
	const category = await Category.findById(req.params.id);

	if (category) {
		await Category.findByIdAndDelete(req.params.id);
		return res.json({
			message: 'Category removed!',
		});
	} else {
		return res.status(404).json({
			message: 'Category not found!',
		});
	}
});

// Based on category id, get all products
// @route GET /api/v1/categories/:id/products

const getProductsByCategory = asyncHandler(async (req, res) => {
	const category = await Category.findById(req.params.id);
	if (category) {
		const products = await Product.find({ category: req.params.id });
		res.json(products);
	} else {
		return res.status(404).json({
			message: 'Category not found',
		});
	}
});

export {
	getCategories,
	getCategoryById,
	createCategory,
	updateCategory,
	deleteCategory,
	getProductsByCategory,
};
