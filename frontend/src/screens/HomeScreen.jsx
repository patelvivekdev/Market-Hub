import Loader from "../components/Loader";
import Message from "../components/Message";
import { Button, Card, Col, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useGetTopProductsQuery } from "../slices/productsApiSlice";
import { FaRocket, FaUmbrellaBeach, FaHeadset } from "react-icons/fa";
import { IconContext } from "react-icons";


import cover from '../assets/cover.png';

const HomeScreen = () => {
	const navigate = useNavigate();

	const { data: products, isLoading, isError } = useGetTopProductsQuery();

	if (isLoading) return <Loader />;

	if (isError) return <Message variant='danger'>{isError}</Message>;

	return (
		<>
			{/* Hero */}
			<section style={{ padding: '80px 0' }}>
				<div className='hero'>
					<div className='container'>
						<Row className='row align-items-center'>
							<Col className='text-center ' md={12} lg={6}>
								<h1 style={{ fontSize: '3rem', marginBottom: '20px' }}>Welcome to Our Store</h1>
								<p style={{ fontSize: '1.2rem', marginBottom: '30px', color: '#555' }}>
									Discover the latest trends and best deals
								</p>
								<Button variant='primary' style={{ fontSize: '1.2rem' }} onClick={() => navigate('/store/category/All/vendor/All')}>
									Explore Now
								</Button>
							</Col>
							<Col className='text-center mt-3' md={12} lg={6}>
								<img
									src={cover}
									alt='cover'
									className='img-fluid rounded'
									style={{
										width: '100%',
										boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.2)',
										transition: 'box-shadow 0.3s ease-in-out',
									}}
									onMouseOver={(e) => {
										e.currentTarget.style.boxShadow = 'rgba(0, 0, 0, 0.1) 14px 15px 4px 4px';
									}}
									onMouseOut={(e) => {
										e.currentTarget.style.boxShadow = '0px 8px 20px rgba(0, 0, 0, 0.2)';
									}}
								/>
							</Col>
						</Row>
					</div>
				</div>
			</section>

			{/* Why us */}
			<section style={{ padding: '40px 0' }}>
				<div className='container'>
					<Row className='row'>
						<Col md={12} lg={4}>
							<div className='card text-center mt-3' style={{
								background: 'linear - gradient(to top left, #E98E0D, #1536F1)',
								border: '4px solid transparent',
								borderImage: 'linear-gradient(to top left, #E98E0D, #1536F1)',
								borderImageSlice: '1',
								borderRadius: '10px',
								boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.5)',
								transition: 'box-shadow 0.3s ease-in-out',
							}}
								onMouseOver={(e) => {
									e.currentTarget.style.boxShadow = '10px 10px 15px rgba(0, 0, 0, 1)';
								}}
								onMouseOut={(e) => {
									e.currentTarget.style.boxShadow = '0px 8px 20px rgba(0, 0, 0, 0.5)';
								}}
							>
								<div className='card-body'>
									<IconContext.Provider value={{ color: "#E98", size: '3rem' }}>
										<FaRocket />
									</IconContext.Provider>
									<h4 className='text-uppercase mb-3 mt-2'>Fast Delivery</h4>
									<p>Enjoy the fastest delivery service worldwide!</p>
								</div>
							</div>
						</Col>

						<Col md={12} lg={4}>
							<div className='card text-center mt-3' style={{
								background: 'linear - gradient(to top left, #E98E0D, #1536F1)',
								border: '4px solid transparent',
								borderImage: 'linear-gradient(to top left, #E98E0D, #1536F1)',
								borderImageSlice: '1',
								borderRadius: '10px',
								boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.5)',
								transition: 'box-shadow 0.3s ease-in-out',
							}}
								onMouseOver={(e) => {
									e.currentTarget.style.boxShadow = '10px 10px 15px rgba(0, 0, 0, 1)';
								}}
								onMouseOut={(e) => {
									e.currentTarget.style.boxShadow = '0px 8px 20px rgba(0, 0, 0, 0.5)';
								}}
							>
								<div className='card-body'>
									<IconContext.Provider value={{ color: "#E98", size: '3rem' }}>
										<FaUmbrellaBeach />
									</IconContext.Provider>
									<h4 className='text-uppercase mb-3 mt-2'>Easy Returns</h4>
									<p>Our products come with hassle-free, free returns!</p>
								</div>
							</div>
						</Col>

						<Col md={12} lg={4}>
							<div className='card text-center mt-3' style={{
								background: 'linear - gradient(to top left, #E98E0D, #1536F1)',
								border: '4px solid transparent',
								borderImage: 'linear-gradient(to top left, #E98E0D, #1536F1)',
								borderImageSlice: '1',
								borderRadius: '10px',
								boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.5)',
								transition: 'box-shadow 0.3s ease-in-out',
							}}
								onMouseOver={(e) => {
									e.currentTarget.style.boxShadow = '10px 10px 15px rgba(0, 0, 0, 1)';
								}}
								onMouseOut={(e) => {
									e.currentTarget.style.boxShadow = '0px 8px 20px rgba(0, 0, 0, 0.5)';
								}}
							>
								<div className='card-body'>
									<IconContext.Provider value={{ color: "#E98", size: '3rem' }}>
										<FaHeadset />
									</IconContext.Provider>
									<h4 className='text-uppercase mb-3 mt-2'>24/7 Support</h4>
									<p>Get round-the-clock support for all your queries!</p>
								</div>
							</div>
						</Col>
					</Row>
				</div>
			</section >

			<Row>
				<h1 className='text-center'>Top Reviewed Products</h1>
				<hr />
				<Col md={12}>
					<Row>
						{/* If no product  show no products message*/}
						{products.length === 0 && (
							<Col className='mt-4'>
								<Message variant='info'>No Products Found</Message>
							</Col>
						)}

						{/* If products are available show them */}
						{products.map((product) => (
							<Col className='mt-4' key={product._id} sm={12} md={6} lg={4}>
								<Card className='mb-3 h-100 d-flex'
									style={{ boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)', transition: 'box-shadow 0.3s ease-in-out' }}
									onMouseOver={(e) => { e.currentTarget.style.boxShadow = '0px 8px 20px rgba(0, 0, 0, 0.5)' }}
									onMouseOut={(e) => { e.currentTarget.style.boxShadow = '0px 4px 12px rgba(0, 0, 0, 0.1)' }}>
									<div style={{ height: '200px', overflow: 'hidden', borderRadius: '5px 5px 0 0' }}>
										<img
											src={product.image} // Replace with the path to your product image
											alt={product.name}
											className='img-fluid'
											style={{ width: '100%', objectFit: 'cover', height: '100%' }}
										/>
									</div>
									<Card.Body className='d-flex flex-column'>
										<Card.Title>{product.name}</Card.Title>
										<Card.Text>{product.description}</Card.Text>
										<Card.Text className='text-muted'>
											Category : <span className='badge rounded-pill' style={{ backgroundColor: '#E98E0D', color: 'white' }}>
												<Link
													style={{
														color: 'white',
														textDecoration: 'none'
													}}
													to={`/store/category/${product.category._id}`}>{product.category.name}</Link>
											</span>
										</Card.Text>

										{/* vendor */}
										<Card.Text className='text-muted'>
											Vendor : <span className='badge rounded-pill' style={{ backgroundColor: '#1536F1', color: 'white' }}>
												<Link style={{
													color: 'white',
													textDecoration: 'none'
												}} to={`/store/vendor/${product.vendor._id}`}>{product.vendor.name}</Link>
											</span>
										</Card.Text>
										<Button
											variant='primary'
											className='mt-auto my-2'
											onClick={() => navigate(`/products/${product._id}`)}
										>
											View Details
										</Button>
									</Card.Body>
								</Card>
							</Col>
						))}
					</Row>
				</Col>
			</Row>
		</>
	);
};

export default HomeScreen;