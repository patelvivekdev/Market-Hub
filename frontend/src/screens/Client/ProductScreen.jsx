import React, { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button, Card, Col, Form, ListGroup, Row, Modal } from "react-bootstrap";
import { addToCart } from "../../slices/cartSlice";
import { useGetProductDetailsQuery, useChangeProductImageMutation, useAddReviewMutation } from "../../slices/productsApiSlice";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import Rating from "../../components/Rating";
import Img from "../../components/Img";
import { formattedDateTime } from '../../utils/utils';

const ProductScreen = () => {
	const { id } = useParams();
	const [qty, setQty] = useState(1);
	const [image, setImage] = useState('');
	const [rating, setRating] = useState(0);
	const [reviewMessage, setReviewMessage] = useState('');

	const [showModal, setShowModal] = useState(false);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { data: product, refetch, isLoading, isError } = useGetProductDetailsQuery(id);
	const [changeImage, { isLoading: isUploading }] = useChangeProductImageMutation();
	const [addReview, { isLoading: loadingProductReview }] = useAddReviewMutation();
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

	// Function to handle image change form submission
	const handleImageChange = async (e) => {
		setShowModal(false);
		e.preventDefault();

		// check if image is selected
		if (!image) {
			return toast.error('Please select an image', {
				toastId: 'changeImageToastId',
				autoClose: 1000,
			});
		}

		try {
			const formData = new FormData();
			formData.append('image', image);

			// Make API call to change the image
			await changeImage({ productId: product._id, formData: formData }).unwrap();
			toast.success('Image changed successfully', {
				toastId: 'changeImageToastId',
				autoClose: 1000,
			});
			refetch();
		} catch (error) {
			toast.error(
				error?.response?.data?.message ||
				error?.data?.message ||
				'An error occurred. Please try again.'
			);
		}
	};

	// Function to render "Change Image" button and modal
	const renderChangeImageButton = () => {
		return isCreator && (
			<>
				<Button className='btn btn-primary my-3 ms-3' onClick={() => {
					setShowModal(true)
				}}>
					Change Image
				</Button>
			</>
		);
	};

	const renderLoadingOrError = () => {
		if (isUploading || isLoading || loadingProductReview) {
			return <Loader />;
		} else if (isError) {
			return <Message variant='danger'>{isError?.data?.message || isError.error}</Message>;
		}
	};

	const addToCartHandler = () => {
		//check if the user is verified
		if (!userInfo?.isEmailVerified) {
			return toast.error('Please verify your email address', {
				toastId: 'addToCartToastId',
				autoClose: 1000,
			});
		}


		dispatch(addToCart({ ...product, qty }));
		navigate('/cart');
	};

	const handleReviewSubmit = async (e) => {
		e.preventDefault();

		try {
			// Make API call to add review
			await addReview({ productId: product._id, rating, reviewMessage }).unwrap();
			toast.success('Review added successfully', {
				toastId: 'addReviewToastId',
				autoClose: 1000,
			});
			setRating(0);
			setReviewMessage('');
			refetch();
		} catch (error) {
			toast.error(
				error?.response?.data?.message ||
				error?.data?.message || error?.data ||
				'An error occurred. Please try again.'
			);
		}
	};

	const renderProductDetails = () => {
		return (
			<>
				{renderEditButton()}
				<Row>
					<Col md={3}>
						<div>
							<Img src={product.image} alt={product.name} />
							{renderChangeImageButton()}

							{/* Modal to handle image change */}
							{showModal && (
								<Modal show={showModal} onHide={() => setShowModal(false)}>
									<Modal.Header closeButton>
										<Modal.Title>Change Image</Modal.Title>
									</Modal.Header>
									<Modal.Body>
										<Form>
											<Form.Group controlId='roleSelect'>
												<Form.Label>Select New Image</Form.Label>
												<Form.Control
													type='file'
													accept='image/*'
													onChange={(e) => setImage(e.target.files[0])}
												></Form.Control>
											</Form.Group>
										</Form>
									</Modal.Body>
									<Modal.Footer>
										<Button variant='secondary' onClick={() => setShowModal(false)}>
											Close
										</Button>
										<Button variant='primary' onClick={handleImageChange}>
											Upload
										</Button>
									</Modal.Footer>
								</Modal>
							)}
						</div>
					</Col>
					<Col md={3}>
						<ListGroup variant='flush'>
							<ListGroup.Item>
								<h3>{product.name}</h3>
							</ListGroup.Item>
							{
								product.reviews.length > 0 && (
									<ListGroup.Item>
										<Rating value={product.rating} text={`${product.numReviews} reviews`} />
									</ListGroup.Item>
								)
							}

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
				<Row className='mt-5'>
					<Col md={8}>
						<h2>Reviews</h2>
						{product.reviews.length === 0 && <Message>No Reviews</Message>}
						<ListGroup variant='flush'>
							{product.reviews.map((review) => (
								<ListGroup.Item key={review._id}>
									<strong>{review.name}</strong>
									<Row>
										<Col md={2}>
											<Rating value={review.rating} color='#f8e825' />
										</Col>
										<Col>
											<p>{review.reviewMessage}</p>
										</Col>
										<Col>
											<p>{review.reviewer.username}</p>
										</Col>
										<Col>
											<p>{formattedDateTime(review.createdAt)}</p>
										</Col>
									</Row>
								</ListGroup.Item>
							))}
							{isClient && product.countInStock > 0 && (
								<>
									<ListGroup.Item className="mt-5" style={{ borderTop: '1px solid #dee2e6' }}>
										<h2 className="my-3">Write a Customer Review</h2>
										<Form>
											<Form.Group controlId='rating'>
												<Form.Label>Rating</Form.Label>
												<Form.Control
													as='select'
													value={rating}
													onChange={(e) => setRating(e.target.value)}
												>
													<option value=''>Select...</option>
													<option value='1'>1 - Poor</option>
													<option value='2'>2 - Fair</option>
													<option value='3'>3 - Good</option>
													<option value='4'>4 - Very Good</option>
													<option value='5'>5 - Excellent</option>
												</Form.Control>
											</Form.Group>
											<Form.Group controlId='comment'>
												<Form.Label>Comment</Form.Label>
												<Form.Control
													as='textarea'
													row='3'
													value={reviewMessage}
													onChange={(e) => setReviewMessage(e.target.value)}
												></Form.Control>
											</Form.Group>
											<Button
												disabled={loadingProductReview}
												type='submit'
												variant='primary'
												onClick={handleReviewSubmit}
											>
												Submit
											</Button>
										</Form>
									</ListGroup.Item>
								</>
							)}
						</ListGroup>
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
