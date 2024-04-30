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
          // overflowY: "hidden",
          height: "100%",
        }}
        fluid
      >
        <Row>
          <Col
            style={{
              display: width < 1001 ? "none" : "flex",
              maxWidth: "54.2%",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={712}
              height={438}
              viewBox="0 0 100 100"
            >
              {/* İçi dolu bir kare */}
              <rect
                x="5"
                y="5"
                width="90"
                height="90"
                fill="#3b5998"
                rx="5"
                ry="5"
              >
                <animate
                  attributeName="y"
                  values="5; 20; 5"
                  dur="1s"
                  keyTimes="0; 0.5; 1"
                  calcMode="spline"
                  keySplines="0.4 0 0.2 1; 0.4 0 0.2 1"
                  repeatCount="1"
                />

                <animate
                  attributeName="x"
                  values="5; 20; 5"
                  dur="1s"
                  begin="1s"
                  keyTimes="0; 0.5; 1"
                  calcMode="spline"
                  keySplines="0.4 0 0.2 1; 0.4 0 0.2 1"
                  repeatCount="1"
                />
              </rect>

              <text
                x="27.5"
                y="70"
                fontFamily="Arial"
                fontSize="60"
                fill="#FFF"
                stroke="#FFF"
                strokeWidth="2"
              >
                C
              </text>
            </svg>
          </Col>
          <SignUpPage />

          <IndexFooter />
        </Row>
      </Container>
    </>
  );
}

export default HomePage;
