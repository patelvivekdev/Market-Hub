import jwt from 'jsonwebtoken';

const generateToken = (res, id, userType) => {
	const token = jwt.sign({ id, userType }, process.env.JWT_SECRET, {
		expiresIn: '30d',
	});

	// Set JWT as an HTTP-Only cookie
	res.cookie('jwt', token, {
		httpOnly: true,
		secure: process.env.NODE_ENV !== 'development',
		sameSite: 'strict',
		maxAge: 30 * 24 * 60 * 60 * 1000,
	});
};

export default generateToken;
