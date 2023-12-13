import request from 'supertest';
import app from './../index.js';
import User from './../models/userModel.js';
import Client from './../models/clientModel.js';
import Vendor from './../models/vendorModel.js';

// Mock user data
const userData = {
	username: 'testUser',
	email: 'testuser@example.com',
	password: 'Test@1234',
	userType: 'Client',
	profile: {
		name: 'Test User',
		phone: '1234567890',
		address: '123 Test Street',
	},
};

beforeEach(async () => {
	// connect to test db
	await mongoose.connect(process.env.MONGO_URI_TEST, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
	});

	// delete test user with email if exists in db
	await User.deleteOne({ email: userData.email });
});

describe('User Controller', () => {
	test('should check if email exists', async () => {
		await request(app)
			.post('/api/users/checkEmail')
			.send({ email: userData.email })
			.expect(200);
	});

	test('should authenticate user', async () => {
		await request(app)
			.post('/api/users/login')
			.send({ email: userData.email, password: userData.password })
			.expect(200);
	});

	test('should register a new user', async () => {
		await request(app)
			.post('/api/users/register')
			.send(userData)
			.expect(200);
	});

	test('should logout user', async () => {
		await request(app).post('/api/users/logout').expect(200);
	});

	test('should get user profile', async () => {
		const res = await request(app)
			.post('/api/users/register')
			.send(userData);

		const user = res.body;

		await request(app).get(`/api/users/profile/${user._id}`).expect(200);
	});

	test('should update user profile', async () => {
		const res = await request(app)
			.post('/api/users/register')
			.send(userData);

		const user = res.body;

		await request(app)
			.put(`/api/users/profile/${user._id}`)
			.send({ username: 'updatedUser' })
			.expect(200);
	});

	test('should upload profile picture', async () => {
		const res = await request(app)
			.post('/api/users/register')
			.send(userData);

		const user = res.body;

		await request(app)
			.post(`/api/users/profile/${user._id}/upload`)
			.attach('file', 'path/to/image.jpg')
			.expect(200);
	});
});
