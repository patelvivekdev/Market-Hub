import React, { useState } from "react";
import Loader from "../../components/Loader";
import { Button, Col, Image, Row, Table, Modal } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useGetProductsByVendorQuery, useDeleteProductMutation } from "../../slices/productsApiSlice";
import { toast } from "react-toastify";

const ProductsScreen = () => {

	const navigate = useNavigate();
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [productId, setProductId] = useState(null);

	const userInfo = JSON.parse(localStorage.getItem('userInfo'));
	const userType = userInfo?.userType;
	const vendorId = userInfo?.profile?._id;

	const { data: products, isLoading, isError } = useGetProductsByVendorQuery(vendorId);

	const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

	const handleDelete = async () => {

		try {
			await deleteProduct(productId).unwrap();
			setShowDeleteModal(false);
			toast.success('Product deleted successfully', {
				toastId: 'deleteProductToastId',
				autoClose: 2000,
			});
		} catch (error) {
			toast.error(error?.response?.data?.message ||
				error?.data?.message || error?.data ||
				'An error occurred. Please try again.', {
				toastId: 'deleteProductToastId',
				autoClose: 2000,
			});
		}
	}

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
			{isDeleting && <Loader />}
			{isLoading ? (
				<Loader />
			) : isError ? (
				<h3>{isError}</h3>
			) : (
				<>
					{
						products.length === 0 ? (
							<h3>No Products Found</h3>
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
												<Button variant='danger' className='btn' onClick={() => {
													setShowDeleteModal(true);
													setProductId(product._id);
												}}>
													<FaTrash />
												</Button>
											</td>
										</tr>
									))}
								</tbody>
							</Table>
						)}
					{showDeleteModal && (
						<Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
							<Modal.Header closeButton>
								<Modal.Title>Delete Product</Modal.Title>
							</Modal.Header>
							<Modal.Body>
								Are you sure you want to delete this product?
							</Modal.Body>
							<Modal.Footer>
								<Button variant='secondary' onClick={() => setShowDeleteModal(false)}>
									Cancel
								</Button>
								<Button variant='danger' onClick={handleDelete}>
									Delete
								</Button>
							</Modal.Footer>
						</Modal>
					)}
				</>
			)}
		</>
	);
};

export default ProductsScreen;
