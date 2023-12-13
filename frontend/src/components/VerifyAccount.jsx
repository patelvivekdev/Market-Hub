import React from 'react';
import { useParams } from "react-router-dom";
import { toast } from 'react-toastify';
import Loader from './Loader';
import { useVerifyMutation } from '../slices/usersApiSlice';
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";

const VerifyAccount = () => {
	const { verifyToken } = useParams();
	const navigate = useNavigate();
	const [verify, { isLoading }] = useVerifyMutation();

	const validateHandler = async () => {
		try {
			await verify(verifyToken).unwrap();
			toast.success(`Account verified successfully.`, {
				toastId: 'verifyAccountToastId',
				autoClose: 1000,
			});
			navigate('/');
		} catch (error) {
			toast.error(
				error?.data?.message || error?.response?.data?.message || error?.data || 'Something went wrong while verifying your account! Please try again later.',
				'verifyAccountToastId'
			);
		}
	}

	return (
		<div>
			{isLoading && <Loader />}
			<h1>Verifying your account</h1>
			<Button onClick={validateHandler} className='btn btn-primary' disabled={isLoading}>
				Verify Account
			</Button >
		</div>
	);




};

export default VerifyAccount;