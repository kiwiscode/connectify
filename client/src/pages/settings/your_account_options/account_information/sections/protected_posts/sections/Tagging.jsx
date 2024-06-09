import { Button, Col, Modal } from "react-bootstrap";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAntdMessageHandler } from "../../../../../../../utils/useAntdMessageHandler";
import useWindowDimensions from "../../../../../../../hooks/getWindowDimensions";
import { ThemeContext } from "../../../../../../../context/ThemeContext";
import { UserContext } from "../../../../../../../context/UserContext";
import SettingsNavigation from "../../../../../../../components/SettingsNavigation/SettingsNavigation";
import { Switch } from "@mui/material";

// when working on local version
const API_URL = "http://localhost:3000";

// when working on deployment version
// ?

function Tagging() {
  const { contextHolder } = useAntdMessageHandler();
  const { width } = useWindowDimensions();
  const [{ theme, themeName }] = useContext(ThemeContext);
  const navigate = useNavigate();
  const { userInfo, getToken, updateUser } = useContext(UserContext);

  const [checked, setChecked] = useState(true);
  const handleChange = (event) => {
    setChecked(event.target.checked);
  };

  const [permission_option, setPermission_option] = useState("");

  const togglePhotoTaggingPermission = async () => {
    try {
      const response = await axios.post(
        `${API_URL}/toggle_photo_tagging_permission`,
        { permission_option },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      console.log("Response =>", response);
      if (response) {
        updateUser({
          photoTaggingPermission: response.data.user.photoTaggingPermission,
        });
      }
    } catch (error) {
      console.error("Error =>", error);
    }
  };

  useEffect(() => {
    togglePhotoTaggingPermission();
  }, [permission_option]);

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
        <div className="settings-header-with-arrow">
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
            className={
              themeName === "dark-theme"
                ? "mt-2 first-head chirp-bold-font soft-grey-dark-theme-text-variant-1"
                : "mt-2 first-head chirp-bold-font very-dark-gray-light-theme-text-variant-1"
            }
          >
            Photo tagging
          </div>
        </div>{" "}
        <div
          className="mt-3"
          style={{
            paddingLeft: "16px",
            paddingRight: "16px",
            display: "flex",
            justifyContent: "space-between",
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
                fontSize: "15px",
                lineHeight: "20px",
              }}
              className={
                themeName === "dark-theme"
                  ? "chirp-bold-font soft-grey-dark-theme-text-variant-1"
                  : "chirp-bold-font very-dark-gray-light-theme-text-variant-1"
              }
            >
              Photo tagging
            </div>
            <div
              className={
                themeName === "dark-theme"
                  ? "text-dark-theme "
                  : "text-light-theme "
              }
              style={{
                fontSize: "13px",
                lineHeight: "16px",
                fontWeight: "400",
              }}
            >
              Allow people to tag you in their photos and receive notifications
              when they do so.
            </div>
          </div>
          <div>
            <Switch
              checked={checked}
              onChange={handleChange}
              inputProps={{ "aria-label": "controlled" }}
            />
          </div>
        </div>
        {checked && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              paddingLeft: "16px",
              paddingRight: "16px",
            }}
          >
            <div
              className="mt-3"
              style={{
                borderTop:
                  themeName !== "dark-theme"
                    ? "1px solid rgba(0, 0, 0, 0.1)"
                    : // : "0.1px solid rgb(70, 70, 70)",
                      "1px solid rgb(70, 70, 70)",
              }}
            ></div>
            <div
              onClick={() => setPermission_option("Anyone can tag you")}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
              className="mt-3"
            >
              <div
                style={{
                  fontSize: "15px",
                  lineHeight: "20px",
                }}
              >
                Anyone can tag you
              </div>
              <div>
                {" "}
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    cursor: "pointer",
                    position: "relative",
                  }}
                  className={
                    themeName === "dark-theme" &&
                    userInfo.photoTaggingPermission === "Anyone can tag you"
                      ? "hover-background-effect-clicked-dark-theme ms-auto"
                      : themeName !== "dark-theme" &&
                        userInfo.photoTaggingPermission === "Anyone can tag you"
                      ? "hover-background-effect-clicked-light-theme ms-auto"
                      : themeName === "dark-theme" &&
                        userInfo.photoTaggingPermission !== "Anyone can tag you"
                      ? "hover-background-effect-dark-theme ms-auto"
                      : themeName !== "dark-theme" &&
                        userInfo.photoTaggingPermission !== "Anyone can tag you"
                      ? "hover-background-effect-light-theme ms-auto"
                      : ""
                  }
                >
                  <div
                    style={{
                      backgroundColor:
                        userInfo.photoTaggingPermission === "Anyone can tag you"
                          ? "#1d9bf0"
                          : "transparent",
                      border:
                        userInfo.photoTaggingPermission === "Anyone can tag you"
                          ? "none"
                          : themeName !== "dark-theme"
                          ? "2px solid #71767A"
                          : "2px solid rgb(70, 70, 70)",
                      width: "20px",
                      height: "20px",
                      position: "relative",
                      left: "10px",
                      top: "10px",
                      borderRadius: "50%",
                    }}
                  >
                    <svg
                      style={{
                        position: "relative",
                        left: "2px",
                        bottom: "4px",
                        display:
                          userInfo.photoTaggingPermission ===
                          "Anyone can tag you"
                            ? "initial"
                            : "none",
                      }}
                      width={16}
                      height={16}
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-jwli3a r-1hjwoze r-12ym1je"
                      color="white"
                      fill="currentColor"
                    >
                      <g>
                        <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                      </g>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            <div
              onClick={() =>
                setPermission_option("Only people you follow can tag you")
              }
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  fontSize: "15px",
                  lineHeight: "20px",
                }}
              >
                Only people you follow can tag you
              </div>
              <div>
                {" "}
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    cursor: "pointer",
                    position: "relative",
                  }}
                  className={
                    themeName === "dark-theme" &&
                    userInfo.photoTaggingPermission ===
                      "Only people you follow can tag you"
                      ? "hover-background-effect-clicked-dark-theme ms-auto"
                      : themeName !== "dark-theme" &&
                        userInfo.photoTaggingPermission ===
                          "Only people you follow can tag you"
                      ? "hover-background-effect-clicked-light-theme ms-auto"
                      : themeName === "dark-theme" &&
                        userInfo.photoTaggingPermission !==
                          "Only people you follow can tag you"
                      ? "hover-background-effect-dark-theme ms-auto"
                      : themeName !== "dark-theme" &&
                        userInfo.photoTaggingPermission !==
                          "Only people you follow can tag you"
                      ? "hover-background-effect-light-theme ms-auto"
                      : ""
                  }
                >
                  <div
                    style={{
                      backgroundColor:
                        userInfo.photoTaggingPermission ===
                        "Only people you follow can tag you"
                          ? "#1d9bf0"
                          : "transparent",
                      border:
                        userInfo.photoTaggingPermission ===
                        "Only people you follow can tag you"
                          ? "none"
                          : themeName !== "dark-theme"
                          ? "2px solid #71767A"
                          : "2px solid rgb(70, 70, 70)",
                      width: "20px",
                      height: "20px",
                      position: "relative",
                      left: "10px",
                      top: "10px",
                      borderRadius: "50%",
                    }}
                  >
                    <svg
                      style={{
                        position: "relative",
                        left: "2px",
                        bottom: "4px",
                        display:
                          userInfo.photoTaggingPermission ===
                          "Only people you follow can tag you"
                            ? "initial"
                            : "none",
                      }}
                      width={16}
                      height={16}
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-jwli3a r-1hjwoze r-12ym1je"
                      color="white"
                      fill="currentColor"
                    >
                      <g>
                        <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                      </g>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Col>
    </>
  );
}

export default Tagging;
