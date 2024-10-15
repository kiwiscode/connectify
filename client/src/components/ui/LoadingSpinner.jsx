import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";

const LoadingSpinner = ({
  strokeColor,
  isCheckoutProcess,
  isSuspense,
  fontSize,
}) => {
  const [{ themeName }] = useContext(ThemeContext);
  return (
    <>
      <div
        style={{
          fontSize: fontSize ? "15px" : null,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            padding: isCheckoutProcess ? "" : "16px 0px",
            height: isSuspense ? "100dvh" : "",
            width: isSuspense ? "100%" : "",
            alignItems: isSuspense ? "center" : "",
          }}
        >
          <div className="spinner bottomSpinner">
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 28 28"
                focusable="false"
              >
                <circle
                  cx="14"
                  cy="14"
                  r="12"
                  fill="none"
                  stroke={themeName === "dark-theme" ? "#3187CD" : "#000"}
                  strokeWidth="4"
                  opacity=".15"
                />
                <circle
                  pathLength="1"
                  cx="14"
                  cy="14"
                  r="12"
                  fill="none"
                  stroke={strokeColor}
                  strokeWidth="4"
                  strokeDasharray="27 57"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoadingSpinner;
