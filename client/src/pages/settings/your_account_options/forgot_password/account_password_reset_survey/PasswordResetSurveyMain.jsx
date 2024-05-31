import { Button, Stack } from "react-bootstrap";
import useWindowDimensions from "../../../../../hooks/getWindowDimensions";
import { useNavigate } from "react-router-dom";
import {
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
} from "@mui/material";
import { ThemeContext } from "../../../../../context/ThemeContext";
import { useContext } from "react";

function PasswordResetSurveyMain() {
  const { width } = useWindowDimensions();
  const navigate = useNavigate();
  const [{ theme, themeName }] = useContext(ThemeContext);

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
            Why did you change your password?
          </span>
          <div className="mt-3">
            <FormControl
              style={{
                position: "relative",
                left: "15px",
              }}
            >
              <RadioGroup
                sx={{
                  color: themeName === "dark-theme" ? "white" : "black",
                  "& .MuiSvgIcon-root": {
                    color: themeName === "dark-theme" ? "white" : "",
                  },
                }}
                aria-labelledby="demo-controlled-radio-buttons-group"
                name="controlled-radio-buttons-group"
              >
                <FormControlLabel
                  value="Forgot password"
                  control={<Radio />}
                  label="Forgot password"
                />
                <FormControlLabel
                  value="Account may have been accessed by someone else"
                  control={<Radio />}
                  label="Account may have been accessed by someone else"
                />{" "}
                <FormControlLabel
                  value="Another reason"
                  control={<Radio />}
                  label="Another reason"
                />
                <div
                  className="mt-3"
                  style={{
                    width: "100%",
                  }}
                >
                  <Button
                    onClick={() => {
                      navigate("/account/password_reset_complete");
                    }}
                    style={{
                      height: "45px",
                      border: "none",
                      maxWidth: "69.17px",
                      maxHeight: "36px",
                      minHeight: "36px",
                      fontSize: "15px",
                      fontFamily:
                        "Helvetica Neue, Helvetica, Arial, sans-serif",
                    }}
                    className={"change-password-btn"}
                  >
                    Next
                  </Button>
                </div>
              </RadioGroup>
            </FormControl>
          </div>{" "}
        </div>
      </div>
    </>
  );
}

export default PasswordResetSurveyMain;
