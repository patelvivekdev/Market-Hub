import dotenv from 'dotenv';

import app from './index.js';

// dotenv config
dotenv.config();

// PORT INIT
const PORT = process.env.PORT || 5000;

// Listen
app.listen(PORT, () =>
	console.log(`--> Server running on: http://localhost:${PORT}`)
);
