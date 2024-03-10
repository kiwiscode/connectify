import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";

const CustomNotification = ({
  senderName,
  type,
  contactHasBeenMade,
  senderInfo,
  text,
}) => {
  const { userInfo } = useContext(UserContext);
  const navigate = useNavigate();
  const redirectPostDetailIfNoContentOnlyImage = () => {
    navigate(`/${senderInfo.username}/status/${contactHasBeenMade._id}`);
  };

  console.log("Contact has been made =>", contactHasBeenMade);
  return (
    <>
      <div
        onClick={
          contactHasBeenMade?.image?.url && !contactHasBeenMade?.content
            ? redirectPostDetailIfNoContentOnlyImage
            : ""
        }
        style={{
          display: "flex",
          alignItems: "center",
          padding: "10px",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Gölgelendirme efekti
          background: "#fff", // Arkaplan rengi
          border: "1px solid #e1e8ed", // Kenarlık rengi
        }}
      >
        <Link
          style={{
            textDecoration: "none",
            borderRadius: "50%",
          }}
          to={`/profile/${senderInfo._id}`}
        >
          <div style={{ position: "relative", bottom: "5px" }}>
            {" "}
            {senderInfo.imageUrl.slice(0, 3) !== "../" ? (
              <img
                src={senderInfo.imageUrl}
                width={40}
                height={40}
                alt=""
                style={{
                  borderRadius: "50%",
                }}
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
                  style={{
                    borderRadius: "50%",
                  }}
                >
                  <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                  <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1" />
                </svg>
              </div>
            )}
          </div>
        </Link>
        <div style={{ marginLeft: "10px" }}>
          {type === "liked" && (
            <>
              <div>
                <span>
                  {" "}
                  <Link
                    className="test-notification"
                    style={{
                      color: "black",
                      textDecoration: "none",
                      fontWeight: "700",
                      fontSize: "15px",
                      lineHeight: "20px",
                    }}
                    to={`/profile/${senderInfo._id}`}
                  >
                    <span className="post-detail-underline-text-2">
                      {senderInfo.fullname}
                    </span>
                  </Link>{" "}
                  liked your post!
                </span>
              </div>
              <Link
                style={{
                  color: "black",
                  textDecoration: "none",
                  fontWeight: "400",
                  fontSize: "15px",
                  lineHeight: "20px",
                }}
                to={`/${userInfo.username}/status/${contactHasBeenMade._id}`}
              >
                <p>{contactHasBeenMade.content}</p>
              </Link>
            </>
          )}
          {type === "comment" && (
            <>
              <div>
                <span>
                  <Link
                    style={{
                      color: "black",
                      textDecoration: "none",
                      fontWeight: "700",
                      fontSize: "15px",
                      lineHeight: "20px",
                    }}
                    to={`/profile/${senderInfo._id}`}
                  >
                    <span className="post-detail-underline-text-2">
                      {senderInfo.fullname}
                    </span>
                  </Link>{" "}
                  commented on your post!
                </span>
              </div>
              <Link
                style={{
                  color: "black",
                  textDecoration: "none",
                  fontWeight: "400",
                  fontSize: "15px",
                  lineHeight: "20px",
                }}
                to={`/${userInfo.username}/status/${contactHasBeenMade._id}`}
              >
                <p>{contactHasBeenMade.content}</p>
              </Link>

              {/* Diğer comment tipine özel JSX bileşenleri */}
            </>
          )}
          {type === "repost" && (
            <>
              <div>
                <span>
                  <Link
                    style={{
                      color: "black",
                      textDecoration: "none",
                      fontWeight: "700",
                      fontSize: "15px",
                      lineHeight: "20px",
                    }}
                    to={`/profile/${senderInfo._id}`}
                  >
                    <span className="post-detail-underline-text-2">
                      {senderInfo.fullname}
                    </span>
                  </Link>{" "}
                  reposted your post!
                </span>
              </div>
              <Link
                style={{
                  color: "black",
                  textDecoration: "none",
                  fontWeight: "400",
                  fontSize: "15px",
                  lineHeight: "20px",
                }}
                to={`/${userInfo.username}/status/${contactHasBeenMade._id}`}
              >
                <p>{contactHasBeenMade.content}</p>
              </Link>

              {/* Repost tipine özel JSX bileşenleri */}
            </>
          )}
          {type === "followed" && (
            <>
              <div>
                <span>
                  {" "}
                  <Link
                    style={{
                      color: "black",
                      textDecoration: "none",
                      fontWeight: "700",
                      fontSize: "15px",
                      lineHeight: "20px",
                    }}
                    to={`/profile/${senderInfo._id}`}
                  >
                    <span className="post-detail-underline-text-2">
                      {senderInfo.fullname}
                    </span>
                  </Link>{" "}
                  is now following you!
                </span>
              </div>

              {/* Followed tipine özel JSX bileşenleri */}
            </>
          )}
          {type === "message" && (
            <>
              <div>
                <span>
                  {" "}
                  <Link
                    style={{
                      color: "black",
                      textDecoration: "none",
                      fontWeight: "700",
                      fontSize: "15px",
                      lineHeight: "20px",
                    }}
                    to={`/profile/${senderInfo._id}`}
                  >
                    <span className="post-detail-underline-text-2">
                      {senderInfo.fullname}
                    </span>
                  </Link>{" "}
                  sent you a new message!
                </span>

                <p
                  style={{
                    color: "black",
                    fontSize: "15px",
                    fontWeight: "400",
                    lineHeight: "20px",
                  }}
                >
                  {text}
                </p>
              </div>
              {/* Message tipine özel JSX bileşenleri */}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default CustomNotification;
