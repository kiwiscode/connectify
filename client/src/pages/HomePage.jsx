import LogInPage from "../pages/LogInPage";
import SignUpPage from "../pages/SignUpPage";
import IndexFooter from "../components/IndexFooter/IndexFooter";

import { Container, Col } from "react-bootstrap";
function HomePage() {
  console.log("HELLO WORLD!");

  return (
    <>
      {/* start  */}
      {/* finish  */}

      <Container className="first-page">
        <Col>
          {" "}
          <SignUpPage />
        </Col>

        <Col className="mt-5">
          {" "}
          <LogInPage />
        </Col>
      </Container>

      <IndexFooter />
    </>
  );
}

export default HomePage;
