import HomePage from "./pages/HomePage";
import MainPage from "./pages/MainPage";
import UserProfile from "./pages/UserProfilePage";
import SpesificUserProfile from "./pages/SpesificUserProfile";
import { Routes, Route } from "react-router-dom";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";

import MessagesPage from "./pages/MessagesPage";
import ChatDetailsPage from "./pages/ChatDetailsPage";
import PostDetailPage from "./pages/PostDetailPage";
import FollowingDetailPage from "./pages/FollowingDetail";
import FollowerDetailPage from "./pages/FollowersDetailPage";
import ImagePostDetailPage from "./pages/ImagePostDetailPage";
import DeactivatedPage from "./pages/DeactivatedPage";
import NotificationsPage from "./pages/NotificationsPage";
import { ThemeContext } from "./context/ThemeContext";
import { useContext, useEffect, useState } from "react";
import { UrlContext } from "./context/UrlContext";
import { UserProvider } from "./context/UserContext";

import Posts from "./components/Posts/Posts";

import useSound from "use-sound";

import ActiveLightModeSound from "./assets/light-mode-active.mp3";
import ActiveDarkModeSound from "./assets/dark-mode-active.mp3";

function App() {
  // const { url, urlHistory } = useContext(UrlContext);

  // console.log("Current Url =>", url);
  // console.log("Url history array =>", urlHistory);

  const [
    { theme, themeName, activeFontSizeOption },
    toggleThemeBetweenLightDarkMode,
  ] = useContext(ThemeContext);

  // const [hoveredThemeName, setHoveredThemeName] = useState(null);

  const [play] = useSound(
    themeName === "dark-theme"
      ? ActiveLightModeSound
      : themeName === "light-theme"
      ? ActiveDarkModeSound
      : null
  );

  const activeFontSizeOptionPixel = activeFontSizeOption.slice(
    activeFontSizeOption.lastIndexOf(" ") + 1
  );

  return (
    <UserProvider>
      <div
        className={
          themeName === "dark-theme"
            ? "dark-theme"
            : themeName === "light-theme"
            ? "light-theme"
            : null
        }
        style={{
          backgroundColor: theme.backgroundColor,
          color: theme.color,
        }}
      >
        {/* toggle theme mode start to check test  */}
        {/* <button
          onMouseEnter={
            themeName === "dark-theme"
              ? () => {
                  setHoveredThemeName("dark-theme");
                }
              : () => setHoveredThemeName("light-theme")
          }
          onMouseLeave={() => setHoveredThemeName(null)}
          className={
            themeName === "dark-theme"
              ? `Activate-light-mode`
              : themeName === "light-theme"
              ? "Activate-dark-mode"
              : null
          }
          style={{
            zIndex: 9999,
            border: "none",
            backgroundColor: "transparent",
            transitionDuration: "0.3s",
            position: "fixed",
            right: "20px",
            top: "10px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
          type="button"
          onClick={() => {
            play();
            toggleThemeBetweenLightDarkMode();
          }}
        >
          <svg
            width={20}
            height={18}
            viewBox="0 0 18 18"
            style={{
              transform: "rotate(90deg)",
            }}
            className="sc-a794b73f-1 upJhz"
          >
            <mask id="moon-mask-main-nav">
              <rect x="0" y="0" width={18} height={18} fill={"#FFF"}></rect>
              <circle cx="25" cy="0" r="8" fill="black"></circle>
            </mask>
            <circle
              cx="9"
              cy="9"
              r="5"
              fill={
                themeName === "dark-theme" && hoveredThemeName !== "dark-theme"
                  ? "#B9BABC"
                  : hoveredThemeName === "dark-theme" &&
                    themeName === "dark-theme"
                  ? "white"
                  : themeName === "light-theme" &&
                    hoveredThemeName !== "light-theme"
                  ? "#414A54"
                  : hoveredThemeName === "light-theme" &&
                    themeName === "light-theme"
                  ? "black"
                  : null
              }
              mask="url(#moon-mask-main-nav)"
            ></circle>
            <g>
              <circle
                cx="17"
                cy="9"
                r="1.5"
                fill={
                  themeName === "light-theme" &&
                  hoveredThemeName !== "light-theme"
                    ? "#414A54"
                    : themeName === "light-theme" &&
                      hoveredThemeName === "light-theme"
                    ? "black"
                    : null
                }
                style={{
                  transformOrigin: "center center",
                  transform: "scale(1)",
                }}
              ></circle>
              <circle
                cx="13"
                cy="15.928203"
                r="1.5"
                fill={
                  themeName === "light-theme" &&
                  hoveredThemeName !== "light-theme"
                    ? "#414A54"
                    : themeName === "light-theme" &&
                      hoveredThemeName === "light-theme"
                    ? "black"
                    : null
                }
                style={{
                  transformOrigin: "center center",
                  transform: "scale(1)",
                }}
              ></circle>
              <circle
                cx="5"
                cy="15.928203"
                r="1.5"
                fill={
                  themeName === "light-theme" &&
                  hoveredThemeName !== "light-theme"
                    ? "#414A54"
                    : themeName === "light-theme" &&
                      hoveredThemeName === "light-theme"
                    ? "black"
                    : null
                }
                style={{
                  transformOrigin: "center center",
                  transform: "scale(1)",
                }}
              ></circle>
              <circle
                cx="1"
                cy="9"
                r="1.5"
                fill={
                  themeName === "light-theme" &&
                  hoveredThemeName !== "light-theme"
                    ? "#414A54"
                    : themeName === "light-theme" &&
                      hoveredThemeName === "light-theme"
                    ? "black"
                    : null
                }
                style={{
                  transformOrigin: "center center",
                  transform: "scale(1)",
                }}
              ></circle>
              <circle
                cx="5"
                cy="2.071797"
                r="1.5"
                fill={
                  themeName === "light-theme" &&
                  hoveredThemeName !== "light-theme"
                    ? "#414A54"
                    : themeName === "light-theme" &&
                      hoveredThemeName === "light-theme"
                    ? "black"
                    : null
                }
                style={{
                  transformOrigin: "center center",
                  transform: "scale(1)",
                }}
              ></circle>
              <circle
                cx="13"
                cy="2.071797"
                r="1.5"
                fill={
                  themeName === "light-theme" &&
                  hoveredThemeName !== "light-theme"
                    ? "#414A54"
                    : themeName === "light-theme" &&
                      hoveredThemeName === "light-theme"
                    ? "black"
                    : null
                }
                style={{
                  transformOrigin: "center center",
                  transform: "scale(1)",
                }}
              ></circle>
            </g>
          </svg>
        </button>{" "} */}
        {/* toggle theme mode finish to check test  */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<MainPage />}></Route>
          <Route path="/notifications" element={<NotificationsPage />}></Route>
          <Route path="/messages" element={<MessagesPage />}></Route>
          <Route path="/profile" element={<UserProfile />}></Route>
          <Route path="/profile/:id" element={<SpesificUserProfile />}></Route>
          <Route
            path="/:postOwner/status/:postId"
            element={<PostDetailPage />}
          ></Route>
          <Route
            path="/messages/:chatRoomId"
            element={<ChatDetailsPage />}
          ></Route>
          {/* new page start to check  INFO => CONTROL STYLING*/}
          <Route
            path="/:postOwner/status/:postId/photo/1"
            element={<ImagePostDetailPage />}
          ></Route>
          {/* new page finish to check INFO => CONTROL STYLING */}
          <Route
            path="/profile/:userId/following"
            element={<FollowingDetailPage />}
          ></Route>

          <Route
            path="/profile/:userId/followers"
            element={<FollowerDetailPage />}
          ></Route>

          <Route
            path="/settings/deactivated"
            element={<DeactivatedPage />}
          ></Route>

          {/* test pages start to check  */}
          <Route path="/posts-component-test" element={<Posts />}></Route>

          {/* test pages finish to check  */}
        </Routes>
      </div>
    </UserProvider>
  );
}

export default App;
