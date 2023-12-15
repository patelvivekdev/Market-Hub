import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useParams, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import Loader from '../../components/Loader';
import FormContainer from '../../components/FormContainer';
import { useResetPasswordMutation } from '../../slices/usersApiSlice';

const ResetPasswordForm = () => {
	const { resetToken } = useParams();

	const navigate = useNavigate();
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');

	const [resetPassword, { isLoading }] = useResetPasswordMutation();


	const showErrorToast = (message, toastId) => {
		return toast.error(message, {
			toastId: toastId,
			autoClose: 2000,
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		// check if password is valid with regex
		const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm;
		if (!passwordRegex.test(password)) {
			return toast.error('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter and one number!', {
				toastId: 'resetPasswordToastId',
				autoClose: 2000,
			});
		}

		if (password !== confirmPassword) {
			return toast.error('Passwords do not match!', {
				toastId: 'resetPasswordToastId',
				autoClose: 2000,
			});
		}

		try {
			await resetPassword({ resetToken, newPassword: password, confirmPassword: confirmPassword }).unwrap();
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
			<h2>Reset Password</h2>
			<Form onSubmit={handleSubmit}>
				<Form.Group className='my-2' controlId="formPassword">
					<Form.Label>New Password:</Form.Label>
					<Form.Control
						type="password"
						value={password}
						disabled={isLoading}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>
				</Form.Group>
				<Form.Group className='my-2' controlId="formConfirmPassword">
					<Form.Label>Confirm Password:</Form.Label>
					<Form.Control
						type="password"
						value={confirmPassword}
						disabled={isLoading}
						onChange={(e) => setConfirmPassword(e.target.value)}
						required
					/>
				</Form.Group>
				<Button className='my-2' variant="primary" type="submit" disabled={isLoading}>
					Submit
				</Button>
			</Form>
		</FormContainer>
	);
};

export default ResetPasswordForm;
