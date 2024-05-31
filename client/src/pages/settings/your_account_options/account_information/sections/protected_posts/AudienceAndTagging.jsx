import { Col } from "react-bootstrap";
import SettingsNavigation from "../../../../../../components/SettingsNavigation/SettingsNavigation";
import { useAntdMessageHandler } from "../../../../../../utils/useAntdMessageHandler";
import useWindowDimensions from "../../../../../../hooks/getWindowDimensions";
import { useContext, useState } from "react";
import { ThemeContext } from "../../../../../../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../../../../context/UserContext";

function AudienceAndTagging() {
  const { contextHolder } = useAntdMessageHandler();
  const { width } = useWindowDimensions();
  const [{ theme, themeName }] = useContext(ThemeContext);
  const navigate = useNavigate();
  const { userInfo } = useContext(UserContext);

  const [isTaggingOn, setIsTaggingOn] = useState(null);
  const [secondClicked, setSecondClicked] = useState(null);
  const [thirdClicked, setThirdClicked] = useState(null);
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
          <div className="mt-2 first-head">Audience, media and tagging</div>
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
                      backgroundColor: secondClicked
                        ? "#1d9bf0"
                        : "transparent",
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
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <svg
                      style={{
                        display: secondClicked ? "" : "none",
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
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <svg
                    style={{
                      display: thirdClicked ? "" : "none",
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
