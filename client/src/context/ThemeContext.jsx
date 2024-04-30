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

  const [activeFontSizeOption, setactiveFontSizeOption] =
    useState("Default 16px");
  const [extraSmallFontSizeActive, setextraSmallFontSizeActive] =
    useState(null);
  const [smallFontSizeActive, setsmallFontSizeActive] = useState(null);
  const [defaultFontSizeActive, setdefaultFontSizeActive] = useState(null);
  const [largeFontSizeActive, setlargeFontSizeActive] = useState(null);
  const [extraLargeFontSizeActive, setextraLargeFontSizeActive] =
    useState(null);

  // const toggleFontSize = () => {
  //   if (activeFontSizeOption === "Default 16px") {
  //     setextraSmallFontSizeActive(true);
  //     setsmallFontSizeActive(true);
  //     setdefaultFontSizeActive(false);
  //     setlargeFontSizeActive(false);
  //     setextraLargeFontSizeActive(false);
  //   } else if (activeFontSizeOption === "Extra Small 12px") {
  //     setextraSmallFontSizeActive(false);
  //     setsmallFontSizeActive(false);
  //     setdefaultFontSizeActive(false);
  //     setlargeFontSizeActive(false);
  //     setextraLargeFontSizeActive(false);
  //   } else if (activeFontSizeOption === "Small 14px") {
  //     setextraSmallFontSizeActive(true);
  //     setsmallFontSizeActive(false);
  //     setdefaultFontSizeActive(false);
  //     setlargeFontSizeActive(false);
  //     setextraLargeFontSizeActive(false);
  //   } else if (activeFontSizeOption === "Large 18px") {
  //     setextraSmallFontSizeActive(true);
  //     setsmallFontSizeActive(true);
  //     setdefaultFontSizeActive(true);
  //     setlargeFontSizeActive(false);
  //     setextraLargeFontSizeActive(false);
  //   } else if (activeFontSizeOption === "Extra Large 20px") {
  //     setextraSmallFontSizeActive(true);
  //     setsmallFontSizeActive(true);
  //     setdefaultFontSizeActive(true);
  //     setlargeFontSizeActive(true);
  //     setextraLargeFontSizeActive(false);
  //   }
  // };

  useEffect(() => {
    const storedFontSize = localStorage.getItem("fontSizeOption");
    if (storedFontSize) {
      setactiveFontSizeOption(storedFontSize);
    }
  }, []);

  const toggleChangeFontSize = (option) => {
    console.log("Button clicked, and option : ", option);

    if (option === "Default 16px") {
      localStorage.setItem("fontSizeOption", "Default 16px");
      setactiveFontSizeOption("Default 16px");
    } else if (option === "Extra Small 12px") {
      localStorage.setItem("fontSizeOption", "Extra Small 12px");
      setactiveFontSizeOption("Extra Small 12px");
    } else if (option === "Small 14px") {
      localStorage.setItem("fontSizeOption", "Small 14px");
      setactiveFontSizeOption("Small 14px");
    } else if (option === "Large 18px") {
      localStorage.setItem("fontSizeOption", "Large 18px");
      setactiveFontSizeOption("Large 18px");
    } else if (option === "Extra Large 20px") {
      localStorage.setItem("fontSizeOption", "Extra Large 20px");
      setactiveFontSizeOption("Extra Large 20px");
    }
  };

  useEffect(() => {
    const storedTheme = localStorage.getItem("themeName");
    if (storedTheme) {
      setThemeName(storedTheme);
    }
  }, []);

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
      value={[
        { theme, themeName, activeFontSizeOption },
        toggleThemeBetweenLightDarkMode,
        toggleChangeFontSize,
      ]}
    >
      {children}
    </ThemeContext.Provider>
  );
};
