import { apiSlice } from './apiSlice';
import { PRODUCTS_URL } from '../constants';

export const productsApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getProducts: builder.query({
			query: () => ({
				url: PRODUCTS_URL,
			}),
			keepUnusedDataFor: 5,
		}),
		getProductDetails: builder.query({
			query: (productId) => ({
				url: `${PRODUCTS_URL}/${productId}`,
			}),
			providesTags: ['Product'],
			keepUnusedDataFor: 5,
		}),
		getProductsByVendor: builder.query({
			query: (vendorId) => ({
				url: `${PRODUCTS_URL}/vendor/${vendorId}`,
			}),
			keepUnusedDataFor: 5,
		}),
		getProductsByCategory: builder.query({
			query: (categoryId) => ({
				url: `${PRODUCTS_URL}/category/${categoryId}`,
			}),
			keepUnusedDataFor: 5,
		}),
		createProduct: builder.mutation({
			query: (data) => ({
				url: `${PRODUCTS_URL}`,
				method: 'POST',
				body: data,
			}),
			invalidatesTags: ['Product'],
		}),
		updateProduct: builder.mutation({
			query: (data) => ({
				url: `${PRODUCTS_URL}/${data.productId}`,
				method: 'PUT',
				body: data,
			}),
			invalidatesTags: ['Product'],
		}),
		changeProductImage: builder.mutation({
			query: (data) => ({
				url: `${PRODUCTS_URL}/${data.productId}/image`,
				method: 'PUT',
				body: data,
			}),
			invalidatesTags: ['Product'],
		}),
		deleteProduct: builder.mutation({
			query: (productId) => ({
				url: `${PRODUCTS_URL}/${productId}`,
				method: 'DELETE',
			}),
			providesTags: ['Product'],
		}),
		// getTopProducts: builder.query({
		// 	query: () => `${PRODUCTS_URL}/top`,
		// 	keepUnusedDataFor: 5,
		// }),
	}),
});

export const {
	useGetProductsQuery,
	useGetProductDetailsQuery,
	useGetProductsByVendorQuery,
	useGetProductsByCategoryQuery,
	useCreateProductMutation,
	useUpdateProductMutation,
	useChangeProductImageMutation,
	useDeleteProductMutation,
	// useGetTopProductsQuery,
} = productsApiSlice;
