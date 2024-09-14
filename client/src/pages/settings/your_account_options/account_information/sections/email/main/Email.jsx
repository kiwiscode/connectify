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
import { useFontSizeHandler } from "../../../../../../../utils/useFontSizeHandler";

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
      {" "}
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
            className="chirp-regular-font"
            style={{
              position: "absolute",
              top: "10%",
              left: "6%",
              fontSize: font13.fontSize,
              lineHeight: font13.lineHeight,
              minWidth: "fit-content",
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
              ? "dark-theme-stylish-blue-background-color chirp-regular-font"
              : "light-theme-stylish-blue-background-color chirp-regular-font"
          }
          style={{
            padding: "16px",
            textAlign: "center",
            color: "rgb(29, 155, 240)",
            fontSize: font15.fontSize,
            lineHeight: font15.lineHeight,
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
