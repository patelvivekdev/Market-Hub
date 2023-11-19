import { useState, useEffect } from "react";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { Button, Card, Col, Row, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useGetProductsQuery } from "../slices/productsApiSlice";
import { useGetCategoriesQuery } from "../slices/categoriesApiSlice";

const HomeScreen = () => {
	const navigate = useNavigate();

	const { data: products, isLoading, isError } = useGetProductsQuery();
	const { data: categories, isLoading: isCategoriesLoading, isError: categoryError } = useGetCategoriesQuery();

	const { userType } = JSON.parse(localStorage.getItem('userInfo')) || {};
	const isVendor = userType === 'Vendor';

	const [filteredCategory, setFilteredCategory] = useState('');
	const [searchValue, setSearchValue] = useState('');
	const [filteredProducts, setFilteredProducts] = useState([]);

	useEffect(() => {
		if (!products) return;
		let tempProducts = [...products];

		if (filteredCategory) {
			tempProducts = tempProducts.filter((product) => product.category.name === filteredCategory);
		}

		if (searchValue) {
			tempProducts = tempProducts.filter(
				(product) => product.name.toLowerCase().includes(searchValue.toLowerCase())
			);
		}

		setFilteredProducts(tempProducts);
	}, [filteredCategory, searchValue, products]);

	const onSearch = (e) => {
		setSearchValue(e.target.value);
	};

	const onCategoryChange = (e) => {
		setFilteredCategory(e.target.value === 'All' ? '' : e.target.value);
	};

	if (isCategoriesLoading || isLoading) return <Loader />;
	if (categoryError || isError) return <Message variant='danger'>{categoryError || isError}</Message>;

	return (
		<>
			<Row>
				<h1 className="text-center">Latest Products</h1>
				<Col md={3}>
					<h3>Filter</h3>
					<Form.Group controlId='category'>
						<Form.Label>Category</Form.Label>
						<Form.Control
							as='select'
							custom
							value={filteredCategory}
							onChange={onCategoryChange}
						>
							<option value='All'>All</option>
							{categories.map((category) => (
								<option key={category.id} value={category.name}>
									{category.name}
								</option>
							))}
						</Form.Control>
					</Form.Group>
				</Col>
				<Col md={9}>
					<Row className='text-center'>
						<Col className='d-flex justify-content-center'>
							<Form.Control
								type='text'
								placeholder='Search Products...'
								disabled={isLoading}
								onChange={onSearch}
							/>
						</Col>
						{isVendor && (
							<Col className='text-right'>
								<Button className='my-3' onClick={() => navigate('/Vendor/products/add')}>
									<i className='fas fa-plus'></i> Create Product
								</Button>
							</Col>
						)}
					</Row>
					<Row>
						{filteredProducts.map((product) => (
							<Col className='mt-4' key={product._id} sm={12} md={6} lg={4}>
								<Card className='mb-3 h-100 d-flex'>
									<Card.Body className='d-flex flex-column'>
										<Card.Title>{product.name}</Card.Title>
										<Card.Text>{product.description}</Card.Text>
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