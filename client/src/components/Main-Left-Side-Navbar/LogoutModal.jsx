import { useState, useContext } from "react";
import { UserContext } from "../../context/UserContext";
import { Button, Modal, Stack } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

// import Picker from "emoji-picker-react";
import axios from "axios";

import Popover from "@mui/material/Popover";
import PopupState, { bindTrigger, bindPopover } from "material-ui-popup-state";
import LoadingSpinner from "../ui/LoadingSpinner";
import { ThemeContext } from "../../context/ThemeContext";
import useWindowDimensions from "../../hooks/getWindowDimensions";

const API_URL = import.meta.env.VITE_APP_API_URL;

import { useAntdMessageHandler } from "../../utils/useAntdMessageHandler";
import { useFontSizeHandler } from "../../utils/useFontSizeHandler";

function LogoutModal({ isMobileNavigationBarTop }) {
  const [{ themeName }] = useContext(ThemeContext);

  const { width } = useWindowDimensions();
  const { getFontSizeAndLineHeight20, getFontSizeAndLineHeight15 } =
    useFontSizeHandler();
  const font20 = getFontSizeAndLineHeight20();
  const font15 = getFontSizeAndLineHeight15();

  const navigate = useNavigate();

  const { getToken, logout, userInfo } = useContext(UserContext);

  const [showLogoutSpinner, setshowLogoutSpinner] = useState(false);
  const handleLogout = () => {
    setshowLogoutSpinner(true);

    axios
      .post(`${API_URL}/auth/logout`, null, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
      .then(() => {
        setTimeout(() => {
          logout();
          setshowLogoutSpinner(false);
          navigate("/");
        }, 1000);
      })
      .catch((err) => {
        err;
      });
  };

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const handleOpenLogoutModal = () => {
    setShowLogoutModal(true);
  };

  const { contextHolder } = useAntdMessageHandler();

  return (
    <>
      {contextHolder}
      {isMobileNavigationBarTop && (
        <div
          onClick={() => setShowLogoutModal(true)}
          className={
            themeName === "dark-theme"
              ? "hover-effect-dark-theme-pointer-plus"
              : "hover-effect-light-theme-pointer-plus"
          }
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            flexBasis: "auto",
            boxSizing: "border-box",
            flexShrink: "0",
            margin: "0px",
            minHeight: "0px",
            minWidth: "0px",
            position: "relative",
            padding: "16px",
          }}
        >
          <div
            href=""
            style={{
              maxWidth: "100%",
              outlineStyle: "none",
              cursor: "pointer",
              flexGrow: "1",
              boxSizing: "border-box",
              display: "flex",
              flexBasis: "auto",
              flexDirection: "column",
              flexShrink: "0",
              listStyle: "none",
              margin: "0px",
              padding: "0px",
              minWidth: "0px",
              minHeight: "0px",
              position: "relative",
              textDecoration: "none",
              pointerEvents: "auto",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                flexGrow: "1",
                boxSizing: "border-box",
                flexBasis: "auto",
                flexShrink: "0",
                margin: "0px",
                padding: "0px",
                minWidth: "0px",
                minHeight: "0px",
                position: "relative",
                textDecoration: "none",
                pointerEvents: "auto",
                cursor: "pointer",
              }}
            >
              <svg
                style={{
                  marginRight: "24px",
                  userSelect: "none",
                  flexShrink: "0",
                  maxWidth: "100%",
                  position: "relative",
                  alignItems: "center",
                  display: "inline-block",
                  cursor: "pointer",
                  pointerEvents: "auto",
                }}
                fill={
                  themeName === "dark-theme"
                    ? "rgb(231,233,234)"
                    : "rgb(15, 20, 25)"
                }
                width={24}
                height={24}
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-18jsvk2 r-1q142lx r-1kihuf0 r-1472mwg r-di8nfa r-lrsllp"
                data-testid="icon"
              >
                <g>
                  <path d="M4 4.5C4 3.12 5.12 2 6.5 2h11C18.88 2 20 3.12 20 4.5v15c0 1.38-1.12 2.5-2.5 2.5h-11C5.12 22 4 20.88 4 19.5V16h2v3.5c0 .28.22.5.5.5h11c.28 0 .5-.22.5-.5v-15c0-.28-.22-.5-.5-.5h-11c-.28 0-.5.22-.5.5V8H4V4.5zm6.95 3.04L15.42 12l-4.47 4.46-1.41-1.42L11.58 13H2v-2h9.58L9.54 8.96l1.41-1.42z"></path>
                </g>
              </svg>
              <div
                className={
                  themeName === "dark-theme"
                    ? "soft-grey-dark-theme-text-variant-1 chirp-bold-font"
                    : "very-dark-gray-light-theme-text-variant-1 chirp-bold-font"
                }
                style={{
                  textOverflow: "unset",
                  overflowWrap: "break-word",
                  maxWidth: "100%",
                  minWidth: "0px",
                  fontSize: font20.fontSize,
                  whiteSpace: "nowrap",
                  textAlign: "inherit",
                  flexGrow: "1",
                  lineHeight: "24px",
                  overflow: "hidden",
                  boxSizing: "border-box",
                  margin: "0px",
                  padding: "0px",
                  position: "relative",
                  listStyle: "none",
                  textDecoration: "none",
                }}
              >
                Log out
              </div>
            </div>
          </div>
        </div>
      )}
      {showLogoutSpinner ? (
        <>
          <Modal
            className="logout-modal-variant-parent-visible-mode-spinner"
            style={{
              backgroundColor:
                showLogoutSpinner && themeName !== "dark-theme"
                  ? "white"
                  : showLogoutSpinner && themeName === "dark-theme"
                  ? "black"
                  : "",
              zIndex: 99999,
            }}
            size="sm"
            centered={true}
            show={showLogoutModal}
          >
            {/* start to check  */}

            <Modal.Body
              style={{
                backgroundColor: themeName === "dark-theme" ? "black" : "white",
                border: "2px solid black !important",
              }}
              className="logout-modal-variant"
            >
              <LoadingSpinner
                strokeColor={"rgb(29, 155, 240)"}
              ></LoadingSpinner>
              <div
                className="mt-3 chirp-bold-font"
                style={{
                  color: themeName === "dark-theme" ? "#71767A" : "#536471",
                  letterSpacing: "-.5px",
                  fontSize: font15.fontSize,
                  lineHeight: font15.lineHeight,
                }}
              >
                Logging out
              </div>
            </Modal.Body>
          </Modal>
        </>
      ) : null}

      <Modal
        className={
          width <= 700
            ? `logout-modal-variant-parent-smaller-than-700 logout-modal-variant-parent-smaller-than-700-${themeName}`
            : `logout-modal-variant-parent logout-modal-variant-parent-${themeName}`
        }
        style={{
          backgroundColor:
            showLogoutModal && themeName !== "dark-theme"
              ? "#999999"
              : showLogoutModal && themeName === "dark-theme"
              ? "#232E36"
              : "",
          zIndex: 99999,
        }}
        size="sm"
        centered={true}
        show={showLogoutModal}
      >
        {/* start to check  */}

        <Modal.Body
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
          className="logout-modal-variant"
        >
          <svg
            style={{}}
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
          </svg>{" "}
          <div
            className="mt-2"
            style={{
              width: "89%",
            }}
          >
            <div
              className="mt-2 chirp-bold-font"
              style={{
                width: "100%",

                fontSize: font20.fontSize,
                lineHeight: font20.lineHeight,
                color: themeName === "dark-theme" ? "white" : "black",
              }}
            >
              Log out of C?
            </div>
            <div
              style={{
                fontSize: font15.fontSize,
                lineHeight: font15.lineHeight,
                color: themeName === "dark-theme" ? " #71767A" : "#536471",
              }}
              className="mt-2 chirp-regular-font"
            >
              You can always log back in at any time. If you just want to switch
              accounts, you can do that by adding an existing account.
            </div>
            <Button
              className={`login-button mt-4 next-btn ${themeName}-white-btn chirp-bold-font`}
              variant="dark"
              style={{
                width: "256px",
                height: "44px",
                color: themeName === "dark-theme" ? "black" : "white",
                backgroundColor:
                  themeName === "dark-theme" ? "white" : "#0f141a",
                fontSize: font15.fontSize,
                lineHeight: font15.lineHeight,
              }}
              onClick={() => handleLogout()}
            >
              Log out
            </Button>
            <Button
              onClick={() => setShowLogoutModal(false)}
              className={` forgot-password-btn ${themeName}-black-btn chirp-bold-font`}
              variant="light"
              style={{
                width: "256px",
                height: "44px",
                color: themeName === "dark-theme" ? "white" : "black",
                backgroundColor: themeName === "dark-theme" ? "black" : "white",
                fontSize: font15.fontSize,
                lineHeight: font15.lineHeight,
                position: "relative",
                top: "12px",
                marginBottom: `20px`,
              }}
            >
              Cancel
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      {contextHolder}
      {/* popover basic test start to check  */}
      {width > 1201 && (
        <PopupState variant="popover" popupId="demo-popup-popover">
          {(popupState) => (
            <div>
              <Stack
                {...bindTrigger(popupState)}
                className={`${
                  width <= 1440 && "mt-5"
                } stack-logout-navigation-parent stack-logout-navigation-parent-${themeName}`}
                style={{
                  borderRadius: "9999px",
                  cursor: "pointer",
                  width: "250px",
                  position: "relative",
                  marginTop: width > 1400 && "60px",
                }}
                direction="horizontal"
              >
                <div
                  style={{ position: "relative", left: "10px" }}
                  className="profile-img-and-svg"
                >
                  {/* start to check */}
                  {userInfo?.imageUrl?.slice(0, 3) !== "../" ? (
                    <div>
                      <img
                        className="profile-img logout-profile-img"
                        src={userInfo?.imageUrl}
                        width={40}
                        height={40}
                        alt=""
                        style={{
                          borderRadius: "50%",
                        }}
                      />
                    </div>
                  ) : (
                    <div>
                      <img
                        style={{
                          borderRadius: "50%",
                        }}
                        width="40"
                        height="40"
                        src="https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png"
                        alt=""
                      />
                    </div>
                  )}
                </div>
                {/* finish to check */}

                <div
                  className="p-2 responsive-logout"
                  style={{ position: "relative", left: "10px" }}
                >
                  <div>
                    <div
                      className="chirp-bold-font"
                      style={{
                        color: themeName === "dark-theme" ? "white" : "black",
                        fontSize: font15.fontSize,
                        lineHeight: font15.lineHeight,
                        textAlign: "left",
                        alignItems: "center",
                        width: "120px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        display: "block",
                      }}
                    >
                      <span
                        className={
                          themeName === "dark-theme"
                            ? "soft-grey-dark-theme-text-variant-1 chirp-bold-font"
                            : "very-dark-gray-light-theme-text-variant-1 chirp-bold-font"
                        }
                      >
                        {userInfo?.fullname}
                      </span>
                      {userInfo?.isPrivate && (
                        <span
                          style={{
                            marginLeft: "5px",
                          }}
                        >
                          <svg
                            fill={
                              themeName === "dark-theme" ? "#E6E9EA" : "#0F141A"
                            }
                            width={`${1.25}em`}
                            height={`${1.25}em`}
                            viewBox="0 0 24 24"
                            aria-label="Protected account"
                            role="img"
                            className="r-4qtqp9 r-yyyyoo r-1xvli5t r-bnwqim r-lrvibr r-m6rgpd r-3t4u6i r-18jsvk2 r-f9ja8p r-og9te1"
                            data-testid="icon-lock"
                          >
                            <g>
                              <path d="M17.5 7H17v-.25c0-2.76-2.24-5-5-5s-5 2.24-5 5V7h-.5C5.12 7 4 8.12 4 9.5v9C4 19.88 5.12 21 6.5 21h11c1.39 0 2.5-1.12 2.5-2.5v-9C20 8.12 18.89 7 17.5 7zM13 14.73V17h-2v-2.27c-.59-.34-1-.99-1-1.73 0-1.1.9-2 2-2 1.11 0 2 .9 2 2 0 .74-.4 1.39-1 1.73zM15 7H9v-.25c0-1.66 1.35-3 3-3 1.66 0 3 1.34 3 3V7z"></path>
                            </g>
                          </svg>
                        </span>
                      )}
                    </div>
                    <div
                      className="chirp-regular-font"
                      style={{
                        color:
                          themeName === "dark-theme"
                            ? "#71767A"
                            : "rgb(83, 100, 113)",
                        fontSize: font15.fontSize,
                        lineHeight: font15.lineHeight,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        width: "120px",
                        textAlign: "left",
                      }}
                    >
                      @{userInfo?.username}
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    position: "relative",
                    right: "12px",
                  }}
                  className="ms-auto responsive-logout"
                >
                  <svg
                    color={themeName === "dark-theme" ? "white" : ""}
                    fill="currentColor"
                    width={`${1.25}em`}
                    height={`${1.25}em`}
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="bi bi-three-dots none-backgroundColor logout-three-dots r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-1xvli5t r-1hdv0qi"
                  >
                    <g>
                      <path d="M3 12c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm9 2c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm7 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"></path>
                    </g>
                  </svg>
                </div>
              </Stack>
              {/* </Button>{" "} */}
              <Popover
                open={popupState.open}
                onClose={popupState.close}
                {...bindPopover(popupState)}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "center",
                }}
                transformOrigin={{
                  vertical: "bottom",
                  horizontal: "center",
                }}
                className={`${
                  themeName === "dark-theme"
                    ? "popover-material-ui-dark-theme"
                    : themeName !== "dark-theme"
                    ? "popover-material-ui-light-theme"
                    : "hideshowMessageDeletePopover "
                }`}
              >
                {" "}
                <div
                  style={{
                    height: width <= 700 ? "12%" : "50px",
                    width: "300px",
                  }}
                  className="logout-body"
                >
                  <div
                    className={`logout-popover logout-popover-${themeName}`}
                    onClick={() => {
                      handleOpenLogoutModal();
                      popupState.close();
                    }}
                    style={{
                      fontWeight: "700",
                      lineHeight: font15.lineHeight,
                      fontSize: font15.fontSize,
                      cursor: "pointer",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        marginLeft: "10px",
                        color: themeName === "dark-theme" ? "white" : "",
                        fontSize: font15.fontSize,
                        lineHeight: font15.lineHeight,
                      }}
                      className="chirp-bold-font"
                    >
                      Log out @{userInfo?.username}
                    </span>
                  </div>
                </div>
              </Popover>
            </div>
          )}
        </PopupState>
      )}

      {width <= 1201 && width > 500 && (
        <PopupState variant="popover" popupId="demo-popup-popover">
          {(popupState) => (
            <div
              style={{
                padding: "0px",
                margin: "0px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "84px",
              }}
            >
              <Button
                className={
                  themeName === "dark-theme"
                    ? "hover-home-dark-theme"
                    : "hover-home"
                }
                {...bindTrigger(popupState)}
                style={{
                  border: "none",
                  borderRadius: "50%",
                  height: "60px",
                  width: "60px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                variant="text"
              >
                <Stack
                  style={{
                    cursor: "pointer",
                    height: "50px",
                    width: "50px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  direction="horizontal"
                >
                  {/* start to check */}
                  {userInfo?.imageUrl?.slice(0, 3) !== "../" ? (
                    <img
                      src={userInfo?.imageUrl}
                      width={40}
                      height={40}
                      alt=""
                      style={{
                        borderRadius: "50%",
                      }}
                    />
                  ) : (
                    <img
                      style={{
                        borderRadius: "50%",
                      }}
                      width="40"
                      height="40"
                      src="https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png"
                      alt=""
                    />
                  )}

                  {/* finish to check */}
                </Stack>
              </Button>{" "}
              <Popover
                open={popupState.open}
                onClose={popupState.close}
                {...bindPopover(popupState)}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "center",
                }}
                transformOrigin={{
                  vertical: "bottom",
                  horizontal: "center",
                }}
                className={`${
                  themeName === "dark-theme"
                    ? "popover-material-ui-dark-theme"
                    : themeName !== "dark-theme"
                    ? "popover-material-ui-light-theme"
                    : "hideshowMessageDeletePopover "
                }`}
              >
                {" "}
                <div
                  style={{
                    height: width <= 700 ? "50px" : "50px",
                    width: "300px",
                  }}
                  className="logout-body"
                >
                  {/* settings icon finish to check  */}
                  <div
                    className={`logout-popover chirp-bold-font logout-popover-${themeName}`}
                    onClick={() => {
                      handleOpenLogoutModal();
                      popupState.close();
                    }}
                    style={{
                      fontWeight: "700",
                      fontSize: font15.fontSize,
                      lineHeight: font15.lineHeight,
                      cursor: "pointer",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        marginLeft: "10px",
                        color: themeName === "dark-theme" ? "white" : "",
                        fontSize: font15.fontSize,
                        lineHeight: font15.lineHeight,
                      }}
                      className="chirp-bold-font"
                    >
                      Log out @{userInfo?.username}
                    </span>
                  </div>
                </div>
              </Popover>
            </div>
          )}
        </PopupState>
      )}

      {/* popover basic test finish to check  */}
    </>
  );
}

export default LogoutModal;
