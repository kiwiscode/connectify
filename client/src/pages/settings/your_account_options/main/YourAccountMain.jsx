import { useContext } from "react";
import { Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import SettingsNavigation from "../../../../components/SettingsNavigation/SettingsNavigation";
import { ModalVisibilityContext } from "../../../../context/ModalVisibilityContext";
import ResponsiveNavigationBarBottom from "../../../../components/Navbar/ResponsiveNavigationBottom";
import { useAntdMessageHandler } from "../../../../utils/useAntdMessageHandler";
import useWindowDimensions from "../../../../hooks/getWindowDimensions";
import { ThemeContext } from "../../../../context/ThemeContext";
import { useFontSizeHandler } from "../../../../utils/useFontSizeHandler";

function YourAccountMain() {
  const [{ themeName }] = useContext(ThemeContext);
  const { width } = useWindowDimensions();

  const { contextHolder } = useAntdMessageHandler();

  const { isPostModalVisible } = useContext(ModalVisibilityContext);

  const navigate = useNavigate();

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
      {!isPostModalVisible && <ResponsiveNavigationBarBottom />}
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
          width:
            width > 1400
              ? "580px"
              : width <= 1400 && width > 1355
              ? "650px"
              : width <= 1355 && width > 1288
              ? "600px"
              : width <= 1288 && width > 1221
              ? "500px"
              : width <= 1221 && width > 1000
              ? "500px"
              : width <= 500
              ? "100%"
              : null,
          position: "relative",
          right: "10px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            paddingLeft: width <= 500 ? "32px" : "12px",
            paddingRight: width <= 500 ? "32px" : "12px",
          }}
        >
          {" "}
          {width <= 991 ? (
            <span
              onClick={() => {
                navigate("/settings");
              }}
              className={`arrow arrow-${themeName} mt-3`}
              style={{
                position: "relative",
                width: "30px",
                height: " 30px",
                borderRadius: "50%",
                cursor: "pointer",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginRight: "5px",
              }}
            >
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
            </span>
          ) : null}
          <div
            style={{
              fontSize: font20.fontSize,
              lineHeight: font20.lineHeight,
            }}
            className={
              themeName === "dark-theme"
                ? "soft-grey-dark-theme-text-variant-1 mt-3 chirp-bold-font"
                : "very-dark-gray-light-theme-text-variant-1 mt-3 chirp-bold-font"
            }
          >
            Your account
          </div>
        </div>
        <div
          className="mt-4 chirp-regular-font"
          style={{
            color: themeName === "dark-theme" ? "#71767A" : "rgb(83, 100, 113)",
            fontSize: font13.fontSize,
            lineHeight: font13.lineHeight,
            paddingLeft: width <= 500 ? "32px" : "12px",
            paddingRight: width <= 500 ? "32px" : "12px",
          }}
        >
          See information about your account, download an archive of your data,
          or learn about your account deactivation options
        </div>
        <div
          className="mt-4"
          style={{
            width: "100%",
            minWidth: "fit-content",
          }}
        >
          <div
            onClick={() => navigate("/settings/your_twitter_data/account")}
            className={
              themeName === "dark-theme"
                ? "has-children-dark-theme"
                : "has-children-light-theme"
            }
          >
            <div
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
              }}
            >
              <div
                className={
                  themeName === "dark-theme"
                    ? "settings-icon-dark-theme"
                    : "settings-icon-light-theme"
                }
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <g>
                    <path d="M5.651 19h12.698c-.337-1.8-1.023-3.21-1.945-4.19C15.318 13.65 13.838 13 12 13s-3.317.65-4.404 1.81c-.922.98-1.608 2.39-1.945 4.19zm.486-5.56C7.627 11.85 9.648 11 12 11s4.373.85 5.863 2.44c1.477 1.58 2.366 3.8 2.632 6.46l.11 1.1H3.395l.11-1.1c.266-2.66 1.155-4.88 2.632-6.46zM12 4c-1.105 0-2 .9-2 2s.895 2 2 2 2-.9 2-2-.895-2-2-2zM8 6c0-2.21 1.791-4 4-4s4 1.79 4 4-1.791 4-4 4-4-1.79-4-4z"></path>
                  </g>
                </svg>
              </div>
              <div
                style={{
                  paddingLeft: "16px",
                  width: "100%",
                }}
              >
                <div
                  style={{
                    fontSize: font15.fontSize,
                    lineHeight: font15.lineHeight,
                  }}
                  className={
                    themeName === "dark-theme"
                      ? "settings-text-first-exp-dark-theme chirp-regular-font"
                      : "settings-text-first-exp-light-theme chirp-regular-font"
                  }
                >
                  Account information
                </div>
                <div
                  className={
                    themeName === "dark-theme"
                      ? "settings-text-dark-theme chirp-regular-font"
                      : "settings-text-light-theme chirp-regular-font"
                  }
                  style={{
                    fontSize: font13.fontSize,
                    lineHeight: font13.lineHeight,
                  }}
                >
                  See your account information like your phone number and email
                  address.
                </div>
              </div>
              <div
                className={
                  themeName === "dark-theme"
                    ? "settings-icon-dark-theme"
                    : "settings-icon-light-theme"
                }
              >
                {" "}
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <g>
                    <path d="M14.586 12L7.543 4.96l1.414-1.42L17.414 12l-8.457 8.46-1.414-1.42L14.586 12z"></path>
                  </g>
                </svg>
              </div>
            </div>
          </div>
          <div
            onClick={() => navigate("/settings/password")}
            className={
              themeName === "dark-theme"
                ? "has-children-dark-theme"
                : "has-children-light-theme"
            }
          >
            <div
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
              }}
            >
              <div
                className={
                  themeName === "dark-theme"
                    ? "settings-icon-dark-theme"
                    : "settings-icon-light-theme"
                }
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <g>
                    <path d="M13 9.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5zm9.14 1.77l-5.83 5.84-4-1L6.41 22H2v-4.41l5.89-5.9-1-4 5.84-5.83 7.06 2.35 2.35 7.06zm-12.03 1.04L4 18.41V20h1.59l6.1-6.11 4 1 4.17-4.16-1.65-4.94-4.94-1.65-4.16 4.17 1 4z"></path>
                  </g>
                </svg>
              </div>
              <div
                style={{
                  paddingLeft: "16px",
                  width: "100%",
                }}
              >
                <div
                  style={{
                    fontSize: font15.fontSize,
                    lineHeight: font15.lineHeight,
                  }}
                  className={
                    themeName === "dark-theme"
                      ? "settings-text-first-exp-dark-theme chirp-regular-font"
                      : "settings-text-first-exp-light-theme chirp-regular-font"
                  }
                >
                  Change your password
                </div>
                <div
                  className={
                    themeName === "dark-theme"
                      ? "settings-text-dark-theme chirp-regular-font"
                      : "settings-text-light-theme chirp-regular-font"
                  }
                  style={{
                    fontSize: font13.fontSize,
                    lineHeight: font13.lineHeight,
                  }}
                >
                  Change your password at any time.
                </div>
              </div>
              <div
                className={
                  themeName === "dark-theme"
                    ? "settings-icon-dark-theme"
                    : "settings-icon-light-theme"
                }
              >
                {" "}
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <g>
                    <path d="M14.586 12L7.543 4.96l1.414-1.42L17.414 12l-8.457 8.46-1.414-1.42L14.586 12z"></path>
                  </g>
                </svg>
              </div>
            </div>
          </div>
          <div
            onClick={() => navigate("/i/flow/verify_account_ownership")}
            className={
              themeName === "dark-theme"
                ? "has-children-dark-theme"
                : "has-children-light-theme"
            }
          >
            <div
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
              }}
            >
              <div
                className={
                  themeName === "dark-theme"
                    ? "settings-icon-dark-theme"
                    : "settings-icon-light-theme"
                }
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <g>
                    <path d="M11.99 16l-5.7-5.7L7.7 8.88l3.29 3.3V2.59h2v9.59l3.3-3.3 1.41 1.42-5.71 5.7zM21 15l-.02 3.51c0 1.38-1.12 2.49-2.5 2.49H5.5C4.11 21 3 19.88 3 18.5V15h2v3.5c0 .28.22.5.5.5h12.98c.28 0 .5-.22.5-.5L19 15h2z"></path>
                  </g>
                </svg>
              </div>
              <div
                style={{
                  paddingLeft: "16px",
                  width: "100%",
                }}
              >
                <div
                  style={{
                    fontSize: font15.fontSize,
                    lineHeight: font15.lineHeight,
                  }}
                  className={
                    themeName === "dark-theme"
                      ? "settings-text-first-exp-dark-theme chirp-regular-font"
                      : "settings-text-first-exp-light-theme chirp-regular-font"
                  }
                >
                  Download an archive of your data
                </div>
                <div
                  className={
                    themeName === "dark-theme"
                      ? "settings-text-dark-theme chirp-regular-font"
                      : "settings-text-light-theme chirp-regular-font"
                  }
                  style={{
                    fontSize: font13.fontSize,
                    lineHeight: font13.lineHeight,
                  }}
                >
                  Get insights into the type of information stored for your
                  account.
                </div>
              </div>
              <div
                className={
                  themeName === "dark-theme"
                    ? "settings-icon-dark-theme"
                    : "settings-icon-light-theme"
                }
              >
                {" "}
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <g>
                    <path d="M14.586 12L7.543 4.96l1.414-1.42L17.414 12l-8.457 8.46-1.414-1.42L14.586 12z"></path>
                  </g>
                </svg>
              </div>
            </div>
          </div>
          <div
            onClick={() => navigate("/settings/deactivate")}
            className={
              themeName === "dark-theme"
                ? "has-children-dark-theme"
                : "has-children-light-theme"
            }
          >
            <div
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
              }}
            >
              <div
                className={
                  themeName === "dark-theme"
                    ? "settings-icon-dark-theme"
                    : "settings-icon-light-theme"
                }
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <g>
                    <path d="M21.398 6.52c-.887-1.79-2.647-2.91-4.601-3.01-1.65-.09-3.367.56-4.796 2.01-1.43-1.45-3.147-2.1-4.798-2.01-1.954.1-3.714 1.22-4.601 3.01-.896 1.81-.846 4.17.514 6.67 1.353 2.48 4.003 5.12 8.382 7.67l.504.3.503-.3c4.378-2.55 7.028-5.19 8.379-7.67 1.36-2.5 1.41-4.86.514-6.67zm-2.27 5.71c-1.074 1.97-3.256 4.27-7.126 6.61-3.872-2.34-6.055-4.64-7.129-6.61-1.112-2.04-1.031-3.7-.479-4.82.561-1.13 1.667-1.84 2.91-1.91 1.077-.05 2.338.38 3.452 1.61L8.588 10.3l4.009 2.5-1.428 2.15 1.665 1.1 2.569-3.85-3.991-2.5 1.405-2.06c1.21-1.63 2.662-2.2 3.88-2.14 1.242.07 2.347.78 2.908 1.91.553 1.12.634 2.78-.477 4.82z"></path>
                  </g>
                </svg>
              </div>
              <div
                style={{
                  paddingLeft: "16px",
                  width: "100%",
                }}
              >
                <div
                  style={{
                    fontSize: font15.fontSize,
                    lineHeight: font15.lineHeight,
                  }}
                  className={
                    themeName === "dark-theme"
                      ? "settings-text-first-exp-dark-theme chirp-regular-font"
                      : "settings-text-first-exp-light-theme chirp-regular-font"
                  }
                >
                  Deactivate your account
                </div>
                <div
                  className={
                    themeName === "dark-theme"
                      ? "settings-text-dark-theme chirp-regular-font"
                      : "settings-text-light-theme chirp-regular-font"
                  }
                  style={{
                    fontSize: font13.fontSize,
                    lineHeight: font13.lineHeight,
                  }}
                >
                  Find out how you can deactivate your account.
                </div>
              </div>
              <div
                className={
                  themeName === "dark-theme"
                    ? "settings-icon-dark-theme"
                    : "settings-icon-light-theme"
                }
              >
                {" "}
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <g>
                    <path d="M14.586 12L7.543 4.96l1.414-1.42L17.414 12l-8.457 8.46-1.414-1.42L14.586 12z"></path>
                  </g>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </Col>
    </>
  );
}
export default YourAccountMain;
