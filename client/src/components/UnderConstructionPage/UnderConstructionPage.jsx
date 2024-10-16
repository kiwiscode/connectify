import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../../context/ThemeContext";
import "./UnderConstructionPage.css";

function UnderConstructionPage() {
  const navigate = useNavigate();
  const [{ themeName }] = useContext(ThemeContext);

  return (
    <div className="chirp-regular-font">
      <div className={`wrapper-parent--parent-- ${themeName}`}></div>
      <div className="wrapper-parent--">
        <div
          onClick={() => navigate(-1)}
          className={themeName === "dark-theme" ? "arrow-dark-theme" : "arrow"}
          style={{
            width: "50px",
            height: "50px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "absolute",
            top: "20px",
            left: "20px",
            borderRadius: "50%",
            backgroundColor: "transparent",
            cursor: "pointer",
            zIndex: 0,
          }}
        >
          <svg
            fill="currentColor"
            color={themeName === "dark-theme" ? "white" : "black"}
            width="20"
            height="20"
            viewBox="0 0 24 24"
          >
            <g>
              <path d="M7.414 13l5.043 5.04-1.414 1.42L3.586 12l7.457-7.46 1.414 1.42L7.414 11H21v2H7.414z"></path>
            </g>
          </svg>
        </div>{" "}
        <div
          style={{
            zIndex: 0,
            textAlign: "center",
            marginTop: "100px",
            color: themeName === "dark-theme" ? "white" : "black",
          }}
        >
          <h1 className="chirp-medium-font">
            This page is under construction.
          </h1>
          <p className="chirp-regular-font">Please check back later.</p>
        </div>
      </div>
    </div>
  );
}

export default UnderConstructionPage;
