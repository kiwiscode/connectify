import { useContext, useEffect, useState } from "react";
import { Button, Col, Modal } from "react-bootstrap";
import { useAntdMessageHandler } from "../../../../../utils/useAntdMessageHandler";
import useWindowDimensions from "../../../../../hooks/getWindowDimensions";
import SettingsNavigation from "../../../../../components/SettingsNavigation/SettingsNavigation";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FormControl, InputLabel, OutlinedInput } from "@mui/material";
import { UserContext } from "../../../../../context/UserContext";
import LoadingSpinner from "../../../../../components/ui/LoadingSpinner";
import { ThemeContext } from "../../../../../context/ThemeContext";
import { useFontSizeHandler } from "../../../../../utils/useFontSizeHandler";

const API_URL = import.meta.env.VITE_APP_API_URL;

function AccountInformationMain() {
  const { width } = useWindowDimensions();
  const [{ themeName }] = useContext(ThemeContext);
  const { userInfo, getToken } = useContext(UserContext);

  const { contextHolder } = useAntdMessageHandler();
  const navigate = useNavigate();
  const [verifyPasswordInput, setverifyPasswordInput] = useState(null);
  const [verifyPasswordErrorMessage, setverifyPasswordErrorMessage] =
    useState(null);

  const [loading, setLoading] = useState(true);
  // confirm your password

  const [showAccountInformation, setShowAccountInformation] = useState(null);
  const [user, setUser] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 400);

    return () => clearTimeout(timer);
  }, []);

  const handlePasswordConfirmation = () => {
    axios
      .post(`${API_URL}/auth/password-check`, {
        verifyPasswordInput,
        forAccountInfoDetail: true,
        userId: userInfo._id,
      })
      .then(() => {
        setLoading(true);
        setTimeout(() => {
          setLoading(false);
          setShowAccountInformation(true);
        }, 300);
      })
      .catch(() => {
        setverifyPasswordErrorMessage(
          "The password you entered was incorrect."
        );
      });
  };

  useEffect(() => {
    if (verifyPasswordInput?.length < 1) {
      setverifyPasswordErrorMessage(null);
    }
  }, [verifyPasswordInput]);

  useEffect(() => {
    setTimeout(() => {
      axios
        .get(`${API_URL}/profile`, {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        })
        .then((response) => {
          setUser(response.data.user);
          if (response.data.user.hasPhoneVerifiedForAccountInformationDetail) {
            setShowAccountInformation(true);
          }
        })
        .catch((error) => {
          console.error("Error =>", error);
        });
    }, 300);
  }, []);

  function formatDateTime(inputDate) {
    const dateObj = new Date(inputDate);

    const formattedDate = dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
    const formattedTime = dateObj.toLocaleTimeString("en-US", {
      hour12: true,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    const output = `${formattedDate}, ${formattedTime}`;

    return output;
  }

  const [openAutomationInformationModal, setOpenAutomationInformationModal] =
    useState(null);
  const {
    getFontSizeAndLineHeight31,
    getFontSizeAndLineHeight23,
    getFontSizeAndLineHeight20,
    getFontSizeAndLineHeight17,
    getFontSizeAndLineHeight15,
    getFontSizeAndLineHeight13,
  } = useFontSizeHandler();
  const font31 = getFontSizeAndLineHeight31();
  const font23 = getFontSizeAndLineHeight23();
  const font20 = getFontSizeAndLineHeight20();
  const font17 = getFontSizeAndLineHeight17();
  const font15 = getFontSizeAndLineHeight15();
  const font13 = getFontSizeAndLineHeight13();
  return (
    <>
      {contextHolder}
      <SettingsNavigation />
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
          show={openAutomationInformationModal}
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
            onClick={() => navigate("/settings/account")}
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
              className={`arrow arrow-${themeName} mt-2`}
              style={{
                position: "relative",
                width: "36px",
                height: " 36px",
                borderRadius: "50%",
                cursor: "pointer",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginRight: "5px",
                zIndex: 999,
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
            <div
              style={{
                width: "100%",
                textAlign: "center",
                display: "flex",
                justifyContent: "center",
                position: "absolute",
                left: "0px",
              }}
            >
              <div
                style={{
                  borderRadius: "50%",
                  width: "50px",
                  height: "50px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={50}
                  height={30}
                  viewBox="0 0 100 100"
                >
                  {/* İçi dolu bir kare */}
                  <rect
                    x="5"
                    y="5"
                    width="90"
                    height="90"
                    fill="#1C9BEF"
                    rx="5"
                    ry="5"
                    style={{
                      filter: "drop-shadow(0 0 10px rgba(0, 0, 0, 0.5))",
                    }}
                  />

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
              </div>
            </div>
          </Modal.Header>

          <Modal.Body
            className={`scrollbar-add scrollbar-add-${themeName}`}
            style={{
              padding: "0px",
              margin: "0px",
            }}
          >
            {!loading ? (
              <div
                className={`scrollbar-add scrollbar-add-${themeName}`}
                style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  overflowY: "auto",
                  height: "500px",
                }}
              >
                <div
                  style={{
                    backgroundColor:
                      themeName === "dark-theme"
                        ? "rgb(2,201,209)"
                        : "rgb(0,147,152)",
                    width: "100%",
                    minHeight: "86px",
                    display: "flex",
                    alignItems: "flex-end",
                  }}
                >
                  <div
                    className={
                      themeName === "dark-theme"
                        ? "soft-grey-dark-theme-text-variant-1 chirp-bold-font"
                        : "soft-grey-dark-theme-text-variant-1 chirp-bold-font"
                    }
                    style={{
                      fontSize: font31.fontSize,
                      lineHeight: font31.lineHeight,
                      width: "100%",
                      paddingLeft: "32px",
                      paddingRight: "32px",
                    }}
                  >
                    Automated Account Labels
                  </div>
                </div>
                <div
                  style={{
                    backgroundColor:
                      themeName === "dark-theme"
                        ? "rgb(2,201,209)"
                        : "rgb(0,147,152)",
                    width: "100%",
                    minHeight: "86px",
                    clipPath: "ellipse(70% 100% at 38% 0%)",
                  }}
                ></div>
                <div
                  className="mt-5"
                  style={{
                    padding: "0px 32px",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div
                    className={
                      themeName === "dark-theme"
                        ? "chirp-bold-font soft-grey-dark-theme-text-variant-1"
                        : "chirp-bold-font very-dark-gray-light-theme-text-variant-1"
                    }
                    style={{
                      fontSize: font23.fontSize,
                      lineHeight: font23.lineHeight,
                    }}
                  >
                    What’s an automated account?
                  </div>
                  <div
                    className={
                      themeName === "dark-theme"
                        ? "mt-2 chirp-regular-font soft-grey-dark-theme-text-variant-2"
                        : "mt-2 chirp-regular-font very-dark-gray-light-theme-text-variant-2"
                    }
                    style={{
                      fontSize: font15.fontSize,
                      lineHeight: font15.lineHeight,
                    }}
                  >
                    Automated accounts are programmed to perform certain actions
                    automatically through the C API. Like posting a region’s
                    weather conditions, for example. They’re created and managed
                    by other people on C.
                  </div>
                </div>
                <div
                  className="mt-4"
                  style={{
                    width: "100%",
                    textAlign: "center",
                    backgroundColor:
                      themeName === "dark-theme" ? "#022022" : "#E9FDFF",
                  }}
                >
                  <img
                    style={{
                      maxWidth: "327px",
                      maxHeight: "249px",
                    }}
                    src="https://abs.twimg.com/images/automation-onboard-1_m.png"
                    alt=""
                  />
                </div>
                <div
                  className={
                    themeName === "dark-theme"
                      ? "mt-5 chirp-regular-font soft-grey-dark-theme-text-variant-2"
                      : "mt-5 chirp-regular-font very-dark-gray-light-theme-text-variant-2"
                  }
                  style={{
                    fontSize: font15.fontSize,
                    lineHeight: font15.lineHeight,
                    padding: "0px 32px",
                  }}
                >
                  Labels let the world know who’s managing the automated
                  account. Once an automated account owner has connected their
                  managing account, a label will appear on the automated account
                  profile and posts.
                </div>
                <div
                  className="mt-4"
                  style={{
                    width: "100%",
                    textAlign: "center",
                    backgroundColor:
                      themeName === "dark-theme" ? "#022022" : "#E9FDFF",
                  }}
                >
                  <img
                    style={{
                      maxWidth: "329px",
                      maxHeight: "175px",
                    }}
                    src="https://abs.twimg.com/images/automation-onboard-2_m.png"
                    alt=""
                  />
                </div>
                <div
                  className="mt-5"
                  style={{
                    padding: "0px 32px",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div
                    className={
                      themeName === "dark-theme"
                        ? "chirp-bold-font soft-grey-dark-theme-text-variant-1"
                        : "chirp-bold-font very-dark-gray-light-theme-text-variant-1"
                    }
                    style={{
                      fontSize: font23.fontSize,
                      lineHeight: font23.lineHeight,
                    }}
                  >
                    Do I need to label my automated accounts?
                  </div>
                  <div
                    className={
                      themeName === "dark-theme"
                        ? "mt-2 chirp-regular-font soft-grey-dark-theme-text-variant-2"
                        : "mt-2 chirp-regular-font very-dark-gray-light-theme-text-variant-2"
                    }
                    style={{
                      fontSize: font15.fontSize,
                      lineHeight: font15.lineHeight,
                    }}
                  >
                    Yes, all automated accounts need to be labeled. This is
                    required under our{" "}
                    <span
                      className={
                        themeName === "dark-theme"
                          ? "chirp-bold-font soft-grey-dark-theme-text-variant-1 hover-fullname"
                          : "chirp-bold-font very-dark-gray-light-theme-text-variant-1 hover-fullname"
                      }
                      style={{
                        fontSize: font15.fontSize,
                        lineHeight: font15.lineHeight,
                        textOverflow: "unset",
                        borderBottom:
                          themeName !== "dark-theme"
                            ? "2px solid #0F141A"
                            : "2px solid #EFF3F4",
                        cursor: "pointer",
                      }}
                    >
                      new rules
                    </span>
                    .
                  </div>
                </div>
                <div
                  className="mt-5"
                  style={{
                    padding: "0px 32px",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div
                    className={
                      themeName === "dark-theme"
                        ? "chirp-bold-font soft-grey-dark-theme-text-variant-1"
                        : "chirp-bold-font very-dark-gray-light-theme-text-variant-1"
                    }
                    style={{
                      fontSize: font23.fontSize,
                      lineHeight: font23.lineHeight,
                    }}
                  >
                    How do I label my automated account?
                  </div>
                  <div
                    className="mt-4"
                    style={{
                      display: "flex",
                    }}
                  >
                    <div style={{}}>
                      <div
                        style={{
                          backgroundColor:
                            themeName === "dark-theme" ? "#EFF3F4" : "#0F141A",
                          width: "48px",
                          height: "48px",
                          borderRadius: "50%",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <div
                          className={
                            themeName === "dark-theme"
                              ? "chirp-bold-font very-dark-gray-light-theme-text-variant-1 "
                              : "chirp-bold-font soft-grey-dark-theme-text-variant-1"
                          }
                          style={{
                            fontSize: font20.fontSize,
                            lineHeight: font20.lineHeight,
                          }}
                        >
                          1
                        </div>
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        marginLeft: "15px",
                      }}
                    >
                      <div
                        style={{
                          fontSize: font17.fontSize,
                          lineHeight: font17.lineHeight,
                        }}
                        className={
                          themeName === "dark-theme"
                            ? "chirp-bold-font soft-grey-dark-theme-text-variant-1"
                            : "chirp-bold-font very-dark-gray-light-theme-text-variant-1"
                        }
                      >
                        Create a managing account
                      </div>
                      <div
                        className={
                          themeName === "dark-theme"
                            ? "mt-2 chirp-regular-font soft-grey-dark-theme-text-variant-2"
                            : "mt-2 chirp-regular-font very-dark-gray-light-theme-text-variant-2"
                        }
                        style={{
                          fontSize: font15.fontSize,
                          lineHeight: font15.lineHeight,
                        }}
                      >
                        Create a managing account A managing account is the
                        human-run account responsible for the automated account.
                      </div>
                    </div>
                  </div>
                  <div
                    className="mt-4"
                    style={{
                      display: "flex",
                    }}
                  >
                    <div style={{}}>
                      <div
                        style={{
                          backgroundColor:
                            themeName === "dark-theme" ? "#EFF3F4" : "#0F141A",
                          width: "48px",
                          height: "48px",
                          borderRadius: "50%",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <div
                          className={
                            themeName === "dark-theme"
                              ? "chirp-bold-font very-dark-gray-light-theme-text-variant-1 "
                              : "chirp-bold-font soft-grey-dark-theme-text-variant-1"
                          }
                          style={{
                            fontSize: font20.fontSize,
                            lineHeight: font20.lineHeight,
                          }}
                        >
                          2
                        </div>
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        marginLeft: "15px",
                      }}
                    >
                      <div
                        style={{
                          fontSize: font17.fontSize,
                          lineHeight: font17.lineHeight,
                        }}
                        className={
                          themeName === "dark-theme"
                            ? "chirp-bold-font soft-grey-dark-theme-text-variant-1"
                            : "chirp-bold-font very-dark-gray-light-theme-text-variant-1"
                        }
                      >
                        Connect your managing and automated account
                      </div>
                      <div
                        className={
                          themeName === "dark-theme"
                            ? "mt-2 chirp-regular-font soft-grey-dark-theme-text-variant-2"
                            : "mt-2 chirp-regular-font very-dark-gray-light-theme-text-variant-2"
                        }
                        style={{
                          fontSize: font15.fontSize,
                          lineHeight: font15.lineHeight,
                        }}
                      >
                        Connect your accounts from the Automation page in your
                        settings.
                      </div>
                    </div>
                  </div>
                  <div
                    className="mt-4"
                    style={{
                      display: "flex",
                    }}
                  >
                    <div style={{}}>
                      <div
                        style={{
                          backgroundColor:
                            themeName === "dark-theme" ? "#EFF3F4" : "#0F141A",
                          width: "48px",
                          height: "48px",
                          borderRadius: "50%",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <div
                          className={
                            themeName === "dark-theme"
                              ? "chirp-bold-font very-dark-gray-light-theme-text-variant-1 "
                              : "chirp-bold-font soft-grey-dark-theme-text-variant-1"
                          }
                          style={{
                            fontSize: font20.fontSize,
                            lineHeight: font20.lineHeight,
                          }}
                        >
                          3
                        </div>
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        marginLeft: "15px",
                      }}
                    >
                      <div
                        style={{
                          fontSize: font17.fontSize,
                          lineHeight: font17.lineHeight,
                        }}
                        className={
                          themeName === "dark-theme"
                            ? "chirp-bold-font soft-grey-dark-theme-text-variant-1"
                            : "chirp-bold-font very-dark-gray-light-theme-text-variant-1"
                        }
                      >
                        Your account is labeled!
                      </div>
                      <div
                        className={
                          themeName === "dark-theme"
                            ? "mt-2 chirp-regular-font soft-grey-dark-theme-text-variant-2"
                            : "mt-2 chirp-regular-font very-dark-gray-light-theme-text-variant-2"
                        }
                        style={{
                          fontSize: font15.fontSize,
                          lineHeight: font15.lineHeight,
                        }}
                      >
                        Once the accounts are connected, the automated account
                        will have a label.
                      </div>
                    </div>
                  </div>
                </div>{" "}
                <div
                  className="mt-3"
                  style={{
                    padding: "0px 32px",
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                  }}
                >
                  <div
                    className={
                      themeName === "dark-theme"
                        ? "mt-2 chirp-regular-font soft-grey-dark-theme-text-variant-2"
                        : "mt-2 chirp-regular-font very-dark-gray-light-theme-text-variant-2"
                    }
                    style={{
                      fontSize: font15.fontSize,
                      lineHeight: font15.lineHeight,
                    }}
                  >
                    Learn more on the{" "}
                    <span
                      className={
                        themeName === "dark-theme"
                          ? "chirp-bold-font soft-grey-dark-theme-text-variant-1 hover-fullname"
                          : "chirp-bold-font very-dark-gray-light-theme-text-variant-1 hover-fullname"
                      }
                      style={{
                        fontSize: font15.fontSize,
                        lineHeight: font15.lineHeight,
                        textOverflow: "unset",
                        borderBottom:
                          themeName !== "dark-theme"
                            ? "2px solid #0F141A"
                            : "2px solid #EFF3F4",
                        cursor: "pointer",
                      }}
                    >
                      automated account label FAQ{" "}
                    </span>
                    page.
                  </div>
                </div>
                <div
                  style={{
                    width: "100%",
                    padding: "0px 32px",
                  }}
                >
                  <Button
                    onClick={() => navigate("/settings/account/automation")}
                    className={
                      themeName === "dark-theme"
                        ? "mt-5 mb-3 chirp-bold-font soft-grey-dark-theme-text-variant-1 color-variant-greenish-hover-dark-theme"
                        : "mt-5 mb-3 chirp-bold-font soft-grey-dark-theme-text-variant-1 color-variant-greenish-hover-light-theme"
                    }
                    style={{
                      width: "100%",
                      border: "none",
                      minHeight: "52px",
                      backgroundColor:
                        themeName === "dark-theme" ? "#02C9D1" : "#009398",
                    }}
                  >
                    Got it
                  </Button>
                </div>
              </div>
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
        </Modal>
      </>
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
                : "1px solid rgb(70, 70, 70)"
              : null,
          borderRight:
            themeName !== "dark-theme"
              ? "1px solid rgba(0, 0, 0, 0.1)"
              : "1px solid rgb(70, 70, 70)",
          borderTop: "none ",
          borderBottom: "none",
          padding: "0px",
          margin: "0px",
          width: width > 1400 ? "600px" : width <= 500 ? "100%" : null,
          position: "relative",
          right: "10px",
        }}
      >
        <>
          <div className="settings-header-with-arrow ">
            <div
              onClick={() => {
                navigate(-1);
              }}
              className={`arrow arrow-${themeName} mt-2`}
              style={{
                position: "relative",
                width: "36px",
                height: " 36px",
                borderRadius: "50%",
                cursor: "pointer",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginRight: "5px",
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
            <div
              style={{
                fontSize: font20.fontSize,
                lineHeight: font20.lineHeight,
              }}
              className={
                themeName === "dark-theme"
                  ? "mt-2 first-head chirp-bold-font soft-grey-dark-theme-text-variant-1"
                  : "mt-2 first-head chirp-bold-font very-dark-gray-light-theme-text-variant-1"
              }
            >
              Account information
            </div>
          </div>
          {loading && !showAccountInformation ? (
            <div>
              <LoadingSpinner
                strokeColor={"rgb(29, 155, 240)"}
              ></LoadingSpinner>
            </div>
          ) : !loading && !showAccountInformation ? (
            <>
              <div
                style={{
                  width: "100%",
                  paddingLeft: "16px",
                }}
                className="mt-4"
              >
                <div
                  className={
                    themeName === "dark-theme"
                      ? "soft-grey-dark-theme-text-variant-1 mt-4 chirp-bold-font"
                      : "very-dark-gray-light-theme-text-variant-1 mt-4 chirp-bold-font"
                  }
                  style={{
                    fontSize: font20.fontSize,
                    lineHeight: font20.lineHeight,
                  }}
                >
                  Confirm your password
                </div>
                <div
                  className={
                    themeName === "dark-theme"
                      ? "soft-grey-dark-theme-text-variant-2 mt-4 chirp-regular-font"
                      : "very-dark-gray-light-theme-text-variant-2 mt-4 chirp-regular-font"
                  }
                  style={{
                    fontSize: font13.fontSize,
                    lineHeight: font13.lineHeight,
                  }}
                >
                  Please enter your password in order to get this.
                </div>
              </div>
              <div
                style={{
                  borderBottom:
                    themeName !== "dark-theme"
                      ? "1px solid rgba(0, 0, 0, 0.1)"
                      : // : "0.1px solid rgb(70, 70, 70)",
                        "1px solid rgb(70, 70, 70)",

                  display: "inline-block",
                  width: "100%",
                }}
              ></div>
              <div
                style={{
                  padding: "0px 16px",
                }}
              >
                <FormControl
                  className="mt-2"
                  sx={{
                    width: "100%",
                  }}
                  variant="outlined"
                >
                  <InputLabel
                    sx={{
                      color: themeName === "dark-theme" ? "#71767B" : "",
                      "&.MuiInputLabel-shrink": {
                        color:
                          verifyPasswordErrorMessage &&
                          verifyPasswordInput?.length > 0
                            ? "rgb(244, 33, 46)!important"
                            : "#1f9cf0 !important",
                      },
                    }}
                    htmlFor="outlined-adornment-password"
                  >
                    Password{" "}
                  </InputLabel>
                  <OutlinedInput
                    autoFocus
                    sx={{
                      color: themeName === "dark-theme" ? "white" : "black",
                      "& .MuiOutlinedInput-notchedOutline": {
                        border:
                          themeName === "dark-theme" &&
                          !verifyPasswordErrorMessage
                            ? "1px solid rgb(70, 70, 70) !important"
                            : themeName !== "dark-theme" &&
                              !verifyPasswordErrorMessage
                            ? "1px solid #cfd9de !important"
                            : verifyPasswordErrorMessage
                            ? "2px solid rgb(244, 33, 46)!important"
                            : null,
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        border:
                          verifyPasswordErrorMessage &&
                          verifyPasswordInput?.length > 0
                            ? "2px solid rgb(244, 33, 46)!important"
                            : "2px solid #1d9bf0 !important",
                      },
                    }}
                    onChange={(e) => setverifyPasswordInput(e.target.value)}
                    value={verifyPasswordInput}
                    id="outlined-adornment-password"
                    type={"password"}
                    label="Password"
                  />
                </FormControl>{" "}
                <div
                  className="mt-1 chirp-regular-font"
                  style={{
                    display: "inline-block",
                    color: "rgb(29, 155, 240)",
                    textAlign: "left",
                    fontSize: font13.fontSize,
                    lineHeight: font13.lineHeight,

                    width: "92%",
                    position: "relative",
                  }}
                >
                  <span
                    onClick={() => {
                      navigate("/i/flow/password_reset");
                    }}
                    className="forgot-password-logout-settings-and-privacy-modal"
                    style={{
                      cursor: "pointer",
                      position: "relative",
                      left: "10px",
                    }}
                  >
                    Forgot password?
                  </span>{" "}
                  {verifyPasswordErrorMessage &&
                    verifyPasswordInput?.length > 0 && (
                      <>
                        <div
                          className="mt-1 chirp-regular-font"
                          style={{
                            display: "inline-block",
                            color: "rgba(244,39,49,255)",
                            textAlign: "left",
                            fontSize: font13.fontSize,
                            lineHeight: font13.lineHeight,
                            width: "92%",
                          }}
                        >
                          <span
                            className="chirp-regular-font"
                            style={{
                              position: "relative",
                              left: "10px",
                            }}
                          >
                            {verifyPasswordErrorMessage}
                          </span>
                        </div>
                      </>
                    )}
                </div>
              </div>{" "}
              <div
                className="mt-1"
                style={{
                  textAlign: "right",
                  width: "100%",
                }}
              >
                <Button
                  style={{
                    height: "36px !important",
                    marginTop: "15px",
                    position: "relative",
                    right: "20px",
                    border: "none",
                    maxWidth: "92px",
                    maxHeight: "36px",
                    minHeight: "36px",
                    fontSize: font15.fontSize,
                    cursor: "pointer",
                  }}
                  onClick={
                    verifyPasswordInput
                      ? () => {
                          handlePasswordConfirmation();
                        }
                      : null
                  }
                  className={"hover-blue-btn-light-theme"}
                >
                  Confirm
                </Button>
              </div>
            </>
          ) : (
            <div
              style={{
                width: "100%",
              }}
              className="mt-2"
            >
              <div
                onClick={() => navigate("/settings/screen_name")}
                className={
                  themeName === "dark-theme"
                    ? "has-children-dark-theme"
                    : "has-children-light-theme"
                }
                style={{
                  padding: "12px 24px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div
                    className={
                      themeName === "dark-theme"
                        ? "soft-grey-dark-theme-text-variant-1 chirp-regular-font"
                        : "very-dark-gray-light-theme-text-variant-1 chirp-regular-font"
                    }
                    style={{
                      fontSize: font15.fontSize,
                      lineHeight: font15.lineHeight,
                    }}
                  >
                    Username
                  </div>
                  <div
                    className={
                      themeName === "dark-theme"
                        ? "soft-grey-dark-theme-text-variant-2 chirp-regular-font"
                        : "very-dark-gray-light-theme-text-variant-2 chirp-regular-font"
                    }
                    style={{
                      fontSize: font13.fontSize,
                      lineHeight: font13.lineHeight,
                    }}
                  >
                    @{user.username}
                  </div>
                </div>
                <div>
                  {" "}
                  <svg
                    fill={themeName === "dark-theme" ? "#71767a" : "#536371"}
                    width={`${1.25}em`}
                    height={`${1.25}em`}
                    className={
                      themeName === "dark-theme"
                        ? "svg-setting-section-arrow-dark-theme"
                        : "svg-setting-section-arrow-light-theme"
                    }
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <g>
                      <path d="M14.586 12L7.543 4.96l1.414-1.42L17.414 12l-8.457 8.46-1.414-1.42L14.586 12z"></path>
                    </g>
                  </svg>
                </div>
              </div>
              <div
                onClick={() => navigate("/settings/phone")}
                className={
                  themeName === "dark-theme"
                    ? "has-children-dark-theme"
                    : "has-children-light-theme"
                }
                style={{
                  padding: "12px 24px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div
                    className={
                      themeName === "dark-theme"
                        ? "soft-grey-dark-theme-text-variant-1 chirp-regular-font"
                        : "very-dark-gray-light-theme-text-variant-1 chirp-regular-font"
                    }
                    style={{
                      fontSize: font15.fontSize,
                      lineHeight: font15.lineHeight,
                    }}
                  >
                    Phone
                    <div
                      className={
                        themeName === "dark-theme"
                          ? "soft-grey-dark-theme-text-variant-2 chirp-regular-font"
                          : "very-dark-gray-light-theme-text-variant-2 chirp-regular-font"
                      }
                      style={{
                        fontSize: font13.fontSize,
                        lineHeight: font13.lineHeight,
                      }}
                    >
                      {user.phoneNumber?.length
                        ? user.phoneNumber[0].withPlusSign
                        : null}
                    </div>
                  </div>
                </div>
                <div>
                  {" "}
                  <svg
                    fill={themeName === "dark-theme" ? "#71767a" : "#536371"}
                    width={`${1.25}em`}
                    height={`${1.25}em`}
                    className={
                      themeName === "dark-theme"
                        ? "svg-setting-section-arrow-dark-theme"
                        : "svg-setting-section-arrow-light-theme"
                    }
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <g>
                      <path d="M14.586 12L7.543 4.96l1.414-1.42L17.414 12l-8.457 8.46-1.414-1.42L14.586 12z"></path>
                    </g>
                  </svg>
                </div>
              </div>
              <div
                onClick={() => navigate("/settings/email")}
                className={
                  themeName === "dark-theme"
                    ? "has-children-dark-theme"
                    : "has-children-light-theme"
                }
                style={{
                  padding: "12px 24px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div
                    className={
                      themeName === "dark-theme"
                        ? "soft-grey-dark-theme-text-variant-1 chirp-regular-font"
                        : "very-dark-gray-light-theme-text-variant-1 chirp-regular-font"
                    }
                    style={{
                      fontSize: font15.fontSize,
                      lineHeight: font15.lineHeight,
                    }}
                  >
                    Email
                  </div>
                  <div
                    className={
                      themeName === "dark-theme"
                        ? "soft-grey-dark-theme-text-variant-2 chirp-regular-font"
                        : "very-dark-gray-light-theme-text-variant-2 chirp-regular-font"
                    }
                    style={{
                      fontSize: font13.fontSize,
                      lineHeight: font13.lineHeight,
                    }}
                  >
                    {user.email}
                  </div>
                </div>
                <div>
                  {" "}
                  <svg
                    fill={themeName === "dark-theme" ? "#71767a" : "#536371"}
                    width={`${1.25}em`}
                    height={`${1.25}em`}
                    className={
                      themeName === "dark-theme"
                        ? "svg-setting-section-arrow-dark-theme"
                        : "svg-setting-section-arrow-light-theme"
                    }
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <g>
                      <path d="M14.586 12L7.543 4.96l1.414-1.42L17.414 12l-8.457 8.46-1.414-1.42L14.586 12z"></path>
                    </g>
                  </svg>
                </div>
              </div>
              <div
                style={{
                  padding: "12px 24px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div
                    className={
                      themeName === "dark-theme"
                        ? "soft-grey-dark-theme-text-variant-1 chirp-regular-font"
                        : "very-dark-gray-light-theme-text-variant-1 chirp-regular-font"
                    }
                    style={{
                      fontSize: font15.fontSize,
                      lineHeight: font15.lineHeight,
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <span>Verified</span>
                    <span
                      className={
                        themeName === "dark-theme"
                          ? "soft-grey-dark-theme-text-variant-2 chirp-regular-font"
                          : "very-dark-gray-light-theme-text-variant-2 chirp-regular-font"
                      }
                      style={{
                        fontSize: font13.fontSize,
                        lineHeight: font13.lineHeight,
                      }}
                    >
                      {user.verified ? "Yes." : "No"}{" "}
                      <span
                        className={
                          themeName === "dark-theme"
                            ? "hover-blue-underline chirp-regular-font"
                            : "hover-blue-underline chirp-regular-font"
                        }
                        style={{
                          fontSize: font13.fontSize,
                          lineHeight: font13.lineHeight,
                          color: "rgb(29, 155, 240)",
                        }}
                      >
                        Learn more
                      </span>
                    </span>
                  </div>
                </div>
              </div>{" "}
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
                onClick={() => navigate("/settings/audience_and_tagging")}
                className={
                  themeName === "dark-theme"
                    ? "has-children-dark-theme"
                    : "has-children-light-theme"
                }
                style={{
                  padding: "12px 24px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div
                    className={
                      themeName === "dark-theme"
                        ? "soft-grey-dark-theme-text-variant-1 chirp-regular-font"
                        : "very-dark-gray-light-theme-text-variant-1 chirp-regular-font"
                    }
                    style={{
                      fontSize: font15.fontSize,
                      lineHeight: font15.lineHeight,
                    }}
                  >
                    Protected posts
                  </div>
                  <div
                    className={
                      themeName === "dark-theme"
                        ? "soft-grey-dark-theme-text-variant-2 chirp-regular-font"
                        : "very-dark-gray-light-theme-text-variant-2 chirp-regular-font"
                    }
                    style={{
                      fontSize: font13.fontSize,
                      lineHeight: font13.lineHeight,
                    }}
                  >
                    {userInfo.isPrivate ? "Yes" : "No"}
                  </div>
                </div>
                <div>
                  {" "}
                  <svg
                    fill={themeName === "dark-theme" ? "#71767a" : "#536371"}
                    width={`${1.25}em`}
                    height={`${1.25}em`}
                    className={
                      themeName === "dark-theme"
                        ? "svg-setting-section-arrow-dark-theme"
                        : "svg-setting-section-arrow-light-theme"
                    }
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <g>
                      <path d="M14.586 12L7.543 4.96l1.414-1.42L17.414 12l-8.457 8.46-1.414-1.42L14.586 12z"></path>
                    </g>
                  </svg>
                </div>
              </div>
              <div
                style={{
                  padding: "12px 24px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div
                    className={
                      themeName === "dark-theme"
                        ? "soft-grey-dark-theme-text-variant-1 chirp-regular-font"
                        : "very-dark-gray-light-theme-text-variant-1 chirp-regular-font"
                    }
                    style={{
                      fontSize: font15.fontSize,
                      lineHeight: font15.lineHeight,
                    }}
                  >
                    Account creation
                  </div>
                  <div
                    className={
                      themeName === "dark-theme"
                        ? "soft-grey-dark-theme-text-variant-2 chirp-regular-font"
                        : "very-dark-gray-light-theme-text-variant-2 chirp-regular-font"
                    }
                    style={{
                      fontSize: font13.fontSize,
                      lineHeight: font13.lineHeight,
                    }}
                  >
                    <div>{formatDateTime(user.createdAt)}</div>
                    <div>
                      {user.ipAddress === "::1" ? "::1 (Localhost)" : ""}
                    </div>
                  </div>
                </div>
              </div>{" "}
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
                onClick={() => navigate("/settings/country")}
                className={
                  themeName === "dark-theme"
                    ? "has-children-dark-theme"
                    : "has-children-light-theme"
                }
                style={{
                  padding: "12px 24px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div
                    style={{
                      fontSize: font15.fontSize,
                      lineHeight: font15.lineHeight,
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <span
                      className={
                        themeName === "dark-theme"
                          ? "soft-grey-dark-theme-text-variant-1 chirp-regular-font"
                          : "very-dark-gray-light-theme-text-variant-1 chirp-regular-font"
                      }
                    >
                      Country
                    </span>
                    <span
                      className={
                        themeName === "dark-theme"
                          ? "soft-grey-dark-theme-text-variant-2 chirp-regular-font"
                          : "very-dark-gray-light-theme-text-variant-2 chirp-regular-font"
                      }
                      style={{
                        fontSize: font13.fontSize,
                        lineHeight: font13.lineHeight,
                      }}
                    >
                      {user.country ? user.country : null}
                    </span>
                  </div>
                </div>{" "}
                <div>
                  {" "}
                  <svg
                    fill={themeName === "dark-theme" ? "#71767a" : "#536371"}
                    width={`${1.25}em`}
                    height={`${1.25}em`}
                    className={
                      themeName === "dark-theme"
                        ? "svg-setting-section-arrow-dark-theme"
                        : "svg-setting-section-arrow-light-theme"
                    }
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <g>
                      <path d="M14.586 12L7.543 4.96l1.414-1.42L17.414 12l-8.457 8.46-1.414-1.42L14.586 12z"></path>
                    </g>
                  </svg>
                </div>
              </div>{" "}
              <div
                onClick={() => navigate("/settings/languages")}
                className={
                  themeName === "dark-theme"
                    ? "has-children-dark-theme"
                    : "has-children-light-theme"
                }
                style={{
                  padding: "12px 24px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div
                    style={{
                      fontSize: font15.fontSize,
                      lineHeight: font15.lineHeight,
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <span
                      className={
                        themeName === "dark-theme"
                          ? "soft-grey-dark-theme-text-variant-1 chirp-regular-font"
                          : "very-dark-gray-light-theme-text-variant-1 chirp-regular-font"
                      }
                    >
                      Languages
                    </span>
                    <span
                      className={
                        themeName === "dark-theme"
                          ? "soft-grey-dark-theme-text-variant-2 chirp-regular-font"
                          : "very-dark-gray-light-theme-text-variant-2 chirp-regular-font"
                      }
                      style={{
                        fontSize: font13.fontSize,
                        lineHeight: font13.lineHeight,
                      }}
                    >
                      English, Turkish, No linguistic content, French
                    </span>
                  </div>
                </div>{" "}
                <div>
                  {" "}
                  <svg
                    fill={themeName === "dark-theme" ? "#71767a" : "#536371"}
                    width={`${1.25}em`}
                    height={`${1.25}em`}
                    className={
                      themeName === "dark-theme"
                        ? "svg-setting-section-arrow-dark-theme"
                        : "svg-setting-section-arrow-light-theme"
                    }
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <g>
                      <path d="M14.586 12L7.543 4.96l1.414-1.42L17.414 12l-8.457 8.46-1.414-1.42L14.586 12z"></path>
                    </g>
                  </svg>
                </div>
              </div>{" "}
              <div
                onClick={() => navigate("/settings/your_twitter_data/gender")}
                className={
                  themeName === "dark-theme"
                    ? "has-children-dark-theme"
                    : "has-children-light-theme"
                }
                style={{
                  padding: "12px 24px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div
                    style={{
                      fontSize: font15.fontSize,
                      lineHeight: font15.lineHeight,
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <span
                      className={
                        themeName === "dark-theme"
                          ? "soft-grey-dark-theme-text-variant-1 chirp-regular-font"
                          : "very-dark-gray-light-theme-text-variant-1 chirp-regular-font"
                      }
                    >
                      Gender
                    </span>
                    <span
                      className={
                        themeName === "dark-theme"
                          ? "soft-grey-dark-theme-text-variant-2 chirp-regular-font"
                          : "very-dark-gray-light-theme-text-variant-2 chirp-regular-font"
                      }
                      style={{
                        fontSize: font13.fontSize,
                        lineHeight: font13.lineHeight,
                      }}
                    >
                      {user?.gender ? user.gender : null}
                    </span>
                  </div>
                </div>
                <div>
                  {" "}
                  <svg
                    fill={themeName === "dark-theme" ? "#71767a" : "#536371"}
                    width={`${1.25}em`}
                    height={`${1.25}em`}
                    className={
                      themeName === "dark-theme"
                        ? "svg-setting-section-arrow-dark-theme"
                        : "svg-setting-section-arrow-light-theme"
                    }
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <g>
                      <path d="M14.586 12L7.543 4.96l1.414-1.42L17.414 12l-8.457 8.46-1.414-1.42L14.586 12z"></path>
                    </g>
                  </svg>
                </div>
              </div>{" "}
              <div
                style={{
                  padding: "12px 24px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div
                    style={{
                      fontSize: font15.fontSize,
                      lineHeight: font15.lineHeight,
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <span
                      className={
                        themeName === "dark-theme"
                          ? "soft-grey-dark-theme-text-variant-1 chirp-regular-font"
                          : "very-dark-gray-light-theme-text-variant-1 chirp-regular-font"
                      }
                    >
                      Birth date
                    </span>
                    <span
                      className={
                        themeName === "dark-theme"
                          ? "soft-grey-dark-theme-text-variant-2 mt-1 chirp-regular-font"
                          : "very-dark-gray-light-theme-text-variant-2 mt-1 chirp-regular-font"
                      }
                      style={{
                        fontSize: font13.fontSize,
                        lineHeight: font13.lineHeight,
                      }}
                    >
                      {user.birthDate && (
                        <>
                          <span>{user.birthDate.month.slice(0, 3)} </span>
                          <span>{user.birthDate.day}, </span>
                          <span>{user.birthDate.year}</span>
                        </>
                      )}
                    </span>
                    <span
                      className={
                        themeName === "dark-theme"
                          ? "soft-grey-dark-theme-text-variant-2 mt-1 chirp-regular-font"
                          : "very-dark-gray-light-theme-text-variant-2 mt-1 chirp-regular-font"
                      }
                      style={{
                        fontSize: font13.fontSize,
                        lineHeight: font13.lineHeight,
                      }}
                    >
                      Add your date of birth to your{" "}
                      <span
                        onClick={() => navigate(`/profile`)}
                        style={{
                          fontSize: font13.fontSize,
                          lineHeight: font13.lineHeight,

                          color: "rgb(29, 155, 240)",
                        }}
                        className={"hover-blue-underline chirp-regular-font"}
                      >
                        profile
                      </span>
                      .
                    </span>
                  </div>
                </div>{" "}
              </div>{" "}
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
                onClick={() => navigate("/settings/your_twitter_data/age")}
                className={
                  themeName === "dark-theme"
                    ? "has-children-dark-theme"
                    : "has-children-light-theme"
                }
                style={{
                  padding: "12px 24px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div
                    style={{
                      fontSize: font15.fontSize,
                      lineHeight: font15.lineHeight,
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <span
                      className={
                        themeName === "dark-theme"
                          ? "soft-grey-dark-theme-text-variant-1 chirp-regular-font"
                          : "very-dark-gray-light-theme-text-variant-1 chirp-regular-font"
                      }
                    >
                      Age
                    </span>
                    <span
                      className={
                        themeName === "dark-theme"
                          ? "soft-grey-dark-theme-text-variant-2 chirp-regular-font"
                          : "very-dark-gray-light-theme-text-variant-2 chirp-regular-font"
                      }
                      style={{
                        fontSize: font13.fontSize,
                        lineHeight: font13.lineHeight,
                      }}
                    >
                      {user.birthDate?.year && (
                        <>{new Date().getFullYear() - user.birthDate.year}</>
                      )}
                    </span>
                  </div>
                </div>{" "}
                <div>
                  {" "}
                  <svg
                    fill={themeName === "dark-theme" ? "#71767a" : "#536371"}
                    width={`${1.25}em`}
                    height={`${1.25}em`}
                    className={
                      themeName === "dark-theme"
                        ? "svg-setting-section-arrow-dark-theme"
                        : "svg-setting-section-arrow-light-theme"
                    }
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <g>
                      <path d="M14.586 12L7.543 4.96l1.414-1.42L17.414 12l-8.457 8.46-1.414-1.42L14.586 12z"></path>
                    </g>
                  </svg>
                </div>
              </div>{" "}
              <div
                onClick={() => {
                  !user?.automated_account
                    ? setOpenAutomationInformationModal(true)
                    : navigate("/settings/account/automation");
                }}
                className={
                  themeName === "dark-theme"
                    ? "has-children-dark-theme"
                    : "has-children-light-theme"
                }
                style={{
                  padding: "12px 24px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "60px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div
                    style={{
                      fontSize: font15.fontSize,
                      lineHeight: font15.lineHeight,
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <span
                      className={
                        themeName === "dark-theme"
                          ? "soft-grey-dark-theme-text-variant-1 chirp-regular-font"
                          : "very-dark-gray-light-theme-text-variant-1 chirp-regular-font"
                      }
                    >
                      Automation
                    </span>
                    <span
                      className={
                        themeName === "dark-theme"
                          ? "soft-grey-dark-theme-text-variant-2 chirp-regular-font"
                          : "very-dark-gray-light-theme-text-variant-2 chirp-regular-font"
                      }
                      style={{
                        fontSize: font13.fontSize,
                        lineHeight: font13.lineHeight,
                      }}
                    >
                      Manage your automated account.
                    </span>
                  </div>
                </div>
                <div>
                  <svg
                    fill={themeName === "dark-theme" ? "#71767a" : "#536371"}
                    width={`${1.25}em`}
                    height={`${1.25}em`}
                    className={
                      themeName === "dark-theme"
                        ? "svg-setting-section-arrow-dark-theme"
                        : "svg-setting-section-arrow-light-theme"
                    }
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <g>
                      <path d="M14.586 12L7.543 4.96l1.414-1.42L17.414 12l-8.457 8.46-1.414-1.42L14.586 12z"></path>
                    </g>
                  </svg>
                </div>
              </div>
            </div>
          )}
        </>
      </Col>
    </>
  );
}

export default AccountInformationMain;
