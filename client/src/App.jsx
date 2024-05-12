import { Suspense, lazy, useContext, useEffect } from "react";
import HomePage from "./pages/HomePage";

const MainPage = lazy(() => import("./pages/MainPage"));
const UserProfile = lazy(() => import("./pages/UserProfilePage"));
const SpesificUserProfile = lazy(() => import("./pages/SpesificUserProfile"));
import { Routes, Route, useLocation } from "react-router-dom";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
const MessagesPage = lazy(() => import("./pages/MessagesPage"));
const ChatDetailsPage = lazy(() => import("./pages/ChatDetailsPage"));
const PostDetailPage = lazy(() => import("./pages/PostDetailPage"));
const FollowingDetailPage = lazy(() => import("./pages/FollowingDetail"));
const FollowerDetailPage = lazy(() => import("./pages/FollowersDetailPage"));
const DeactivatedPage = lazy(() => import("./pages/DeactivatedPage"));
const NotificationsPage = lazy(() => import("./pages/NotificationsPage"));

import { ThemeContext } from "./context/ThemeContext";
import { UserProvider } from "./context/UserContext";

import Posts from "./components/Posts/Posts";

import LoadingSpinner from "./components/ui/LoadingSpinner";
import { Bounce, ToastContainer, toast } from "react-toastify";

// when working on local version
const API_URL = "http://localhost:3000";

// when working on deployment version
// ?

import io from "socket.io-client";
const socket = io.connect(`${API_URL}`);
import CustomNotification from "./components/Notifications/CustomNotification";

function App() {
  const location = useLocation();
  const path = location.pathname;

  console.log("Current path:", path);

  const [{ theme, themeName }] = useContext(ThemeContext);

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  useEffect(() => {
    socket.emit(
      "current_url_for_checking_if_user_inside_chat_details_page",
      path
    );
    socket.emit("socket_userInfo", userInfo);
  }, [path]);

  useEffect(() => {
    socket.on("socket_id_for_user", (socketId) => {
      localStorage.setItem("socketId", socketId);
    });
    socket.emit("setUsername", userInfo.username);
  }, []);
  useEffect(() => {
    console.log("Custom notification test !!!");
    socket.on("getNotification", (data) => {
      console.log("Data =>", data);
    });

    socket.on("getText", (data) => {
      console.log("Data get text =>", data);
      console.log("User info =>", userInfo);

      if (data.senderName !== userInfo.username) {
        console.log("Buradayız ve neden çalışmasın ki toast container ???");

        // Path "/messages" veya "/messages/:chatRoomId" ise ve notification type "message" değilse toast göster ???

        toast(
          <CustomNotification
            senderName={data.senderName}
            type={data.type}
            contactHasBeenMade={data.contactHasBeenMade}
            senderInfo={data.senderInfo}
            text={data.text ? data.text : null}
          />,
          {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            transition: Bounce,
          }
        );
      } else {
        console.log("You cannot send a notification to yourself.");
      }
    });
  }, [socket]);

  return (
    <>
      <UserProvider>
        <ToastContainer theme={themeName === "dark-theme" ? "dark" : "light"} />{" "}
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
          <Suspense
            fallback={
              <LoadingSpinner
                isSuspense={true}
                strokeColor={"rgb(29, 155, 240)"}
              ></LoadingSpinner>
            }
          >
            <Routes>
              <Route path="/" element={<HomePage />} />

              <Route path="/home" element={<MainPage />}></Route>

              <Route
                path="/notifications"
                element={<NotificationsPage />}
              ></Route>
              <Route path="/messages" element={<MessagesPage />}></Route>
              <Route path="/profile" element={<UserProfile />}></Route>
              <Route
                path="/profile/:id"
                element={<SpesificUserProfile />}
              ></Route>
              <Route
                path="/:postOwner/status/:postId"
                element={<PostDetailPage />}
              ></Route>
              <Route
                path="/messages/:chatRoomId"
                element={<ChatDetailsPage />}
              ></Route>

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
          </Suspense>
        </div>
      </UserProvider>
    </>
  );
}

export default App;
