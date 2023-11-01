import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '../constants.js';

export const apiSlice = createApi({
	baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
	tagTypes: ['Product', 'User'],
	endpoints: (builder) => ({}),
});
