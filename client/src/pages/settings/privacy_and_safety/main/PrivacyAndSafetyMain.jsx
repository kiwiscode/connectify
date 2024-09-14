import { useContext, useState } from "react";
import { Col } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../../../../context/UserContext";
import { ThemeContext } from "../../../../context/ThemeContext";
import useWindowDimensions from "../../../../hooks/getWindowDimensions";
import { useAntdMessageHandler } from "../../../../utils/useAntdMessageHandler";
import SettingsNavigation from "../../../../components/SettingsNavigation/SettingsNavigation";
import { ModalVisibilityContext } from "../../../../context/ModalVisibilityContext";
import ResponsiveNavigationBarBottom from "../../../../components/Navbar/ResponsiveNavigationBottom";
import { useFontSizeHandler } from "../../../../utils/useFontSizeHandler";
const API_URL = import.meta.env.VITE_APP_API_URL;

function PrivacyAndSafetyMain() {
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
            fontSize: font20.fontSize,
            lineHeight: font20.lineHeight,
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
            className={
              themeName === "dark-theme"
                ? "soft-grey-dark-theme-text-variant-1 mt-3"
                : "very-dark-gray-light-theme-text-variant-1 mt-3"
            }
          >
            Privacy and safety
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
          Manage what information you see and share on C.
        </div>
        <div
          className="mt-4 chirp-heavy-font"
          style={{
            fontSize: font20.fontSize,
            lineHeight: font20.lineHeight,
            paddingLeft: width <= 500 ? "32px" : "12px",
            paddingRight: width <= 500 ? "32px" : "12px",
          }}
        >
          Your X activity
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
                    <path d="M12 5c-.83 0-1.5.67-1.5 1.5S11.17 8 12 8s1.5-.67 1.5-1.5S12.83 5 12 5zM8.5 6.5C8.5 4.57 10.07 3 12 3s3.5 1.57 3.5 3.5S13.93 10 12 10 8.5 8.43 8.5 6.5zm-3.25 1c-.41 0-.75.34-.75.75s.34.75.75.75.75-.34.75-.75-.34-.75-.75-.75zm-2.75.75c0-1.52 1.23-2.75 2.75-2.75S8 6.73 8 8.25 6.77 11 5.25 11 2.5 9.77 2.5 8.25zm16.25-.75c-.41 0-.75.34-.75.75s.34.75.75.75.75-.34.75-.75-.34-.75-.75-.75zM16 8.25c0-1.52 1.23-2.75 2.75-2.75s2.75 1.23 2.75 2.75S20.27 11 18.75 11 16 9.77 16 8.25zM12 13c-1.29 0-2.37.54-3.22 1.61C8 15.6 7.4 17.07 7.12 19h9.76c-.27-1.85-.83-3.28-1.57-4.28C14.45 13.58 13.34 13 12 13zm-4.78.36C8.41 11.86 10.06 11 12 11c2.02 0 3.7.92 4.91 2.53 1.18 1.57 1.88 3.77 2.09 6.39l.08 1.08H4.92L5 19.92c.22-2.7.96-4.97 2.22-6.56zM2.95 16c.16-.55.39-.97.66-1.28.4-.46.94-.72 1.64-.72v-2c-1.26 0-2.35.49-3.15 1.4-.78.89-1.22 2.11-1.35 3.51L.65 18H4v-2H2.95zm18.95-2.6c.78.89 1.22 2.11 1.35 3.51l.1 1.09H20v-2h1.05c-.16-.55-.39-.97-.66-1.28-.4-.46-.94-.72-1.64-.72v-2c1.26 0 2.35.49 3.15 1.4z"></path>
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
                  Audience,media and tagging
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
                  Manage what information you allow other people on C to see.
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
                    <path d="M14.23 2.854c.98-.977 2.56-.977 3.54 0l3.38 3.378c.97.977.97 2.559 0 3.536L9.91 21H3v-6.914L14.23 2.854zm2.12 1.414c-.19-.195-.51-.195-.7 0L5 14.914V19h4.09L19.73 8.354c.2-.196.2-.512 0-.708l-3.38-3.378zM14.75 19l-2 2H21v-2h-6.25z"></path>
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
                  Your posts
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
                  Manage the information associated with your posts.
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
                    <path d="M5 5c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2H5zm2.5 5.75c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zM11 13h7v-2h-7v2zm0 4h4v-2h-4v2zm8.5-10C20.88 7 22 8.12 22 9.5v9c0 1.38-1.12 2.5-2.5 2.5h-15C3.12 21 2 19.88 2 18.5v-9C2 8.12 3.12 7 4.5 7h15zM4 18.5c0 .28.22.5.5.5h15c.28 0 .5-.22.5-.5v-9c0-.28-.22-.5-.5-.5h-15c-.28 0-.5.22-.5.5v9z"></path>
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
                  Content you see
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
                  Decide what you see on C based on your preferences like Topics
                  and interests.
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
                    <path d="M18 6.59V1.2L8.71 7H5.5C4.12 7 3 8.12 3 9.5v5C3 15.88 4.12 17 5.5 17h2.09l-2.3 2.29 1.42 1.42 15.5-15.5-1.42-1.42L18 6.59zm-8 8V8.55l6-3.75v3.79l-6 6zM5 9.5c0-.28.22-.5.5-.5H8v6H5.5c-.28 0-.5-.22-.5-.5v-5zm6.5 9.24l1.45-1.45L16 19.2V14l2 .02v8.78l-6.5-4.06z"></path>
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
                  Mute and block
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
                  Manage the accounts, words, and notifications that you've
                  muted or blocked.
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
                    <path d="M1.998 5.5c0-1.381 1.119-2.5 2.5-2.5h15c1.381 0 2.5 1.119 2.5 2.5v13c0 1.381-1.119 2.5-2.5 2.5h-15c-1.381 0-2.5-1.119-2.5-2.5v-13zm2.5-.5c-.276 0-.5.224-.5.5v2.764l8 3.638 8-3.636V5.5c0-.276-.224-.5-.5-.5h-15zm15.5 5.463l-8 3.636-8-3.638V18.5c0 .276.224.5.5.5h15c.276 0 .5-.224.5-.5v-8.037z"></path>
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
                  Direct Messages
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
                  Manage who can message you directly.
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
                    <path d="M12 22.25c-4.99 0-9.18-3.393-10.39-7.994l1.93-.512c.99 3.746 4.4 6.506 8.46 6.506s7.47-2.76 8.46-6.506l1.93.512c-1.21 4.601-5.4 7.994-10.39 7.994zM5 11.5c0 3.866 3.13 7 7 7s7-3.134 7-7V8.75c0-3.866-3.13-7-7-7s-7 3.134-7 7v2.75zm12-2.75v2.75c0 2.761-2.24 5-5 5s-5-2.239-5-5V8.75c0-2.761 2.24-5 5-5s5 2.239 5 5zM11.25 8v4.25c0 .414.34.75.75.75s.75-.336.75-.75V8c0-.414-.34-.75-.75-.75s-.75.336-.75.75zm-3 1v2.25c0 .414.34.75.75.75s.75-.336.75-.75V9c0-.414-.34-.75-.75-.75s-.75.336-.75.75zm7.5 0c0-.414-.34-.75-.75-.75s-.75.336-.75.75v2.25c0 .414.34.75.75.75s.75-.336.75-.75V9z"></path>
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
                  Spaces
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
                  Manage who can see your Spaces listening activity.
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
                    <path d="M11 4c-3.87 0-7 3.13-7 7s3.13 7 7 7c1.93 0 3.68-.78 4.95-2.05S18 12.93 18 11c0-3.87-3.13-7-7-7zm-9 7c0-4.97 4.03-9 9-9s9 4.03 9 9c0 2.12-.74 4.08-1.97 5.62l3.68 3.67-1.41 1.42-3.68-3.68C15.08 19.26 13.13 20 11 20c-4.97 0-9-4.03-9-9zm11.5-2.5c0 1.38-1.12 2.5-2.5 2.5S8.5 9.88 8.5 8.5 9.62 6 11 6s2.5 1.12 2.5 2.5zm-6.76 5.97C7.58 12.89 9.07 12 11 12s3.42.89 4.26 2.47c-1 1.24-2.54 2.03-4.26 2.03s-3.26-.79-4.26-2.03z"></path>
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
                  Discoverability and contacts
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
                  Control your discoverability settings and manage contacts
                  you've imported.
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
        </div>{" "}
        <div
          className="mt-2"
          style={{
            borderBottom:
              themeName !== "dark-theme"
                ? "1px solid rgba(0, 0, 0, 0.1)"
                : // : "0.1px solid rgb(70, 70, 70)",
                  "1px solid rgb(70, 70, 70)",
          }}
        ></div>
        <div
          className="mt-4 chirp-heavy-font"
          style={{
            fontSize: font20.fontSize,
            lineHeight: font20.lineHeight,
            paddingLeft: width <= 500 ? "32px" : "12px",
            paddingRight: width <= 500 ? "32px" : "12px",
          }}
        >
          Data sharing and personalization
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
                    <path d="M1.996 5.5c0-1.38 1.119-2.5 2.5-2.5h15c1.38 0 2.5 1.12 2.5 2.5v13c0 1.38-1.12 2.5-2.5 2.5h-15c-1.381 0-2.5-1.12-2.5-2.5v-13zm2.5-.5c-.277 0-.5.22-.5.5v13c0 .28.223.5.5.5h15c.276 0 .5-.22.5-.5v-13c0-.28-.224-.5-.5-.5h-15zm8.085 5H8.996V8h7v7h-2v-3.59l-5.293 5.3-1.415-1.42L12.581 10z"></path>
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
                  Ads preferences
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
                  Manage your ads experience on C.
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
                    <path d="M20.906 12.499l1.145.035-.189 1.13-.986-.165.03-1zm-.03 1l.986.165c-.793 4.731-4.905 8.337-9.862 8.337-5.523 0-10-4.477-10-10S6.477 2 12 2h.111l1.21.013-.24 1.186c-.052.258-.08.526-.08.801 0 2.209 1.791 4 4 4h.025l1.139-.007-.141 1.131c-.015.123-.023.248-.023.376 0 1.625 1.293 2.949 2.906 2.999l-.03 1zm-1.219.802c-1.975-.553-3.439-2.279-3.615-4.384-2.835-.456-5.004-2.892-5.038-5.848C7.057 4.561 4.001 7.92 4.001 12c0 4.418 3.582 8 8 8 3.617 0 6.668-2.404 7.657-5.7zM8.5 13.001c-.828 0-1.5.672-1.5 1.5s.672 1.5 1.5 1.5 1.5-.672 1.5-1.5-.672-1.5-1.5-1.5zm0-6c-.828 0-1.5.672-1.5 1.5s.672 1.5 1.5 1.5 1.5-.672 1.5-1.5-.672-1.5-1.5-1.5zm6 8c-.828 0-1.5.672-1.5 1.5s.672 1.5 1.5 1.5 1.5-.672 1.5-1.5-.672-1.5-1.5-1.5zm-.5-3.5c0-.828-.672-1.5-1.5-1.5s-1.5.672-1.5 1.5.672 1.5 1.5 1.5 1.5-.672 1.5-1.5z"></path>
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
                  Cookie preferences
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
                  Manage your cookie experience on C.
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
                    <path d="M9.53 4c.41.01.77.28.91.66l4.14 11.6L16.84 11H22v2h-3.84l-2.74 6.39c-.16.38-.54.62-.95.61s-.77-.28-.91-.66L9.42 7.74 7.16 13H2v-2h3.84l2.74-6.39c.16-.38.54-.62.95-.61z"></path>
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
                  Inferred identity
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
                  Allow C to personalize your experience with your inferred
                  activity, e.g. activity on devices you haven't used to log in
                  to C.
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
                    <path d="M15.96 1.54L21.41 7l-5.45 5.46-1.42-1.42L17.59 8H3V6h14.59l-3.05-3.04 1.42-1.42zM6.41 18l3.05 3.04-1.42 1.42L2.59 17l5.45-5.46 1.42 1.42L6.41 16H21v2H6.41z"></path>
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
                  Data sharing with business partners
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
                  Allow sharing of additional information with C's business
                  partners.
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
                    <path d="M12 7c-1.93 0-3.5 1.57-3.5 3.5S10.07 14 12 14s3.5-1.57 3.5-3.5S13.93 7 12 7zm0 5c-.827 0-1.5-.673-1.5-1.5S11.173 9 12 9s1.5.673 1.5 1.5S12.827 12 12 12zm0-10c-4.687 0-8.5 3.813-8.5 8.5 0 5.967 7.621 11.116 7.945 11.332l.555.37.555-.37c.324-.216 7.945-5.365 7.945-11.332C20.5 5.813 16.687 2 12 2zm0 17.77c-1.665-1.241-6.5-5.196-6.5-9.27C5.5 6.916 8.416 4 12 4s6.5 2.916 6.5 6.5c0 4.073-4.835 8.028-6.5 9.27z"></path>
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
                  Location information
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
                  Manage the location information C uses to personalize your
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
        </div>
        <div
          className="mt-2"
          style={{
            borderBottom:
              themeName !== "dark-theme"
                ? "1px solid rgba(0, 0, 0, 0.1)"
                : // : "0.1px solid rgb(70, 70, 70)",
                  "1px solid rgb(70, 70, 70)",
          }}
        ></div>
        <div
          className="mt-4 chirp-heavy-font"
          style={{
            fontSize: font20.fontSize,
            lineHeight: font20.lineHeight,
            paddingLeft: width <= 500 ? "32px" : "12px",
            paddingRight: width <= 500 ? "32px" : "12px",
          }}
        >
          Learn more about privacy on X
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
              padding: "12px 16px",
            }}
          >
            <div>Privacy center</div>
            <div>
              {" "}
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                class="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-14j79pv r-1q142lx r-2dysd3"
              >
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
              padding: "12px 16px",
            }}
          >
            <div>Privacy policy</div>
            <div>
              {" "}
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                class="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-14j79pv r-1q142lx r-2dysd3"
              >
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
              padding: "12px 16px",
            }}
          >
            <div>Contact us</div>
            <div>
              {" "}
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                class="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-14j79pv r-1q142lx r-2dysd3"
              >
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
export default PrivacyAndSafetyMain;
