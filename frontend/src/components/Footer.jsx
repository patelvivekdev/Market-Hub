import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className='footer' >
      <Container>
        <Row>
          <Col className='text-center py-3'>
            <p>Market Hub &copy; {currentYear}</p>
            <p>Made with ❤️</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};
export default Footer;