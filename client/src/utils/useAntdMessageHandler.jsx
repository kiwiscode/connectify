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
          <span
            style={{ fontSize: font15.fontSize }}
            className="chirp-regular-font"
          >
            Your post was sent.
          </span>
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

  const pinnedMessage = () => {
    console.log("here is working rn pinned +");
    messageApi.success({
      type: "success",
      content: <div>Your post was pinned to your profile.</div>,
      duration: 6,
      className: "custom-message-style chirp-regular-font",
    });
  };

  const unpinnedMessage = () => {
    console.log("here is working rn unpinned -");
    messageApi.success({
      type: "success",
      content: <div>Your post was unpinned from your profile</div>,
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
    pinnedMessage,
    unpinnedMessage,
    showCustomMessage,
    contextHolder,
  };
};
