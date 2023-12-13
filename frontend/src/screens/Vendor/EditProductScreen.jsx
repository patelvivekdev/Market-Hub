import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { useGetProductDetailsQuery, useUpdateProductMutation } from '../../slices/productsApiSlice';
import { useGetCategoriesQuery } from '../../slices/categoriesApiSlice';
import Loader from '../../components/Loader';
import FormContainer from '../../components/FormContainer';
import Message from '../../components/Message';
import { toast } from "react-toastify";

const ProductEditScreen = () => {
	const { id } = useParams();
	const navigate = useNavigate();

	const { data: categories, isLoading: categoryLoading, isError: categoryError } = useGetCategoriesQuery();
	const { data: product, refetch, isLoading: productLoading, isError: productError } = useGetProductDetailsQuery(id);
	const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

	const [name, setName] = useState('');
	const [price, setPrice] = useState(0);
	const [category, setCategory] = useState('');
	const [countInStock, setCountInStock] = useState(0);
	const [description, setDescription] = useState('');

	useEffect(() => {
		if (product) {
			setName(product.name);
			setPrice(product.price);
			setCategory(product.category._id);
			setCountInStock(product.countInStock);
			setDescription(product.description);
		}
	}, [product]);

	const showErrorToast = (message) => {
		toast.error(message, {
			toastId: "addProductToast",
			autoClose: 1000,
		});
	}

	const submitHandler = async (e) => {
		e.preventDefault();

		if (!name || !price || !category || !countInStock || !description) {
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

		try {
			await updateProduct({ productId: product._id, name, price, category, countInStock, description }
			).unwrap();

			toast.success('Product updated successfully');
			refetch();
			navigate('/Vendor/products');
		} catch (error) {
			toast.error(
				error?.response?.data?.message ||
				error?.data?.message || error?.data ||
				'An error occurred. Please try again.'
			);
		}
	};

	if (categoryLoading || productLoading) return <Loader />;
	if (categoryError || productError) return <Message variant='danger'>{categoryError || productError}</Message>;

	return (
		<>
			<Link to='/Vendor/products' className='btn btn-light my-3'>
				Go Back
			</Link>
			<h1>Edit Product</h1>
			<FormContainer>
				<Form onSubmit={submitHandler}>
					<Form.Group controlId='name'>
						<Form.Label>Name</Form.Label>
						<Form.Control
							type='text'
							placeholder='Enter product name'
							value={name}
							onChange={(e) => setName(e.target.value)}
						/>
					</Form.Group>

					<Form.Group controlId='price'>
						<Form.Label>Price</Form.Label>
						<Form.Control
							type='number'
							placeholder='Enter price'
							value={price}
							onChange={(e) => setPrice(e.target.value)}
						/>
					</Form.Group>

					<Form.Group controlId='category'>
						<Form.Label>Category</Form.Label>
						<Form.Control
							as='select'
							value={category}
							onChange={(e) => setCategory(e.target.value)}
						>
							<option value=''>Select Category</option>
							{categories.map(category => (
								<option key={category._id} value={category._id}>
									{category.name}
								</option>
							))}
						</Form.Control>
					</Form.Group>

					<Form.Group controlId='countInStock'>
						<Form.Label>Count In Stock</Form.Label>
						<Form.Control
							type='number'
							placeholder='Enter count in stock'
							value={countInStock}
							onChange={(e) => setCountInStock(e.target.value)}
						/>
					</Form.Group>

					<Form.Group controlId='description'>
						<Form.Label>Description</Form.Label>
						<Form.Control
							type='text'
							placeholder='Enter description'
							value={description}
							onChange={(e) => setDescription(e.target.value)}
						/>
					</Form.Group>

					<Button type='submit' variant='primary' disabled={isUpdating}>
						{isUpdating ? 'Updating…' : 'Update'}
					</Button>
				</Form>
			</FormContainer>
		</>
	);
};

export default ProductEditScreen;
