export const BASE_URL =
	process.env.NODE_ENV === 'DEVELOPMENT'
		? process.env.BASE_URL_DEV
		: process.env.NODE_ENV === 'PRODUCTION'
		? process.env.BASE_URL_PROD
		: process.env.BASE_URL_TEST;

export const PRODUCTS_URL = '/api/v1/products';
export const USERS_URL = '/api/v1/users';
export const CATEGORIES_URL = '/api/v1/categories';
