import request from 'supertest';
import app from './../index.js';

describe('User Controller', () => {
	test('should check if email exists', async () => {
		await request(app)
			.post('/api/v1/users/check')
			.send({ email: 'vpatel6433@conestogac.on.ca' })
			.expect(200);
	});
	test('should not authenticate user', async () => {
		await request(app)
			.post('/api/v1/users/auth')
			.send({
				email: 'vpatel6433@conestogac.on.ca',
				password: '123456789',
			})
			.expect(401);
	});
	test('should authenticate user', async () => {
		await request(app)
			.post('/api/v1/users/auth')
			.send({
				email: 'vpatel6433@conestogac.on.ca',
				password: 'Admin@@0203',
			})
			.expect(200);
	});

	test('should logout user', async () => {
		await request(app).post('/api/v1/users/logout').expect(200);
	});
});
