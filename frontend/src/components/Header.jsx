import React, { useState } from "react";
import { Badge, Button, Container, Form, Modal, Nav, NavDropdown, Navbar } from "react-bootstrap";
import { BiLogOut } from "react-icons/bi";
import { FaCartPlus, FaShoppingCart, FaUser, FaUserPlus } from "react-icons/fa";
import { FcAbout } from "react-icons/fc";
import { MdContactSupport } from "react-icons/md";
import { FcFaq } from "react-icons/fc";
import { MdProductionQuantityLimits } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { LinkContainer } from "react-router-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { logout } from "../slices/authSlice";
import { resetCart } from "../slices/cartSlice";
import { useLogoutMutation } from "../slices/usersApiSlice";

import logo from '../assets/vector/isolated-monochrome-white.svg';

const Header = () => {
  const { cartItems } = useSelector((state) => state.cart);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [logoutApiCall] = useLogoutMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      dispatch(resetCart());
      toast.success('Logged out successfully', {
        customId: 'logoutToastId',
        autoClose: 1000,
      });
      navigate('/login');
    } catch (err) {
      console.error(err);
    }
  }

  const [showModal, setShowModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');

  const handleShowModal = () => {
    setSelectedRole('Client');
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleRoleChange = (e) => {
    setSelectedRole(e.target.value);
  };

  const handleRegister = () => {
    // Based on the selected role, redirect to the corresponding registration page
    if (selectedRole === 'Client') {
      navigate('/Client/register');
    } else if (selectedRole === 'Vendor') {
      navigate('/Vendor/register');
    }

    // Close the modal
    handleCloseModal();
  };

  return (
    <header>
      <Navbar bg='dark' variant='dark' expand='lg' collapseOnSelect>
        <Container>
          <LinkContainer to='/'>
            <Navbar.Brand>
              <img src={logo} alt='logo' style={{ height: '30px' }} />
            </Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls='basic-navbar-nav' />
          <Navbar.Collapse id='basic-navbar-nav'>
            <Nav className='ms-auto'>
              {/* Client Links */}
              {userInfo && userInfo.userType === 'Client' && (
                <>
                  <LinkContainer to='/store/category/All/vendor/All'>
                    <Nav.Link>
                      <FaCartPlus /> Products
                    </Nav.Link>
                  </LinkContainer>
                  <LinkContainer to='/cart'>
                    <Nav.Link>
                      <FaShoppingCart /> Cart
                      {cartItems.length > 0 && (
                        <Badge pill bg='primary' style={{ marginLeft: '5px' }}>
                          {cartItems.reduce((a, c) => a + c.qty, 0)}
                        </Badge>
                      )}
                    </Nav.Link>
                  </LinkContainer>
                </>
              )}

              {/* Vendor Links */}
              {userInfo && userInfo.userType === 'Vendor' && (
                <>
                  <LinkContainer to='/Vendor/products'>
                    <Nav.Link>
                      <MdProductionQuantityLimits /> Products
                    </Nav.Link>
                  </LinkContainer>
                </>
              )}

              {/* User Links */}
              {userInfo ? (
                <>
                  <LinkContainer to={userInfo.userType + "/profile"}>
                    <Nav.Link>
                      <FaUser /> {userInfo.username}
                    </Nav.Link>
                  </LinkContainer>
                  <LinkContainer to='/login' onClick={logoutHandler}>
                    <Nav.Link>
                      <BiLogOut /> Logout
                    </Nav.Link>
                  </LinkContainer>
                </>
              ) : (
                <>
                  <LinkContainer to='/login'>
                    <Nav.Link>
                      <FaUser /> Login
                    </Nav.Link>
                  </LinkContainer>
                  <Nav.Link onClick={handleShowModal}>
                    <FaUserPlus /> Register
                  </Nav.Link>
                  <Modal show={showModal} onHide={handleCloseModal}>
                    <Modal.Header closeButton>
                      <Modal.Title>Register as:</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <Form>
                        <Form.Group controlId='roleSelect'>
                          <Form.Label>Select your role:</Form.Label>
                          <Form.Control as='select' onChange={handleRoleChange}>
                            <option value='Client'>Client</option>
                            <option value='Vendor'>Vendor</option>
                          </Form.Control>
                        </Form.Group>
                      </Form>
                    </Modal.Body>
                    <Modal.Footer>
                      <Button variant='secondary' onClick={handleCloseModal}>
                        Close
                      </Button>
                      <Button variant='primary' onClick={handleRegister}>
                        Register
                      </Button>
                    </Modal.Footer>
                  </Modal>
                  <LinkContainer to='/about'>
                    <Nav.Link>
                      <FcAbout /> About Us
                    </Nav.Link>
                  </LinkContainer>
                  <LinkContainer to='/contact-us'>
                    <Nav.Link>
                      <MdContactSupport /> Contact Us
                    </Nav.Link>
                  </LinkContainer>
                  <LinkContainer to='/faq'>
                    <Nav.Link>
                      <FcFaq /> FAQ
                    </Nav.Link>
                  </LinkContainer>
                </>
              )}

              {/* Admin Links */}
              {userInfo && userInfo.userType === 'Admin' && (
                <NavDropdown title='Admin' id='adminmenu'>
                  <LinkContainer to='/Admin/productlist'>
                    <NavDropdown.Item>Products</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to='/Admin/userlist'>
                    <NavDropdown.Item>Users</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to='/Admin/orderlist'>
                    <NavDropdown.Item>Orders</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to='/Admin/categories'>
                    <NavDropdown.Item>Categories</NavDropdown.Item>
                  </LinkContainer>
                </NavDropdown>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header >
  );
};

export default Header;
