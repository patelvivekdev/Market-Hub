import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import dotenv from 'dotenv';

import { uploadImage, deleteImage } from '../utils/firebase.js';
import Admin from '../models/adminModel.js';
import Client from '../models/clientModel.js';
import generateToken from '../utils/generateToken.js';
import sendMail from './mailController.js';
import TokenModel from '../models/tokenModel.js';
import User from '../models/userModel.js';
import Vendor from '../models/vendorModel.js';

dotenv.config();

export const BASE_URL =
	process.env.NODE_ENV === 'DEVELOPMENT'
		? process.env.BASE_URL_DEV
		: process.env.NODE_ENV === 'PRODUCTION'
		? process.env.BASE_URL_PROD
		: process.env.BASE_URL_TEST;

// ------------------------------ EMAIL CHECK ------------------------

// Check user email for login
const checkEmail = asyncHandler(async (req, res) => {
	const { email } = req.body;

	// find user by email
	const user = await User.findOne({ email });

	// if user exists
	if (user) {
		return res.status(200).json({
			found: true,
			email: email,
			message: 'User already exists.',
		});
	} else {
		return res.status(200).json({
			found: false,
			email: email,
			message: 'User not found.',
		});
	}
});

// ------------------------------ AUTH ------------------------------

// Auth user & send token in Cookie
const authUser = asyncHandler(async (req, res) => {
	// check if user is already logged in
	if (req.user) {
		return res.status(200).json({
			_id: req.user._id,
			email: req.user.email,
			username: req.user.username || req.user.email,
			userType: req.user.userType,
			isActive: req.user.isActive,
			profile: req.user.profile,
			fullName: req.user.profile.name,
			isEmailVerified: req.user.isEmailVerified,
			message: 'User logged in successfully',
		});
	}

	const { email, password } = req.body;

	// check the user details
	if (!email || !password) {
		return res.status(400).json({
			message: 'Please fill all the fields',
		});
	}

	const user = await User.findOne({ email }).populate('profile');

	if (user && (await user.matchPassword(password))) {
		generateToken(res, user._id, user.userType);

		return res.json({
			_id: user._id,
			email: user.email,
			username: user.username || user.email,
			userType: user.userType,
			isActive: user.isActive,
			profile: user.profile,
			fullName: user.profile.name,
			isEmailVerified: user.isEmailVerified,
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
	// ready data for save to database
	let email = req.body.email.toLowerCase();
	let username = req.body.username.toLowerCase();
	let password = req.body.password;
	let userType = req.body.userType;
	let profile = req.body.profile;

	// check the user details
	if (!username || !email || !password) {
		return res.status(400).json({
			message: 'Please fill all the fields',
		});
	}

	// check email with regex
	const emailRegex = /\S+@\S+\.\S+/;
	if (!emailRegex.test(email)) {
		return res.status(400).json({
			message: 'Please enter a valid email',
		});
	}

	// Check password with regex
	const passwordRegex =
		/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm;
	if (!passwordRegex.test(password)) {
		return res.status(400).json({
			message: 'Please enter a valid password',
		});
	}

	// Check if user exists with same email or username
	const userExists = await User.findOne({
		$or: [{ email: email }, { username: username }],
	});

	if (userExists) {
		return res.status(400).json({
			message: 'User with this username or email already exists.',
		});
	}

	// Create user profile
	let userDetails;
	if (userType === 'Client') {
		if (!profile.phone) {
			return res.status(400).json({
				message: 'Please enter a valid phone number',
			});
		}
		if (!profile.name) {
			return res.status(400).json({
				message: 'Please enter a valid name',
			});
		}

		// check if client exists with same phone number
		const clientExists = await Client.findOne({
			phone: profile.phone,
		});

		if (clientExists) {
			return res.status(400).json({
				message: 'User already exists with this phone number.',
			});
		} else {
			userDetails = await Client.create({
				name: profile.name,
				phone: profile.phone,
			});
		}
	} else if (userType === 'Vendor') {
		if (!profile.phone) {
			return res.status(400).json({
				message: 'Please enter a valid phone number',
			});
		}
		if (!profile.address) {
			return res.status(400).json({
				message: 'Please enter a valid address',
			});
		}
		if (!profile.name) {
			return res.status(400).json({
				message: 'Please enter a valid name',
			});
		}

		// check if vendor exists with same phone number
		const vendorExists = await Vendor.findOne({
			phone: profile.phone,
		});

		if (vendorExists) {
			return res.status(400).json({
				message: 'User already exists with this phone number.',
			});
		} else {
			userDetails = await Vendor.create({
				name: profile.name,
				phone: profile.phone,
				address: profile.address,
				website: profile.website || '',
				description: profile.description || '',
			});
		}
	} else if (userType === 'Admin') {
		if (!profile.name) {
			return res.status(400).json({
				message: 'Please enter a valid name',
			});
		}
		if (!profile.phone) {
			return res.status(400).json({
				message: 'Please enter a valid phone number',
			});
		}

		// check if admin exists with same phone
		const adminExists = await Admin.findOne({
			phone: profile.phone,
		});

		if (adminExists) {
			return res.status(400).json({
				message: 'User already exists with this phone number.',
			});
		} else {
			userDetails = await Admin.create({
				name: profile.name,
				phone: profile.phone,
			});
		}
	} else {
		return res.status(400).json({
			message: "User type doesn't exist",
		});
	}

	// Create user based on user type
	const user = await User.create({
		username,
		email,
		password,
		userType,
	});

	// connect client to user
	user.profile = userDetails._id;

	// password encryption
	const salt = await bcrypt.genSalt(10);
	user.password = await bcrypt.hash(user.password, salt);

	// Save the user and client
	await user.save();
	await userDetails.save();

	if (user) {
		// create token
		const token = crypto.randomBytes(32).toString('hex');
		const validateAccount = await TokenModel.create({
			email: email,
			token: token,
		});

		const verifyUrl = `${BASE_URL}/verify-account/${token}`;

		// send email
		const message = `
			<h1>You have successfully registered</h1>
			<p>Thank you for registering with us.</p>

			<p>Please go to this link to verify your account</p>
				<button style="background-color: #4CAF50; border: none; color: white; padding: 15px 32px; text-align: center; display: inline-block; font-size: 16px;">
					<a href=${verifyUrl} target="_blank">${verifyUrl}</a>
				</button>
			<p>Regards,</p>
			<p>Team</p>
		`;
		try {
			await sendMail({
				To: user.email,
				Subject: 'Registration Successful',
				HTMLPart: message,
			});
		} catch (error) {
			// delete token
			await TokenModel.deleteOne({ token: validateAccount });
			console.log("--> Error: Can't send email", error);
		}

		generateToken(res, user._id, user.userType);

		const user_info = await User.findOne({ email }).populate('profile');

		return res.json({
			_id: user_info._id,
			email: user_info.email,
			username: user_info.username || user_info.email,
			userType: user_info.userType,
			isActive: user_info.isActive,
			profile: user_info.profile,
			fullName: user_info.profile.name,
			isEmailVerified: user_info.isEmailVerified,
			message: 'Account crated successfully',
		});
	} else {
		return res.status(400).json({
			message: 'Something went wrong, please try again.',
		});
	}
});

// Logout user & clear cookie
const logoutUser = (req, res) => {
	res.cookie('jwt', '', {
		httpOnly: true,
		expires: new Date(0),
	});
	return res.status(200).json({ message: 'Logged out successfully.' });
};

// ------------------------------ Profile ------------------------------

// Get user profile
const getUserProfile = asyncHandler(async (req, res) => {
	const user = await User.findById(req.user._id)
		.populate('profile')
		.select('-password');
	if (user) {
		res.json(user);
	} else {
		return res.status(401).json({
			message: 'User not found',
		});
	}
});

// Update user details
async function updateUserDetails(user, requestData) {
	// check the user details and update

	// check for duplicate email or username
	const userExists = await User.findOne({
		$or: [
			{ email: requestData.email },
			{ username: requestData.username },
		],
	});

	if (userExists) {
		return res.status(400).json({
			message: 'User with this username or email already exists.',
		});
	}

	user.username = requestData.username || user.username;
	user.email = requestData.email || user.email;

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
		userDetails.profilePic =
			requestData.profile.profilePic ||
			userDetails.profilePic ||
			'https://firebasestorage.googleapis.com/v0/b/market-hub-1937e.appspot.com/o/profile.jpg?alt=media&token=4222dffe-31c0-47de-9c1d-37b2e290dd7c';
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
			return res.status(401).json({
				message: 'User not found',
			});
		}
	} else {
		return res.status(401).json({
			message: 'User not found',
		});
	}
});

const uploadProfilePic = asyncHandler(async (req, res) => {
	const user = await User.findById(req.user._id);
	const userType = req.user.userType;

	if (user) {
		let image_url = '';
		const file = req.file;

		if (file) {
			image_url = await uploadImage(file);
			let userDetails;

			if (userType === 'Client') {
				userDetails = await Client.findById(user.profile);
			} else if (userType === 'Vendor') {
				userDetails = await Vendor.findById(user.profile);
			} else if (userType === 'Admin') {
				userDetails = await Admin.findById(user.profile);
			}

			if (userDetails) {
				userDetails.profilePic = image_url;
				await userDetails.save();

				res.status(200).json({
					_id: userDetails._id,
					username: user.username,
					email: user.email,
					profile: userDetails,
					message: 'Profile picture updated successfully',
				});
			} else {
				return res.status(401).json({
					message: 'User not found',
				});
			}
		} else {
			return res.status(400).json({
				message: 'Please upload a file',
			});
		}
	} else {
		return res.status(401).json({
			message: 'User not found',
		});
	}
});

const sendVerifyEmail = asyncHandler(async (req, res) => {
	const user = await User.findById(req.user._id);

	if (user) {
		// create token
		const token = crypto.randomBytes(32).toString('hex');

		// check if token exists
		const tokenExists = await TokenModel.findOne({ email: user.email });

		if (tokenExists) {
			// delete token
			TokenModel.deleteOne({ email: tokenExists.email });
		}

		const validateAccount = await TokenModel.create({
			email: user.email,
			token: token,
		});

		const verifyUrl = `${BASE_URL}/verify-account/${token}`;

		// send email
		const message = `
			<h1>Please click the below link to verify account.</h1>
			<button style="background-color: #4CAF50; border: none; color: white; padding: 15px 32px; text-align: center; display: inline-block; font-size: 16px;">
				<a href=${verifyUrl} target="_blank">${verifyUrl}</a>
			</button>
			<p>Regards,</p>
			<p>Team</p>
		`;
		try {
			await sendMail({
				To: user.email,
				Subject: 'Verification Email',
				HTMLPart: message,
			});
		} catch (error) {
			// delete token
			TokenModel.deleteOne({ token: validateAccount });
			console.log("--> Error: Can't send email", error);
		}

		return res.status(200).json({
			success: true,
			message: 'Email sent successfully.',
		});
	} else {
		return res.status(401).json({
			message: 'User not found',
		});
	}
});

const validateAccount = asyncHandler(async (req, res) => {
	const { verifyToken } = req.params;

	// check the user details
	const token = await TokenModel.findOne({ token: verifyToken });

	if (!token) {
		return res.status(400).json({
			message: 'Invalid token',
		});
	}

	const user = await User.findOne({ email: token.email });

	if (!user) {
		return res.status(400).json({
			message: 'User does not exist.',
		});
	}

	try {
		user.isActive = true;
		user.isEmailVerified = true;
		await user.save();

		// delete token
		await TokenModel.deleteOne({ token: verifyToken });

		// send email
		const message = `
		<h1>You have successfully verified your account</h1>
		<p>Thank you for verifying your account.</p>
		
		<p>Regards,</p>
		<p>Team</p>
		`;

		try {
			await sendMail({
				To: user.email,
				Subject: 'Account Verified',
				HTMLPart: message,
			});
		} catch (error) {
			console.log("--> Error: Can't send email", error);
		}

		return res.json({
			_id: user._id,
			email: user.email,
			username: user.username || user.email,
			userType: user.userType,
			isActive: user.isActive,
			profile: user.profile,
			fullName: user.profile.name,
			isEmailVerified: user.isEmailVerified,
		});
	} catch (error) {
		console.log("--> Error: Can't verify account", error);
		return res.status(500).json({
			message: 'Verified your account! Please try again.',
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

// ------------------------------ PASSWORD ------------------------------

// changing password
const updatePassword = asyncHandler(async (req, res) => {
	const { currentPassword, newPassword, confirmPassword } = req.body;

	const user = await User.findById(req.user._id);

	// check the user
	if (!user) {
		return res.status(401).json({
			message: 'User not found',
		});
	}

	// check for any empty field
	if (!currentPassword || !newPassword || !confirmPassword) {
		return res
			.status(400)
			.json({ message: 'Please fill all the fields' });
	}

	if (!user.matchPassword(currentPassword)) {
		return res.status(400).json({ message: 'Invalid password' });
	}

	// Check password with regex
	const passwordRegex =
		/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm;
	if (!passwordRegex.test(newPassword)) {
		return res.status(400).json({
			message: 'Please enter a valid password',
		});
	}

	// check for the password match
	if (newPassword !== confirmPassword) {
		return res.status(400).json({ message: 'Passwords do not match' });
	}

	// password encryption
	const salt = await bcrypt.genSalt(10);
	user.password = await bcrypt.hash(newPassword, salt);
	try {
		await user.save();
		return res.json({ message: 'Password changed!' });
	} catch (error) {
		return res
			.status(400)
			.json({ message: 'Something went wrong! Please try again.' });
	}
});

// For forgot password (send email)
const forgotPassword = asyncHandler(async (req, res) => {
	const { email } = req.body;

	// check the user details
	if (!email) {
		return res.status(400).json({
			message: 'Please fill all the fields',
		});
	}

	// check email with regex
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!emailRegex.test(email)) {
		return res.status(400).json({
			message: 'Please enter a valid email',
		});
	}

	// Check if user exists with same email or username
	const user = await User.findOne({
		$or: [{ email: email }, { username: email }],
	});

	if (!user) {
		return res.status(400).json({
			message: 'User with this email does not exist.',
		});
	}

	const token = crypto.randomBytes(32).toString('hex');
	const resetPassword = await TokenModel.create({
		email: email,
		token: token,
	});

	const resetUrl = `${BASE_URL}/reset-password/${token}`;
	const message = `
		<html>
			<head>
				<title>Password Reset Request</title>
			</head>
			<body>
				<h1>You have requested a password reset</h1>
				<p>Please go to this link to reset your password</p>
					<button style="background-color: #4CAF50; border: none; color: white; padding: 15px 32px; text-align: center; display: inline-block; font-size: 16px;">
						<a href="${resetUrl}" target="_blank">${resetUrl}</a>
					</button>
				<p>If you did not request a password reset, please contact us immediately.</p>

				<p>Regards,</p>
				<p>Market Hub Team</p>
			</body>
		</html>
	`;
	try {
		await sendMail({
			To: email,
			Subject: 'Password Reset Request',
			HTMLPart: message,
		});

		return res.status(200).json({
			success: true,
			message: 'Email sent successfully.',
		});
	} catch (error) {
		console.log("--> Error: Can't send email", error);
		await TokenModel.findOneAndDelete({ token: resetPassword });
		return res.status(500).json({
			message: 'Email could not be sent',
		});
	}
});

// For reset password (change password)
const resetPassword = asyncHandler(async (req, res) => {
	const { resetToken } = req.params;

	const { newPassword, confirmPassword } = req.body;

	// check for any empty field
	if (!newPassword || !confirmPassword) {
		return res
			.status(400)
			.json({ message: 'Please fill all the fields' });
	}

	if (newPassword !== confirmPassword) {
		return res.status(400).json({ message: 'Passwords do not match' });
	}

	const token = await TokenModel.findOne({ token: resetToken });

	if (!token) {
		return res.status(400).json({ message: 'Invalid token' });
	}

	const user = await User.findOne({ email: token.email });

	if (!user) {
		return res.status(400).json({ message: 'User does not exist.' });
	}

	// password encryption
	const salt = await bcrypt.genSalt(10);
	user.password = await bcrypt.hash(newPassword, salt);

	await user.save();

	// delete token
	await TokenModel.deleteOne({ token: resetToken });

	// send email
	const message = `
		<h1>You have successfully reset your password</h1>
		<p>If you did not request a password reset, please contact us immediately.</p>

		<p>Regards,</p>
		<p>Team</p>
	`;
	try {
		await sendMail({
			To: user.email,
			Subject: 'Password Reset Successful',
			HTMLPart: message,
		});

		return res.status(200).json({
			success: true,
			message: 'Password changed!',
		});
	} catch (error) {
		console.log("--> Error: Can't send email", error);
		return res.status(500).json({
			message: 'Email could not be sent',
		});
	}
});

// ------------------------------ ADMIN ------------------------------

// Get all users
const getUsers = asyncHandler(async (req, res) => {
	const users = await User.find({}).populate('profile');
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

// Get all vendors
const getAllVendors = asyncHandler(async (req, res) => {
	const vendors = await User.find({ userType: 'Vendor' }).populate(
		'profile'
	);
	res.json(vendors);
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
	updatePassword,
	forgotPassword,
	resetPassword,
	validateAccount,
	logoutUser,
	uploadProfilePic,
	getAllVendors,
	sendVerifyEmail,
};
