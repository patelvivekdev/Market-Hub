import Img from "../components/Image";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { useState } from "react";
import { Button, Card, Col, Form, ListGroup, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { addToCart } from "../slices/cartSlice";
import { useGetProductDetailsQuery } from "../slices/productsApiSlice";

const ProductScreen = () => {
	const { id } = useParams();

	const [qty, setQty] = useState(1);

	const dispatch = useDispatch();
	const navigate = useNavigate();

	const { data: product, isLoading, isError } = useGetProductDetailsQuery(id);
	console.log("product", product);

	const userInfo = JSON.parse(localStorage.getItem('userInfo'));
	const userType = userInfo?.userType;

	// check if product creator is the same as the logged in user
	const isCreator
		= product?.vendor?._id === userInfo?.profile?._id;

	const addToCartHandler = () => {
		dispatch(addToCart({ ...product, qty }));
		navigate('/cart');
	};

	return (
		<>
			<Link className='btn btn-light my-3' to='/'>
				Go Back
			</Link>
			{isLoading ? (
				<Loader />
			) : isError ? (
				<Message variant='danger'>{isError?.data?.message || isError.error}</Message>
			) : (
				<>
					{isCreator && (
						<Link className='btn btn-primary my-3 ms-3' to={`/products/${product._id}/edit`}>
							Edit Product
						</Link>
					)
					}
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

									{product.countInStock > 0 && (
										<ListGroup.Item>
											<Row>
												<Col>Qty</Col>
												<Col>
													<Form.Control
														as='select'
														value={qty}
														onChange={(e) => setQty(Number(e.target.value))}
													>
														{[...Array(product.countInStock).keys()].map(
															(x) => (
																<option key={x + 1} value={x + 1}>
																	{x + 1}
																</option>
															)
														)}
													</Form.Control>
												</Col>
											</Row>
										</ListGroup.Item>
									)}

									{userType !== 'Vendor' && (
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