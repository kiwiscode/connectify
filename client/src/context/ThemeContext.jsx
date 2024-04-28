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

  const toggleThemeBetweenLightDarkMode = () => {
    if (themeName === "dark-theme") {
      console.log("Function is working first condition !");

      localStorage.setItem("themeName", "light-theme");
      setThemeName("light-theme");
    } else if (themeName === "light-theme") {
      console.log("Function is working second condition !");

      localStorage.setItem("themeName", "dark-theme");
      setThemeName("dark-theme");
    } else {
      console.log("Function is working third condition !");

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
