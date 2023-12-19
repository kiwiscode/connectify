import { useState, useEffect, createContext } from "react";
import PropTypes from "prop-types";
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
        chatEngineInfos: {},
      }
    );
  });

  useEffect(() => {
    localStorage.setItem("userInfo", JSON.stringify(userInfo));
  }, [userInfo]);

  const updateUser = (newUserInfo) => {
    setUserInfo((prevUserInfo) => ({
      ...prevUserInfo,
      ...newUserInfo,
    }));
  };

  const logout = () => {
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
    });
    userInfo.active = false;
    localStorage.removeItem("userInfo");
    localStorage.removeItem("token");
    localStorage.removeItem("following");
    localStorage.removeItem("followers");
    localStorage.removeItem("posts");
    localStorage.removeItem("profileInfoPosts");
    localStorage.removeItem("profileInfoFavorites");
    localStorage.removeItem("profileFavorites");
    localStorage.removeItem("profilePosts");
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
