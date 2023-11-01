import authReducer from './slices/authSlice';
import cartSliceReducer from './slices/cartSlice';
import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './slices/apiSlice';

const store = configureStore({
	reducer: {
		[apiSlice.reducerPath]: apiSlice.reducer,
		cart: cartSliceReducer,
		auth: authReducer,
	},
	middleware: (getDefaultMiddleware) => {
		return getDefaultMiddleware().concat(apiSlice.middleware);
	},
	devTools: process.env.NODE_ENV !== 'production',
});

export default store;
