import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useChangePasswordMutation } from '../../slices/usersApiSlice';
import FormContainer from '../../components/FormContainer';
import Loader from '../../components/Loader';


const ChangePasswordScreen = () => {
	const [currentPassword, setCurrentPassword] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');

	const navigate = useNavigate();
	const [changePassword, { isLoading }] = useChangePasswordMutation();


	const showErrorToast = (message, toastId) => {
		return toast.error(message, {
			toastId: toastId,
			autoClose: 2000,
		});
	};

	const handlePasswordChange = async (e) => {
		e.preventDefault();

		// Check if passwords are empty
		if (!currentPassword || !newPassword || !confirmPassword) {
			return toast.error('Please fill all the fields!', {
				toastId: 'changePasswordToastId',
				autoClose: 2000,
			});
		}

		// check  password with regex
		const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm;
		if (!passwordRegex.test(newPassword)) {
			return toast.error('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter and one number!', {
				toastId: 'changePasswordToastId',
				autoClose: 2000,
			});
		}

		// You might want to add validation here to ensure passwords match and meet criteria
		if (newPassword !== confirmPassword) {
			return toast.error('Passwords do not match!', {
				toastId: 'changePasswordToastId',
				autoClose: 2000,
			});
		}

		// Perform the API call to change the password
		try {
			await changePassword({ currentPassword, newPassword, confirmPassword }).unwrap();
			toast.success(`Password changed successfully.`, {
				toastId: 'changePasswordToastId',
				autoClose: 2000,
			});
			// navigate to back 
			navigate(-1);
		} catch (error) {
			showErrorToast(
				error?.data?.message || error?.response?.data?.message || error?.data || 'Something went wrong while login! Please try again later.',
				'changePasswordToastId'
			);
		}
	};

	return (
		<FormContainer>
			{isLoading && <Loader />}
			<h2>Change Password</h2>
			<Form onSubmit={handlePasswordChange}>
				<Form.Group className='my-2' controlId="currentPassword">
					<Form.Label>Current Password</Form.Label>
					<Form.Control
						type="password"
						value={currentPassword}
						disabled={isLoading}
						onChange={(e) => setCurrentPassword(e.target.value)}
					/>
				</Form.Group>

				<Form.Group className='my-2' controlId="newPassword">
					<Form.Label>New Password</Form.Label>
					<Form.Control
						type="password"
						value={newPassword}
						disabled={isLoading}
						onChange={(e) => setNewPassword(e.target.value)}
					/>
				</Form.Group>

				<Form.Group className='my-2' controlId="confirmPassword">
					<Form.Label>Confirm New Password</Form.Label>
					<Form.Control
						type="password"
						value={confirmPassword}
						disabled={isLoading}
						onChange={(e) => setConfirmPassword(e.target.value)}
					/>
				</Form.Group>

				<Button className='my-2' variant="primary" type="submit" disabled={isLoading}>
					Change Password
				</Button>
			</Form>
		</FormContainer>
	);
};

export default ChangePasswordScreen;
