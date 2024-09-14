import { useContext, useEffect, useRef, useState } from "react";
import { ThemeContext } from "../../../../../../context/ThemeContext";
import useWindowDimensions from "../../../../../../hooks/getWindowDimensions";
import { useAntdMessageHandler } from "../../../../../../utils/useAntdMessageHandler";
import { UserContext } from "../../../../../../context/UserContext";
import { useNavigate } from "react-router-dom";
import { Button, Col } from "react-bootstrap";
import SettingsNavigation from "../../../../../../components/SettingsNavigation/SettingsNavigation";
import {
  FormControl,
  InputLabel,
  OutlinedInput,
  TextField,
} from "@mui/material";
import axios from "axios";
import LoadingSpinner from "../../../../../../components/ui/LoadingSpinner";
import { useFontSizeHandler } from "../../../../../../utils/useFontSizeHandler";

const API_URL = import.meta.env.VITE_APP_API_URL;

function ScreenName() {
  const { width } = useWindowDimensions();
  const [{ theme, themeName }] = useContext(ThemeContext);
  const { contextHolder, showCustomMessage } = useAntdMessageHandler();
  const navigate = useNavigate();
  const { userInfo, getToken, updateUser } = useContext(UserContext);

  const [usernameDuplicateError, setusernameDuplicateError] = useState("");
  const [username, setUsername] = useState("");
  const [usernameValidated, setusernameValidated] = useState(false);
  const [inputFocus, setInputFocus] = useState(null);

  const inputRef = useRef(null);
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setInputFocus(false);
      }
    };

    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  const [nextButtonActive, setnextButtonActive] = useState(false);
  const [skipButtonActive, setskipButtonActive] = useState(true);

  const checkUsernameDuplicate = () => {
    if (username.length >= 4 || username.length <= 15) {
      setnextButtonActive(true);
      setskipButtonActive(false);
    } else {
      setnextButtonActive(true);
      setskipButtonActive(false);
    }

    axios
      .post(
        `${API_URL}/auth/username-check`,
        { username },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      )
      .then((response) => {
        console.log("Response =>", response);
        if (response.status === 200) {
          setusernameValidated(true);
          setnextButtonActive(true);
          setusernameDuplicateError("");
          console.log("Hello world !");
        } else {
          console.log("Hello world hahahahaha ! ");
        }
      })
      .catch((error) => {
        if (error.response.data.errorMessage && username.length) {
          console.log("Something went wrong during the process !");
          setnextButtonDisabled(true);
          setnextButtonActive(false);
          setusernameValidated(false);
          setusernameDuplicateError(error.response.data.errorMessage);
          if (
            error.response.data.errorMessage ===
            "Username must be at least 4 characters long."
          ) {
            setusernameDuplicateError(
              "Your username must be longer than 4 characters."
            );
          } else if (
            error.response.data.errorMessage ===
            "Username cannot exceed 15 characters."
          ) {
            setusernameDuplicateError(
              "Your username must be shorter than 15 characters."
            );
          } else if (
            error.response.data.errorMessage ===
            "Your username cannot contain spaces. Please choose a username without spaces."
          ) {
            setusernameDuplicateError(
              "Your username can only contain letters, numbers and '_'"
            );
          }
        } else {
          setskipButtonActive(true);
          setnextButtonDisabled(false);
          setnextButtonActive(false);
          setusernameValidated(false);
          setusernameDuplicateError("");
        }
      });
  };
  const [loading, setLoading] = useState(false);

  const changeUsername = () => {
    axios
      .post(
        `${API_URL}/auth/change-username`,
        { username, userId: userInfo._id },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      )
      .then((response) => {
        console.log("Response from server =>", response);
        updateUser({ username: username });
        setLoading(true);
        setTimeout(() => {
          setLoading(false);
          //   refreshLogoutUserName()
        }, 500);
      })
      .catch((error) => {
        console.log("Error =>", error);
      });
  };

  useEffect(() => {
    checkUsernameDuplicate();
  }, [username]);
  const [nextButtonDisabled, setnextButtonDisabled] = useState(false);
  const [user, setUser] = useState([]);

  const refreshActiveUser = () => {
    axios
      .get(`${API_URL}/profile`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
      .then((response) => {
        console.log("Response data =>", response.data.user);
        setUser(response.data.user);

        const userInfoRefreshed = response.data.user;
        localStorage.setItem("userInfo", JSON.stringify(userInfoRefreshed));
      })
      .catch((error) => {
        console.log("Error =>", error);
      });
  };

  useEffect(() => {
    refreshActiveUser();
  }, []);

  const {
    getFontSizeAndLineHeight20,
    getFontSizeAndLineHeight15,
    getFontSizeAndLineHeight13,
  } = useFontSizeHandler();
  const font20 = getFontSizeAndLineHeight20();
  const font15 = getFontSizeAndLineHeight15();
  const font13 = getFontSizeAndLineHeight13();

  return (
    <>
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
            Change username
          </div>
        </div>{" "}
        {loading ? (
          <div>
            <LoadingSpinner strokeColor={"rgb(29, 155, 240)"}></LoadingSpinner>
          </div>
        ) : (
          <>
            <div
              style={{
                padding: "0px 24px",
                position: "relative",
              }}
            >
              {" "}
              <div
                onFocus={() => setInputFocus(true)}
                onClick={() => setInputFocus(true)}
                className={
                  inputFocus
                    ? "shrink-color-change chirp-regular-font"
                    : "chirp-regular-font"
                }
                style={{
                  position: "absolute",
                  top: "10%",
                  left: "6%",
                  fontSize: font13.fontSize,
                  lineHeight: font13.lineHeight,
                  minWidth: "fit-content",
                  //   width: "80%",
                  color:
                    themeName === "dark-theme" && !usernameDuplicateError
                      ? "#71767A"
                      : themeName !== "dark-theme" && !usernameDuplicateError
                      ? "rgb(83, 100, 113)"
                      : usernameDuplicateError
                      ? "#f4222d"
                      : "",

                  zIndex: 9999,
                }}
              >
                Username
              </div>
              <div
                onClick={() => setInputFocus(true)}
                className={
                  inputFocus && !usernameDuplicateError
                    ? "custom-input mt-3"
                    : "mt-3"
                }
                type="text"
                style={{
                  height: "56px",
                  width: "100%",
                  borderRadius: "4px",
                  border: usernameDuplicateError
                    ? "2px solid rgb(244, 33, 46)"
                    : themeName === "dark-theme"
                    ? "1px solid rgb(70,70,70)"
                    : themeName !== "dark-theme"
                    ? "1px solid #cfd9de"
                    : "",
                }}
              />
              <input
                className="custom-input-init"
                ref={inputRef}
                onFocus={() => setInputFocus(true)}
                onClick={() => setInputFocus(true)}
                onChange={(e) => setUsername(e.target.value)}
                type="text"
                value={username.length > 0 ? username : null}
                defaultValue={userInfo.username}
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
                }}
              />
            </div>{" "}
            <span
              className="chirp-regular-font"
              style={{
                width: "100%",
                color: "#f4222d",
                fontSize: font13.fontSize,
                lineHeight: "20px",
                position: "relative",
                left: "30px",
              }}
            >
              {usernameDuplicateError}
            </span>
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
              className="mt-2 chirp-heavy-font"
              style={{
                padding: "0px 24px",
                fontSize: font20.fontSize,
                lineHeight: font20.lineHeight,
              }}
            >
              Suggestions
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
                textAlign: "right",
                width: "100%",
              }}
            >
              <Button
                variant="primary"
                style={{
                  height: "45px",
                  marginTop: "15px",
                  position: "relative",
                  right: "20px",
                  border: "none",
                  maxWidth: "69.17px",
                  maxHeight: "36px",
                  minHeight: "36px",
                  fontSize: font15.fontSize,
                  cursor:
                    usernameValidated && username.length
                      ? "pointer"
                      : "default",
                  opacity: !username.length ? "0.5" : null,
                }}
                onClick={username.length < 1 ? null : () => changeUsername()}
                className={
                  usernameValidated && username.length
                    ? "change-password-btn"
                    : "disabled-change-password-btn"
                }
              >
                Save
              </Button>
            </div>
          </>
        )}
      </Col>
    </>
  );
}

export default ScreenName;
