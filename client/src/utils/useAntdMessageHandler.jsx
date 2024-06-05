import { message } from "antd";
import { Link } from "react-router-dom";

export const useAntdMessageHandler = () => {
  const [messageApi, contextHolder] = message.useMessage();

  const postSharedMessage = (postOwner, postId) => {
    messageApi.success({
      type: "success",
      content: (
        <div>
          <span style={{ fontSize: "15px" }}>Your post was sent.</span>
          <>
            <Link
              className="chirp-bold-font"
              to={`/${postOwner}/status/${postId}`}
              style={{
                color: "white",
                marginLeft: "5px",
                fontWeight: "700",
                fontSize: "15px",
              }}
            >
              View
            </Link>
          </>
        </div>
      ),
      duration: 6,
      className: "custom-message-style",
    });
  };

  const postDeletedMessage = () => {
    messageApi.success({
      type: "success",
      content: <div>Your post was deleted</div>,
      duration: 6,
      className: "custom-message-style chirp-regular-font",
    });
  };

  const showCustomMessage = (
    customMessage,
    duration,
    isBookmarkAddedMessage
  ) => {
    console.log("Şu an burası çalışıyor custom message için !!!");
    messageApi.success({
      type: "success",
      content: (
        <div>
          <span style={{ fontSize: "15px" }}>{customMessage}</span>
          {isBookmarkAddedMessage && (
            <Link
              className="chirp-bold-message"
              style={{
                color: "white",
                marginLeft: "15px",
                fontWeight: "700",
                fontSize: "15px",
              }}
            >
              Add to folder
            </Link>
          )}
        </div>
      ),
      duration: duration,

      className: "custom-message-style chirp-regular-font",
    });
  };

  return {
    postSharedMessage,
    postDeletedMessage,
    showCustomMessage,
    contextHolder,
  };
};
