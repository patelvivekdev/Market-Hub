import React, { useState } from 'react';
import { Navbar, Nav, Container, Modal, Button, Form } from 'react-bootstrap';
import { FaShoppingCart, FaUser, FaUserPlus } from 'react-icons/fa';
import { BiLogOut } from 'react-icons/bi';

import { MdProductionQuantityLimits } from 'react-icons/md';
import { LinkContainer } from 'react-router-bootstrap';
import { toast } from 'react-toastify';

const Header = () => {

  // get the user info from the local storage
  const userInfo = localStorage.getItem('userInfo');

  // if the user is logged in, get the user info from the local storage
  const user = JSON.parse(userInfo);

  const logoutHandler = () => {
    toast.success('Logged out successfully');
    localStorage.removeItem('userInfo');
    window.location.href = '/login';
  }

  const [showModal, setShowModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState('Client');

  const handleShowModal = () => {
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
      window.location.href = 'Client/register';
    } else if (selectedRole === 'Vendor') {
      window.location.href = 'Vendor/register';
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
              <FaShoppingCart /> Market Hub
            </Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls='basic-navbar-nav' />
          <Navbar.Collapse id='basic-navbar-nav'>
            <Nav className='ms-auto'>
              {user ? (
                <>
                  <LinkContainer to='/products'>
                    <Nav.Link>
                      <MdProductionQuantityLimits /> Products
                    </Nav.Link>
                  </LinkContainer>
                  <LinkContainer to='/profile'>
                    <Nav.Link>
                      <FaUser /> {user.username}
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
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
