import Loader from "../../../components/Loader";
import Message from "../../../components/Message";
import { Button, Col, Row, Table } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";

import {
  useGetProductsQuery,
} from '../../../slices/productsApiSlice';

const ProductListScreen = () => {

  const { data, isLoading, error } = useGetProductsQuery();

  return (
    <>
      <Row className='align-items-center'>
        <Col>
          <h1>Products</h1>
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
                <th>PRICE</th>
                <th>CATEGORY</th>
                <th>VENDOR</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {data.map((product) => (
                <tr key={product._id}>
                  <td>{product._id}</td>
                  <td>{product.name}</td>
                  <td>${product.price}</td>
                  <td>{product.category}</td>
                  <td>{product.vendor.vendorName}</td>
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

export default ProductListScreen;
