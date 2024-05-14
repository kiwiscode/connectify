import SignUpPage from "../pages/SignUpPage";
import IndexFooter from "../components/IndexFooter/IndexFooter";
import { Container, Col, Row } from "react-bootstrap";
import useWindowDimensions from "../hooks/getWindowDimensions";

// when working on local version
const API_URL = "http://localhost:3000";

// when working on deployment version
// ?
function HomePage() {
  const { width } = useWindowDimensions();

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
              fill="yellow"
              xmlns="http://www.w3.org/2000/svg"
              width={712}
              height={438}
              // height={438}
              viewBox="0 0 100 110"
              style={{
                filter: "drop-shadow(0 0 10px rgba(0, 0, 0, 0.5))",
              }}
            >
              <rect
                x="5"
                y="5"
                width="90"
                height="90"
                fill="#1C9BEF"
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
                className="text-test"
                x="27.5"
                y="70"
                fontFamily="Arial"
                fontSize="22"
                fill="#FFF"
                stroke="#FFF"
                strokeWidth="2"
                style={{}}
              >
                <animate
                  attributeName="y"
                  values="70; 85; 70"
                  dur="1s"
                  keyTimes="0; 0.5; 1"
                  calcMode="spline"
                  keySplines="0.4 0 0.2 1; 0.4 0 0.2 1"
                  repeatCount="1"
                />
                <animate
                  attributeName="x"
                  values="27.5; 42.5; 27.5"
                  dur="1s"
                  begin="1s"
                  keyTimes="0; 0.5; 1"
                  calcMode="spline"
                  keySplines="0.4 0 0.2 1; 0.4 0 0.2 1"
                  repeatCount="1"
                />{" "}
                Connectify
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
