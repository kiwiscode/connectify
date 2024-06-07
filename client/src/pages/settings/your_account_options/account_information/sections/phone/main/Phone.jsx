import { Button, Col, Modal } from "react-bootstrap";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAntdMessageHandler } from "../../../../../../../utils/useAntdMessageHandler";
import useWindowDimensions from "../../../../../../../hooks/getWindowDimensions";
import { ThemeContext } from "../../../../../../../context/ThemeContext";
import SettingsNavigation from "../../../../../../../components/SettingsNavigation/SettingsNavigation";
import { NavigationHistoryContext } from "../../../../../../../context/NavigationHistoryContext";
import axios from "axios";
import { UserContext } from "../../../../../../../context/UserContext";
import LoadingSpinner from "../../../../../../../components/ui/LoadingSpinner";

// when working on local version
const API_URL = "http://localhost:3000";

// when working on deployment version
// ?

function Phone() {
  const { contextHolder } = useAntdMessageHandler();
  const { width } = useWindowDimensions();
  const [{ theme, themeName }] = useContext(ThemeContext);
  const navigate = useNavigate();
  const { userInfo, getToken } = useContext(UserContext);
  const { navigationHistoryArray } = useContext(NavigationHistoryContext);
  const [user, setUser] = useState([]);
  console.log("Navigation history =>", navigationHistoryArray);
  const refreshActiveUser = () => {
    axios
      .get(`${API_URL}/profile`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
      .then((response) => {
        setUser(response.data.user);
      })
      .catch((error) => {
        console.log("Error =>", error);
      });
  };

  useEffect(() => {
    refreshActiveUser();
  }, []);

  const [showDeletePhoneNumberModal, setShowDeletePhoneNumberModal] =
    useState(false);

  const handleCloseRemoveContactsModal = () => {
    setShowDeletePhoneNumberModal(false);
  };

  const [firstLoading, setFirstLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setFirstLoading(false);
    }, 200);
  });

  const handleDeletePhoneNumber = async () => {
    try {
      const response = await axios.post(
        `${API_URL}/delete_phone_number`,
        {},
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      if (response) {
        refreshActiveUser();
      }
    } catch (error) {
      console.error("Error occured =>", error);
    }
  };

  return (
    <>
      {" "}
      {contextHolder}
      <SettingsNavigation />
      <>
        <Modal
          style={{
            padding: "0px",
            margin: "0px",
          }}
          centered
          show={showDeletePhoneNumberModal}
          onHide={handleCloseRemoveContactsModal}
          backdropClassName={
            themeName === "dark-theme" ? `back-drop-${themeName}` : ""
          }
          className="delete-post"
          contentClassName={
            themeName === "dark-theme"
              ? "delete-post-modal-dark-theme"
              : "delete-post-modal"
          }
        >
          <Modal.Body>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                paddingBottom: "16px",
                paddingTop: "16px",
                maxWidth: "256px",
              }}
            >
              <div
                className="chirp-bold-font"
                style={{
                  color: themeName === "dark-theme" ? "white" : "",

                  fontSize: "20px",
                  lineHeight: "24px",
                }}
              >
                Delete phone number?
              </div>
              <div
                style={{
                  color:
                    themeName === "dark-theme"
                      ? "#71767A"
                      : "rgb(83, 100, 113)",

                  fontSize: "15px",
                  lineHeight: "20px",
                }}
                className="mt-2 chirp-regular-font"
              >
                This will remove this number from your account, and you will no
                longer be able to receive notifications or login codes to it.
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                padding: "12px",
              }}
            >
              <Button
                onClick={() => {
                  setShowDeletePhoneNumberModal(false);
                  handleDeletePhoneNumber();
                }}
                className={`red-btn ${themeName}-red-btn chirp-bold-font`}
                style={{
                  maxWidth: "256px",
                  minHeight: "44px",
                  color: "white",
                  backgroundColor: "rgb(244, 33, 46)",
                  border: "none",
                }}
              >
                Delete
              </Button>
              <Button
                onClick={() => setShowDeletePhoneNumberModal(false)}
                variant="light"
                style={{
                  color: themeName === "dark-theme" ? "white" : "black",
                  maxWidth: "256px",
                  minHeight: "44px",
                }}
                className={`mt-2 forgot-password-btn ${themeName}-black-btn chirp-bold-font`}
              >
                Cancel
              </Button>
            </div>
          </Modal.Body>
        </Modal>
      </>
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
        <div className="settings-header-with-arrow ">
          <div
            onClick={() => {
              if (navigationHistoryArray[1] !== "/i/flow/add_phone") {
                navigate(-1);
              } else {
                navigate("/settings/account");
              }
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
            Change phone
          </div>
        </div>{" "}
        {firstLoading ? (
          <div
            style={{
              fontSize: "15px",
              width: "100%",
            }}
          >
            <LoadingSpinner strokeColor={"rgb(29, 155, 240)"}></LoadingSpinner>
          </div>
        ) : (
          <>
            {user.phoneNumber?.length ? (
              <>
                <div
                  style={{
                    padding: "0px 24px",
                    position: "relative",
                  }}
                >
                  {" "}
                  <div
                    style={{
                      position: "absolute",
                      top: "10%",
                      left: "6%",
                      fontSize: "12px",
                      lineHeight: "18px",
                      fontWeight: "400",
                      minWidth: "fit-content",
                      color:
                        themeName === "dark-theme"
                          ? "#383B3D"
                          : "rgb(168,177,184)",
                      // zIndex: 9999,
                    }}
                  >
                    Current
                  </div>
                  <div
                    className={"mt-3"}
                    type="text"
                    style={{
                      height: "56px",
                      width: "100%",
                      borderRadius: "4px",
                      backgroundColor:
                        themeName === "dark-theme"
                          ? "#111214"
                          : "rgb(248,249,250)",
                    }}
                  />
                  <input
                    type="text"
                    defaultValue={user?.phoneNumber[0]?.withPlusSign}
                    style={{
                      height: "50px",
                      position: "absolute",
                      top: "5%",
                      left: "6%",
                      width: "87%",
                      minWidth: "fit-content",
                      border: "none",
                      outline: "none",
                      paddingTop: "15px",
                      textAlign: "left",
                      paddingLeft: "0px",
                      paddingRight: "0px",
                      paddingBottom: "0px",
                      backgroundColor: "transparent",
                      color:
                        themeName === "dark-theme"
                          ? "#383B3D"
                          : "rgb(168,177,184)",
                    }}
                  />
                </div>
                <div
                  className="mt-4"
                  style={{
                    borderBottom:
                      themeName !== "dark-theme"
                        ? "1px solid rgba(0, 0, 0, 0.1)"
                        : // : "0.1px solid rgb(70, 70, 70)",
                          "1px solid rgb(70, 70, 70)",

                    width: "100%",
                  }}
                ></div>
                <div
                  onClick={() => {
                    navigate("/i/flow/add_phone");
                  }}
                  className={
                    themeName === "dark-theme"
                      ? "dark-theme-stylish-blue-background-color mt-1"
                      : "light-theme-stylish-blue-background-color mt-1"
                  }
                  style={{
                    padding: "16px",
                    textAlign: "center",
                    color: "rgb(29, 155, 240)",
                    lineHeight: "20px",
                    fontSize: "15px",
                    fontWeight: "400",
                    cursor: "pointer",
                  }}
                >
                  Update phone number
                </div>
                <div
                  onClick={() => {
                    setShowDeletePhoneNumberModal(true);
                  }}
                  className={
                    themeName === "dark-theme"
                      ? "deactivate-btn-dark-theme mt-1"
                      : "deactivate-btn-light-theme mt-1"
                  }
                  style={{
                    padding: "16px",
                    textAlign: "center",
                    color: "#F4212D",
                    lineHeight: "20px",
                    fontSize: "15px",
                    fontWeight: "400",
                    cursor: "pointer",
                  }}
                >
                  Delete phone number
                </div>
              </>
            ) : (
              <div
                onClick={() => {
                  navigate("/i/flow/add_phone");
                }}
                className={
                  themeName === "dark-theme"
                    ? "dark-theme-stylish-blue-background-color mt-1"
                    : "light-theme-stylish-blue-background-color mt-1"
                }
                style={{
                  padding: "16px",
                  textAlign: "center",
                  color: "rgb(29, 155, 240)",
                  lineHeight: "20px",
                  fontSize: "15px",
                  fontWeight: "400",
                  cursor: "pointer",
                }}
              >
                Add phone number
              </div>
            )}
          </>
        )}
      </Col>
    </>
  );
}

export default Phone;
