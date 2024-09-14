import { createContext, useState, useEffect } from "react";

export const FontSizeContext = createContext();

export const FontSizeProvider = ({ children }) => {
  const [fontSize, setFontSize] = useState(
    localStorage.getItem("fontSize") || "Default"
  );

  useEffect(() => {
    if (fontSize) {
      localStorage.setItem("fontSize", fontSize);
    }
  }, [fontSize]);

  return (
    <FontSizeContext.Provider value={{ fontSize, setFontSize }}>
      {children}
    </FontSizeContext.Provider>
  );
};
