import SignUpPage from "../pages/SignUpPage";
import IndexFooter from "../components/IndexFooter/IndexFooter";
import { Container, Col, Row } from "react-bootstrap";
import useWindowDimensions from "../hooks/getWindowDimensions";
// when working on local version
const API_URL = "http://localhost:3000";

// when working on deployment version
// ?
function HomePage() {
  const { height, width } = useWindowDimensions();
  return (
    <>
      <Container
        style={{
          overflowX: "hidden",
          height: "100vh",
        }}
        fluid
      >
        <Row>
          <Col
            style={{
              display: width < 1001 ? "none" : "",
              maxWidth: "54.2%",
            }}
          ></Col>
          <SignUpPage />

          <IndexFooter />
        </Row>
      </Container>
    </>
  );
}

export default HomePage;
