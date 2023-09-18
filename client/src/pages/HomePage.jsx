import LogInPage from "../pages/LogInPage";
import SignUpPage from "../pages/SignUpPage";
import IndexFooter from "../components/IndexFooter/IndexFooter";
import { Container, Col } from "react-bootstrap";

function HomePage() {
  return (
    <>
      <div className="parent-container">
        <Container>
          <Col className="input">
            {" "}
            <SignUpPage />
          </Col>

          <Col className="mt-5 input">
            {" "}
            <LogInPage />
          </Col>
        </Container>
      </div>
      <IndexFooter />
    </>
  );
}

export default HomePage;
