import { Col } from "react-bootstrap";
import useWindowDimensions from "../../../../hooks/getWindowDimensions";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../../../../context/UserContext";
import LoadingSpinner from "../../../../components/ui/LoadingSpinner";
import { SubcsriptionStatusContext } from "../../../../context/SubscriptionStatusContext";
import { useFontSizeHandler } from "../../../../utils/useFontSizeHandler";
// when working on local version
const API_URL = "http://localhost:3000";

// when working on deployment version
// ?
function BillingStripeSubscriptionMain() {
  const { width } = useWindowDimensions();
  const navigate = useNavigate();
  const { getToken } = useContext(UserContext);

  const {
    subscription,
    remainingTimeSubscriptions,
    remainingTimeSubscriptionsOwnerIds,
  } = useContext(SubcsriptionStatusContext);

  const nextBillingDateForAnnualSub = (originalDate) => {
    let newDate = new Date(originalDate);
    newDate.setFullYear(newDate.getFullYear() + 1);

    let options = { day: "numeric", month: "long", year: "numeric" };
    let formattedDate = newDate.toLocaleDateString("en-GB", options);

    return formattedDate;
  };

  const nextBillingDateForMonthlySub = (originalDate) => {
    let newDate = new Date(originalDate);
    newDate.setMonth(newDate.getMonth() + 1);

    let options = { day: "numeric", month: "long", year: "numeric" };
    let formattedDate = newDate.toLocaleDateString("en-GB", options);

    return formattedDate;
  };

  const [cancelProcess, setCancelProcess] = useState(false);
  const [cancelProcessStart, setCancelProcessStart] = useState(null);
  const handleCancelSubscription = async () => {
    setCancelProcessStart(true);
    try {
      const response = axios.post(`${API_URL}/cancel_subscription`, null, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      setTimeout(() => {
        navigate("/home");
      }, 350);
      console.log("Response =>", response);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: "numeric", month: "short", day: "numeric" };
    return date.toLocaleDateString("en-GB", options);
  };

  const {
    getFontSizeAndLineHeight31,
    getFontSizeAndLineHeight18,
    getFontSizeAndLineHeight15,
    getFontSizeAndLineHeight14,
    getFontSizeAndLineHeight13,
    getFontSizeAndLineHeight11,
  } = useFontSizeHandler();
  const font31 = getFontSizeAndLineHeight31();
  const font15 = getFontSizeAndLineHeight15();
  const font14 = getFontSizeAndLineHeight14();
  const font13 = getFontSizeAndLineHeight13();
  const font11 = getFontSizeAndLineHeight11();
  return (
    <>
      <Col
        xxl={3}
        xl={3}
        lg={4}
        md={4}
        sm={4}
        xs={4}
        style={{
          backgroundColor: "#1C9BEF",
          padding: "0px",
          margin: "0px",
        }}
      >
        <div
          className="mt-4"
          style={{
            paddingLeft: "24px",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={50}
            height={30}
            viewBox="0 0 100 100"
          >
            {/* İçi dolu bir kare */}
            <rect
              x="5"
              y="5"
              width="90"
              height="90"
              fill="#1C9BEF"
              rx="5"
              ry="5"
              style={{
                filter: "drop-shadow(0 0 10px rgba(0, 0, 0, 0.5))",
              }}
            />

            <text
              x="27.5"
              y="70"
              fontFamily="Arial"
              fontSize="60"
              fill="#FFF"
              stroke="#FFF"
              strokeWidth="2"
            >
              C
            </text>
          </svg>
        </div>
        <div
          style={{
            fontSize: font18.fontSize,
            lineHeight: font18.lineHeight,
            paddingLeft: "32px",
          }}
          className={"soft-grey-dark-theme-text-variant-1 chirp-bold-font mt-5"}
        >
          Connectify Blue
        </div>
        <div
          style={{
            fontSize: font11.fontSize,
            lineHeight: font11.lineHeight,
            paddingLeft: "32px",
          }}
          className={"soft-grey-dark-theme-text-variant-1 chirp-bold-font mt-3"}
        >
          <span
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
            }}
          >
            <svg
              onClick={() => {
                navigate("/home");
              }}
              style={{
                cursor: "pointer",
              }}
              fill="#e6e9ea"
              width={`${1}em`}
              height={`${1}em`}
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-z80fyv r-19wmn03"
            >
              <g>
                <path d="M7.414 13l5.043 5.04-1.414 1.42L3.586 12l7.457-7.46 1.414 1.42L7.414 11H21v2H7.414z"></path>
              </g>
            </svg>
            <span
              style={{
                marginLeft: "5px",
              }}
            >
              Return to Connectify, Inc.
            </span>
          </span>
        </div>
        <div
          style={{
            position: "absolute",
            bottom: "20px",
            width: width <= 700 ? "inherit" : "",
            paddingLeft: "32px",
          }}
        >
          <span
            style={{
              fontSize: font13.fontSize,
              lineHeight: "24px",
            }}
            className={"soft-grey-dark-theme-text-variant-1 chirp-bold-font"}
          >
            Powered by{" "}
          </span>
          <span>
            <svg
              viewBox="0 0 60 25"
              xmlns="http://www.w3.org/2000/svg"
              width="40"
              height="25"
              class="UserLogo variant-- "
            >
              <path
                fill="white"
                d="M59.64 14.28h-8.06c.19 1.93 1.6 2.55 3.2 2.55 1.64 0 2.96-.37 4.05-.95v3.32a8.33 8.33 0 0 1-4.56 1.1c-4.01 0-6.83-2.5-6.83-7.48 0-4.19 2.39-7.52 6.3-7.52 3.92 0 5.96 3.28 5.96 7.5 0 .4-.04 1.26-.06 1.48zm-5.92-5.62c-1.03 0-2.17.73-2.17 2.58h4.25c0-1.85-1.07-2.58-2.08-2.58zM40.95 20.3c-1.44 0-2.32-.6-2.9-1.04l-.02 4.63-4.12.87V5.57h3.76l.08 1.02a4.7 4.7 0 0 1 3.23-1.29c2.9 0 5.62 2.6 5.62 7.4 0 5.23-2.7 7.6-5.65 7.6zM40 8.95c-.95 0-1.54.34-1.97.81l.02 6.12c.4.44.98.78 1.95.78 1.52 0 2.54-1.65 2.54-3.87 0-2.15-1.04-3.84-2.54-3.84zM28.24 5.57h4.13v14.44h-4.13V5.57zm0-4.7L32.37 0v3.36l-4.13.88V.88zm-4.32 9.35v9.79H19.8V5.57h3.7l.12 1.22c1-1.77 3.07-1.41 3.62-1.22v3.79c-.52-.17-2.29-.43-3.32.86zm-8.55 4.72c0 2.43 2.6 1.68 3.12 1.46v3.36c-.55.3-1.54.54-2.89.54a4.15 4.15 0 0 1-4.27-4.24l.01-13.17 4.02-.86v3.54h3.14V9.1h-3.13v5.85zm-4.91.7c0 2.97-2.31 4.66-5.73 4.66a11.2 11.2 0 0 1-4.46-.93v-3.93c1.38.75 3.1 1.31 4.46 1.31.92 0 1.53-.24 1.53-1C6.26 13.77 0 14.51 0 9.95 0 7.04 2.28 5.3 5.62 5.3c1.36 0 2.72.2 4.09.75v3.88a9.23 9.23 0 0 0-4.1-1.06c-.86 0-1.44.25-1.44.9 0 1.85 6.29.97 6.29 5.88z"
              ></path>
            </svg>
          </span>{" "}
          <span
            style={{
              fontSize: font13.fontSize,
              lineHeight: "24px",
              marginLeft: "5px",
            }}
            className={"soft-grey-dark-theme-text-variant-1 chirp-bold-font"}
          >
            |
          </span>{" "}
          <span
            style={{
              fontSize: font13.fontSize,
              lineHeight: "24px",
              marginLeft: "5px",
            }}
            className={"soft-grey-dark-theme-text-variant-1 chirp-bold-font"}
          >
            Privacy
          </span>
        </div>
      </Col>
      <Col
        xxl={9}
        xl={9}
        lg={8}
        md={8}
        sm={8}
        xs={8}
        style={{
          padding: "0px",
          margin: "0px",
        }}
      >
        {!cancelProcess ? (
          <div
            style={{
              padding: "100px 32px 0px 64px",
            }}
          >
            <div
              style={{
                fontSize: font15.fontSize,
                lineHeight: font15.lineHeight,
              }}
              className={
                "very-dark-gray-light-theme-text-variant-1 chirp-regular-font "
              }
            >
              CURRENT PLAN
            </div>
            <div
              className="mt-2"
              style={{
                borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
              }}
            ></div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{
                  fontSize: font15.fontSize,
                  lineHeight: font15.lineHeight,
                }}
                className={
                  "very-dark-gray-light-theme-text-variant-1 chirp-bold-font mt-2"
                }
              >
                Connectify Blue
              </div>
              <div
                onClick={() => setCancelProcess(true)}
                className={
                  "very-dark-gray-light-theme-text-variant-1 chirp-regular-font mt-2"
                }
                style={{
                  padding: "4px 8px",
                  width: "150px",
                  textAlign: "center",
                  border: "1px solid rgba(0, 0, 0, 0.1)",
                  cursor: "pointer",
                  fontSize: font15.fontSize,
                  lineHeight: "18px",
                }}
              >
                Cancel plan
              </div>
            </div>
            <div>
              <span
                style={{
                  fontSize: font15.fontSize,
                  lineHeight: "18px",
                }}
                className={
                  "very-dark-gray-light-theme-text-variant-2 chirp-regular-font "
                }
              >
                {subscription
                  ? subscription.subscriptionDetails.subscriptionPrice
                  : null}
              </span>{" "}
              <span
                style={{
                  fontSize: font15.fontSize,
                  lineHeight: "18px",
                }}
                className={
                  "very-dark-gray-light-theme-text-variant-2 chirp-regular-font "
                }
              >
                per
              </span>{" "}
              <span
                style={{
                  fontSize: font15.fontSize,
                  lineHeight: "18px",
                }}
                className={
                  "very-dark-gray-light-theme-text-variant-2 chirp-regular-font "
                }
              >
                {subscription ? (
                  <>
                    {subscription.subscriptionDetails.billingCycle ===
                    "Annual Plan"
                      ? "year"
                      : "month"}
                  </>
                ) : null}
              </span>
              <div>
                <span
                  style={{
                    fontSize: font13.fontSize,
                    lineHeight: "15px",
                  }}
                  className={
                    "very-dark-gray-light-theme-text-variant-2 chirp-regular-font "
                  }
                >
                  {subscription ? (
                    <>
                      {subscription.role}{" "}
                      {subscription.subscriptionDetails.premiumType}
                    </>
                  ) : null}
                </span>
              </div>
            </div>
            <div
              style={{
                fontSize: font14.fontSize,
                lineHeight: "18px",
              }}
              className={
                "very-dark-gray-light-theme-text-variant-2 chirp-regular-font mt-3"
              }
            >
              <span>Your plan renews on</span>{" "}
              <span>
                {subscription ? (
                  <>
                    {subscription.subscriptionDetails.billingCycle ===
                    "Annual Plan"
                      ? nextBillingDateForAnnualSub(subscription.createdAt)
                      : nextBillingDateForMonthlySub(subscription.createdAt)}
                  </>
                ) : null}
                .
              </span>
            </div>

            <div
              style={{
                fontSize: font15.fontSize,
                lineHeight: font15.lineHeight,
              }}
              className={
                "very-dark-gray-light-theme-text-variant-1 chirp-regular-font mt-5"
              }
            >
              PAYMENT METHODS
            </div>
            <div
              className="mt-2"
              style={{
                borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
              }}
            ></div>
            <div
              style={{
                fontSize: font14.fontSize,
                lineHeight: "18px",
              }}
              className={
                "very-dark-gray-light-theme-text-variant-2 chirp-regular-font mt-2"
              }
            >
              Stripe Test
            </div>
            <div
              style={{
                fontSize: font15.fontSize,
                lineHeight: font15.lineHeight,
              }}
              className={
                "very-dark-gray-light-theme-text-variant-1 chirp-regular-font mt-5"
              }
            >
              BILLING INFORMATION
            </div>
            <div
              className="mt-2"
              style={{
                borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
              }}
            ></div>
            <div
              style={{
                fontSize: font14.fontSize,
                lineHeight: "18px",
              }}
              className={
                "very-dark-gray-light-theme-text-variant-2 chirp-regular-font mt-3"
              }
            >
              Email
            </div>
            <div
              style={{
                fontSize: font14.fontSize,
                lineHeight: "18px",
              }}
              className={
                "very-dark-gray-light-theme-text-variant-2 chirp-regular-font mt-3"
              }
            >
              Billing address
            </div>
            <div
              style={{
                fontSize: font15.fontSize,
                lineHeight: font15.lineHeight,
              }}
              className={
                "very-dark-gray-light-theme-text-variant-1 chirp-regular-font mt-5"
              }
            >
              INVOICE HISTORY
            </div>
            <div
              className="mt-2"
              style={{
                borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
              }}
            ></div>
            <div
              className={
                "very-dark-gray-light-theme-text-variant-1 chirp-regular-font mt-2"
              }
              style={{
                fontSize: font14.fontSize,
                lineHeight: "18px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  maxWidth: "400px",
                  minWidth: "fit-content",
                }}
              >
                <span className="very-dark-gray-light-theme-text-variant-1 chirp-medium-font">
                  {formatDate(subscription?.createdAt)}
                </span>
                <span className="very-dark-gray-light-theme-text-variant-1 chirp-regular-font">
                  {subscription?.subscriptionDetails?.subscriptionPrice}
                </span>
                <span
                  className="chirp-bold-font"
                  style={{
                    fontSize: font11.fontSize,
                    lineHeight: font11.lineHeight,
                    borderRadius: "4px",
                    position: "relative",
                    bottom: "1px",
                    padding: "4px",
                    height: "20px",
                    backgroundColor: "#dcf8eb",
                    color: "rgb(0, 67, 41)",
                  }}
                >
                  <span>Paid</span>
                </span>
                <span className="very-dark-gray-light-theme-text-variant-1 chirp-regular-font">
                  Twitter Blue
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div
            style={{
              padding: "100px 32px 0px 64px",
            }}
          >
            <div
              style={{
                fontSize: font15.fontSize,
                lineHeight: "18px",
                display: "flex",
              }}
            >
              <div
                onClick={() => {
                  setCancelProcess(false);
                }}
                style={{
                  cursor: "pointer",
                }}
                className="chirp-regular-font very-dark-gray-light-theme-text-variant-1"
              >
                Billing
              </div>
              <span
                style={{
                  margin: "0px 10px",
                }}
              >
                <svg
                  width={`${1.25}em`}
                  height={`${1.25}em`}
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  class="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-14j79pv r-1q142lx r-2dysd3"
                >
                  <g>
                    <path d="M14.586 12L7.543 4.96l1.414-1.42L17.414 12l-8.457 8.46-1.414-1.42L14.586 12z"></path>
                  </g>
                </svg>
              </span>
              <div className="chirp-regular-font very-dark-gray-light-theme-text-variant-2">
                Cancel
              </div>
            </div>
            <div
              style={{
                fontSize: font31.fontSize,
                lineHeight: font31.lineHeight,
              }}
              className={
                "very-dark-gray-light-theme-text-variant-1 chirp-bold-font mt-5"
              }
            >
              Cancel your plan
            </div>
            <div
              style={{
                fontSize: font15.fontSize,
                lineHeight: font15.lineHeight,
              }}
              className={
                "very-dark-gray-light-theme-text-variant-1 chirp-regular-font mt-5"
              }
            >
              CURRENT PLAN
            </div>
            <div
              className="mt-2"
              style={{
                borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
              }}
            ></div>
            <div
              style={{
                fontSize: font18.fontSize,
                lineHeight: font18.lineHeight,
              }}
              className={
                "very-dark-gray-light-theme-text-variant-1 chirp-bold-font mt-3"
              }
            >
              Connectify Blue
            </div>
            <div>
              <span
                style={{
                  fontSize: font15.fontSize,
                  lineHeight: "18px",
                }}
                className={
                  "very-dark-gray-light-theme-text-variant-2 chirp-regular-font "
                }
              >
                {subscription
                  ? subscription.subscriptionDetails.subscriptionPrice
                  : null}
              </span>{" "}
              <span
                style={{
                  fontSize: font15.fontSize,
                  lineHeight: "18px",
                }}
                className={
                  "very-dark-gray-light-theme-text-variant-2 chirp-regular-font "
                }
              >
                per
              </span>{" "}
              <span
                style={{
                  fontSize: font15.fontSize,
                  lineHeight: "18px",
                }}
                className={
                  "very-dark-gray-light-theme-text-variant-2 chirp-regular-font "
                }
              >
                {subscription ? (
                  <>
                    {subscription.subscriptionDetails.billingCycle ===
                    "Annual Plan"
                      ? "year"
                      : "month"}
                  </>
                ) : null}
              </span>
              <div>
                <span
                  style={{
                    fontSize: font13.fontSize,
                    lineHeight: "15px",
                  }}
                  className={
                    "very-dark-gray-light-theme-text-variant-2 chirp-regular-font "
                  }
                >
                  {subscription ? (
                    <>
                      {subscription.role}{" "}
                      {subscription.subscriptionDetails.premiumType}
                    </>
                  ) : null}
                </span>
              </div>
            </div>
            <div
              style={{
                fontSize: font14.fontSize,
                lineHeight: "24px",
              }}
              className={
                "very-dark-gray-light-theme-text-variant-2 chirp-regular-font mt-3"
              }
            >
              Your plan will be cancelled, but is still available until the end
              of your billing period on{" "}
              <span>
                {subscription ? (
                  <>
                    {subscription.subscriptionDetails.billingCycle ===
                    "Annual Plan"
                      ? nextBillingDateForAnnualSub(subscription.createdAt)
                      : nextBillingDateForMonthlySub(subscription.createdAt)}
                  </>
                ) : null}
                .
              </span>
            </div>
            <div
              style={{
                fontSize: font14.fontSize,
                lineHeight: "24px",
              }}
              className={
                "very-dark-gray-light-theme-text-variant-2 chirp-regular-font mt-3"
              }
            >
              If you change your mind, you can renew your subscription.
            </div>
            <div
              style={{
                fontSize: font13.fontSize,
                lineHeight: "15px",
              }}
              className={
                "very-dark-gray-light-theme-text-variant-2 chirp-regular-font mt-5"
              }
            >
              By canceling your plan, you agree to Connectify, Inc's{" "}
              <span
                className={
                  "very-dark-gray-light-theme-text-variant-1 chirp-regular-font hover-fullname"
                }
              >
                Terms of Service
              </span>{" "}
              and{" "}
              <span
                className={
                  "very-dark-gray-light-theme-text-variant-1 chirp-regular-font hover-fullname"
                }
              >
                Privacy Policy
              </span>{" "}
              .
            </div>
            <div
              style={{
                width: "52.5%",
              }}
              className="mt-3"
            >
              <div>
                <button
                  onClick={handleCancelSubscription}
                  className={
                    "soft-grey-dark-theme-text-variant-1 chirp-bold-font"
                  }
                  style={{
                    backgroundColor: "#1C9BEE",
                    border: "none",
                    fontSize: font15.fontSize,
                    lineHeight: "18px",
                    padding: "12px",
                    borderRadius: "4px",
                    width: "100%",
                  }}
                >
                  {!cancelProcessStart ? (
                    <div>Cancel plan</div>
                  ) : (
                    <div>
                      <LoadingSpinner
                        isCheckoutProcess={true}
                        // strokeColor={"rgb(29, 155, 240)"}
                        strokeColor={"white"}
                      ></LoadingSpinner>
                    </div>
                  )}
                </button>
              </div>
              <div>
                {" "}
                <button
                  onClick={() => {
                    setCancelProcess(false);
                  }}
                  className={
                    "very-dark-gray-light-theme-text-variant-1 chirp-bold-font mt-3"
                  }
                  style={{
                    backgroundColor: "transparent",
                    border: "none",
                    fontSize: font15.fontSize,
                    lineHeight: "18px",
                    width: "100%",
                    border: "1px solid rgba(0, 0, 0, 0.1)",
                    padding: "12px",
                    borderRadius: "4px",
                  }}
                >
                  Go back
                </button>
              </div>
            </div>
          </div>
        )}
      </Col>
    </>
  );
}

export default BillingStripeSubscriptionMain;
