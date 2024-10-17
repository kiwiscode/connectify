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
};

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [themeName, setThemeName] = useState("light-theme");

  useEffect(() => {
    const storedTheme = localStorage.getItem("themeName");
    if (storedTheme) {
      setThemeName(storedTheme);
    }
  }, []);

  useEffect(() => {
    if (themeName === "dark-theme") {
      document.documentElement.style.setProperty("color-scheme", "dark");
    } else {
      document.documentElement.style.setProperty("color-scheme", "light");
    }
  }, [themeName]);

  const toggleThemeBetweenLightDarkMode = () => {
    if (themeName === "dark-theme") {
      localStorage.setItem("themeName", "light-theme");
      setThemeName("light-theme");
    } else if (themeName === "light-theme") {
      localStorage.setItem("themeName", "dark-theme");
      setThemeName("dark-theme");
    } else {
      localStorage.setItem("themeName", "light-theme");
      setThemeName("light-theme");
    }
  };

  const theme =
    themeName === "light-theme"
      ? themes.light
      : themeName === "dark-theme"
      ? themes.dark
      : {};

  useEffect(() => {
    const storedTheme = localStorage.getItem("themeName");
    if (storedTheme) {
      setThemeName(storedTheme);
    } else {
      localStorage.setItem("themeName", themeName);
    }
  }, []);

  return (
    <ThemeContext.Provider
      value={[{ theme, themeName }, toggleThemeBetweenLightDarkMode]}
    >
      {children}
    </ThemeContext.Provider>
  );
};
