import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import LogoutModal from "../../Main-Left-Side-Navbar/LogoutModal";
import { UserContext } from "../../../context/UserContext";
import { ThemeContext } from "../../../context/ThemeContext";
import "./MobileTopNavigation.css";

function MobileTopNavigation({ noIcon, navigationBarOpenedStatus }) {
  const { userInfo } = useContext(UserContext);
  const [{ theme, themeName }] = useContext(ThemeContext);
  const [openNavigationBar, setOpenNavigationBar] = useState(false);

  const navigate = useNavigate();
  const handleParentClick = () => {
    setOpenNavigationBar(false);
  };

  const handleChildClick = (event) => {
    event.stopPropagation();
  };

  function handleClickNavigationBarOpened() {
    navigationBarOpenedStatus("mobile top navigation was opened");
  }

  function handleClickNavigationBarClosed() {
    navigationBarOpenedStatus("mobile top navigation was closed");
  }

  return (
    <>
      {openNavigationBar && (
        <div
          // onClick={handleParentClick}
          onClick={() => {
            handleParentClick();
            handleClickNavigationBarClosed();
          }}
          style={{
            position: "fixed",
            display: "flex",
            left: 0,
            bottom: 0,
            top: 0,
            right: 0,
            zIndex: 9999,
            backgroundColor:
              themeName === "dark-theme"
                ? "rgba(91, 112, 131, 0.4)"
                : "rgba(0,0,0,0.4)",
          }}
        >
          <div
            onClick={handleChildClick}
            className={`mobile-top-navigation-column scrollbar-add-mobile-navigation-top scrollbar-add-mobile-navigation-top-${themeName}`}
            style={{
              position: "absolute",
              left: "0px",
              maxWidth: "70%",
              minWidth: "280px",
              height: "100vh",
              minHeight: "0px",
              display: "flex",
              flexDirection: "column",
              flexShrink: "1",
              flexGrow: "1",
              overflowY: "auto",
              zIndex: 9999,
              pointerEvents: "auto",
              backgroundColor: themeName === "dark-theme" ? "black" : "white",
              boxShadow:
                themeName === "dark-theme"
                  ? "rgba(217, 217, 217, 0.2) 0px 0px 5px 0px, rgba(217, 217, 217, 0.25) 0px 1px 4px 1px"
                  : "rgba(101, 119, 134, 0.2) 0px 0px 8px 0px, rgba(101, 119, 134, 0.25) 0px 1px 3px 1px",
            }}
          >
            <div
              style={{
                padding: "16px",
                boxSizing: "border-box",
                display: "flex",
                alignItems: "stretch",
                flexBasis: "auto",
                flexDirection: "column",
                flexShrink: "0",
                margin: "0px",
                minHeight: "0px",
                minWidth: "0px",
                position: "relative",
                pointerEvents: "auto",
              }}
            >
              <div
                style={{
                  justifyContent: "space-between",
                  flexDirection: "row",
                  alignItems: "stretch",
                  boxSizing: "border-box",
                  display: "flex",
                  flexBasis: "auto",
                  flexShrink: 0,
                  margin: "0px",
                  minHeight: "0px",
                  minWidth: "0px",
                  padding: "0px",
                  position: "relative",
                  pointerEvents: "auto",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    transitionDuration: "0.2s",
                    outlineStyle: "none",
                    width: "40px",
                    height: "40px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {" "}
                  {userInfo?.imageUrl?.slice(0, 3) !== "../" ? (
                    <div
                      onClick={() => {
                        navigate("/profile");
                      }}
                      className="test"
                      style={{
                        width: "44px",
                        height: "44px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: "50%",
                        cursor: "pointer",
                      }}
                    >
                      <img
                        src={userInfo.imageUrl}
                        width={40}
                        height={40}
                        alt=""
                        style={{
                          borderRadius: "50%",
                        }}
                      />
                    </div>
                  ) : (
                    <div
                      onClick={() => {
                        navigate("/profile");
                      }}
                      className="test"
                      style={{
                        width: "44px",
                        height: "44px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: "50%",
                        cursor: "pointer",
                      }}
                      href=""
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="40"
                        height="40"
                        fill={
                          themeName === "dark-theme"
                            ? "#71767A"
                            : "rgb(83, 100, 113)"
                        }
                        style={{
                          borderRadius: "50%",
                        }}
                        className="bi bi-person-circle"
                        viewBox="0 0 16 16"
                      >
                        <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                        <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1" />
                      </svg>
                    </div>
                  )}
                </div>
                <div
                  className={
                    themeName === "dark-theme"
                      ? "hover-effect-dark-theme-pointer-plus"
                      : "hover-effect-light-theme-pointer-plus"
                  }
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxSizing: "border-box",
                    margin: "0px",
                    padding: "0px",
                    position: "relative",
                    whiteSpace: "pre-wrap",
                    cursor: "pointer",
                    pointerEvents: "auto",
                    width: "30px",
                    height: "30px",
                    borderRadius: "50%",
                    border:
                      themeName === "dark-theme"
                        ? "1px solid #536471"
                        : "1px solid rgb(185, 202, 211)",
                  }}
                >
                  <svg
                    style={{
                      display: "inline-block",
                    }}
                    fill={themeName === "dark-theme" ? "#EFF3F4" : "#0F1419"}
                    width={18}
                    height={18}
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-1hjwoze r-12ym1je"
                    data-testid="iconPlus"
                  >
                    <g>
                      <path d="M11 11V4h2v7h7v2h-7v7h-2v-7H4v-2h7z"></path>
                    </g>
                  </svg>
                </div>
              </div>
              <div
                style={{
                  alignItems: "stretch",
                  boxSizing: "border-box",
                  display: "flex",
                  flexBasis: "auto",
                  flexDirection: "column",
                  flexShrink: 0,
                  margin: "0px",
                  minHeight: "0px",
                  minWidth: "0px",
                  padding: "0px",
                  marginTop: "1rem",
                }}
              >
                <div
                  style={{
                    maxWidth: "100%",
                    flexShrink: 1,
                    outlineStyle: "none",
                    alignItems: "stretch",
                    boxSizing: "border-box",
                    display: "flex",
                    flexBasis: "auto",
                    flexDirection: "column",
                    margin: "0px",
                    minHeight: "0px",
                    minWidth: "0px",
                    padding: "0px",
                    pointerEvents: "auto",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      boxSizing: "border-box",
                      alignItems: "center",
                      justifyContent: "flex-start",
                    }}
                  >
                    <div
                      onClick={() => {
                        navigate("/profile");
                      }}
                      className={
                        themeName === "dark-theme"
                          ? "soft-grey-dark-theme-text-variant-1 chirp-bold-font hover-fullname"
                          : "very-dark-gray-light-theme-text-variant-1 chirp-bold-font hover-fullname"
                      }
                      style={{
                        fontSize: "15px",
                        lineHeight: "20px",
                        cursor: "pointer",
                      }}
                    >
                      {userInfo.fullname}
                    </div>
                    <div
                      style={{
                        marginLeft: "2px",
                      }}
                    >
                      {!userInfo?.isPrivate && (
                        <span
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <svg
                            fill={
                              themeName === "dark-theme" ? "#E6E9EA" : "#0F141A"
                            }
                            width={`${1.25}em`}
                            height={`${1.25}em`}
                            viewBox="0 0 24 24"
                            aria-label="Protected account"
                            role="img"
                            className="r-4qtqp9 r-yyyyoo r-1xvli5t r-bnwqim r-lrvibr r-m6rgpd r-3t4u6i r-18jsvk2 r-f9ja8p r-og9te1"
                            data-testid="icon-lock"
                          >
                            <g>
                              <path d="M17.5 7H17v-.25c0-2.76-2.24-5-5-5s-5 2.24-5 5V7h-.5C5.12 7 4 8.12 4 9.5v9C4 19.88 5.12 21 6.5 21h11c1.39 0 2.5-1.12 2.5-2.5v-9C20 8.12 18.89 7 17.5 7zM13 14.73V17h-2v-2.27c-.59-.34-1-.99-1-1.73 0-1.1.9-2 2-2 1.11 0 2 .9 2 2 0 .74-.4 1.39-1 1.73zM15 7H9v-.25c0-1.66 1.35-3 3-3 1.66 0 3 1.34 3 3V7z"></path>
                            </g>
                          </svg>
                        </span>
                      )}
                    </div>
                  </div>
                  <div
                    className={
                      themeName === "dark-theme"
                        ? "soft-grey-dark-theme-text-variant-2 chirp-regular-font"
                        : "very-dark-gray-light-theme-text-variant-2 chirp-regular-font"
                    }
                  >
                    <span
                      onClick={() => {
                        navigate("/profile");
                      }}
                      style={{
                        fontSize: "15px",
                        lineHeight: "20px",
                        cursor: "pointer",
                      }}
                    >
                      @{userInfo.username}
                    </span>
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    flexDirection: "row",
                    alignItems: "stretch",
                    boxSizing: "border-box",
                    flexBasis: "auto",
                    flexShrink: "0",
                    margin: "12px 0px 0px 0px",
                    minHeight: "0px",
                    minWidth: "0px",
                    padding: "0px",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      flexGrow: "1",
                      flexShrink: "1",
                      flexBasis: "0%",
                      alignItems: "stretch",
                      boxSizing: "border-box",
                      margin: "0px",
                      minHeight: "0px",
                      minWidth: "0px",
                      padding: "0px",
                      position: "relative",
                    }}
                  >
                    <div
                      onClick={() =>
                        navigate(`/profile/${userInfo._id}/following`)
                      }
                      className="hover-fullname"
                      style={{
                        marginRight: "20px",
                        cursor: "pointer",
                      }}
                    >
                      <span
                        className={
                          themeName === "dark-theme"
                            ? "soft-grey-dark-theme-text-variant-1 chirp-bold-font"
                            : "very-dark-gray-light-theme-text-variant-1 chirp-bold-font"
                        }
                        style={{
                          fontSize: "14px",
                          lineHeight: "16px",
                          cursor: "pointer",
                        }}
                      >
                        {userInfo.following.length}
                      </span>{" "}
                      <span
                        className={
                          themeName === "dark-theme"
                            ? "soft-grey-dark-theme-text-variant-2 chirp-regular-font"
                            : "very-dark-gray-light-theme-text-variant-2 chirp-regular-font"
                        }
                        style={{
                          fontSize: "14px",
                          lineHeight: "16px",
                          cursor: "pointer",
                        }}
                      >
                        Following
                      </span>
                    </div>
                    <div
                      onClick={() =>
                        navigate(`/profile/${userInfo._id}/followers`)
                      }
                      className="hover-fullname"
                      style={{
                        cursor: "pointer",
                      }}
                    >
                      <span
                        className={
                          themeName === "dark-theme"
                            ? "soft-grey-dark-theme-text-variant-1 chirp-bold-font"
                            : "very-dark-gray-light-theme-text-variant-1 chirp-bold-font"
                        }
                        style={{
                          fontSize: "14px",
                          lineHeight: "16px",
                          cursor: "pointer",
                        }}
                      >
                        {userInfo.followers.length}
                      </span>{" "}
                      <span
                        className={
                          themeName === "dark-theme"
                            ? "soft-grey-dark-theme-text-variant-2 chirp-regular-font"
                            : "very-dark-gray-light-theme-text-variant-2 chirp-regular-font"
                        }
                        style={{
                          fontSize: "14px",
                          lineHeight: "16px",
                          cursor: "pointer",
                        }}
                      >
                        <span>
                          {userInfo.followers
                            ? userInfo.followers.length > 1
                              ? "Followers"
                              : userInfo.followers.length === 0
                              ? "Followers"
                              : "Follower"
                            : null}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              onClick={() => {
                navigate("/profile");
              }}
              className={
                themeName === "dark-theme"
                  ? "hover-effect-dark-theme-pointer-plus"
                  : "hover-effect-light-theme-pointer-plus"
              }
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                flexBasis: "auto",
                boxSizing: "border-box",
                flexShrink: "0",
                margin: "0px",
                minHeight: "0px",
                minWidth: "0px",
                position: "relative",
                padding: "16px",
              }}
            >
              <div
                style={{
                  maxWidth: "100%",
                  outlineStyle: "none",
                  cursor: "pointer",
                  flexGrow: "1",
                  boxSizing: "border-box",
                  display: "flex",
                  flexBasis: "auto",
                  flexDirection: "column",
                  flexShrink: "0",
                  listStyle: "none",
                  margin: "0px",
                  padding: "0px",
                  minWidth: "0px",
                  minHeight: "0px",
                  position: "relative",
                  textDecoration: "none",
                  pointerEvents: "auto",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    flexGrow: "1",
                    padding: "16px",
                    boxSizing: "border-box",
                    flexBasis: "auto",
                    flexShrink: "0",
                    margin: "0px",
                    padding: "0px",
                    minWidth: "0px",
                    minHeight: "0px",
                    position: "relative",
                    textDecoration: "none",
                    pointerEvents: "auto",
                    cursor: "pointer",
                  }}
                >
                  <svg
                    style={{
                      marginRight: "24px",
                      userSelect: "none",
                      flexShrink: "0",
                      maxWidth: "100%",
                      position: "relative",
                      alignItems: "center",
                      display: "inline-block",
                      cursor: "pointer",
                      pointerEvents: "auto",
                    }}
                    fill={
                      themeName === "dark-theme"
                        ? "rgb(231,233,234)"
                        : "rgb(15, 20, 25)"
                    }
                    width={24}
                    height={24}
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-18jsvk2 r-1q142lx r-1kihuf0 r-1472mwg r-di8nfa r-lrsllp"
                    data-testid="icon"
                  >
                    <g>
                      <path d="M5.651 19h12.698c-.337-1.8-1.023-3.21-1.945-4.19C15.318 13.65 13.838 13 12 13s-3.317.65-4.404 1.81c-.922.98-1.608 2.39-1.945 4.19zm.486-5.56C7.627 11.85 9.648 11 12 11s4.373.85 5.863 2.44c1.477 1.58 2.366 3.8 2.632 6.46l.11 1.1H3.395l.11-1.1c.266-2.66 1.155-4.88 2.632-6.46zM12 4c-1.105 0-2 .9-2 2s.895 2 2 2 2-.9 2-2-.895-2-2-2zM8 6c0-2.21 1.791-4 4-4s4 1.79 4 4-1.791 4-4 4-4-1.79-4-4z"></path>
                    </g>
                  </svg>
                  <div
                    className={
                      themeName === "dark-theme"
                        ? "soft-grey-dark-theme-text-variant-1 chirp-bold-font"
                        : "very-dark-gray-light-theme-text-variant-1 chirp-bold-font"
                    }
                    style={{
                      textOverflow: "unset",
                      overflowWrap: "break-word",
                      maxWidth: "100%",
                      minWidth: "0px",
                      fontSize: "20px",
                      whiteSpace: "nowrap",
                      textAlign: "inherit",
                      flexGrow: "1",
                      lineHeight: "24px",
                      overflow: "hidden",
                      boxSizing: "border-box",
                      margin: "0px",
                      padding: "0px",
                      position: "relative",
                      listStyle: "none",
                      textDecoration: "none",
                    }}
                  >
                    Profile
                  </div>
                </div>
              </div>
            </div>
            <div
              onClick={() => {
                navigate("/i/premium_sign_up");
              }}
              className={
                themeName === "dark-theme"
                  ? "hover-effect-dark-theme-pointer-plus"
                  : "hover-effect-light-theme-pointer-plus"
              }
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                flexBasis: "auto",
                boxSizing: "border-box",
                flexShrink: "0",
                margin: "0px",
                minHeight: "0px",
                minWidth: "0px",
                position: "relative",
                padding: "16px",
              }}
            >
              <div
                href=""
                style={{
                  maxWidth: "100%",
                  outlineStyle: "none",
                  cursor: "pointer",
                  flexGrow: "1",
                  boxSizing: "border-box",
                  display: "flex",
                  flexBasis: "auto",
                  flexDirection: "column",
                  flexShrink: "0",
                  listStyle: "none",
                  margin: "0px",
                  padding: "0px",
                  minWidth: "0px",
                  minHeight: "0px",
                  position: "relative",
                  textDecoration: "none",
                  pointerEvents: "auto",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    flexGrow: "1",
                    padding: "16px",
                    boxSizing: "border-box",
                    flexBasis: "auto",
                    flexShrink: "0",
                    margin: "0px",
                    padding: "0px",
                    minWidth: "0px",
                    minHeight: "0px",
                    position: "relative",
                    textDecoration: "none",
                    pointerEvents: "auto",
                    cursor: "pointer",
                  }}
                >
                  <svg
                    style={{
                      marginRight: "24px",
                      userSelect: "none",
                      flexShrink: "0",
                      maxWidth: "100%",
                      position: "relative",
                      alignItems: "center",
                      display: "inline-block",
                      cursor: "pointer",
                      pointerEvents: "auto",
                    }}
                    xmlns="http://www.w3.org/2000/svg"
                    width={24}
                    height={24}
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
                  <div
                    className={
                      themeName === "dark-theme"
                        ? "soft-grey-dark-theme-text-variant-1 chirp-bold-font"
                        : "very-dark-gray-light-theme-text-variant-1 chirp-bold-font"
                    }
                    style={{
                      textOverflow: "unset",
                      overflowWrap: "break-word",
                      maxWidth: "100%",
                      minWidth: "0px",
                      fontSize: "20px",
                      whiteSpace: "nowrap",
                      textAlign: "inherit",
                      flexGrow: "1",
                      lineHeight: "24px",
                      overflow: "hidden",
                      boxSizing: "border-box",
                      margin: "0px",
                      padding: "0px",
                      position: "relative",
                      listStyle: "none",
                      textDecoration: "none",
                    }}
                  >
                    Premium
                  </div>
                </div>
              </div>
            </div>
            <div
              onClick={() => {
                navigate(`/${userInfo.username}/lists`);
              }}
              className={
                themeName === "dark-theme"
                  ? "hover-effect-dark-theme-pointer-plus"
                  : "hover-effect-light-theme-pointer-plus"
              }
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                flexBasis: "auto",
                boxSizing: "border-box",
                flexShrink: "0",
                margin: "0px",
                minHeight: "0px",
                minWidth: "0px",
                position: "relative",
                padding: "16px",
              }}
            >
              <div
                href=""
                style={{
                  maxWidth: "100%",
                  outlineStyle: "none",
                  cursor: "pointer",
                  flexGrow: "1",
                  boxSizing: "border-box",
                  display: "flex",
                  flexBasis: "auto",
                  flexDirection: "column",
                  flexShrink: "0",
                  listStyle: "none",
                  margin: "0px",
                  padding: "0px",
                  minWidth: "0px",
                  minHeight: "0px",
                  position: "relative",
                  textDecoration: "none",
                  pointerEvents: "auto",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    flexGrow: "1",
                    padding: "16px",
                    boxSizing: "border-box",
                    flexBasis: "auto",
                    flexShrink: "0",
                    margin: "0px",
                    padding: "0px",
                    minWidth: "0px",
                    minHeight: "0px",
                    position: "relative",
                    textDecoration: "none",
                    pointerEvents: "auto",
                    cursor: "pointer",
                  }}
                >
                  <svg
                    style={{
                      marginRight: "24px",
                      userSelect: "none",
                      flexShrink: "0",
                      maxWidth: "100%",
                      position: "relative",
                      alignItems: "center",
                      display: "inline-block",
                      cursor: "pointer",
                      pointerEvents: "auto",
                    }}
                    fill={
                      themeName === "dark-theme"
                        ? "rgb(231,233,234)"
                        : "rgb(15, 20, 25)"
                    }
                    width={24}
                    height={24}
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-18jsvk2 r-1q142lx r-1kihuf0 r-1472mwg r-di8nfa r-lrsllp"
                    data-testid="icon"
                  >
                    <g>
                      <path d="M3 4.5C3 3.12 4.12 2 5.5 2h13C19.88 2 21 3.12 21 4.5v15c0 1.38-1.12 2.5-2.5 2.5h-13C4.12 22 3 20.88 3 19.5v-15zM5.5 4c-.28 0-.5.22-.5.5v15c0 .28.22.5.5.5h13c.28 0 .5-.22.5-.5v-15c0-.28-.22-.5-.5-.5h-13zM16 10H8V8h8v2zm-8 2h8v2H8v-2z"></path>
                    </g>
                  </svg>
                  <div
                    className={
                      themeName === "dark-theme"
                        ? "soft-grey-dark-theme-text-variant-1 chirp-bold-font"
                        : "very-dark-gray-light-theme-text-variant-1 chirp-bold-font"
                    }
                    style={{
                      textOverflow: "unset",
                      overflowWrap: "break-word",
                      maxWidth: "100%",
                      minWidth: "0px",
                      fontSize: "20px",
                      whiteSpace: "nowrap",
                      textAlign: "inherit",
                      flexGrow: "1",
                      lineHeight: "24px",
                      overflow: "hidden",
                      boxSizing: "border-box",
                      margin: "0px",
                      padding: "0px",
                      position: "relative",
                      listStyle: "none",
                      textDecoration: "none",
                    }}
                  >
                    Lists
                  </div>
                </div>
              </div>
            </div>
            <div
              onClick={() => {
                navigate(`/i/bookmarks`);
              }}
              className={
                themeName === "dark-theme"
                  ? "hover-effect-dark-theme-pointer-plus"
                  : "hover-effect-light-theme-pointer-plus"
              }
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                flexBasis: "auto",
                boxSizing: "border-box",
                flexShrink: "0",
                margin: "0px",
                minHeight: "0px",
                minWidth: "0px",
                position: "relative",
                padding: "16px",
              }}
            >
              <div
                href=""
                style={{
                  maxWidth: "100%",
                  outlineStyle: "none",
                  cursor: "pointer",
                  flexGrow: "1",
                  boxSizing: "border-box",
                  display: "flex",
                  flexBasis: "auto",
                  flexDirection: "column",
                  flexShrink: "0",
                  listStyle: "none",
                  margin: "0px",
                  padding: "0px",
                  minWidth: "0px",
                  minHeight: "0px",
                  position: "relative",
                  textDecoration: "none",
                  pointerEvents: "auto",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    flexGrow: "1",
                    padding: "16px",
                    boxSizing: "border-box",
                    flexBasis: "auto",
                    flexShrink: "0",
                    margin: "0px",
                    padding: "0px",
                    minWidth: "0px",
                    minHeight: "0px",
                    position: "relative",
                    textDecoration: "none",
                    pointerEvents: "auto",
                    cursor: "pointer",
                  }}
                >
                  <svg
                    style={{
                      marginRight: "24px",
                      userSelect: "none",
                      flexShrink: "0",
                      maxWidth: "100%",
                      position: "relative",
                      alignItems: "center",
                      display: "inline-block",
                      cursor: "pointer",
                      pointerEvents: "auto",
                    }}
                    fill={
                      themeName === "dark-theme"
                        ? "rgb(231,233,234)"
                        : "rgb(15, 20, 25)"
                    }
                    width={24}
                    height={24}
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-18jsvk2 r-1q142lx r-1kihuf0 r-1472mwg r-di8nfa r-lrsllp"
                    data-testid="icon"
                  >
                    <g>
                      <path d="M4 4.5C4 3.12 5.119 2 6.5 2h11C18.881 2 20 3.12 20 4.5v18.44l-8-5.71-8 5.71V4.5zM6.5 4c-.276 0-.5.22-.5.5v14.56l6-4.29 6 4.29V4.5c0-.28-.224-.5-.5-.5h-11z"></path>
                    </g>
                  </svg>
                  <div
                    className={
                      themeName === "dark-theme"
                        ? "soft-grey-dark-theme-text-variant-1 chirp-bold-font"
                        : "very-dark-gray-light-theme-text-variant-1 chirp-bold-font"
                    }
                    style={{
                      textOverflow: "unset",
                      overflowWrap: "break-word",
                      maxWidth: "100%",
                      minWidth: "0px",
                      fontSize: "20px",
                      whiteSpace: "nowrap",
                      textAlign: "inherit",
                      flexGrow: "1",
                      lineHeight: "24px",
                      overflow: "hidden",
                      boxSizing: "border-box",
                      margin: "0px",
                      padding: "0px",
                      position: "relative",
                      listStyle: "none",
                      textDecoration: "none",
                    }}
                  >
                    Bookmarks
                  </div>
                </div>
              </div>
            </div>
            <div
              onClick={() => {
                navigate(`/settings/monetization`);
              }}
              className={
                themeName === "dark-theme"
                  ? "hover-effect-dark-theme-pointer-plus"
                  : "hover-effect-light-theme-pointer-plus"
              }
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                flexBasis: "auto",
                boxSizing: "border-box",
                flexShrink: "0",
                margin: "0px",
                minHeight: "0px",
                minWidth: "0px",
                position: "relative",
                padding: "16px",
              }}
            >
              <div
                href=""
                style={{
                  maxWidth: "100%",
                  outlineStyle: "none",
                  cursor: "pointer",
                  flexGrow: "1",
                  boxSizing: "border-box",
                  display: "flex",
                  flexBasis: "auto",
                  flexDirection: "column",
                  flexShrink: "0",
                  listStyle: "none",
                  margin: "0px",
                  padding: "0px",
                  minWidth: "0px",
                  minHeight: "0px",
                  position: "relative",
                  textDecoration: "none",
                  pointerEvents: "auto",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    flexGrow: "1",
                    padding: "16px",
                    boxSizing: "border-box",
                    flexBasis: "auto",
                    flexShrink: "0",
                    margin: "0px",
                    padding: "0px",
                    minWidth: "0px",
                    minHeight: "0px",
                    position: "relative",
                    textDecoration: "none",
                    pointerEvents: "auto",
                    cursor: "pointer",
                  }}
                >
                  <svg
                    style={{
                      marginRight: "24px",
                      userSelect: "none",
                      flexShrink: "0",
                      maxWidth: "100%",
                      position: "relative",
                      alignItems: "center",
                      display: "inline-block",
                      cursor: "pointer",
                      pointerEvents: "auto",
                    }}
                    fill={
                      themeName === "dark-theme"
                        ? "rgb(231,233,234)"
                        : "rgb(15, 20, 25)"
                    }
                    width={24}
                    height={24}
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-18jsvk2 r-1q142lx r-1kihuf0 r-1472mwg r-di8nfa r-lrsllp"
                    data-testid="icon"
                  >
                    <g>
                      <path d="M23 3v14h-2V5H5V3h18zM10 17c1.1 0 2-1.34 2-3s-.9-3-2-3-2 1.34-2 3 .9 3 2 3zM1 7h18v14H1V7zm16 10c-1.1 0-2 .9-2 2h2v-2zm-2-8c0 1.1.9 2 2 2V9h-2zM3 11c1.1 0 2-.9 2-2H3v2zm0 4c2.21 0 4 1.79 4 4h6c0-2.21 1.79-4 4-4v-2c-2.21 0-4-1.79-4-4H7c0 2.21-1.79 4-4 4v2zm0 4h2c0-1.1-.9-2-2-2v2z"></path>
                    </g>
                  </svg>
                  <div
                    className={
                      themeName === "dark-theme"
                        ? "soft-grey-dark-theme-text-variant-1 chirp-bold-font"
                        : "very-dark-gray-light-theme-text-variant-1 chirp-bold-font"
                    }
                    style={{
                      textOverflow: "unset",
                      overflowWrap: "break-word",
                      maxWidth: "100%",
                      minWidth: "0px",
                      fontSize: "20px",
                      whiteSpace: "nowrap",
                      textAlign: "inherit",
                      flexGrow: "1",
                      lineHeight: "24px",
                      overflow: "hidden",
                      boxSizing: "border-box",
                      margin: "0px",
                      padding: "0px",
                      position: "relative",
                      listStyle: "none",
                      textDecoration: "none",
                    }}
                  >
                    Monetization
                  </div>
                </div>
              </div>
            </div>
            <div
              onClick={() => {
                navigate(`/help/connectify`);
              }}
              className={
                themeName === "dark-theme"
                  ? "hover-effect-dark-theme-pointer-plus"
                  : "hover-effect-light-theme-pointer-plus"
              }
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                flexBasis: "auto",
                boxSizing: "border-box",
                flexShrink: "0",
                margin: "0px",
                minHeight: "0px",
                minWidth: "0px",
                position: "relative",
                padding: "16px",
              }}
            >
              <div
                href=""
                style={{
                  maxWidth: "100%",
                  outlineStyle: "none",
                  cursor: "pointer",
                  flexGrow: "1",
                  boxSizing: "border-box",
                  display: "flex",
                  flexBasis: "auto",
                  flexDirection: "column",
                  flexShrink: "0",
                  listStyle: "none",
                  margin: "0px",
                  padding: "0px",
                  minWidth: "0px",
                  minHeight: "0px",
                  position: "relative",
                  textDecoration: "none",
                  pointerEvents: "auto",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    flexGrow: "1",
                    padding: "16px",
                    boxSizing: "border-box",
                    flexBasis: "auto",
                    flexShrink: "0",
                    margin: "0px",
                    padding: "0px",
                    minWidth: "0px",
                    minHeight: "0px",
                    position: "relative",
                    textDecoration: "none",
                    pointerEvents: "auto",
                    cursor: "pointer",
                  }}
                >
                  <svg
                    style={{
                      marginRight: "24px",
                      userSelect: "none",
                      flexShrink: "0",
                      maxWidth: "100%",
                      position: "relative",
                      alignItems: "center",
                      display: "inline-block",
                      cursor: "pointer",
                      pointerEvents: "auto",
                    }}
                    fill={
                      themeName === "dark-theme"
                        ? "rgb(231,233,234)"
                        : "rgb(15, 20, 25)"
                    }
                    width={24}
                    height={24}
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-18jsvk2 r-1q142lx r-1kihuf0 r-1472mwg r-di8nfa r-lrsllp"
                    data-testid="icon"
                  >
                    <g>
                      <path d="M1.996 5.5c0-1.38 1.119-2.5 2.5-2.5h15c1.38 0 2.5 1.12 2.5 2.5v13c0 1.38-1.12 2.5-2.5 2.5h-15c-1.381 0-2.5-1.12-2.5-2.5v-13zm2.5-.5c-.277 0-.5.22-.5.5v13c0 .28.223.5.5.5h15c.276 0 .5-.22.5-.5v-13c0-.28-.224-.5-.5-.5h-15zm8.085 5H8.996V8h7v7h-2v-3.59l-5.293 5.3-1.415-1.42L12.581 10z"></path>
                    </g>
                  </svg>
                  <div
                    className={
                      themeName === "dark-theme"
                        ? "soft-grey-dark-theme-text-variant-1 chirp-bold-font"
                        : "very-dark-gray-light-theme-text-variant-1 chirp-bold-font"
                    }
                    style={{
                      textOverflow: "unset",
                      overflowWrap: "break-word",
                      maxWidth: "100%",
                      minWidth: "0px",
                      fontSize: "20px",
                      whiteSpace: "nowrap",
                      textAlign: "inherit",
                      flexGrow: "1",
                      lineHeight: "24px",
                      overflow: "hidden",
                      boxSizing: "border-box",
                      margin: "0px",
                      padding: "0px",
                      position: "relative",
                      listStyle: "none",
                      textDecoration: "none",
                    }}
                  >
                    Ads
                  </div>
                </div>
              </div>
            </div>
            <div
              onClick={() => navigate("/jobs")}
              className={
                themeName === "dark-theme"
                  ? "hover-effect-dark-theme-pointer-plus"
                  : "hover-effect-light-theme-pointer-plus"
              }
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                flexBasis: "auto",
                boxSizing: "border-box",
                flexShrink: "0",
                margin: "0px",
                minHeight: "0px",
                minWidth: "0px",
                position: "relative",
                padding: "16px",
              }}
            >
              <div
                href=""
                style={{
                  maxWidth: "100%",
                  outlineStyle: "none",
                  cursor: "pointer",
                  flexGrow: "1",
                  boxSizing: "border-box",
                  display: "flex",
                  flexBasis: "auto",
                  flexDirection: "column",
                  flexShrink: "0",
                  listStyle: "none",
                  margin: "0px",
                  padding: "0px",
                  minWidth: "0px",
                  minHeight: "0px",
                  position: "relative",
                  textDecoration: "none",
                  pointerEvents: "auto",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    flexGrow: "1",
                    padding: "16px",
                    boxSizing: "border-box",
                    flexBasis: "auto",
                    flexShrink: "0",
                    margin: "0px",
                    padding: "0px",
                    minWidth: "0px",
                    minHeight: "0px",
                    position: "relative",
                    textDecoration: "none",
                    pointerEvents: "auto",
                    cursor: "pointer",
                  }}
                >
                  <svg
                    style={{
                      marginRight: "24px",
                      userSelect: "none",
                      flexShrink: "0",
                      maxWidth: "100%",
                      position: "relative",
                      alignItems: "center",
                      display: "inline-block",
                      cursor: "pointer",
                      pointerEvents: "auto",
                    }}
                    fill={
                      themeName === "dark-theme"
                        ? "rgb(231,233,234)"
                        : "rgb(15, 20, 25)"
                    }
                    width={24}
                    height={24}
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-18jsvk2 r-1q142lx r-1kihuf0 r-1472mwg r-di8nfa r-lrsllp"
                    data-testid="icon"
                  >
                    <g>
                      <path d="M19.5 6H17V4.5C17 3.12 15.88 2 14.5 2h-5C8.12 2 7 3.12 7 4.5V6H4.5C3.12 6 2 7.12 2 8.5v10C2 19.88 3.12 21 4.5 21h15c1.38 0 2.5-1.12 2.5-2.5v-10C22 7.12 20.88 6 19.5 6zM9 4.5c0-.28.23-.5.5-.5h5c.28 0 .5.22.5.5V6H9V4.5zm11 14c0 .28-.22.5-.5.5h-15c-.27 0-.5-.22-.5-.5v-3.04c.59.35 1.27.54 2 .54h5v1h2v-1h5c.73 0 1.41-.19 2-.54v3.04zm0-6.49c0 1.1-.9 1.99-2 1.99h-5v-1h-2v1H6c-1.1 0-2-.9-2-2V8.5c0-.28.23-.5.5-.5h15c.28 0 .5.22.5.5v3.51z"></path>
                    </g>
                  </svg>
                  <div
                    className={
                      themeName === "dark-theme"
                        ? "soft-grey-dark-theme-text-variant-1 chirp-bold-font"
                        : "very-dark-gray-light-theme-text-variant-1 chirp-bold-font"
                    }
                    style={{
                      textOverflow: "unset",
                      overflowWrap: "break-word",
                      maxWidth: "100%",
                      minWidth: "0px",
                      fontSize: "20px",
                      whiteSpace: "nowrap",
                      textAlign: "inherit",
                      flexGrow: "1",
                      lineHeight: "24px",
                      overflow: "hidden",
                      boxSizing: "border-box",
                      margin: "0px",
                      padding: "0px",
                      position: "relative",
                      listStyle: "none",
                      textDecoration: "none",
                    }}
                  >
                    Jobs
                  </div>
                  <div
                    className="chirp-bold-font"
                    style={{
                      fontSize: "15px",
                      height: "20px",
                      paddingLeft: "4px",
                      paddingRight: "4px",
                      backgroundColor:
                        themeName === "dark-theme"
                          ? "rgb(73, 22, 0)"
                          : "rgb(255, 237, 219)",
                      borderRadius: "4px",
                      pointerEvents: "none !important",
                      color:
                        themeName === "dark-theme"
                          ? "rgb(255, 224, 194)"
                          : "rgb(105, 33, 0)",
                    }}
                  >
                    <div>Beta</div>
                  </div>
                </div>
              </div>
            </div>
            <div
              onClick={() => navigate("/settings")}
              className={
                themeName === "dark-theme"
                  ? "hover-effect-dark-theme-pointer-plus"
                  : "hover-effect-light-theme-pointer-plus"
              }
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                flexBasis: "auto",
                boxSizing: "border-box",
                flexShrink: "0",
                margin: "0px",
                minHeight: "0px",
                minWidth: "0px",
                position: "relative",
                padding: "16px",
              }}
            >
              <div
                href=""
                style={{
                  maxWidth: "100%",
                  outlineStyle: "none",
                  cursor: "pointer",
                  flexGrow: "1",
                  boxSizing: "border-box",
                  display: "flex",
                  flexBasis: "auto",
                  flexDirection: "column",
                  flexShrink: "0",
                  listStyle: "none",
                  margin: "0px",
                  padding: "0px",
                  minWidth: "0px",
                  minHeight: "0px",
                  position: "relative",
                  textDecoration: "none",
                  pointerEvents: "auto",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    flexGrow: "1",
                    padding: "16px",
                    boxSizing: "border-box",
                    flexBasis: "auto",
                    flexShrink: "0",
                    margin: "0px",
                    padding: "0px",
                    minWidth: "0px",
                    minHeight: "0px",
                    position: "relative",
                    textDecoration: "none",
                    pointerEvents: "auto",
                    cursor: "pointer",
                  }}
                >
                  <svg
                    style={{
                      marginRight: "24px",
                      userSelect: "none",
                      flexShrink: "0",
                      maxWidth: "100%",
                      position: "relative",
                      alignItems: "center",
                      display: "inline-block",
                      cursor: "pointer",
                      pointerEvents: "auto",
                    }}
                    fill={
                      themeName === "dark-theme"
                        ? "rgb(231,233,234)"
                        : "rgb(15, 20, 25)"
                    }
                    width={24}
                    height={24}
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-18jsvk2 r-1q142lx r-1kihuf0 r-1472mwg r-di8nfa r-lrsllp"
                    data-testid="icon"
                  >
                    <g>
                      <path d="M10.54 1.75h2.92l1.57 2.36c.11.17.32.25.53.21l2.53-.59 2.17 2.17-.58 2.54c-.05.2.04.41.21.53l2.36 1.57v2.92l-2.36 1.57c-.17.12-.26.33-.21.53l.58 2.54-2.17 2.17-2.53-.59c-.21-.04-.42.04-.53.21l-1.57 2.36h-2.92l-1.58-2.36c-.11-.17-.32-.25-.52-.21l-2.54.59-2.17-2.17.58-2.54c.05-.2-.03-.41-.21-.53l-2.35-1.57v-2.92L4.1 8.97c.18-.12.26-.33.21-.53L3.73 5.9 5.9 3.73l2.54.59c.2.04.41-.04.52-.21l1.58-2.36zm1.07 2l-.98 1.47C10.05 6.08 9 6.5 7.99 6.27l-1.46-.34-.6.6.33 1.46c.24 1.01-.18 2.07-1.05 2.64l-1.46.98v.78l1.46.98c.87.57 1.29 1.63 1.05 2.64l-.33 1.46.6.6 1.46-.34c1.01-.23 2.06.19 2.64 1.05l.98 1.47h.78l.97-1.47c.58-.86 1.63-1.28 2.65-1.05l1.45.34.61-.6-.34-1.46c-.23-1.01.18-2.07 1.05-2.64l1.47-.98v-.78l-1.47-.98c-.87-.57-1.28-1.63-1.05-2.64l.34-1.46-.61-.6-1.45.34c-1.02.23-2.07-.19-2.65-1.05l-.97-1.47h-.78zM12 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5c.82 0 1.5-.67 1.5-1.5s-.68-1.5-1.5-1.5zM8.5 12c0-1.93 1.56-3.5 3.5-3.5 1.93 0 3.5 1.57 3.5 3.5s-1.57 3.5-3.5 3.5c-1.94 0-3.5-1.57-3.5-3.5z"></path>
                    </g>
                  </svg>
                  <div
                    className={
                      themeName === "dark-theme"
                        ? "soft-grey-dark-theme-text-variant-1 chirp-bold-font"
                        : "very-dark-gray-light-theme-text-variant-1 chirp-bold-font"
                    }
                    style={{
                      textOverflow: "unset",
                      overflowWrap: "break-word",
                      maxWidth: "100%",
                      minWidth: "0px",
                      fontSize: "20px",
                      whiteSpace: "nowrap",
                      textAlign: "inherit",
                      flexGrow: "1",
                      lineHeight: "24px",
                      overflow: "hidden",
                      boxSizing: "border-box",
                      margin: "0px",
                      padding: "0px",
                      position: "relative",
                      listStyle: "none",
                      textDecoration: "none",
                    }}
                  >
                    Settings and privacy
                  </div>
                </div>
              </div>
            </div>{" "}
            <LogoutModal
              isResponsiveNavigationBarTop={false}
              isMobileNavigationBarTop={true}
            />
            <div
              style={{
                display: "inline-block",
                margin: "0px 32px",
                borderTop:
                  themeName === "dark-theme"
                    ? "1px solid rgb(70, 70, 70)"
                    : "1px solid rgba(0, 0, 0, 0.1)",
                opacity: "0.5",
              }}
            ></div>
            <div
              className={
                themeName === "dark-theme"
                  ? "hover-effect-dark-theme-pointer-plus chirp-bold-font"
                  : "hover-effect-light-theme-pointer-plus chirp-bold-font"
              }
              style={{
                padding: "16px",
                fontSize: "15px",
                lineHeight: "20px",
              }}
            >
              MStV Transparenzangaben
            </div>
            <div
              className={
                themeName === "dark-theme"
                  ? "hover-effect-dark-theme-pointer-plus chirp-bold-font"
                  : "hover-effect-light-theme-pointer-plus chirp-bold-font"
              }
              style={{
                padding: "16px",
                fontSize: "15px",
                lineHeight: "20px",
              }}
            >
              Imprint
            </div>
          </div>
        </div>
      )}
      <div
        style={{
          height: "53px",
          width: "100%",
          display: "flex",
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "center",
          padding: noIcon ? "" : "0px 16px",
          marginLeft: "auto",
          marginRight: "auto",
          boxSizing: "border-box",
          flexBasis: "auto",
          flexShrink: "0",
          backgroundColor:
            themeName === "dark-theme" && !noIcon
              ? "black"
              : themeName !== "dark-theme" && !noIcon
              ? "white"
              : null,
        }}
      >
        <div
          onClick={() => {
            setOpenNavigationBar(true);
            handleClickNavigationBarOpened();
          }}
          style={{
            minWidth: noIcon ? "" : "56px",
            flexBasis: "50%",
            alignItems: "flex-start",
            alignSelf: "stretch",
            flexShrink: "1",
            justifyContent: "center",
            flexGrow: "1",
            minHeight: "32px",
            display: "flex",
            flexDirection: "column",
            boxSizing: "border-box",
            pointerEvents: "none !important",
          }}
        >
          {userInfo?.imageUrl?.slice(0, 3) !== "../" ? (
            <img
              src={userInfo.imageUrl}
              width={32}
              height={32}
              alt=""
              style={{
                borderRadius: "50%",
                cursor: "pointer",
              }}
            />
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              fill={
                themeName === "dark-theme" ? "#71767A" : "rgb(83, 100, 113)"
              }
              style={{
                cursor: "pointer",
              }}
              className="bi bi-person-circle"
              viewBox="0 0 16 16"
            >
              <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
              <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1" />
            </svg>
          )}
        </div>
        {!noIcon && (
          <>
            <div
              style={{
                height: "1.75rem",
                maxWidth: "100%",
                position: "relative",
                flexGrow: "1",
                display: "inline-block",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={30}
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
            <div
              style={{
                minWidth: "56px",
                flexBasis: "50%",
                alignItems: "flex-start",
                alignSelf: "stretch",
                flexShrink: "1",
                justifyContent: "center",
                flexGrow: "1",
                minHeight: "32px",
                display: "flex",
                flexDirection: "column",
                boxSizing: "border-box",
                pointerEvents: "none !important",
              }}
            ></div>{" "}
          </>
        )}
      </div>
    </>
  );
}

export default MobileTopNavigation;
