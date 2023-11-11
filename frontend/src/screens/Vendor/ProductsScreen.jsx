import Loader from "../../components/Loader";
import { Button, Col, Image, Row, Table } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useGetProductsByVendorQuery } from "../../slices/productsApiSlice";

const ProductsScreen = () => {

	const navigate = useNavigate();

	const userInfo = JSON.parse(localStorage.getItem('userInfo'));
	const userType = userInfo?.userType;

	const vendorId = userInfo?.profile?._id;

	const { data: products, isLoading, isError } = useGetProductsByVendorQuery(vendorId);

	return (
		<>
			<Row className='align-items-center'>
				<Col>
					<h1>Products</h1>
				</Col>
				{userType === "Vendor" && (
					<Col className='text-right'>
						<Link to='/Vendor/products/add' className='btn btn-primary my-3'> Create Product
						</Link>
					</Col>
				)}
			</Row>
			{isLoading ? (
				<Loader />
			) : isError ? (
				<h3>{isError}</h3>
			) : (
				<Table striped bordered hover responsive className='table-sm'>
					<thead>
						<tr>
							<th>ID</th>
							<th>Image</th>
							<th>NAME</th>
							<th>PRICE</th>
							<th>CATEGORY</th>
							<th>Qty</th>
							<th>Edit</th>
							<th>Delete</th>
						</tr>
					</thead>
					<tbody>
						{products.map((product) => (
							<tr key={product._id}>
								<td>
									<Button
										variant='dark'
										onClick={() =>
											navigate(`/Vendor/products/${product._id}`)
										}
									>
										{product._id}
									</Button>
								</td>
								<td>
									<Image
										style={{ width: '100px' }}
										src={product.image}
										alt={product.name}
										fluid
										rounded
									/>
								</td>
								<td>{product.name}</td>
								<td>${product.price}</td>
								<td>{product.category.name}</td>
								<td>{product.countInStock}</td>
								<td>
									<Button
										variant='light'
										className='btn'
										onClick={() =>
											navigate(`/Vendor/products/${product._id}/edit`)
										}
									>
										<FaEdit />
									</Button>
								</td>
								<td>
									<Button variant='danger' className='btn'>
										<FaTrash />
									</Button>
								</td>
							</tr>
						))}
					</tbody>
				</Table>
			)}
		</>
	);
};

export default ProductsScreen;
