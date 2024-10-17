import { useContext, useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { UserContext } from "../../context/UserContext";
import { Link, useNavigate } from "react-router-dom";
import { Stack } from "react-bootstrap";
import { ThemeContext } from "../../context/ThemeContext";
import useWindowDimensions from "../../hooks/getWindowDimensions";

const API_URL = import.meta.env.VITE_APP_API_URL;

import axios from "axios";
import { useFontSizeHandler } from "../../utils/useFontSizeHandler";

function CreateChat({ messagesPageWriteAmESSAGEoPTION }) {
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);

  const [searchString, setSearchString] = useState("");
  const [searchString2, setSearchString2] = useState("");
  const { userInfo, getToken } = useContext(UserContext);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);

  useEffect(() => {
    axios
      .get(`${API_URL}/all-users`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
      .then((response) => {
        const spliceActiveUser = response.data.filter((eachUser) => {
          return eachUser.username !== userInfo.username;
        });
        setActiveUsers(spliceActiveUser);
      })
      .catch((error) => {
        console.error("Error =>", error);
      });
  }, []);

  const handleShow = () => {
    setShow(true);
  };

  const handleClose = () => {
    setFilteredUsers([]);
    setSearchString("");
    setShow(false);
  };

  const handleShow2 = () => setShow2(true);

  const handleClose2 = () => {
    setFilteredUsers([]);
    setSearchString2("");
    setShow2(false);
  };

  const [{ themeName }] = useContext(ThemeContext);

  const filterUsers = (users, term) => {
    const filtered = users.filter((user) =>
      user.username.toLowerCase().startsWith(term.toLowerCase())
    );

    if (searchString !== "" || searchString2 !== "") {
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers([]);
    }
  };
  const handleSearchTermChange = (e) => {
    const term = e.target.value;
    setSearchString(term);
    if (searchString !== "" && term !== "") {
      filterUsers(activeUsers, term);
    } else {
      setFilteredUsers([]);
    }
  };
  const handleSearchTermChange2 = (e) => {
    const term = e.target.value;
    setSearchString2(term);
    if (searchString2 !== "" && term !== "") {
      filterUsers(activeUsers, term);
    } else {
      setFilteredUsers([]);
    }
  };

  const { width } = useWindowDimensions();
  const navigate = useNavigate();
  const {
    getFontSizeAndLineHeight31,
    getFontSizeAndLineHeight20,
    getFontSizeAndLineHeight15,
    getFontSizeAndLineHeight14,
  } = useFontSizeHandler();
  const font31 = getFontSizeAndLineHeight31();
  const font20 = getFontSizeAndLineHeight20();
  const font15 = getFontSizeAndLineHeight15();
  const font14 = getFontSizeAndLineHeight14();

  const createChatRoom = async (roomId) => {
    try {
      await axios.post(
        `${API_URL}/chatrooms/create`,
        { roomId },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      navigate(`/messages/${roomId}`);
    } catch (error) {
      navigate(`/messages/${roomId}`);
      console.error("error:", error);
    }
  };

  return (
    <>
      {messagesPageWriteAmESSAGEoPTION ? (
        <div style={{ textAlign: "left", padding: "16px" }}>
          <div
            className="chirp-heavy-font"
            style={{
              fontSize: font31.fontSize,
              lineHeight: font31.lineHeight,
              margin: "10px",
            }}
          >
            Welcome to your inbox!
          </div>
          <div
            className="chirp-regular-font"
            style={{
              color:
                themeName === "dark-theme" ? "#71767A" : "rgb(83, 100, 113)",
              fontSize: font15.fontSize,
              lineHeight: font15.lineHeight,
              margin: "10px",
            }}
          >
            Drop a line, share posts and more with private conversations between
            you and others on Connectify.
          </div>
          <button
            className="write-a-message-message-page-btn chirp-bold-font"
            style={{
              color: "white",
              backgroundColor: "rgb(29,155,240)",
              margin: "10px",
              borderStyle: "none",
              borderRadius: "9999px",
              minWidth: "52px",
              outlineStyle: "none",
              cursor: "pointer",
              minHeight: "52px",
              paddingLeft: "32px",
              paddingRight: "32px",
              fontSize: font15.fontSize,
            }}
            onClick={handleShow2}
          >
            Write a message
          </button>
        </div>
      ) : (
        <div
          onClick={handleShow}
          className={`p-2 chat-create-icon chat-create-icon-${themeName}`}
          style={{
            cursor: "pointer",
            borderRadius: "50%",
            position: "relative",
            width: "40px",
            height: "40px",
            right: "10px",
          }}
        >
          <svg
            fill={themeName === "dark-theme" ? "#71767a" : "#536371"}
            width={20}
            height={20}
            viewBox="0 0 24 24"
            aria-hidden="true"
            className={`messages-create-chat r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-z80fyv r-19wmn03`}
            style={{
              cursor: "pointer",
            }}
          >
            <g>
              <path d="M1.998 5.5c0-1.381 1.119-2.5 2.5-2.5h15c1.381 0 2.5 1.119 2.5 2.5V12h-2v-1.537l-8 3.635-8-3.635V18.5c0 .276.224.5.5.5H13v2H4.498c-1.381 0-2.5-1.119-2.5-2.5v-13zm2 2.766l8 3.635 8-3.635V5.5c0-.276-.224-.5-.5-.5h-15c-.276 0-.5.224-.5.5v2.766zM19 18v-3h2v3h3v2h-3v3h-2v-3h-3v-2h3z"></path>
            </g>
          </svg>
        </div>
      )}

      {messagesPageWriteAmESSAGEoPTION && (
        <Modal
          style={{
            margin: "0px",
            padding: "0px",
          }}
          backdropClassName={
            themeName === "dark-theme" ? `back-drop-${themeName}` : ""
          }
          dialogClassName={width <= 700 ? `modal-fullscreen ` : ``}
          contentClassName={
            themeName === "dark-theme"
              ? "dark-theme-new-message-modal"
              : "new-message-modal"
          }
          className={`widthsmallerthan700-new-message-modal widthsmallerthan700-new-message-modal-${themeName}`}
          centered
          show={show2}
          onHide={handleClose2}
        >
          <Modal.Header
            closeButton={false}
            style={{
              border: "none",
            }}
          >
            <div
              className={`close-button close-button-${themeName}`}
              style={{
                borderRadius: "50%",
                cursor: "pointer",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div>
                <svg
                  style={{
                    border: "none",

                    margin: "5px",
                  }}
                  onClick={handleClose2}
                  width={20}
                  height={20}
                  color={themeName === "dark-theme" ? "white" : "rgb(15,20,25)"}
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
            <div
              className="chirp-bold-font"
              style={{
                color: themeName === "dark-theme" ? "white" : "black",
                fontSize: font20.fontSize,
                lineHeight: font20.lineHeight,
                position: "absolute",
                left: "80px",
              }}
            >
              New message
            </div>
          </Modal.Header>
          <div className="joinChatContainer">
            <div
              style={{
                position: "relative",
              }}
            >
              <input
                autoFocus
                type="text"
                placeholder="Search people"
                value={searchString2}
                onChange={handleSearchTermChange2}
                style={{
                  paddingLeft: "62px",
                  fontSize: font14.fontSize,
                  width: "100%",
                  outline: "none",
                  border: "none",
                  borderRadius: "0px",
                  borderBottom:
                    themeName !== "dark-theme"
                      ? "1px solid rgba(0, 0, 0, 0.1)"
                      : // : "0.1px solid rgb(70, 70, 70)",
                        "1px solid rgb(70, 70, 70)",

                  color:
                    themeName === "dark-theme"
                      ? "white"
                      : "rgba(15,20,25,1.00)",
                  backgroundColor:
                    themeName === "dark-theme" ? "black" : "transparent",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: "15px",
                  left: "22px",
                }}
              >
                <div>
                  <svg
                    color={themeName === "dark-theme" ? "#565A5E" : "#536471"}
                    fill="currentColor"
                    width={`${1.25}em`}
                    height={`${1.25}em`}
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-1bwzh9t r-4wgw6l r-f727ji"
                  >
                    <g>
                      <path d="M10.25 3.75c-3.59 0-6.5 2.91-6.5 6.5s2.91 6.5 6.5 6.5c1.795 0 3.419-.726 4.596-1.904 1.178-1.177 1.904-2.801 1.904-4.596 0-3.59-2.91-6.5-6.5-6.5zm-8.5 6.5c0-4.694 3.806-8.5 8.5-8.5s8.5 3.806 8.5 8.5c0 1.986-.682 3.815-1.824 5.262l4.781 4.781-1.414 1.414-4.781-4.781c-1.447 1.142-3.276 1.824-5.262 1.824-4.694 0-8.5-3.806-8.5-8.5z"></path>
                    </g>
                  </svg>
                </div>
              </div>
            </div>
            {filteredUsers.map((user) => (
              <Link
                onClick={() => createChatRoom(`${user._id}-${userInfo._id}`)}
                key={user._id}
                className={`selected-user-for-dm selected-user-for-dm-${themeName}`}
                style={{
                  cursor: "pointer",
                  textDecoration: "none",
                }}
              >
                <Stack
                  style={{
                    margin: "5px",
                    padding: "5px",
                  }}
                  direction="horizontal"
                >
                  <div className="p-0">
                    {" "}
                    {user.imageUrl.slice(0, 3) !== "../" ? (
                      <img
                        style={{
                          borderRadius: "50%",
                        }}
                        width={40}
                        height={40}
                        src={user.imageUrl}
                        alt=""
                      />
                    ) : (
                      <div>
                        <img
                          style={{ borderRadius: "50%" }}
                          width="40"
                          height="40"
                          src="https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png"
                          alt=""
                        />
                      </div>
                    )}
                  </div>
                  <div
                    style={{
                      marginLeft: "10px",
                    }}
                    className="p-0"
                  >
                    {" "}
                    <div
                      className="chirp-bold-font"
                      style={{
                        color:
                          themeName === "dark-theme"
                            ? "white"
                            : "rgb(15, 20, 25)",
                        fontSize: font15.fontSize,
                        lineHeight: font15.lineHeight,
                        textAlign: "left",
                      }}
                    >
                      {user.fullname}
                    </div>
                    <div
                      className="chirp-regular-font"
                      style={{
                        marginRight:
                          user.imageUrl.slice(0, 3) !== "../" ? "" : "32px",
                        color:
                          themeName === "dark-theme"
                            ? "#71767A"
                            : "rgb(83, 100, 113)",
                        fontSize: font15.fontSize,
                        lineHeight: font15.lineHeight,
                      }}
                    >
                      @{user.username}
                    </div>
                  </div>
                </Stack>
              </Link>
            ))}
          </div>
        </Modal>
      )}

      <Modal
        style={{
          margin: "0px",
          padding: "0px",
        }}
        backdropClassName={
          themeName === "dark-theme" ? `back-drop-${themeName}` : ""
        }
        dialogClassName={width <= 700 ? `modal-fullscreen ` : ``}
        contentClassName={
          themeName === "dark-theme"
            ? "dark-theme-new-message-modal"
            : "new-message-modal"
        }
        className={`widthsmallerthan700-new-message-modal widthsmallerthan700-new-message-modal-${themeName}`}
        centered
        show={show}
        onHide={handleClose}
      >
        <Modal.Header
          closeButton={false}
          style={{
            border: "none",
          }}
        >
          <div
            className={`close-button close-button-${themeName}`}
            style={{
              borderRadius: "50%",
              cursor: "pointer",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div>
              <svg
                style={{
                  border: "none",

                  margin: "5px",
                }}
                onClick={handleClose}
                width={20}
                height={20}
                color={themeName === "dark-theme" ? "white" : "rgb(15,20,25)"}
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
          <div
            className="chirp-bold-font"
            style={{
              color: themeName === "dark-theme" ? "white" : "black",
              position: "absolute",
              left: "80px",
              fontSize: font20.fontSize,
              lineHeight: font20.lineHeight,
            }}
          >
            New message
          </div>
        </Modal.Header>
        <div className="joinChatContainer">
          <div
            style={{
              position: "relative",
            }}
          >
            <input
              autoFocus
              type="text"
              placeholder="Search people"
              value={searchString}
              onChange={handleSearchTermChange}
              style={{
                paddingLeft: "62px",
                fontSize: font14.fontSize,
                width: "100%",
                outline: "none",
                border: "none",
                borderRadius: "0px",
                borderBottom:
                  themeName !== "dark-theme"
                    ? "1px solid rgba(0, 0, 0, 0.1)"
                    : // : "0.1px solid rgb(70, 70, 70)",
                      "1px solid rgb(70, 70, 70)",

                color:
                  themeName === "dark-theme" ? "white" : "rgba(15,20,25,1.00)",
                backgroundColor:
                  themeName === "dark-theme" ? "black" : "transparent",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: "15px",
                left: "22px",
              }}
            >
              <div>
                <svg
                  color={themeName === "dark-theme" ? "#565A5E" : "#536471"}
                  fill="currentColor"
                  width={`${1.25}em`}
                  height={`${1.25}em`}
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-1bwzh9t r-4wgw6l r-f727ji"
                >
                  <g>
                    <path d="M10.25 3.75c-3.59 0-6.5 2.91-6.5 6.5s2.91 6.5 6.5 6.5c1.795 0 3.419-.726 4.596-1.904 1.178-1.177 1.904-2.801 1.904-4.596 0-3.59-2.91-6.5-6.5-6.5zm-8.5 6.5c0-4.694 3.806-8.5 8.5-8.5s8.5 3.806 8.5 8.5c0 1.986-.682 3.815-1.824 5.262l4.781 4.781-1.414 1.414-4.781-4.781c-1.447 1.142-3.276 1.824-5.262 1.824-4.694 0-8.5-3.806-8.5-8.5z"></path>
                  </g>
                </svg>
              </div>
            </div>
          </div>
          {filteredUsers.map((user) => (
            <Link
              onClick={() => createChatRoom(`${user._id}-${userInfo._id}`)}
              key={user._id}
              className={`selected-user-for-dm selected-user-for-dm-${themeName}`}
              style={{
                cursor: "pointer",
                textDecoration: "none",
              }}
            >
              <Stack
                style={{
                  margin: "5px",
                  padding: "5px",
                }}
                direction="horizontal"
              >
                <div className="p-0">
                  {" "}
                  {user.imageUrl.slice(0, 3) !== "../" ? (
                    <img
                      style={{
                        borderRadius: "50%",
                      }}
                      width={40}
                      height={40}
                      src={user.imageUrl}
                      alt=""
                    />
                  ) : (
                    <div className="p-0">
                      <img
                        style={{ borderRadius: "50%" }}
                        width="40"
                        height="40"
                        src="https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png"
                        alt=""
                      />
                    </div>
                  )}
                </div>
                <div
                  style={{
                    marginLeft: "10px",
                  }}
                  className="p-0"
                >
                  {" "}
                  <div
                    className="chirp-bold-font"
                    style={{
                      color:
                        themeName === "dark-theme"
                          ? "white"
                          : "rgb(15, 20, 25)",
                      fontSize: font15.fontSize,
                      lineHeight: font15.lineHeight,
                      textAlign: "left",
                    }}
                  >
                    {user.fullname}
                  </div>
                  <div
                    className="chirp-regular-font"
                    style={{
                      marginRight:
                        user.imageUrl.slice(0, 3) !== "../" ? "" : "32px",
                      color:
                        themeName === "dark-theme"
                          ? "#71767A"
                          : "rgb(83, 100, 113)",

                      fontSize: font15.fontSize,
                      lineHeight: font15.lineHeight,
                    }}
                  >
                    @{user.username}
                  </div>
                </div>
              </Stack>
            </Link>
          ))}
        </div>
        <Modal.Body>
          {/* start to check  search create message search bar*/}

          {/* finish to check  */}
        </Modal.Body>
      </Modal>
    </>
  );
}

export default CreateChat;
