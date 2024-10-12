import { createContext, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { UserContext } from "./UserContext";

export const NavigationHistoryContext = createContext();

export const NavigationHistoryProvider = ({ children }) => {
  const [navigationHistoryArray, setNavigationHistoryArray] = useState([]);
  const { userInfo, getToken } = useContext(UserContext);
  const location = useLocation();
  const path = location.pathname;

  useEffect(() => {
    if (path && userInfo && userInfo._id && getToken()) {
      setNavigationHistoryArray([path, ...navigationHistoryArray]);
    } else {
      setNavigationHistoryArray([]);
    }
  }, [path]);

  return (
    <NavigationHistoryContext.Provider
      value={{ navigationHistoryArray, setNavigationHistoryArray }}
    >
      {children}
    </NavigationHistoryContext.Provider>
  );
};
