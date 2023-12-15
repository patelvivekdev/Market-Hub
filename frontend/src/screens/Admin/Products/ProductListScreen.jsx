import Loader from "../../../components/Loader";
import Message from "../../../components/Message";
import { Button, Col, Row, Table } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useParams } from 'react-router-dom';

import {
  useGetProductsQuery,
} from '../../../slices/productsApiSlice';

import Paginate from '../../../components/Paginate';

const ProductListScreen = () => {
  const { pageNumber } = useParams();

  const { data, isLoading, error } = useGetProductsQuery(
    { pageNumber }
  );

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
        <>
          {console.log(error)}
          < Message variant='danger'>{error.data?.message}</Message >
        </>
      ) : (
        <>
          {
            data.products.length === 0 ? (
              <Col className='mt-4'>
                <Message variant='info'>No Products Found</Message>
              </Col>
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
                    {data.products.map((product) => (
                      <tr key={product._id}>
                        <td>{product._id}</td>
                        <td>{product.name}</td>
                        <td>${product.price}</td>
                        <td>{product?.category?.name}</td>
                        <td>{product.vendor.name}</td>
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
                <Paginate pages={data.pages} page={data.page} isAdmin={true} />
              </>
            )
          }


        </>
      )}
    </>
  );
};

export default ProductListScreen;
