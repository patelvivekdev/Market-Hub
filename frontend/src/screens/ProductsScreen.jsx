import React, { useEffect, useState } from 'react';
import { Table, Button, Row, Col } from 'react-bootstrap';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';
import axios from 'axios';

const ProductsScreen = () => {
	const [products, setProducts] = useState([]);
	const [isLoading, setIsLoading] = useState(true); // Start with loading state
	const [isError, setIsError] = useState(null); // Use null to represent no error

	const userInfo = JSON.parse(localStorage.getItem('userInfo'));
	const userType = userInfo?.userType;


	useEffect(() => {

		const fetchProducts = async () => {
			try {
				const BASE_URL = 'https://market-hub.onrender.com/api/v1';
				const config = {
					headers: {
						'Content-Type': 'application/json',
					},
				};

				const response = await axios.get(
					`${BASE_URL}/products/`,
					config
				);
				setProducts(response.data);
				setIsLoading(false); // Set loading to false after successful fetch
			} catch (error) {
				toast.error(error.response?.data?.message || 'An error occurred', {
					autoClose: false,
					onClose: () => {
						setIsError(null); // Clear error message
						setIsLoading(false); // Set loading to false after error
					},
				});
				setIsLoading(false); // Set loading to false after error
				setIsError('Failed to load products'); // Set error message
			}
		};

		fetchProducts();
	}, []);

	return (
		<>
			<Row className='align-items-center'>
				<Col>
					<h1>Products</h1>
				</Col>
				{userType === "Vendor" && (
					<Col className='text-right'>
						<Button className='my-3 btn btn-primary'>
							<i className='fas fa-plus'></i> Create Product
						</Button>
					</Col>
				)}
			</Row>
			{isLoading ? (
				<Loader />
			) : isError ? (
				<h3>{isError}</h3>
			) : (
				<Table striped bordered hover responsive className='table-sm'>
					<thead>
						<tr>
							<th>ID</th>
							<th>NAME</th>
							<th>PRICE</th>
							<th>CATEGORY</th>
							<th>VENDOR</th>
							{userType === "Admin" && <th></th>}
						</tr>
					</thead>
					<tbody>
						{products.map((product) => (
							<tr key={product._id}>
								<td>
									<Button
										variant='dark'
										onClick={() =>
											window.location.href = '/products/' + product._id
										}
									>
										{product._id}
									</Button>
								</td>
								<td>{product.name}</td>
								<td>${product.price}</td>
								<td>{product.category}</td>
								<td>{product.vendor.vendorName}</td>
								{userType === "Admin" && (
									<td>
										<Button
											variant='light'
											className='btn btn-outline-primary ms-2'
											onClick={() => {
												console.log('Edit');
											}}
										>
											<i className='fas fa-edit'>EDIT</i>
										</Button>
										<Button variant='light' className='btn btn-outline-danger ms-2'>
											<i className='fas fa-trash'>DELETE</i>
										</Button>
									</td>
								)}
							</tr>
						))}
					</tbody>
				</Table>
			)}
		</>
	);
};

export default ProductsScreen;
