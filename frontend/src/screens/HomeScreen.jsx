import React, { useEffect, useState } from 'react';
import { Table, Button, Row, Col } from 'react-bootstrap';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';
import axios from 'axios';

const HomeScreen = () => {
	const [products, setProducts] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [isError, setIsError] = useState(false);
	const [isAdmin, setIsAdmin] = useState(false);

	const showToast = (message) => {
		toast.error(message, {
			autoClose: false,
			onClose: clearLoadingState,
		});
	};

	const clearLoadingState = () => {
		setIsError(false);
		setIsLoading(false);
	};

	useEffect(() => {
		const userInfo = localStorage.getItem('userInfo')
			? JSON.parse(localStorage.getItem('userInfo'))
			: null;

		if (!userInfo) {
			window.location.href = '/login';
			return;
		} else {
			setIsLoading(true);
		}

		if (userInfo['userType'] === 'Admin') {
			setIsAdmin(isAdmin);
		}

		const fetchProducts = async () => {
			try {
				setIsLoading(true);
				const BASE_URL = 'https://market-hub.onrender.com/api/v1';
				const config = {
					headers: {
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${userInfo.token}`,
					},
				};

				const { data } = await axios.get(
					BASE_URL + '/products/',
					config
				);
				setProducts(data);
				setIsLoading(false);
			} catch (error) {
				showToast(error.response.data.message);
				setIsLoading(false);
			}
		};

		fetchProducts();
	}, [isAdmin]);

	return (
		<>
			<Row className='align-items-center'>
				<Col>
					<h1>Products</h1>
				</Col>

				{isAdmin && (
					<Col className='text-right'>
						<Button className='my-3'>
							<i className='fas fa-plus'></i> Create Product
						</Button>
					</Col>
				)}
			</Row>
			{isLoading ? (
				<Loader />
			) : isError ? (
				<p>Error loading products.</p>
			) : (
				<Table striped bordered hover responsive className='table-sm'>
					<thead>
						<tr>
							<th>NAME</th>
							<th>PRICE</th>
							<th>CATEGORY</th>
							<th>Vendor</th>
						</tr>
					</thead>
					<tbody>
						{products.map((product) => (
							<tr key={product._id}>
								<td>{product.name}</td>
								<td>${product.price}</td>
								<td>{product.category}</td>
								<td>{product.vendor.vendorName}</td>
							</tr>
						))}
					</tbody>
				</Table>
			)}
		</>
	);
};

export default HomeScreen;
