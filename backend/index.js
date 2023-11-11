import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import path from 'path';

import { forgotPassword } from './controllers/userController.js';
import categoryRoutes from './routes/categoryRoutes.js';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';

// Imports

// dotenv config
dotenv.config();

// PORT INIT
const PORT = process.env.PORT || 5000;

// Connect to db
try {
	const conn = await mongoose.connect(process.env.MONGO_URI);
	console.log(`--> INFO: MongoDB Connected: ${conn.connection.host}`);
} catch (error) {
	console.error(`--> Error: ${error.message}`);
	process.exit(1);
}

// Init express
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/categories', categoryRoutes);

app.post('reset-password', forgotPassword);

if (process.env.NODE_ENV === 'production') {
	const __dirname = path.resolve();
	app.use(express.static(path.join(__dirname, '/frontend/build')));

	app.get('*', (req, res) =>
		res.sendFile(
			path.resolve(__dirname, 'frontend', 'build', 'index.html')
		)
	);
} else {
	const __dirname = path.resolve();
	app.get('/', (req, res) => {
		res.send('API is running....');
	});
}

// Listen
app.listen(PORT, () =>
	console.log(`--> Server running on: http://localhost:${PORT}`)
);

export default app;
