import FormContainer from "../../components/FormContainer";
import Loader from "../../components/Loader";
import { useEffect, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { setCredentials } from "../../slices/authSlice";
import { useCheckEmailMutation, useRegisterMutation } from "../../slices/usersApiSlice";

const RegisterScreen = () => {
	// access the params passed in the url
	const { userType } = useParams();

	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');

	// User Profile details
	const [name, setName] = useState('');
	const [address, setAddress] = useState('');
	const [phone, setPhone] = useState('');

	// Vendor Profile details
	const [description, setDescription] = useState('');
	const [website, setWebsite] = useState('');

	const dispatch = useDispatch();
	const navigate = useNavigate();

	// check for userType ( Client, Vendor, Admin) are valid
	if (!['Client', 'Vendor', 'Admin'].includes(userType)) {
		toast.error('Invalid user type', {
			onClose: () => {
				navigate('/');
			}
		});
	}

	const [register, { isLoading }] = useRegisterMutation();

	const [isEmailValid, { isLoading: isEmailValidLoading }] = useCheckEmailMutation();

	const { userInfo } = useSelector((state) => state.auth);

	const { search } = useLocation();
	const searchParams = new URLSearchParams(search);
	const redirect = searchParams.get('redirect') || '/';

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


	// set toast id
	const customId = "registerToastId";

	const showErrorToast = (message) => {
		toast.error(message, {
			toastId: customId,
			autoClose: 2000,
		});
	}

	const submitHandler = async (e) => {
		e.preventDefault();

		// Check user input
		if (!username || !email || !password || !confirmPassword) {
			showErrorToast('Please fill in all fields');
			return
		}

		// check email format
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			showErrorToast('Please enter a valid email address');
			return
		}

		// check if email already exists
		try {
			const res = await isEmailValid({ email }).unwrap();
			if (res.found === true) {
				showErrorToast('Email already exists. Please try again with a different email address.');
				return
			}
		} catch (error) {
			showErrorToast(error?.data?.message || error?.response?.data?.message || error.data || 'Something went wrong while checking email! Please try again later.');
			return
		}

		// check password regex (at least 8 characters long, contain at least 1 uppercase letter, 1 lowercase letter, and 1 number)
		const passwordRegex =
			/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm;
		if (!passwordRegex.test(password)) {
			showErrorToast('Password must be at least 8 characters long, contain at least 1 uppercase letter, 1 lowercase letter, and 1 number');
			return
		}

		// check if passwords match
		if (password !== confirmPassword) {
			showErrorToast('Passwords do not match');
			return
		}

		try {
			const userData = {
				username, email, password, userType, profile: {
					name,
					address,
					phone,
				}
			};
			const res = await register(userData).unwrap();

			const successMessage = 'Registration successful';
			toast.success(successMessage, {
				toastId: customId,
			});

			dispatch(setCredentials({ ...res }));

			switch (res.userType) {
				case 'Admin':
					navigate('/');
					break;
				case 'Vendor':
					navigate('/Vendor/products');
					break;
				default:
					navigate(redirect);
					break;
			}
		} catch (error) {
			showErrorToast(error?.data?.message || error?.response?.data?.message || error.data || 'Something went wrong while registering! Please try again later.');
		}
	};

	return (
		<FormContainer>

			{isEmailValidLoading && <Loader />}
			{isLoading && <Loader />}
			<h1>Register New {userType}</h1>
			<Form onSubmit={submitHandler}>
				<Form.Group className='my-2' controlId='username'>
					<Form.Label>Username</Form.Label>
					<Form.Control
						type='name'
						disabled={isLoading}
						placeholder='Enter username'
						value={username}
						onChange={(e) => {
							setUsername(e.target.value);
						}}
					></Form.Control>
				</Form.Group>

				<Form.Group className='my-2' controlId='email'>
					<Form.Label>Email Address</Form.Label>
					<Form.Control
						type='email'
						disabled={isLoading}
						placeholder='Enter email'
						value={email}
						onChange={
							(e) => setEmail(e.target.value)
						}
					></Form.Control>
				</Form.Group>

				<Form.Group className='my-2' controlId='password'>
					<Form.Label>Password</Form.Label>
					<Form.Control
						type='password'
						placeholder='Enter password'
						disabled={isLoading}
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						aria-describedby="passwordHelpBlock"
					></Form.Control>
					<Form.Text id="passwordHelpBlock" muted>
						Your password must be at least 8 characters long, contain at least 1 uppercase letter, 1 lowercase letter, and 1 number.
					</Form.Text>
				</Form.Group>
				<Form.Group className='my-2' controlId='confirmPassword'>
					<Form.Label>Confirm Password</Form.Label>
					<Form.Control
						type='password'
						placeholder='Confirm password'
						disabled={isLoading}
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
					></Form.Control>
				</Form.Group>
				{/* Based on userType different form should be shown */}
				{
					/* 
						userType: Client
						Client details: clientName, phone
					 */
				}
				{userType === 'Client' && (
					<>
						<Form.Group className='my-2' controlId='name'>
							<Form.Label>{userType}Name</Form.Label>
							<Form.Control
								type='name'
								placeholder='Enter Full Name'
								disabled={isLoading}
								value={name}
								onChange={(e) => setName(e.target.value)}
							></Form.Control>
						</Form.Group>
						<Form.Group className='my-2' controlId='phone'>
							<Form.Label>Phone</Form.Label>
							<Form.Control
								type='phone'
								placeholder='Enter phone'
								disabled={isLoading}
								value={phone}
								aria-describedby="phoneHelpBlock"
								onChange={(e) => setPhone(e.target.value)}
							></Form.Control>
							<Form.Text id="phoneHelpBlock" muted>
								Phone number must be unique.
							</Form.Text>
						</Form.Group>
					</>
				)}
				{
					/* 
						userType: Vendor
						Client details: vendorName, phone, address, description, website
					 */
				}
				{userType === 'Vendor' && (
					<>
						<Form.Group className='my-2' controlId='name'>
							<Form.Label>{userType} Name</Form.Label>
							<Form.Control
								type='name'
								placeholder='Enter name'
								disabled={isLoading}
								value={name}
								onChange={(e) => setName(e.target.value)}
							></Form.Control>
						</Form.Group>
						<Form.Group className='my-2' controlId='address'>
							<Form.Label>Address</Form.Label>
							<Form.Control
								type='address'
								placeholder='Enter address'
								disabled={isLoading}
								value={address}
								onChange={(e) => setAddress(e.target.value)}
							></Form.Control>
						</Form.Group>
						<Form.Group className='my-2' controlId='phone'>
							<Form.Label>Phone</Form.Label>
							<Form.Control
								type='phone'
								placeholder='Enter phone'
								disabled={isLoading}
								value={phone}
								aria-describedby="phoneHelpBlock"
								onChange={(e) => setPhone(e.target.value)}
							></Form.Control>
							<Form.Text id="phoneHelpBlock" muted>
								Phone number must be unique.
							</Form.Text>
						</Form.Group>
						<Form.Group className='my-2' controlId='description'>
							<Form.Label>Description</Form.Label>
							<Form.Control
								type='description'
								placeholder='Enter description'
								disabled={isLoading}
								value={description}
								onChange={(e) => setDescription(e.target.value)}
							></Form.Control>
						</Form.Group>
						<Form.Group className='my-2' controlId='website'>
							<Form.Label>Website</Form.Label>
							<Form.Control
								type='website'
								placeholder='Enter website'
								disabled={isLoading}
								value={website}
								onChange={(e) => setWebsite(e.target.value)}
							></Form.Control>
						</Form.Group>
					</>
				)}

				{/* userType: Admin  only admin can add other admin*/}
				{userType === 'Admin' && (
					<>
						<Form.Group className='my-2' controlId='address'>
							<Form.Label>Address</Form.Label>
							<Form.Control
								type='address'
								placeholder='Enter address'
								disabled={isLoading}
								value={address}
								onChange={(e) => setAddress(e.target.value)}
							></Form.Control>
						</Form.Group>
						<Form.Group className='my-2' controlId='phone'>
							<Form.Label>Phone</Form.Label>
							<Form.Control
								type='phone'
								placeholder='Enter phone'
								disabled={isLoading}
								value={phone}
								aria-describedby="phoneHelpBlock"
								onChange={(e) => setPhone(e.target.value)}
							></Form.Control>
							<Form.Text id="phoneHelpBlock" muted>
								Phone number must be unique.
							</Form.Text>
						</Form.Group>
					</>
				)}


				<Button disabled={isLoading} type='submit' variant='primary'>
					Register
				</Button>
			</Form>

			<Row className='py-3'>
				<Col>
					Already have an account?{' '}
					<Link to='/login'>
						Login
					</Link>
				</Col>
			</Row>
		</FormContainer>
	);
};

export default RegisterScreen;
