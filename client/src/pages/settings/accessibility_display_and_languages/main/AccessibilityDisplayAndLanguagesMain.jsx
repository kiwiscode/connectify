import { useContext, useState } from "react";
import { Col } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import SettingsNavigation from "../../../../components/SettingsNavigation/SettingsNavigation";
import ResponsiveNavigationBarBottom from "../../../../components/Navbar/ResponsiveNavigationBottom";
import { ModalVisibilityContext } from "../../../../context/ModalVisibilityContext";
import { useAntdMessageHandler } from "../../../../utils/useAntdMessageHandler";
import { UserContext } from "../../../../context/UserContext";
import { ThemeContext } from "../../../../context/ThemeContext";
import useWindowDimensions from "../../../../hooks/getWindowDimensions";
import { useFontSizeHandler } from "../../../../utils/useFontSizeHandler";
// when working on local version
const API_URL = "http://localhost:3000";

// when working on deployment version
// ?
function AccessibilityDisplayAndLanguagesMain() {
  const { getToken, userInfo } = useContext(UserContext);
  const [{ theme, themeName }] = useContext(ThemeContext);
  const { width } = useWindowDimensions();

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "June",
    "July",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];

  const getCreatedDate = (date) => {
    const createdAt = new Date(date);
    const getMonth = createdAt.getMonth();
    return `${months[getMonth]} ${createdAt.getDate()}`;
  };

  const extraDetailedDate = (dateStr) => {
    const date = new Date(dateStr);

    const optionsTime = {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };
    const optionsDate = {
      month: "short",
      day: "numeric",
      year: "numeric",
    };
    const formattedTime = new Intl.DateTimeFormat("en-US", optionsTime).format(
      date
    );
    const formattedDate = new Intl.DateTimeFormat("en-US", optionsDate).format(
      date
    );

    return `${formattedTime} \u00B7 ${formattedDate}`;
  };

  const {
    postSharedMessage,
    contextHolder,
    showCustomMessage,
    postDeletedMessage,
  } = useAntdMessageHandler();

  const [dataFromCommentModal, setDataFromCommentModal] = useState("");
  function handleDataFromCommentModal(data) {
    console.log("Data =>", data);
    setDataFromCommentModal(data);
  }

  const { isPostModalVisible } = useContext(ModalVisibilityContext);

  const [onFocus, setOnFocus] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const setSearchTermEmpty = () => {
    setSearchTerm("");
  };
  const [onFocusXBtn, setOnFocusXBtn] = useState(true);
  const onFocusInActiveForXBtn = () => {
    setOnFocusXBtn(false);
  };
  const handleSetSearchTerm = (e) => {
    setSearchTerm(e.target.value);
  };
  const onFocusActive = () => {
    setOnFocus(true);
  };

  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  const [isSearchStart, setSearchStart] = useState(null);

  const [showNotificationMessage, setShowNotificationMessage] = useState(null);
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
      {!isPostModalVisible && !dataFromCommentModal && (
        <ResponsiveNavigationBarBottom />
      )}
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
          className="chirp-bold-font"
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
            style={{ fontSize: font20.fontSize, lineHeight: font20.lineHeight }}
            className={
              themeName === "dark-theme"
                ? "soft-grey-dark-theme-text-variant-1 mt-3"
                : "very-dark-gray-light-theme-text-variant-1 mt-3"
            }
          >
            Accessibility, display and languages
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
          Manage how C content is displayed to you.
        </div>
        <div
          className="mt-4"
          style={{
            width: "100%",
            minWidth: "fit-content",
          }}
        >
          <div
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
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  class="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-14j79pv"
                >
                  <g>
                    <path d="M14.828 9.172c-1.315-1.315-3.326-1.522-4.86-.618L3.707 2.293 2.293 3.707l2.428 2.429c-2.478 2.421-3.606 5.376-3.658 5.513L.932 12l.131.351C1.196 12.704 4.394 21 12 21c2.063 0 3.989-.622 5.737-1.849l2.556 2.556 1.414-1.414-6.261-6.261c.904-1.534.698-3.545-.618-4.86zm-1.414 1.414c.522.522.695 1.264.518 1.932l-2.449-2.449c.669-.177 1.409-.005 1.931.517zM3.085 11.999c.107-.24.272-.588.497-1.002l7.993 7.992c-5.14-.279-7.85-5.563-8.489-6.989zm13.21 5.71c-.695.448-1.422.781-2.175.996L4.672 9.258c.412-.57.899-1.158 1.464-1.708l10.16 10.16h-.001zm6.772-5.71l-.131.352c-.062.164-.801 2.055-2.33 4.027l-1.438-1.438c.917-1.217 1.494-2.378 1.746-2.941-.658-1.467-3.5-7-8.915-7-.712 0-1.376.1-2 .27V3.223c.633-.131 1.291-.223 2-.223 7.605 0 10.804 8.296 10.937 8.648l.131.352z"></path>{" "}
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
                  Accessibility
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
                  Manage aspects of your C experience such as limiting color
                  contrast and motion.
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
                <svg
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
            className={
              themeName === "dark-theme"
                ? "has-children-dark-theme"
                : "has-children-light-theme"
            }
            onClick={() => navigate("/settings/display")}
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
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  class="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-14j79pv"
                >
                  <g>
                    <path d="M22.21 2.793c-1.22-1.217-3.18-1.26-4.45-.097l-10.17 9.32C5.02 12.223 3 14.376 3 17v5h5c2.62 0 4.78-2.022 4.98-4.593L22.3 7.239c1.17-1.269 1.12-3.229-.09-4.446zM8 20H5v-3c0-1.657 1.34-3 3-3s3 1.343 3 3-1.34 3-3 3zM20.83 5.888l-8.28 9.033c-.5-1.09-1.38-1.971-2.47-2.47l9.03-8.28c.48-.44 1.22-.424 1.68.036s.48 1.201.04 1.681z"></path>
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
                  Display
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
                  Manage your font size, color, and background. These settings
                  affect all the C accounts on this browser.
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
                <svg
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
            className={
              themeName === "dark-theme"
                ? "has-children-dark-theme"
                : "has-children-light-theme"
            }
            onClick={() => navigate("/settings/languages")}
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
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  class="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-14j79pv"
                >
                  <g>
                    <path d="M4.65 8.24c-.57 1.13-.9 2.41-.9 3.76 0 4.56 3.69 8.25 8.25 8.25 2.87 0 5.4-1.47 6.88-3.69l-2.99-1.5.56-3.32-3.01-4.21 4.16-1.59c-1.27-1.17-2.91-1.95-4.72-2.14l-.5 2.38-2.08 1.04-.53 1.41 4.82 1.93-2.16 2.87-1.23 5.54-3.7-1.85V13.1l-.53-2.68.26-.71-2.58-1.47zm1.13-1.66l2.16 1.23.77-2.03 1.91-.96.21-.99c-2.01.29-3.78 1.3-5.05 2.75zm3.26 4l.46 2.32v2.98l.3.15.77-3.46.85-1.13-2.35-.94-.03.08zm9.92-3.02l-2.39.91 1.99 2.79-.45 2.68 1.67.83c.3-.87.47-1.8.47-2.77 0-1.63-.47-3.16-1.29-4.44zM1.75 12C1.75 6.34 6.34 1.75 12 1.75S22.25 6.34 22.25 12 17.66 22.25 12 22.25 1.75 17.66 1.75 12z"></path>
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
                  Languages
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
                  Manage which languages are used to personalize your C
                  experience.
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
                <svg
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
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  class="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-14j79pv"
                >
                  <g>
                    <path d="M8.75 21V3h2v18h-2zM18 21V8.5h2V21h-2zM4 21l.004-10h2L6 21H4zm9.248 0v-7h2v7h-2z"></path>
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
                  Data usage
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
                  Limit how C uses some of your network data. These settings
                  affect all the C accounts on this browser.
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
                <svg
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
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  class="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-14j79pv"
                >
                  <g>
                    <path d="M11.999 22.25c-5.652 0-10.25-4.598-10.25-10.25S6.347 1.75 11.999 1.75 22.249 6.348 22.249 12s-4.598 10.25-10.25 10.25zm0-18.5c-4.549 0-8.25 3.701-8.25 8.25s3.701 8.25 8.25 8.25 8.25-3.701 8.25-8.25-3.701-8.25-8.25-8.25zm.445 6.992c1.747-.096 3.748-.689 3.768-.695l.575 1.916c-.077.022-1.616.48-3.288.689v.498c.287 1.227 1.687 2.866 2.214 3.405l-1.428 1.4c-.188-.191-1.518-1.576-2.286-3.144-.769 1.568-2.098 2.952-2.286 3.144l-1.428-1.4c.527-.54 1.927-2.178 2.214-3.405v-.498c-1.672-.209-3.211-.667-3.288-.689l.575-1.916c.02.006 2.021.6 3.768.695m0 0c.301.017.59.017.891 0M12 6.25c-.967 0-1.75.78-1.75 1.75s.783 1.75 1.75 1.75 1.75-.78 1.75-1.75-.784-1.75-1.75-1.75z"></path>
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
                  Keyboard shortcuts
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
                <svg
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
        </div>
      </Col>
    </>
  );
}
export default AccessibilityDisplayAndLanguagesMain;
