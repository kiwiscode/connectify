import { useContext } from "react";
import { Button, Modal } from "react-bootstrap";
import { ThemeContext } from "../../context/ThemeContext";

function UnfollowModal({
  handleUnfollow,
  selectedUser,
  showUnfollowModal,
  handleClose,
}) {
  const [
    { theme, themeName },
    lightModeActive,
    darkModeActive,
    cyberpunkModeActive,
  ] = useContext(ThemeContext);

  return (
    <Modal
      centered={true}
      backdropClassName={
        themeName === "dark-theme" ? `back-drop-${themeName}` : ""
      }
      contentClassName={
        themeName === "dark-theme"
          ? `unfollow-modal-${themeName}`
          : "unfollow-modal"
      }
      className=""
      show={showUnfollowModal}
      onHide={handleClose}
      style={{
        margin: "0px",
        padding: "0px",
      }}
    >
      <Modal.Body className="" style={{}}>
        <div style={{}} className="">
          <div
            style={{
              fontWeight: "700",
              fontSize: "20px",
              lineHeight: "24px",
              textAlign: "left",
              color: themeName === "dark-theme" ? "white" : "",
            }}
          >
            <span>Unfollow</span>{" "}
            <span
              style={{
                fontWeight: "700",
                fontSize: "20px",
                lineHeight: "24px",
                textAlign: "left",
                color: themeName === "dark-theme" ? "white" : "",
              }}
            >
              @{selectedUser.username}?
            </span>
          </div>

          <div
            style={{
              color:
                themeName === "dark-theme" ? "#71767A" : "rgb(83, 100, 113)",
              fontWeight: "400",
              fontSize: "15px",
              lineHeight: "20px",
              textAlign: "left",
              marginTop: "10px",
            }}
          >
            Their posts will no longer show up in your Following timeline. You
            can still view their profile, unless their posts are protected.
          </div>

          <Button
            style={{
              minHeight: "42px",
              width: "100%",
              fontSize: "15px",
              fontWeight: "700",
              lineHeight: "20px",
            }}
            className={`mt-3 login-button next-btn ${themeName}-white-btn`}
            variant="dark"
            onClick={() => handleUnfollow(selectedUser)}
          >
            Next
          </Button>

          <Button
            style={{
              minHeight: "42px",
              width: "100%",
              color: themeName === "dark-theme" ? "white" : "black",
              fontSize: "15px",
              fontWeight: "700",
              lineHeight: "20px",
            }}
            className={`mt-2 forgot-password-btn ${themeName}-black-btn`}
            variant="light"
            onClick={handleClose}
          >
            Cancel{" "}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default UnfollowModal;
