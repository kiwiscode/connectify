import { useContext } from "react";
import { Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import SettingsNavigation from "../../../../components/SettingsNavigation/SettingsNavigation";
import ResponsiveNavigationBarBottom from "../../../../components/Navbar/ResponsiveNavigationBottom";
import { ModalVisibilityContext } from "../../../../context/ModalVisibilityContext";
import { useAntdMessageHandler } from "../../../../utils/useAntdMessageHandler";
import useWindowDimensions from "../../../../hooks/getWindowDimensions";
import { ThemeContext } from "../../../../context/ThemeContext";
import { useFontSizeHandler } from "../../../../utils/useFontSizeHandler";

function About() {
  const [{ themeName }] = useContext(ThemeContext);
  const { width } = useWindowDimensions();

  const { contextHolder } = useAntdMessageHandler();

  const { isPostModalVisible } = useContext(ModalVisibilityContext);

  const navigate = useNavigate();

  const { getFontSizeAndLineHeight20, getFontSizeAndLineHeight13 } =
    useFontSizeHandler();
  const font20 = getFontSizeAndLineHeight20();
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
                : // : "0.1px solid rgb(70, 70, 70)",
                  "1px solid rgb(70, 70, 70)"
              : null,
          borderRight:
            themeName !== "dark-theme"
              ? "1px solid rgba(0, 0, 0, 0.1)"
              : // : "0.1px solid rgb(70, 70, 70)",
                "1px solid rgb(70, 70, 70)",
          borderTop: "none ",
          borderBottom: "none",
          padding: "0px",
          margin: "0px",
          width:
            width > 1400
              ? "580px"
              : width <= 1400 && width > 1355
              ? "600px"
              : width <= 1355 && width > 1288
              ? "580px"
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
          className="chirp-bold-font"
          style={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            paddingLeft: width <= 500 ? "32px" : "12px",
            paddingRight: width <= 500 ? "32px" : "12px",
            fontSize: font20.fontSize,
            lineHeight: font20.lineHeight,
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
                ? "soft-grey-dark-theme-text-variant-1 mt-3"
                : "very-dark-gray-light-theme-text-variant-1 mt-3"
            }
          >
            Additional resources
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
          Check out other places for helpful information to learn more about C
          products and services.
        </div>
        <div
          style={{
            fontSize: font20.fontSize,
            lineHeight: font20.lineHeight,
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            paddingLeft: width <= 500 ? "32px" : "12px",
            paddingRight: width <= 500 ? "32px" : "12px",
          }}
          className="mt-3 chirp-bold-font"
        >
          Release notes
        </div>

        <div
          className={
            themeName === "dark-theme"
              ? "dark-theme-settings mt-3"
              : "light-theme-settings mt-3"
          }
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            className={
              themeName === "dark-theme"
                ? "has-children-dark-theme"
                : "has-children-light-theme"
            }
            style={{
              display: "flex",
              justifyContent: "space-between",
              paddingLeft: width <= 500 ? "21px" : "0px",
              paddingRight: width <= 500 ? "21px" : "0px",
              padding: "12px 0px",
              margin: "0px",
              cursor: "default",
              pointerEvents: "none",
              opacity: "0.5",
            }}
          >
            <div>Privacy center</div>
            <div>
              {" "}
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <g>
                  <path d="M8 6h10v10h-2V9.41L5.957 19.46l-1.414-1.42L14.586 8H8V6z"></path>
                </g>
              </svg>
            </div>
          </div>
          <div
            style={{
              borderBottom:
                themeName !== "dark-theme"
                  ? "1px solid rgba(0, 0, 0, 0.1)"
                  : // : "0.1px solid rgb(70, 70, 70)",
                    "1px solid rgb(70, 70, 70)",
            }}
          ></div>
        </div>
        <div
          style={{
            fontSize: font20.fontSize,
            lineHeight: font20.lineHeight,
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            paddingLeft: width <= 500 ? "32px" : "12px",
            paddingRight: width <= 500 ? "32px" : "12px",
          }}
          className="mt-3 chirp-bold-font"
        >
          Legal
        </div>

        <div
          className={
            themeName === "dark-theme"
              ? "dark-theme-settings mt-3"
              : "light-theme-settings mt-3"
          }
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            className={
              themeName === "dark-theme"
                ? "has-children-dark-theme"
                : "has-children-light-theme"
            }
            style={{
              display: "flex",
              justifyContent: "space-between",
              paddingLeft: width <= 500 ? "21px" : "0px",
              paddingRight: width <= 500 ? "21px" : "0px",
              padding: "12px 0px",
              margin: "0px",
              cursor: "default",
              pointerEvents: "none",
              opacity: "0.5",
            }}
          >
            <div>Ads info</div>
            <div>
              {" "}
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <g>
                  <path d="M8 6h10v10h-2V9.41L5.957 19.46l-1.414-1.42L14.586 8H8V6z"></path>
                </g>
              </svg>
            </div>
          </div>
          <div
            className={
              themeName === "dark-theme"
                ? "has-children-dark-theme"
                : "has-children-light-theme"
            }
            style={{
              display: "flex",
              justifyContent: "space-between",
              paddingLeft: width <= 500 ? "21px" : "0px",
              paddingRight: width <= 500 ? "21px" : "0px",
              padding: "12px 0px",
              margin: "0px",
              cursor: "default",
              pointerEvents: "none",
              opacity: "0.5",
            }}
          >
            <div>Cookie Policy</div>
            <div>
              {" "}
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <g>
                  <path d="M8 6h10v10h-2V9.41L5.957 19.46l-1.414-1.42L14.586 8H8V6z"></path>
                </g>
              </svg>
            </div>
          </div>
          <div
            className={
              themeName === "dark-theme"
                ? "has-children-dark-theme"
                : "has-children-light-theme"
            }
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "12px 0px",
              paddingLeft: width <= 500 ? "21px" : "0px",
              paddingRight: width <= 500 ? "21px" : "0px",
              margin: "0px",
              cursor: "default",
              pointerEvents: "none",
              opacity: "0.5",
            }}
          >
            <div>Imprint</div>
            <div>
              {" "}
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <g>
                  <path d="M8 6h10v10h-2V9.41L5.957 19.46l-1.414-1.42L14.586 8H8V6z"></path>
                </g>
              </svg>
            </div>
          </div>
          <div
            className={
              themeName === "dark-theme"
                ? "has-children-dark-theme"
                : "has-children-light-theme"
            }
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "12px 0px",
              paddingLeft: width <= 500 ? "21px" : "0px",
              paddingRight: width <= 500 ? "21px" : "0px",
              margin: "0px",
              cursor: "default",
              pointerEvents: "none",
              opacity: "0.5",
            }}
          >
            <div>MStV Transparenzangaben</div>
            <div>
              {" "}
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <g>
                  <path d="M8 6h10v10h-2V9.41L5.957 19.46l-1.414-1.42L14.586 8H8V6z"></path>
                </g>
              </svg>
            </div>
          </div>
          <div
            className={
              themeName === "dark-theme"
                ? "has-children-dark-theme"
                : "has-children-light-theme"
            }
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "12px 0px",
              paddingLeft: width <= 500 ? "21px" : "0px",
              paddingRight: width <= 500 ? "21px" : "0px",
              margin: "0px",
              cursor: "default",
              pointerEvents: "none",
              opacity: "0.5",
            }}
          >
            <div>Privacy Policy</div>
            <div>
              {" "}
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <g>
                  <path d="M8 6h10v10h-2V9.41L5.957 19.46l-1.414-1.42L14.586 8H8V6z"></path>
                </g>
              </svg>
            </div>
          </div>
          <div
            className={
              themeName === "dark-theme"
                ? "has-children-dark-theme"
                : "has-children-light-theme"
            }
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "12px 0px",
              paddingLeft: width <= 500 ? "21px" : "0px",
              paddingRight: width <= 500 ? "21px" : "0px",
              margin: "0px",
              cursor: "default",
              pointerEvents: "none",
              opacity: "0.5",
            }}
          >
            <div>Terms of Service</div>
            <div>
              {" "}
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <g>
                  <path d="M8 6h10v10h-2V9.41L5.957 19.46l-1.414-1.42L14.586 8H8V6z"></path>
                </g>
              </svg>
            </div>
          </div>
          <div
            style={{
              borderBottom:
                themeName !== "dark-theme"
                  ? "1px solid rgba(0, 0, 0, 0.1)"
                  : // : "0.1px solid rgb(70, 70, 70)",
                    "1px solid rgb(70, 70, 70)",
            }}
          ></div>
        </div>
        <div
          style={{
            fontSize: font20.fontSize,
            lineHeight: font20.lineHeight,
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            paddingLeft: width <= 500 ? "32px" : "12px",
            paddingRight: width <= 500 ? "32px" : "12px",
          }}
          className="mt-3 chirp-bold-font"
        >
          Miscellaneous
        </div>

        <div
          className={
            themeName === "dark-theme"
              ? "dark-theme-settings mt-3 mb-5"
              : "light-theme-settings mt-3 mb-5"
          }
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            className={
              themeName === "dark-theme"
                ? "has-children-dark-theme"
                : "has-children-light-theme"
            }
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "12px 0px",
              paddingLeft: width <= 500 ? "21px" : "0px",
              paddingRight: width <= 500 ? "21px" : "0px",
              margin: "0px",
              cursor: "default",
              pointerEvents: "none",
              opacity: "0.5",
            }}
          >
            <div>About</div>
            <div>
              {" "}
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <g>
                  <path d="M8 6h10v10h-2V9.41L5.957 19.46l-1.414-1.42L14.586 8H8V6z"></path>
                </g>
              </svg>
            </div>
          </div>
          <div
            className={
              themeName === "dark-theme"
                ? "has-children-dark-theme"
                : "has-children-light-theme"
            }
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "12px 0px",
              paddingLeft: width <= 500 ? "21px" : "0px",
              paddingRight: width <= 500 ? "21px" : "0px",
              margin: "0px",
              cursor: "default",
              pointerEvents: "none",
              opacity: "0.5",
            }}
          >
            <div>Accessibility</div>
            <div>
              {" "}
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <g>
                  <path d="M8 6h10v10h-2V9.41L5.957 19.46l-1.414-1.42L14.586 8H8V6z"></path>
                </g>
              </svg>
            </div>
          </div>
          <div
            className={
              themeName === "dark-theme"
                ? "has-children-dark-theme"
                : "has-children-light-theme"
            }
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "12px 0px",
              margin: "0px",
              paddingLeft: width <= 500 ? "21px" : "0px",
              paddingRight: width <= 500 ? "21px" : "0px",
              cursor: "default",
              pointerEvents: "none",
              opacity: "0.5",
            }}
          >
            <div>Imprint</div>
            <div>
              {" "}
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <g>
                  <path d="M8 6h10v10h-2V9.41L5.957 19.46l-1.414-1.42L14.586 8H8V6z"></path>
                </g>
              </svg>
            </div>
          </div>
          <div
            className={
              themeName === "dark-theme"
                ? "has-children-dark-theme"
                : "has-children-light-theme"
            }
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "12px 0px",
              margin: "0px",
              paddingLeft: width <= 500 ? "21px" : "0px",
              paddingRight: width <= 500 ? "21px" : "0px",
              cursor: "default",
              pointerEvents: "none",
              opacity: "0.5",
            }}
          >
            <div>Advertising</div>
            <div>
              {" "}
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <g>
                  <path d="M8 6h10v10h-2V9.41L5.957 19.46l-1.414-1.42L14.586 8H8V6z"></path>
                </g>
              </svg>
            </div>
          </div>
          <div
            className={
              themeName === "dark-theme"
                ? "has-children-dark-theme"
                : "has-children-light-theme"
            }
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "12px 0px",
              margin: "0px",
              paddingLeft: width <= 500 ? "21px" : "0px",
              paddingRight: width <= 500 ? "21px" : "0px",
              cursor: "default",
              pointerEvents: "none",
              opacity: "0.5",
            }}
          >
            <div>Privacy Policy</div>
            <div>
              {" "}
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <g>
                  <path d="M8 6h10v10h-2V9.41L5.957 19.46l-1.414-1.42L14.586 8H8V6z"></path>
                </g>
              </svg>
            </div>
          </div>
          <div
            className={
              themeName === "dark-theme"
                ? "has-children-dark-theme"
                : "has-children-light-theme"
            }
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "12px 0px",
              margin: "0px",
              paddingLeft: width <= 500 ? "21px" : "0px",
              paddingRight: width <= 500 ? "21px" : "0px",
              cursor: "default",
              pointerEvents: "none",
              opacity: "0.5",
            }}
          >
            <div>Blog</div>
            <div>
              {" "}
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <g>
                  <path d="M8 6h10v10h-2V9.41L5.957 19.46l-1.414-1.42L14.586 8H8V6z"></path>
                </g>
              </svg>
            </div>
          </div>{" "}
          <div
            className={
              themeName === "dark-theme"
                ? "has-children-dark-theme"
                : "has-children-light-theme"
            }
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "12px 0px",
              margin: "0px",
              paddingLeft: width <= 500 ? "21px" : "0px",
              paddingRight: width <= 500 ? "21px" : "0px",
              cursor: "default",
              pointerEvents: "none",
              opacity: "0.5",
            }}
          >
            <div>Brand Resources</div>
            <div>
              {" "}
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <g>
                  <path d="M8 6h10v10h-2V9.41L5.957 19.46l-1.414-1.42L14.586 8H8V6z"></path>
                </g>
              </svg>
            </div>
          </div>{" "}
          <div
            className={
              themeName === "dark-theme"
                ? "has-children-dark-theme"
                : "has-children-light-theme"
            }
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "12px 0px",
              margin: "0px",
              paddingLeft: width <= 500 ? "21px" : "0px",
              paddingRight: width <= 500 ? "21px" : "0px",
              cursor: "default",
              pointerEvents: "none",
              opacity: "0.5",
            }}
          >
            <div>Careers</div>
            <div>
              {" "}
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <g>
                  <path d="M8 6h10v10h-2V9.41L5.957 19.46l-1.414-1.42L14.586 8H8V6z"></path>
                </g>
              </svg>
            </div>
          </div>{" "}
          <div
            className={
              themeName === "dark-theme"
                ? "has-children-dark-theme"
                : "has-children-light-theme"
            }
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "12px 0px",
              margin: "0px",
              paddingLeft: width <= 500 ? "21px" : "0px",
              paddingRight: width <= 500 ? "21px" : "0px",
              cursor: "default",
              pointerEvents: "none",
              opacity: "0.5",
            }}
          >
            <div>Developers</div>
            <div>
              {" "}
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <g>
                  <path d="M8 6h10v10h-2V9.41L5.957 19.46l-1.414-1.42L14.586 8H8V6z"></path>
                </g>
              </svg>
            </div>
          </div>{" "}
          <div
            className={
              themeName === "dark-theme"
                ? "has-children-dark-theme"
                : "has-children-light-theme"
            }
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "12px 0px",
              margin: "0px",
              paddingLeft: width <= 500 ? "21px" : "0px",
              paddingRight: width <= 500 ? "21px" : "0px",
              cursor: "default",
              pointerEvents: "none",
              opacity: "0.5",
            }}
          >
            <div>Directory</div>
            <div>
              {" "}
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <g>
                  <path d="M8 6h10v10h-2V9.41L5.957 19.46l-1.414-1.42L14.586 8H8V6z"></path>
                </g>
              </svg>
            </div>
          </div>{" "}
          <div
            className={
              themeName === "dark-theme"
                ? "has-children-dark-theme"
                : "has-children-light-theme"
            }
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "12px 0px",
              margin: "0px",
              paddingLeft: width <= 500 ? "21px" : "0px",
              paddingRight: width <= 500 ? "21px" : "0px",
              cursor: "default",
              pointerEvents: "none",
              opacity: "0.5",
            }}
          >
            <div>Download the C app</div>
            <div>
              {" "}
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <g>
                  <path d="M8 6h10v10h-2V9.41L5.957 19.46l-1.414-1.42L14.586 8H8V6z"></path>
                </g>
              </svg>
            </div>
          </div>{" "}
          <div
            className={
              themeName === "dark-theme"
                ? "has-children-dark-theme"
                : "has-children-light-theme"
            }
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "12px 0px",
              margin: "0px",
              paddingLeft: width <= 500 ? "21px" : "0px",
              paddingRight: width <= 500 ? "21px" : "0px",
              cursor: "default",
              pointerEvents: "none",
              opacity: "0.5",
            }}
          >
            <div>Help Center</div>
            <div>
              {" "}
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <g>
                  <path d="M8 6h10v10h-2V9.41L5.957 19.46l-1.414-1.42L14.586 8H8V6z"></path>
                </g>
              </svg>
            </div>
          </div>{" "}
          <div
            className={
              themeName === "dark-theme"
                ? "has-children-dark-theme"
                : "has-children-light-theme"
            }
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "12px 0px",
              margin: "0px",
              paddingLeft: width <= 500 ? "21px" : "0px",
              paddingRight: width <= 500 ? "21px" : "0px",
              cursor: "default",
              pointerEvents: "none",
              opacity: "0.5",
            }}
          >
            <div>Marketing</div>
            <div>
              {" "}
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <g>
                  <path d="M8 6h10v10h-2V9.41L5.957 19.46l-1.414-1.42L14.586 8H8V6z"></path>
                </g>
              </svg>
            </div>
          </div>
          <div
            className={
              themeName === "dark-theme"
                ? "has-children-dark-theme"
                : "has-children-light-theme"
            }
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "12px 0px",
              margin: "0px",
              paddingLeft: width <= 500 ? "21px" : "0px",
              paddingRight: width <= 500 ? "21px" : "0px",
              cursor: "default",
              pointerEvents: "none",
              opacity: "0.5",
            }}
          >
            <div>C for Business</div>
            <div>
              {" "}
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <g>
                  <path d="M8 6h10v10h-2V9.41L5.957 19.46l-1.414-1.42L14.586 8H8V6z"></path>
                </g>
              </svg>
            </div>
          </div>
        </div>
      </Col>
    </>
  );
}
export default About;
