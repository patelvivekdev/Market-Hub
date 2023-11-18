import FormContainer from "../../components/FormContainer";
import Loader from "../../components/Loader";
import { useEffect, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { setCredentials } from "../../slices/authSlice";
import { useLoginMutation } from "../../slices/usersApiSlice";
import { resetCart } from "../../slices/cartSlice";

const LoginScreen = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [login, { isLoading }] = useLoginMutation();
	const { userInfo } = useSelector((state) => state.auth);
	const { search } = useLocation();
	const searchParams = new URLSearchParams(search);
	const redirect = searchParams.get('redirect');

	useEffect(() => {
		if (userInfo) {
			switch (userInfo.userType) {
				case 'Admin':
					navigate('/');
					break;
				case 'Client':
					navigate(redirect || '/');
					break;
				case 'Vendor':
					navigate('/Vendor/products');
					break;
				default:
					break;
			}
		}
	}, [navigate, redirect, userInfo]);

	const showErrorToast = (message, toastId) => {
		toast.error(message, {
			toastId: toastId,
			autoClose: 2000,
		});
	};

	const submitHandler = async (e) => {
		e.preventDefault();

		if (!email || !password) {
			showErrorToast('Please fill in all fields!', 'loginToastId');
			return;
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			showErrorToast('Please enter a valid email address!', 'loginToastId');
			return;
		}

		try {
			const res = await login({ email, password }).unwrap();

			if (redirect === '/shipping' && res.userType !== 'Client') {
				showErrorToast('You are not authorized to access this page!', 'loginToastId3');
				return;
			}

			const successMessage = 'Login successful';
			toast.success(successMessage, {
				toastId: 'loginToastId2',
			});

			dispatch(setCredentials({ ...res }));

			switch (res.userType) {
				case 'Admin':
					dispatch(resetCart());
					navigate('/');
					break;
				case 'Vendor':
					dispatch(resetCart());
					navigate('/Vendor/products');
					break;
				default:
					navigate(redirect);
					break;
			}
		} catch (err) {
			showErrorToast(
				err?.data?.message || err?.response?.data?.message || 'Something went wrong while login! Please try again later.',
				'loginToastId'
			);
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
						disabled={isLoading}
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
				</Form.Group>
				<Form.Group className='my-2' controlId='password'>
					<Form.Label>Password</Form.Label>
					<Form.Control
						type='password'
						disabled={isLoading}
						placeholder='Enter password'
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
				</Form.Group>
				<Button type='submit' variant='primary' disabled={isLoading}>
					Sign In
				</Button>
				{isLoading && <Loader />}
			</Form>
			<Row className='py-3'>
				<Col>
					Not remember Password?{' '}

					<Button
						variant='light'
						className='btn btn-outline-primary ms-2'
						onClick={() =>
							redirect ? navigate(`/forget-password?redirect=${redirect}`) : navigate('/forget-password')
						}
					>
						Forget Password
					</Button>{' '}
				</Col>
			</Row>
			<Row className='py-3'>
				<Col>
					New Customer?{' '}
					<Button
						variant='light'
						className='btn btn-outline-primary ms-2'
						onClick={() =>
							redirect ? navigate(`/Client/register?redirect=${redirect}`) : navigate('/Client/register')
						}
					>
						Register as Client
					</Button>{' '}
					or{' '}
					<Button
						variant='light'
						className='btn btn-outline-secondary ms-2'
						onClick={() => {
							if (redirect === '/shipping') {
								showErrorToast('Please login as a Client to continue!', 'loginToastId3');
							} else {
								redirect ? navigate(`/Vendor/register?redirect=${redirect}`) : navigate('/Vendor/register');
							}
						}}
					>
						Register as vendor
					</Button>
				</Col>
			</Row>
		</FormContainer>
	);
};

export default LoginScreen;
