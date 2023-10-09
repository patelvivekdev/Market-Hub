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
	deactivateUser,
} from '../controllers/userController.js';

import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// For check email
router.route('/check').post(checkEmail);

// Base route
router.route('/').post(registerUser).get(protect, admin, getUsers);

// Auth route
router.post('/auth', authUser);

// Logout route
// router.post('/logout', logoutUser);

// Profile route (for logged in user)
router
	.route('/profile')
	.get(protect, getUserProfile)
	.put(protect, updateUserProfile)
	.delete(protect, deactivateUser);

// Admin routes
router
	.route('/:id')
	.delete(protect, admin, deleteUser)
	.get(protect, admin, getUserById)
	.put(protect, admin, updateUser);

export default router;
