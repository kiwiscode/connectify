import axios from "axios";
import { useContext, useEffect, useState } from "react";

import { Button, Modal, Stack, Popover, OverlayTrigger } from "react-bootstrap";

import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { UserContext } from "../../context/UserContext";
// when working on local version
const API_URL = "http://localhost:3000";

// when working on deployment version
// ?

// IMPORTANT => refreshPosts as a props !
function PostModal({
  refreshPosts,
  setLoadingTrue,
  setLoadingFalse,
  visible,
  parentCallBack,
}) {
  const [show, setShow] = useState(false);
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const { getToken, userInfo } = useContext(UserContext);
  const [chosenEmoji, setChosenEmoji] = useState(null);
  const [showEmojisBar, setshowEmojisBar] = useState("hide");
  const [showSecondModal, setShowSecondModal] = useState(false);
  const maxCharacters = 140;

  const [modalImage, setModalImage] = useState("");
  //handle and convert it in base 64
  const handleImage = (e) => {
    const file = e.target.files[0];
    setFileToBase(file);
  };

  const setFileToBase = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = () => {
      setModalImage(reader.result);
    };
  };

  const handleChange = (event) => {
    const inputText = event.target.value;
    if (inputText.length <= maxCharacters) {
      setContent(inputText);
    } else {
      setError("Tweet length to 140 characters");
    }
  };

  const handleClose = () => {
    setShow(false);
    setShowSecondModal(false);
  };
  const handleShow = () => setShow(true);

  const handlePost = () => {
    if (content || chosenEmoji || modalImage) {
      handleClose();
      axios
        .post(
          `${API_URL}/home/post`,
          {
            content,
            modalImage,
          },
          {
            headers: {
              Authorization: `Bearer ${getToken()}`,
            },
          }
        )

        .then((response) => {
          if (setLoadingTrue) {
            setLoadingTrue();
          }

          setModalImage("");
          setTimeout(() => {
            parentCallBack(response.data.createdPost);
            if (setLoadingTrue) {
              setLoadingFalse();
            }
            if (refreshPosts) {
              refreshPosts();
            }
          }, 1500);
          setContent("");
        })
        .catch((err) => {
          return err;
        });
    } else {
      handleShow();
    }
  };

  const closeImage = () => {
    setModalImage("");
  };

  const handleMouseOver = (e) => {
    const shallowCopy = e.target.classList[0];

    if (shallowCopy === "target") {
      e.target.style.background = "#595b5b";
    }
  };

  const handleMouseOut = (e) => {
    const shallowCopy = e.target.classList[0];

    if (shallowCopy === "target") {
      e.target.style.background = "#47494a";
    }
  };

  const onEmojiClick = (emojiObject) => {
    const sym = emojiObject.unified.split("_");
    const codeArray = [];

    sym.forEach((el) => codeArray.push("0x" + el));
    let emoji = String.fromCodePoint(...codeArray);

    setChosenEmoji(emoji);
    setContent((prevText) => prevText + emoji);
  };

  useEffect(() => {
    const closeEmojiContainer = (e) => {
      if (
        e.target.classList.contains("post-modal-emoji-picker") ||
        e.srcElement.parentElement.className ===
          "svg-border-parent show-emoji" ||
        e.srcElement.parentNode.className === "p-2" ||
        e.target.classList.value === ""
      ) {
        setshowEmojisBar(false);
      } else {
        setshowEmojisBar(true);
      }
    };

    document.body.addEventListener("click", closeEmojiContainer);

    return () => {
      document.body.removeEventListener("click", closeEmojiContainer);
    };
  }, []);

  const popoverBottom = (
    <Popover
      className={`${showEmojisBar ? "hideEmojiContainer" : ""}`}
      id="popover-positioned-bottom"
      title="Popover bottom"
    >
      <Picker
        style={{ padding: "12px" }}
        data={data}
        onEmojiSelect={onEmojiClick}
        maxFrequentRows={0}
        emojiSize={20}
        emojiButtonSize={28}
      />
    </Popover>
  );

  return (
    <>
      <Button
        variant="primary"
        onClick={handleShow}
        className={`responsive-post-button ${visible ? "visible" : "hidden"}`}
        size="sm"
      >
        <svg
          width={24}
          height={24}
          viewBox="0 0 24 24"
          aria-hidden="true"
          className=" compose-tweet-svg r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-1472mwg r-lrsllp"
          fill="currentColor"
          style={{ color: "rgb(255, 255, 255)" }}
        >
          <g>
            <path d="M23 3c-6.62-.1-10.38 2.421-13.05 6.03C7.29 12.61 6 17.331 6 22h2c0-1.007.07-2.012.19-3H12c4.1 0 7.48-3.082 7.94-7.054C22.79 10.147 23.17 6.359 23 3zm-7 8h-1.5v2H16c.63-.016 1.2-.08 1.72-.188C16.95 15.24 14.68 17 12 17H8.55c.57-2.512 1.57-4.851 3-6.78 2.16-2.912 5.29-4.911 9.45-5.187C20.95 8.079 19.9 11 16 11zM4 9V6H1V4h3V1h2v3h3v2H6v3H4z"></path>
          </g>
        </svg>
      </Button>

      <Button
        variant="primary"
        onClick={handleShow}
        className="compose-tweet compose-tweet-2"
        size="sm"
      >
        <span
          style={{
            fontSize: "17px",
            margin: "0",
            padding: "0",
            fontWeight: "700",
            lineHeight: "20px",
            top: "0",
            border: "none",
          }}
          className="compose-tweet-text compose-tweet-2"
        >
          Post
        </span>
        <svg
          width={24}
          height={24}
          viewBox="0 0 24 24"
          aria-hidden="true"
          className=" compose-tweet-svg r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-1472mwg r-lrsllp"
          fill="currentColor"
          style={{ color: "rgb(255, 255, 255)" }}
        >
          <g>
            <path d="M23 3c-6.62-.1-10.38 2.421-13.05 6.03C7.29 12.61 6 17.331 6 22h2c0-1.007.07-2.012.19-3H12c4.1 0 7.48-3.082 7.94-7.054C22.79 10.147 23.17 6.359 23 3zm-7 8h-1.5v2H16c.63-.016 1.2-.08 1.72-.188C16.95 15.24 14.68 17 12 17H8.55c.57-2.512 1.57-4.851 3-6.78 2.16-2.912 5.29-4.911 9.45-5.187C20.95 8.079 19.9 11 16 11zM4 9V6H1V4h3V1h2v3h3v2H6v3H4z"></path>
          </g>
        </svg>
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header
          style={{
            border: "none",
          }}
        >
          <div
            onClick={handleClose}
            className="close-button"
            style={{ borderRadius: "50%", cursor: "pointer" }}
          >
            <div>
              <svg
                style={{
                  border: "none",
                  fontSize: "15px",
                  margin: "5px",
                }}
                onClick={handleClose}
                width={20}
                height={20}
                color="rgb(15,20,25)"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-z80fyv r-19wmn03"
              >
                <g>
                  <path d="M10.59 12L4.54 5.96l1.42-1.42L12 10.59l6.04-6.05 1.42 1.42L13.41 12l6.05 6.04-1.42 1.42L12 13.41l-6.04 6.05-1.42-1.42L10.59 12z"></path>
                </g>
              </svg>{" "}
            </div>
          </div>
        </Modal.Header>
        <Modal.Body>
          <Stack direction="horizontal" gap={1}>
            <div className="p-0">
              {" "}
              {userInfo?.imageUrl.slice(0, 3) !== "../" ? (
                <img
                  src={userInfo.imageUrl}
                  width={40}
                  height={40}
                  alt=""
                  style={{ position: "relative", bottom: "30px" }}
                />
              ) : (
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="40"
                    height="40"
                    fill="rgb(83, 100, 113)"
                    className="bi bi-person-circle"
                    viewBox="0 0 16 16"
                    style={{ position: "relative", bottom: "30px" }}
                  >
                    <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                    <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1" />
                  </svg>
                </div>
              )}
            </div>

            <div className="p-0 ">
              <textarea
                onChange={handleChange}
                rows="4"
                cols="50"
                value={content}
                maxLength={maxCharacters}
                className="input-post"
                placeholder="What is happening?!"
                style={{
                  resize: "none",
                  padding: "8px",
                  color: "rgba(15,20,25,1.00)",
                  lineHeight: "24px",
                  fontWeight: "400",
                  fontSize: `${content ? "15px" : "20px"}`,
                  width: "100%",
                  height: "100px",
                }}
              />
            </div>
          </Stack>
          <div className="d-flex align-items-center">
            <div className="p-2">
              {/* start to check */}

              {/* finish to check */}
            </div>
            <div className="p-2">
              {modalImage && (
                <div style={{ position: "relative" }}>
                  <div
                    className="target"
                    style={{
                      position: "absolute",
                      top: "10px",
                      right: "10px",
                      width: "30px",
                      height: "30px",
                      borderRadius: "50%",
                      background: "rgba(71,73,74,255)",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      cursor: "pointer",
                    }}
                    onMouseOver={(e) => handleMouseOver(e)}
                    onMouseOut={(e) => handleMouseOut(e)}
                    onClick={closeImage}
                  >
                    <div
                      style={{
                        cursor: "pointer",
                        color: "white",
                        fontSize: "22px",
                      }}
                    >
                      &times;
                    </div>
                  </div>
                  <img
                    className="img-fluid"
                    style={{
                      width: "100%",
                      display: "block",
                      overflow: "hidden",
                      border: "2px solid #ddd", // Kenarlık rengi ve kalınlığı
                      borderRadius: "8px", // Kenarlık köşelerinin yuvarlatılması
                      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)", // Gölge efekti
                    }}
                    src={modalImage ? modalImage : ""}
                    alt=""
                  />
                </div>
              )}
            </div>
          </div>
        </Modal.Body>

        <Modal.Footer className="post-modal-footer ml-1">
          <Stack direction="horizontal" gap={0}>
            {/* INFO */}
            <div
              className="p-2 image-choose-p-2"
              onClick={() => document.getElementById("formuploadModal").click()}
            >
              <div
                style={{
                  // border: "1px solid black",
                  cursor: "pointer",
                  borderRadius: "50%",
                }}
                className="svg-border-parent svg-border-parent-image-choose"
              >
                <svg
                  style={{
                    cursor: "pointer",
                  }}
                  width={20}
                  height={20}
                  color="rgb(29,155,240)"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="bi bi-image-fill post-modal-image-fill r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-z80fyv r-19wmn03"
                >
                  <g>
                    <path d="M3 5.5C3 4.119 4.119 3 5.5 3h13C19.881 3 21 4.119 21 5.5v13c0 1.381-1.119 2.5-2.5 2.5h-13C4.119 21 3 19.881 3 18.5v-13zM5.5 5c-.276 0-.5.224-.5.5v9.086l3-3 3 3 5-5 3 3V5.5c0-.276-.224-.5-.5-.5h-13zM19 15.414l-3-3-5 5-3-3-3 3V18.5c0 .276.224.5.5.5h13c.276 0 .5-.224.5-.5v-3.086zM9.75 7C8.784 7 8 7.784 8 8.75s.784 1.75 1.75 1.75 1.75-.784 1.75-1.75S10.716 7 9.75 7z"></path>
                  </g>
                </svg>
              </div>

              <input
                onChange={handleImage}
                type="file"
                id="formuploadModal"
                name="modalImage"
                className="form-control"
                style={{ display: "none" }}
              />
            </div>
            {/* INFO */}
            <div className="p-2">
              {/* emoji mart start to check */}

              <OverlayTrigger
                trigger="click"
                placement="bottom"
                overlay={popoverBottom}
              >
                <div
                  className="svg-border-parent"
                  style={{
                    cursor: "pointer",
                    borderRadius: "50%",
                  }}
                >
                  <svg
                    color="rgb(29,155,240)"
                    fill="currentColor"
                    width={20}
                    height={20}
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="post-modal-emoji-picker r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-z80fyv r-19wmn03"
                    style={{
                      cursor: "pointer",
                    }}
                  >
                    <g>
                      <path d="M8 9.5C8 8.119 8.672 7 9.5 7S11 8.119 11 9.5 10.328 12 9.5 12 8 10.881 8 9.5zm6.5 2.5c.828 0 1.5-1.119 1.5-2.5S15.328 7 14.5 7 13 8.119 13 9.5s.672 2.5 1.5 2.5zM12 16c-2.224 0-3.021-2.227-3.051-2.316l-1.897.633c.05.15 1.271 3.684 4.949 3.684s4.898-3.533 4.949-3.684l-1.896-.638c-.033.095-.83 2.322-3.053 2.322zm10.25-4.001c0 5.652-4.598 10.25-10.25 10.25S1.75 17.652 1.75 12 6.348 1.75 12 1.75 22.25 6.348 22.25 12zm-2 0c0-4.549-3.701-8.25-8.25-8.25S3.75 7.451 3.75 12s3.701 8.25 8.25 8.25 8.25-3.701 8.25-8.25z"></path>
                    </g>
                  </svg>
                </div>
              </OverlayTrigger>

              {/* emoji mart finish to check */}
            </div>
            <div className="p-2 ms-auto">
              {/* <div className="p-2 "> */}{" "}
              {content !== "" || modalImage ? (
                <Button
                  style={{
                    border: "none",
                  }}
                  variant="primary"
                  onClick={() => handlePost()}
                  className={`post-btn compose-tweet-textArea`}
                >
                  Post
                </Button>
              ) : (
                <Button
                  variant="primary"
                  onClick={() => handlePost()}
                  className={`emptyContent post-btn compose-tweet-textArea`}
                >
                  Post
                </Button>
              )}
            </div>
          </Stack>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default PostModal;
