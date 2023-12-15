import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import FormContainer from '../../components/FormContainer';
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { useForgetPasswordMutation } from '../../slices/usersApiSlice';
import Loader from '../../components/Loader';

const ForgetPasswordForm = () => {
	const navigate = useNavigate();
	const [email, setEmail] = useState('');

	const [forgetPassword, { isLoading }] = useForgetPasswordMutation();


	const handleSubmit = async (e) => {
		e.preventDefault();

		// check if email is valid with regex
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return toast.error('Please enter a valid email address!', {
				toastId: 'forgetPasswordToastId',
				autoClose: 2000,
			});
		}

		try {
			await forgetPassword({ email }).unwrap();
			toast.success(`An email has been sent to ${email} with further instructions.`, {
				toastId: 'forgetPasswordToastId',
				autoClose: 2000,
			});
			navigate('/');
		} catch (error) {
			console.log(error);
			showErrorToast(
				error?.data?.message || error?.response?.data?.message || error?.data || error.data || 'Something went wrong! Please try again later.',
				'loginToastId'
			);
		}
	};

	const showErrorToast = (message, toastId) => {
		return toast.error(message, {
			toastId: toastId,
			autoClose: 2000,
		});

	};

	return (
		<FormContainer>
			{isLoading && <Loader />}
			<h2>Forget Password</h2>
			<Form onSubmit={handleSubmit}>
				<Form.Group className='my-2' controlId="formEmail">
					<Form.Label>Email:</Form.Label>
					<Form.Control
						type="email"
						value={email}
						placeholder="Enter email"
						disabled={isLoading}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>
				</Form.Group>
				<Button className='my-2' variant="primary" type="submit" disabled={isLoading}>
					Reset Password
				</Button>
			</Form>
		</FormContainer>
	);
};

export default ForgetPasswordForm;
