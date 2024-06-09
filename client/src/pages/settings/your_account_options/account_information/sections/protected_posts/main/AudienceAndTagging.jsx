import { Button, Col, Modal } from "react-bootstrap";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAntdMessageHandler } from "../../../../../../../utils/useAntdMessageHandler";
import useWindowDimensions from "../../../../../../../hooks/getWindowDimensions";
import { ThemeContext } from "../../../../../../../context/ThemeContext";
import { UserContext } from "../../../../../../../context/UserContext";
import SettingsNavigation from "../../../../../../../components/SettingsNavigation/SettingsNavigation";

// when working on local version
const API_URL = "http://localhost:3000";

// when working on deployment version
// ?

function AudienceAndTagging() {
  const { contextHolder } = useAntdMessageHandler();
  const { width } = useWindowDimensions();
  const [{ theme, themeName }] = useContext(ThemeContext);
  const navigate = useNavigate();
  const { userInfo, getToken, updateUser } = useContext(UserContext);

  const [isTaggingOn, setIsTaggingOn] = useState(null);

  const [show, setShow] = useState(null);
  const handleClose = () => {
    setShow(false);
  };
  const toggleProfilePrivacy = async () => {
    try {
      const response = await axios.post(
        `${API_URL}/toggle_profile_privacy`,
        null,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      if (response) {
        console.log("Response =>", response);
        setShow(false);
        updateUser({ isPrivate: response.data.user.isPrivate });
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const toggleVideoPrivacy = async () => {
    try {
      const response = await axios.post(
        `${API_URL}/toggle_protect_videos`,
        null,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      if (response) {
        console.log("Response =>", response);

        updateUser({ isVideosProtected: response.data.user.isVideosProtected });
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      {" "}
      {contextHolder}
      <SettingsNavigation />
      <>
        <Modal
          style={{
            padding: "0px",
            margin: "0px",
          }}
          centered
          show={show}
          onHide={handleClose}
          backdropClassName={
            themeName === "dark-theme" ? `back-drop-${themeName}` : ""
          }
          className="delete-post"
          contentClassName={
            themeName === "dark-theme"
              ? "delete-post-modal-dark-theme"
              : "delete-post-modal"
          }
        >
          <Modal.Body style={{}}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                paddingBottom: "16px",
                paddingTop: "16px",
                maxWidth: "256px",
              }}
            >
              <div
                style={{
                  color: themeName === "dark-theme" ? "white" : "",
                  fontWeight: "700",
                  fontSize: "20px",
                  lineHeight: "24px",
                }}
              >
                Protect your posts?
              </div>
              <div
                style={{
                  color:
                    themeName === "dark-theme"
                      ? "#71767A"
                      : "rgb(83, 100, 113)",
                  fontWeight: "400",
                  fontSize: "15px",
                  lineHeight: "20px",
                }}
                className="mt-2"
              >
                This will make them visible only to your C followers.
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                padding: "12px",
              }}
            >
              <Button
                onClick={toggleProfilePrivacy}
                className={
                  themeName === "dark-theme"
                    ? "background-hover-next-btn-dark-theme soft-grey-dark-theme-text-variant-1 chirp-bold-font"
                    : "background-hover-next-btn-light-theme very-dark-gray-light-theme-text-variant-1 chirp-bold-font"
                }
                style={{
                  maxWidth: "256px",
                  minHeight: "44px",
                  border: "none",
                }}
              >
                <span>Protect</span>
              </Button>
              <Button
                variant="light"
                onClick={handleClose}
                style={{
                  color: themeName === "dark-theme" ? "white" : "black",
                  maxWidth: "256px",
                  minHeight: "44px",
                }}
                className={
                  themeName === "dark-theme"
                    ? "mt-2 background-hover-cancel-btn-dark-theme soft-grey-dark-theme-text-variant-1 chirp-bold-font"
                    : "mt-2 background-hover-cancel-btn-light-theme very-dark-gray-light-theme-text-variant-1 chirp-bold-font"
                }
              >
                <span>Cancel</span>
              </Button>
            </div>
          </Modal.Body>
        </Modal>
      </>
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
        <div className="settings-header-with-arrow">
          <div
            onClick={() => {
              navigate(-1);
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
            className={
              themeName === "dark-theme"
                ? "mt-2 first-head chirp-bold-font soft-grey-dark-theme-text-variant-1"
                : "mt-2 first-head chirp-bold-font very-dark-gray-light-theme-text-variant-1"
            }
          >
            Audience, media and tagging
          </div>
        </div>{" "}
        <div
          className="mt-3"
          style={{
            paddingLeft: "16px",
            paddingRight: "16px",
          }}
        >
          <div
            className={
              themeName === "dark-theme"
                ? "text-dark-theme "
                : "text-light-theme "
            }
            style={{
              fontSize: "13px",
              lineHeight: "16px",
              fontWeight: "400",
            }}
          >
            Manage what information you allow other people on X to see.
          </div>
          <div
            className="mt-3"
            style={{
              display: "flex-inline",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <div
              className="mt-3"
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{
                  width: "93%",
                }}
                className="mt-3"
              >
                <div
                  className={
                    themeName === "dark-theme"
                      ? "make-dark-theme-bej-color-dark-theme"
                      : "make-light-theme-color-light-theme"
                  }
                  style={{
                    fontSize: "15px",
                    lineHeight: "20px",
                    fontWeight: "400",
                  }}
                >
                  Protect your posts{" "}
                </div>
                <div
                  className={
                    themeName === "dark-theme"
                      ? "text-dark-theme"
                      : "text-light-theme"
                  }
                  style={{
                    fontSize: "13px",
                    lineHeight: "16px",
                    fontWeight: "400",
                  }}
                >
                  When selected, your posts and other account information are
                  only visible to people who follow you.{" "}
                  <span className="blue-underline">Learn more</span>
                </div>{" "}
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <div
                  onClick={() => {
                    if (userInfo.isPrivate) {
                      toggleProfilePrivacy();
                    } else {
                      setShow(true);
                    }
                  }}
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    cursor: "pointer",
                    position: "relative",
                  }}
                  className={
                    themeName === "dark-theme" && userInfo.isPrivate
                      ? "hover-background-effect-clicked-dark-theme"
                      : themeName !== "dark-theme" && userInfo.isPrivate
                      ? "hover-background-effect-clicked-light-theme"
                      : themeName === "dark-theme" && !userInfo.isPrivate
                      ? "hover-background-effect-dark-theme"
                      : themeName !== "dark-theme" && !userInfo.isPrivate
                      ? "hover-background-effect-light-theme"
                      : ""
                  }
                >
                  <div
                    style={{
                      backgroundColor: userInfo.isPrivate
                        ? "#1d9bf0"
                        : "transparent",
                      border: userInfo.isPrivate
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
                        display: userInfo.isPrivate ? "" : "none",
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
          <div
            className="mt-3"
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                width: "93%",
              }}
              className="mt-3"
            >
              <div
                className={
                  themeName === "dark-theme"
                    ? "make-dark-theme-bej-color-dark-theme"
                    : "make-light-theme-color-light-theme"
                }
                style={{
                  fontSize: "15px",
                  lineHeight: "20px",
                  fontWeight: "400",
                }}
              >
                Protect your videos
              </div>
              <div
                className={
                  themeName === "dark-theme"
                    ? "text-dark-theme"
                    : "text-light-theme"
                }
                style={{
                  fontSize: "13px",
                  lineHeight: "16px",
                  fontWeight: "400",
                }}
              >
                If selected, videos in your posts will not be downloadable by
                default. This setting applies to posts going forward and is not
                retroactive <span className="blue-underline">Learn more</span>
              </div>{" "}
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div
                onClick={toggleVideoPrivacy}
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  cursor: "pointer",
                  position: "relative",
                }}
                className={
                  themeName === "dark-theme" && userInfo.isVideosProtected
                    ? "hover-background-effect-clicked-dark-theme"
                    : themeName !== "dark-theme" && userInfo.isVideosProtected
                    ? "hover-background-effect-clicked-light-theme"
                    : themeName === "dark-theme" && !userInfo.isVideosProtected
                    ? "hover-background-effect-dark-theme"
                    : themeName !== "dark-theme" && !userInfo.isVideosProtected
                    ? "hover-background-effect-light-theme"
                    : ""
                }
              >
                <div
                  style={{
                    backgroundColor: userInfo.isVideosProtected
                      ? "#1d9bf0"
                      : "transparent",
                    border: userInfo.isVideosProtected
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
                      display: userInfo.isVideosProtected ? "" : "none",
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
        <div
          style={{
            paddingLeft: "16px",
            paddingRight: "16px",
            paddingBottom: "12px",
            cursor: "pointer",
          }}
          className={
            themeName === "dark-theme"
              ? "has-children-dark-theme_sub"
              : "has-children-light-theme_sub"
          }
          onClick={() => {
            navigate("/settings/tagging");
          }}
        >
          <div
            className={
              themeName === "dark-theme"
                ? "text-dark-theme mt-3"
                : "text-light-theme mt-3"
            }
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div className="mt-3">
              <div
                className={
                  themeName === "dark-theme"
                    ? "make-dark-theme-bej-color-dark-theme"
                    : "make-light-theme-color-light-theme"
                }
                style={{
                  fontSize: "15px",
                  lineHeight: "20px",
                  fontWeight: "400",
                }}
              >
                Photo tagging
              </div>
              <div
                className={
                  themeName === "dark-theme"
                    ? "text-dark-theme"
                    : "text-light-theme"
                }
                style={{
                  fontSize: "13px",
                  lineHeight: "16px",
                  fontWeight: "400",
                }}
              >
                {isTaggingOn ? "Off" : "On"}
              </div>
            </div>
            <div>
              {" "}
              <svg
                fill={themeName === "dark-theme" ? "#71767a" : "#536371"}
                width={`${1.25}em`}
                height={`${1.25}em`}
                className={
                  themeName === "dark-theme"
                    ? "svg-setting-section-arrow-dark-theme"
                    : "svg-setting-section-arrow-light-theme"
                }
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
        </div>{" "}
      </Col>
    </>
  );
}

export default AudienceAndTagging;
