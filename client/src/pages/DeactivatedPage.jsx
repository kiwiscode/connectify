import { Container, Row, Col, Button, Stack } from "react-bootstrap";

import { useNavigate } from "react-router-dom";
import { SigninModal } from "../components/ui/Modal";
import { useContext } from "react";
import { Layout, Flex } from "antd";
import { ThemeContext } from "../context/ThemeContext";
import useWindowDimensions from "../hooks/getWindowDimensions";
import { useFontSizeHandler } from "../utils/useFontSizeHandler";
const { Footer } = Layout;

function DeactivatedPage() {
  const [{ themeName }] = useContext(ThemeContext);

  const navigate = useNavigate();

  const redirectHomePageToSignUp = () => {
    navigate("/");
  };

  const { width } = useWindowDimensions();
  const {
    getFontSizeAndLineHeight23,
    getFontSizeAndLineHeight20,
    getFontSizeAndLineHeight15,
    getFontSizeAndLineHeight13,
  } = useFontSizeHandler();
  const font23 = getFontSizeAndLineHeight23();
  const font20 = getFontSizeAndLineHeight20();
  const font15 = getFontSizeAndLineHeight15();
  const font13 = getFontSizeAndLineHeight13();
  return (
    <>
      <Container fluid>
        <Row
          style={{
            height: "100dvh",
            borderTop: "none",
            borderBottom: "none",
          }}
        >
          <Col
            style={{
              borderRight:
                themeName !== "dark-theme"
                  ? "1px solid rgba(0, 0, 0, 0.1)"
                  : // : "0.1px solid rgb(70, 70, 70)",
                    "1px solid rgb(70, 70, 70)",
            }}
            className="left-column-settings-deactivated d-none d-xs-none sm-none d-md-block d-lg-block d-xxl-block"
            xs={2} // 0px - 576px aralığı
            sm={2} // 576px - 768px aralığı
            md={1} // 768px - 992px aralığı
            lg={3} // 1200px - 1400px aralığı
            xxl={3} // 1400px ve sonrası aralığı
          >
            <div
              style={{
                width: "100%",
                textAlign: "center",
                position: "relative",
                top: "10%",
              }}
            >
              <div
                className={`deactivation-page-settings deactivation-page-settings-${themeName}`}
                style={{
                  cursor: "pointer",
                  borderRadius: "9999px",
                  padding: "12px",
                  display: "inline-flex",
                }}
              >
                <div
                  style={{
                    width: "166px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "7.5%",
                  }}
                >
                  <svg
                    color={themeName === "dark-theme" ? "white" : "black"}
                    fill="currentColor"
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
                    className="chirp-bold-font"
                    style={{
                      color: themeName === "dark-theme" ? "white" : "black",
                      fontSize: font20.fontSize,
                      lineHeight: font20.lineHeight,
                    }}
                  >
                    Settings
                  </span>
                </div>
              </div>
            </div>
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
              padding: "0px",
              borderRight:
                themeName !== "dark-theme"
                  ? "1px solid rgba(0, 0, 0, 0.1)"
                  : // : "0.1px solid rgb(70, 70, 70)",
                    "1px solid rgb(70, 70, 70)",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                padding: "16px",
              }}
            >
              <div
                className="chirp-bold-font"
                style={{
                  marginBottom: "15px",
                  fontSize: font20.fontSize,
                  lineHeight: font20.lineHeight,
                }}
              >
                Settings
              </div>
              <div
                className="chirp-bold-font"
                style={{
                  marginBottom: "15px",
                  fontSize: font20.fontSize,
                  lineHeight: font20.lineHeight,
                }}
              >
                Privacy
              </div>
              <div
                className={`deactivated-info-left-side deactivated-info-left-side-${themeName} chirp-regular-font`}
              >
                <div
                  style={{
                    display: "flex",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                    }}
                  >
                    <div
                      style={{
                        fontSize: font15.fontSize,
                        lineHeight: font15.lineHeight,
                      }}
                    >
                      Personalization and data
                    </div>
                    <span
                      className="chirp-regular-font"
                      style={{
                        color:
                          themeName === "dark-theme"
                            ? "#71767A"
                            : "rgb(83, 100, 113)",
                        fontSize: font13.fontSize,
                        lineHeight: font13.lineHeight,
                      }}
                    >
                      Allow some
                    </span>
                  </div>
                  <div
                    className="ms-auto"
                    style={{
                      height: "auto",
                      margin: "auto 0",
                    }}
                  >
                    <svg
                      style={{}}
                      color="rgb(113, 118, 123)"
                      fill="currentColor"
                      width={`${1.25}em`}
                      height={`${1.25}em`}
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      className="ms-auto r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-1bwzh9t r-1q142lx r-f727ji"
                    >
                      <g>
                        <path d="M14.586 12L7.543 4.96l1.414-1.42L17.414 12l-8.457 8.46-1.414-1.42L14.586 12z"></path>
                      </g>
                    </svg>
                  </div>
                </div>

                <div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>Your C data</div>
                    <svg
                      color="rgb(113, 118, 123)"
                      fill="currentColor"
                      width={`${1.25}em`}
                      height={`${1.25}em`}
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-1bwzh9t r-1q142lx r-f727ji"
                    >
                      <g>
                        <path d="M14.586 12L7.543 4.96l1.414-1.42L17.414 12l-8.457 8.46-1.414-1.42L14.586 12z"></path>
                      </g>
                    </svg>
                  </div>
                </div>
                <div
                  style={{
                    // width: "90%",

                    display: "flex",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                    }}
                  >
                    <div>Cookie preferences</div>
                    <span
                      className="chirp-regular-font"
                      style={{
                        color:
                          themeName === "dark-theme"
                            ? "#71767A"
                            : "rgb(83, 100, 113)",
                        fontSize: font13.fontSize,
                        lineHeight: font13.lineHeight,
                      }}
                    >
                      Manage your cookie experience on C.
                    </span>
                  </div>
                  <div
                    className="ms-auto"
                    style={{
                      height: "auto",
                      margin: "auto 0",
                    }}
                  >
                    <svg
                      style={{}}
                      color="rgb(113, 118, 123)"
                      fill="currentColor"
                      width={`${1.25}em`}
                      height={`${1.25}em`}
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      className="ms-auto r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-1bwzh9t r-1q142lx r-f727ji"
                    >
                      <g>
                        <path d="M14.586 12L7.543 4.96l1.414-1.42L17.414 12l-8.457 8.46-1.414-1.42L14.586 12z"></path>
                      </g>
                    </svg>
                  </div>
                </div>
              </div>

              <div
                style={{
                  fontSize: font15.fontSize,
                  lineHeight: font15.lineHeight,
                }}
                className="mt-5 chirp-regular-font"
              >
                These settings apply to this browser or device while you’re
                logged out. They don’t have any effect when you’re logged in.
              </div>
            </div>
            <div
              style={{
                borderBottom:
                  themeName !== "dark-theme"
                    ? "1px solid rgba(0, 0, 0, 0.1)"
                    : // : "0.1px solid rgb(70, 70, 70)",
                      "1px solid rgb(70, 70, 70)",
              }}
            ></div>

            <div
              className="chirp-heavy-font"
              style={{
                padding: "16px",
                fontSize: font20.fontSize,
                lineHeight: font20.lineHeight,
                color: themeName === "dark-theme" ? "white" : "black",
              }}
            >
              General
            </div>
            <div>
              <div
                style={{
                  padding: "16px",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <div
                  className="chirp-regular-font"
                  style={{
                    fontSize: font15.fontSize,
                    lineHeight: font15.lineHeight,
                    color: themeName === "dark-theme" ? "white" : "black",
                  }}
                >
                  Additional resources
                </div>
                <svg
                  color="rgb(113, 118, 123)"
                  fill="currentColor"
                  width={`${1.25}em`}
                  height={`${1.25}em`}
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-1bwzh9t r-1q142lx r-f727ji"
                >
                  <g>
                    <path d="M14.586 12L7.543 4.96l1.414-1.42L17.414 12l-8.457 8.46-1.414-1.42L14.586 12z"></path>
                  </g>
                </svg>
              </div>
            </div>
          </Col>
          {/* finish to check  main column */}

          {/* 3.column burası olucak */}
          <Col
            xs={12} // 0px - 576px aralığı
            sm={12} // 576px - 768px aralığı
            md={11} // 768px - 992px aralığı
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
                className="chirp-bold-font"
                style={{
                  marginBottom: "15px",
                  fontSize: font20.fontSize,
                  lineHeight: font20.lineHeight,
                }}
              >
                Deactivated
              </div>
              <div
                className="chirp-heavy-font"
                style={{
                  marginBottom: "15px",
                  fontSize: font20.fontSize,
                  lineHeight: font20.lineHeight,
                }}
              >
                Your account is deactivated
              </div>
              <div
                className="chirp-regular-font"
                style={{
                  color:
                    themeName === "dark-theme"
                      ? "#71767A"
                      : "rgb(83, 100, 113)",
                  fontSize: font13.fontSize,
                  lineHeight: font13.lineHeight,
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
          position: "fixed",
          bottom: "0",
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
            flexDirection: width <= 700 ? "row" : "column",
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
            gap={1}
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
                className="chirp-bold-font"
                style={{
                  fontSize: font23.fontSize,
                  lineHeight: font23.lineHeight,
                }}
              >
                Don’t miss what’s happening
              </div>
              <div
                className="chirp-regular-font"
                style={{
                  fontSize: font15.fontSize,
                  lineHeight: font15.lineHeight,
                }}
              >
                People on Connectify are the first to know.
              </div>
            </div>
            <div className="p-2 ms-auto">
              <SigninModal
                widthSmaller700={width <= 700 ? true : false}
                deactivatedScreen={true}
              />
            </div>
            <div style={{}} onClick={redirectHomePageToSignUp} className="p-0">
              <Button
                className="deactivated-footer-signup chirp-bold-font"
                style={{
                  cursor: "pointer",
                  maxWidth: width <= 700 ? "200px" : "87px",
                  maxHeight: "36px",
                  textAlign: "center",
                  border: "none",
                  paddingLeft: "16px",
                  paddingRight: "16px",
                  borderRadius: "9999px",
                  fontSize: font15.fontSize,
                  lineHeight: font15.lineHeight,
                  padding: "5px",
                  backgroundColor: "#eff3f4",
                  color: "black",
                }}
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
