// Imports
import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// dotenv config
dotenv.config();

// PORT INIT
const PORT = process.env.PORT || 5000;

// Connect to db
try {
	const conn = await mongoose.connect(process.env.MONGO_URI);
	console.log(`--> MongoDB Connected: ${conn.connection.host}`);
} catch (error) {
	console.error(`--> Error: ${error.message}`);
	process.exit(1);
}

// Init express
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes

// Listen
app.listen(PORT, () => console.log(`--> Server running on port: ${PORT}`));
