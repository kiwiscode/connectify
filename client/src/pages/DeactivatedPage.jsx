import { Layout, Flex } from "antd";
const { Header, Footer, Sider, Content } = Layout;

import { Container, Row, Col, Button, Stack } from "react-bootstrap";
import { Link } from "react-router-dom";
import { PostModal, SigninModal } from "../components/ui/Modal";
import { useState } from "react";
// when working on local version
const API_URL = "http://localhost:3000";

// when working on deployment version
// ?

// const socket = io.connect(API_URL);

function DeactivatedPage() {
  const [show, setShow] = useState(false);

  return (
    <>
      <Container>
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
            className="left-column"
            xs={2}
            sm={2}
            md={1}
            lg={3}
            xxl={3}
          >
            <nav className="nav-bar-home">
              <div className="inner-div-fonts inner-div">
                <Link to="/home">
                  <div className="home">
                    <div>
                      <svg
                        width={26}
                        height={26}
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-18jsvk2 r-lwhw9o r-cnnz9e"
                      >
                        <g>
                          <path d="M22.25 13.46v-2.92l-2.36-1.57c-.17-.12-.26-.33-.21-.53l.58-2.54-2.17-2.17-2.53.59c-.21.04-.42-.04-.53-.21l-1.57-2.36h-2.92L8.96 4.11c-.11.17-.32.25-.52.21L5.9 3.73 3.73 5.9l.58 2.54c.05.2-.03.41-.21.53l-2.35 1.57v2.92l2.35 1.57c.18.12.26.33.21.53l-.58 2.54 2.17 2.17 2.54-.59c.2-.04.41.04.52.21l1.58 2.36h2.92l1.57-2.36c.11-.17.32-.25.53-.21l2.53.59 2.17-2.17-.58-2.54c-.05-.2.04-.41.21-.53l2.36-1.57zM12 15c-1.66 0-3-1.34-3-3s1.34-3 3-3c1.65 0 3 1.34 3 3s-1.35 3-3 3z"></path>
                        </g>
                      </svg>

                      <span
                        style={{
                          fontSize: "20px",
                          fontWeight: "700",
                          lineHeight: "24px",
                        }}
                      >
                        Settings
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            </nav>
          </Col>

          {/* start to check  main column */}

          <Col
            className="d-none d-lg-block d-xxl-block md-none"
            xs={12} // 0px - 576px aralığı
            sm={12} // 576px - 768px aralığı
            md={6} // 768px - 992px aralığı
            lg={3} // 1200px - 1400px aralığı
            xxl={3} // 1400px ve sonrası aralığı
            style={{
              borderRight: "1px solid rgba(0,0,0,0.1)",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                padding: "8px",
              }}
            >
              <div
                style={{
                  marginBottom: "15px",
                  fontWeight: "700",
                  fontSize: "20px",
                  lineHeight: "24px",
                }}
              >
                Settings
              </div>
              <div
                style={{
                  marginBottom: "15px",
                  fontWeight: "700",
                  fontSize: "20px",
                  lineHeight: "24px",
                }}
              >
                Privacy
              </div>
            </div>
          </Col>
          {/* finish to check  main column */}

          {/* 3.column burası olucak */}
          <Col
            xs={10} // 0px - 576px aralığı
            sm={10} // 576px - 768px aralığı
            md={10} // 768px - 992px aralığı
            lg={6} // 1200px - 1400px aralığı
            xxl={6} // 1400px ve sonrası aralığı
            style={{
              borderRight: "1px solid rgba(0,0,0,0.1)",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                padding: "8px",
              }}
            >
              <div
                style={{
                  marginBottom: "15px",
                  fontSize: "20px",
                  fontWeight: "700",
                  lineHeight: "24px",
                }}
              >
                Deactivated
              </div>
              <div
                style={{
                  marginBottom: "15px",
                  fontSize: "20px",
                  fontWeight: "800",
                  lineHeight: "24px",
                }}
              >
                Your account is deactivated
              </div>
              <div
                style={{
                  color: "rgb(83, 100, 113)",
                  fontSize: "13px",
                  fontWeight: "400",
                  lineHeight: "16px",
                }}
              >
                Sorry to see you go. #GoodBye
              </div>
            </div>
          </Col>
        </Row>
      </Container>

      {/* start to check  */}

      <Flex
        style={{
          backgroundColor: "rgba(29,155,240,1.00)",

          width: "100%",
        }}
        gap="middle"
        wrap="wrap"
      >
        <Footer
          style={{
            textAlign: "center",
            color: "#fff",
            backgroundColor: "rgba(29,155,240,1.00)",
            maxHeight: "72px",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            justifyContent: "center",
            width: "100%",
          }}
        >
          <Stack
            className="deactivated-footer"
            style={{
              display: "flex",
              justifyContent: " center",
            }}
            direction="horizontal"
            gap={2}
          >
            <div
              className="p-2 ms-auto deactivated-footer-text"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                // marginLeft: "50px",
              }}
            >
              <div
                style={{
                  fontSize: "23px",
                  fontWeight: "700",
                  lineHeight: "23px",
                }}
              >
                Don’t miss what’s happening
              </div>
              <div
                style={{
                  fontSize: "15px",
                  fontWeight: "400",
                  lineHeight: "20px",
                }}
              >
                People on Connectify are the first to know.
              </div>
            </div>
            <div className="p-2 ms-auto deactivated-footer-login">
              <SigninModal deactivatedScren={true} />
            </div>
            <div className="p-0 deactivated-footer-signup">
              <Button
                style={{
                  cursor: "pointer",
                  maxWidth: "87px",
                  maxHeight: "36px",
                  textAlign: "center",
                  border: "none",
                  paddingLeft: "16px",
                  paddingRight: "16px",
                  borderRadius: "9999px",
                  lineHeight: "20px",
                  fontSize: "15px",
                  fontWeight: "700",
                  padding: "5px",
                  backgroundColor: "#eff3f4",
                  color: "black",
                }}
                // onClick={handleShowSignUpModal}
              >
                Sign up
              </Button>
            </div>
          </Stack>
        </Footer>
      </Flex>
      {/* finish to check  */}
    </>
  );
}

export default DeactivatedPage;
