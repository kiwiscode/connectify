import { Button, Col } from "react-bootstrap";
import SettingsNavigation from "../../../../../../components/SettingsNavigation/SettingsNavigation";
import { useAntdMessageHandler } from "../../../../../../utils/useAntdMessageHandler";
import useWindowDimensions from "../../../../../../hooks/getWindowDimensions";
import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../../../../../../context/ThemeContext";
import axios from "axios";
import { UserContext } from "../../../../../../context/UserContext";
import { useNavigate } from "react-router-dom";
import { useFontSizeHandler } from "../../../../../../utils/useFontSizeHandler";
const API_URL = import.meta.env.VITE_APP_API_URL;

function DownloadYourDataMain() {
  const { contextHolder, showCustomMessage } = useAntdMessageHandler();
  const { width } = useWindowDimensions();
  const [{ theme, themeName }] = useContext(ThemeContext);
  const { getToken } = useContext(UserContext);
  const [user, setUser] = useState([]);
  const navigate = useNavigate();
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

  const handleArchiveRequest = async () => {
    try {
      const response = await axios.post(
        `${API_URL}/user_archive_request`,
        {},
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      if (response) {
        refreshActiveUser();
        showCustomMessage(
          "We’ll let you know when your data is ready to download",
          6
        );
      }
    } catch (error) {
      console.error("Error occured =>", error);
    }
  };

  useEffect(() => {
    refreshActiveUser();
  }, []);
  const {
    getFontSizeAndLineHeight20,
    getFontSizeAndLineHeight15,
    getFontSizeAndLineHeight14,
    getFontSizeAndLineHeight13,
  } = useFontSizeHandler();
  const font20 = getFontSizeAndLineHeight20();
  const font15 = getFontSizeAndLineHeight15();
  const font14 = getFontSizeAndLineHeight14();
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
            Download an archive of your data
          </div>
        </div>{" "}
        <div
          className={
            themeName === "dark-theme"
              ? "mt-4 chirp-regular-font soft-grey-dark-theme-text-variant-2"
              : "mt-4 chirp-regular-font very-dark-gray-light-theme-text-variant-2"
          }
          style={{
            paddingLeft: "16px",
            fontSize: font13.fontSize,
            lineHeight: font13.lineHeight,
          }}
        >
          Get insights into the type of information stored for your account.
        </div>
        <div
          className={
            themeName === "dark-theme"
              ? "mt-4 chirp-bold-font soft-grey-dark-theme-text-variant-1"
              : "mt-4 chirp-bold-font very-dark-gray-light-theme-text-variant-1"
          }
          style={{
            paddingLeft: "16px",
            fontSize: font20.fontSize,
            lineHeight: font20.lineHeight,
          }}
        >
          C data{" "}
        </div>
        <div
          className={
            themeName === "dark-theme"
              ? "mt-4 chirp-regular-font soft-grey-dark-theme-text-variant-2"
              : "mt-4 chirp-regular-font very-dark-gray-light-theme-text-variant-2"
          }
          style={{
            paddingLeft: "16px",
            fontSize: font13.fontSize,
            lineHeight: font13.lineHeight,
          }}
        >
          You can request a ZIP file with an archive of your account
          information, account history, apps and devices, account activity,
          interests, and Ads data. You’ll get an in-app notification when the
          archive of your data is ready to download.{" "}
          <span className="hover-blue-underline">Learn more</span>
        </div>
        <div
          className="mt-4"
          style={{
            paddingLeft: "16px",
            display: "flex",
            justifyContent: "space-between",
            paddingRight: "16px",
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
                  ? " chirp-regular-font soft-grey-dark-theme-text-variant-1"
                  : "chirp-regular-font very-dark-gray-light-theme-text-variant-1"
              }
              style={{
                fontSize: font15.fontSize,
                lineHeight: font15.lineHeight,
              }}
            >
              C
            </div>
            {user.archive_request && (
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
                  We received your request. To protect your account, it can take
                  24 hours or longer for your data to be ready.
                </div>
              </div>
            )}
          </div>
          <div>
            <Button
              onClick={() => {
                if (!user.archive_request) {
                  handleArchiveRequest();
                }
              }}
              style={{
                outlineStyle: "none",
                border: "none",
                maxWidth: "146px",
                maxHeight: "32px",
                fontSize: font14.fontSize,
                lineHeight: font14.lineHeight,
                opacity: user.archive_request ? "0.5" : "",
                cursor: user.archive_request ? "default" : "pointer",
              }}
              className={
                user.archive_request
                  ? "chirp-bold-font blue-btn-disabled"
                  : "chirp-bold-font blue-btn"
              }
            >
              Request archive
            </Button>
          </div>
        </div>
        <div
          className="mt-3"
          style={{
            textAlign: "right",
            borderTop:
              themeName !== "dark-theme"
                ? "1px solid rgba(0, 0, 0, 0.1)"
                : // : "0.1px solid rgb(70, 70, 70)",
                  "1px solid rgb(70, 70, 70)",

            width: "100%",
          }}
        ></div>{" "}
        <div
          className={
            themeName === "dark-theme"
              ? "mt-3 chirp-bold-font soft-grey-dark-theme-text-variant-1"
              : "mt-3 chirp-bold-font very-dark-gray-light-theme-text-variant-1"
          }
          style={{
            paddingLeft: "16px",
            fontSize: font20.fontSize,
            lineHeight: font20.lineHeight,
          }}
        >
          Periscope data
        </div>
        <a
          href="https://www.pscp.tv/account/your-data"
          className={
            themeName === "dark-theme"
              ? "mt-4 has-children-dark-theme_sub"
              : "mt-4 has-children-light-theme_sub"
          }
          style={{
            cursor: "pointer",
            display: "flex",
            padding: "12px 16px",
            justifyContent: "space-between",
            textDecoration: "none",
          }}
        >
          <div
            style={{
              fontSize: font15.fontSize,
              lineHeight: font15.lineHeight,
            }}
            className={
              themeName === "dark-theme"
                ? "chirp-regular-font soft-grey-dark-theme-text-variant-2"
                : "chirp-regular-font very-dark-gray-light-theme-text-variant-2"
            }
          >
            You can request an archive of your Periscope data on Periscope
            directly.
          </div>
          <div
            style={{
              display: "flex",
            }}
          >
            <svg
              fill={themeName === "dark-theme" ? "#e1e3e4" : "#3f4347"}
              width={`${1.25}em`}
              height={`${1.25}em`}
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-14j79pv r-1q142lx r-2dysd3"
            >
              <g>
                <path d="M8 6h10v10h-2V9.41L5.957 19.46l-1.414-1.42L14.586 8H8V6z"></path>
              </g>
            </svg>
          </div>
        </a>
      </Col>
    </>
  );
}

export default DownloadYourDataMain;
