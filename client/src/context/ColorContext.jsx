import { createContext, useState, useEffect } from "react";

export const ColorContext = createContext();

export const ColorContextProvider = ({ children }) => {
  const [colorType, setColorType] = useState(
    localStorage.getItem("colorType") || "skyBlue"
  );

  useEffect(() => {
    if (colorType) {
      localStorage.setItem("colorType", colorType);
    }
  }, [colorType]);

  return (
    <ColorContext.Provider value={{ colorType, setColorType }}>
      {children}
    </ColorContext.Provider>
  );
};
