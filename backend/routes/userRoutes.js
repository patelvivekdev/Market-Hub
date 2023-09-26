import express from 'express';
import {
	authUser,
	registerUser,
	getUserProfile,
	updateUserProfile,
	getUsers,
	deleteUser,
	getUserById,
	updateUser,
	checkEmail,
} from '../controllers/userController.js';

import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// For check email
router.route('/check').post(checkEmail);

// Base route
router.route('/')
	.post(registerUser)
	.get(protect, admin, getUsers);

// Auth route
router.post('/auth', authUser);

// Logout route
// router.post('/logout', logoutUser);

// Profile route
router
	.route('/profile')
	.get(protect, getUserProfile)
	.put(protect, updateUserProfile);

// Admin routes
router
	.route('/:id')
	.delete(protect, admin, deleteUser)
	.get(protect, admin, getUserById)
	.put(protect, admin, updateUser);

export default router;
