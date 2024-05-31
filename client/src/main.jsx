// import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { ModalVisibilityProvider } from "./context/ModalVisibilityContext.jsx";
import { NavigationHistoryProvider } from "./context/NavigationHistoryContext.jsx";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>
  <BrowserRouter>
    <NavigationHistoryProvider>
      <ThemeProvider>
        <ModalVisibilityProvider>
          <App />
        </ModalVisibilityProvider>
      </ThemeProvider>
    </NavigationHistoryProvider>
  </BrowserRouter>
  // </React.StrictMode>
);
