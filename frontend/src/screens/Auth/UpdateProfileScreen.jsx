import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';

const UpdateProfileScreen = () => {
	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [errorMessage, setErrorMessage] = useState('');

	const handleProfileUpdate = async () => {
		// Check if passwords match
		if (password !== confirmPassword) {
			setErrorMessage("Passwords don't match.");
			return;
		}

		try {
			// Perform API call to update user profile
			const response = await fetch('/api/update-profile', {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ username, email, password }),
			});

			if (response.ok) {
				// Clear form fields and display success message
				setUsername('');
				setEmail('');
				setPassword('');
				setConfirmPassword('');
				setErrorMessage('');
				alert('Profile updated successfully!');
			} else {
				const errorData = await response.json();
				setErrorMessage(errorData.message || 'Failed to update profile.');
			}
		} catch (error) {
			console.error('Error updating profile:', error);
			setErrorMessage('Failed to update profile. Please try again.');
		}
	};

	return (
		<div>
			<h2>Update Profile</h2>
			{errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
			<Form>
				<Form.Group controlId="username">
					<Form.Label>Username</Form.Label>
					<Form.Control
						type="text"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
					/>
				</Form.Group>

				<Form.Group controlId="email">
					<Form.Label>Email</Form.Label>
					<Form.Control
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
				</Form.Group>

				<Form.Group controlId="password">
					<Form.Label>Password</Form.Label>
					<Form.Control
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
				</Form.Group>

				<Form.Group controlId="confirmPassword">
					<Form.Label>Confirm Password</Form.Label>
					<Form.Control
						type="password"
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
					/>
				</Form.Group>

				<Button variant="primary" onClick={handleProfileUpdate}>
					Update Profile
				</Button>
			</Form>
		</div>
	);
};

export default UpdateProfileScreen;
