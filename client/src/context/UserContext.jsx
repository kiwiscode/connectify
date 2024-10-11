import { useState, useEffect, createContext } from "react";
import PropTypes from "prop-types";

const API_URL = import.meta.env.VITE_APP_API_URL;

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
        imageuRL: "",
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
      imageuRL: "",
    });
    userInfo.active = false;
    localStorage.removeItem("userInfo");
    localStorage.removeItem("token");
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
