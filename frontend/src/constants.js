export const BASE_URL =
	process.env.NODE_ENV === 'development'
		? ''
		: 'https://market-hub.onrender.com';

export const PRODUCTS_URL = '/api/v1/products';
export const USERS_URL = '/api/v1/users';
