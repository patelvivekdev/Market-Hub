import mongoose from 'mongoose';

const addressSchema = mongoose.Schema({
	address: { type: String, required: true },
	city: { type: String, required: true },
	postalCode: { type: String, required: true },
	country: { type: String, required: true },
});

const orderItemSchema = mongoose.Schema({
	product: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Product',
		required: true,
	},
	qty: {
		type: Number,
		required: true,
		default: 1,
	},
	price: {
		type: Number,
		required: true,
		default: 0.0,
	},
	name: {
		type: String,
		required: true,
	},
	image: {
		type: String,
		required: true,
	},
});

const orderSchema = mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		orderItems: [orderItemSchema],
		itemsPrice: {
			type: Number,
			required: true,
			default: 0.0,
		},
		taxPrice: {
			type: Number,
			required: true,
			default: 0.0,
		},
		shippingPrice: {
			type: Number,
			required: true,
			default: 0.0,
		},
		totalPrice: {
			type: Number,
			required: true,
			default: 0.0,
		},
		isPaid: {
			type: Boolean,
			required: true,
			default: false,
		},
		paidAt: {
			type: Date,
		},
		shippingAddress: {
			type: addressSchema,
			required: true,
		},
		isDelivered: {
			type: Boolean,
			required: true,
			default: false,
		},
		deliveredAt: {
			type: Date,
		},
		paymentMethod: {
			type: String,
			required: true,
		},
		paymentResult: {
			id: { type: String },
			status: { type: String },
			update_time: { type: String },
			email_address: { type: String },
		},
		isCancelled: {
			type: Boolean,
			required: true,
			default: false,
		},
		cancelledAt: {
			type: Date,
		},
	},
	{
		timestamps: true,
	}
);

const Order = mongoose.model('Order', orderSchema);

export default Order;
