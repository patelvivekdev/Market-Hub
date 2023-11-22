import mongoose from 'mongoose';

const reviewSchema = mongoose.Schema(
	{
		rating: {
			type: Number,
			required: true,
			min: 1,
			max: 5,
		},
		reviewMessage: {
			type: String,
			required: true,
		},
		reviewer: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: 'User',
		},
	},
	{
		timestamps: true,
	}
);

const productSchema = mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		category: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: 'CategoryModel',
		},
		description: {
			type: String,
			required: true,
		},
		price: {
			type: Number,
			required: true,
			default: 0,
		},
		countInStock: {
			type: Number,
			required: true,
			default: 0,
		},
		image: {
			type: String,
			required: true,
			default: 'https://firebasestorage.googleapis.com/v0/b/market-hub-1937e.appspot.com/o/default.jpg?alt=media&token=9ddd7635-4413-4594-b8d4-530aec97b7ac',
		},
		// Set vendor to product
		vendor: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: 'Vendor',
		},
		// Add reviews to product
		reviews: [reviewSchema],
		// Add rating to product
		rating: {
			type: Number,
			required: true,
			default: 0,
		},
		// Add number of reviews to product
		numReviews: {
			type: Number,
			required: true,
			default: 0,
		},
		// Add number of views to product
		numViews: {
			type: Number,
			required: true,
			default: 0,
		},
		// Add number of purchases to product
		numPurchases: {
			type: Number,
			required: true,
			default: 0,
		},
	},
	{
		timestamps: true,
	}
);

const Product = mongoose.model('Product', productSchema);

export default Product;
