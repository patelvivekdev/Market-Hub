// Imports
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';

import userRoutes from './routes/userRoutes.js';

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

app.use(cors());
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/api/v1/users', userRoutes);

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
