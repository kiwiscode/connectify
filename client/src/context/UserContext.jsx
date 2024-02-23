import { useState, useEffect, createContext } from "react";
import PropTypes from "prop-types";

import io from "socket.io-client";

// when working on local version
const API_URL = "http://localhost:3000";

// when working on deployment version
// ?

const socket = io.connect(`${API_URL}`);

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(() => {
    const storedUserInfo = JSON.parse(localStorage.getItem("userInfo"));

    return (
      storedUserInfo || {
        username: "",
        email: "",
        userId: "",
        verified: false,
        active: false,
        posts: [],
        reposts: [],
        followers: [],
        following: [],
        favorites: [],
        socketId: "",
      }
    );
  });

  useEffect(() => {
    localStorage.setItem("userInfo", JSON.stringify(userInfo));
    localStorage.setItem("socketId", userInfo.socketId);
    console.log("User info socket id =>", userInfo.socketId);
  }, [userInfo]);

  const updateUser = (newUserInfo) => {
    setUserInfo((prevUserInfo) => ({
      ...prevUserInfo,
      ...newUserInfo,
    }));
  };

  const logout = () => {
    // Kullanıcının bağlantısını kapat
    socket.disconnect();

    setUserInfo({
      username: "",
      email: "",
      userId: "",
      verified: false,
      active: false,
      posts: [],
      reposts: [],
      followers: [],
      following: [],
      favorites: [],
      socketId: "",
    });
    userInfo.active = false;
    localStorage.removeItem("userInfo");
    localStorage.removeItem("token");
    localStorage.removeItem("following");
    localStorage.removeItem("followers");
    localStorage.removeItem("profileInfoPosts");
    localStorage.removeItem("profileInfoFavorites");
    localStorage.removeItem("profileFavorites");
    localStorage.removeItem("profilePagePosts");
    localStorage.removeItem("mainPagePosts");
    localStorage.removeItem("socketId");
  };

  const setToken = (token) => {
    localStorage.setItem("token", token);
  };

  const getToken = () => {
    return localStorage.getItem("token");
  };

  return (
    <UserContext.Provider
      value={{
        userInfo,
        updateUser,
        logout,
        setToken,
        getToken,
        socket,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { UserContext, UserProvider };
