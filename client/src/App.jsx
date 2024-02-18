import { UserProvider } from "./context/UserContext";
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
function App() {
  return (
    <UserProvider>
      <Routes>
        <Route path="/" element={<HomePage />}></Route>
        <Route path="/home" element={<MainPage />}></Route>
        <Route path="/profile" element={<UserProfile />}></Route>
        <Route path="/profile/:id" element={<SpesificUserProfile />}></Route>
        <Route path="/messages" element={<MessagesPage />}></Route>
        <Route
          path="/messages/:chatRoomId"
          element={<ChatDetailsPage />}
        ></Route>
        <Route
          path="/:postOwner/status/:postId"
          element={<PostDetailPage />}
        ></Route>

        {/* new page start to check  */}
        <Route
          path="/:postOwner/status/:postId/photo/1"
          element={<ImagePostDetailPage />}
        ></Route>
        {/* new page finish to check  */}

        <Route
          path="/profile/:userId/following"
          element={<FollowingDetailPage />}
        ></Route>

        <Route
          path="/profile/:userId/followers"
          element={<FollowerDetailPage />}
        ></Route>
      </Routes>
    </UserProvider>
  );
}

export default App;
