import { CATEGORIES_URL } from '../constants';
import { apiSlice } from './apiSlice';

export const categoriesApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getCategories: builder.query({
			query: () => CATEGORIES_URL,
			keepUnusedDataFor: 5,
		}),

		createCategory: builder.mutation({
			query: (data) => ({
				url: CATEGORIES_URL,
				method: 'POST',
				body: data,
			}),
			invalidatesTags: ['Category'],
		}),

		getCategoryById: builder.query({
			query: (categoryId) => `${CATEGORIES_URL}/${categoryId}`,
		}),

		updateCategory: builder.mutation({
			query: (data) => ({
				url: `${CATEGORIES_URL}/${data.categoryId}`,
				method: 'PUT',
				body: data,
			}),
			invalidatesTags: ['Categories'],
		}),

		deleteCategory: builder.mutation({
			query: (categoryId) => ({
				url: `${CATEGORIES_URL}/${categoryId}`,
				method: 'DELETE',
			}),
			providesTags: ['Category'],
		}),

		getProductsByCategory: builder.query({
			query: (categoryId) =>
				`${CATEGORIES_URL}/${categoryId}/products`,
		}),
	}),
});

export const {
	useGetCategoriesQuery,
	useGetCategoryByIdQuery,
	useCreateCategoryMutation,
	useUpdateCategoryMutation,
	useDeleteCategoryMutation,
	useGetProductsByCategoryQuery,
} = categoriesApiSlice;
