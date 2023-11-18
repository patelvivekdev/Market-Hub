import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { Button, Col, Row, Image, Table } from "react-bootstrap";
import { useSelector } from "react-redux";
import { LinkContainer } from "react-router-bootstrap";
import { useGetMyOrdersQuery } from "../slices/orderSlice"
import Loader from "../components/Loader";
import Message from "../components/Message";
import { formattedDateTime } from "../utils/utils";

const ProfileScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const { userInfo } = useSelector((state) => state.auth);

  const { data: orders, isLoading, error } = useGetMyOrdersQuery();

  useEffect(() => {
    setName(userInfo.fullName);
    setEmail(userInfo.email);
  }, [userInfo.email, userInfo.fullName]);

  return (
    <>
      <Row>
        <Col md={5} className="mt-4">
          <h2>User Profile</h2>

          <Row className="mb-3">
            <Col md={3} className="fw-bold">Name:</Col>
            <Col md={9}>{name}</Col>
          </Row>

          <Row className="mb-3">
            <Col md={3} className="fw-bold">Email:</Col>
            <Col md={9}>{email}</Col>
          </Row>

          <Row className="mb-3">
            <Col md={3} className="fw-bold">Role:</Col>
            <Col md={9}>{userInfo.userType}</Col>
          </Row>
        </Col>

        {
          userInfo.userType === "Vendor" && (
            <Col md={4} className="mt-4">
              <h2>Vendor Profile</h2>
              <Row className="mb-3">
                <Col md={3} className="fw-bold">Company Address:</Col>
                <Col md={9}>{userInfo.profile?.address}</Col>
              </Row>

              <Row className="mb-3">
                <Col md={3} className="fw-bold">Company Phone:</Col>
                <Col md={9}>{userInfo.profile?.phone}</Col>
              </Row>

              <Row className="mb-3">
                <Col md={3} className="fw-bold">Company website:</Col>
                <Col md={9}>{userInfo.profile?.website}</Col>
              </Row>
            </Col>
          )
        }

        {
          userInfo.userType === "Client" && (
            <Col md={4} className="mt-4">
              <h2>Client Profile</h2>
              <Row className="mb-3">
                <Col md={3} className="fw-bold">Address:</Col>
                <Col md={9}>{userInfo.profile?.address}</Col>
              </Row>

              <Row className="mb-3">
                <Col md={3} className="fw-bold">Phone:</Col>
                <Col md={9}>{userInfo.profile?.phone}</Col>
              </Row>
            </Col>
          )
        }

        <Col md={3} className="text-center mt-4">
          <Image
            src={userInfo.profile?.profilePic}
            alt={userInfo.fullName}
            roundedCircle
            style={{ width: "200px", height: "200px" }}
          />
        </Col>
      </Row>

      {/* If Client Show orders */}
      {
        userInfo.userType === "Client" && (
          <Row>
            <Col md={12} className="mt-4">
              <h2>Orders</h2>
            </Col>

            <Col md={12}>
              {
                isLoading ? (
                  <Loader />
                ) : error ? (
                  <Message variant='danger'>
                    {error?.data?.message || error.error}
                  </Message>
                ) : (
                  <Table striped hover responsive className='table-sm'>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>DATE</th>
                        <th>TOTAL</th>
                        <th>PAID</th>
                        <th>DELIVERED</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order._id}>
                          <td>{order._id}</td>
                          <td>{order.createdAt.substring(0, 10)}</td>
                          <td>{order.totalPrice}</td>
                          <td>
                            {order.isPaid ? (
                              formattedDateTime(order.paidAt)
                            ) : (
                              <FaTimes style={{ color: 'red' }} />
                            )}
                          </td>
                          <td>
                            {order.isDelivered ? (
                              formattedDateTime(order.deliveredAt)
                            ) : (
                              <FaTimes style={{ color: 'red' }} />
                            )}
                          </td>
                          <td>
                            <LinkContainer to={`/orders/${order._id}`}>
                              <Button className='btn-sm' variant='light'>
                                Details
                              </Button>
                            </LinkContainer>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )
              }
            </Col>

          </Row>
        )
      }

      {/* If Vendor Show Products */}
      {
        userInfo.userType === "Vendor" && (
          <Row>
            <Col md={12} className="mt-4">
              <h2>Products</h2>
            </Col>
          </Row>
        )
      }

    </>
  );
};

export default ProfileScreen;
