// import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { ModalVisibilityProvider } from "./context/ModalVisibilityContext.jsx";
import { NavigationHistoryProvider } from "./context/NavigationHistoryContext.jsx";
import { FontSizeProvider } from "./context/FontSizeContext.jsx";
import { ColorContextProvider } from "./context/ColorContext.jsx";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>
  <BrowserRouter>
    <NavigationHistoryProvider>
      <ThemeProvider>
        <FontSizeProvider>
          <ColorContextProvider>
            <ModalVisibilityProvider>
              <App />
            </ModalVisibilityProvider>
          </ColorContextProvider>
        </FontSizeProvider>
      </ThemeProvider>
    </NavigationHistoryProvider>
  </BrowserRouter>
  // </React.StrictMode>
);
