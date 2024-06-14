import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Col } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import SettingsNavigation from "../../../../components/SettingsNavigation/SettingsNavigation";
import { ModalVisibilityContext } from "../../../../context/ModalVisibilityContext";
import ResponsiveNavigationBarBottom from "../../../../components/Navbar/ResponsiveNavigationBottom";
import LoadingSpinner from "../../../../components/ui/LoadingSpinner";
import { useAntdMessageHandler } from "../../../../utils/useAntdMessageHandler";
import useWindowDimensions from "../../../../hooks/getWindowDimensions";
import { ThemeContext } from "../../../../context/ThemeContext";
import { UserContext } from "../../../../context/UserContext";
// when working on local version
const API_URL = "http://localhost:3000";

// when working on deployment version
// ?
function CreatorSubscriptionMain() {
  const { getToken, userInfo } = useContext(UserContext);
  const [{ theme, themeName }] = useContext(ThemeContext);
  const { width } = useWindowDimensions();

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "June",
    "July",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];

  const getCreatedDate = (date) => {
    const createdAt = new Date(date);
    const getMonth = createdAt.getMonth();
    return `${months[getMonth]} ${createdAt.getDate()}`;
  };

  const extraDetailedDate = (dateStr) => {
    const date = new Date(dateStr);

    const optionsTime = {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };
    const optionsDate = {
      month: "short",
      day: "numeric",
      year: "numeric",
    };
    const formattedTime = new Intl.DateTimeFormat("en-US", optionsTime).format(
      date
    );
    const formattedDate = new Intl.DateTimeFormat("en-US", optionsDate).format(
      date
    );

    return `${formattedTime} \u00B7 ${formattedDate}`;
  };

  const {
    postSharedMessage,
    contextHolder,
    showCustomMessage,
    postDeletedMessage,
  } = useAntdMessageHandler();

  const [dataFromCommentModal, setDataFromCommentModal] = useState("");
  function handleDataFromCommentModal(data) {
    console.log("Data =>", data);
    setDataFromCommentModal(data);
  }

  const { isPostModalVisible } = useContext(ModalVisibilityContext);

  const [onFocus, setOnFocus] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const setSearchTermEmpty = () => {
    setSearchTerm("");
  };
  const [onFocusXBtn, setOnFocusXBtn] = useState(true);
  const onFocusInActiveForXBtn = () => {
    setOnFocusXBtn(false);
  };
  const handleSetSearchTerm = (e) => {
    setSearchTerm(e.target.value);
  };
  const onFocusActive = () => {
    setOnFocus(true);
  };

  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  const [isSearchStart, setSearchStart] = useState(null);

  const [showNotificationMessage, setShowNotificationMessage] = useState(null);

  const [loading, setLoading] = useState(null);
  const [showSubscriptions, setShowSubscriptions] = useState(false);
  const [user, setUser] = useState([]);
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
    getSubscription();
  }, []);

  const [subscription, setSubscription] = useState(null);
  const getSubscription = async () => {
    try {
      const response = await axios.get(`${API_URL}/subscription`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      console.log(
        "response data detail =>",
        response.data.activeSubscription[0]
      );

      setSubscription(
        response.data.activeSubscription[0]
          ? response.data.activeSubscription[0]
          : response.data.activeCancelledSubscription[0]
      );
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const [manageSubscription, setManageSubscription] = useState(null);

  function formatDateTime(inputDate) {
    const dateObj = new Date(inputDate);

    const formattedDate = dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
    const formattedTime = dateObj.toLocaleTimeString("en-US", {
      hour12: true,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    const output = `${formattedDate}, ${formattedTime}`;

    return output;
  }

  return (
    <>
      {!isPostModalVisible && !dataFromCommentModal && (
        <ResponsiveNavigationBarBottom />
      )}
      {contextHolder}
      <SettingsNavigation />
      <Col
        xs={10}
        sm={10}
        md={11}
        lg={width <= 1201 && width >= 992 ? 7 : width > 1201 ? 4 : ""}
        xxl={width <= 1201 && width >= 992 ? 7 : width > 1201 ? 4 : ""}
        className={`right-side-column-settings-account-page`}
        style={{
          borderLeft:
            width < 1000
              ? themeName !== "dark-theme"
                ? "1px solid rgba(0, 0, 0, 0.1)"
                : // : "0.1px solid rgb(70, 70, 70)",
                  "1px solid rgb(70, 70, 70)"
              : null,
          borderRight:
            themeName !== "dark-theme"
              ? "1px solid rgba(0, 0, 0, 0.1)"
              : // : "0.1px solid rgb(70, 70, 70)",
                "1px solid rgb(70, 70, 70)",
          borderTop: "none ",
          borderBottom: "none",
          padding: "0px",
          width:
            width > 1400
              ? "580px"
              : width <= 1400 && width > 1355
              ? "650px"
              : width <= 1355 && width > 1288
              ? "600px"
              : width <= 1288 && width > 1221
              ? "500px"
              : width <= 1221 && width > 1000
              ? "500px"
              : width <= 500
              ? "100%"
              : null,
          position: "relative",
          right: "10px",
        }}
      >
        <div
          style={{
            lineHeight: "24px",
            fontWeight: "700",
            fontSize: "20px",
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            paddingLeft: width <= 500 ? "32px" : "12px",
            paddingRight: width <= 500 ? "32px" : "12px",
          }}
        >
          {" "}
          {width <= 991 ? (
            <span
              onClick={() => {
                navigate("/settings");
              }}
              className={`arrow arrow-${themeName} mt-3`}
              style={{
                position: "relative",
                width: "30px",
                height: " 30px",
                borderRadius: "50%",
                cursor: "pointer",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginRight: "5px",
              }}
            >
              <svg
                color={themeName === "dark-theme" ? "white" : ""}
                fill="currentColor"
                style={{
                  position: "absolute",
                  border: "none",
                }}
                width={20}
                height={20}
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-z80fyv r-19wmn03"
              >
                <g>
                  <path d="M7.414 13l5.043 5.04-1.414 1.42L3.586 12l7.457-7.46 1.414 1.42L7.414 11H21v2H7.414z"></path>
                </g>
              </svg>
            </span>
          ) : null}
          <div
            className="mt-3"
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            {width > 991 && showSubscriptions && (
              <span
                onClick={() => {
                  setShowSubscriptions(false);
                }}
                className={`arrow arrow-${themeName}`}
                style={{
                  position: "relative",
                  width: "30px",
                  height: " 30px",
                  borderRadius: "50%",
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: "5px",
                }}
              >
                <svg
                  color={themeName === "dark-theme" ? "white" : ""}
                  fill="currentColor"
                  style={{
                    position: "absolute",
                    border: "none",
                  }}
                  width={20}
                  height={20}
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-z80fyv r-19wmn03"
                >
                  <g>
                    <path d="M7.414 13l5.043 5.04-1.414 1.42L3.586 12l7.457-7.46 1.414 1.42L7.414 11H21v2H7.414z"></path>
                  </g>
                </svg>
              </span>
            )}
            {showSubscriptions
              ? "Manage Subscription"
              : "Creator Subscriptions"}
          </div>
        </div>{" "}
        {showSubscriptions && (
          <>
            <div
              className="mt-3"
              style={{
                paddingLeft: "16px",
                paddingRight: "16px",
                textAlign: "right",
              }}
            >
              <span
                className={
                  themeName === "dark-theme"
                    ? "soft-grey-dark-theme-text-variant-1 chirp-bold-font"
                    : "very-dark-gray-light-theme-text-variant-1 chirp-bold-font"
                }
                style={{
                  borderRadius: "9999px",
                  border:
                    themeName !== "dark-theme"
                      ? "1px solid rgba(0, 0, 0, 0.1)"
                      : // : "0.1px solid rgb(70, 70, 70)",
                        "1px solid rgb(70, 70, 70)",
                  padding: "0px 8px",
                  fontSize: "15px",
                  lineHeight: "24px",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span></span>
                <span>
                  {" "}
                  <svg
                    width={`${1.25}em`}
                    height={`${1.25}em`}
                    viewBox="0 0 22 22"
                    aria-label="Verified account"
                    role="img"
                    className="r-4qtqp9 r-yyyyoo r-1xvli5t r-bnwqim r-1plcrui r-lrvibr r-1cvl2hr r-f9ja8p r-og9te1 r-9cviqr"
                    data-testid="verified-icon"
                    color="rgba(29,155,240,1.00)"
                    fill="currentColor"
                  >
                    <g>
                      <path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z"></path>
                    </g>
                  </svg>
                </span>
                <span
                  style={{
                    marginLeft: "2px",
                    position: "relative",
                    top: "1px",
                  }}
                >
                  Active
                </span>
              </span>
            </div>
            {!subscription?.isActive &&
            subscription?.remainingTimeSubscription &&
            subscription?.cancelledDate ? (
              <div
                style={{
                  paddingLeft: "16px",
                  paddingRight: "16px",
                }}
                className="mt-3"
              >
                <span
                  style={{
                    fontSize: "14px",
                    lineHeight: "18px",
                  }}
                  className={
                    themeName === "dark-theme"
                      ? "soft-grey-dark-theme-text-variant-2 chirp-regular-font"
                      : "very-dark-gray-light-theme-text-variant-2 chirp-regular-font"
                  }
                >
                  {" "}
                  Your subscription is approaching its expiration date on{" "}
                  <span>
                    {formatDateTime(subscription?.remainingTimeSubscription)}
                  </span>
                  . You have cancelled your subscription, but it is still
                  active. If you wish to continue, please renew your
                  subscription or start a new one.
                </span>
              </div>
            ) : (
              <div
                className="mt-3"
                style={{
                  paddingLeft: "16px",
                  paddingRight: "16px",
                }}
              >
                <div
                  style={{
                    fontSize: "14px",
                    lineHeight: "24px",
                    paddingLeft: "4px",
                  }}
                  className={
                    themeName === "dark-theme"
                      ? "soft-grey-dark-theme-text-variant-2 chirp-regular-font"
                      : "very-dark-gray-light-theme-text-variant-2 chirp-regular-font"
                  }
                >
                  We are reviewing your account.
                </div>
                <div
                  onClick={() => {
                    setManageSubscription(true);
                    setTimeout(() => {
                      navigate("/billing/stripe/subscription");
                    }, 300);
                    setTimeout(() => {
                      setManageSubscription(false);
                    }, 400);
                  }}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    cursor: "pointer",
                    borderRadius: "8px",
                    padding: "4px",
                  }}
                  className={
                    themeName === "dark-theme"
                      ? "has-children-dark-theme_sub mt-4"
                      : "has-children-light-theme_sub mt-4"
                  }
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "15px",
                        lineHeight: "24px",
                      }}
                      className={
                        themeName === "dark-theme"
                          ? "soft-grey-dark-theme-text-variant-1 chirp-regular-font"
                          : "very-dark-gray-light-theme-text-variant-1 chirp-regular-font"
                      }
                    >
                      Manage your current subscription
                    </div>
                    <div
                      style={{
                        fontSize: "14px",
                        lineHeight: "24px",
                      }}
                      className={
                        themeName === "dark-theme"
                          ? "soft-grey-dark-theme-text-variant-2 chirp-regular-font"
                          : "very-dark-gray-light-theme-text-variant-2 chirp-regular-font"
                      }
                    >
                      Review terms or manage your subscription from your Stripe
                      account.
                    </div>
                  </div>
                  <div>
                    {" "}
                    <svg
                      fill={
                        themeName === "dark-theme"
                          ? "#71767A"
                          : "rgb(83, 100, 113)"
                      }
                      width={`${1.25}em`}
                      height={`${1.25}em`}
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      class="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-14j79pv r-1q142lx r-2dysd3"
                    >
                      <g>
                        <path d="M8 6h10v10h-2V9.41L5.957 19.46l-1.414-1.42L14.586 8H8V6z"></path>
                      </g>
                    </svg>
                  </div>
                </div>
              </div>
            )}
            {manageSubscription && (
              <div
                style={{
                  fontSize: "15px",
                }}
              >
                <LoadingSpinner
                  strokeColor={"rgb(29, 155, 240)"}
                ></LoadingSpinner>
              </div>
            )}
          </>
        )}
        {!loading ? (
          <>
            {showSubscriptions ? (
              <div></div>
            ) : (
              <div
                className={
                  themeName === "dark-theme"
                    ? "dark-theme-settings-one-option mt-4"
                    : "light-theme-settings-one-option mt-4"
                }
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                  padding: "12px 0px",
                }}
                onClick={() => {
                  if (
                    (user?.hasSubscription && subscription?.isActive) ||
                    (!subscription?.isActive &&
                      subscription?.remainingTimeSubscription &&
                      subscription?.cancelledDate)
                  ) {
                    setLoading(true);
                    getSubscription();
                    setTimeout(() => {
                      setLoading(false);
                      setShowSubscriptions(true);
                    }, 300);
                  } else {
                    console.log("User =>", user);
                    showCustomMessage(
                      "You don’t have any Subscriptions yet",
                      6
                    );
                  }
                }}
              >
                <div
                  className={
                    themeName === "dark-theme"
                      ? "settings-icon-dark-theme"
                      : "settings-icon-light-theme"
                  }
                >
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    class="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-14j79pv"
                  >
                    <g>
                      <path d="M4.496 9.25c0-4.14 3.358-7.5 7.5-7.5s7.5 3.36 7.5 7.5-3.358 7.5-7.5 7.5-7.5-3.36-7.5-7.5zm7.5 9.5c-1.63 0-3.164-.41-4.505-1.13v5.82l4.498-1.87 4.502 1.87v-5.82c-1.338.72-2.869 1.13-4.495 1.13z"></path>
                    </g>
                  </svg>
                </div>
                <div
                  style={{
                    paddingLeft: "16px",
                    width: "100%",
                  }}
                >
                  <div
                    className={
                      themeName === "dark-theme"
                        ? "settings-text-first-exp-dark-theme"
                        : "settings-text-first-exp-light-theme "
                    }
                  >
                    Manage Creator Subscriptions
                  </div>
                  <div
                    className={
                      themeName === "dark-theme"
                        ? "settings-text-dark-theme"
                        : "settings-text-light-theme"
                    }
                  >
                    View and manage your subscriptions to creators below using
                    Stripe. Any active subscriptions you initiated on iOS or
                    Android can be managed in the app.
                  </div>
                </div>
                <div
                  className={
                    themeName === "dark-theme"
                      ? "settings-icon-dark-theme"
                      : "settings-icon-light-theme"
                  }
                >
                  {" "}
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    class="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-14j79pv r-1q142lx r-2dysd3"
                  >
                    <g>
                      <path d="M8 6h10v10h-2V9.41L5.957 19.46l-1.414-1.42L14.586 8H8V6z"></path>
                    </g>
                  </svg>
                </div>
              </div>
            )}
          </>
        ) : (
          <div
            style={{
              fontSize: "15px",
            }}
          >
            <LoadingSpinner strokeColor={"rgb(29, 155, 240)"}></LoadingSpinner>
          </div>
        )}
      </Col>
    </>
  );
}
export default CreatorSubscriptionMain;
