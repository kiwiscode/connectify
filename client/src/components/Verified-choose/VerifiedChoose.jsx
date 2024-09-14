import { useContext, useState } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import { Modal } from "react-bootstrap";
import useWindowDimensions from "../../hooks/getWindowDimensions";

function VerifiedChooseTest() {
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(true);
  const [{ theme, themeName }] = useContext(ThemeContext);
  const [tabIndex, setTabIndex] = useState(0);
  const { width } = useWindowDimensions();
  return (
    <>
      {showSubscriptionModal && (
        <>
          <Modal
            backdropClassName={
              themeName === "dark-theme" ? `back-drop-${themeName}` : ""
            }
            style={{
              backgroundColor:
                //   showVerifyPhoneNumberPasswordModal &&
                themeName !== "dark-theme"
                  ? "#999999"
                  : themeName === "dark-theme"
                  ? // &&
                    //   showVerifyPhoneNumberPasswordModal
                    "#232E36"
                  : "",
            }}
            contentClassName={
              themeName === "dark-theme" ? "dark-theme-sub-modal" : ""
            }
            className={
              tabIndex !== 0
                ? "subscription-modal-basic-width-smaller-700"
                : "signin-modal-parent-non-reactivate subscribe-modal-abcde"
            }
            show={showSubscriptionModal}
            centered
            dialogClassName={width <= 700 ? "modal-fullscreen" : ""}
          >
            {tabIndex === 0 && (
              <Modal.Header
                className={`signin-modal-header-child-non-reactivate signin-modal-header-child-non-reactivate-${themeName}`}
                style={{
                  border: "none",
                  zIndex: 999,
                }}
              >
                <div
                  className={`close-button close-button-${themeName}`}
                  style={{
                    borderRadius: "50%",
                    cursor: "pointer",
                  }}
                >
                  {" "}
                  <div
                    style={{
                      display: " flex",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    {/* close signin modal icon start to check  */}
                    <svg
                      style={{
                        border: "none",
                        margin: "5px",
                      }}
                      width={20}
                      height={20}
                      color={
                        themeName === "dark-theme" ? "white" : "rgb(15,20,25)"
                      }
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      className=" r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-z80fyv r-19wmn03"
                    >
                      <g>
                        <path d="M10.59 12L4.54 5.96l1.42-1.42L12 10.59l6.04-6.05 1.42 1.42L13.41 12l6.05 6.04-1.42 1.42L12 13.41l-6.04 6.05-1.42-1.42L10.59 12z"></path>
                      </g>
                    </svg>{" "}
                    {/* close signin modal icon finish to check  */}
                  </div>
                </div>
              </Modal.Header>
            )}
          </Modal>
        </>
      )}
    </>
  );
}

export default VerifiedChooseTest;
