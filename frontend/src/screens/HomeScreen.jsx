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
			<Row className='text-center'>
				<h1>Latest Products</h1>
				<hr />
				<Col md={3}>
					<h3>Filter</h3>
					<Form.Group>
						<Form.Control
							as='select'
							value={filteredCategory}
							onChange={onCategoryChange}
						>
							<option key='All' value='All'>Select Category</option>
							{categories.map((category) => (
								<option key={category.name} value={category.name}>
									{category.name}
								</option>
							))}
						</Form.Control>
					</Form.Group>
				</Col>
				<Col md={9}>
					<Row className='text-center'>
						<h3>Search Product</h3>
						<Col className='d-flex justify-content-center'>
							<Form.Control
								type='text'
								placeholder='Search Products...'
								disabled={isLoading}
								onChange={onSearch}
							/>
						</Col>
					</Row>
					<Row>

						{/* If no product  show no products message*/}
						{filteredProducts.length === 0 && (
							<Col className='mt-4'>
								<Message variant='info'>No Products Found</Message>
							</Col>
						)}

						{/* If products are available show them */}
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