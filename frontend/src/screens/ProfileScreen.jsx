import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { Button, Col, Row, Image, Table, Modal, Form } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { Link } from "react-router-dom";
import { useGetMyOrdersQuery } from "../slices/orderSlice"
import Loader from "../components/Loader";
import Message from "../components/Message";
import { formattedDateTime } from "../utils/utils";
import { useGetUserProfileQuery, useUploadProfilePicMutation, useSendVerifyEmailMutation } from '../slices/usersApiSlice'
import { toast } from "react-toastify";
import Meta from "../components/Meta";

const ProfileScreen = () => {
  const [showModal, setShowModal] = useState(false);
  const [image, setImage] = useState('');

  const { data: userInfo, refetch, isLoading: isProfileLoading } = useGetUserProfileQuery();

  const { data: orders, isLoading, error } = useGetMyOrdersQuery();

  const [uploadProfilePic, { isLoading: isImageUploading }] = useUploadProfilePicMutation();
  const [sendVerifyEmail, { isLoading: isSendVerifyEmailLoading }] = useSendVerifyEmailMutation();



  const isVerified = userInfo?.isEmailVerified;

  const sendVerificationEmail = async (e) => {
    await sendVerifyEmail().unwrap();
    toast.success('Verification email sent successfully', {
      toastId: 'sendVerifyEmailToastId',
      autoClose: 2000,
    });
  }

  const handleImageChange = async (e) => {
    setShowModal(false);
    e.preventDefault();

    // check if image is selected
    if (!image) {
      return toast.error('Please select an image', {
        toastId: 'changeImageToastId',
        autoClose: 2000,
      });
    }

    try {
      const formData = new FormData();
      formData.append('image', image);

      // Make API call to change the image
      await uploadProfilePic(formData).unwrap();
      toast.success('Image changed successfully', {
        toastId: 'changeImageToastId',
        autoClose: 2000,
      });
      refetch()

    } catch (err) {
      toast.error(err.data.message, {
        toastId: 'changeImageToastId',
        autoClose: 2000,
      });
    }
  }

  if (isProfileLoading || isLoading || isImageUploading || isSendVerifyEmailLoading) {
    return <Loader />;
  }

  return (
    <>
      {isProfileLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <>
          <Meta title={userInfo.profile.name + " profile"} description={userInfo.profile.name + "profile"} keywords={userInfo.profile.name + "profile"} />
          {isImageUploading && <Loader />}

          {!isVerified && (
            <Message variant='warning'>
              Please verify your email address.{' '}
              <Button
                variant='link'
                onClick={sendVerificationEmail}
                className='p-0'
              >
                Resend verification email
              </Button>
            </Message>
          )}
          <Row>
            <Col md={5} className="mt-4">
              <h2>User Profile</h2>

              <Row className="mb-3">
                <Col md={3} className="fw-bold">Name:</Col>
                <Col md={9}>{userInfo.profile.name}</Col>
              </Row>

              <Row className="mb-3">
                <Col md={3} className="fw-bold">Email:</Col>
                <Col md={9}>{userInfo.email}</Col>
              </Row>

              <Row className="mb-3">
                <Col md={3} className="fw-bold">Role:</Col>
                <Col md={9}>{userInfo.userType}</Col>
              </Row>

              <Row className="mb-3">
                <Link to="change-password" className="btn btn-primary my-3">
                  Change Password
                </Link>
              </Row>
            </Col>

            {
              userInfo.userType === "Vendor" && (
                <Col md={4} className="mt-4">
                  <h2>Vendor Profile</h2>
                  <Row className="mb-3">
                    <Col md={4} className="fw-bold">Company Address:</Col>
                    <Col md={8}>{userInfo.profile?.address}</Col>
                  </Row>

                  <Row className="mb-3">
                    <Col md={4} className="fw-bold">Company Phone:</Col>
                    <Col md={8}>{userInfo.profile?.phone}</Col>
                  </Row>

                  <Row className="mb-3">
                    <Col md={4} className="fw-bold">Company website:</Col>
                    <Col md={8}>{userInfo.profile?.website}</Col>
                  </Row>

                  <Row className="mb-3">
                    <Col md={4} className="fw-bold">Company Description:</Col>
                    <Col md={8}>{userInfo.profile?.description}</Col>
                  </Row>
                </Col>
              )
            }

            {
              userInfo.userType === "Client" && (
                <Col md={4} className="mt-4">
                  <h2>Client Profile</h2>
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
              <Button className="btn my-3 ms-3" variant="dark" onClick={() => setShowModal(true)}>
                Change Profile Picture
              </Button>
              {/* Modal to handle image change */}
              {showModal && (
                <Modal show={showModal} onHide={() => setShowModal(false)}>
                  <Modal.Header closeButton>
                    <Modal.Title>Change Image</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <Form>
                      <Form.Group controlId='roleSelect'>
                        <Form.Label>Select New Image</Form.Label>
                        <Form.Control
                          type='file'
                          accept='image/*'
                          onChange={(e) => setImage(e.target.files[0])}
                        ></Form.Control>
                      </Form.Group>
                    </Form>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant='secondary' onClick={() => setShowModal(false)}>
                      Close
                    </Button>
                    <Button variant='primary' onClick={handleImageChange}>
                      Upload
                    </Button>
                  </Modal.Footer>
                </Modal>
              )}
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

                      // If no order show no orders message
                      orders.length === 0 ? (
                        <Col className='mt-4'>
                          <Message variant='info'>No Orders Found</Message>
                        </Col>
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
                    )
                  }
                </Col>
              </Row>
            )
          }
        </>
      )
      }
    </>
  );
};

export default ProfileScreen;
