import LogInPage from "../pages/LogInPage";
import SignUpPage from "../pages/SignUpPage";
import IndexFooter from "../components/IndexFooter/IndexFooter";
import { Container, Col, Row } from "react-bootstrap";

function HomePage() {
  console.log("HELLO WORLD!");

  return (
    <>
      <Container
        style={{
          marginTop: "243px",
        }}
      >
        <Row>
          <Col>
            <SignUpPage />
            <LogInPage />
            <IndexFooter />
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default HomePage;
