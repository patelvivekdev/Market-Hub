import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';

import Admin from '../models/adminModel.js';
import Client from '../models/clientModel.js';
import generateToken from '../utils/generateToken.js';
import User from '../models/userModel.js';
import Vendor from '../models/vendorModel.js';

// Check user email for login
const checkEmail = asyncHandler(async (req, res) => {
	const { email } = req.body;

	const user = await User.findOne({ email });

	if (user) {
		res.status(400).json({
			found: true,
			email: email,
			message: 'User already exists',
		});
		throw new Error('--> Error: User already exists');
	} else {
		res.status(200).json({
			found: false,
			email: email,
			message: 'User not found',
		});
		// throw new Error('User not found')
	}
});

// Auth user & get token
const authUser = asyncHandler(async (req, res) => {
	const { email, password } = req.body;

	// check the user details
	if (!email || !password) {
		return res.status(400).json({
			message: 'Please fill all the fields',
		});
	}

	const user = await User.findOne({ email });

	if (user && (await user.matchPassword(password))) {
		res.json({
			_id: user._id,
			email: user.email,
			username: user.username || user.email,
			userType: user.userType,
			token: generateToken(user._id, user.userType),
			message: 'User logged in successfully',
		});
	} else {
		return res.status(401).json({
			message: 'Invalid email or password',
		});
	}
});

// Register a new user based on user type (client, vendor, admin) and create a profile for the user
const registerUser = asyncHandler(async (req, res) => {
	const { username, email, password, userType, profile } = req.body;

	// check the user details
	if (!username || !email || !password) {
		res.status(400).json({
			message: 'Please fill all the fields',
		});
		throw new Error('--> Error: Invalid user data');
	}

	// check email with regex
	const emailRegex = /\S+@\S+\.\S+/;
	if (!emailRegex.test(email)) {
		res.status(400).json({
			message: 'Please enter a valid email',
		});
		throw new Error('--> Error: Invalid email');
	}

	// Check password with regex
	const passwordRegex =
		/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm;
	if (!passwordRegex.test(password)) {
		res.status(400).json({
			message: 'Please enter a valid password',
		});
		throw new Error(
			'--> Error: Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number'
		);
	}

	// Check if user exists with same email or username
	const userExists = await User.findOne({
		$or: [{ email: email }, { username: email }],
	});

	if (userExists) {
		res.status(400).json({
			message: 'User already exists',
		});
		throw new Error('--> Error: User already exists.');
	}

	// Create user based on user type
	const user = await User.create({
		username,
		email,
		password,
		userType,
	});

	// Create user profile
	let userDetails;
	if (userType === 'Client') {
		userDetails = await Client.create({
			clientName: profile.name,
			phone: profile.phone,
			address: profile.address,
		});
	} else if (userType === 'Vendor') {
		userDetails = await Vendor.create({
			vendorName: profile.name,
			phone: profile.phone,
			address: profile.address,
		});
	} else if (userType === 'Admin') {
		userDetails = await Admin.create({
			adminName: profile.name,
			phone: profile.phone,
			address: profile.address,
		});
	} else {
		return res.status(400).json({
			message: "User type doesn't exist",
		});
	}

	// connect client to user
	user.profile = userDetails._id;

	// password encryption
	const salt = await bcrypt.genSalt(10);
	user.password = await bcrypt.hash(user.password, salt);

	// Save the user and client
	await user.save();
	await userDetails.save();

	if (user) {
		res.status(201).json({
			_id: user._id,
			username: user.username,
			email: user.email,
			token: generateToken(user._id, user.userType),
			message: 'User created successfully',
		});
	} else {
		return res.status(400).json({
			message: 'Something went wrong, please try again.',
		});
	}
});

// Get user profile
const getUserProfile = asyncHandler(async (req, res) => {
	const user = await User.findById(req.user._id)
		.populate('profile')
		.select('-password');

	if (user) {
		res.json(user);
	} else {
		res.status(401);
		throw new Error('--> Error: Invalid email or password');
	}
});

// Logout user
// const logoutUser = (req, res) => {
// 	res.cookie('jwt', '', {
// 		httpOnly: true,
// 		expires: new Date(0),
// 	});
// 	res.status(200).json({ message: 'Logged out successfully' });
// };

// Update user details
async function updateUserDetails(user, requestData) {
	user.username = requestData.username || user.username;
	user.email = requestData.email || user.email;
	if (requestData.password) {
		// Password encryption
		const salt = await bcrypt.genSalt(10);
		user.password = await bcrypt.hash(requestData.password, salt);
	}

	return await user.save();
}

// Update user profile details
async function updateUserProfileDetails(user, userType, requestData) {
	let userDetails;

	if (userType === 'Client') {
		userDetails = await Client.findById(user.profile);
	} else if (userType === 'Vendor') {
		userDetails = await Vendor.findById(user.profile);
	} else if (userType === 'Admin') {
		userDetails = await Admin.findById(user.profile);
	}

	if (userDetails) {
		userDetails.name = requestData.profile.name || userDetails.name;
		userDetails.phone = requestData.profile.phone || userDetails.phone;
		userDetails.address =
			requestData.profile.address || userDetails.address;
		await userDetails.save();
	}

	return userDetails;
}

const updateUserProfile = asyncHandler(async (req, res) => {
	const user = await User.findById(req.user._id);
	const userType = req.user.userType;

	if (user) {
		const updatedUserDetails = await updateUserDetails(user, req.body);
		const updatedUserProfileDetails = await updateUserProfileDetails(
			user,
			userType,
			req.body
		);

		if (updatedUserDetails) {
			res.json({
				_id: updatedUserDetails._id,
				username: updatedUserDetails.username,
				email: updatedUserDetails.email,
				profile: updatedUserProfileDetails,
				message: 'User profile updated successfully',
			});
		} else {
			res.status(401).json({
				message: 'User not found',
			});
			throw new Error('--> Error: Invalid email or password');
		}
	} else {
		return res.status(401).json({
			message: 'User not found',
		});
	}
});

// for delete user account (deactivate user) up to 7 days
const deactivateUser = asyncHandler(async (req, res) => {
	const user = await User.findById(req.user._id);

	if (user) {
		user.isActive = false;
		await user.save();
		res.json({
			message: 'User deactivated successfully',
		});
	} else {
		res.status(401).json({
			message: 'User not found',
		});
		throw new Error('--> Error: Invalid email or password');
	}
});

// ------------------------------ ADMIN ------------------------------

// Get all users
const getUsers = asyncHandler(async (req, res) => {
	const users = await User.find({});
	res.json(users);
});

// Delete user
const deleteUser = asyncHandler(async (req, res) => {
	const user = await User.findById(req.params.id);

	if (user) {
		if (user.isAdmin) {
			res.status(400).json({
				message: 'Can not delete admin user',
			});
			throw new Error('--> Error: Can not delete admin user');
		}
		await user.remove();
		res.json({ message: 'User removed' });
	} else {
		res.status(404).json({
			message: 'User not found',
		});
		throw new Error('--> Error: User not found');
	}
});

// Get user by id
const getUserById = asyncHandler(async (req, res) => {
	const user = await User.findById(req.params.id)
		.populate('profile')
		.select('-password');

	if (user) {
		res.json(user);
	} else {
		res.status(404);
		throw new Error('--> Error: User not found');
	}
});

// Update user only by admin user
// only update user details, not profile details
const updateUser = asyncHandler(async (req, res) => {
	const user = await User.findById(req.params.id);

	if (user) {
		user.username = req.body.username || user.username;
		user.email = req.body.email || user.email;
		user.userType = req.body.userType || user.userType;
		user.isActive = req.body.isActive || user.isActive;
		user.isAdmin = req.body.isAdmin || user.isAdmin;

		const updatedUser = await user.save();

		res.json({
			_id: updatedUser._id,
			username: updatedUser.username,
			email: updatedUser.email,
			userType: updatedUser.userType,
			isActive: updatedUser.isActive,
			isAdmin: updatedUser.isAdmin,
		});
	} else {
		res.status(404);
		throw new Error('--> Error: User not found');
	}
});

export {
	authUser,
	registerUser,
	getUserProfile,
	updateUserProfile,
	getUsers,
	deleteUser,
	checkEmail,
	getUserById,
	updateUser,
	deactivateUser,
};
