import { Container, Col, Row } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
function IndexFooter() {
  return (
    <>
      <Container className="footer-container">
        <Col>
          <Row>About</Row>
          <Row>Help Center</Row>
        </Col>
      </Container>
    </>
  );
}

export default IndexFooter;
