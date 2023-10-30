import mongoose from 'mongoose';

const productSchema = mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		category: {
			type: String,
			required: true,
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
			default: 'https://firebasestorage.googleapis.com/v0/b/market-hub-1937e.appspot.com/o/default.jpg?alt=media&token=4222dffe-31c0-47de-9c1d-37b2e290dd7c',
		},
		// Set vendor to product
		vendor: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: 'Vendor',
		},
	},
	{
		timestamps: true,
	}
);

const Product = mongoose.model('Product', productSchema);

export default Product;
