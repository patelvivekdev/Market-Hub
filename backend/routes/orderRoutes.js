import express from 'express';

const router = express.Router();
import {
	addOrderItems,
	getOrderById,
	getOrders,
	markOrderToPaid,
	markOrderToDelivered,
	getOrdersByUserId,
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/').post(protect, addOrderItems).get(protect, admin, getOrders);
router.route('/mine').get(protect, getOrdersByUserId);
router.route('/:id').get(protect, getOrderById);
router.route('/:id/pay').put(protect, markOrderToPaid);
router.route('/:id/deliver').put(protect, admin, markOrderToDelivered);

export default router;
