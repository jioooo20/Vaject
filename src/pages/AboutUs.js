// Import component Bootstrap React (opsional)
import { Container, Row, Col } from 'react-bootstrap';

function AboutUs() {
  return (
    // Tampilkan konten halaman about us
    <Container className="mt-3">
      <Row>
        <Col md={{ span: 8 }}>
          {/* Isi konten */}
          <h1>About Us</h1>
          <p>This is a brief description about our company.</p>
        </Col>
      </Row>
    </Container>
  );
}

export default AboutUs;
