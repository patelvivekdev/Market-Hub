import express from 'express';

import { admin, protect } from '../middleware/authMiddleware.js';

import {
	resetPasswordRateLimitMiddleware,
	forgotPasswordRateLimitMiddleware,
	registerRateLimitMiddleware,
	loginRateLimitMiddleware,
} from '../middleware/rateLimitMiddleware.js';

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
	resetPassword,
	forgotPassword,
	updatePassword,
	validateAccount,
	logoutUser,
	uploadProfilePic,
	getAllVendors,
} from '../controllers/userController.js';

import { uploader } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// For check email
router.route('/check').post(checkEmail);

// Base route
router
	.route('/')
	.post(registerRateLimitMiddleware, registerUser)
	.get(protect, admin, getUsers);

// Verify route
router.route('/verify/:verifyToken').post(validateAccount);

// Auth route
router.post('/auth', loginRateLimitMiddleware, authUser);

// Logout route
router.post('/logout', logoutUser);

// Profile route (for logged in user)
router
	.route('/profile')
	.get(protect, getUserProfile)
	.put(protect, updateUserProfile)
	.delete(protect, deactivateUser);

// Profile pic route
router.route('/profile/pic').put(protect, uploader, uploadProfilePic);

// PASSWORD Route
router
	.route('/profile/password')
	.put(resetPasswordRateLimitMiddleware, protect, updatePassword);
router
	.route('/forgot-password')
	.post(forgotPasswordRateLimitMiddleware, forgotPassword);
router.route('/reset-password/:resetToken').post(resetPassword);

// get all vendors
router.route('/vendors').get(getAllVendors);

// Admin routes
router
	.route('/:id')
	.delete(protect, admin, deleteUser)
	.get(protect, admin, getUserById)
	.put(protect, admin, updateUser);

export default router;
