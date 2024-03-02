import { Button, Col, Container, Row, Stack } from "react-bootstrap";

function RightSideColumnTest() {
  return (
    <>
      <Container fluid>
        <Row
          style={{
            height: "100vh",
            borderTop: "none",
            borderBottom: "none",
          }}
        >
          <Col
            style={{
              borderRight: "1px solid rgba(0,0,0,0.1)",
            }}
          ></Col>
          <Col
            style={{
              borderRight: "1px solid rgba(0,0,0,0.1)",
            }}
          ></Col>
          <Col>
            <Stack gap={3}>
              <div className="p-4">
                <input
                  style={{
                    width: "300px",
                    height: "53px",
                    position: "fixed",
                    top: "8px",
                    backgroundColor: "#eff3f4                    ",
                    border: "none",
                    borderRadius: "9999px",
                    borderWidth: "1px",
                  }}
                  type="text"
                  className="right-side-bar-input"
                />
                <svg
                  style={{
                    position: "relative",

                    top: "50%",
                    left: "15px",
                  }}
                  width={16}
                  height={16}
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-14j79pv r-4wgw6l r-f727ji"
                  color="#757575   "
                  fill="currentColor"
                >
                  <g>
                    <path d="M10.25 3.75c-3.59 0-6.5 2.91-6.5 6.5s2.91 6.5 6.5 6.5c1.795 0 3.419-.726 4.596-1.904 1.178-1.177 1.904-2.801 1.904-4.596 0-3.59-2.91-6.5-6.5-6.5zm-8.5 6.5c0-4.694 3.806-8.5 8.5-8.5s8.5 3.806 8.5 8.5c0 1.986-.682 3.815-1.824 5.262l4.781 4.781-1.414 1.414-4.781-4.781c-1.447 1.142-3.276 1.824-5.262 1.824-4.694 0-8.5-3.806-8.5-8.5z"></path>
                  </g>
                </svg>
                <span
                  style={{
                    position: "relative",
                    left: "40px",
                    top: "1px",
                    color: "#757575",
                  }}
                >
                  Search
                </span>
              </div>
              <div
                style={{
                  border: "none",
                  borderWidth: "1px",
                  borderRadius: "12px",
                  backgroundColor: "#eff3f4",
                  maxWidth: "348px",
                }}
                className="p-4"
              >
                <div>
                  <div
                    style={{
                      fontSize: "20px",
                      fontWeight: "800",
                      lineHeight: "24px",
                    }}
                  >
                    Subscribe to Premium
                  </div>
                  <div
                    style={{
                      fontSize: "15px",
                      fontWeight: "400",
                      lineHeight: "20px",
                      marginTop: "10px",
                    }}
                  >
                    Subscribe to unlock new features and if eligible, receive a
                    share of ads revenue.
                  </div>

                  <Button
                    style={{
                      display: "inline",
                      marginTop: "10px",
                      maxWidth: "107px",
                    }}
                    className="login-button"
                    variant="dark"
                  >
                    Subscribe
                  </Button>
                </div>
              </div>
              <div
                style={{
                  border: "none",
                  borderWidth: "1px",
                  borderRadius: "12px",
                  backgroundColor: "#eff3f4",
                  maxWidth: "348px",
                }}
                className="p-4"
              >
                <div>
                  <div
                    style={{
                      fontSize: "20px",
                      fontWeight: "800",
                      lineHeight: "24px",
                    }}
                  >
                    Who to follow
                  </div>
                  <div>
                    <Stack direction="horizontal">
                      <div>
                        {" "}
                        <img
                          width={36}
                          height={36}
                          style={{
                            borderRadius: "50%",
                          }}
                          src="http://res.cloudinary.com/ddqbb9yqj/image/upload/v1709027101/connectify/z0xgv9hfzegp6re7oyzl.jpg"
                          alt=""
                        />
                      </div>
                      <div className="p-3">
                        <div
                          style={{
                            lineHeight: "20px",
                            fontSize: "15px",
                            fontWeight: "700",
                          }}
                        >
                          Full Name
                        </div>
                        <div
                          style={{
                            lineHeight: "20px",
                            fontSize: "15px",
                            fontWeight: "400",
                            color: "rgb(83, 100, 113)",
                          }}
                        >
                          @Username
                        </div>
                      </div>
                      <div className="ms-auto">
                        <Button
                          style={{
                            maxWidth: "78px",
                          }}
                          className="login-button"
                          variant="dark"
                        >
                          Follow
                        </Button>
                      </div>
                    </Stack>
                  </div>

                  <div
                    style={{
                      color: "rgb(29, 155, 240)",
                      fontSize: "15px",
                      lineHeight: "20px",
                      fontWeight: "400",
                    }}
                  >
                    Show more
                  </div>
                </div>
              </div>

              <div className="p-4">
                <ul>
                  <li>Terms of Service</li>
                  <li>Privacy Policy</li>
                  <li>Cookie Policy</li>
                  <li>MStV Transparenzangaben</li>
                  <li>Imprint</li>
                  <li>Accessibility</li>
                  <li>Ads info</li>
                  <li>2024 Connectify Corp.</li>
                </ul>
              </div>
            </Stack>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default RightSideColumnTest;
