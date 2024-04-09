import { createContext, useState, useEffect } from "react";

const themes = {
  dark: {
    backgroundColor: "black",
    color: "white",
  },
  light: {
    backgroundColor: "white",
    color: "black",
  },
  cyberpunk: {
    backgroundColor: "rgba(255,243,72,255)",
    color: "black",
  },
};

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [themeName, setThemeName] = useState("light-theme");

  const lightModeActive = () => {
    localStorage.setItem("themeName", "light-theme");
    setThemeName("light-theme");
  };
  const darkModeActive = () => {
    localStorage.setItem("themeName", "dark-theme");
    setThemeName("dark-theme");
  };
  const cyberpunkModeActive = () => {
    localStorage.setItem("themeName", "cyberpunk-theme");
    setThemeName("cyberpunk-theme");
  };

  const theme =
    themeName === "light-theme"
      ? themes.light
      : themeName === "dark-theme"
      ? themes.dark
      : themeName === "cyberpunk-theme"
      ? themes.cyberpunk
      : {};

  useEffect(() => {
    const storedTheme = localStorage.getItem("themeName");
    console.log("Running !", storedTheme);
    if (storedTheme) {
      setThemeName(storedTheme);
    }
  }, []);

  return (
    <ThemeContext.Provider
      value={[
        { theme, themeName },
        lightModeActive,
        darkModeActive,
        cyberpunkModeActive,
      ]}
    >
      {children}
    </ThemeContext.Provider>
  );
};
