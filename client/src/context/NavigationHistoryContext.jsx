import { createContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export const NavigationHistoryContext = createContext();

export const NavigationHistoryProvider = ({ children }) => {
  const [navigationHistoryArray, setNavigationHistoryArray] = useState([]);

  const location = useLocation();
  const path = location.pathname;

  useEffect(() => {
    if (path) {
      setNavigationHistoryArray([path, ...navigationHistoryArray]);
    }
  }, [path]);

  return (
    <NavigationHistoryContext.Provider value={{ navigationHistoryArray }}>
      {children}
    </NavigationHistoryContext.Provider>
  );
};
