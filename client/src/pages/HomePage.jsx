import SignUpPage from "../pages/SignUpPage";
import IndexFooter from "../components/IndexFooter/IndexFooter";
import { Container, Col, Row } from "react-bootstrap";
import useWindowDimensions from "../hooks/getWindowDimensions";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const { width } = useWindowDimensions();
  const { getToken } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    const token = getToken();

    if (token) {
      navigate("/home");
    }
  }, [navigate, getToken]);

  // show alert
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    const hasSeenAlert = localStorage.getItem("hasSeenAlert");
    if (!hasSeenAlert) {
      setShowAlert(true);
    }
  }, []);

  const closeAlert = () => {
    setShowAlert(false);
    localStorage.setItem("hasSeenAlert", "true");
  };

  const handleOutsideClick = (e) => {
    if (e.target.id === "alert-overlay") {
      closeAlert();
    }
  };

  return (
    <>
      {showAlert && (
        <div
          className="chirp-regular-font"
          id="alert-overlay "
          onClick={handleOutsideClick}
          style={{
            position: "fixed",
            top: 0,
            bottom: 0,
            right: 0,
            left: 0,
            zIndex: 1,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.3)", // Arka plan saydam
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "8px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
              maxWidth: "90%",
              width: "400px",
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%,-50%)",
              zIndex: 2,
            }}
          >
            🚨 Attention! This project is hosted on a free server, so server
            response times may occasionally be delayed. Thank you for your
            patience! 🚀
            <br />
            <button
              onClick={closeAlert}
              style={{ marginTop: "20px", padding: "10px", cursor: "pointer" }}
            >
              Close
            </button>
          </div>
        </div>
      )}
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
                fontFamily="sans-serif"
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
