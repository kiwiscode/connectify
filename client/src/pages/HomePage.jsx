import SignUpPage from "../pages/SignUpPage";
import IndexFooter from "../components/IndexFooter/IndexFooter";
import { Container, Col, Row } from "react-bootstrap";
// when working on local version
const API_URL = "http://localhost:3000";

// when working on deployment version
// ?
function HomePage() {
  return (
    <>
      <Container fluid>
        <Row>
          <Col></Col>
          <SignUpPage />

          <IndexFooter />
        </Row>
      </Container>
    </>
  );
}

export default HomePage;
