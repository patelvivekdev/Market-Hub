import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Row, Col, Card } from 'react-bootstrap';

const HomeScreen = () => {
	const [products, setProducts] = useState([]);

	useEffect(() => {
		async function fetchProducts() {
			const { data } = await axios.get('https://market-hub.onrender.com/api/v1/products/');
			setProducts(data.slice(0, 6));
		}

		fetchProducts();
	}, []);

	const { userType } = JSON.parse(localStorage.getItem('userInfo')) || {};
	const isAdmin = userType === 'Admin';

	return (
		<>
			<Row className='text-center'>
				<Col>
					<h1>Latest Products</h1>
				</Col>

				{isAdmin && (
					<Col className='text-right'>
						<Button className='my-3'>
							<i className='fas fa-plus'></i> Create Product
						</Button>
					</Col>
				)}
			</Row>

			<Row>
				{products.map((product) => (
					<Col className='mt-4' key={product._id} sm={12} md={6} lg={4}>
						<Card className='mb-3 h-100 d-flex'>
							<Card.Body className='d-flex flex-column'>
								<Card.Title>{product.name}</Card.Title>
								<Card.Text>{product.description}</Card.Text>
								<Button variant='dark' className='mt-auto text-white'
									onClick={() => {
										window.location.href = `/products/${product._id}`;
									}
									}
								>
									View Details
								</Button>
							</Card.Body>
						</Card>
					</Col>
				))}
			</Row>
		</>
	);
};

export default HomeScreen;
