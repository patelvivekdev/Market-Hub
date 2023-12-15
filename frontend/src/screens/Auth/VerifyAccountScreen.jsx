import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useParams, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import Loader from '../../components/Loader';
import FormContainer from '../../components/FormContainer';
import { useVerifyMutation } from '../../slices/usersApiSlice';

const VerifyAccountScreen = () => {
	const { verifyToken } = useParams();

	const navigate = useNavigate();

	const [verify, { isLoading }] = useVerifyMutation();

	const showErrorToast = (message, toastId) => {
		return toast.error(message, {
			toastId: toastId,
			autoClose: 2000,
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			await verify({ verifyToken }).unwrap();
			toast.success(`Password reset successfully.`, {
				toastId: 'resetPasswordToastId',
				autoClose: 2000,
			});
			navigate('/');
		} catch (error) {
			showErrorToast(
				error?.data?.message || error?.response?.data?.message || error?.data || 'Something went wrong while login! Please try again later.',
				'resetPasswordToastId'
			);
		}
	};

	return (
		<FormContainer>
			{isLoading && <Loader />}
			<h2>Verify Account</h2>
			<Form onSubmit={handleSubmit}>
				<Button className='my-2' variant="primary" type="submit" disabled={isLoading}>
					Submit
				</Button>
			</Form>
		</FormContainer>
	);
};

export default VerifyAccountScreen;
