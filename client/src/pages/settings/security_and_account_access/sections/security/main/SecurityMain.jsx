import { Button, Col, Modal } from "react-bootstrap";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAntdMessageHandler } from "../../../../../../utils/useAntdMessageHandler";
import useWindowDimensions from "../../../../../../hooks/getWindowDimensions";
import SettingsNavigation from "../../../../../../components/SettingsNavigation/SettingsNavigation";
import { NavigationHistoryContext } from "../../../../../../context/NavigationHistoryContext";
import { ThemeContext } from "../../../../../../context/ThemeContext";
import { useFontSizeHandler } from "../../../../../../utils/useFontSizeHandler";

const API_URL = import.meta.env.VITE_APP_API_URL;

function SecurityMain() {
  const { contextHolder } = useAntdMessageHandler();
  const { width } = useWindowDimensions();
  const [{ theme, themeName }] = useContext(ThemeContext);
  const navigate = useNavigate();
  const { navigationHistoryArray } = useContext(NavigationHistoryContext);

  const [firstClicked, setfirstClicked] = useState(null);
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
              if (navigationHistoryArray[1] !== "/i/flow/add_phone") {
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
              color={themeName === "dark-theme" ? "#EFF3F4" : "#0F141A"}
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
            Security
          </div>
        </div>{" "}
        <div className="mt-3" style={{ paddingLeft: "16px" }}>
          <div
            className={
              themeName === "dark-theme"
                ? "soft-grey-dark-theme-text-variant-2 chirp-regular-font"
                : "very-dark-gray-light-theme-text-variant-2 chirp-regular-font"
            }
            style={{
              fontSize: font13.fontSize,
              lineHeight: font13.lineHeight,
            }}
          >
            Manage your account’s security.
          </div>
          <div
            className={
              themeName === "dark-theme"
                ? "soft-grey-dark-theme-text-variant-1 chirp-bold-font mt-3"
                : "very-dark-gray-light-theme-text-variant-1 chirp-bold-font mt-3"
            }
            style={{
              fontSize: font20.fontSize,
              lineHeight: font20.lineHeight,
            }}
          >
            Two-factor authentication
          </div>
          <div
            className={
              themeName === "dark-theme"
                ? "soft-grey-dark-theme-text-variant-2 chirp-regular-font mt-3"
                : "very-dark-gray-light-theme-text-variant-2 chirp-regular-font mt-3"
            }
            style={{
              fontSize: font13.fontSize,
              lineHeight: font13.lineHeight,
            }}
          >
            Help protect your account from unauthorized access by requiring a
            second authentication method in addition to your C password. You can
            choose a text message, authentication app, or security key.{" "}
            <span className="hover-blue-underline">Learn more</span>
          </div>
          <div
            className="mt-3"
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                fontSize: font15.fontSize,
                lineHeight: font15.lineHeight,
              }}
              className={
                themeName === "dark-theme"
                  ? "soft-grey-dark-theme-text-variant-1 chirp-regular-font"
                  : "very-dark-gray-light-theme-text-variant-1 chirp-regular-font"
              }
            >
              Two-factor authentication
            </div>
            <div
              style={{
                paddingRight: "16px",
              }}
            >
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
        </div>
        <div
          className="mt-3"
          style={{
            borderBottom:
              themeName !== "dark-theme"
                ? "1px solid rgba(0, 0, 0, 0.1)"
                : // : "0.1px solid rgb(70, 70, 70)",
                  "1px solid rgb(70, 70, 70)",
          }}
        ></div>
        <div
          className="mt-3"
          style={{
            paddingLeft: "16px",
          }}
        >
          <div
            className={
              themeName === "dark-theme"
                ? "soft-grey-dark-theme-text-variant-1 chirp-bold-font mt-3"
                : "very-dark-gray-light-theme-text-variant-1 chirp-bold-font mt-3"
            }
            style={{
              fontSize: font20.fontSize,
              lineHeight: font20.lineHeight,
            }}
          >
            ID verification
          </div>
          <div
            style={{
              fontSize: font13.fontSize,
              lineHeight: font13.lineHeight,
            }}
            className={
              themeName === "dark-theme"
                ? "soft-grey-dark-theme-text-variant-2 chirp-regular-font mt-3"
                : "very-dark-gray-light-theme-text-variant-2 chirp-regular-font mt-3"
            }
          >
            Upload an approved form of identification to confirm the
            authenticity of your account. Your information will only be used to
            validate your identity and will be handled safely and securely.{" "}
            <span className="hover-blue-underline">Learn more</span>
          </div>
          <div
            className="mt-3"
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                fontSize: font15.fontSize,
                lineHeight: font15.lineHeight,
              }}
              className={
                themeName === "dark-theme"
                  ? "soft-grey-dark-theme-text-variant-1 chirp-regular-font"
                  : "very-dark-gray-light-theme-text-variant-1 chirp-regular-font"
              }
            >
              ID verification
            </div>
            <div
              style={{
                paddingRight: "16px",
              }}
            >
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
        </div>
        <div
          className="mt-3"
          style={{
            borderBottom:
              themeName !== "dark-theme"
                ? "1px solid rgba(0, 0, 0, 0.1)"
                : // : "0.1px solid rgb(70, 70, 70)",
                  "1px solid rgb(70, 70, 70)",
          }}
        ></div>
        <div
          className="mt-3"
          style={{
            paddingLeft: "16px",
          }}
        >
          <div
            className={
              themeName === "dark-theme"
                ? "soft-grey-dark-theme-text-variant-1 chirp-bold-font mt-3"
                : "very-dark-gray-light-theme-text-variant-1 chirp-bold-font mt-3"
            }
            style={{
              fontSize: font20.fontSize,
              lineHeight: font20.lineHeight,
            }}
          >
            Additional password protection
          </div>
          <div
            className={
              themeName === "dark-theme"
                ? "soft-grey-dark-theme-text-variant-2 chirp-regular-font mt-3"
                : "very-dark-gray-light-theme-text-variant-2 chirp-regular-font mt-3"
            }
            style={{
              fontSize: font13.fontSize,
              lineHeight: font13.lineHeight,
            }}
          >
            Enabling this setting adds extra security to your account by
            requiring additional information to reset your password. If enabled,
            you must provide either the phone number or email address associated
            with your account in order to reset your password.
          </div>
          <div
            className="mt-3"
            style={{
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
                  fontSize: font15.fontSize,
                  lineHeight: font15.lineHeight,
                }}
                className={
                  themeName === "dark-theme"
                    ? "soft-grey-dark-theme-text-variant-1 chirp-regular-font"
                    : "very-dark-gray-light-theme-text-variant-1 chirp-regular-font"
                }
              >
                Password reset protect
              </div>
              <div
                className="hover-blue-underline chirp-regular-font"
                style={{
                  fontSize: font13.fontSize,
                  lineHeight: font13.lineHeight,
                }}
              >
                Learn more
              </div>
            </div>
            <div
              style={{
                paddingRight: "16px",
              }}
            >
              <div
                onClick={() => setfirstClicked(!firstClicked)}
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  cursor: "pointer",
                  position: "relative",
                }}
                className={
                  themeName === "dark-theme" && firstClicked
                    ? "hover-background-effect-clicked-dark-theme"
                    : themeName !== "dark-theme" && firstClicked
                    ? "hover-background-effect-clicked-light-theme"
                    : themeName === "dark-theme" && !firstClicked
                    ? "hover-background-effect-dark-theme"
                    : themeName !== "dark-theme" && !firstClicked
                    ? "hover-background-effect-light-theme"
                    : ""
                }
              >
                <div
                  style={{
                    backgroundColor: firstClicked ? "#1d9bf0" : "transparent",
                    border: firstClicked
                      ? ""
                      : themeName === "dark-theme"
                      ? "2px solid rgb(70,70,70)"
                      : "2px solid #536471",

                    borderWidth: "2px ",
                    width: "20px",
                    height: "20px",
                    position: "relative",
                    left: "8px",
                    top: "8px",
                    borderRadius: "3px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <svg
                    style={{
                      display: firstClicked ? "initial" : "none",
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
      </Col>
    </>
  );
}

export default SecurityMain;
