// Single product screen

import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Row, Col, Card, Button, ListGroup } from 'react-bootstrap';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';

import axios from 'axios';

const ProductScreen = () => {
	const { id } = useParams();
	const [product, setProduct] = useState({});
	const [isLoading, setIsLoading] = useState(true);
	const [isError, setIsError] = useState(null);

	const userInfo = JSON.parse(localStorage.getItem('userInfo'));
	const userType = userInfo?.userType;
	// check if product creator is the same as the logged in user
	const isCreator = product?.vendor?._id === userInfo?.profile?._id;

	console.log(isCreator, product?.vendor?._id, userInfo?.profile?._id);

	useEffect(() => {
		const fetchProduct = async () => {
			try {
				const BASE_URL = 'https://market-hub.onrender.com/api/v1';
				const config = {
					headers: {
						'Content-Type': 'application/json',
					},
				};

				const response = await axios.get(
					`${BASE_URL}/products/${id}`,
					config
				);
				setProduct(response.data);
				setIsLoading(false);
			} catch (error) {
				toast.error(error.response?.data?.message || 'An error occurred', {
					autoClose: false,
					onClose: () => {
						setIsError(null);
						setIsLoading(false);
					},
				});
				setIsLoading(false);
				setIsError('Failed to load product');
			}
		};

		fetchProduct();
	}, [id]);

	return (
		<>
			<Link className='btn btn-light my-3' to='/products'>
				Go Back
			</Link>
			{userType === 'Vendor' && isCreator && (
				<Link className='btn btn-primary my-3 ms-3' to={`/products/${product._id}/edit`}>
					Edit Product
				</Link>
			)
			}
			{isLoading ? (
				<Loader />
			) : isError ? (
				<h2>{isError}</h2>
			) : (
				<>
					<Row>
						<Col md={3}>
							<ListGroup variant='flush'>
								<ListGroup.Item>
									<h3>{product.name}</h3>
								</ListGroup.Item>
								<ListGroup.Item>Price: ${product.price}</ListGroup.Item>
								<ListGroup.Item>
									Description: {product.description}
								</ListGroup.Item>
							</ListGroup>
						</Col>
						<Col md={3}>
							<Card>
								<ListGroup variant='flush'>
									<ListGroup.Item>
										<Row>
											<Col>Price:</Col>
											<Col>
												<strong>${product.price}</strong>
											</Col>
										</Row>
									</ListGroup.Item>
									<ListGroup.Item>
										<Row>
											<Col>Status:</Col>
											<Col>
												{product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
											</Col>
										</Row>
									</ListGroup.Item>
									{userType !== 'Vendor' && (
										<ListGroup.Item>
											<Button
												className='btn-block'
												type='button'
												disabled={product.countInStock === 0}
											>
												Add to Cart
											</Button>
										</ListGroup.Item>
									)}
								</ListGroup>
							</Card>
						</Col>
						<Col md={6} className='d-flex justify-content-center'>
							<Card className='text-center'>
								<Card.Body>
									<Card.Title>Vendor Profile</Card.Title>
									<Card.Text>
										{product.vendor?.vendorName}
									</Card.Text>
									<Card.Text>
										{product.vendor?.phone}
									</Card.Text>
									<Card.Text>
										{product.vendor?.address}
									</Card.Text>
								</Card.Body>
							</Card>
						</Col>
					</Row>
				</>
			)}
		</>
	);
}

export default ProductScreen;