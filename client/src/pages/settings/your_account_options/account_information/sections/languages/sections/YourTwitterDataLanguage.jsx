import { Col } from "react-bootstrap";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAntdMessageHandler } from "../../../../../../../utils/useAntdMessageHandler";
import useWindowDimensions from "../../../../../../../hooks/getWindowDimensions";
import { ThemeContext } from "../../../../../../../context/ThemeContext";
import SettingsNavigation from "../../../../../../../components/SettingsNavigation/SettingsNavigation";
import { NavigationHistoryContext } from "../../../../../../../context/NavigationHistoryContext";
import { useFontSizeHandler } from "../../../../../../../utils/useFontSizeHandler";

const API_URL = import.meta.env.VITE_APP_API_URL;

function YourTwitterDataLanguage() {
  const { contextHolder } = useAntdMessageHandler();
  const { width } = useWindowDimensions();
  const [{ theme, themeName }] = useContext(ThemeContext);
  const navigate = useNavigate();
  const { navigationHistoryArray } = useContext(NavigationHistoryContext);

  const [firstClicked, setFirstClicked] = useState(null);
  const [secondClicked, setSecondClicked] = useState(null);
  const [thirdClicked, setThirdClicked] = useState(null);
  const { getFontSizeAndLineHeight20, getFontSizeAndLineHeight15 } =
    useFontSizeHandler();
  const font20 = getFontSizeAndLineHeight20();
  const font15 = getFontSizeAndLineHeight15();
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
            Language
          </div>
        </div>
        <div
          style={{
            paddingLeft: "16px",
            fontSize: font15.fontSize,
            lineHeight: font15.lineHeight,
          }}
          className={
            themeName === "dark-theme"
              ? "mt-4 chirp-regular-font soft-grey-dark-theme-text-variant-2"
              : "mt-4 chirp-regular-font very-dark-gray-light-theme-text-variant-2"
          }
        >
          This is your account’s primary language setting.
        </div>
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
          style={{
            paddingLeft: "16px",
            fontSize: font15.fontSize,
            lineHeight: font15.lineHeight,
          }}
          className={
            themeName === "dark-theme"
              ? "mt-3 chirp-regular-font soft-grey-dark-theme-text-variant-1"
              : "mt-3 chirp-regular-font very-dark-gray-light-theme-text-variant-1"
          }
        >
          English
        </div>{" "}
        <div
          className="mt-3"
          style={{
            borderTop:
              themeName !== "dark-theme"
                ? "1px solid rgba(0, 0, 0, 0.1)"
                : // : "0.1px solid rgb(70, 70, 70)",
                  "1px solid rgb(70, 70, 70)",
          }}
        ></div>{" "}
        <div
          style={{
            paddingLeft: "16px",
            fontSize: font15.fontSize,
            lineHeight: font15.lineHeight,
          }}
          className={
            themeName === "dark-theme"
              ? "mt-3 chirp-regular-font soft-grey-dark-theme-text-variant-2"
              : "mt-3  chirp-regular-font very-dark-gray-light-theme-text-variant-2"
          }
        >
          These additional languages are used to personalize your experience.
        </div>{" "}
        <div
          className="mt-3"
          style={{
            borderTop:
              themeName !== "dark-theme"
                ? "1px solid rgba(0, 0, 0, 0.1)"
                : // : "0.1px solid rgb(70, 70, 70)",
                  "1px solid rgb(70, 70, 70)",
          }}
        ></div>{" "}
        <div
          className="mt-2"
          style={{
            padding: "0px 16px",
            display: "flex",
            justifyContent: "space-between",
            fontSize: font15.fontSize,
            lineHeight: font15.lineHeight,
            alignItems: "center",
          }}
        >
          <div
            className={
              themeName === "dark-theme"
                ? "soft-grey-dark-theme-text-variant-1 chirp-regular-font "
                : "very-dark-gray-light-theme-text-variant-1 chirp-regular-font "
            }
          >
            Chinese
          </div>
          <div>
            {" "}
            <div
              onClick={() => setFirstClicked(!firstClicked)}
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
                }}
              >
                <svg
                  style={{
                    position: "relative",
                    left: "2px",
                    bottom: "2px",
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
        </div>{" "}
        <div
          className="mt-4"
          style={{
            padding: "0px 16px",
            display: "flex",
            justifyContent: "space-between",
            fontSize: font15.fontSize,
            lineHeight: font15.lineHeight,
            alignItems: "center",
          }}
        >
          <div
            className={
              themeName === "dark-theme"
                ? "soft-grey-dark-theme-text-variant-1 chirp-regular-font "
                : "very-dark-gray-light-theme-text-variant-1 chirp-regular-font "
            }
          >
            Spanish
          </div>
          <div>
            {" "}
            <div
              onClick={() => setSecondClicked(!secondClicked)}
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                cursor: "pointer",
                position: "relative",
              }}
              className={
                themeName === "dark-theme" && secondClicked
                  ? "hover-background-effect-clicked-dark-theme"
                  : themeName !== "dark-theme" && secondClicked
                  ? "hover-background-effect-clicked-light-theme"
                  : themeName === "dark-theme" && !secondClicked
                  ? "hover-background-effect-dark-theme"
                  : themeName !== "dark-theme" && !secondClicked
                  ? "hover-background-effect-light-theme"
                  : ""
              }
            >
              <div
                style={{
                  backgroundColor: secondClicked ? "#1d9bf0" : "transparent",
                  border: secondClicked
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
                }}
              >
                <svg
                  style={{
                    position: "relative",
                    left: "2px",
                    bottom: "2px",
                    display: secondClicked ? "initial" : "none",
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
        </div>{" "}
        <div
          className="mt-4"
          style={{
            padding: "0px 16px",
            display: "flex",
            justifyContent: "space-between",
            fontSize: font15.fontSize,
            lineHeight: font15.lineHeight,
            alignItems: "center",
          }}
        >
          <div
            className={
              themeName === "dark-theme"
                ? "soft-grey-dark-theme-text-variant-1 chirp-regular-font "
                : "very-dark-gray-light-theme-text-variant-1 chirp-regular-font "
            }
          >
            German
          </div>
          <div>
            {" "}
            <div
              onClick={() => setThirdClicked(!thirdClicked)}
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                cursor: "pointer",
                position: "relative",
              }}
              className={
                themeName === "dark-theme" && thirdClicked
                  ? "hover-background-effect-clicked-dark-theme"
                  : themeName !== "dark-theme" && thirdClicked
                  ? "hover-background-effect-clicked-light-theme"
                  : themeName === "dark-theme" && !thirdClicked
                  ? "hover-background-effect-dark-theme"
                  : themeName !== "dark-theme" && !thirdClicked
                  ? "hover-background-effect-light-theme"
                  : ""
              }
            >
              <div
                style={{
                  backgroundColor: thirdClicked ? "#1d9bf0" : "transparent",
                  border: thirdClicked
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
                }}
              >
                <svg
                  style={{
                    position: "relative",
                    left: "2px",
                    bottom: "2px",
                    display: thirdClicked ? "initial" : "none",
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
      </Col>
    </>
  );
}

export default YourTwitterDataLanguage;
