import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import { ThemeContext } from "../context/ThemeContext";
import useWindowDimensions from "../hooks/getWindowDimensions";
import { Button, Col, Modal, Stack } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Popover from "@mui/material/Popover";
import PopupState, { bindTrigger, bindPopover } from "material-ui-popup-state";
import BootstrapTooltip from "../components/BootstrapToolTip/BootstrapToolTip";
import { List } from "antd";
import PostPopover from "../components/three-dots-popover/Popover";
import { CommentModal } from "../components/ui/Modal";
import RepostAction from "../components/ui/RepostAction";
import LikeAction from "../components/ui/LikeAction";
import BookmarkAction from "../components/ui/BookmarkAction";
import { useAntdMessageHandler } from "../utils/useAntdMessageHandler";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import ResponsiveNavigationBarBottom from "../components/Navbar/ResponsiveNavigationBottom";
import { ModalVisibilityContext } from "../context/ModalVisibilityContext";
import { NavigationHistoryContext } from "../context/NavigationHistoryContext";
import SettingsNavigation from "../components/SettingsNavigation/SettingsNavigation";
// when working on local version
const API_URL = "http://localhost:3000";

// when working on deployment version
// ?
function SettingsNotificationsMain() {
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

  const { navigationHistoryArray } = useContext(NavigationHistoryContext);

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
          style={{
            lineHeight: "24px",
            fontWeight: "700",
            fontSize: "20px",
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
          <div className="mt-3">Notifications</div>
        </div>
        <div
          className="mt-4"
          style={{
            color: themeName === "dark-theme" ? "#71767A" : "rgb(83, 100, 113)",
            fontSize: "13px",
            lineHeight: "16px",
            fontWeight: "400",
            paddingLeft: width <= 500 ? "32px" : "12px",
            paddingRight: width <= 500 ? "32px" : "12px",
          }}
        >
          Select the kinds of notifications you get about your activities,
          interests, and recommendations.
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
                    <path d="M14 6V3h2v8h-2V8H3V6h11zm7 2h-3.5V6H21v2zM8 16v-3h2v8H8v-3H3v-2h5zm13 2h-9.5v-2H21v2z"></path>{" "}
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
                  className={
                    themeName === "dark-theme"
                      ? "settings-text-first-exp-dark-theme"
                      : "settings-text-first-exp-light-theme "
                  }
                >
                  Filters
                </div>
                <div
                  className={
                    themeName === "dark-theme"
                      ? "settings-text-dark-theme"
                      : "settings-text-light-theme"
                  }
                >
                  Choose the notifications you'd like to see — and those you
                  don't.
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
                    <path d="M7 17h6v2H7v-2zm7.5-15C15.88 2 17 3.12 17 4.5v15c0 1.38-1.12 2.5-2.5 2.5h-9C4.12 22 3 20.88 3 19.5v-15C3 3.12 4.12 2 5.5 2h9zM5 19.5c0 .28.22.5.5.5h9c.28 0 .5-.22.5-.5v-15c0-.28-.22-.5-.5-.5h-9c-.28 0-.5.22-.5.5v15zm15.74-3.49l1.64 1.15C23.4 15.7 24 13.92 24 12s-.6-3.7-1.62-5.16l-1.64 1.15C21.53 9.13 22 10.51 22 12s-.47 2.87-1.26 4.01zm-.82-7.45l-1.64 1.15c.45.65.72 1.43.72 2.29 0 .85-.27 1.64-.72 2.29l1.64 1.15C20.6 14.47 21 13.28 21 12s-.4-2.47-1.08-3.44z"></path>
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
                  className={
                    themeName === "dark-theme"
                      ? "settings-text-first-exp-dark-theme"
                      : "settings-text-first-exp-light-theme "
                  }
                >
                  Preferences
                </div>
                <div
                  className={
                    themeName === "dark-theme"
                      ? "settings-text-dark-theme"
                      : "settings-text-light-theme"
                  }
                >
                  Select your preferences by notification type.
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
export default SettingsNotificationsMain;
