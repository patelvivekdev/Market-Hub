import request from 'supertest';
import app from './../index.js';

describe('Product Controller', () => {
	test('get all products', async () => {
		await request(app).get('/api/v1/products').expect(200);
	});

	test('get product details by id', async () => {
		await request(app)
			.get('/api/v1/products/6579745792b33fbf368722be')
			.expect(200);
	});
});
