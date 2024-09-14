import { message } from "antd";
import { Link } from "react-router-dom";
import { useFontSizeHandler } from "./useFontSizeHandler";

export const useAntdMessageHandler = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const { getFontSizeAndLineHeight15 } = useFontSizeHandler();
  const font15 = getFontSizeAndLineHeight15();
  const postSharedMessage = (postOwner, postId) => {
    messageApi.success({
      type: "success",
      content: (
        <div>
          <span style={{ fontSize: font15.fontSize }}>Your post was sent.</span>
          <>
            <Link
              className="chirp-bold-font"
              to={`/${postOwner}/status/${postId}`}
              style={{
                color: "white",
                marginLeft: "5px",
                fontSize: font15.fontSize,
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
          <span style={{ fontSize: font15.fontSize }}>{customMessage}</span>
          {isBookmarkAddedMessage && (
            <Link
              className="chirp-bold-font"
              style={{
                color: "white",
                marginLeft: "15px",
                fontSize: font15.fontSize,
                lineHeight: font15.lineHeight,
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
