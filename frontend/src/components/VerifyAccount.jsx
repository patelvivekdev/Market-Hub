import React from 'react';
import { useParams } from "react-router-dom";
import { toast } from 'react-toastify';
import Loader from './Loader';
import { useDispatch } from "react-redux";
import { useVerifyMutation } from '../slices/usersApiSlice';
import { setCredentials } from "../slices/authSlice";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";

const VerifyAccount = () => {
	const { verifyToken } = useParams();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [verify, { isLoading }] = useVerifyMutation();

	const validateHandler = async (e) => {
		e.preventDefault();
		try {
			const res = await verify(verifyToken).unwrap();
			dispatch(setCredentials({ ...res }));
			toast.success(`Account verified successfully.`, {
				toastId: 'verifyAccountToastId',
				autoClose: 2000,
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
			<h1>Verifying your account</h1>
			{isLoading && <Loader />}
			<Button onClick={validateHandler} className='btn btn-primary' disabled={isLoading}>
				Verify Account
			</Button >
		</div>
	);




};

export default VerifyAccount;