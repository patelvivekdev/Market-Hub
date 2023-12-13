// Imports

import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import express from 'express';
import path from 'path';

import { forgotPassword } from './controllers/userController.js';
import categoryRoutes from './routes/categoryRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import connectDB from './db/db.js';

import { rateLimitMiddleware } from './middleware/rateLimitMiddleware.js';

// dotenv config
dotenv.config();

// PORT INIT
const PORT = process.env.PORT || 5000;

// Connect to db
connectDB();

// Init express
const app = express();

// Middleware
app.set('trust proxy', 1);
app.use(rateLimitMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/orders', orderRoutes);

app.post('reset-password', forgotPassword);

// PayPal
app.get('/api/v1/config/paypal', (req, res) =>
	res.send({ clientId: process.env.PAYPAL_CLIENT_ID })
);

if (process.env.NODE_ENV === 'PRODUCTION') {
	const __dirname = path.resolve();
	app.use(express.static(path.join(__dirname, '/frontend/build')));

	app.get('*', (req, res) =>
		res.sendFile(
			path.resolve(__dirname, 'frontend', 'build', 'index.html')
		)
	);
} else if (process.env.NODE_ENV === 'DEVELOPMENT') {
	const __dirname = path.resolve();
	app.get('/', (req, res) => {
		res.send('--> INFO: API is running....');
	});
} else {
	const __dirname = path.resolve();
	app.use(express.static(path.join(__dirname, '/frontend/build')));
	app.get('*', (req, res) =>
		res.sendFile(
			path.resolve(__dirname, 'frontend', 'build', 'index.html')
		)
	);
}

export default app;
