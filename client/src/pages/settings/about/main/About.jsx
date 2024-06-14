import { useContext, useState } from "react";
import { Col } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import SettingsNavigation from "../../../../components/SettingsNavigation/SettingsNavigation";
import ResponsiveNavigationBarBottom from "../../../../components/Navbar/ResponsiveNavigationBottom";
import { ModalVisibilityContext } from "../../../../context/ModalVisibilityContext";
import { useAntdMessageHandler } from "../../../../utils/useAntdMessageHandler";
import useWindowDimensions from "../../../../hooks/getWindowDimensions";
import { UserContext } from "../../../../context/UserContext";
import { ThemeContext } from "../../../../context/ThemeContext";
// when working on local version
const API_URL = "http://localhost:3000";

// when working on deployment version
// ?
function About() {
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
          <div className="mt-3">Additional resources</div>
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
          Check out other places for helpful information to learn more about X
          products and services.
        </div>
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
          className="mt-3"
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
            lineHeight: "24px",
            fontWeight: "700",
            fontSize: "20px",
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            paddingLeft: width <= 500 ? "32px" : "12px",
            paddingRight: width <= 500 ? "32px" : "12px",
          }}
          className="mt-3"
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
            }}
          >
            <div>Ads info</div>
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
              paddingLeft: width <= 500 ? "21px" : "0px",
              paddingRight: width <= 500 ? "21px" : "0px",
              padding: "12px 0px",
              margin: "0px",
            }}
          >
            <div>Cookie Policy</div>
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
              padding: "12px 0px",
              paddingLeft: width <= 500 ? "21px" : "0px",
              paddingRight: width <= 500 ? "21px" : "0px",
              margin: "0px",
            }}
          >
            <div>Imprint</div>
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
              padding: "12px 0px",
              paddingLeft: width <= 500 ? "21px" : "0px",
              paddingRight: width <= 500 ? "21px" : "0px",
              margin: "0px",
            }}
          >
            <div>MStV Transparenzangaben</div>
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
              padding: "12px 0px",
              paddingLeft: width <= 500 ? "21px" : "0px",
              paddingRight: width <= 500 ? "21px" : "0px",
              margin: "0px",
            }}
          >
            <div>Privacy Policy</div>
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
              padding: "12px 0px",
              paddingLeft: width <= 500 ? "21px" : "0px",
              paddingRight: width <= 500 ? "21px" : "0px",
              margin: "0px",
            }}
          >
            <div>Terms of Service</div>
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
            lineHeight: "24px",
            fontWeight: "700",
            fontSize: "20px",
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            paddingLeft: width <= 500 ? "32px" : "12px",
            paddingRight: width <= 500 ? "32px" : "12px",
          }}
          className="mt-3"
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
            }}
          >
            <div>About</div>
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
              padding: "12px 0px",
              paddingLeft: width <= 500 ? "21px" : "0px",
              paddingRight: width <= 500 ? "21px" : "0px",
              margin: "0px",
            }}
          >
            <div>Accessibility</div>
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
              padding: "12px 0px",
              margin: "0px",
              paddingLeft: width <= 500 ? "21px" : "0px",
              paddingRight: width <= 500 ? "21px" : "0px",
            }}
          >
            <div>Imprint</div>
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
              padding: "12px 0px",
              margin: "0px",
              paddingLeft: width <= 500 ? "21px" : "0px",
              paddingRight: width <= 500 ? "21px" : "0px",
            }}
          >
            <div>Advertising</div>
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
              padding: "12px 0px",
              margin: "0px",
              paddingLeft: width <= 500 ? "21px" : "0px",
              paddingRight: width <= 500 ? "21px" : "0px",
            }}
          >
            <div>Privacy Policy</div>
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
              padding: "12px 0px",
              margin: "0px",
              paddingLeft: width <= 500 ? "21px" : "0px",
              paddingRight: width <= 500 ? "21px" : "0px",
            }}
          >
            <div>Blog</div>
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
            }}
          >
            <div>Brand Resources</div>
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
            }}
          >
            <div>Careers</div>
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
            }}
          >
            <div>Developers</div>
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
            }}
          >
            <div>Directory</div>
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
            }}
          >
            <div>Download the C app</div>
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
            }}
          >
            <div>Help Center</div>
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
            }}
          >
            <div>Marketing</div>
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
              padding: "12px 0px",
              margin: "0px",
              paddingLeft: width <= 500 ? "21px" : "0px",
              paddingRight: width <= 500 ? "21px" : "0px",
            }}
          >
            <div>C for Business</div>
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
export default About;
