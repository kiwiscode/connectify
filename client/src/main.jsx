// import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { ModalVisibilityProvider } from "./context/ModalVisibilityContext.jsx";
import { NavigationHistoryProvider } from "./context/NavigationHistoryContext.jsx";
import { FontSizeProvider } from "./context/FontSizeContext.jsx";
import { ColorContextProvider } from "./context/ColorContext.jsx";
import { UserProvider } from "./context/UserContext.jsx";
import { StateRefreshTriggersContextProvider } from "./context/State-refresh-triggers-Context.jsx";
import "./index.css";
import "react-toastify/dist/ReactToastify.css";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <UserProvider>
      <NavigationHistoryProvider>
        <ThemeProvider>
          <FontSizeProvider>
            <ColorContextProvider>
              <ModalVisibilityProvider>
                <StateRefreshTriggersContextProvider>
                  <App />
                </StateRefreshTriggersContextProvider>
              </ModalVisibilityProvider>
            </ColorContextProvider>
          </FontSizeProvider>
        </ThemeProvider>
      </NavigationHistoryProvider>
    </UserProvider>
  </BrowserRouter>
);
