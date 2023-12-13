import Loader from "../../../components/Loader";
import Message from "../../../components/Message";
import { Button, Col, Row, Table } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";

import {
	useGetCategoriesQuery,
} from '../../../slices/categoriesApiSlice';

const CategoryListScreen = () => {

	const { data, isLoading, error } = useGetCategoriesQuery();

	return (
		<>
			<Row className='align-items-center'>
				<Col>
					<h1>Categories</h1>
				</Col>
				<Col className='text-right'>
					<Link to='/Admin/categories/add' id="createCategory" className='btn btn-primary my-3'>
						Create Category
					</Link>
				</Col>
			</Row>
			{isLoading ? (
				<Loader />
			) : error ? (
				<Message variant='danger'>{error.data.message}</Message>
			) : (
				<>
					<Table striped bordered hover responsive className='table-sm'>
						<thead>
							<tr>
								<th>ID</th>
								<th>NAME</th>
								<th>DESCRIPTION</th>
								<th>ACTIONS</th>
							</tr>
						</thead>
						<tbody>
							{data.map((category) => (
								<tr key={category._id}>
									<td>{category._id}</td>
									<td>{category.name}</td>
									<td>{category.description}</td>
									<td>
										<Button variant='light' className='btn-sm mx-2'>
											<FaEdit />
										</Button>
										<Button
											variant='danger'
											className='btn-sm'
										>
											<FaTrash style={{ color: 'white' }} />
										</Button>
									</td>
								</tr>
							))}
						</tbody>
					</Table>
				</>
			)}
		</>
	);
};

export default CategoryListScreen;
