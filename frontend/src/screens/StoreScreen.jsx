import { useState } from "react";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { useParams } from 'react-router-dom';
import { Button, Card, Col, Row, Form, ListGroup } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useGetProductsQuery } from "../slices/productsApiSlice";
import { useGetCategoriesQuery } from "../slices/categoriesApiSlice";
import { useGetAllVendorsQuery } from "../slices/usersApiSlice";
import Paginate from '../components/Paginate';

const StoreScreen = () => {
	const navigate = useNavigate();

	// get params from url
	const { category, vendor, pageNumber, query } = useParams();

	const [searchValue, setSearchValue] = useState(query);

	const { data: products, isLoading, isError } = useGetProductsQuery({ pageNumber, category, vendor, searchValue });
	const { data: categories, isLoading: isCategoriesLoading, isError: categoryError } = useGetCategoriesQuery();
	const { data: vendors, isLoading: isVendorsLoading, isError: vendorError } = useGetAllVendorsQuery();


	const onSearch = (e) => {
		setSearchValue(e.target.value);
	};

	if (isCategoriesLoading || isLoading || isVendorsLoading) return <Loader />;
	if (categoryError || isError || vendorError) return <Message variant='danger'>{categoryError || isError || vendorError}</Message>;

	return (
		<>
			<Row>
				<h1 className='text-center'>Latest Products</h1>
				<hr />
				<Col md={3}>
					<h3 className='text-center'>Filter</h3>
					<hr />
					{/* List all category with button  */}
					<h4>Category</h4>
					<ListGroup>
						<ListGroup.Item
							key={'All'}
							className='text-center'
							variant={category === 'All' ? 'primary' : 'light'}
							onClick={() => {

								if (vendor) {
									navigate(`/store/category/All/vendor/${vendor}`);
								} else {
									navigate(`/store/category/All`);
								}
							}
							}
						>
							All
						</ListGroup.Item>
						{categories.map((cat) => (
							<ListGroup.Item
								key={cat.name}
								className='text-center mt-2'
								variant={category === cat._id ? 'primary' : 'light'}
								onClick={() => {
									if (vendor) {
										navigate(`/store/category/${cat._id}/vendor/${vendor}`);
									} else {
										navigate(`/store/category/${cat._id}`);
									}
								}
								}
							>
								{cat.name}
							</ListGroup.Item>
						))}
					</ListGroup>

					{/* List all vendor with button  */}
					<h4 className='mt-4'>Vendor</h4>
					<ListGroup>
						<ListGroup.Item
							key={'All'}
							className='text-center'
							variant={vendor === 'All' ? 'primary' : 'light'}
							onClick={() => {

								if (category) {
									navigate(`/store/category/${category}/vendor/All`);
								} else {
									navigate(`/store/vendor/All`);
								}
							}
							}
						>
							All
						</ListGroup.Item>
						{vendors.map((ven) => (
							<ListGroup.Item
								key={ven.profile._id}
								className='text-center mt-2'
								variant={vendor === ven.profile._id ? 'primary' : 'light'}
								onClick={() => {
									if (category) {
										navigate(`/store/category/${category}/vendor/${ven.profile._id}`);
									} else {
										navigate(`/store/vendor/${ven.profile._id}`);
									}
								}
								}
							>
								{ven.profile.name}
							</ListGroup.Item>
						))}
					</ListGroup>
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
						{products.products.length === 0 && (
							<Col className='mt-4'>
								<Message variant='info'>No Products Found</Message>
							</Col>
						)}

						{/* If products are available show them */}
						{products.products.map((product) => (
							<Col className='mt-4' key={product._id} sm={12} md={6} lg={4}>
								<Card className='mb-3 h-100 d-flex'>
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
					<Row className='text-center m-4'>
						<Paginate pages={products.pages} page={products.page} category={category} vendor={vendor} />
					</Row>
				</Col>
			</Row>
		</>
	);
};

export default StoreScreen;