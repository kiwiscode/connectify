import { Col, Modal, Button } from "react-bootstrap";
import SettingsNavigation from "../../../../../../../components/SettingsNavigation/SettingsNavigation";
import { useAntdMessageHandler } from "../../../../../../../utils/useAntdMessageHandler";
import useWindowDimensions from "../../../../../../../hooks/getWindowDimensions";
import { ThemeContext } from "../../../../../../../context/ThemeContext";
import { UserContext } from "../../../../../../../context/UserContext";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../../../../../../../components/ui/LoadingSpinner";
import {
  FormControl,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
} from "@mui/material";
import axios from "axios";
import { NavigationHistoryContext } from "../../../../../../../context/NavigationHistoryContext";
import { useFontSizeHandler } from "../../../../../../../utils/useFontSizeHandler";

const API_URL = import.meta.env.VITE_APP_API_URL;

function Enable_Automated_Account() {
  const { contextHolder, showCustomMessage } = useAntdMessageHandler();
  const { width } = useWindowDimensions();
  const [{ theme, themeName }] = useContext(ThemeContext);
  const navigate = useNavigate();
  const { userInfo, getToken } = useContext(UserContext);

  const [showModal, setShowModal] = useState(true);
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

  const { navigationHistoryArray } = useContext(NavigationHistoryContext);

  const [
    multi_factor_authentication_input,
    setMulti_factor_authentication_input,
  ] = useState(null);

  const enable_automated_account_authentication = async () => {
    try {
      const response = await axios.post(
        `${API_URL}/enable_automated_account`,
        {
          multi_factor_authentication_input,
        },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      if (!response) {
        return;
      } else {
        setLoading(true);
        setTimeout(() => {
          setTabIndex(3);
        }, 300);
        setTimeout(() => {
          setLoading(false);
        }, 500);
      }
    } catch (error) {
      console.error("Error =>", error);
      if (error.response.status === 403) {
        setLoading(true);
        setTimeout(() => {
          setTabIndex(2);
        }, 300);
        setTimeout(() => {
          setLoading(false);
        }, 500);
      } else {
        showCustomMessage("Sorry, we could not find your account.", 6);
      }
    }
  };

  const emailRegex =
    /^[a-zA-Z0-9._%+-]+@(gmail|outlook|hotmail|yahoo|proton|zoho|mail|aol|yandex)\.(com|org|net|gov|edu|mil|co|info|de|co.uk|ca|me|tr|com.tr)$/;

  const phoneRegex =
    /^(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})$/;

  const handleEnableAutomatedAccount = async () => {
    try {
      const response = await axios.post(
        `${API_URL}/add_automated_account_to_user`,
        {
          automatedAccountAuthentication: multi_factor_authentication_input,
          password: passwordInput,
        },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      if (response) {
        navigate("/settings/account/automation");
      }
    } catch (error) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        showCustomMessage("Wrong password!", 4);
      }, 300);
      console.error("Error =>", error);
    }
  };
  const {
    getFontSizeAndLineHeight31,
    getFontSizeAndLineHeight26,
    getFontSizeAndLineHeight20,
    getFontSizeAndLineHeight15,
    getFontSizeAndLineHeight13,
  } = useFontSizeHandler();
  const font31 = getFontSizeAndLineHeight31();
  const font26 = getFontSizeAndLineHeight26();
  const font20 = getFontSizeAndLineHeight20();
  const font15 = getFontSizeAndLineHeight15();
  const font13 = getFontSizeAndLineHeight13();
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
            {tabIndex !== 2 && (
              <div
                onClick={() => {
                  navigate("/settings/account/automation");
                }}
                className={`arrow arrow-${themeName} mt-2`}
                style={{
                  position: "relative",
                  width: "36px",
                  height: " 36px",
                  borderRadius: "50%",
                  cursor: "pointer",
                  display: loading ? "none" : "flex",
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
                {/* <svg
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
              </svg> */}
              </div>
            )}
            <div
              style={{
                width: "100%",
                textAlign: "center",
                display: loading ? "none" : "flex",
                justifyContent: "center",
                position: "absolute",
                left: "0px",
                marginTop: tabIndex === 2 ? "8rem" : null,
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
            style={{
              padding: "0px",
              margin: "0px",
            }}
          >
            {!loading ? (
              <>
                {tabIndex === 1 ? (
                  <>
                    <div
                      className="mt-4"
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        width: "100%",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <div
                        style={{
                          fontSize: font31.fontSize,
                          lineHeight: font31.lineHeight,
                          paddingLeft: width <= 700 ? "32px" : "80px",
                          paddingRight: width <= 700 ? "32px" : "80px",
                        }}
                        className={
                          themeName === "dark-theme"
                            ? "chirp-bold-font soft-grey-dark-theme-text-variant-1"
                            : "chirp-bold-font very-dark-gray-light-theme-text-variant-1"
                        }
                      >
                        To get started, first enter your managing account phone,
                        email, or @username
                      </div>
                      <div
                        style={{
                          width: "100%",
                          paddingLeft: width <= 700 ? "32px" : "80px",
                          paddingRight: width <= 700 ? "32px" : "80px",
                        }}
                      >
                        {" "}
                        <TextField
                          autoFocus
                          className="mt-4"
                          id="outlined-basic"
                          label="Phone, email, or username"
                          variant="outlined"
                          value={multi_factor_authentication_input}
                          type="text"
                          onChange={(e) => {
                            setMulti_factor_authentication_input(
                              e.target.value
                            );
                          }}
                          style={{
                            width: "100%",
                            height: "58px",
                          }}
                          InputProps={{
                            style: {
                              color:
                                themeName === "dark-theme" ? "white" : "black",
                            },
                          }}
                          InputLabelProps={{
                            style: {
                              color:
                                themeName === "dark-theme" ? "#71767B" : "",
                            },
                          }}
                          sx={{
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
                            "& .Mui-focused input + fieldset": {
                              border: "2px solid #1d9bf0 !important",
                            },

                            "& .MuiInputLabel-shrink": {
                              color: "#1f9cf0 !important",
                            },
                          }}
                        />
                      </div>
                    </div>
                    <div
                      style={{
                        position: "absolute",
                        bottom: "20px",
                        width: "100%",
                        paddingLeft: width <= 700 ? "32px" : "80px",
                        paddingRight: width <= 700 ? "32px" : "80px",
                      }}
                    >
                      <Button
                        onClick={() => {
                          if (multi_factor_authentication_input?.length) {
                            enable_automated_account_authentication();
                          } else {
                            return false;
                          }
                        }}
                        style={{
                          width: "100%",
                          minHeight: "52px",
                          border: "none",
                          opacity: multi_factor_authentication_input?.length
                            ? "1"
                            : "0.5",
                        }}
                        className={
                          themeName === "dark-theme"
                            ? "background-hover-next-btn-dark-theme soft-grey-dark-theme-text-variant-1 chirp-bold-font"
                            : "background-hover-next-btn-light-theme very-dark-gray-light-theme-text-variant-1 chirp-bold-font"
                        }
                      >
                        <span>Next</span>
                      </Button>
                    </div>
                  </>
                ) : tabIndex === 2 ? (
                  <>
                    <div
                      style={{
                        maxWidth: "440px",
                        marginTop: "6rem",
                      }}
                    >
                      <div
                        style={{
                          fontSize: font26.fontSize,
                          lineHeight: font26.lineHeight,
                          maxWidth: "440px",
                          width: "100%",
                        }}
                        className={
                          themeName === "dark-theme"
                            ? "chirp-heavy-font soft-grey-dark-theme-text-variant-1"
                            : "chirp-heavy-font very-dark-gray-light-theme-text-variant-1"
                        }
                      >
                        Unable to connect accounts
                      </div>
                      <div
                        style={{
                          fontSize: font15.fontSize,
                          lineHeight: font15.lineHeight,
                          width: "100%",
                        }}
                        className={
                          themeName === "dark-theme"
                            ? "chirp-regular-font soft-grey-dark-theme-text-variant-2"
                            : "chirp-regular-font very-dark-gray-light-theme-text-variant-2"
                        }
                      >
                        Managing accounts must be different than the automated
                        account. Use a different account.
                      </div>
                    </div>{" "}
                    <div
                      className="mt-5"
                      style={{
                        width: "440px",
                      }}
                    >
                      <Button
                        onClick={() => {
                          setLoading(true);
                          setTimeout(() => {
                            navigate("/settings/account/automation");
                          }, 300);
                          setTimeout(() => {
                            setLoading(false);
                          }, 500);
                        }}
                        style={{
                          width: "100%",
                          minHeight: "52px",
                          border: "none",
                        }}
                        className={
                          themeName === "dark-theme"
                            ? "background-hover-next-btn-dark-theme soft-grey-dark-theme-text-variant-1 chirp-bold-font"
                            : "background-hover-next-btn-light-theme very-dark-gray-light-theme-text-variant-1 chirp-bold-font"
                        }
                      >
                        <span>Got it</span>
                      </Button>
                    </div>
                  </>
                ) : tabIndex === 3 ? (
                  <>
                    {" "}
                    <div
                      className="chirp-bold-font"
                      style={{
                        color: themeName === "dark-theme" ? "white" : "black",
                        display: "flex",
                        textAlign: "left",
                        width: "81.5%",
                        fontSize: font31.fontSize,
                        lineHeight: font31.lineHeight,
                      }}
                    >
                      Enter your password
                    </div>
                    <div
                      className="mt-5"
                      style={{
                        width: "81.5%",
                      }}
                    >
                      <TextField
                        style={{
                          width: "100%",
                          height: "60px",
                        }}
                        disabled
                        id="filled-disabled"
                        label={
                          <div
                            style={{
                              flexDirection: "column",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <div
                              style={{
                                fontSize: font13.fontSize,
                                position: "relative",
                                bottom: "5px",
                                color:
                                  themeName === "dark-theme" ? "#3C3F41" : "",
                              }}
                            >
                              {multi_factor_authentication_input.match(
                                emailRegex
                              )
                                ? `Email`
                                : multi_factor_authentication_input.match(
                                    phoneRegex
                                  )
                                ? `Phone`
                                : `Username`}
                            </div>
                            <div
                              style={{
                                position: "relative",
                                bottom: "5px",
                                color:
                                  themeName === "dark-theme" ? "#3C3F41" : "",
                              }}
                            >
                              {multi_factor_authentication_input.match(
                                emailRegex
                              )
                                ? `${multi_factor_authentication_input}`
                                : multi_factor_authentication_input.match(
                                    phoneRegex
                                  )
                                ? `${multi_factor_authentication_input}`
                                : `@${multi_factor_authentication_input}`}
                            </div>
                          </div>
                        }
                        variant="filled"
                        InputProps={{
                          disableUnderline: true,
                        }}
                        InputLabelProps={{
                          style: {
                            color: themeName === "dark-theme" ? "#71767B" : "",
                          },
                        }}
                        sx={{
                          "& .MuiFilledInput-root": {
                            background:
                              themeName === "dark-theme"
                                ? "#0D0E11 !important"
                                : "#f7f9fa !important",
                            height: "60px",
                          },
                        }}
                      />{" "}
                    </div>
                    <FormControl
                      className="mt-4"
                      sx={{
                        m: 1,
                        width: "81.5%",
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
                          color: themeName === "dark-theme" ? "white" : "black",
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
                        onChange={(e) => {
                          setPasswordInput(e.target.value);
                        }}
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
                                    : `rgb(15, 20, 25)`
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
                                    : `rgb(15, 20, 25)`
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
                    <Button
                      style={{
                        position: "absolute",
                        bottom: "20px",
                        width: "81.5%",
                        height: "52px",
                        opacity: passwordInput.length ? "1" : "0.5",
                      }}
                      onClick={() => handleEnableAutomatedAccount()}
                      className={`login-button ${themeName}-white-btn chirp-bold-font`}
                      variant="dark"
                    >
                      Log in
                    </Button>
                  </>
                ) : null}
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
        <div
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
                Connect a managing account so your automated account receives an
                automated account label. All automated accounts must be
                connected to a managing account.{" "}
                <span className="hover-blue-underline">Learn more</span>
              </div>
            </div>
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
              class="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-14j79pv r-1q142lx r-2dysd3"
            >
              <g>
                <path d="M14.586 12L7.543 4.96l1.414-1.42L17.414 12l-8.457 8.46-1.414-1.42L14.586 12z"></path>
              </g>
            </svg>
          </div>
        </div>
      </Col>
    </>
  );
}

export default Enable_Automated_Account;
