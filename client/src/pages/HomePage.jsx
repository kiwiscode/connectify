import LogInPage from "../pages/LogInPage";
import SignUpPage from "../pages/SignUpPage";
import { Container, Col } from "react-bootstrap";
function HomePage() {
  return (
    <>
      <div>
        <Container>
          <Col>
            {" "}
            <SignUpPage />
          </Col>
          <Col className="mt-2">
            {" "}
            <LogInPage />
          </Col>
        </Container>
      </div>
    </>
  );
}

export default HomePage;
