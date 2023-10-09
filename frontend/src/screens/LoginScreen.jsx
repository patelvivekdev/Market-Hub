import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Container, Modal, Button, Form } from 'react-bootstrap';
import FormContainer from '../components/FormContainer';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';
import axios from 'axios';


const LoginScreen = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	// for isLoading state
	const [isLoading, setIsLoading] = useState(false);

	// for isError state
	const [isError, setIsError] = useState(false);

	// set toast id
	const customId = "loginToastId";

	const showToast = (message) => {
		toast.error(message, {
			toastId: customId,
			autoClose: false,
			onOpen: () => {
				setIsError(true);
				setIsLoading(true);
			},
			onClose: clearLoadingState
		});
	}

	const clearLoadingState = () => {
		setIsError(false);
		setIsLoading(false);
	}


	const submitHandler = async (e) => {
		e.preventDefault();

		if (!email || !password) {
			showToast('Please fill in all fields!');
			return;
		}

		// check email format
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			showToast('Please enter a valid email address!');
			return
		}

		if (!isError) {
			try {
				const BASE_URL = 'https://market-hub.onrender.com/api/v1';
				const config = {
					headers: {
						'Content-Type': 'application/json',
					},
				};

				const { data } = await axios.post(
					BASE_URL +
					'/users/auth',
					{ email, password },
					config
				);

				if (data) {
					localStorage.setItem('userInfo', JSON.stringify(data));
					toast.success('Login successful');
					// clear form
					setEmail('');
					setPassword('');
					if (data.userType === 'Admin') {
						window.location.href = '/products';
					} else {
						window.location.href = '/';
					}
				}
			} catch (err) {
				toast.error(err?.data?.message || err?.response?.data?.message || 'Something went wrong while login! Please try again later.');
			}
			finally {
				setIsLoading(false);
			}
		}
	};

	return (
		<FormContainer>
			<h1>Sign In</h1>

			<Form onSubmit={submitHandler}>
				<Form.Group className='my-2' controlId='email'>
					<Form.Label>Email Address</Form.Label>
					<Form.Control
						type='email'
						placeholder='Enter email'
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					></Form.Control>
				</Form.Group>

				<Form.Group className='my-2' controlId='password'>
					<Form.Label>Password</Form.Label>
					<Form.Control
						type='password'
						placeholder='Enter password'
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					></Form.Control>
				</Form.Group>

				<Button type='submit' variant='primary'>
					Sign In
				</Button>

				{isLoading && <Loader />}
			</Form>

			<Row className='py-3'>
				<Col>
					New Customer?{' '}
					<Button
						variant='light'
						className='btn btn-outline-primary ms-2'
						onClick={() => window.location.href = 'Client/register'}
					>
						Register as Client
					</Button>{' '}
					or{' '}
					<Button
						variant='light'
						className='btn btn-outline-secondary ms-2'
						onClick={() => window.location.href = 'Vendor/register'}
					>
						Register as vendor
					</Button>
				</Col>
			</Row>
		</FormContainer>
	);
};

export default LoginScreen;
