import React, { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button, Card, Col, Form, ListGroup, Row } from "react-bootstrap";
import { addToCart } from "../../slices/cartSlice";
import { useGetProductDetailsQuery } from "../../slices/productsApiSlice";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import Img from "../../components/Img";

const ProductScreen = () => {
	const { id } = useParams();
	const [qty, setQty] = useState(1);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { data: product, isLoading, isError } = useGetProductDetailsQuery(id);
	const userInfo = useSelector((state) => state.auth.userInfo);
	const userType = userInfo?.userType;

	// Check if the user is a client or a anonymous user
	const isClient = userType === 'Client' || !userType
	const isVendor = userType === 'Vendor';
	const isCreator = product?.vendor?._id === userInfo?.profile?._id;

	const renderEditButton = () => {
		return isCreator && (
			<Link className='btn btn-primary my-3 ms-3' to={`/Vendor/products/${product._id}/edit`}>
				Edit Product
			</Link>
		);
	};

	const renderLoadingOrError = () => {
		if (isLoading) {
			return <Loader />;
		} else if (isError) {
			return <Message variant='danger'>{isError?.data?.message || isError.error}</Message>;
		}
	};

	const addToCartHandler = () => {
		dispatch(addToCart({ ...product, qty }));
		navigate('/cart');
	};

	const renderProductDetails = () => {
		return (
			<>
				{renderEditButton()}
				<Row>
					<Col md={3}>
						<div>
							<Img src={product.image} alt={product.name} />
						</div>
					</Col>
					<Col md={3}>
						<ListGroup variant='flush'>
							<ListGroup.Item>
								<h3>{product.name}</h3>
							</ListGroup.Item>
							<ListGroup.Item>Price: ${product.price}</ListGroup.Item>
							<ListGroup.Item>Description: {product.description}</ListGroup.Item>
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
								{isVendor && (
									<ListGroup.Item>
										<Row>
											<Col>Stock</Col>
											<Col>
												<strong>{product.countInStock}</strong>
											</Col>
										</Row>
									</ListGroup.Item>
								)}
								{isClient && product.countInStock > 0 && (
									<ListGroup.Item>
										<Row>
											<Col>Qty</Col>
											<Col>
												<Form.Control
													as='select'
													value={qty}
													onChange={(e) => setQty(Number(e.target.value))}
												>
													{[...Array(product.countInStock).keys()].map((x) => (
														<option key={x + 1} value={x + 1}>
															{x + 1}
														</option>
													))}
												</Form.Control>
											</Col>
										</Row>
									</ListGroup.Item>
								)}
								{isClient && (
									<ListGroup.Item className='text-center'>
										<Button
											className='btn-block'
											type='button'
											disabled={product.countInStock === 0}
											onClick={addToCartHandler}
										>
											Add to Cart
										</Button>
									</ListGroup.Item>
								)}
							</ListGroup>
						</Card>
					</Col>
					<Col md={3} className='justify-content-center'>
						<Card className='text-center'>
							<Card.Body>
								<Card.Title>Vendor Profile</Card.Title>
								<Card.Text>{product.vendor?.vendorName}</Card.Text>
								<Card.Text>{product.vendor?.phone}</Card.Text>
								<Card.Text>{product.vendor?.address}</Card.Text>
							</Card.Body>
						</Card>
					</Col>
				</Row>
			</>
		);
	};

	return (
		<>
			<Link className='btn btn-light my-3' to='/'>
				Go Back
			</Link>
			{renderLoadingOrError()}
			{product && renderProductDetails()}
		</>
	);
};

export default ProductScreen;
