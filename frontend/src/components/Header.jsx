import { Navbar, Nav, Container } from 'react-bootstrap';
import { FaShoppingCart, FaUser, FaUserPlus } from 'react-icons/fa';
import { LinkContainer } from 'react-router-bootstrap';

const Header = () => {

  // get the user info from the local storage
  const userInfo = localStorage.getItem('userInfo');

  // if the user is logged in, get the user info from the local storage
  const user = JSON.parse(userInfo);

  const logoutHandler = () => {
    localStorage.removeItem('userInfo');
    window.location.href = '/login';
  }

  return (
    <header>
      <Navbar bg='dark' variant='dark' expand='lg' collapseOnSelect>
        <Container>
          <LinkContainer to='/'>
            <Navbar.Brand>
              Market Hub <FaShoppingCart />
            </Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls='basic-navbar-nav' />
          <Navbar.Collapse id='basic-navbar-nav'>
            <Nav className='ms-auto'>
              {user ? (
                <>
                  <LinkContainer to='/profile'>
                    <Nav.Link>
                      <FaUser /> Profile
                    </Nav.Link>
                  </LinkContainer>
                  <LinkContainer to='/login' onClick={logoutHandler}>
                    <Nav.Link>
                      Logout
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
                  <LinkContainer to='/register'>
                    <Nav.Link>
                      <FaUserPlus /> Register
                    </Nav.Link>
                  </LinkContainer>
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
