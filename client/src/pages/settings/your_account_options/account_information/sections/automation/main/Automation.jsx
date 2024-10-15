import { Col, Modal, Button } from "react-bootstrap";
import SettingsNavigation from "../../../../../../../components/SettingsNavigation/SettingsNavigation";
import { useAntdMessageHandler } from "../../../../../../../utils/useAntdMessageHandler";
import useWindowDimensions from "../../../../../../../hooks/getWindowDimensions";
import { ThemeContext } from "../../../../../../../context/ThemeContext";
import { UserContext } from "../../../../../../../context/UserContext";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../../../../../../../components/ui/LoadingSpinner";
import axios from "axios";
import { NavigationHistoryContext } from "../../../../../../../context/NavigationHistoryContext";
import { useFontSizeHandler } from "../../../../../../../utils/useFontSizeHandler";

const API_URL = import.meta.env.VITE_APP_API_URL;

function Automation() {
  const { contextHolder } = useAntdMessageHandler();
  const { width } = useWindowDimensions();
  const [{ themeName }] = useContext(ThemeContext);
  const navigate = useNavigate();
  const { getToken } = useContext(UserContext);

  const loading = false;

  const [user, setUser] = useState([]);

  const refreshActiveUser = () => {
    axios
      .get(`${API_URL}/profile`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
      .then((response) => {
        console.log("User =>", response.data.user);
        setUser(response.data.user);
      })
      .catch((error) => {
        console.log("Error =>", error);
      });
  };

  useEffect(() => {
    refreshActiveUser();
  }, []);

  const { navigationHistoryArray } = useContext(NavigationHistoryContext);

  const [showManagingAccountModal, setShowManagingAccountModal] =
    useState(null);

  const show_disconnect_managing_account_modal = () => {
    setShowManagingAccountModal(true);
  };

  const [showDisconnectedMessage, setShowDisconnectedMessage] = useState(null);

  const remove_automated_account_from_user = async () => {
    try {
      const response = await axios.post(
        `${API_URL}/remove_automated_account_from_user`,
        {},
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      if (response) {
        setShowManagingAccountModal(false);
        setTimeout(() => {
          refreshActiveUser();
        }, 400);
        setTimeout(() => {
          setShowDisconnectedMessage(true);
        }, 450);
      }
    } catch (error) {
      console.error("Error =>", error);
    }
  };

  const [
    showManagingAccountConnectedMessage,
    setShowManagingAccountConnectedMessage,
  ] = useState(null);

  useEffect(() => {
    if (user?.automated_account_connected_message_show) {
      setShowManagingAccountConnectedMessage(true);

      const change_connected_message_statu = async () => {
        await axios.post(
          `${API_URL}/change_show_managing_account_connected_message_status`,
          {},
          {
            headers: {
              Authorization: `Bearer ${getToken()}`,
            },
          }
        );
      };

      setTimeout(() => {
        change_connected_message_statu();
      }, 2500);
    }
  }, []);

  const {
    getFontSizeAndLineHeight26,
    getFontSizeAndLineHeight20,
    getFontSizeAndLineHeight17,
    getFontSizeAndLineHeight15,
    getFontSizeAndLineHeight13,
  } = useFontSizeHandler();
  const font26 = getFontSizeAndLineHeight26();
  const font20 = getFontSizeAndLineHeight20();
  const font17 = getFontSizeAndLineHeight17();
  const font15 = getFontSizeAndLineHeight15();
  const font13 = getFontSizeAndLineHeight13();
  return (
    <>
      {" "}
      {contextHolder}
      <>
        <Modal
          backdropClassName={
            themeName === "dark-theme" ? `back-drop-${themeName}` : ""
          }
          style={{
            height: "100%",
            overflowX: "hidden",
            overflowY: "hidden",
          }}
          show={showManagingAccountModal}
          centered={true}
          dialogClassName={
            width < 700
              ? "show_modal_from_absolute_bottom_dialog_class_name"
              : "modal_center_with_width"
          }
          contentClassName={
            themeName === "dark-theme" && width > 700
              ? "showManagingAccountModal-dark-theme"
              : themeName !== "dark-theme" && width > 700
              ? "showManagingAccountModal-light-theme"
              : themeName === "dark-theme" && width <= 700
              ? "show_modal_from_absolute_bottom_content_class_name_dark_theme"
              : themeName !== "dark-theme" && width <= 700
              ? "show_modal_from_absolute_bottom_content_class_name_light_theme"
              : null
          }
        >
          <Modal.Header
            className="signin-modal-header-child-non-reactivate"
            style={{
              border: "none",
              zIndex: 999,
              outlineStyle: "none",
              width: "100%",
            }}
          >
            <div
              onClick={() => {
                navigate("/?");
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
                width={20}
                height={20}
                style={{
                  position: "absolute",
                  border: "none",
                }}
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-z80fyv r-19wmn03"
              >
                <g>
                  <path d="M10.59 12L4.54 5.96l1.42-1.42L12 10.59l6.04-6.05 1.42 1.42L13.41 12l6.05 6.04-1.42 1.42L12 13.41l-6.04 6.05-1.42-1.42L10.59 12z"></path>
                </g>
              </svg>
            </div>
          </Modal.Header>

          <Modal.Body
            style={{
              padding: "0px",
              margin: "0px",
            }}
          >
            {!loading ? (
              <>
                <>
                  <div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "flex-start",
                        alignItems: "center",
                        maxWidth: "400px",
                        margin: "32px",
                        paddingBottom: "48px",
                      }}
                    >
                      <div
                        className={
                          themeName === "dark-theme"
                            ? "soft-grey-dark-theme-text-variant-1 chirp-heavy-font"
                            : "very-dark-gray-light-theme-text-variant-1 chirp-heavy-font"
                        }
                        style={{
                          width: "100%",
                          fontSize: font26.fontSize,
                          lineHeight: font26.lineHeight,
                        }}
                      >
                        Disconnect your managing account?
                      </div>
                      <div
                        className={
                          themeName === "dark-theme"
                            ? "soft-grey-dark-theme-text-variant-2 chirp-regular-font"
                            : "very-dark-gray-light-theme-text-variant-2 chirp-regular-font"
                        }
                        style={{
                          width: "100%",
                          fontSize: font15.fontSize,
                          lineHeight: font15.lineHeight,
                          marginBottom: "32px",
                        }}
                      >
                        Your automated account will lose its label if you
                        disconnect your managing account.
                      </div>
                      <div
                        style={{
                          width: "100%",
                        }}
                      >
                        <Button
                          onClick={() => remove_automated_account_from_user()}
                          className="chirp-bold-font blue-btn"
                          style={{
                            width: "100%",
                            minWidth: "52px",
                            minHeight: "52px",
                            border: "none",
                            fontSize: font17.fontSize,
                            lineHeight: font17.lineHeight,
                          }}
                        >
                          <span className=" ">Yes, disconnect</span>
                        </Button>
                      </div>
                      <div
                        style={{
                          width: "100%",
                          marginTop: "16px",
                        }}
                      >
                        <Button
                          onClick={() => setShowManagingAccountModal(false)}
                          variant="light"
                          className={`sign-in sign-in-${themeName} chirp-bold-font`}
                          style={{
                            width: "100%",
                            minWidth: "52px",
                            minHeight: "52px",
                            fontSize: font17.fontSize,
                            lineHeight: font17.lineHeight,
                          }}
                        >
                          <span>Cancel</span>
                        </Button>
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
        </Modal>
      </>
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
        <div className="settings-header-with-arrow ">
          <div
            onClick={() => {
              if (navigationHistoryArray[1] !== "/i/flow/add_email") {
                navigate(-1);
              } else {
                navigate("/settings/account");
              }
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
            Automation
          </div>
        </div>{" "}
        <div
          className={
            themeName === "dark-theme"
              ? "soft-grey-dark-theme-text-variant-2 mt-4 chirp-regular-font"
              : "very-dark-gray-light-theme-text-variant-2 mt-4 chirp-regular-font"
          }
          style={{
            paddingLeft: "16px",
            fontSize: font13.fontSize,
            lineHeight: font13.lineHeight,
          }}
        >
          Manage your automated account.
        </div>
        {user?.automated_account ? (
          <>
            <div
              className={
                themeName === "dark-theme"
                  ? "soft-grey-dark-theme-text-variant-1 mt-4 chirp-regular-font"
                  : "very-dark-gray-light-theme-text-variant-1 mt-4 chirp-regular-font"
              }
              style={{
                paddingLeft: "16px",
                fontSize: font15.fontSize,
                lineHeight: font15.lineHeight,
              }}
            >
              Managing account
            </div>
            <div
              className={
                themeName === "dark-theme"
                  ? "soft-grey-dark-theme-text-variant-2 chirp-regular-font"
                  : "very-dark-gray-light-theme-text-variant-2 chirp-regular-font"
              }
              style={{
                paddingLeft: "16px",
                fontSize: font13.fontSize,
                lineHeight: font13.lineHeight,
              }}
            >
              {user.automated_account.username}
            </div>
            <div
              className={
                themeName === "dark-theme"
                  ? "dark-hover-effect mt-3"
                  : "light-hover-effect mt-3"
              }
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 16px",
              }}
            >
              <div
                className={
                  themeName === "dark-theme"
                    ? "soft-grey-dark-theme-text-variant-1  chirp-regular-font"
                    : "very-dark-gray-light-theme-text-variant-1  chirp-regular-font"
                }
                style={{
                  fontSize: font15.fontSize,
                  lineHeight: font15.lineHeight,
                }}
              >
                Change managing account
              </div>
              <div>
                <svg
                  fill={
                    themeName === "dark-theme" ? "#71767A" : "rgb(83, 100, 113)"
                  }
                  width={`${1.25}em`}
                  height={`${1.25}em`}
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <g>
                    <path d="M14.586 12L7.543 4.96l1.414-1.42L17.414 12l-8.457 8.46-1.414-1.42L14.586 12z"></path>
                  </g>
                </svg>
              </div>
            </div>{" "}
            {showManagingAccountConnectedMessage && (
              <div
                style={{
                  width: "100%",
                  padding: "0px 16px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    backgroundColor:
                      themeName === "dark-theme" ? "#002219" : "#ECFEF9",
                    padding: "12px 16px",
                    borderRadius: "8px",
                    gap: ".5rem",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <svg
                      fill={themeName === "dark-theme" ? "#E6E9EA" : "#0F141A"}
                      width={`${1.25}em`}
                      height={`${1.25}em`}
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-1wron08"
                    >
                      <g>
                        <path d="M12 1.75C6.34 1.75 1.75 6.34 1.75 12S6.34 22.25 12 22.25 22.25 17.66 22.25 12 17.66 1.75 12 1.75zm-.81 14.68l-4.1-3.27 1.25-1.57 2.47 1.98 3.97-5.47 1.62 1.18-5.21 7.15z"></path>
                      </g>
                    </svg>
                  </div>
                  <div
                    className={
                      themeName === "dark-theme"
                        ? " chirp-bold-font soft-grey-dark-theme-text-variant-1"
                        : "chirp-bold-font very-dark-gray-light-theme-text-variant-1"
                    }
                    style={{
                      fontSize: font15.fontSize,
                      lineHeight: font15.lineHeight,
                    }}
                  >
                    Managing account connected
                  </div>
                </div>
              </div>
            )}
            <div
              className="mt-2"
              style={{
                borderTop:
                  themeName !== "dark-theme"
                    ? "1px solid rgba(0, 0, 0, 0.1)"
                    : // : "0.1px solid rgb(70, 70, 70)",
                      "1px solid rgb(70, 70, 70)",
              }}
            ></div>
            <div
              onClick={() => show_disconnect_managing_account_modal()}
              className={
                themeName === "dark-theme"
                  ? "mt-1 chirp-regular-font deactivate-btn-dark-theme"
                  : "mt-1 chirp-regular-font deactivate-btn-light-theme"
              }
              style={{
                color: "#F4212D",
                textAlign: "center",
                fontSize: font15.fontSize,
                lineHeight: font15.lineHeight,
                padding: "16px",
                cursor: "pointer",
              }}
            >
              Turn off account automation
            </div>
          </>
        ) : (
          <div
            onClick={() => navigate("/i/flow/enable_automated_account")}
            className={
              themeName === "dark-theme"
                ? "dark-hover-effect mt-4"
                : "light-hover-effect mt-4"
            }
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "12px 16px",
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
                    ? " chirp-regular-font soft-grey-dark-theme-text-variant-1"
                    : "chirp-regular-font very-dark-gray-light-theme-text-variant-1"
                }
                style={{
                  fontSize: font15.fontSize,
                  lineHeight: font15.lineHeight,
                }}
              >
                Set up account automation
              </div>
              <div>
                <div
                  style={{
                    fontSize: font13.fontSize,
                  }}
                  className={
                    themeName === "dark-theme"
                      ? " chirp-regular-font soft-grey-dark-theme-text-variant-2"
                      : "chirp-regular-font very-dark-gray-light-theme-text-variant-2"
                  }
                >
                  Connect a managing account so your automated account receives
                  an automated account label. All automated accounts must be
                  connected to a managing account.{" "}
                  <span className="hover-blue-underline">Learn more</span>
                </div>
              </div>{" "}
            </div>
            <div>
              {" "}
              <svg
                fill={
                  themeName === "dark-theme" ? "#71767A" : "rgb(83, 100, 113)"
                }
                width={`${1.25}em`}
                height={`${1.25}em`}
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <g>
                  <path d="M14.586 12L7.543 4.96l1.414-1.42L17.414 12l-8.457 8.46-1.414-1.42L14.586 12z"></path>
                </g>
              </svg>
            </div>
          </div>
        )}
        {showDisconnectedMessage && (
          <div
            style={{
              width: "100%",
              padding: "0px 16px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                backgroundColor:
                  themeName === "dark-theme" ? "#002219" : "#ECFEF9",
                padding: "12px 16px",
                borderRadius: "8px",
                gap: ".5rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <svg
                  fill={themeName === "dark-theme" ? "#E6E9EA" : "#0F141A"}
                  width={`${1.25}em`}
                  height={`${1.25}em`}
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-1wron08"
                >
                  <g>
                    <path d="M12 1.75C6.34 1.75 1.75 6.34 1.75 12S6.34 22.25 12 22.25 22.25 17.66 22.25 12 17.66 1.75 12 1.75zm-.81 14.68l-4.1-3.27 1.25-1.57 2.47 1.98 3.97-5.47 1.62 1.18-5.21 7.15z"></path>
                  </g>
                </svg>
              </div>
              <div
                className={
                  themeName === "dark-theme"
                    ? " chirp-bold-font soft-grey-dark-theme-text-variant-1"
                    : "chirp-bold-font very-dark-gray-light-theme-text-variant-1"
                }
                style={{
                  fontSize: font15.fontSize,
                  lineHeight: font15.lineHeight,
                }}
              >
                Managing account disconnected
              </div>
            </div>
          </div>
        )}
      </Col>
    </>
  );
}

export default Automation;
