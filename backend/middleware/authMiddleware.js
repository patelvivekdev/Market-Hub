import AsyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';

import User from '../models/userModel.js';

const protect = AsyncHandler(async (req, res, next) => {
	let token;

	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith('Bearer')
	) {
		try {
			token = req.headers.authorization.split(' ')[1];
			const decoded = jwt.verify(token, process.env.JWT_SECRET);

			req.user = await User.findById(decoded.id).select('-password');
			next();
		} catch (error) {
			console.error(error);
			res.status(401);
			throw new Error('--> Error: Not authorized,Token failed');
		}
	} else {
		res.status(401);
		throw new Error('--> Error: Not authorized, no token');
	}
});

const admin = (req, res, next) => {
	if (req.user && req.user.isAdmin) {
		next();
	} else {
		res.status(401);
		throw new Error('--> Error: Not authorized as an admin');
	}
};

const vendor = (req, res, next) => {
	if (req.user && req.user.isVendor) {
		next();
	} else {
		res.status(401);
		throw new Error('--> Error: Not authorized as a vendor');
	}
};

const adminOrVendor = (req, res, next) => {
	if (req.user && (req.user.isAdmin || req.user.isVendor)) {
		next();
	} else {
		res.status(401);
		throw new Error('--> Error: Not authorized as a vendor or admin');
	}
};

// For allowing only vendor to edit their products and admin to edit all products
const adminOrVendorOrUser = (req, res, next) => {
	if (
		req.user &&
		(req.user.isAdmin ||
			req.user.isVendor ||
			req.user._id == req.params.id)
	) {
		next();
	} else {
		res.status(401);
		throw new Error(
			'--> Error: Not authorized as a vendor or admin or user'
		);
	}
};

export { protect, admin, vendor, adminOrVendor };
