import { createContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

export const UrlContext = createContext();

export const UrlProvider = ({ children }) => {
  const [url, setUrl] = useState("");
  const [urlHistory, setUrlHistory] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const currentUrl = window.location.href;
    setUrl(currentUrl);
    setUrlHistory((prevUrlHistory) => [...prevUrlHistory, currentUrl]);
  }, [location.pathname]);

  return (
    <UrlContext.Provider value={{ url, urlHistory }}>
      {children}
    </UrlContext.Provider>
  );
};
