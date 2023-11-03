import AsyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';

import User from '../models/userModel.js';

const protect = AsyncHandler(async (req, res, next) => {
	const token = req.cookies.jwt;

	if (token) {
		try {
			// Verify token
			const decoded = jwt.verify(token, process.env.JWT_SECRET);

			// Set req.user to the user that is decoded from the token
			req.user = await User.findById(decoded.id).select('-password');
			req.userType = decoded.userType;
			next();
		} catch (error) {
			return res.status(401).json({
				message: 'Token expired or not authorized, please login again',
			});
		}
	} else {
		return res.status(401).json({
			message: 'Not authorized, no token',
		});
	}
});

const admin = (req, res, next) => {
	if (req.user && req.userType === 'Admin') {
		next();
	} else {
		return res.status(401).json({
			message: 'Not authorized as an admin',
		});
	}
};

const vendor = (req, res, next) => {
	if (req.user && req.userType === 'Vendor') {
		next();
	} else {
		return res.status(401).json({
			message: 'Not authorized as a vendor',
		});
	}
};

const adminOrVendor = (req, res, next) => {
	if (req.user && (req.userType === 'Vendor' || req.userType === 'Admin')) {
		next();
	} else {
		return res.status(401).json({
			message: 'Not authorized as a vendor or admin',
		});
	}
};

export { protect, admin, vendor, adminOrVendor };
