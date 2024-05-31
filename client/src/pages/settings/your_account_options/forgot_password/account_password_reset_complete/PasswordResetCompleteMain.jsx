import { Stack } from "react-bootstrap";
import useWindowDimensions from "../../../../../hooks/getWindowDimensions";
import { useNavigate } from "react-router-dom";

function PasswordResetCompleteMain() {
  const { width } = useWindowDimensions();
  const navigate = useNavigate();
  return (
    <>
      <div
        style={{
          boxShadow: "0 0 3px #aaa",
          minHeight: "40px",
          maxHeight: "40px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Stack
          style={{
            width: width < 500 ? "100%" : "45%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            minWidth: "fit-content",
          }}
          direction="horizontal"
          gap={3}
        >
          <div>
            {" "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={50}
              height={30}
              viewBox="0 0 100 100"
            >
              {/* İçi dolu bir kare */}
              <rect
                x="5"
                y="5"
                width="90"
                height="90"
                fill="#1C9BEF"
                rx="5"
                ry="5"
              />

              <text
                x="27.5"
                y="70"
                fontFamily="Arial"
                fontSize="60"
                fill="#FFF"
                stroke="#FFF"
                strokeWidth="2"
              >
                C
              </text>
            </svg>
          </div>
          <div
            style={{
              fontSize: "16px",
              color: "#66757f",
              lineHeight: "40px",
            }}
          >
            {" "}
            Password Reset
          </div>
          <div
            style={{
              color: "#66757f",
              fontSize: "14px",
            }}
            className="ms-auto"
          >
            English
          </div>
        </Stack>
      </div>
      <div
        className="mt-5"
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: "45%",
            display: "flex",
            flexDirection: "column",
            minWidth: width < 500 ? "100%" : "fit-content",
          }}
        >
          <span
            style={{
              fontSize: "28px",
              fontWeight: "700",
              lineHeight: "24px",
              padding: "16px 0px",
            }}
          >
            {"You’re all set. You've successfully changed your password."}{" "}
          </span>{" "}
          <div
            className="mt-5"
            style={{
              cursor: "pointer",
              color: "#55acee",
              width: "100%",
              fontWeight: "400",
              fontSize: "15px",
              lineHeight: "20px",
              fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
            }}
          >
            <span>Review your applications</span>
          </div>{" "}
          <div
            className="mt-1"
            style={{
              fontWeight: "400",
              fontSize: "15px",
              lineHeight: "20px",
              width: "100%",

              fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
            }}
          >
            {
              "Take a moment to review the applications that have access to your account. Revoke those you don't recognize or no longer use."
            }
          </div>{" "}
          <div
            className="mt-1"
            style={{
              cursor: "pointer",
              color: "#55acee",
              width: "100%",
              fontWeight: "400",
              fontSize: "15px",
              lineHeight: "20px",
              fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
            }}
          >
            <span>Add a phone number to your account</span>
          </div>{" "}
          <div
            className="mt-1"
            style={{
              fontWeight: "400",
              fontSize: "15px",
              lineHeight: "20px",

              fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
            }}
          >
            {
              "This makes it easy to get back into your account if you're ever locked out."
            }
          </div>{" "}
          <div
            onClick={() => {
              navigate("/home");
            }}
            className="mt-5"
            style={{
              cursor: "pointer",
              color: "#55acee",

              fontWeight: "400",
              fontSize: "15px",
              lineHeight: "20px",
              fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
            }}
          >
            <span>Continue to Connectify</span>
          </div>
        </div>
      </div>
    </>
  );
}

export default PasswordResetCompleteMain;
