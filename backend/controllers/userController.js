import User from '../models/userModel.js';
import asyncHandler from 'express-async-handler';
import generateToken from '../utils/generateToken.js';

// Check user email for login
const checkEmail = asyncHandler(async (req, res) => {
	const { email } = req.body;

	const user = await User.findOne({ email });

	if (user) {
		res.status(400).json({
			message: 'User already exists',
		});
		throw new Error('--> Error: User already exists');
	} else {
		res.status(200).json({
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
		res.status(400).json({
			message: 'Please fill all the fields',
		});
		throw new Error('--> Error: Invalid user data');
	}

	const user = await User.findOne({ email });

	if (user && (await user.matchPassword(password))) {
		res.json({
			_id: user._id,
			name: user.name,
			email: user.email,
			isAdmin: user.isAdmin,
			token: generateToken(user._id),
			message: 'User logged in successfully',
		});
	} else {
		res.status(401);
		throw new Error('--> Error: Invalid email or password');
	}
});

// Register a new user
const registerUser = asyncHandler(async (req, res) => {
	const { name, email, password } = req.body;

	// Check if user exists
	const userExists = await User.findOne({ email });

	if (userExists) {
		res.status(400).json({
			message: 'User already exists',
		});
		throw new Error('--> Error: User already exists');
	}

	// check the user details
	if (!name || !email || !password) {
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

	const user = await User.create({
		name,
		email,
		password,
		isAdmin: req.body.isAdmin || false,
	});

	if (user) {
		res.status(201).json({
			_id: user._id,
			name: user.name,
			email: user.email,
			isAdmin: user.isAdmin,
			token: generateToken(user._id),
			message: 'User created successfully',
		});
	} else {
		res.status(400).json({
			message: 'Something went wrong, please try again.',
		});
		throw new Error('--> Error: Invalid user data');
	}
});

// Get user profile
const getUserProfile = asyncHandler(async (req, res) => {
	const user = await User.findById(req.user._id);

	if (user) {
		res.json({
			_id: user._id,
			name: user.name,
			email: user.email,
			isAdmin: user.isAdmin,
		});
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

// Update user profile
const updateUserProfile = asyncHandler(async (req, res) => {
	const user = await User.findById(req.user._id);

	if (user) {
		user.name = req.body.name || user.name;
		user.email = req.body.email || user.email;
		if (req.body.password) {
			user.password = req.body.password;
		}

		const updatedUser = await user.save();

		res.json({
			_id: updatedUser._id,
			name: updatedUser.name,
			email: updatedUser.email,
			isAdmin: updatedUser.isAdmin,
			token: generateToken(updatedUser._id),
		});
	} else {
		res.status(401);
		throw new Error('--> Error: Invalid email or password');
	}
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

// Get all users
const getUsers = asyncHandler(async (req, res) => {
	const users = await User.find({});
	res.json(users);
});

// Get user by id
const getUserById = asyncHandler(async (req, res) => {
	const user = await User.findById(req.params.id).select('-password');

	if (user) {
		res.json(user);
	} else {
		res.status(404);
		throw new Error('--> Error: User not found');
	}
});

// Update user
const updateUser = asyncHandler(async (req, res) => {
	const user = await User.findById(req.params.id);

	if (user) {
		user.name = req.body.name || user.name;
		user.email = req.body.email || user.email;
		user.isAdmin =
			req.body.isAdmin === undefined ? user.isAdmin : req.body.isAdmin;

		const updatedUser = await user.save();

		res.json({
			_id: updatedUser._id,
			name: updatedUser.name,
			email: updatedUser.email,
			isAdmin: updatedUser.isAdmin,
			message: 'User updated successfully',
		});
	} else {
		res.status(404).json({
			message: 'User not found',
		});
		throw new Error('--> Error: User not found');
	}
});

export {
	authUser,
	registerUser,
	logoutUser,
	getUserProfile,
	updateUserProfile,
	getUsers,
	deleteUser,
	checkEmail,
	getUserById,
	updateUser,
};
