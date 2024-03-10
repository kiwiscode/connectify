import { useContext, useEffect, useState } from "react";
import { Button, Col, Stack, Modal, Row } from "react-bootstrap";
import axios from "axios";
import { UserContext } from "../../context/UserContext";
import { Link, useNavigate } from "react-router-dom";
import { List, Typography, Divider } from "antd";
// when working on local version
const API_URL = "http://localhost:3000";

// when working on deployment version
// ?
function RightSideColumn({
  first3User,
  handleSetSearchTerm,
  searchTerm,
  setSearchTerm,
  filteredSearchResult,
}) {
  const { getToken } = useContext(UserContext);
  const [onFocus, setOnFocus] = useState(false);
  const [user, setUser] = useState([]);
  const [isHovered, setIsHovered] = useState("");
  const navigate = useNavigate();
  const [closeDeleteSearchTermBtn, setCloseDeleteSearchTermBtn] =
    useState(false);
  const onFocusActive = () => {
    setOnFocus(true);
  };

  const onFocusInActive = () => {
    setOnFocus(false);
  };

  console.log("Search term =>", searchTerm);

  useEffect(() => {
    const getClickedLocation = (e) => {
      console.log("E target class list =>", e.target.classList);
      console.log(
        "E target parent node class name =>",
        e.srcElement.parentNode.className
      );

      console.log("Base val =>", e.srcElement.parentNode.className.baseVal);
      if (
        e.target.classList.contains("right-side-bar-input") ||
        e.target.classList.contains("search-bar-right-side-column") ||
        e.srcElement.parentNode.className ===
          "search-bar-right-side-column-group" ||
        e.target.classList.contains(
          "right-side-input-close-text-search-input"
        ) ||
        e.srcElement.parentNode.className ===
          "search-input-delete-search-term-svg-group" ||
        e.target.classList.contains("search-input-delete-search-term-svg") ||
        e.srcElement.parentNode.className ===
          "div-second-parent-search-input-delete-search-term" ||
        e.srcElement.parentNode.className.baseVal ===
          "search-input-delete-search-term-svg-group"
      ) {
        onFocusActive();
        setCloseDeleteSearchTermBtn(false);
      } else {
        onFocusInActive();
        setCloseDeleteSearchTermBtn(true);
      }
    };

    document.body.addEventListener("click", getClickedLocation);

    return () => {
      document.body.removeEventListener("click", getClickedLocation);
    };
  }, []);

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

  const getFollowingIds = (obj) => {
    if (obj.following) {
      return obj.following.map((eachFollowing) => {
        return eachFollowing._id;
      });
    }
  };

  const [showUnfollowModal, setshowUnfollowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState("");

  const handleFollow = (selectedUser) => {
    axios
      .post(
        `${API_URL}/follow`,
        {
          activeUserId: user._id,
          theFollowedUserID: selectedUser._id,
        },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      )
      .then((response) => {
        console.log("Response after follow =>", response);

        refreshActiveUser();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleUnfollow = (selectedUser) => {
    axios
      .post(
        `${API_URL}/unfollow`,
        {
          activeUserId: user._id,
          theUnfollowedUserID: selectedUser._id,
        },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      )
      .then((response) => {
        console.log("Response after unfollow =>", response);
        setshowUnfollowModal(false);
        refreshActiveUser();
      })
      .catch((error) => {
        console.log("Error =>", error);
      });
  };

  const handleClose = () => {
    setshowUnfollowModal(false);
  };

  const openUnfollowModal = (selectedUser) => {
    console.log("Selected user =>", selectedUser);
    console.log("Open unfollow modal !");
    setSelectedUser(selectedUser);
    setshowUnfollowModal(true);
  };
  console.log("filtered search result =>", filteredSearchResult);

  const [isHoveredListItem, setIsHoveredListItem] = useState("");
  return (
    <>
      <Modal
        className="right-side-bar-unfollow-modal"
        show={showUnfollowModal}
        onHide={handleClose}
      >
        <Modal.Body
          className="right-side-bar-unfollow-modal-body"
          style={{
            textAlign: "center",
          }}
        >
          <div className="right-side-bar-unfollow-modal-div">
            <div
              style={{
                fontWeight: "700",
                fontSize: "20px",
                lineHeight: "24px",
                textAlign: "left",
              }}
            >
              Unfollow
            </div>
            <div
              style={{
                fontWeight: "700",
                fontSize: "20px",
                lineHeight: "24px",
                textAlign: "left",
              }}
            >
              @{selectedUser.username}?
            </div>
            <div
              style={{
                color: "rgb(83, 100, 113)",
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
          </div>
        </Modal.Body>
        <Modal.Footer
          className="right-side-bar-unfollow-modal-footer"
          style={{
            border: "none",
          }}
        >
          <Button
            style={{
              maxWidth: "256px",
              minHeight: "44px ",
            }}
            variant="dark"
            onClick={() => handleUnfollow(selectedUser)}
          >
            Unfollow
          </Button>
          <Button
            className="hover-unfollow-cancel"
            style={{ color: "black", maxWidth: "256px", minHeight: "44px" }}
            variant="light"
            onClick={handleClose}
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
      <Col
        className="side-bar-column d-none d-lg-block d-xxl-block"
        xs={12} // 0px - 576px aralığı
        sm={12} // 576px - 768px aralığı
        md={6} // 768px - 992px aralığı
        lg={4} // 992px - 1400px aralığı
        xxl={4} // 1400px ve sonrası aralığı
        style={{
          position: "relative",
          left: "1.5%",
        }}
      >
        <Stack
          style={{
            height: "100%",
            position: "fixed",
          }}
          gap={3}
        >
          {/* input start to check  */}
          <div
            style={{
              position: "relative",
              right: "40px",
              bottom: "20px",
              marginLeft: "15px",
            }}
            className="p-4"
          >
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg
                color={onFocus ? "#1e9bf0" : "rgba(83, 100, 113, 1.00)"}
                style={{
                  display: "inline-block",
                  position: "relative",
                  left: "30px",
                }}
                fill="currentColor"
                width={`${1.25}em`}
                height={`${1.25}em`}
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="search-bar-right-side-column r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-14j79pv r-4wgw6l r-f727ji"
              >
                <g className="search-bar-right-side-column-group">
                  <path d="M10.25 3.75c-3.59 0-6.5 2.91-6.5 6.5s2.91 6.5 6.5 6.5c1.795 0 3.419-.726 4.596-1.904 1.178-1.177 1.904-2.801 1.904-4.596 0-3.59-2.91-6.5-6.5-6.5zm-8.5 6.5c0-4.694 3.806-8.5 8.5-8.5s8.5 3.806 8.5 8.5c0 1.986-.682 3.815-1.824 5.262l4.781 4.781-1.414 1.414-4.781-4.781c-1.447 1.142-3.276 1.824-5.262 1.824-4.694 0-8.5-3.806-8.5-8.5z"></path>
                </g>
              </svg>
            </div>

            <input
              onFocus={onFocusActive}
              onChange={handleSetSearchTerm}
              style={{
                width: "350px",
                height: "44px",
                backgroundColor: onFocus ? "white" : "#eff3f4",
                border: onFocus ? "1px solid #1e9bf0" : "none",
                outlineStyle: "none",
                borderRadius: "9999px",
                borderWidth: "1px",
                padding: "0px 55px",
                fontSize: "15px",
                fontWeight: "400",
                lineHeight: "20px",
                wordWrap: "break-word",
              }}
              type="text"
              className="right-side-bar-input"
              placeholder="Search"
              value={searchTerm}
            />
            {/* close text start to check right side input  */}
            {searchTerm?.length && !closeDeleteSearchTermBtn ? (
              <div
                style={{
                  display: "inline-block",
                  float: "right",
                  position: "absolute",
                  top: "35px",
                  right: "40px",

                  backgroundColor: "yellow",
                  borderRadius: "50%",
                }}
                className="div-parent-search-input-delete-search-term css-175oi2r r-6koalj r-1777fci"
                onClick={() => {
                  console.log(
                    "Delete search term ! Keep Try searching for people modal open !"
                  );
                  setSearchTerm();
                }}
              >
                <div
                  aria-label="Clear"
                  role="button"
                  className="right-side-input-close-text-search-input css-175oi2r r-sdzlij r-1phboty r-lrvibr r-1yadl64 r-1b7u577 r-12sks89 r-1y7e96w r-1loqt21 r-o7ynqc r-6416eg r-1ny4l3l"
                  data-testid="clearButton"
                  style={{
                    borderColor: "rgb(0,0,0,0)",
                    backgroundColor: "rgb(29,155,240)",
                    display: "flex",
                    justifyContent: "center",
                    borderRadius: "50%",
                    width: "20px",
                    height: "auto",
                  }}
                >
                  <div
                    dir="ltr"
                    className="div-second-parent-search-input-delete-search-term css-1rynq56 r-bcqeeo r-qvutc0 r-37j5jr r-q4m81j r-a023e6 r-rjixqe r-b88u0q r-1awozwy r-6koalj r-18u37iz r-16y2uox r-1777fci"
                    style={{ textOverflow: "unset", color: "rgb(255,255,255)" }}
                  >
                    <svg
                      style={{
                        position: "relative",
                        bottom: "2px",
                      }}
                      color="white"
                      fill="currentColor"
                      width={9}
                      height={9}
                      viewBox="0 0 15 15"
                      aria-hidden="true"
                      className="search-input-delete-search-term-svg r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-jwli3a r-1or9b2r r-5soawk"
                    >
                      <g className="search-input-delete-search-term-svg-group">
                        <path d="M6.09 7.5L.04 1.46 1.46.04 7.5 6.09 13.54.04l1.42 1.42L8.91 7.5l6.05 6.04-1.42 1.42L7.5 8.91l-6.04 6.05-1.42-1.42L6.09 7.5z"></path>
                      </g>
                    </svg>
                  </div>
                </div>
              </div>
            ) : null}

            {/* close text finish to check right side input  */}
            <div
              style={{
                overflowY: "auto",
                overflowX: "hidden",
                maxHeight: "400px",
                minHeight: "100px",
                backgroundColor: "white",
                zIndex: 9999,
                width: "350px",
                borderRadius: "8px",
                border: "none",
                position: "absolute",
                padding: "12px",
                boxShadow:
                  "0 0 15px rgba(101, 119,134,0.2), 0 0 3px 1px rgba(101,119,134,0.15)",
                display: onFocus ? "flex" : "none",
                flexDirection: "column",

                alignItems: "center",
              }}
            >
              {!searchTerm ? (
                <>
                  <div
                    style={{
                      color: "rgb(83, 100, 113)",
                      lineHeight: "20px",
                      fontSize: "15px",
                      fontWeight: "400",
                    }}
                  >
                    Try searching for people
                  </div>
                </>
              ) : (
                <>
                  <List
                    className="right-side-bar-column-search-bar-list"
                    size="small"
                    header={<div>{`Search for "${searchTerm}"`}</div>}
                    bordered
                  >
                    {filteredSearchResult.map((eachUser, index) => (
                      <List.Item
                        onMouseEnter={() => {
                          setIsHoveredListItem(index);
                        }}
                        key={index}
                        style={{
                          backgroundColor:
                            isHoveredListItem === index ? "#f7f9f9" : "",
                          border: "none",
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          navigate(`/profile/${eachUser._doc._id}`);
                        }}
                      >
                        <Stack
                          style={{
                            width: "100%",
                          }}
                          direction="horizontal"
                        >
                          {eachUser._doc?.imageUrl?.slice(0, 3) !== "../" ? (
                            <Link to={`/profile/${eachUser._doc?._id}`}>
                              <img
                                src={eachUser._doc?.imageUrl}
                                alt={`${eachUser._doc?.fullname}'s profile`}
                                width={40}
                                height={40}
                                className="profile-image"
                                style={{
                                  borderRadius: "50%",
                                }}
                              />
                            </Link>
                          ) : (
                            <div>
                              <Link to={`/profile/${eachUser._doc?._id}`}>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="40"
                                  height="40"
                                  fill="rgb(83, 100, 113)"
                                  className="bi bi-person-circle"
                                  viewBox="0 0 16 16"
                                >
                                  <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                                  <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1" />
                                </svg>
                              </Link>
                            </div>
                          )}
                          {/* User Info */}
                          <div className="user-info p-2">
                            {/* Fullname */}
                            <div
                              style={{
                                fontSize: "15px",
                                fontWeight: "700",
                                lineHeight: "20px",
                              }}
                              className="fullname"
                            >
                              <Link
                                to={`/profile/${eachUser._doc?._id}`}
                                className="hover-fullname"
                                style={{
                                  textDecoration: "none",
                                  color: "black",
                                }}
                              >
                                <div
                                  style={{
                                    fontSize: "15px",
                                    fontWeight: "700",
                                    lineHeight: "20px",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                    width: "200px",
                                  }}
                                >
                                  {eachUser._doc?.fullname}
                                </div>
                              </Link>
                            </div>

                            {/* Username */}
                            <div
                              style={{
                                fontSize: "15px",
                                fontWeight: "400",
                                lineHeight: "20px",
                                color: "rgb(83, 100, 113)",
                                position: "relative",
                              }}
                              className="username"
                            >
                              <Link
                                style={{
                                  textDecoration: "none",
                                }}
                                to={`/profile/${eachUser._doc?._id}`}
                              >
                                <span
                                  style={{
                                    fontSize: "15px",
                                    fontWeight: "400",
                                    lineHeight: "20px",
                                    color: "rgb(83, 100, 113)",
                                    position: "relative",
                                  }}
                                >
                                  @{eachUser._doc?.username}
                                </span>
                              </Link>
                            </div>
                          </div>
                        </Stack>
                      </List.Item>
                    ))}
                  </List>
                </>
              )}
            </div>
            {/* close text start to check right side input  */}
          </div>
          {/* input finish to check  */}
          <div
            style={{
              position: "relative",
              bottom: "40px",
            }}
          >
            <div
              style={{
                border: "none",
                borderWidth: "1px",
                borderRadius: "16px",
                backgroundColor: "#eff3f4",
                maxWidth: "350px",
              }}
              className="p-4"
            >
              <div>
                <div
                  style={{
                    fontSize: "20px",
                    fontWeight: "800",
                    lineHeight: "24px",
                  }}
                >
                  Subscribe to Premium
                </div>
                <div
                  style={{
                    fontSize: "15px",
                    fontWeight: "400",
                    lineHeight: "20px",
                    marginTop: "10px",
                  }}
                >
                  Subscribe to unlock new features and if eligible, receive a
                  share of ads revenue.
                </div>

                <Button
                  style={{
                    display: "inline",
                    marginTop: "10px",
                    maxWidth: "107px",
                  }}
                  className="login-button"
                  variant="dark"
                >
                  Subscribe
                </Button>
              </div>
            </div>

            {/* start to check first 3 user  */}

            <div
              style={{
                border: "none",
                borderWidth: "1px",
                borderRadius: "16px",
                backgroundColor: "#eff3f4",
                maxWidth: "350px",
                marginTop: "10px",
                display: "flex",
                flexDirection: "column",
                textAlign: "left",
              }}
              className="p-4"
            >
              <div
                style={{
                  fontSize: "20px",
                  fontWeight: "800",
                  lineHeight: "24px",
                  position: "relative",
                  right: "10px",
                }}
              >
                Who to follow
              </div>
              {first3User
                ? first3User.map((eachUser, index) => {
                    return (
                      <div
                        style={{
                          position: "relative",
                          right: "10px",
                        }}
                        key={eachUser._id}
                      >
                        <div>
                          <Stack
                            className="each-who-to-follow-user"
                            style={{
                              width: "108%",
                            }}
                            direction="horizontal"
                          >
                            <div>
                              {" "}
                              {eachUser.imageUrl.slice(0, 3) !== "../" ? (
                                <>
                                  <Link
                                    to={`/profile/${eachUser._id}`}
                                    style={{
                                      textDecoration: "none",
                                      borderRadius: "50%",
                                    }}
                                  >
                                    <img
                                      width={40}
                                      height={40}
                                      style={{
                                        borderRadius: "50%",
                                      }}
                                      src={eachUser.imageUrl}
                                      alt=""
                                    />
                                  </Link>
                                </>
                              ) : (
                                <>
                                  <Link
                                    to={`/profile/${eachUser._id}`}
                                    style={{
                                      textDecoration: "none",
                                    }}
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="40"
                                      height="40"
                                      fill="rgb(83, 100, 113)"
                                      className="bi bi-person-circle"
                                      viewBox="0 0 16 16"
                                    >
                                      <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                                      <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1" />
                                    </svg>
                                  </Link>
                                </>
                              )}
                            </div>
                            <div className="p-3">
                              <Link
                                to={`/profile/${eachUser._id}`}
                                style={{
                                  textDecoration: "none",
                                  color: "black",
                                }}
                              >
                                <div
                                  className="hover-fullname"
                                  style={{
                                    lineHeight: "20px",
                                    fontSize: "15px",
                                    fontWeight: "700",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                    width: "120px",
                                  }}
                                >
                                  <span>{eachUser.fullname}</span>
                                  <span>
                                    {/* start to check  */}{" "}
                                    <span className="css-1qaijid r-bcqeeo r-qvutc0 r-poiln3 r-1awozwy r-xoduu5">
                                      <svg
                                        width={`${1.25}em`}
                                        height={`${1.25}em`}
                                        viewBox="0 0 22 22"
                                        aria-label="Verified account"
                                        role="img"
                                        className="r-4qtqp9 r-yyyyoo r-1xvli5t r-bnwqim r-1plcrui r-lrvibr r-1cvl2hr r-f9ja8p r-og9te1 r-9cviqr"
                                        data-testid="icon-verified"
                                        color="rgba(29,155,240,1.00)"
                                        fill="currentColor"
                                      >
                                        <g>
                                          <path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z"></path>
                                        </g>
                                      </svg>
                                    </span>{" "}
                                  </span>{" "}
                                </div>
                              </Link>
                              <Link
                                to={`/profile/${eachUser._id}`}
                                style={{
                                  textDecoration: "none",
                                  color: "black",
                                }}
                              >
                                <div
                                  // style={{
                                  //   lineHeight: "20px",
                                  //   fontSize: "15px",
                                  //   fontWeight: "700",
                                  //   overflow: "hidden",
                                  //   textOverflow: "ellipsis",
                                  //   whiteSpace: "nowrap",
                                  //   width: "120px",
                                  // }}
                                  style={{
                                    lineHeight: "20px",
                                    fontSize: "15px",
                                    fontWeight: "400",
                                    color: "rgb(83, 100, 113)",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                    width: "120px",
                                  }}
                                >
                                  @{eachUser.username}
                                </div>
                              </Link>
                              {/* start to check verified icon  */}

                              {/* finish to check verified icon  */}
                            </div>
                            <div
                              onMouseEnter={() => {
                                setIsHovered(index);
                              }}
                              onMouseLeave={() => setIsHovered("")}
                              className="ms-auto"
                            >
                              <Button
                                onClick={() =>
                                  getFollowingIds(user)?.includes(eachUser._id)
                                    ? openUnfollowModal(eachUser)
                                    : handleFollow(eachUser)
                                }
                                style={{
                                  maxWidth: "99px",
                                  maxHeight: "32px",
                                  fontSize: "15px",
                                  lineHeight: "20px",
                                  fontWeight: "700",
                                  transitionDuration: "0.2s",
                                  border:
                                    isHovered === index &&
                                    getFollowingIds(user)?.includes(
                                      eachUser._id
                                    )
                                      ? "1px solid rgba(253,201,206,255)"
                                      : getFollowingIds(user)?.includes(
                                          eachUser._id
                                        )
                                      ? "1px solid rgba(0, 0, 0, 0.1)"
                                      : "1px solid rgb(185, 202, 211)",
                                  backgroundColor:
                                    isHovered === index &&
                                    getFollowingIds(user)?.includes(
                                      eachUser._id
                                    )
                                      ? "rgba(255,234,235,255)"
                                      : getFollowingIds(user)?.includes(
                                          eachUser._id
                                        )
                                      ? "transparent"
                                      : "black",

                                  color:
                                    isHovered === index &&
                                    getFollowingIds(user).includes(eachUser._id)
                                      ? "rgba(244,34,45,255)"
                                      : getFollowingIds(user)?.includes(
                                          eachUser._id
                                        )
                                      ? "black"
                                      : "white",
                                }}
                                className="right-side-bar-button"
                                variant="dark"
                              >
                                {isHovered === index
                                  ? getFollowingIds(user)?.includes(
                                      eachUser._id
                                    )
                                    ? "Unfollow"
                                    : "Follow"
                                  : getFollowingIds(user)?.includes(
                                      eachUser._id
                                    )
                                  ? "Following"
                                  : "Follow"}
                              </Button>
                            </div>
                          </Stack>
                        </div>
                      </div>
                    );
                  })
                : null}
              <div
                style={{
                  color: "rgb(29, 155, 240)",
                  fontSize: "15px",
                  lineHeight: "20px",
                  fontWeight: "400",
                  position: "relative",
                  right: "10px",
                }}
              >
                Show more
              </div>
            </div>

            {/* finish to check first 3 user  */}
            <div
              style={{
                width: "375px",
              }}
              className="p-4"
            >
              <ul
                className="right-side-bar-column-list"
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  width: "370px",
                  position: "relative",
                  right: "24px",
                  listStyle: "none",
                  margin: "0px",
                  padding: "0px",
                }}
              >
                <li>Terms of Service</li>
                <li>Privacy Policy</li>
                <li>Cookie Policy</li>
                <li>MStV Transparenzangaben</li>
                <li>Imprint</li>
                <li>Accessibility</li>
                <li>Ads info</li>
                <li>© 2024 Connectify Corp.</li>
              </ul>
            </div>
          </div>
          {/* unfollow modal start to check  */}

          {/* unfollow modal finish to check  */}
        </Stack>
      </Col>
    </>
  );
}

export default RightSideColumn;
