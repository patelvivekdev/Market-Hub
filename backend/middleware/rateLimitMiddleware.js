import { rateLimit } from 'express-rate-limit';

const rateLimitMiddleware = rateLimit({
	windowMs: 10 * 60 * 1000, // 10 minutes
	max: 100, // limit each IP to 100 requests per windowMs
	message: 'Too many requests from this IP, please try again later in 10 minutes',
});

const loginRateLimitMiddleware = rateLimit({
	windowMs: 20 * 60 * 1000, // 20 minutes
	max: 10, // limit each IP to 3 requests per windowMs
	message: 'Too many requests from this IP, please try again later in 30 minutes',
});

const resetPasswordRateLimitMiddleware = rateLimit({
	windowMs: 10 * 60 * 1000, // 10 minutes
	max: 3, // limit each IP to 3 requests per windowMs
	message: 'Too many requests from this IP, please try again later in 10 minutes',
});

const forgotPasswordRateLimitMiddleware = rateLimit({
	windowMs: 10 * 60 * 1000, // 10 minutes
	max: 3, // limit each IP to 3 requests per windowMs
	message: 'Too many requests from this IP, please try again later in 10 minutes',
});

const registerRateLimitMiddleware = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 3, // limit each IP to 3 requests per windowMs
	message: 'Too many requests from this IP, please try again later in 15 minutes',
});

export {
	rateLimitMiddleware,
	resetPasswordRateLimitMiddleware,
	forgotPasswordRateLimitMiddleware,
	loginRateLimitMiddleware,
	registerRateLimitMiddleware,
};
