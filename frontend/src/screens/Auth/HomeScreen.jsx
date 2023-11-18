import { useState, useEffect } from "react";
import Loader from "../../components/Loader";
import { Button, Card, Col, Row, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useGetProductsQuery } from "../../slices/productsApiSlice";

const HomeScreen = () => {

	const navigate = useNavigate();

	const { data: products, isLoading, isError } = useGetProductsQuery();

	const { userType } = JSON.parse(localStorage.getItem('userInfo')) || {};
	const isVendor = userType === 'Vendor';


	const [p, setP] = useState(products);

	const onSearch = (e) => {
		const filteredProducts = products.filter((product) => {
			return product.name.toLowerCase().includes(e.toLowerCase());
		});
		setP(filteredProducts);

	};


	useEffect(() => {
		if (isLoading) {
			setP([]);
		} else {
			setP(products);
		}
	}, [products, isLoading]);

	return (
		<>
			{isLoading ? (
				<Loader />
			) : isError ? (
				isError
			) : (
				<>

					<Row className='text-center'>
						{/* Search Bar */}
						<Col className='d-flex justify-content-center'>
							<Form.Control
								type='text'
								placeholder='Search Products...'
								disabled={isLoading}
								onChange={(e) => onSearch(e.target.value)}
							/>
						</Col>

						<Col>
							<h1>Latest Products</h1>
						</Col>

						{isVendor && (
							<Col className='text-right'>
								<Button className='my-3' onClick={
									() => {
										navigate('/Vendor/products/add')
									}
								}>
									<i className='fas fa-plus'></i> Create Product
								</Button>
							</Col>
						)}
					</Row>

					<Row>
						{p.map((product) => (
							<Col className='mt-4' key={product._id} sm={12} md={6} lg={4}>
								<Card className='mb-3 h-100 d-flex'>
									<Card.Body className='d-flex flex-column'>
										<Card.Title>{product.name}</Card.Title>
										<Card.Text>{product.description}</Card.Text>
										<Button variant='dark' className='mt-auto text-white'
											onClick={() => {
												navigate(`/products/${product._id}`)
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
			)}
		</>
	);
};

export default HomeScreen;
