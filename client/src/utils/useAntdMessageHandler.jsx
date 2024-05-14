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
      className: "custom-message-style",
    });
  };

  const showCustomMessage = (customMessage, duration) => {
    messageApi.success({
      type: "success",
      content: customMessage,
      duration: duration,
      className: "custom-message-style",
    });
  };

  return {
    postSharedMessage,
    postDeletedMessage,
    showCustomMessage,
    contextHolder,
  };
};
