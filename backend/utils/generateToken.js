import jwt from 'jsonwebtoken';

const generateToken = (id, userType) => {
	return jwt.sign({ id, userType }, process.env.JWT_SECRET, {
		expiresIn: '30d',
	});
};

export default generateToken;
