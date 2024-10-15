import { Col } from "react-bootstrap";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../../../../../context/ThemeContext";
import { NavigationHistoryContext } from "../../../../../context/NavigationHistoryContext";
import SettingsNavigation from "../../../../../components/SettingsNavigation/SettingsNavigation";
import useWindowDimensions from "../../../../../hooks/getWindowDimensions";
import { useAntdMessageHandler } from "../../../../../utils/useAntdMessageHandler";
import { FontSizeContext } from "../../../../../context/FontSizeContext";
import BootstrapTooltip from "../../../../../components/BootstrapToolTip/BootstrapToolTip";
import { ColorContext } from "../../../../../context/ColorContext";
import { useFontSizeHandler } from "../../../../../utils/useFontSizeHandler";

function Display() {
  const { contextHolder } = useAntdMessageHandler();
  const { width } = useWindowDimensions();
  const { fontSize, setFontSize } = useContext(FontSizeContext);
  const { colorType, setColorType } = useContext(ColorContext);
  const [{ themeName }, toggleThemeBetweenLightDarkMode] =
    useContext(ThemeContext);
  const { navigationHistoryArray } = useContext(NavigationHistoryContext);
  const [activeSizeNumber, setActiveSizeNumber] = useState(12);
  const navigate = useNavigate();
  const { getFontSizeAndLineHeight15, getFontSizeAndLineHeight20 } =
    useFontSizeHandler();
  const font20 = getFontSizeAndLineHeight20();
  const font15 = getFontSizeAndLineHeight15();
  useEffect(() => {
    if (fontSize === "Extra small") {
      setActiveSizeNumber(-2);
    } else if (fontSize === "Small") {
      setActiveSizeNumber(-1);
    } else if (fontSize === "Default") {
      setActiveSizeNumber(0);
    } else if (fontSize === "Large") {
      setActiveSizeNumber(1);
    } else if (fontSize === "Extra large") {
      setActiveSizeNumber(2);
    }
  }, [fontSize]);

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
                ? "mt-2 chirp-bold-font first-head soft-grey-dark-theme-text-variant-1"
                : "mt-2 chirp-bold-font first-head very-dark-gray-light-theme-text-variant-1"
            }
          >
            Display
          </div>
        </div>{" "}
        <div
          className={
            themeName === "dark-theme"
              ? "soft-grey-dark-theme-text-variant-2 chirp-regular-font mt-4"
              : "very-dark-gray-light-theme-text-variant-2 chirp-regular-font mt-4"
          }
          style={{
            paddingLeft: "16px",
            paddingRight: "16px",
            fontSize:
              fontSize === "Default"
                ? "13px"
                : fontSize === "Small"
                ? "12px"
                : fontSize === "Extra small"
                ? "12px"
                : fontSize === "Large"
                ? "14px"
                : fontSize === "Extra large"
                ? "16px"
                : null,
            lineHeight:
              fontSize === "Default"
                ? "16px"
                : fontSize === "Small"
                ? "15px"
                : fontSize === "Extra small"
                ? "14px"
                : fontSize === "Large"
                ? "18px"
                : fontSize === "Extra large"
                ? "19px"
                : null,
          }}
        >
          Manage your font size, color, and background. These settings affect
          all the C accounts on this browser.
        </div>
        <div
          className="mt-4"
          style={{
            paddingLeft: "16px",
            display: "flex",
            pointerEvents: "none",
            paddingRight: "16px",
          }}
        >
          <div
            style={{
              display: "flex",
            }}
          >
            <div>
              {" "}
              <span
                style={{
                  cursor: "pointer",
                }}
              >
                <div
                  className={
                    themeName === "dark-theme"
                      ? "hover-home-dark-theme"
                      : "hover-home"
                  }
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
              </span>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <div
                className={
                  themeName === "dark-theme"
                    ? "soft-grey-dark-theme-text-variant-1 chirp-bold-font"
                    : "very-dark-gray-light-theme-text-variant-1 chirp-bold-font"
                }
                style={{
                  fontSize: font15.fontSize,
                  lineHeight: font15.lineHeight,
                  marginRight: "5px",
                }}
              >
                C
              </div>
              <div
                style={{
                  marginRight: "5px",
                  display: "flex",
                }}
              >
                {" "}
                <svg
                  width={`${20}px`}
                  height={`${20}px`}
                  viewBox="0 0 22 22"
                  aria-label="Verified account"
                  role="img"
                  className="r-4qtqp9 r-yyyyoo r-1xvli5t r-bnwqim r-1plcrui r-lrvibr r-1cvl2hr r-f9ja8p r-og9te1 r-9cviqr"
                  data-testid="verified-icon"
                  color="rgba(29,155,240,1.00)"
                  fill="currentColor"
                >
                  <g>
                    <path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z"></path>
                  </g>
                </svg>
              </div>
              <div>
                <span
                  className={
                    themeName === "dark-theme"
                      ? "soft-grey-dark-theme-text-variant-2 chirp-regular-font"
                      : "very-dark-gray-light-theme-text-variant-2 chirp-regular-font"
                  }
                  style={{
                    fontSize:
                      fontSize === "Default"
                        ? "15px"
                        : fontSize === "Small"
                        ? "14px"
                        : fontSize === "Extra small"
                        ? "14px"
                        : fontSize === "Large"
                        ? "17px"
                        : fontSize === "Extra large"
                        ? "18px"
                        : null,
                    lineHeight:
                      fontSize === "Default"
                        ? "20px"
                        : fontSize === "Small"
                        ? "19px"
                        : fontSize === "Extra small"
                        ? "18px"
                        : fontSize === "Large"
                        ? "22px"
                        : fontSize === "Extra large"
                        ? "24px"
                        : null,
                    marginRight: "5px",
                  }}
                >
                  @C
                </span>
                <span
                  style={{
                    fontSize:
                      fontSize === "Default"
                        ? "15px"
                        : fontSize === "Small"
                        ? "14px"
                        : fontSize === "Extra small"
                        ? "14px"
                        : fontSize === "Large"
                        ? "17px"
                        : fontSize === "Extra large"
                        ? "18px"
                        : null,
                    lineHeight:
                      fontSize === "Default"
                        ? "20px"
                        : fontSize === "Small"
                        ? "19px"
                        : fontSize === "Extra small"
                        ? "18px"
                        : fontSize === "Large"
                        ? "22px"
                        : fontSize === "Extra large"
                        ? "24px"
                        : null,
                    marginRight: "5px",
                  }}
                  className={
                    themeName === "dark-theme"
                      ? "soft-grey-dark-theme-text-variant-2 chirp-regular-font"
                      : "very-dark-gray-light-theme-text-variant-2 chirp-regular-font"
                  }
                >
                  &middot;
                </span>
              </div>
              <div
                style={{
                  fontSize:
                    fontSize === "Default"
                      ? "15px"
                      : fontSize === "Small"
                      ? "14px"
                      : fontSize === "Extra small"
                      ? "14px"
                      : fontSize === "Large"
                      ? "17px"
                      : fontSize === "Extra large"
                      ? "18px"
                      : null,
                  lineHeight:
                    fontSize === "Default"
                      ? "20px"
                      : fontSize === "Small"
                      ? "19px"
                      : fontSize === "Extra small"
                      ? "18px"
                      : fontSize === "Large"
                      ? "22px"
                      : fontSize === "Extra large"
                      ? "24px"
                      : null,
                }}
                className={
                  themeName === "dark-theme"
                    ? "soft-grey-dark-theme-text-variant-2 chirp-regular-font"
                    : "very-dark-gray-light-theme-text-variant-2 chirp-regular-font"
                }
              >
                44m
              </div>
            </div>
            <div
              style={{
                fontSize:
                  fontSize === "Default"
                    ? "15px"
                    : fontSize === "Small"
                    ? "14px"
                    : fontSize === "Extra small"
                    ? "14px"
                    : fontSize === "Large"
                    ? "17px"
                    : fontSize === "Extra large"
                    ? "18px"
                    : null,
                lineHeight:
                  fontSize === "Default"
                    ? "20px"
                    : fontSize === "Small"
                    ? "19px"
                    : fontSize === "Extra small"
                    ? "18px"
                    : fontSize === "Large"
                    ? "22px"
                    : fontSize === "Extra large"
                    ? "24px"
                    : null,
              }}
              className={
                themeName === "dark-theme"
                  ? "soft-grey-dark-theme-text-variant-1 chirp-regular-font"
                  : "very-dark-gray-light-theme-text-variant-1 chirp-regular-font"
              }
            >
              <span>
                At the heart of C are short messages called posts — just like
                this one — which can include photos, videos, links, text,
                hashtags, and mentions like{" "}
              </span>
              <span
                className="hover-blue-underline"
                style={{
                  color:
                    colorType === "skyBlue"
                      ? "#1C9BEF"
                      : colorType === "goldenYellow"
                      ? "#FFD400"
                      : colorType === "hotPink"
                      ? "#F9197F"
                      : colorType === "royalPurple"
                      ? "#7855FF"
                      : colorType === "tangerine"
                      ? "#FE7900"
                      : colorType === "teal"
                      ? "#00BA7C"
                      : null,
                }}
                // backgroundColor:
                // colorType === "skyBlue"
                //   ? "rgb(142, 205, 248)"
                //   : colorType === "goldenYellow"
                //   ? "#FEEA80"
                //   : colorType === "hotPink"
                //   ? "#FC8CC0"
                //   : colorType === "royalPurple"
                //   ? "#BCABFF"
                //   : colorType === "tangerine"
                //   ? "#FFBD80"
                //   : colorType === "teal"
                //   ? "#7FDDBE"
                //   : null,
              >
                @X
              </span>
              <span>.</span>
            </div>
          </div>
        </div>
        <div
          className="mt-4"
          style={{
            borderBottom:
              themeName !== "dark-theme"
                ? "1px solid rgba(0, 0, 0, 0.1)"
                : // : "0.1px solid rgb(70, 70, 70)",
                  "1px solid rgb(70, 70, 70)",
          }}
        ></div>
        <div
          style={{
            paddingLeft: "16px",
          }}
          className="mt-3 mb-3"
        >
          <div>
            <span
              className={
                themeName === "dark-theme"
                  ? "soft-grey-dark-theme-text-variant-1 chirp-bold-font"
                  : "very-dark-gray-light-theme-text-variant-1 chirp-bold-font"
              }
              style={{
                fontSize:
                  fontSize === "Default"
                    ? "20px"
                    : fontSize === "Small"
                    ? "19px"
                    : fontSize === "Extra small"
                    ? "18px"
                    : fontSize === "Large"
                    ? "22px"
                    : fontSize === "Extra large"
                    ? "24px"
                    : null,
                lineHeight:
                  fontSize === "Default"
                    ? "24px"
                    : fontSize === "Small"
                    ? "23px"
                    : fontSize === "Extra small"
                    ? "22px"
                    : fontSize === "Large"
                    ? "26px"
                    : fontSize === "Extra large"
                    ? "29px"
                    : null,
              }}
            >
              Font size
            </span>
          </div>
          <div
            className="mt-4"
            style={{
              position: "relative",
              display: "flex",
              justifyContent: "space-between",
              paddingRight: "16px",
              alignItems: "center",
            }}
          >
            <div
              style={{
                fontSize:
                  fontSize === "Default"
                    ? "13px"
                    : fontSize === "Small"
                    ? "12px"
                    : fontSize === "Extra small"
                    ? "12px"
                    : fontSize === "Large"
                    ? "14px"
                    : fontSize === "Extra large"
                    ? "16px"
                    : null,
                lineHeight:
                  fontSize === "Default"
                    ? "16px"
                    : fontSize === "Small"
                    ? "15px"
                    : fontSize === "Extra small"
                    ? "14px"
                    : fontSize === "Large"
                    ? "18px"
                    : fontSize === "Extra large"
                    ? "19px"
                    : null,
              }}
            >
              Aa
            </div>{" "}
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                position: "relative",
                margin: "0px 16px",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  backgroundColor:
                    colorType === "skyBlue"
                      ? "rgb(142, 205, 248)"
                      : colorType === "goldenYellow"
                      ? "#FEEA80"
                      : colorType === "hotPink"
                      ? "#FC8CC0"
                      : colorType === "royalPurple"
                      ? "#BCABFF"
                      : colorType === "tangerine"
                      ? "#FFBD80"
                      : colorType === "teal"
                      ? "#7FDDBE"
                      : null,

                  height: "4px",
                  width: "100%",
                  pointerEvents: "none",
                  zIndex: 2,
                  borderRadius: "8px",
                }}
              >
                {" "}
                <div
                  style={{
                    position: "absolute",
                    backgroundColor:
                      colorType === "skyBlue"
                        ? "#1C9BEF"
                        : colorType === "goldenYellow"
                        ? "#FFD400"
                        : colorType === "hotPink"
                        ? "#F9197F"
                        : colorType === "royalPurple"
                        ? "#7855FF"
                        : colorType === "tangerine"
                        ? "#FE7900"
                        : colorType === "teal"
                        ? "#00BA7C"
                        : null,
                    borderRadius: "8px 0 0 8px",
                    height: "4px",
                    width:
                      activeSizeNumber === -2
                        ? "0%"
                        : activeSizeNumber === -1
                        ? "25%"
                        : activeSizeNumber === 0
                        ? "50%"
                        : activeSizeNumber === 1
                        ? "75%"
                        : activeSizeNumber === 2
                        ? "100%"
                        : null,
                  }}
                ></div>
              </div>
              <BootstrapTooltip
                title={"Extra small"}
                themeName={
                  themeName === "dark-theme" ? "dark-theme" : "light-theme"
                }
              >
                {" "}
                <div
                  className={
                    themeName === "dark-theme"
                      ? "display-dark-theme-hover-circle-bg"
                      : "display-light-theme-hover-circle-bg"
                  }
                  onClick={() => {
                    setActiveSizeNumber(-2);
                    setFontSize("Extra small");
                  }}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    position: "relative",
                    borderRadius: "50%",
                    right: "8px",
                    cursor: "pointer",
                  }}
                >
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: "50%",
                    }}
                  >
                    <div
                      style={{
                        backgroundColor:
                          (fontSize === "Extra small" ||
                            activeSizeNumber >= -2) &&
                          colorType === "skyBlue"
                            ? "rgb(29, 155, 240)"
                            : fontSize !== "Extra small" &&
                              colorType === "skyBlue"
                            ? "rgb(142, 205, 248)"
                            : (fontSize === "Extra small" ||
                                activeSizeNumber >= -2) &&
                              colorType === "goldenYellow"
                            ? "#FFD400"
                            : fontSize !== "Extra small" &&
                              colorType === "goldenYellow"
                            ? "#FEEA80"
                            : (fontSize === "Extra small" ||
                                activeSizeNumber >= -2) &&
                              colorType === "hotPink"
                            ? "#F9197F"
                            : fontSize !== "Extra small" &&
                              colorType === "hotPink"
                            ? "#FC8CC0"
                            : (fontSize === "Extra small" ||
                                activeSizeNumber >= -2) &&
                              colorType === "royalPurple"
                            ? "#7855FF"
                            : fontSize !== "Extra small" &&
                              colorType === "royalPurple"
                            ? "#BCABFF"
                            : (fontSize === "Extra small" ||
                                activeSizeNumber >= -2) &&
                              colorType === "tangerine"
                            ? "#FE7900"
                            : fontSize !== "Extra small" &&
                              colorType === "tangerine"
                            ? "#FFBD80"
                            : (fontSize === "Extra small" ||
                                activeSizeNumber >= -2) &&
                              colorType === "teal"
                            ? "#00BA7C"
                            : fontSize !== "Extra small" && colorType === "teal"
                            ? "#7FDDBE"
                            : null,
                        width: fontSize === "Extra small" ? "16px" : "12px",
                        height: fontSize === "Extra small" ? "16px" : "12px",
                        borderRadius: "50%",
                        zIndex: 3,
                      }}
                    >
                      {" "}
                    </div>
                  </div>
                </div>
              </BootstrapTooltip>{" "}
              <BootstrapTooltip
                title={"Small"}
                themeName={
                  themeName === "dark-theme" ? "dark-theme" : "light-theme"
                }
              >
                {" "}
                <div
                  className={
                    themeName === "dark-theme"
                      ? "display-dark-theme-hover-circle-bg"
                      : "display-light-theme-hover-circle-bg"
                  }
                  onClick={() => {
                    setActiveSizeNumber(-1);
                    setFontSize("Small");
                  }}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    position: "relative",
                    borderRadius: "50%",
                    cursor: "pointer",
                  }}
                >
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: "50%",
                    }}
                  >
                    <div
                      style={{
                        backgroundColor:
                          (fontSize === "Small" || activeSizeNumber >= -1) &&
                          colorType === "skyBlue"
                            ? "rgb(29, 155, 240)"
                            : fontSize !== "Small" && colorType === "skyBlue"
                            ? "rgb(142, 205, 248)"
                            : (fontSize === "Small" ||
                                activeSizeNumber >= -1) &&
                              colorType === "goldenYellow"
                            ? "#FFD400"
                            : fontSize !== "Small" &&
                              colorType === "goldenYellow"
                            ? "#FEEA80"
                            : (fontSize === "Small" ||
                                activeSizeNumber >= -1) &&
                              colorType === "hotPink"
                            ? "#F9197F"
                            : fontSize !== "Small" && colorType === "hotPink"
                            ? "#FC8CC0"
                            : (fontSize === "Small" ||
                                activeSizeNumber >= -1) &&
                              colorType === "royalPurple"
                            ? "#7855FF"
                            : fontSize !== "Small" &&
                              colorType === "royalPurple"
                            ? "#BCABFF"
                            : (fontSize === "Small" ||
                                activeSizeNumber >= -1) &&
                              colorType === "tangerine"
                            ? "#FE7900"
                            : fontSize !== "Small" && colorType === "tangerine"
                            ? "#FFBD80"
                            : (fontSize === "Small" ||
                                activeSizeNumber >= -1) &&
                              colorType === "teal"
                            ? "#00BA7C"
                            : fontSize !== "Small" && colorType === "teal"
                            ? "#7FDDBE"
                            : null,
                        width: fontSize === "Small" ? "16px" : "12px",
                        height: fontSize === "Small" ? "16px" : "12px",
                        borderRadius: "50%",
                        zIndex: 3,
                      }}
                    ></div>{" "}
                  </div>
                </div>
              </BootstrapTooltip>
              <BootstrapTooltip
                title={"Default"}
                themeName={
                  themeName === "dark-theme" ? "dark-theme" : "light-theme"
                }
              >
                {" "}
                <div
                  className={
                    themeName === "dark-theme"
                      ? "display-dark-theme-hover-circle-bg"
                      : "display-light-theme-hover-circle-bg"
                  }
                  onClick={() => {
                    setActiveSizeNumber(0);
                    setFontSize("Default");
                  }}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    position: "relative",
                    borderRadius: "50%",
                    cursor: "pointer",
                  }}
                >
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: "50%",
                    }}
                  >
                    <div
                      style={{
                        backgroundColor:
                          (fontSize === "Default" || activeSizeNumber >= 0) &&
                          colorType === "skyBlue"
                            ? "rgb(29, 155, 240)"
                            : fontSize !== "Default" && colorType === "skyBlue"
                            ? "rgb(142, 205, 248)"
                            : (fontSize === "Default" ||
                                activeSizeNumber >= 0) &&
                              colorType === "goldenYellow"
                            ? "#FFD400"
                            : fontSize !== "Default" &&
                              colorType === "goldenYellow"
                            ? "#FEEA80"
                            : (fontSize === "Default" ||
                                activeSizeNumber >= 0) &&
                              colorType === "hotPink"
                            ? "#F9197F"
                            : fontSize !== "Default" && colorType === "hotPink"
                            ? "#FC8CC0"
                            : (fontSize === "Default" ||
                                activeSizeNumber >= 0) &&
                              colorType === "royalPurple"
                            ? "#7855FF"
                            : fontSize !== "Default" &&
                              colorType === "royalPurple"
                            ? "#BCABFF"
                            : (fontSize === "Default" ||
                                activeSizeNumber >= 0) &&
                              colorType === "tangerine"
                            ? "#FE7900"
                            : fontSize !== "Default" &&
                              colorType === "tangerine"
                            ? "#FFBD80"
                            : (fontSize === "Default" ||
                                activeSizeNumber >= 0) &&
                              colorType === "teal"
                            ? "#00BA7C"
                            : fontSize !== "Default" && colorType === "teal"
                            ? "#7FDDBE"
                            : null,
                        width: fontSize === "Default" ? "16px" : "12px",
                        height: fontSize === "Default" ? "16px" : "12px",
                        borderRadius: "50%",
                        zIndex: 3,
                      }}
                    ></div>
                  </div>
                </div>
              </BootstrapTooltip>
              <BootstrapTooltip
                title={"Large"}
                themeName={
                  themeName === "dark-theme" ? "dark-theme" : "light-theme"
                }
              >
                {" "}
                <div
                  className={
                    themeName === "dark-theme"
                      ? "display-dark-theme-hover-circle-bg"
                      : "display-light-theme-hover-circle-bg"
                  }
                  onClick={() => {
                    setActiveSizeNumber(1);
                    setFontSize("Large");
                  }}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    position: "relative",
                    borderRadius: "50%",
                    cursor: "pointer",
                  }}
                >
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: "50%",
                    }}
                  >
                    <div
                      style={{
                        backgroundColor:
                          (fontSize === "Large" || activeSizeNumber >= 1) &&
                          colorType === "skyBlue"
                            ? "rgb(29, 155, 240)"
                            : fontSize !== "Large" && colorType === "skyBlue"
                            ? "rgb(142, 205, 248)"
                            : (fontSize === "Large" || activeSizeNumber >= 1) &&
                              colorType === "goldenYellow"
                            ? "#FFD400"
                            : fontSize !== "Large" &&
                              colorType === "goldenYellow"
                            ? "#FEEA80"
                            : (fontSize === "Large" || activeSizeNumber >= 1) &&
                              colorType === "hotPink"
                            ? "#F9197F"
                            : fontSize !== "Large" && colorType === "hotPink"
                            ? "#FC8CC0"
                            : (fontSize === "Large" || activeSizeNumber >= 1) &&
                              colorType === "royalPurple"
                            ? "#7855FF"
                            : fontSize !== "Large" &&
                              colorType === "royalPurple"
                            ? "#BCABFF"
                            : (fontSize === "Large" || activeSizeNumber >= 1) &&
                              colorType === "tangerine"
                            ? "#FE7900"
                            : fontSize !== "Large" && colorType === "tangerine"
                            ? "#FFBD80"
                            : (fontSize === "Large" || activeSizeNumber >= 1) &&
                              colorType === "teal"
                            ? "#00BA7C"
                            : fontSize !== "Large" && colorType === "teal"
                            ? "#7FDDBE"
                            : null,
                        width: fontSize === "Large" ? "16px" : "12px",
                        height: fontSize === "Large" ? "16px" : "12px",
                        borderRadius: "50%",
                        zIndex: 3,
                      }}
                    ></div>
                  </div>
                </div>
              </BootstrapTooltip>
              <BootstrapTooltip
                title={"Extra large"}
                themeName={
                  themeName === "dark-theme" ? "dark-theme" : "light-theme"
                }
              >
                {" "}
                <div
                  className={
                    themeName === "dark-theme"
                      ? "display-dark-theme-hover-circle-bg"
                      : "display-light-theme-hover-circle-bg"
                  }
                  onClick={() => {
                    setActiveSizeNumber(2);
                    setFontSize("Extra large");
                  }}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    position: "relative",
                    borderRadius: "50%",
                    left: "8px",
                    cursor: "pointer",
                  }}
                >
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: "50%",
                    }}
                  >
                    <div
                      style={{
                        backgroundColor:
                          (fontSize === "Extra large" ||
                            activeSizeNumber >= 2) &&
                          colorType === "skyBlue"
                            ? "rgb(29, 155, 240)"
                            : fontSize !== "Extra large" &&
                              colorType === "skyBlue"
                            ? "rgb(142, 205, 248)"
                            : (fontSize === "Extra large" ||
                                activeSizeNumber >= 2) &&
                              colorType === "goldenYellow"
                            ? "#FFD400"
                            : fontSize !== "Extra large" &&
                              colorType === "goldenYellow"
                            ? "#FEEA80"
                            : (fontSize === "Extra large" ||
                                activeSizeNumber >= 2) &&
                              colorType === "hotPink"
                            ? "#F9197F"
                            : fontSize !== "Extra large" &&
                              colorType === "hotPink"
                            ? "#FC8CC0"
                            : (fontSize === "Extra large" ||
                                activeSizeNumber >= 2) &&
                              colorType === "royalPurple"
                            ? "#7855FF"
                            : fontSize !== "Extra large" &&
                              colorType === "royalPurple"
                            ? "#BCABFF"
                            : (fontSize === "Extra large" ||
                                activeSizeNumber >= 2) &&
                              colorType === "tangerine"
                            ? "#FE7900"
                            : fontSize !== "Extra large" &&
                              colorType === "tangerine"
                            ? "#FFBD80"
                            : (fontSize === "Extra large" ||
                                activeSizeNumber >= 2) &&
                              colorType === "teal"
                            ? "#00BA7C"
                            : fontSize !== "Extra large" && colorType === "teal"
                            ? "#7FDDBE"
                            : null,
                        width: fontSize === "Extra large" ? "16px" : "12px",
                        height: fontSize === "Extra large" ? "16px" : "12px",
                        borderRadius: "50%",
                        zIndex: 3,
                      }}
                    ></div>
                  </div>
                </div>
              </BootstrapTooltip>
            </div>
            <div
              style={{
                fontSize:
                  fontSize === "Default"
                    ? "20px"
                    : fontSize === "Small"
                    ? "19px"
                    : fontSize === "Extra small"
                    ? "18px"
                    : fontSize === "Large"
                    ? "22px"
                    : fontSize === "Extra large"
                    ? "24px"
                    : null,
                lineHeight:
                  fontSize === "Default"
                    ? "24px"
                    : fontSize === "Small"
                    ? "23px"
                    : fontSize === "Extra small"
                    ? "22px"
                    : fontSize === "Large"
                    ? "26px"
                    : fontSize === "Extra large"
                    ? "29px"
                    : null,
              }}
            >
              Aa
            </div>
          </div>
        </div>{" "}
        <div
          className="mt-4"
          style={{
            borderBottom:
              themeName !== "dark-theme"
                ? "1px solid rgba(0, 0, 0, 0.1)"
                : // : "0.1px solid rgb(70, 70, 70)",
                  "1px solid rgb(70, 70, 70)",
          }}
        ></div>{" "}
        <div
          style={{
            paddingLeft: "16px",
            paddingRight: "16px",
          }}
          className="mt-3 mb-3"
        >
          <div>
            <span
              className={
                themeName === "dark-theme"
                  ? "soft-grey-dark-theme-text-variant-1 chirp-bold-font"
                  : "very-dark-gray-light-theme-text-variant-1 chirp-bold-font"
              }
              style={{
                fontSize:
                  fontSize === "Default"
                    ? "20px"
                    : fontSize === "Small"
                    ? "19px"
                    : fontSize === "Extra small"
                    ? "18px"
                    : fontSize === "Large"
                    ? "22px"
                    : fontSize === "Extra large"
                    ? "24px"
                    : null,
                lineHeight:
                  fontSize === "Default"
                    ? "24px"
                    : fontSize === "Small"
                    ? "23px"
                    : fontSize === "Extra small"
                    ? "22px"
                    : fontSize === "Large"
                    ? "26px"
                    : fontSize === "Extra large"
                    ? "29px"
                    : null,
              }}
            >
              Color
            </span>
          </div>
          <div
            className="mt-3"
            style={{ display: "flex", justifyContent: "space-around" }}
          >
            <div
              onClick={() => setColorType("skyBlue")}
              style={{
                width: "45px",
                height: "45px",
                backgroundColor: "#1C9BEF",
                borderRadius: "50%",
                padding: "4px 0px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              {colorType === "skyBlue" && (
                <svg
                  width={25}
                  height={25}
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-jwli3a r-6zzn7w r-q1j0wu"
                  fill="white"
                >
                  <g>
                    <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                  </g>
                </svg>
              )}
            </div>
            <div
              onClick={() => setColorType("goldenYellow")}
              style={{
                width: "45px",
                height: "45px",
                backgroundColor: "#FFD400",
                borderRadius: "50%",
                padding: "4px 0px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              {colorType === "goldenYellow" && (
                <svg
                  width={25}
                  height={25}
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-jwli3a r-6zzn7w r-q1j0wu"
                  fill="white"
                >
                  <g>
                    <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                  </g>
                </svg>
              )}
            </div>
            <div
              onClick={() => setColorType("hotPink")}
              style={{
                width: "45px",
                height: "45px",
                backgroundColor: "#F9197F",
                borderRadius: "50%",
                padding: "4px 0px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              {colorType === "hotPink" && (
                <svg
                  width={25}
                  height={25}
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-jwli3a r-6zzn7w r-q1j0wu"
                  fill="white"
                >
                  <g>
                    <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                  </g>
                </svg>
              )}
            </div>
            <div
              onClick={() => setColorType("royalPurple")}
              style={{
                width: "45px",
                height: "45px",
                backgroundColor: "#7855FF",
                borderRadius: "50%",
                padding: "4px 0px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              {colorType === "royalPurple" && (
                <svg
                  width={25}
                  height={25}
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-jwli3a r-6zzn7w r-q1j0wu"
                  fill="white"
                >
                  <g>
                    <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                  </g>
                </svg>
              )}
            </div>
            <div
              onClick={() => setColorType("tangerine")}
              style={{
                width: "45px",
                height: "45px",
                backgroundColor: "#FE7900",
                borderRadius: "50%",
                padding: "4px 0px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              {colorType === "tangerine" && (
                <svg
                  width={25}
                  height={25}
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-jwli3a r-6zzn7w r-q1j0wu"
                  fill="white"
                >
                  <g>
                    <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                  </g>
                </svg>
              )}
            </div>
            <div
              onClick={() => setColorType("teal")}
              style={{
                width: "45px",
                height: "45px",
                backgroundColor: "#00BA7C",
                borderRadius: "50%",
                padding: "4px 0px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              {colorType === "teal" && (
                <svg
                  width={25}
                  height={25}
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-jwli3a r-6zzn7w r-q1j0wu"
                  fill="white"
                >
                  <g>
                    <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                  </g>
                </svg>
              )}
            </div>
          </div>
        </div>{" "}
        <div
          className="mt-4"
          style={{
            borderBottom:
              themeName !== "dark-theme"
                ? "1px solid rgba(0, 0, 0, 0.1)"
                : // : "0.1px solid rgb(70, 70, 70)",
                  "1px solid rgb(70, 70, 70)",
          }}
        ></div>{" "}
        <div
          style={{
            paddingLeft: "16px",
          }}
          className="mt-3 mb-3"
        >
          <div>
            <span
              className={
                themeName === "dark-theme"
                  ? "soft-grey-dark-theme-text-variant-1 chirp-bold-font"
                  : "very-dark-gray-light-theme-text-variant-1 chirp-bold-font"
              }
              style={{
                fontSize:
                  fontSize === "Default"
                    ? "20px"
                    : fontSize === "Small"
                    ? "19px"
                    : fontSize === "Extra small"
                    ? "18px"
                    : fontSize === "Large"
                    ? "22px"
                    : fontSize === "Extra large"
                    ? "24px"
                    : null,
                lineHeight:
                  fontSize === "Default"
                    ? "24px"
                    : fontSize === "Small"
                    ? "23px"
                    : fontSize === "Extra small"
                    ? "22px"
                    : fontSize === "Large"
                    ? "26px"
                    : fontSize === "Extra large"
                    ? "29px"
                    : null,
              }}
            >
              Background
            </span>
          </div>
          <div
            className="mt-4"
            style={{
              display: "flex",
              justifyContent: "space-evenly",
              flexDirection: width <= 700 ? "column" : "row",
              paddingRight: "16px",
              gap: width <= 700 ? "8px" : null,
            }}
          >
            {" "}
            <div
              onClick={() => toggleThemeBetweenLightDarkMode()}
              style={{
                height: "62px",
                width: width <= 700 ? "100%" : "180px",
                maxWidth: width <= 700 ? "100%" : "180px",
                maxHeight: "62px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                border:
                  themeName === "light-theme" && colorType === "skyBlue"
                    ? "2px solid #1C9BEF"
                    : themeName === "light-theme" &&
                      colorType === "goldenYellow"
                    ? "2px solid #FFD400"
                    : themeName === "light-theme" && colorType === "hotPink"
                    ? "2px solid #F9197F"
                    : themeName === "light-theme" && colorType === "royalPurple"
                    ? "2px solid #7855FF"
                    : themeName === "light-theme" && colorType === "tangerine"
                    ? "2px solid #FE7900"
                    : themeName === "light-theme" && colorType === "teal"
                    ? "2px solid #00BA7C"
                    : "none",
                borderRadius: "4px",
                backgroundColor:
                  themeName === "dark-theme" ? "#FFFFFF" : "white",
                cursor: "pointer",
              }}
            >
              {" "}
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  padding: "0px 16px",
                  alignItems: "center",
                  justifyContent: "flex-start",
                }}
              >
                <div
                  className={
                    themeName === "light-theme"
                      ? "hover-background-effect-clicked-light-theme"
                      : themeName !== "light-theme"
                      ? "hover-background-effect-clicked-non-light-theme"
                      : null
                  }
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      backgroundColor:
                        colorType === "skyBlue" && themeName === "light-theme"
                          ? "#1C9BEF"
                          : colorType === "goldenYellow" &&
                            themeName === "light-theme"
                          ? "#FFD400"
                          : colorType === "hotPink" &&
                            themeName === "light-theme"
                          ? "#F9197F"
                          : colorType === "royalPurple" &&
                            themeName === "light-theme"
                          ? " #7855FF"
                          : colorType === "tangerine" &&
                            themeName === "light-theme"
                          ? " #FE7900"
                          : colorType === "teal" && themeName === "light-theme"
                          ? " #00BA7C"
                          : "transparent",
                      border:
                        themeName === "light-theme"
                          ? "none"
                          : themeName !== "dark-theme"
                          ? "2px solid #71767A"
                          : "2px solid #B9C9D3",
                      width: "20px",
                      height: "20px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: "50%",
                    }}
                  >
                    <svg
                      style={{
                        display:
                          themeName === "light-theme" ? "initial" : "none",
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
                <div
                  className="chirp-bold-font very-dark-gray-light-theme-text-variant-1"
                  style={{
                    marginLeft: "15px",
                    fontSize:
                      fontSize === "Default"
                        ? "15px"
                        : fontSize === "Small"
                        ? "14px"
                        : fontSize === "Extra small"
                        ? "14px"
                        : fontSize === "Large"
                        ? "17px"
                        : fontSize === "Extra large"
                        ? "18px"
                        : null,
                    lineHeight:
                      fontSize === "Default"
                        ? "20px"
                        : fontSize === "Small"
                        ? "19px"
                        : fontSize === "Extra small"
                        ? "18px"
                        : fontSize === "Large"
                        ? "22px"
                        : fontSize === "Extra large"
                        ? "24px"
                        : null,
                  }}
                >
                  Default
                </div>
              </div>
            </div>
            <div
              style={{
                height: "62px",
                width: width <= 700 ? "100%" : "180px",
                maxWidth: width <= 700 ? "100%" : "180px",
                maxHeight: "62px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#15202B",
                borderRadius: "4px",
                border: themeName === "dark-theme" ? "1px solid #333639" : null,
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  padding: "0px 16px",
                  alignItems: "center",
                  justifyContent: "flex-start",
                }}
              >
                <div
                  className={
                    themeName === "dark-shade-blue-theme"
                      ? "hover-background-effect-clicked-dim-theme"
                      : themeName !== "dark-shade-blue-theme"
                      ? "hover-background-effect-clicked-non-dim-theme"
                      : null
                  }
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      backgroundColor:
                        themeName === "dark-shade-blue-theme"
                          ? "#1d9bf0"
                          : "transparent",
                      border:
                        themeName === "dark-shade-blue-theme"
                          ? "none"
                          : themeName !== "dark-shade-blue-theme"
                          ? "2px solid #71767A"
                          : "2px solid #5D6D7D",
                      width: "20px",
                      height: "20px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: "50%",
                    }}
                  >
                    <svg
                      style={{
                        display:
                          themeName === "dark-shade-blue-theme"
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
                <div
                  className="soft-grey-dark-theme-text-variant-1 chirp-bold-font"
                  style={{
                    marginLeft: "15px",
                    fontSize:
                      fontSize === "Default"
                        ? "15px"
                        : fontSize === "Small"
                        ? "14px"
                        : fontSize === "Extra small"
                        ? "14px"
                        : fontSize === "Large"
                        ? "17px"
                        : fontSize === "Extra large"
                        ? "18px"
                        : null,
                    lineHeight:
                      fontSize === "Default"
                        ? "20px"
                        : fontSize === "Small"
                        ? "19px"
                        : fontSize === "Extra small"
                        ? "18px"
                        : fontSize === "Large"
                        ? "22px"
                        : fontSize === "Extra large"
                        ? "24px"
                        : null,
                  }}
                >
                  Dim
                </div>
              </div>
            </div>
            <div
              onClick={() => toggleThemeBetweenLightDarkMode()}
              style={{
                height: "62px",
                width: width <= 700 ? "100%" : "180px",
                maxWidth: width <= 700 ? "100%" : "180px",
                maxHeight: "62px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#000000",
                border:
                  themeName === "dark-theme" && colorType === "skyBlue"
                    ? "2px solid #1C9BEF"
                    : themeName === "dark-theme" && colorType === "goldenYellow"
                    ? "2px solid #FFD400"
                    : themeName === "dark-theme" && colorType === "hotPink"
                    ? "2px solid #F9197F"
                    : themeName === "dark-theme" && colorType === "royalPurple"
                    ? "2px solid #7855FF"
                    : themeName === "dark-theme" && colorType === "tangerine"
                    ? "2px solid #FE7900"
                    : themeName === "dark-theme" && colorType === "teal"
                    ? "2px solid #00BA7C"
                    : "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  padding: "0px 16px",
                  alignItems: "center",
                  justifyContent: "flex-start",
                }}
              >
                <div
                  className={
                    themeName === "dark-theme"
                      ? "hover-background-effect-clicked-dark-theme"
                      : themeName !== "dark-theme"
                      ? "hover-background-effect-clicked-non-dark-theme"
                      : null
                  }
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      backgroundColor:
                        colorType === "skyBlue" && themeName === "dark-theme"
                          ? "#1C9BEF"
                          : colorType === "goldenYellow" &&
                            themeName === "dark-theme"
                          ? "#FFD400"
                          : colorType === "hotPink" &&
                            themeName === "dark-theme"
                          ? "#F9197F"
                          : colorType === "royalPurple" &&
                            themeName === "dark-theme"
                          ? " #7855FF"
                          : colorType === "tangerine" &&
                            themeName === "dark-theme"
                          ? " #FE7900"
                          : colorType === "teal" && themeName === "dark-theme"
                          ? " #00BA7C"
                          : "transparent",
                      border:
                        themeName === "dark-theme"
                          ? "none"
                          : themeName !== "dark-theme"
                          ? "2px solid #3E4144"
                          : "2px solid rgb(70, 70, 70)",
                      width: "20px",
                      height: "20px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: "50%",
                    }}
                  >
                    <svg
                      style={{
                        display:
                          themeName === "dark-theme" ? "initial" : "none",
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
                <div
                  className="soft-grey-dark-theme-text-variant-1 chirp-bold-font"
                  style={{
                    marginLeft: "15px",
                    fontSize:
                      fontSize === "Default"
                        ? "15px"
                        : fontSize === "Small"
                        ? "14px"
                        : fontSize === "Extra small"
                        ? "14px"
                        : fontSize === "Large"
                        ? "17px"
                        : fontSize === "Extra large"
                        ? "18px"
                        : null,
                    lineHeight:
                      fontSize === "Default"
                        ? "20px"
                        : fontSize === "Small"
                        ? "19px"
                        : fontSize === "Extra small"
                        ? "18px"
                        : fontSize === "Large"
                        ? "22px"
                        : fontSize === "Extra large"
                        ? "24px"
                        : null,
                  }}
                >
                  Lights out
                </div>
              </div>
            </div>
          </div>
        </div>{" "}
      </Col>
    </>
  );
}

export default Display;
