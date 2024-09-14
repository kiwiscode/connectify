import { useContext, useEffect, useState } from "react";
import { Button, Col, Modal } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../../../../context/UserContext";
import { ThemeContext } from "../../../../context/ThemeContext";
import SettingsNavigation from "../../../../components/SettingsNavigation/SettingsNavigation";
import ResponsiveNavigationBarBottom from "../../../../components/Navbar/ResponsiveNavigationBottom";
import { ModalVisibilityContext } from "../../../../context/ModalVisibilityContext";
import { useAntdMessageHandler } from "../../../../utils/useAntdMessageHandler";
import useWindowDimensions from "../../../../hooks/getWindowDimensions";
import { useFontSizeHandler } from "../../../../utils/useFontSizeHandler";
// when working on local version
const API_URL = "http://localhost:3000";

// when working on deployment version
// ?
function SuperFollowsApplicationEligibility() {
  const { getToken, userInfo } = useContext(UserContext);
  const [{ theme, themeName }] = useContext(ThemeContext);
  const { width } = useWindowDimensions();

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "June",
    "July",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];

  const getCreatedDate = (date) => {
    const createdAt = new Date(date);
    const getMonth = createdAt.getMonth();
    return `${months[getMonth]} ${createdAt.getDate()}`;
  };

  const extraDetailedDate = (dateStr) => {
    const date = new Date(dateStr);

    const optionsTime = {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };
    const optionsDate = {
      month: "short",
      day: "numeric",
      year: "numeric",
    };
    const formattedTime = new Intl.DateTimeFormat("en-US", optionsTime).format(
      date
    );
    const formattedDate = new Intl.DateTimeFormat("en-US", optionsDate).format(
      date
    );

    return `${formattedTime} \u00B7 ${formattedDate}`;
  };

  const {
    postSharedMessage,
    contextHolder,
    showCustomMessage,
    postDeletedMessage,
  } = useAntdMessageHandler();

  const [dataFromCommentModal, setDataFromCommentModal] = useState("");
  function handleDataFromCommentModal(data) {
    console.log("Data =>", data);
    setDataFromCommentModal(data);
  }

  const { isPostModalVisible } = useContext(ModalVisibilityContext);

  const [onFocus, setOnFocus] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const setSearchTermEmpty = () => {
    setSearchTerm("");
  };
  const [onFocusXBtn, setOnFocusXBtn] = useState(true);
  const onFocusInActiveForXBtn = () => {
    setOnFocusXBtn(false);
  };
  const handleSetSearchTerm = (e) => {
    setSearchTerm(e.target.value);
  };
  const onFocusActive = () => {
    setOnFocus(true);
  };

  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  const [showModal, setShowModal] = useState(true);
  useEffect(() => {
    if (path === "/i/verified-choose") {
      setShowModal(false);
    } else {
      setShowModal(true);
    }
  }, [path]);
  const [loading, setLoading] = useState(null);
  const {
    getFontSizeAndLineHeight31,

    getFontSizeAndLineHeight20,

    getFontSizeAndLineHeight17,
    getFontSizeAndLineHeight15,
    getFontSizeAndLineHeight13,
    getFontSizeAndLineHeight11,
  } = useFontSizeHandler();
  const font31 = getFontSizeAndLineHeight31();
  const font20 = getFontSizeAndLineHeight20();

  const font17 = getFontSizeAndLineHeight17();
  const font15 = getFontSizeAndLineHeight15();
  const font13 = getFontSizeAndLineHeight13();
  const font11 = getFontSizeAndLineHeight11();
  return (
    <>
      <>
        <Modal
          backdropClassName={
            themeName === "dark-theme" ? `back-drop-${themeName}` : ""
          }
          style={{
            height: "100%",
            overflowX: "hidden",
            overflowY: "hidden",
            margin: "0px",
            padding: "0px",
            backgroundColor:
              width < 700 && themeName === "dark-theme"
                ? "black"
                : width < 700 && themeName !== "dark-theme"
                ? "white"
                : "",
          }}
          show={showModal}
          centered={true}
          dialogClassName={
            width <= 700 ? "modal-fullscreen" : "modal_center_with_width"
          }
          contentClassName={
            width > 700 && themeName === "dark-theme"
              ? "dark-theme-sub-modal settings-modal-type"
              : width > 700 && themeName !== "dark-theme"
              ? "light-theme-sub-modal settings-modal-type"
              : width <= 700 && themeName === "dark-theme"
              ? "dark-theme-sub-modal "
              : null
          }
        >
          <Modal.Header
            className="signin-modal-header-child-non-reactivate"
            style={{
              border: "none",
              zIndex: 999,
              backgroundColor: themeName === "dark-theme" ? "black" : "white",
              outlineStyle: "none",
            }}
          >
            <div
              onClick={() => {
                navigate(-1);
              }}
              className={`arrow arrow-${themeName}`}
              style={{
                position: "relative",
                width: "36px",
                height: " 36px",
                borderRadius: "50%",
                cursor: "pointer",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 999,
                right: "8px",
                bottom: "10px",
              }}
            >
              {" "}
              <svg
                color={themeName === "dark-theme" ? "white" : ""}
                fill="currentColor"
                style={{
                  position: "absolute",
                  border: "none",
                }}
                width={20}
                height={20}
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-z80fyv r-19wmn03"
              >
                <g>
                  <path d="M7.414 13l5.043 5.04-1.414 1.42L3.586 12l7.457-7.46 1.414 1.42L7.414 11H21v2H7.414z"></path>
                </g>
              </svg>
            </div>
          </Modal.Header>

          <Modal.Body
            style={{
              padding: "0px",
              margin: "0px",
              maxHeight: "475px",
              overflowY: "auto",
            }}
          >
            {!loading ? (
              <>
                <>
                  <div
                    style={{
                      width: "100%",
                    }}
                  >
                    <div
                      style={{
                        paddingLeft: width <= 700 ? "32px" : "80px",
                        paddingRight: width <= 700 ? "32px" : "80px",
                      }}
                    >
                      <div
                        style={{
                          fontSize: font31.fontSize,
                          lineHeight: font31.lineHeight,
                        }}
                        className={
                          themeName === "dark-theme"
                            ? "soft-grey-dark-theme-text-variant-1 chirp-heavy-font"
                            : "very-dark-gray-light-theme-text-variant-1 chirp-heavy-font"
                        }
                      >
                        Check back later
                      </div>
                      <div
                        style={{
                          fontSize: font15.fontSize,
                          lineHeight: font15.lineHeight,
                        }}
                        className={
                          themeName === "dark-theme"
                            ? "soft-grey-dark-theme-text-variant-2 mt-1 chirp-regular-font"
                            : "very-dark-gray-light-theme-text-variant-2 mt-2 chirp-regular-font"
                        }
                      >
                        Unfortunately, you don’t meet our eligibility
                        requirements for Subscriptions at this time.
                      </div>
                    </div>
                  </div>
                  <div
                    className="mt-5"
                    style={{
                      width: "100%",
                    }}
                  >
                    <div
                      style={{
                        padding: width <= 700 ? "12px 32px" : "12px 80px",
                      }}
                    >
                      <div
                        style={{
                          backgroundColor:
                            themeName === "dark-theme" ? "#16181C" : "#F6F9F9",
                          borderRadius: "8px",
                          padding: "4px 8px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            padding: "12px 4px",
                          }}
                        >
                          <div
                            style={{
                              fontSize: font15.fontSize,
                              lineHeight: font15.lineHeight,
                            }}
                            className={
                              themeName === "dark-theme"
                                ? "soft-grey-dark-theme-text-variant-1 chirp-bold-font"
                                : "very-dark-gray-light-theme-text-variant-1 chirp-bold-font"
                            }
                          >
                            Get verified
                          </div>
                          <div
                            style={{
                              display: "flex",
                            }}
                          >
                            <svg
                              fill={
                                themeName === "dark-theme"
                                  ? "rgb(51, 54, 57)"
                                  : "rgb(207, 217, 222)"
                              }
                              width={`${1.25}em`}
                              height={`${1.25}em`}
                              viewBox="0 0 24 24"
                              aria-hidden="true"
                              className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-j0xqu1"
                            >
                              <g>
                                <path d="M12 3.75c-4.56 0-8.25 3.69-8.25 8.25s3.69 8.25 8.25 8.25 8.25-3.69 8.25-8.25S16.56 3.75 12 3.75zM1.75 12C1.75 6.34 6.34 1.75 12 1.75S22.25 6.34 22.25 12 17.66 22.25 12 22.25 1.75 17.66 1.75 12z"></path>
                              </g>
                            </svg>
                          </div>
                        </div>
                        <div
                          style={{
                            borderBottom:
                              themeName !== "dark-theme"
                                ? "1px solid rgb(239, 243, 244) "
                                : // : "0.1px solid rgb(70, 70, 70)",
                                  "1px solid rgb(47, 51, 54)",
                          }}
                        ></div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            padding: "12px 4px",
                          }}
                        >
                          <div
                            style={{
                              fontSize: font15.fontSize,
                              lineHeight: font15.lineHeight,
                            }}
                            className={
                              themeName === "dark-theme"
                                ? "soft-grey-dark-theme-text-variant-1 chirp-bold-font"
                                : "very-dark-gray-light-theme-text-variant-1 chirp-bold-font"
                            }
                          >
                            500 followers
                          </div>
                          <div
                            style={{
                              display: "flex",
                            }}
                          >
                            <svg
                              fill={
                                themeName === "dark-theme"
                                  ? "rgb(51, 54, 57)"
                                  : "rgb(207, 217, 222)"
                              }
                              width={`${1.25}em`}
                              height={`${1.25}em`}
                              viewBox="0 0 24 24"
                              aria-hidden="true"
                              className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-j0xqu1"
                            >
                              <g>
                                <path d="M12 3.75c-4.56 0-8.25 3.69-8.25 8.25s3.69 8.25 8.25 8.25 8.25-3.69 8.25-8.25S16.56 3.75 12 3.75zM1.75 12C1.75 6.34 6.34 1.75 12 1.75S22.25 6.34 22.25 12 17.66 22.25 12 22.25 1.75 17.66 1.75 12z"></path>
                              </g>
                            </svg>
                          </div>
                        </div>{" "}
                        <div
                          style={{
                            borderBottom:
                              themeName !== "dark-theme"
                                ? "1px solid rgb(239, 243, 244) "
                                : // : "0.1px solid rgb(70, 70, 70)",
                                  "1px solid rgb(47, 51, 54)",
                          }}
                        ></div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            padding: "12px 4px",
                          }}
                        >
                          <div
                            style={{
                              fontSize: font15.fontSize,
                              lineHeight: font15.lineHeight,
                            }}
                            className={
                              themeName === "dark-theme"
                                ? "soft-grey-dark-theme-text-variant-1 chirp-bold-font"
                                : "very-dark-gray-light-theme-text-variant-1 chirp-bold-font"
                            }
                          >
                            Active in the past 30 days
                          </div>
                          <div
                            style={{
                              display: "flex",
                            }}
                          >
                            <svg
                              fill={
                                themeName === "dark-theme"
                                  ? "rgb(0, 186, 124)"
                                  : "rgb(0, 186, 124)"
                              }
                              width={`${1.25}em`}
                              height={`${1.25}em`}
                              viewBox="0 0 24 24"
                              aria-hidden="true"
                              className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-o6sn0f"
                            >
                              <g>
                                <path d="M12 1.75C6.34 1.75 1.75 6.34 1.75 12S6.34 22.25 12 22.25 22.25 17.66 22.25 12 17.66 1.75 12 1.75zm-.81 14.68l-4.1-3.27 1.25-1.57 2.47 1.98 3.97-5.47 1.62 1.18-5.21 7.15z"></path>
                              </g>
                            </svg>
                          </div>
                        </div>{" "}
                        <div
                          style={{
                            borderBottom:
                              themeName !== "dark-theme"
                                ? "1px solid rgb(239, 243, 244) "
                                : // : "0.1px solid rgb(70, 70, 70)",
                                  "1px solid rgb(47, 51, 54)",
                          }}
                        ></div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            padding: "12px 4px",
                          }}
                        >
                          <div
                            style={{
                              fontSize: font15.fontSize,
                              lineHeight: font15.lineHeight,
                            }}
                            className={
                              themeName === "dark-theme"
                                ? "soft-grey-dark-theme-text-variant-1 chirp-bold-font"
                                : "very-dark-gray-light-theme-text-variant-1 chirp-bold-font"
                            }
                          >
                            Be at least 18 years old
                          </div>
                          <div
                            style={{
                              display: "flex",
                            }}
                          >
                            <svg
                              fill={
                                themeName === "dark-theme"
                                  ? "rgb(0, 186, 124)"
                                  : "rgb(0, 186, 124)"
                              }
                              width={`${1.25}em`}
                              height={`${1.25}em`}
                              viewBox="0 0 24 24"
                              aria-hidden="true"
                              className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-o6sn0f"
                            >
                              <g>
                                <path d="M12 1.75C6.34 1.75 1.75 6.34 1.75 12S6.34 22.25 12 22.25 22.25 17.66 22.25 12 17.66 1.75 12 1.75zm-.81 14.68l-4.1-3.27 1.25-1.57 2.47 1.98 3.97-5.47 1.62 1.18-5.21 7.15z"></path>
                              </g>
                            </svg>
                          </div>
                        </div>{" "}
                      </div>
                    </div>
                  </div>
                </>
              </>
            ) : (
              <>
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <LoadingSpinner
                    strokeColor={"rgb(29, 155, 240)"}
                    fontSize={true}
                  ></LoadingSpinner>
                </div>
              </>
            )}
          </Modal.Body>
          <div
            style={{
              height: "100px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              filter:
                themeName === "dark-theme"
                  ? "drop-shadow(rgb(51, 54, 57) 0px -1px 1px)"
                  : "",
              boxShadow:
                themeName === "dark-theme"
                  ? "inset 0px 4px 3px -2px rgba(47,51,54)"
                  : "inset 0px 4px 3px -1px rgba(239,243,244)",
              marginTop: width <= 700 ? "4.2rem" : null,
            }}
          >
            <div
              style={{
                maxWidth: "fit-content",
                maxWidth: "440px",
              }}
            >
              <Button
                onClick={() => navigate("/i/verified-choose")}
                className={
                  themeName === "dark-theme"
                    ? "background-hover-next-btn-dark-theme  chirp-bold-font"
                    : "background-hover-next-btn-light-theme  chirp-bold-font"
                }
                style={{
                  minHeight: "52px",
                  border: "none",
                  outlineStyle: "none",
                  width: "100%",
                  minWidth: "440px",
                  padding: "0px 80px",
                  color: themeName === "dark-theme" ? " #0f141a " : "#e6e9ea",
                }}
              >
                Get verified
              </Button>
            </div>
          </div>
        </Modal>
      </>

      {contextHolder}
      <SettingsNavigation />
      <Col
        xs={10}
        sm={10}
        md={11}
        lg={width <= 1201 && width >= 992 ? 7 : width > 1201 ? 4 : ""}
        xxl={width <= 1201 && width >= 992 ? 7 : width > 1201 ? 4 : ""}
        className={`right-side-column-settings-account-page`}
        style={{
          borderLeft:
            width < 1000
              ? themeName !== "dark-theme"
                ? "1px solid rgba(0, 0, 0, 0.1)"
                : // : "0.1px solid rgb(70, 70, 70)",
                  "1px solid rgb(70, 70, 70)"
              : null,
          borderRight:
            themeName !== "dark-theme"
              ? "1px solid rgba(0, 0, 0, 0.1)"
              : // : "0.1px solid rgb(70, 70, 70)",
                "1px solid rgb(70, 70, 70)",
          borderTop: "none ",
          borderBottom: "none",
          padding: "0px",
          width:
            width > 1400
              ? "580px"
              : width <= 1400 && width > 1355
              ? "650px"
              : width <= 1355 && width > 1288
              ? "600px"
              : width <= 1288 && width > 1221
              ? "500px"
              : width <= 1221 && width > 1000
              ? "500px"
              : width <= 500
              ? "100%"
              : null,
          position: "relative",
          right: "10px",
        }}
      >
        <div
          className="chirp-bold-font"
          style={{
            fontSize: font20.fontSize,
            lineHeight: font20.lineHeight,
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            paddingLeft: width <= 500 ? "32px" : "12px",
            paddingRight: width <= 500 ? "32px" : "12px",
          }}
        >
          {" "}
          {width <= 991 ? (
            <span
              onClick={() => {
                navigate("/settings");
              }}
              className={`arrow arrow-${themeName} mt-3`}
              style={{
                position: "relative",
                width: "30px",
                height: " 30px",
                borderRadius: "50%",
                cursor: "pointer",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginRight: "5px",
              }}
            >
              <svg
                color={themeName === "dark-theme" ? "white" : ""}
                fill="currentColor"
                style={{
                  position: "absolute",
                  border: "none",
                }}
                width={20}
                height={20}
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-z80fyv r-19wmn03"
              >
                <g>
                  <path d="M7.414 13l5.043 5.04-1.414 1.42L3.586 12l7.457-7.46 1.414 1.42L7.414 11H21v2H7.414z"></path>
                </g>
              </svg>
            </span>
          ) : null}
          <div className="mt-3">Monetizations</div>
        </div>

        <div className="mt-4" style={{}}>
          <span
            className="chirp-bold-font"
            style={{
              fontSize: font17.fontSize,
              lineHeight: font17.lineHeight,
              paddingLeft: width <= 500 ? "32px" : "12px",
              paddingRight: width <= 500 ? "32px" : "12px",
            }}
          >
            {" "}
            Available programs
          </span>
          <div
            style={{
              fontSize: font15.fontSize,
              lineHeight: font15.lineHeight,
              paddingLeft: width <= 500 ? "32px" : "12px",
              paddingRight: width <= 500 ? "32px" : "12px",
              color:
                themeName === "dark-theme" ? "#71767A" : "rgb(83, 100, 113)",
            }}
            className="mt-2 chirp-regular-font"
          >
            Eligible creators can sign up for monthly subscriptions and ads
            revenue sharing.
          </div>
        </div>
        <div
          style={{
            width: "100%",
            minWidth: "fit-content",
          }}
        >
          <div
            onClick={() =>
              navigate("/settings/superfollows/application/eligibility")
            }
            className={
              themeName === "dark-theme"
                ? "has-children-dark-theme"
                : "has-children-light-theme"
            }
          >
            <div
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
              }}
            >
              <div
                className={
                  themeName === "dark-theme"
                    ? "settings-icon-dark-theme"
                    : "settings-icon-light-theme"
                }
              >
                <div
                  style={{
                    backgroundColor:
                      themeName === "dark-theme"
                        ? "#378FC4"
                        : "rgba(0, 131, 235, 0.8)",
                    width: "48px",
                    height: "48px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: "8px",
                  }}
                >
                  <svg
                    style={{
                      fill: "#FFFFFF",
                      width: "24px",
                      height: " 24px",
                    }}
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    class="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-1472mwg r-lrsllp r-jwli3a"
                  >
                    <g>
                      <path d="M16 6c0 2.21-1.79 4-4 4S8 8.21 8 6s1.79-4 4-4 4 1.79 4 4zm-.76 8.57l-3.95.58 2.86 2.78-.68 3.92L17 20l3.53 1.85-.68-3.92 2.86-2.78-3.95-.58L17 11l-1.76 3.57zm-.45-3.09c-.89-.32-1.86-.48-2.89-.48-2.35 0-4.37.85-5.86 2.44-1.48 1.57-2.36 3.8-2.63 6.46l-.11 1.09h8.58l.52-2.49-4.05-4.3 5.59-.99.85-1.73z"></path>
                    </g>
                  </svg>
                </div>
              </div>
              <div
                style={{
                  width: "100%",
                }}
              >
                <div
                  style={{
                    backgroundColor: "rgb(249, 24, 128)",
                    height: "20px",
                    borderRadius: "4px",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                  }}
                >
                  <span
                    className="chirp-medium-font"
                    style={{
                      fontSize: font11.fontSize,
                      lineHeight: font11.lineHeight,
                      color: "white",
                      padding: "6px",
                    }}
                  >
                    Not yet eligible
                  </span>
                </div>
                <div
                  style={{
                    fontSize: font15.fontSize,
                    lineHeight: font15.lineHeight,
                  }}
                  className={
                    themeName === "dark-theme"
                      ? "settings-text-first-exp-dark-theme chirp-bold-font"
                      : "settings-text-first-exp-light-theme chirp-bold-font"
                  }
                >
                  Subscriptions
                </div>
                <div
                  className={
                    themeName === "dark-theme"
                      ? "settings-text-dark-theme chirp-regular-font"
                      : "settings-text-light-theme chirp-regular-font"
                  }
                  style={{
                    fontSize: font13.fontSize,
                    lineHeight: font13.lineHeight,
                  }}
                >
                  Earn a living on C by letting anyone subscribe to you for
                  monthly content.
                </div>
              </div>
              <div
                className={
                  themeName === "dark-theme"
                    ? "settings-icon-dark-theme"
                    : "settings-icon-light-theme"
                }
              >
                {" "}
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  class="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-14j79pv r-1q142lx r-2dysd3"
                >
                  <g>
                    <path d="M14.586 12L7.543 4.96l1.414-1.42L17.414 12l-8.457 8.46-1.414-1.42L14.586 12z"></path>
                  </g>
                </svg>
              </div>
            </div>
          </div>
          <div
            onClick={() => navigate("/settings/ad_rev_share_eligibility")}
            className={
              themeName === "dark-theme"
                ? "has-children-dark-theme"
                : "has-children-light-theme"
            }
          >
            <div
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
              }}
            >
              <div
                className={
                  themeName === "dark-theme"
                    ? "settings-icon-dark-theme"
                    : "settings-icon-light-theme"
                }
              >
                <div
                  style={{
                    backgroundColor:
                      themeName === "dark-theme"
                        ? "#CB7627"
                        : "rgba(216, 96, 0, 0.8)",
                    width: "48px",
                    height: "48px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: "8px",
                  }}
                >
                  <svg
                    style={{
                      fill: "#FFFFFF",
                      width: "24px",
                      height: " 24px",
                    }}
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    class="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-1472mwg r-lrsllp r-jwli3a"
                  >
                    <g>
                      <path d="M14.83 13.82c.14.28.33.67.52 1.12.468 1.013.736 2.106.79 3.22-.073 1.544-.865 2.965-2.14 3.84 3.767-.694 6.513-3.96 6.55-7.79 0-6-4.7-10.25-9.5-13v.09c.143 1.768-.142 3.545-.83 5.18-.473-.722-1.068-1.354-1.76-1.87l-.26-.24c-.541 1.036-1.146 2.038-1.81 3C5 9.5 3.5 11.7 3.5 14.25c-.083 2.252.831 4.426 2.5 5.94 1.038.895 2.282 1.517 3.62 1.81-.11-.097-.211-.204-.3-.32-.465-.645-.704-1.425-.68-2.22.062-1.326.724-2.552 1.8-3.33l.66-.56c.836-.649 1.585-1.402 2.23-2.24l.68-.92.58 1 .24.41z"></path>
                    </g>
                  </svg>
                </div>
              </div>
              <div
                style={{
                  width: "100%",
                }}
              >
                <div
                  style={{
                    backgroundColor: "rgb(249, 24, 128)",
                    height: "20px",
                    borderRadius: "4px",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                  }}
                >
                  <span
                    className="chirp-medium-font"
                    style={{
                      fontSize: font11.fontSize,
                      lineHeight: font11.lineHeight,
                      color: "white",
                      padding: "6px",
                    }}
                  >
                    Not yet eligible
                  </span>
                </div>
                <div
                  style={{
                    fontSize: font15.fontSize,
                    lineHeight: font15.lineHeight,
                  }}
                  className={
                    themeName === "dark-theme"
                      ? "settings-text-first-exp-dark-theme chirp-bold-font"
                      : "settings-text-first-exp-light-theme chirp-bold-font"
                  }
                >
                  Ads revenue sharing
                </div>
                <div
                  className={
                    themeName === "dark-theme"
                      ? "settings-text-dark-theme chirp-regular-font"
                      : "settings-text-light-theme chirp-regular-font"
                  }
                  style={{
                    fontSize: font13.fontSize,
                    lineHeight: font13.lineHeight,
                  }}
                >
                  Earn income from the ads served in the replies to your posts.
                </div>
              </div>
              <div
                className={
                  themeName === "dark-theme"
                    ? "settings-icon-dark-theme"
                    : "settings-icon-light-theme"
                }
              >
                {" "}
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  class="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-14j79pv r-1q142lx r-2dysd3"
                >
                  <g>
                    <path d="M14.586 12L7.543 4.96l1.414-1.42L17.414 12l-8.457 8.46-1.414-1.42L14.586 12z"></path>
                  </g>
                </svg>
              </div>
            </div>
          </div>
          <div
            className={
              themeName === "dark-theme"
                ? "has-children-dark-theme"
                : "has-children-light-theme"
            }
          >
            <div
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
              }}
            >
              <div
                className={
                  themeName === "dark-theme"
                    ? "settings-icon-dark-theme"
                    : "settings-icon-light-theme"
                }
              >
                <div
                  style={{
                    backgroundColor:
                      themeName === "dark-theme"
                        ? "#745ECB"
                        : "rgba(101, 69, 219, 0.8)",
                    width: "48px",
                    height: "48px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: "8px",
                  }}
                >
                  <svg
                    style={{
                      fill: "#FFFFFF",
                      width: "24px",
                      height: " 24px",
                    }}
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    class="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-1472mwg r-lrsllp r-jwli3a"
                  >
                    <g>
                      <path d="M13.5 8.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5S11.17 7 12 7s1.5.67 1.5 1.5zM13 17v-5h-2v5h2zm-1 5.25c5.66 0 10.25-4.59 10.25-10.25S17.66 1.75 12 1.75 1.75 6.34 1.75 12 6.34 22.25 12 22.25zM20.25 12c0 4.56-3.69 8.25-8.25 8.25S3.75 16.56 3.75 12 7.44 3.75 12 3.75s8.25 3.69 8.25 8.25z"></path>
                    </g>
                  </svg>
                </div>
              </div>
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
                  className={
                    themeName === "dark-theme"
                      ? "settings-text-first-exp-dark-theme chirp-bold-font"
                      : "settings-text-first-exp-light-theme chirp-bold-font"
                  }
                >
                  Learn more
                </div>
                <div
                  className={
                    themeName === "dark-theme"
                      ? "settings-text-dark-theme chirp-regular-font"
                      : "settings-text-light-theme chirp-regular-font"
                  }
                  style={{
                    fontSize: font13.fontSize,
                    lineHeight: font13.lineHeight,
                  }}
                >
                  Learn more about our Monetization programs and policies here.
                </div>
              </div>
              <div
                className={
                  themeName === "dark-theme"
                    ? "settings-icon-dark-theme"
                    : "settings-icon-light-theme"
                }
              >
                {" "}
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  class="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-14j79pv r-1q142lx r-2dysd3"
                >
                  <g>
                    <path d="M14.586 12L7.543 4.96l1.414-1.42L17.414 12l-8.457 8.46-1.414-1.42L14.586 12z"></path>
                  </g>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </Col>
    </>
  );
}
export default SuperFollowsApplicationEligibility;
