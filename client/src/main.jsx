// import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { UrlProvider } from "./context/UrlContext.jsx";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  // <React.StrictMode>

  <BrowserRouter>
    <ThemeProvider>
      <UrlProvider>
        <App />
      </UrlProvider>
    </ThemeProvider>
  </BrowserRouter>

  // </React.StrictMode>
);
