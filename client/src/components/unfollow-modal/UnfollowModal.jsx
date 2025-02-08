import { useContext } from "react";
import { Button, Modal } from "react-bootstrap";
import { ThemeContext } from "../../context/ThemeContext";
import { useFontSizeHandler } from "../../utils/useFontSizeHandler";

function UnfollowModal({
  handleUnfollow,
  selectedUser,
  showUnfollowModal,
  handleClose,
}) {
  const [{ themeName }] = useContext(ThemeContext);

  const { getFontSizeAndLineHeight20, getFontSizeAndLineHeight15 } =
    useFontSizeHandler();
  const font20 = getFontSizeAndLineHeight20();
  const font15 = getFontSizeAndLineHeight15();
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
      className="unfollow-modal-general-class"
      show={showUnfollowModal}
      onHide={handleClose}
      style={
        {
          // margin: "0px",
          // padding: "0px",
        }
      }
    >
      <Modal.Body className="" style={{}}>
        <div style={{}} className="">
          <div
            className="chirp-bold-font"
            style={{
              fontSize: font20.fontSize,
              lineHeight: font20.lineHeight,
              textAlign: "left",
              color: themeName === "dark-theme" ? "white" : "",
            }}
          >
            <span>Unfollow</span>{" "}
            <span
              style={{
                textAlign: "left",
                color: themeName === "dark-theme" ? "white" : "",
              }}
            >
              {selectedUser.username}?
            </span>
          </div>

          <div
            className="chirp-regular-font"
            style={{
              color:
                themeName === "dark-theme" ? "#71767A" : "rgb(83, 100, 113)",
              fontSize: font15.fontSize,
              lineHeight: font15.lineHeight,
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
              fontSize: font15.fontSize,
              lineHeight: font15.lineHeight,
            }}
            className={`mt-3 login-button next-btn ${themeName}-white-btn chirp-bold-font`}
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
              fontSize: font15.fontSize,
              lineHeight: font15.lineHeight,
              marginBottom: `20px`,
            }}
            className={`mt-2 forgot-password-btn ${themeName}-black-btn chirp-bold-font`}
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
