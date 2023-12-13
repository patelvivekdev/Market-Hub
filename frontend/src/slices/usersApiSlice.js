import { USERS_URL } from '../constants';
import { apiSlice } from './apiSlice';

export const userApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		checkEmail: builder.mutation({
			query: (email) => ({
				url: `${USERS_URL}/check`,
				method: 'POST',
				body: email,
			}),
		}),
		login: builder.mutation({
			query: (data) => ({
				url: `${USERS_URL}/auth`,
				method: 'POST',
				body: data,
			}),
		}),
		register: builder.mutation({
			query: (data) => ({
				url: `${USERS_URL}`,
				method: 'POST',
				body: data,
			}),
		}),
		logout: builder.mutation({
			query: () => ({
				url: `${USERS_URL}/logout`,
				method: 'POST',
			}),
		}),
		verify: builder.mutation({
			query: (verifyToken) => ({
				url: `${USERS_URL}/verify/${verifyToken}`,
				method: 'POST',
			}),
		}),
		getUserProfile: builder.query({
			query: () => ({
				url: `${USERS_URL}/profile`,
			}),
			providesTags: ['User'],
			keepUnusedDataFor: 5,
		}),
		profile: builder.mutation({
			query: (data) => ({
				url: `${USERS_URL}/profile`,
				method: 'PUT',
				body: data,
			}),
		}),
		getUsers: builder.query({
			query: () => ({
				url: USERS_URL,
			}),
			providesTags: ['User'],
			keepUnusedDataFor: 5,
		}),
		deleteUser: builder.mutation({
			query: (userId) => ({
				url: `${USERS_URL}/${userId}`,
				method: 'DELETE',
			}),
		}),
		getUserDetails: builder.query({
			query: (id) => ({
				url: `${USERS_URL}/${id}`,
			}),
			keepUnusedDataFor: 5,
		}),
		updateUser: builder.mutation({
			query: (data) => ({
				url: `${USERS_URL}/${data.userId}`,
				method: 'PUT',
				body: data,
			}),
			invalidatesTags: ['User'],
		}),
		forgetPassword: builder.mutation({
			query: (email) => ({
				url: `${USERS_URL}/forgot-password`,
				method: 'POST',
				body: email,
			}),
		}),
		resetPassword: builder.mutation({
			query: (data) => ({
				url: `${USERS_URL}/reset-password/${data.resetToken}`,
				method: 'POST',
				body: data,
			}),
		}),
		changePassword: builder.mutation({
			query: (data) => ({
				url: `${USERS_URL}/profile/password`,
				method: 'PUT',
				body: data,
			}),
		}),
		uploadProfilePic: builder.mutation({
			query: (data) => ({
				url: `${USERS_URL}/profile/pic`,
				method: 'PUT',
				body: data,
			}),
		}),
		getAllVendors: builder.query({
			query: () => ({
				url: `${USERS_URL}/vendors`,
			}),
			providesTags: ['User'],
			keepUnusedDataFor: 5,
		}),
	}),
});

export const {
	useCheckEmailMutation,
	useLoginMutation,
	useLogoutMutation,
	useRegisterMutation,
	useProfileMutation,
	useGetUsersQuery,
	useGetUserProfileQuery,
	useDeleteUserMutation,
	useUpdateUserMutation,
	useGetUserDetailsQuery,
	useVerifyMutation,
	useForgetPasswordMutation,
	useResetPasswordMutation,
	useChangePasswordMutation,
	useUploadProfilePicMutation,
	useGetAllVendorsQuery,
} = userApiSlice;
