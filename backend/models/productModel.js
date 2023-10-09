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
