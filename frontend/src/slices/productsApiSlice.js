import { PRODUCTS_URL } from "../constants";
import { apiSlice } from "./apiSlice";

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
			keepUnusedDataFor: 5,
		}),
		getProductsByVendor: builder.query({
			query: (vendorId) => ({
				url: `${PRODUCTS_URL}/vendor/${vendorId}`,
			}),
			keepUnusedDataFor: 5,
		}),
		// createProduct: builder.mutation({
		// 	query: () => ({
		// 		url: `${PRODUCTS_URL}`,
		// 		method: 'POST',
		// 	}),
		// 	invalidatesTags: ['Product'],
		// }),
		// updateProduct: builder.mutation({
		// 	query: (data) => ({
		// 		url: `${PRODUCTS_URL}/${data.productId}`,
		// 		method: 'PUT',
		// 		body: data,
		// 	}),
		// 	invalidatesTags: ['Products'],
		// }),
		// uploadProductImage: builder.mutation({
		// 	query: (data) => ({
		// 		url: `/api/upload`,
		// 		method: 'POST',
		// 		body: data,
		// 	}),
		// }),
		// deleteProduct: builder.mutation({
		// 	query: (productId) => ({
		// 		url: `${PRODUCTS_URL}/${productId}`,
		// 		method: 'DELETE',
		// 	}),
		// 	providesTags: ['Product'],
		// }),
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
	// useCreateProductMutation,
	// useUpdateProductMutation,
	// useUploadProductImageMutation,
	// useDeleteProductMutation,
	// useGetTopProductsQuery,
} = productsApiSlice;
