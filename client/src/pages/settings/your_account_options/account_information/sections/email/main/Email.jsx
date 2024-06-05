import { Col, Modal, Button } from "react-bootstrap";
import SettingsNavigation from "../../../../../../../components/SettingsNavigation/SettingsNavigation";
import { useAntdMessageHandler } from "../../../../../../../utils/useAntdMessageHandler";
import useWindowDimensions from "../../../../../../../hooks/getWindowDimensions";
import { ThemeContext } from "../../../../../../../context/ThemeContext";
import { UserContext } from "../../../../../../../context/UserContext";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FormControl,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import axios from "axios";
import { NavigationHistoryContext } from "../../../../../../../context/NavigationHistoryContext";

// when working on local version
const API_URL = "http://localhost:3000";

// when working on deployment version
// ?

function Email() {
  const { contextHolder, showCustomMessage } = useAntdMessageHandler();
  const { width } = useWindowDimensions();
  const [{ theme, themeName }] = useContext(ThemeContext);
  const navigate = useNavigate();
  const { userInfo, getToken } = useContext(UserContext);

  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tabIndex, setTabIndex] = useState(1);
  const [passwordInput, setPasswordInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (e) => {
    e.preventDefault();
  };
  const handleTabIndexState = () => {
    setTabIndex(tabIndex + 1);
  };
  const handlePasswordConfirmation = () => {
    axios
      .post(`${API_URL}/auth/password-check`, {
        verifyPasswordInput: passwordInput,
        userId: userInfo._id,
      })
      .then(() => {
        setLoading(true);
        setTimeout(() => {
          setLoading(false);
          handleTabIndexState();
        }, 300);
      })
      .catch(() => {
        showCustomMessage("Wrong password!");
      });
  };

  const [user, setUser] = useState([]);

  const refreshActiveUser = () => {
    axios
      .get(`${API_URL}/profile`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
      .then((response) => {
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

  console.log("Navigation history =>", navigationHistoryArray);

  return (
    <>
      {" "}
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
          dialogClassName={
            width < 700
              ? "modal-fullscreen modal_center_with_width"
              : "modal_center_with_width"
          }
          show={showModal}
          centered={true}
          contentClassName={
            themeName === "dark-theme"
              ? "dark-theme-sub-modal settings-modal-type"
              : "settings-modal-type"
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
              display: tabIndex === 2 && !loading ? "" : "none",
            }}
          >
            <div
              className={`close-button close-button-${themeName}`}
              style={{
                display: " flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                cursor: "pointer",
              }}
            >
              <svg
                width={20}
                height={20}
                color={themeName === "dark-theme" ? "white" : `rgb(15,20,25)`}
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-z80fyv r-19wmn03"
              >
                <g>
                  <path d="M10.59 12L4.54 5.96l1.42-1.42L12 10.59l6.04-6.05 1.42 1.42L13.41 12l6.05 6.04-1.42 1.42L12 13.41l-6.04 6.05-1.42-1.42L10.59 12z"></path>
                </g>
              </svg>

              {/* close signin modal icon finish to check  */}
            </div>{" "}
          </Modal.Header>

          <Modal.Body
            className={tabIndex === 2 ? "mt-5" : null}
            style={{
              padding: "0px",
              margin: "0px",
            }}
          >
            {!loading ? (
              <>
                {tabIndex === 1 ? (
                  <>
                    <div className="icon">
                      <div
                        style={{
                          position: "relative",
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
                              filter:
                                "drop-shadow(0 0 10px rgba(0, 0, 0, 0.5))",
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

                    <div
                      style={{
                        paddingLeft: "80px",
                        paddingRight: "80px",
                        width: "100%",
                      }}
                    >
                      <div
                        style={{
                          fontSize: width < 700 ? "26px" : "31px",
                          lineHeight: "36px",
                        }}
                        className={
                          themeName === "dark-theme"
                            ? "soft-grey-dark-theme-text-variant-1 chirp-bold-font mt-2"
                            : "very-dark-gray-light-theme-text-variant-1 chirp-bold-font mt-2"
                        }
                      >
                        Verify your password
                      </div>
                      <div
                        style={{
                          fontSize: "15px",
                          lineHeight: "20px",
                        }}
                        className={
                          themeName === "dark-theme"
                            ? "soft-grey-dark-theme-text-variant-2 chirp-regular-font mt-2"
                            : "very-dark-gray-light-theme-text-variant-2  chirp-regular-font mt-2"
                        }
                      >
                        Re-enter your C password to continue.
                      </div>
                      <FormControl
                        sx={{
                          marginTop: "2rem",
                          width: "100%",
                        }}
                        variant="outlined"
                      >
                        <InputLabel
                          sx={{
                            color: themeName === "dark-theme" ? "white" : "",
                            "&.MuiInputLabel-shrink": {
                              color: "#1f9cf0 !important",
                            },
                          }}
                          htmlFor="outlined-adornment-password"
                        >
                          Password
                        </InputLabel>
                        <OutlinedInput
                          autoFocus
                          sx={{
                            color:
                              themeName === "dark-theme" ? "white" : "black",
                            "& .MuiOutlinedInput-notchedOutline": {
                              borderColor:
                                themeName === "dark-theme"
                                  ? "rgb(70, 70, 70)"
                                  : "#cfd9de !important",
                              border:
                                themeName === "dark-theme"
                                  ? "1px solid rgb(70, 70, 70) !important"
                                  : "",
                            },
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                              border: "2px solid #1d9bf0 !important",
                            },
                          }}
                          onChange={(e) => setPasswordInput(e.target.value)}
                          value={passwordInput}
                          id="outlined-adornment-password"
                          type={showPassword ? "text" : "password"}
                          endAdornment={
                            <InputAdornment position="end">
                              {showPassword ? (
                                <svg
                                  onClick={handleClickShowPassword}
                                  onMouseDown={handleMouseDownPassword}
                                  style={{
                                    cursor: "pointer",
                                  }}
                                  color={
                                    themeName === "dark-theme"
                                      ? "white"
                                      : "rgb(15, 20, 25)"
                                  }
                                  fill="currentColor"
                                  width={22}
                                  height={22}
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-18yzcnr r-yc9v9c"
                                >
                                  <g>
                                    <path d="M3.693 21.707l-1.414-1.414 2.429-2.429c-2.479-2.421-3.606-5.376-3.658-5.513l-.131-.352.131-.352c.133-.353 3.331-8.648 10.937-8.648 2.062 0 3.989.621 5.737 1.85l2.556-2.557 1.414 1.414L3.693 21.707zm-.622-9.706c.356.797 1.354 2.794 3.051 4.449l2.417-2.418c-.361-.609-.553-1.306-.553-2.032 0-2.206 1.794-4 4-4 .727 0 1.424.192 2.033.554l2.263-2.264C14.953 5.434 13.512 5 11.986 5c-5.416 0-8.258 5.535-8.915 7.001zM11.986 10c-1.103 0-2 .897-2 2 0 .178.023.352.067.519l2.451-2.451c-.167-.044-.341-.067-.519-.067zm10.951 1.647l.131.352-.131.352c-.133.353-3.331 8.648-10.937 8.648-.709 0-1.367-.092-2-.223v-2.047c.624.169 1.288.27 2 .27 5.415 0 8.257-5.533 8.915-7-.252-.562-.829-1.724-1.746-2.941l1.438-1.438c1.53 1.971 2.268 3.862 2.33 4.027z"></path>
                                  </g>
                                </svg>
                              ) : (
                                <svg
                                  onClick={handleClickShowPassword}
                                  onMouseDown={handleMouseDownPassword}
                                  style={{
                                    cursor: "pointer",
                                  }}
                                  width={22}
                                  height={22}
                                  color={
                                    themeName === "dark-theme"
                                      ? "white"
                                      : "rgb(15, 20, 25)"
                                  }
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-18yzcnr r-yc9v9c"
                                >
                                  <g>
                                    <path d="M12 21c-7.605 0-10.804-8.296-10.937-8.648L.932 12l.131-.352C1.196 11.295 4.394 3 12 3s10.804 8.296 10.937 8.648l.131.352-.131.352C22.804 12.705 19.606 21 12 21zm-8.915-9c.658 1.467 3.5 7 8.915 7s8.257-5.533 8.915-7c-.658-1.467-3.5-7-8.915-7s-8.257 5.533-8.915 7zM12 16c-2.206 0-4-1.794-4-4s1.794-4 4-4 4 1.794 4 4-1.794 4-4 4zm0-6c-1.103 0-2 .897-2 2s.897 2 2 2 2-.897 2-2-.897-2-2-2z"></path>
                                  </g>
                                </svg>
                              )}
                            </InputAdornment>
                          }
                          label="Password"
                        />
                      </FormControl>
                    </div>
                    <div
                      style={{
                        paddingLeft: "80px",
                        paddingRight: "80px",
                        width: "100%",
                        position: "absolute",
                        bottom: "20px",
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <Button
                        className={
                          !passwordInput.length && themeName === "dark-theme"
                            ? "background-hover-cancel-btn-dark-theme"
                            : !passwordInput.length &&
                              themeName !== "dark-theme"
                            ? "background-hover-cancel-btn-light-theme"
                            : passwordInput.length && themeName === "dark-theme"
                            ? "background-hover-next-btn-dark-theme"
                            : passwordInput.length && themeName !== "dark-theme"
                            ? "background-hover-next-btn-light-theme"
                            : null
                        }
                        onClick={() => {
                          if (passwordInput.length) {
                            handlePasswordConfirmation();
                          } else {
                            navigate("/settings/account");
                          }
                        }}
                        style={{
                          width: "100%",
                          minHeight: "52px",
                          paddingLeft: "80px",
                          paddingRight: "80px",
                          color:
                            !passwordInput.length && themeName === "dark-theme"
                              ? "white"
                              : !passwordInput.length &&
                                themeName !== "dark-theme"
                              ? "black"
                              : passwordInput.length &&
                                themeName === "dark-theme"
                              ? "black"
                              : passwordInput.length &&
                                themeName !== "dark-theme"
                              ? "white"
                              : null,
                          backgroundColor:
                            !passwordInput.length && themeName === "dark-theme"
                              ? "black"
                              : !passwordInput.length &&
                                themeName !== "dark-theme"
                              ? "white"
                              : passwordInput.length &&
                                themeName === "dark-theme"
                              ? "white"
                              : passwordInput.length &&
                                themeName !== "dark-theme"
                              ? "black"
                              : null,
                          border:
                            themeName !== "dark-theme"
                              ? "1px solid rgba(0, 0, 0, 0.1)"
                              : // : "0.1px solid rgb(70, 70, 70)",
                                "1px solid rgb(70, 70, 70)",
                        }}
                      >
                        {passwordInput.length
                          ? "Next"
                          : !passwordInput.length
                          ? "Cancel"
                          : null}
                      </Button>
                    </div>
                  </>
                ) : tabIndex === 2 ? (
                  <>
                    <div className="icon">
                      <div
                        style={{
                          position: "relative",
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
                              filter:
                                "drop-shadow(0 0 10px rgba(0, 0, 0, 0.5))",
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

                    <div
                      style={{
                        paddingLeft: "80px",
                        paddingRight: "80px",
                        width: "100%",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "26px",
                          lineHeight: "36px",
                        }}
                        className={
                          themeName === "dark-theme"
                            ? "soft-grey-dark-theme-text-variant-1 chirp-bold-font mt-4"
                            : "very-dark-gray-light-theme-text-variant-1 chirp-bold-font mt-4"
                        }
                      >
                        Verify it’s you
                      </div>
                      <div
                        style={{
                          fontSize: "15px",
                          lineHeight: "20px",
                        }}
                        className={
                          themeName === "dark-theme"
                            ? "soft-grey-dark-theme-text-variant-2 chirp-regular-font mt-2"
                            : "very-dark-gray-light-theme-text-variant-2  chirp-regular-font mt-2"
                        }
                      >
                        Help us keep your data safe. To verify your identity, we
                        need to
                      </div>
                      <div
                        className={
                          themeName === "dark-theme"
                            ? "soft-grey-dark-theme-text-variant-2 chirp-regular-font"
                            : "very-dark-gray-light-theme-text-variant-2  chirp-regular-font"
                        }
                      >
                        {" "}
                        send you a verification code to{" "}
                        <span>{userInfo.email.slice(0, 2)}</span>{" "}
                        **********@gmail.com.
                      </div>
                    </div>
                    <div
                      className="mt-5"
                      style={{
                        paddingLeft: "80px",
                        paddingRight: "80px",
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <Button
                        className={
                          themeName === "dark-theme"
                            ? "background-hover-cancel-btn-dark-theme soft-grey-dark-theme-text-variant-1"
                            : "background-hover-cancel-btn-light-theme very-dark-gray-light-theme-text-variant-1"
                        }
                        onClick={() => {
                          sendEmailVerificationCode(userInfo.email);
                        }}
                        style={{
                          width: "100%",
                          minHeight: "52px",
                          paddingLeft: "80px",
                          paddingRight: "80px",
                          color: themeName === "dark-theme" ? "" : "",
                          backgroundColor: "transparent",
                          border: "none",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            padding: "0px",
                            margin: "0px",
                          }}
                        >
                          <span
                            style={{
                              textOverflow: "unset",
                              borderBottom:
                                themeName !== "dark-theme"
                                  ? "2px solid #0F141A"
                                  : // : "0.1px solid rgb(70, 70, 70)",
                                    "2px solid #EFF3F4",
                            }}
                          >
                            {" "}
                            <span>Send code</span>
                          </span>
                        </div>
                      </Button>
                    </div>
                  </>
                ) : null}
              </>
            ) : (
              <>
                <div
                  style={{
                    fontSize: "15px",
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
            className={
              themeName === "dark-theme"
                ? "mt-2 first-head chirp-bold-font soft-grey-dark-theme-text-variant-1"
                : "mt-2 first-head chirp-bold-font very-dark-gray-light-theme-text-variant-1"
            }
          >
            Change email
          </div>
        </div>{" "}
        <div
          style={{
            padding: "0px 24px",
            position: "relative",
          }}
        >
          {" "}
          <div
            style={{
              position: "absolute",
              top: "10%",
              left: "6%",
              fontSize: "12px",
              lineHeight: "18px",
              fontWeight: "400",
              minWidth: "fit-content",
              //   width: "80%",
              color:
                themeName === "dark-theme" ? "#383B3D" : "rgb(168,177,184)",
              zIndex: 9999,
            }}
          >
            Current
          </div>
          <div
            className={"mt-3"}
            type="text"
            style={{
              height: "56px",
              width: "100%",
              borderRadius: "4px",
              backgroundColor:
                themeName === "dark-theme" ? "#111214" : "rgb(248,249,250)",
            }}
          />
          <input
            type="text"
            defaultValue={user.email}
            style={{
              height: "50px",
              position: "absolute",
              top: "5%",
              left: "6%",
              width: "87%",
              minWidth: "fit-content",
              border: "none",
              outline: "none",
              paddingTop: "15px",
              textAlign: "left",
              paddingLeft: "0px",
              paddingRight: "0px",
              paddingBottom: "0px",
              backgroundColor: "transparent",
              color:
                themeName === "dark-theme" ? "#383B3D" : "rgb(168,177,184)",
            }}
          />
        </div>{" "}
        <div
          className="mt-4"
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
          onClick={() => {
            navigate("/i/flow/add_email");
          }}
          className={
            themeName === "dark-theme"
              ? "dark-theme-stylish-blue-background-color"
              : "light-theme-stylish-blue-background-color"
          }
          style={{
            padding: "16px",
            textAlign: "center",
            color: "rgb(29, 155, 240)",
            lineHeight: "20px",
            fontSize: "15px",
            fontWeight: "400",
            cursor: "pointer",
          }}
        >
          Update email address
        </div>
      </Col>
    </>
  );
}

export default Email;
