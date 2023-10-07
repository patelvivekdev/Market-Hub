// Home Screen 

import React from 'react';
import { Row, Col, Button, Table } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

const HomeScreen = ({ history, match }) => {
	const products = [];

	// get the user info from the local storage
	const userInfo = localStorage.getItem('userInfo');

	// if the user is not logged in, redirect to login page
	if (!userInfo) {
		window.location.href = '/login';
	}

	// if the user is logged in, get the user info from the local storage
	const user = JSON.parse(userInfo);

	return (
		<>
			<Row className='align-items-center'>
				<Col>
					<h1>Products</h1>
				</Col>

				{user?.userType === 'Admin' && (
					<Col className='text-right'>
						<LinkContainer to='/admin/product/create'>
							<Button className='my-3'>
								<i className='fas fa-plus'></i> Create Product
							</Button>
						</LinkContainer>
					</Col>
				)}

			</Row>
			<Table striped bordered hover responsive className='table-sm'>
				<thead>
					<tr>
						<th>NAME</th>
						<th>PRICE</th>
						<th>CATEGORY</th>
						<th>BRAND</th>
						<th>Vendor</th>
					</tr>
				</thead>
				<tbody>
					{products?.map((product) => (
						<tr key={product._id}>
							<td>{product.name}</td>
							<td>${product.price}</td>
							<td>{product.category}</td>
							<td>{product.brand}</td>
							<td>
								<LinkContainer to={`/admin/product/${product._id}/edit`}>
									<Button variant='light' className='btn-sm'>
										<i className='fas fa-edit'></i>
									</Button>
								</LinkContainer>
							</td>
						</tr>
					))}
				</tbody>
			</Table>
		</>

	)
}

export default HomeScreen;