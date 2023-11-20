import FormContainer from "../../../components/FormContainer";
import Loader from "../../../components/Loader";
import { useState } from "react";
import { Button, Form, } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useCreateCategoryMutation } from "../../../slices/categoriesApiSlice";

const AddCategoryScreen = () => {
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");

	const navigate = useNavigate();

	const [createCategory, { isLoading }] = useCreateCategoryMutation();

	const showErrorToast = (message) => {
		toast.error(message, {
			toastId: "categoryErrorToast",
			autoClose: 1000,
		});
	}

	const submitHandler = async (e) => {
		e.preventDefault();

		if (!name || !description) {
			showErrorToast("Please fill all the fields");
			return;
		}

		try {
			await createCategory({ name, description }).unwrap();

			toast.success("Category created successfully");
			navigate("/Admin/categories");
		} catch (error) {
			toast.error(error?.response?.data?.message || error?.data?.message);
		}
	};

	return (
		<>
			<Link to="/Admin/categories" className="btn btn-light my-3">
				Go Back
			</Link>
			<FormContainer>
				<h1>Add Category</h1>
				{isLoading && <Loader />}
				<Form onSubmit={submitHandler}>
					<Form.Group controlId="name">
						<Form.Label>Name</Form.Label>
						<Form.Control
							type="name"
							placeholder="Enter category name"
							value={name}
							onChange={(e) => setName(e.target.value)}
						></Form.Control>
					</Form.Group>

					<Form.Group controlId="description">
						<Form.Label>Description</Form.Label>
						<Form.Control
							type="description"
							placeholder="Enter category description"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
						></Form.Control>
					</Form.Group>

					<Button type="submit" variant="primary">
						Create Category
					</Button>
				</Form>
			</FormContainer>
		</>
	);
}


export default AddCategoryScreen;