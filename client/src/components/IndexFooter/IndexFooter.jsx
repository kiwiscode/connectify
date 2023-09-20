import { Container, Col, Row } from "react-bootstrap";
// import "bootstrap/dist/css/bootstrap.min.css";
function IndexFooter() {
  return (
    <>
      <Container
        style={{
          justifyContent: "center",
        }}
      >
        <Row>
          <Col>
            <div className="footer-container">
              <a href="">
                <span>About</span>
              </a>
              <a href="">
                <span>Help Center</span>
              </a>
              <a href="">
                <span>Terms of Service</span>
              </a>
              <a href="">
                <span>Privacy Policy</span>
              </a>
              <a href="">
                <span>Cookie Policy</span>
              </a>
              <a href="">
                <span>Blog</span>
              </a>
              <a href="">
                <span>Status</span>
              </a>
              <a href="">
                <span>Advertising</span>
              </a>
              <a href="">
                <span>Marketing</span>
              </a>
              <a href="">
                <span>Developers</span>
              </a>
              <a href="">
                <span>Directory</span>
              </a>
              <a href="">
                <span>Settings</span>
              </a>
              <a href="">
                <span>© 2023 C kiwiscode</span>
              </a>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default IndexFooter;
