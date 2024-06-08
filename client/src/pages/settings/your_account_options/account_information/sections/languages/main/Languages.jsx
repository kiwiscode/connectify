import { Col } from "react-bootstrap";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAntdMessageHandler } from "../../../../../../../utils/useAntdMessageHandler";
import useWindowDimensions from "../../../../../../../hooks/getWindowDimensions";
import { ThemeContext } from "../../../../../../../context/ThemeContext";
import { UserContext } from "../../../../../../../context/UserContext";
import SettingsNavigation from "../../../../../../../components/SettingsNavigation/SettingsNavigation";
import axios from "axios";
// when working on local version
const API_URL = "http://localhost:3000";

// when working on deployment version
// ?
function Languages() {
  const { contextHolder } = useAntdMessageHandler;
  const { width } = useWindowDimensions();
  const [{ theme, themeName }] = useContext(ThemeContext);
  const { userInfo, getToken } = useContext(UserContext);
  const navigate = useNavigate();
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
        {" "}
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
            className={
              themeName === "dark-theme"
                ? "mt-2 first-head chirp-bold-font soft-grey-dark-theme-text-variant-1"
                : "mt-2 first-head chirp-bold-font very-dark-gray-light-theme-text-variant-1"
            }
          >
            Languages
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
            fontSize: "13px",
            lineHeight: "16px",
          }}
        >
          Manage which languages are used to personalize your X experience.
        </div>
        <div
          className={
            themeName === "dark-theme"
              ? "soft-grey-dark-theme-text-variant-1 mt-4 chirp-bold-font"
              : "very-dark-gray-light-theme-text-variant-1 mt-4 chirp-bold-font"
          }
          style={{
            paddingLeft: "16px",
            fontSize: "20px",
            lineHeight: "24px",
          }}
        >
          Display language
        </div>
        <div
          className={
            themeName === "dark-theme"
              ? "soft-grey-dark-theme-text-variant-2 mt-4 chirp-regular-font"
              : "very-dark-gray-light-theme-text-variant-2 mt-4 chirp-regular-font"
          }
          style={{
            paddingLeft: "16px",
            fontSize: "13px",
            lineHeight: "16px",
          }}
        >
          Select your preferred language for headlines, buttons, and other text
          from C.
        </div>
        <div
          onClick={() => {
            navigate("/settings/language");
          }}
          className={
            themeName === "dark-theme"
              ? "dark-hover-effect mt-3"
              : "light-hover-effect mt-3"
          }
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "12px 16px",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "15px",
                lineHeight: "20px",
              }}
              className={
                themeName === "dark-theme"
                  ? "soft-grey-dark-theme-text-variant-1 chirp-regular-font"
                  : "very-dark-gray-light-theme-text-variant-1 chirp-regular-font"
              }
            >
              Display language
            </div>
            <div
              style={{
                fontSize: "13px",
                lineHeight: "16px",
              }}
              className={
                themeName === "dark-theme"
                  ? "soft-grey-dark-theme-text-variant-2 chirp-regular-font"
                  : "very-dark-gray-light-theme-text-variant-2 chirp-regular-font"
              }
            >
              {!user.displayLanguage ? "English" : user.displayLanguage}
            </div>
          </div>
          <div>
            <svg
              fill={themeName === "dark-theme" ? "#71767a" : "#536371"}
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
        <div
          className="mt-1"
          style={{
            borderBottom:
              themeName !== "dark-theme"
                ? "1px solid rgba(0, 0, 0, 0.1)"
                : // : "0.1px solid rgb(70, 70, 70)",
                  "1px solid rgb(70, 70, 70)",

            width: "100%",
          }}
        ></div>
        <div
          className={
            themeName === "dark-theme"
              ? "soft-grey-dark-theme-text-variant-1 mt-4 chirp-bold-font"
              : "very-dark-gray-light-theme-text-variant-1 mt-4 chirp-bold-font"
          }
          style={{
            paddingLeft: "16px",
            fontSize: "20px",
            lineHeight: "24px",
          }}
        >
          Select additional languages
        </div>
        <div
          className={
            themeName === "dark-theme"
              ? "soft-grey-dark-theme-text-variant-2 mt-4 chirp-regular-font"
              : "very-dark-gray-light-theme-text-variant-2 mt-4 chirp-regular-font"
          }
          style={{
            paddingLeft: "16px",
            fontSize: "13px",
            lineHeight: "16px",
          }}
        >
          Select additional languages for the content you want to see on C.
        </div>
        <div
          onClick={() => {
            navigate("/i/flow/language_selector");
          }}
          className={
            themeName === "dark-theme"
              ? "dark-hover-effect mt-3"
              : "light-hover-effect mt-3"
          }
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "12px 16px",
          }}
        >
          <div
            style={{
              fontSize: "15px",
              lineHeight: "20px",
            }}
            className={
              themeName === "dark-theme"
                ? "soft-grey-dark-theme-text-variant-1 chirp-regular-font"
                : "very-dark-gray-light-theme-text-variant-1 chirp-regular-font"
            }
          >
            Additional languages you speak
          </div>
          <div>
            <svg
              fill={themeName === "dark-theme" ? "#71767a" : "#536371"}
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
        <div
          className="mt-1"
          style={{
            borderBottom:
              themeName !== "dark-theme"
                ? "1px solid rgba(0, 0, 0, 0.1)"
                : // : "0.1px solid rgb(70, 70, 70)",
                  "1px solid rgb(70, 70, 70)",

            width: "100%",
          }}
        ></div>
        <div
          className={
            themeName === "dark-theme"
              ? "soft-grey-dark-theme-text-variant-1 mt-4 chirp-bold-font"
              : "very-dark-gray-light-theme-text-variant-1 mt-4 chirp-bold-font"
          }
          style={{
            paddingLeft: "16px",
            fontSize: "20px",
            lineHeight: "24px",
          }}
        >
          Languages you may know
        </div>{" "}
        <div
          className={
            themeName === "dark-theme"
              ? "soft-grey-dark-theme-text-variant-2 mt-4 chirp-regular-font"
              : "very-dark-gray-light-theme-text-variant-2 mt-4 chirp-regular-font"
          }
          style={{
            paddingLeft: "16px",
            fontSize: "13px",
            lineHeight: "16px",
          }}
        >
          Manage the languages C inferred based on your activity, such as the
          accounts you follow and the posts you engage with.
        </div>{" "}
        <div
          onClick={() => {
            navigate("/settings/your_twitter_data/language");
          }}
          className={
            themeName === "dark-theme"
              ? "dark-hover-effect mt-3"
              : "light-hover-effect mt-3"
          }
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "12px 16px",
          }}
        >
          <div
            style={{
              fontSize: "15px",
              lineHeight: "20px",
            }}
            className={
              themeName === "dark-theme"
                ? "soft-grey-dark-theme-text-variant-1 chirp-regular-font"
                : "very-dark-gray-light-theme-text-variant-1 chirp-regular-font"
            }
          >
            Languages you may know
          </div>
          <div>
            <svg
              fill={themeName === "dark-theme" ? "#71767a" : "#536371"}
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

export default Languages;
