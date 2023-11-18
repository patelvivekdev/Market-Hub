import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { Button, Form } from 'react-bootstrap';
import { useCreateProductMutation } from '../../slices/productsApiSlice';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import FormContainer from '../../components/FormContainer';
import { toast } from "react-toastify";
import { useGetCategoriesQuery } from '../../slices/categoriesApiSlice';

const AddProductScreen = () => {
	const { data, isLoading, isError } = useGetCategoriesQuery();

	const [name, setName] = useState('');
	const [price, setPrice] = useState(1.0);
	const [image, setImage] = useState('');
	const [category, setCategory] = useState('');
	const [countInStock, setCountInStock] = useState(1);
	const [description, setDescription] = useState('');

	const navigate = useNavigate();

	const [createProduct, { isLoading: loading }] = useCreateProductMutation();

	const showErrorToast = (message) => {
		toast.error(message, {
			toastId: "addProductToast",
			autoClose: 2000,
		});
	}

	const handleFormSubmit = async (e) => {
		e.preventDefault();

		if (!name || !price || !image || !category || !countInStock || !description) {
			showErrorToast("Please fill all the fields");
			return;
		}

		if (isNaN(price) || isNaN(countInStock)) {
			showErrorToast("Price and count in stock must be numbers");
			return;
		}

		if (price < 1.0 || countInStock < 1) {
			showErrorToast("Price and count in stock must be greater than 0");
			return;
		}

		const formData = new FormData();
		formData.append('name', name);
		formData.append('price', price);
		formData.append('image', image);
		formData.append('category', category);
		formData.append('countInStock', countInStock);
		formData.append('description', description);

		try {
			await createProduct(formData).unwrap();
			toast.success('Product added successfully', {
				toastId: "addProductToast",
				autoClose: 2000,
			});
			navigate(`/Vendor/products`);
		} catch (error) {
			toast.error(
				error?.response?.data?.message ||
				error?.data?.message ||
				'An error occurred. Please try again.'
			);
		}
	};

	return (
		<>
			<Link to='/Vendor/products' className='btn btn-light my-3'>
				Go Back
			</Link>
			<FormContainer>
				<h1>Add Product</h1>
				{loading && <Loader />}
				{isLoading ? (
					<Loader />
				) : isError ? (
					<Message variant='danger'>{isError?.data?.message || isError.error}</Message>
				) : (
					<>
						<Form onSubmit={handleFormSubmit}>
							<Form.Group controlId='name'>
								<Form.Label>Name</Form.Label>
								<Form.Control
									type='name'
									placeholder='Enter product name'
									value={name}
									onChange={(e) => setName(e.target.value)}
								></Form.Control>
							</Form.Group>

							<Form.Group controlId='category'>
								<Form.Label>Category</Form.Label>
								<Form.Control
									as='select'
									value={category}
									onChange={(e) => setCategory(e.target.value)}
								>
									<option value=''>Select Category</option>
									{data.map((category) => (
										<option key={category._id} value={category._id}>
											{category.name}
										</option>
									))}
								</Form.Control>
							</Form.Group>

							<Form.Group controlId='description'>
								<Form.Label>Description</Form.Label>
								<Form.Control
									type='text'
									placeholder='Enter description'
									value={description}
									onChange={(e) => setDescription(e.target.value)}
								></Form.Control>
							</Form.Group>

							<Form.Group controlId='price'>
								<Form.Label>Price</Form.Label>
								<Form.Control
									type='number'
									placeholder='Enter price'
									min={1.0}
									step={0.1}
									value={price}
									onChange={(e) => setPrice(e.target.value)}
								></Form.Control>
							</Form.Group>

							<Form.Group controlId='countInStock'>
								<Form.Label>Count In Stock</Form.Label>
								<Form.Control
									type='number'
									placeholder='Enter count in stock'
									min={1}
									step={1}
									maxLength={3}
									value={countInStock}
									onChange={(e) => setCountInStock(e.target.value)}
								></Form.Control>
							</Form.Group>

							<Form.Group controlId='image'>
								<Form.Label>Image</Form.Label>
								<Form.Control
									type='file'
									accept='image/*'
									onChange={(e) => setImage(e.target.files[0])}
								></Form.Control>
							</Form.Group>

							<Button type='submit' variant='primary'>
								Add Product
							</Button>
						</Form>
					</>
				)}
			</FormContainer>
		</>
	);
}

export default AddProductScreen;
