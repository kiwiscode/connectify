import { Button, Col } from "react-bootstrap";
import SettingsNavigation from "../../../../../../components/SettingsNavigation/SettingsNavigation";
import { useAntdMessageHandler } from "../../../../../../utils/useAntdMessageHandler";
import useWindowDimensions from "../../../../../../hooks/getWindowDimensions";
import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../../../../../../context/ThemeContext";
import { UserContext } from "../../../../../../context/UserContext";
import { useNavigate } from "react-router-dom";
import { InputLabel, TextField } from "@mui/material";
import axios from "axios";

// when working on local version
const API_URL = "http://localhost:3000";

// when working on deployment version
// ?

function Gender() {
  const { contextHolder, showCustomMessage } = useAntdMessageHandler();
  const { width } = useWindowDimensions();
  const [{ theme, themeName }] = useContext(ThemeContext);
  const { userInfo, getToken, updateUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [showGenderInput, setShowGenderInput] = useState(false);

  const [wasChosen, setWasChosen] = useState(null);

  const [addYourGenderFieldValue, setAddYourGenderFieldValue] = useState("");
  const [focusedInput, setFocusedInput] = useState(false);

  const handleChangeAddYourGenderInput = (e) => {
    if (e.target.value.length <= 30) {
      setAddYourGenderFieldValue(e.target.value);
    }
  };

  const handleAddGender = async () => {
    try {
      const response = await axios.post(
        `${API_URL}/add_gender_to_user`,
        {
          genderOption:
            wasChosen === "Add your gender"
              ? addYourGenderFieldValue
              : wasChosen,
        },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      if (response.status === 200) {
        updateUser({
          gender:
            wasChosen === "Add your gender"
              ? addYourGenderFieldValue
              : wasChosen,
        });
        if (wasChosen !== "Add your gender") {
          setAddYourGenderFieldValue(" ");
        }
        showCustomMessage("Gender updated", 6);
      }

      console.log("Response =>", response);
    } catch (error) {}
  };

  useEffect(() => {
    console.log("User info =>", userInfo);
    if (userInfo?.gender) {
      if (userInfo.gender !== "Male" && userInfo.gender !== "Female") {
        setAddYourGenderFieldValue(userInfo.gender);
        setWasChosen("Add your gender");
      } else {
        setWasChosen(userInfo.gender);
      }
    }
  }, []);

  return (
    <>
      {contextHolder}
      <SettingsNavigation />
      <Col
        xs={10}
        sm={10}
        md={11}
        lg={width <= 1201 && width >= 992 ? 7 : width > 1201 ? 4 : ""}
        xxl={width <= 1201 && width >= 992 ? 7 : width > 1201 ? 4 : ""}
        className={`right-side-column-settings-account-page`}
        style={{
          borderLeft:
            width < 1000
              ? themeName !== "dark-theme"
                ? "1px solid rgba(0, 0, 0, 0.1)"
                : "1px solid rgb(70, 70, 70)"
              : null,
          borderRight:
            themeName !== "dark-theme"
              ? "1px solid rgba(0, 0, 0, 0.1)"
              : "1px solid rgb(70, 70, 70)",
          borderTop: "none ",
          borderBottom: "none",
          padding: "0px",
          margin: "0px",
          width: width > 1400 ? "600px" : width <= 500 ? "100%" : null,
          position: "relative",
          right: "10px",
        }}
      >
        {" "}
        <div className="settings-header-with-arrow ">
          <div
            onClick={() => {
              navigate(-1);
            }}
            className={`arrow arrow-${themeName} mt-2`}
            style={{
              position: "relative",
              width: "36px",
              height: " 36px",
              borderRadius: "50%",
              cursor: "pointer",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginRight: "5px",
            }}
          >
            {" "}
            <svg
              color={themeName === "dark-theme" ? "white" : ""}
              fill="currentColor"
              style={{
                position: "absolute",
                border: "none",
              }}
              width={20}
              height={20}
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-z80fyv r-19wmn03"
            >
              <g>
                <path d="M7.414 13l5.043 5.04-1.414 1.42L3.586 12l7.457-7.46 1.414 1.42L7.414 11H21v2H7.414z"></path>
              </g>
            </svg>
          </div>
          <div
            className={
              themeName === "dark-theme"
                ? "mt-2 first-head chirp-bold-font soft-grey-dark-theme-text-variant-1"
                : "mt-2 first-head chirp-bold-font very-dark-gray-light-theme-text-variant-1"
            }
          >
            Gender
          </div>
        </div>{" "}
        <div
          className={
            themeName === "dark-theme"
              ? "soft-grey-dark-theme-text-variant-2 mt-4 chirp-regular-font"
              : "very-dark-gray-light-theme-text-variant-2 mt-4 chirp-regular-font"
          }
          style={{
            paddingLeft: "16px",
            fontSize: "15px",
            lineHeight: "20px",
          }}
        >
          If you haven’t already specified a gender, this is the one associated
          with your account based on your profile and activity. This information
          won’t be displayed publicly.{" "}
        </div>
        <div
          className="mt-3"
          style={{
            borderTop:
              themeName !== "dark-theme"
                ? "1px solid rgba(0, 0, 0, 0.1)"
                : // : "0.1px solid rgb(70, 70, 70)",
                  "1px solid rgb(70, 70, 70)",
          }}
        ></div>
        <div
          className="mt-3"
          style={{
            paddingLeft: "16px",
            paddingRight: "16px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div
              onClick={() => {
                setAddYourGenderFieldValue("");
                setWasChosen("Female");
              }}
              className={
                themeName === "dark-theme"
                  ? "soft-grey-dark-theme-text-variant-1  chirp-regular-font"
                  : "very-dark-gray-light-theme-text-variant-1  chirp-regular-font"
              }
            >
              Female
            </div>
            <div>
              {" "}
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  cursor: "pointer",
                }}
                className={
                  themeName === "dark-theme" && wasChosen === "Female"
                    ? "hover-background-effect-clicked-dark-theme"
                    : themeName !== "dark-theme" && wasChosen === "Female"
                    ? "hover-background-effect-clicked-light-theme"
                    : themeName === "dark-theme" && wasChosen !== "Female"
                    ? "hover-background-effect-dark-theme"
                    : themeName !== "dark-theme" && wasChosen !== "Female"
                    ? "hover-background-effect-light-theme"
                    : ""
                }
                onClick={() => {
                  setWasChosen("Female");
                }}
              >
                <div
                  style={{
                    backgroundColor:
                      wasChosen === "Female" ? "#1d9bf0" : "transparent",
                    border:
                      wasChosen === "Female"
                        ? "none"
                        : themeName !== "dark-theme"
                        ? "2px solid #71767A"
                        : "2px solid rgb(70, 70, 70)",
                    width: "20px",
                    height: "20px",
                    position: "relative",
                    left: "10px",
                    top: "10px",
                    borderRadius: "50%",
                  }}
                >
                  <svg
                    style={{
                      position: "relative",
                      left: "2px",
                      bottom: "4px",
                      display: wasChosen === "Female" ? "initial" : "none",
                    }}
                    width={16}
                    height={16}
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-jwli3a r-1hjwoze r-12ym1je"
                    color="white"
                    fill="currentColor"
                  >
                    <g>
                      <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                    </g>
                  </svg>
                </div>
              </div>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div
              onClick={() => {
                setAddYourGenderFieldValue("");
                setWasChosen("Male");
              }}
              className={
                themeName === "dark-theme"
                  ? "soft-grey-dark-theme-text-variant-1  chirp-regular-font"
                  : "very-dark-gray-light-theme-text-variant-1  chirp-regular-font"
              }
            >
              Male
            </div>
            <div>
              {" "}
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  cursor: "pointer",
                }}
                className={
                  themeName === "dark-theme" && wasChosen === "Male"
                    ? "hover-background-effect-clicked-dark-theme"
                    : themeName !== "dark-theme" && wasChosen === "Male"
                    ? "hover-background-effect-clicked-light-theme"
                    : themeName === "dark-theme" && wasChosen !== "Male"
                    ? "hover-background-effect-dark-theme"
                    : themeName !== "dark-theme" && wasChosen !== "Male"
                    ? "hover-background-effect-light-theme"
                    : ""
                }
                onClick={() => {
                  setWasChosen("Male");
                }}
              >
                <div
                  style={{
                    backgroundColor:
                      wasChosen === "Male" ? "#1d9bf0" : "transparent",
                    border:
                      wasChosen === "Male"
                        ? "none"
                        : themeName !== "dark-theme"
                        ? "2px solid #71767A"
                        : "2px solid rgb(70, 70, 70)",
                    width: "20px",
                    height: "20px",
                    position: "relative",
                    left: "10px",
                    top: "10px",
                    borderRadius: "50%",
                  }}
                >
                  <svg
                    style={{
                      position: "relative",
                      left: "2px",
                      bottom: "4px",
                      display: wasChosen === "Male" ? "initial" : "none",
                    }}
                    width={16}
                    height={16}
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-jwli3a r-1hjwoze r-12ym1je"
                    color="white"
                    fill="currentColor"
                  >
                    <g>
                      <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                    </g>
                  </svg>
                </div>
              </div>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div
              onClick={() => {
                setWasChosen("Add your gender");
              }}
              className={
                themeName === "dark-theme"
                  ? "soft-grey-dark-theme-text-variant-1  chirp-regular-font"
                  : "very-dark-gray-light-theme-text-variant-1  chirp-regular-font"
              }
            >
              Add your gender
            </div>
            <div>
              {" "}
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  cursor: "pointer",
                }}
                className={
                  themeName === "dark-theme" && wasChosen === "Add your gender"
                    ? "hover-background-effect-clicked-dark-theme"
                    : themeName !== "dark-theme" &&
                      wasChosen === "Add your gender"
                    ? "hover-background-effect-clicked-light-theme"
                    : themeName === "dark-theme" &&
                      wasChosen !== "Add your gender"
                    ? "hover-background-effect-dark-theme"
                    : themeName !== "dark-theme" &&
                      wasChosen !== "Add your gender"
                    ? "hover-background-effect-light-theme"
                    : ""
                }
                onClick={() => {
                  setWasChosen("Add your gender");
                }}
              >
                <div
                  style={{
                    backgroundColor:
                      wasChosen === "Add your gender"
                        ? "#1d9bf0"
                        : "transparent",
                    border:
                      wasChosen === "Add your gender"
                        ? "none"
                        : themeName !== "dark-theme"
                        ? "2px solid #71767A"
                        : "2px solid rgb(70, 70, 70)",
                    width: "20px",
                    height: "20px",
                    position: "relative",
                    left: "10px",
                    top: "10px",
                    borderRadius: "50%",
                  }}
                >
                  <svg
                    style={{
                      position: "relative",
                      left: "2px",
                      bottom: "4px",
                      display:
                        wasChosen === "Add your gender" ? "initial" : "none",
                    }}
                    width={16}
                    height={16}
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-jwli3a r-1hjwoze r-12ym1je"
                    color="white"
                    fill="currentColor"
                  >
                    <g>
                      <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                    </g>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className="mt-4"
          style={{
            display: wasChosen === "Add your gender" ? "" : "none",
            paddingLeft: "16px",
            paddingRight: "16px",
          }}
        >
          {wasChosen === "Add your gender" && focusedInput ? (
            <InputLabel
              style={{
                width: "100%",
                textAlign: "right",
              }}
            >
              <div
                className="chirp-regular-font"
                style={{
                  color:
                    themeName === "dark-theme"
                      ? "#71767A"
                      : "rgb(83, 100, 113)",
                  fontSize: "13px",
                  fontWeight: "400",
                  lineHeight: "16px",
                }}
              >
                {addYourGenderFieldValue?.length} / {30}
              </div>
            </InputLabel>
          ) : null}
          <TextField
            autoFocus={true}
            value={addYourGenderFieldValue}
            onFocus={() => setFocusedInput(true)}
            onBlur={() => setFocusedInput(false)}
            onChange={(e) => {
              handleChangeAddYourGenderInput(e);
            }}
            type="text"
            id="outlined-basic"
            variant={"outlined"}
            label={`Gender`}
            style={{
              width: "100%",
              height: "58px",
            }}
            InputLabelProps={{
              style: {
                color: themeName === "dark-theme" ? "#71767B" : "",
              },
            }}
            InputProps={{
              style: {
                color: themeName === "dark-theme" ? "white" : "",
              },
            }}
            sx={{
              "& .Mui-focused input + fieldset": {
                border: "2px solid #1d9bf0 !important",
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor:
                  themeName === "dark-theme"
                    ? "rgb(70, 70, 70) !important"
                    : "#cfd9de !important",
              },
              "& .MuiInputLabel-shrink": {
                color: "#1f9cf0 !important",
              },
            }}
          />
        </div>
        <div
          className="mt-2"
          style={{
            textAlign: "right",
            borderTop:
              themeName !== "dark-theme"
                ? "1px solid rgba(0, 0, 0, 0.1)"
                : // : "0.1px solid rgb(70, 70, 70)",
                  "1px solid rgb(70, 70, 70)",

            width: "100%",
          }}
        >
          <Button
            style={{
              height: "45px",
              marginTop: "15px",
              position: "relative",
              right: "20px",
              border: "none",
              maxWidth: "69.17px",
              maxHeight: "36px",
              minHeight: "36px",
              fontSize: "15px",
              cursor:
                (wasChosen &&
                  wasChosen !== "Add your gender" &&
                  wasChosen !== userInfo?.gender) ||
                (wasChosen &&
                  wasChosen === "Add your gender" &&
                  addYourGenderFieldValue !== userInfo.gender)
                  ? "pointer"
                  : "default",
              backgroundColor:
                (wasChosen &&
                  wasChosen !== "Add your gender" &&
                  wasChosen !== userInfo?.gender) ||
                (wasChosen &&
                  wasChosen === "Add your gender" &&
                  addYourGenderFieldValue !== userInfo.gender)
                  ? ""
                  : "#99CDF8",
            }}
            onClick={
              (wasChosen &&
                wasChosen !== "Add your gender" &&
                wasChosen !== userInfo?.gender) ||
              (wasChosen &&
                wasChosen === "Add your gender" &&
                addYourGenderFieldValue !== userInfo.gender)
                ? () => handleAddGender()
                : null
            }
            className={
              (wasChosen &&
                wasChosen !== "Add your gender" &&
                wasChosen !== userInfo?.gender) ||
              (wasChosen &&
                wasChosen === "Add your gender" &&
                addYourGenderFieldValue !== userInfo.gender)
                ? "change-password-btn chirp-bold-font blue-btn"
                : "disabled-change-password-btn chirp-bold-font blue-btn"
            }
          >
            Save
          </Button>
        </div>
      </Col>
    </>
  );
}

export default Gender;
