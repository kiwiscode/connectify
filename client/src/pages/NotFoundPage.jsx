import Lottie from "lottie-react";
import NotFoundAnimation from "../assets/not-found-page/not-found-page.json";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

function NotFoundPage() {
  const navigate = useNavigate();
  const [{ theme, themeName }] = useContext(ThemeContext);

  return (
    <>
      <div
        style={{
          margin: 0,
          padding: 0,
          maxHeight: "100dvh",
        }}
      >
        <div
          onClick={() => navigate(-1)}
          className={themeName === "dark-theme" ? "arrow-dark-theme" : "arrow"}
          style={{
            width: "50px",
            height: "50px",
            backgroundColor: "green",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "absolute",
            top: "20px",
            left: "20px",
            borderRadius: "50%",
            backgroundColor: "transparent",
            cursor: "pointer",
            zIndex: 1,
          }}
        >
          <svg
            fill="currentColor"
            color={themeName === "dark-theme" ? "white" : "#111111"}
            width="20"
            height="20"
            viewBox="0 0 24 24"
          >
            <g>
              <path d="M7.414 13l5.043 5.04-1.414 1.42L3.586 12l7.457-7.46 1.414 1.42L7.414 11H21v2H7.414z"></path>
            </g>
          </svg>
        </div>
        <Lottie
          style={{
            width: "100%",
            height: "100%",
          }}
          animationData={NotFoundAnimation}
        />{" "}
      </div>
    </>
  );
}

export default NotFoundPage;
