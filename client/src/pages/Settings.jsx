import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import { ThemeContext } from "../context/ThemeContext";
import useWindowDimensions from "../hooks/getWindowDimensions";
import { Col, Stack } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAntdMessageHandler } from "../utils/useAntdMessageHandler";
import ResponsiveNavigationBarBottom from "../components/Navbar/ResponsiveNavigationBottom";
import { ModalVisibilityContext } from "../context/ModalVisibilityContext";
import { NavigationHistoryContext } from "../context/NavigationHistoryContext";
import { useFontSizeHandler } from "../utils/useFontSizeHandler";

function Settings() {
  const { userInfo } = useContext(UserContext);
  const [{ themeName }] = useContext(ThemeContext);
  const { width } = useWindowDimensions();

  const { contextHolder } = useAntdMessageHandler();

  const { isPostModalVisible } = useContext(ModalVisibilityContext);

  const [onFocus, setOnFocus] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const setSearchTermEmpty = () => {
    setSearchTerm("");
  };

  const handleSetSearchTerm = (e) => {
    setSearchTerm(e.target.value);
  };
  const onFocusActive = () => {
    setOnFocus(true);
  };

  const navigate = useNavigate();

  const [isSearchStart, setSearchStart] = useState(null);

  const [showNotificationMessage, setShowNotificationMessage] = useState(null);

  const { navigationHistoryArray } = useContext(NavigationHistoryContext);
  const {
    getFontSizeAndLineHeight20,
    getFontSizeAndLineHeight17,
    getFontSizeAndLineHeight15,
    getFontSizeAndLineHeight14,
    getFontSizeAndLineHeight13,
  } = useFontSizeHandler();
  const font20 = getFontSizeAndLineHeight20();
  const font17 = getFontSizeAndLineHeight17();
  const font15 = getFontSizeAndLineHeight15();
  const font14 = getFontSizeAndLineHeight14();
  const font13 = getFontSizeAndLineHeight13();
  useEffect(() => {
    if (width >= 1000) {
      navigate("/settings/account");
    }
  }, [width]);

  return (
    <>
      {!isPostModalVisible && <ResponsiveNavigationBarBottom />}
      {contextHolder}
      <Col
        xs={width <= 500 ? 12 : 10} // 0px - 576px aralığı
        sm={10} // 576px - 768px aralığı
        md={11} // 768px - 992px aralığı
        lg={10}
        style={{
          borderLeft:
            themeName !== "dark-theme"
              ? "1px solid rgba(0, 0, 0, 0.1)"
              : // : "0.1px solid rgb(70, 70, 70)",
                "1px solid rgb(70, 70, 70)",

          borderRight:
            themeName !== "dark-theme"
              ? "1px solid rgba(0, 0, 0, 0.1)"
              : // : "0.1px solid rgb(70, 70, 70)",
                "1px solid rgb(70, 70, 70)",
          borderTop: "none ",
          borderBottom: "none",
          padding: "0px",
          width: width > 1400 ? "440px" : "",
        }}
      >
        <Stack
          direction="vertical"
          gap={3}
          className={width <= 500 ? "" : "mt-2"}
          style={{
            height: width <= 500 ? "675px" : "",
          }}
        >
          {width <= 500 ? (
            <div
              style={{
                height: "53px",
                padding: "0px 16px",
                boxSizing: "border-box",
                flexBasis: "auto",
                flexShrink: "0",
                margin: "0px",
                minHeight: "0px",
                minWidth: "0px",
                position: "relative",
                textDecoration: "none",
                zIndex: 0,
                pointerEvents: "auto !important",
              }}
            >
              <div
                style={{
                  display: "flex",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    width: "53px",
                    height: "53px",
                    maxHeight: "53px",
                  }}
                >
                  <div
                    onClick={() => navigate(-1)}
                    className={`arrow arrow-${themeName}`}
                    style={{
                      width: "36px",
                      height: "36px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: "50%",
                      cursor: "pointer",
                    }}
                  >
                    <svg
                      fill={
                        themeName === "dark-theme"
                          ? "rgb(231,233,234)"
                          : "rgb(15, 20, 25)"
                      }
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
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    justifyContent: "center",
                    height: "53px",
                    maxHeight: "53px",
                  }}
                >
                  <div
                    className={
                      themeName === "dark-theme"
                        ? "soft-grey-dark-theme-text-variant-1 chirp-bold-font"
                        : "very-dark-gray-light-theme-text-variant-1 chirp-bold-font"
                    }
                    style={{
                      fontSize: font17.fontSize,
                      lineHeight: font17.lineHeight,
                    }}
                  >
                    Settings
                  </div>
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
                    @{userInfo.username}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div
              className="chirp-bold-font"
              style={{
                paddingLeft: "12px",
                paddingRight: "12px",
                fontSize: font20.fontSize,
                lineHeight: font20.lineHeight,
              }}
            >
              <span>Settings</span>
            </div>
          )}
          <div
            className="first-div-input"
            style={{
              height: "54px",
              backgroundColor: themeName === "dark-theme" ? "black" : "white",
              maxWidth: "100%",
              minWidth: "fit-content",
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              paddingLeft: "12px",
              paddingRight: "12px",
            }}
          >
            {onFocus || isSearchStart ? (
              <div
                onClick={() => {
                  setSearchStart(false);
                  setOnFocus(false);
                  setSearchTerm("");
                  setShowNotificationMessage(false);
                }}
                className={`arrow arrow-${themeName}`}
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
              </div>
            ) : null}
            <div
              style={{
                position: "relative",
                width: "100%",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "8px",
                  left: ".5rem",
                }}
              >
                <svg
                  fill={
                    themeName === "dark-theme"
                      ? "#71767A"
                      : themeName !== "dark-theme"
                      ? "rgba(83, 100, 113, 1.00)"
                      : null
                    // : themeName === "dark-theme" && onFocus
                    // ? "#1C9BEF"
                    // : themeName !== "dark-theme" && onFocus
                    // ? "#1C9BEF"
                    // : null
                  }
                  width={`16px`}
                  height={`16px`}
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-14j79pv r-4wgw6l r-2dysd3"
                >
                  <g>
                    <path d="M10.25 3.75c-3.59 0-6.5 2.91-6.5 6.5s2.91 6.5 6.5 6.5c1.795 0 3.419-.726 4.596-1.904 1.178-1.177 1.904-2.801 1.904-4.596 0-3.59-2.91-6.5-6.5-6.5zm-8.5 6.5c0-4.694 3.806-8.5 8.5-8.5s8.5 3.806 8.5 8.5c0 1.986-.682 3.815-1.824 5.262l4.781 4.781-1.414 1.414-4.781-4.781c-1.447 1.142-3.276 1.824-5.262 1.824-4.694 0-8.5-3.806-8.5-8.5z"></path>
                  </g>
                </svg>
              </div>{" "}
              {searchTerm?.length ? (
                <div
                  onClick={() => {
                    setSearchTermEmpty();
                  }}
                  style={{
                    cursor: "pointer",
                    position: "absolute",
                    top: "11px",
                    right: "1rem",
                    display: "flex",
                  }}
                >
                  <svg
                    width={22}
                    height={22}
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-18yzcnr r-yc9v9c r-18jsvk2"
                  >
                    <g>
                      <path d="M12 1.75C6.34 1.75 1.75 6.34 1.75 12S6.34 22.25 12 22.25 22.25 17.66 22.25 12 17.66 1.75 12 1.75zm3.71 12.54l-1.42 1.42-2.29-2.3-2.29 2.3-1.42-1.42 2.3-2.29-2.3-2.29 1.42-1.42 2.29 2.3 2.29-2.3 1.42 1.42-2.3 2.29 2.3 2.29z"></path>
                    </g>
                  </svg>
                </div>
              ) : null}
              <input
                className="chirp-regular-font"
                onFocus={() => {
                  onFocusActive();
                  setShowNotificationMessage(true);
                }}
                onBlur={() => {
                  setOnFocus(false);
                }}
                onClick={() => {
                  setShowNotificationMessage(true);
                  setSearchStart(true);
                }}
                onChange={handleSetSearchTerm}
                value={searchTerm}
                style={{
                  height: "44px",
                  backgroundColor: "transparent",
                  border: onFocus
                    ? "2px solid #1e9bf0"
                    : themeName !== "dark-theme"
                    ? "1px solid rgba(0, 0, 0, 0.1)"
                    : "1px solid rgb(70, 70, 70)",
                  outlineStyle: "none",
                  borderRadius: "9999px",
                  borderWidth: "1px",
                  fontSize: font14.fontSize,
                  lineHeight: "20px",
                  wordWrap: "break-word",
                  color: themeName === "dark-theme" ? "white" : "black",
                  paddingLeft: "27px",
                  paddingRight: "40px",
                  minWidth: "fit-content",
                  width: "100%",
                  caretColor: "#1e9bf0",
                }}
                type="text"
                placeholder="Search Settings"
              />
            </div>
          </div>
          <div
            style={{
              color:
                themeName === "dark-theme" ? "#71767A" : "rgb(83, 100, 113)",
              fontSize: font15.fontSize,
              lineHeight: font15.lineHeight,
              display:
                !showNotificationMessage || searchTerm.length > 0 ? "none" : "",
              textAlign: "center",
            }}
          >
            Try searching for notifications, privacy, etc.
          </div>
          {/* setting options ...start to check  */}
          <div
            className={
              themeName === "dark-theme"
                ? "dark-theme-settings"
                : "light-theme-settings"
            }
            style={{
              padding: "0px",
              margin: "0px",
              display: onFocus || isSearchStart ? "none" : "",
            }}
          >
            <div
              className="has-children"
              onClick={() => {
                navigate("/settings/account");
              }}
              style={{
                display: "flex",
                justifyContent: "space-between",
                backgroundColor:
                  navigationHistoryArray[0] === "/settings/account" &&
                  themeName === "dark-theme"
                    ? "#16181c"
                    : navigationHistoryArray[0] === "/settings/account" &&
                      themeName !== "dark-theme"
                    ? "#f7f9f9"
                    : null,
                borderRight:
                  navigationHistoryArray[0] === "/settings/account"
                    ? "2px solid #1C9BEF"
                    : null,
              }}
            >
              <div>Your account</div>
              <div>
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-14j79pv r-1q142lx r-2dysd3"
                >
                  <g>
                    <path d="M14.586 12L7.543 4.96l1.414-1.42L17.414 12l-8.457 8.46-1.414-1.42L14.586 12z"></path>
                  </g>
                </svg>
              </div>
            </div>
            {/* <div
              onClick={() => {
                navigate("/settings/monetization");
              }}
              className="has-children"
              style={{
                display: "flex",
                justifyContent: "space-between",
                backgroundColor:
                  navigationHistoryArray[0] === "/settings/monetization" &&
                  themeName === "dark-theme"
                    ? "#16181c"
                    : navigationHistoryArray[0] === "/settings/monetization" &&
                      themeName !== "dark-theme"
                    ? "#f7f9f9"
                    : null,
                borderRight:
                  navigationHistoryArray[0] === "/settings/monetization"
                    ? "2px solid #1C9BEF"
                    : null,
              }}
            >
              <div>Monetization</div>
              <div>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <g>
                    <path d="M14.586 12L7.543 4.96l1.414-1.42L17.414 12l-8.457 8.46-1.414-1.42L14.586 12z"></path>
                  </g>
                </svg>
              </div>
            </div> */}
            <div
              className="has-children"
              onClick={() => {
                navigate("/i/premium_sign_up");
              }}
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <div>Premium</div>
              <div>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <g>
                    <path d="M14.586 12L7.543 4.96l1.414-1.42L17.414 12l-8.457 8.46-1.414-1.42L14.586 12z"></path>
                  </g>
                </svg>
              </div>
            </div>
            <div
              onClick={() => {
                navigate("/settings/manage_subscriptions");
              }}
              className="has-children"
              style={{
                display: "flex",
                justifyContent: "space-between",
                backgroundColor:
                  navigationHistoryArray[0] ===
                    "/settings/manage_subscriptions" &&
                  themeName === "dark-theme"
                    ? "#16181c"
                    : navigationHistoryArray[0] ===
                        "/settings/manage_subscriptions" &&
                      themeName !== "dark-theme"
                    ? "#f7f9f9"
                    : null,
                borderRight:
                  navigationHistoryArray[0] === "/settings/manage_subscriptions"
                    ? "2px solid #1C9BEF"
                    : null,
              }}
            >
              <div>Creator Subscriptions</div>
              <div>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <g>
                    <path d="M14.586 12L7.543 4.96l1.414-1.42L17.414 12l-8.457 8.46-1.414-1.42L14.586 12z"></path>
                  </g>
                </svg>
              </div>
            </div>
            <div
              onClick={() => {
                navigate("/settings/security_and_account_access");
              }}
              className="has-children"
              style={{
                display: "flex",
                justifyContent: "space-between",
                backgroundColor:
                  navigationHistoryArray[0] ===
                    "/settings/security_and_account_access" &&
                  themeName === "dark-theme"
                    ? "#16181c"
                    : navigationHistoryArray[0] ===
                        "/settings/security_and_account_access" &&
                      themeName !== "dark-theme"
                    ? "#f7f9f9"
                    : null,
                borderRight:
                  navigationHistoryArray[0] ===
                  "/settings/security_and_account_access"
                    ? "2px solid #1C9BEF"
                    : null,
              }}
            >
              <div>Security and account access</div>
              <div>
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-14j79pv r-1q142lx r-2dysd3"
                >
                  <g>
                    <path d="M14.586 12L7.543 4.96l1.414-1.42L17.414 12l-8.457 8.46-1.414-1.42L14.586 12z"></path>
                  </g>
                </svg>
              </div>
            </div>
            <div
              onClick={() => {
                navigate("/settings/privacy_and_safety");
              }}
              className="has-children"
              style={{
                display: "flex",
                justifyContent: "space-between",
                backgroundColor:
                  navigationHistoryArray[0] ===
                    "/settings/privacy_and_safety" && themeName === "dark-theme"
                    ? "#16181c"
                    : navigationHistoryArray[0] ===
                        "/settings/privacy_and_safety" &&
                      themeName !== "dark-theme"
                    ? "#f7f9f9"
                    : null,
                borderRight:
                  navigationHistoryArray[0] === "/settings/privacy_and_safety"
                    ? "2px solid #1C9BEF"
                    : null,
              }}
            >
              <div>Privacy and safety</div>
              <div>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <g>
                    <path d="M14.586 12L7.543 4.96l1.414-1.42L17.414 12l-8.457 8.46-1.414-1.42L14.586 12z"></path>
                  </g>
                </svg>
              </div>
            </div>
            <div
              onClick={() => {
                navigate("/settings/notifications");
              }}
              className="has-children"
              style={{
                display: "flex",
                justifyContent: "space-between",
                backgroundColor:
                  navigationHistoryArray[0] === "/settings/notifications" &&
                  themeName === "dark-theme"
                    ? "#16181c"
                    : navigationHistoryArray[0] === "/settings/notifications" &&
                      themeName !== "dark-theme"
                    ? "#f7f9f9"
                    : null,
                borderRight:
                  navigationHistoryArray[0] === "/settings/notifications"
                    ? "2px solid #1C9BEF"
                    : null,
              }}
            >
              <div>Notifications</div>
              <div>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <g>
                    <path d="M14.586 12L7.543 4.96l1.414-1.42L17.414 12l-8.457 8.46-1.414-1.42L14.586 12z"></path>
                  </g>
                </svg>
              </div>
            </div>
            <div
              onClick={() => {
                navigate("/settings/accessibility_display_and_languages");
              }}
              className="has-children"
              style={{
                display: "flex",
                justifyContent: "space-between",
                backgroundColor:
                  navigationHistoryArray[0] ===
                    "/settings/accessibility_display_and_languages" &&
                  themeName === "dark-theme"
                    ? "#16181c"
                    : navigationHistoryArray[0] ===
                        "/settings/accessibility_display_and_languages" &&
                      themeName !== "dark-theme"
                    ? "#f7f9f9"
                    : null,
                borderRight:
                  navigationHistoryArray[0] ===
                  "/settings/accessibility_display_and_languages"
                    ? "2px solid #030303"
                    : null,
              }}
            >
              <div>Accessibility, display, and languages</div>
              <div>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <g>
                    <path d="M14.586 12L7.543 4.96l1.414-1.42L17.414 12l-8.457 8.46-1.414-1.42L14.586 12z"></path>
                  </g>
                </svg>
              </div>
            </div>
            <div
              onClick={() => {
                navigate("/settings/about");
              }}
              className="has-children"
              style={{
                display: "flex",
                justifyContent: "space-between",
                backgroundColor:
                  navigationHistoryArray[0] === "/settings/about" &&
                  themeName === "dark-theme"
                    ? "#16181c"
                    : navigationHistoryArray[0] === "/settings/about" &&
                      themeName !== "dark-theme"
                    ? "#f7f9f9"
                    : null,
                borderRight:
                  navigationHistoryArray[0] === "/settings/about"
                    ? "2px solid #030303"
                    : null,
              }}
            >
              <div>Additional resources</div>
              <div>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <g>
                    <path d="M14.586 12L7.543 4.96l1.414-1.42L17.414 12l-8.457 8.46-1.414-1.42L14.586 12z"></path>
                  </g>
                </svg>
              </div>
            </div>
            <div
              className="has-children"
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <div>Help Center</div>
              <div>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <g>
                    <path d="M8 6h10v10h-2V9.41L5.957 19.46l-1.414-1.42L14.586 8H8V6z"></path>
                  </g>
                </svg>
              </div>
            </div>
          </div>
          {/* setting options ...finish to check  */}
        </Stack>
      </Col>
    </>
  );
}
export default Settings;
