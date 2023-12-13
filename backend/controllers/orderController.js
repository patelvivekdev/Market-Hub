import asyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';
import Product from '../models/productModel.js';
import { calcPrices } from '../utils/calcPrices.js';
import { verifyPayPalPayment, checkIfNewTransaction } from '../utils/paypal.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
	const { orderItems, shippingAddress, paymentMethod } = req.body;

	if (orderItems && orderItems.length === 0) {
		return res.status(400).json({ message: 'No order items' });
	} else {
		// Get prices from database
		const productsDB = await Product.find({
			_id: { $in: orderItems.map((x) => x._id) },
		});

		// map over the order items and use the price from our items from database
		const dbOrderItems = orderItems.map((itemFromClient) => {
			const matchingItemFromDB = productsDB.find(
				(itemFromDB) =>
					itemFromDB._id.toString() === itemFromClient._id
			);
			return {
				...itemFromClient,
				product: itemFromClient._id,
				price: matchingItemFromDB.price,
			};
		});

		// calculate prices
		const { itemsPrice, taxPrice, shippingPrice, totalPrice } =
			calcPrices(dbOrderItems);

		const order = new Order({
			orderItems: dbOrderItems,
			user: req.user._id,
			shippingAddress,
			paymentMethod,
			itemsPrice,
			taxPrice,
			shippingPrice,
			totalPrice,
		});

		const createdOrder = await order.save();

		res.status(201).json({
			message: 'Order created successfully',
			order: createdOrder,
		});
	}
});

// @route   GET /api/orders/:id
const getOrderById = asyncHandler(async (req, res) => {
	const order = await Order.findById(req.params.id).populate({
		path: 'user',
		populate: {
			path: 'profile',
			model: 'Client',
		},
	});

	if (!order) {
		return res.status(404).json({ message: 'Order not found' });
	}
	return res.json(order);
});

// @route   GET /api/orders/:id/pay
const markOrderToPaid = asyncHandler(async (req, res) => {
	const order = await Order.findById(req.params.id);

	const { verified, value } = await verifyPayPalPayment(req.body.id);
	if (!verified) {
		return res.status(400).json({ message: 'Payment not verified' });
	}

	const isNewTransaction = await checkIfNewTransaction(Order, req.body.id);
	if (!isNewTransaction) {
		return res.status(400).json({ message: 'Payment already processed' });
	}

	if (!order) {
		return res.status(404).json({ message: 'Order not found' });
	}

	order.isPaid = true;
	order.paidAt = Date.now();
	order.paymentResult = {
		id: req.body.id,
		status: req.body.status,
		update_time: req.body.update_time,
		email_address: req.body.payer.email_address,
	};

	const updatedOrder = await order.save();

	return res.json(updatedOrder);
});

// @desc    Update order to delivered
// @route   GET /api/orders/:id/deliver
// @access  Private/Admin
const markOrderToDelivered = asyncHandler(async (req, res) => {
	const order = await Order.findById(req.params.id);

	if (!order) {
		return res.status(404).json({ message: 'Order not found' });
	}

	// check if order is paid
	if (!order.isPaid) {
		return res.status(400).json({ message: 'Order is not paid' });
	}

	order.isDelivered = true;
	order.deliveredAt = Date.now();

	const updatedOrder = await order.save();

	return res.json(updatedOrder);
});

// @desc    Get logged in user orders
const getOrdersByUserId = asyncHandler(async (req, res) => {
	const orders = await Order.find({ user: req.user._id });
	res.json(orders);
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
	const orders = await Order.find({}).populate({
		select: '-password',
		path: 'user',
		populate: {
			path: 'profile',
			model: 'Client',
		},
	});
	res.json(orders);
});

export {
	addOrderItems,
	getOrderById,
	getOrders,
	markOrderToPaid,
	markOrderToDelivered,
	getOrdersByUserId,
};
