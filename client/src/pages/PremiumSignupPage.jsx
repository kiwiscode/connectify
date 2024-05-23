import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";
import { Button, Col, Container, Modal, Row } from "react-bootstrap";
import useWindowDimensions from "../hooks/getWindowDimensions";
import { useAntdMessageHandler } from "../utils/useAntdMessageHandler";
import LoadingSpinner from "../components/ui/LoadingSpinner";

function PremiumSignupPage({ sendToAppPlanPrice }) {
  const navigate = useNavigate();
  const [{ theme, themeName, activeFontSizeOption }] = useContext(ThemeContext);
  const { width } = useWindowDimensions();

  console.log("Width =>", width);

  const [selectedPremiumOption, setSelectedPremiumOption] = useState(
    "Annual plan basic-option"
  );

  const [clickedOptionIndex, setClickedOptionIndex] = useState(null);

  const [
    showSubscribeModalPremiumSignUpPage,
    setshowSubscribeModalPremiumSignUpPage,
  ] = useState(null);

  const [subscriptionModalShowed, setSubscriptionModalShowed] = useState(null);
  const handleCloseSubscribeAndPayModal = () => {
    setshowSubscribeModalPremiumSignUpPage(false);
    setSubscriptionModalShowed(false);
  };
  const getDataFromRightSideColum = (data) => {
    console.log("Data from child right side column component", data);
    setSubscriptionModalShowed(data);
  };

  const [premiumRole, setpremiumRole] = useState("Individual");
  const [premiumType, setpremiumType] = useState(null);
  const [planType, setplanType] = useState(null);
  const [planPrice, setplanPrice] = useState(null);

  useEffect(() => {
    setpremiumType(
      clickedOptionIndex === 0
        ? "Basic"
        : clickedOptionIndex === 1
        ? "Premium"
        : clickedOptionIndex === 2
        ? "Premium+"
        : null
    );
    setplanType(
      selectedPremiumOption === "Annual plan basic-option"
        ? "Annual Plan"
        : selectedPremiumOption === "Monthly plan basic-option"
        ? "Monthly Plan"
        : null
    );
    setplanPrice(
      clickedOptionIndex === 0 &&
        selectedPremiumOption === "Annual plan basic-option"
        ? "€38.08"
        : clickedOptionIndex === 1 &&
          selectedPremiumOption === "Annual plan basic-option"
        ? "€99.96"
        : clickedOptionIndex === 2 &&
          selectedPremiumOption === "Annual plan basic-option"
        ? "€199.92"
        : clickedOptionIndex === 0 &&
          selectedPremiumOption === "Monthly plan basic-option"
        ? "€3.57"
        : clickedOptionIndex === 1 &&
          selectedPremiumOption === "Monthly plan basic-option"
        ? "€9.52"
        : clickedOptionIndex === 2 &&
          selectedPremiumOption === "Monthly plan basic-option"
        ? "€19.04"
        : null
    );
  }, [clickedOptionIndex]);

  const { showCustomMessage, contextHolder, postSharedMessage } =
    useAntdMessageHandler();

  const [isPasswordCorrect, setIsPasswordCorrect] = useState(null);

  const isPasswordCorrectFromChildComponent = (data) => {
    console.log("Is password correct data from child =>", data);

    setIsPasswordCorrect(data);
  };
  console.log("Is password correct =>", isPasswordCorrect);

  // useEffect(() => {
  //   showCustomMessage("hehe", 4949);
  // });

  const [
    organizationSubscribeOptionClicked,
    setorganizationSubscribeOptionClicked,
  ] = useState(null);

  const handleRedirectOrganizationSignUpRoute = () => {
    navigate("/i/verified-orgs-signup");
  };

  const handleRedirectIndividualSignUpRoute = () => {
    navigate("/i/flow/subscription_eligibility_check");
  };
  const [subLoading, setSubLoading] = useState(null);

  const handlePremiumInfoDetailToUp = () => {
    sendToAppPlanPrice({
      premiumRole: "Individual",
      premiumType: premiumType || null,
      planType: planType || null,
      planPrice: planPrice || null,
    });
  };

  return (
    <>
      {width > 700 && (
        <Modal
          style={{
            padding: "0px",
            margin: "0px",
            zIndex: 99999,
          }}
          contentClassName={`premium_sign_up_page_subscription_modal-${themeName} `}
          className={subscriptionModalShowed ? "hide-me-modal" : null}
          backdropClassName={
            themeName === "dark-theme"
              ? `back-drop-${themeName}`
              : subscriptionModalShowed
              ? "hide-me-modal-fade"
              : null
          }
          show={showSubscribeModalPremiumSignUpPage}
          onHide={handleCloseSubscribeAndPayModal}
          centered
        >
          <div
            onClick={handleCloseSubscribeAndPayModal}
            style={{
              cursor: "pointer",
              padding: "12px",
            }}
          >
            <div
              className={
                themeName === "dark-theme"
                  ? `close-button-${themeName}`
                  : `close-button`
              }
              style={{
                display: "inline-flex",
                borderRadius: "50%",
              }}
            >
              <svg
                style={{
                  border: "none",
                  fontSize: "15px",
                  margin: "5px",
                }}
                onClick={handleCloseSubscribeAndPayModal}
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
          <Modal.Body>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                padding: "64px",
                position: "relative",
                bottom: "15px",
              }}
            >
              <div
                // className="mb-4"
                style={{
                  fontSize: "26px",
                  lineHeight: "32px",
                  fontWeight: "800",
                  color: themeName === "dark-theme" ? "white" : "black",
                  position: "relative",
                  bottom: "30px",
                }}
              >
                {selectedPremiumOption === "Annual plan basic-option" &&
                clickedOptionIndex === 0
                  ? "Basic"
                  : selectedPremiumOption === "Monthly plan basic-option" &&
                    clickedOptionIndex === 0
                  ? "Basic"
                  : selectedPremiumOption === "Annual plan basic-option" &&
                    clickedOptionIndex === 1
                  ? "Premium"
                  : selectedPremiumOption === "Monthly plan basic-option" &&
                    clickedOptionIndex === 1
                  ? "Premium"
                  : selectedPremiumOption === "Annual plan basic-option" &&
                    clickedOptionIndex === 2
                  ? "Premium+"
                  : selectedPremiumOption === "Monthly plan basic-option" &&
                    clickedOptionIndex === 2
                  ? "Premium+"
                  : null}
              </div>
              <div
                // className="mt-4"
                style={{
                  fontSize: "36px",
                  lineHeight: "36px",
                  fontWeight: "700",
                  color: themeName === "dark-theme" ? "white" : "black",
                }}
              >
                <span>
                  {" "}
                  {selectedPremiumOption === "Annual plan basic-option" &&
                  clickedOptionIndex === 0
                    ? "€38.08"
                    : selectedPremiumOption === "Monthly plan basic-option" &&
                      clickedOptionIndex === 0
                    ? "€3.57"
                    : selectedPremiumOption === "Annual plan basic-option" &&
                      clickedOptionIndex === 1
                    ? "€99.96"
                    : selectedPremiumOption === "Monthly plan basic-option" &&
                      clickedOptionIndex === 1
                    ? "€9.52"
                    : selectedPremiumOption === "Annual plan basic-option" &&
                      clickedOptionIndex === 2
                    ? "€199.92"
                    : selectedPremiumOption === "Monthly plan basic-option" &&
                      clickedOptionIndex === 2
                    ? "€19.04"
                    : null}
                </span>{" "}
                <span
                  style={{
                    color: themeName === "dark-theme" ? "#E6E9EA" : "#363B3F",
                    fontSize: "15px",
                    lineHeight: "20px",
                    fontWeight: "400",
                  }}
                >
                  {" "}
                  {selectedPremiumOption === "Annual plan basic-option" &&
                  clickedOptionIndex === 0
                    ? "/ year"
                    : selectedPremiumOption === "Monthly plan basic-option" &&
                      clickedOptionIndex === 0
                    ? "/ month"
                    : selectedPremiumOption === "Annual plan basic-option" &&
                      clickedOptionIndex === 1
                    ? "/ year"
                    : selectedPremiumOption === "Monthly plan basic-option" &&
                      clickedOptionIndex === 1
                    ? "/ month"
                    : selectedPremiumOption === "Annual plan basic-option" &&
                      clickedOptionIndex === 2
                    ? "/ year"
                    : selectedPremiumOption === "Monthly plan basic-option" &&
                      clickedOptionIndex === 2
                    ? "/ month"
                    : null}
                </span>
              </div>
              <div className="mt-1">
                <span
                  style={{
                    color: themeName === "dark-theme" ? "#E6E9EA" : "#363B3F",
                    fontSize: "15px",
                    lineHeight: "20px",
                    fontWeight: "400",
                  }}
                >
                  {selectedPremiumOption === "Annual plan basic-option" &&
                  clickedOptionIndex === 0
                    ? "Billed annually"
                    : selectedPremiumOption === "Monthly plan basic-option" &&
                      clickedOptionIndex === 0
                    ? "Billed monthly"
                    : selectedPremiumOption === "Annual plan basic-option" &&
                      clickedOptionIndex === 1
                    ? "Billed annually"
                    : selectedPremiumOption === "Monthly plan basic-option" &&
                      clickedOptionIndex === 1
                    ? "Billed monthly"
                    : selectedPremiumOption === "Annual plan basic-option" &&
                      clickedOptionIndex === 2
                    ? "Billed annually"
                    : selectedPremiumOption === "Monthly plan basic-option" &&
                      clickedOptionIndex === 2
                    ? "Billed monthly"
                    : null}{" "}
                </span>{" "}
                <span
                  style={{
                    backgroundColor:
                      themeName === "dark-theme" ? "#00251A" : "#DAF8EB",
                    color: themeName === "dark-theme" ? "#C1F1DC" : "#004329",
                    fontSize: "11px",
                    fontWeight: "700",
                    padding: "2px 4px",
                    borderRadius: "9999px",
                    position: "relative",
                    display:
                      selectedPremiumOption === "Monthly plan basic-option" &&
                      (clickedOptionIndex === 0 ||
                        clickedOptionIndex === 1 ||
                        clickedOptionIndex === 2)
                        ? "none"
                        : "inline-flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {selectedPremiumOption === "Annual plan basic-option" &&
                  clickedOptionIndex === 0
                    ? "SAVE 11%"
                    : selectedPremiumOption === "Annual plan basic-option" &&
                      clickedOptionIndex === 1
                    ? "SAVE 12%"
                    : selectedPremiumOption === "Annual plan basic-option" &&
                      clickedOptionIndex === 2
                    ? "SAVE 12%"
                    : null}
                </span>{" "}
              </div>
              <div
                style={{
                  position: "relative",
                  bottom: "8px",
                }}
                className="mt-5"
              >
                <Button
                  onClick={() => {
                    setSubLoading(true);

                    setTimeout(() => {
                      setSubLoading(false);
                      handleRedirectIndividualSignUpRoute();
                      handlePremiumInfoDetailToUp();
                    }, 500);
                  }}
                  className={
                    themeName === "dark-theme"
                      ? "premium_sign_up_page_subscribe_and_pay_btn_dark-theme"
                      : "premium_sign_up_page_subscribe_and_pay_btn_light-theme"
                  }
                  style={{
                    width: "100%",
                    height: "36px",
                    border: "none",
                    outlineStyle: "none",
                    color: themeName === "dark-theme" ? "#0F141A" : "#FFFFFF",
                    backgroundColor:
                      themeName === "dark-theme" ? "#EFF3F4" : "#0F141A",
                    opacity: subLoading ? "0.5" : "1",
                  }}
                >
                  {subLoading ? (
                    <div
                      style={{
                        fontSize: "15px",
                      }}
                    >
                      <LoadingSpinner
                        isCheckoutProcess={true}
                        strokeColor={"rgb(29, 155, 240)"}
                      ></LoadingSpinner>
                    </div>
                  ) : (
                    <div>Subscribe & Pay</div>
                  )}
                </Button>
              </div>
              <div
                style={{
                  border:
                    themeName !== "dark-theme"
                      ? "1px solid rgba(0, 0, 0, 0.1)"
                      : // : "0.1px solid rgb(70, 70, 70)",
                        "1px solid rgb(70, 70, 70)",
                  borderRadius: "8px",
                  position: "relative",
                  bottom: "10px",
                }}
                className="mt-3 mb-3"
              >
                <div
                  style={{
                    padding: "8px",
                    fontSize: "13px",
                    lineHeight: "16px",
                    fontWeight: "400",
                    color: themeName === "dark-theme" ? "#B6B9BC" : "#36434D",
                  }}
                >
                  By subscribing, you agree to our{" "}
                  <span
                    style={{
                      color: "#1C9BEF",
                    }}
                  >
                    Purchaser Terms of Service
                  </span>
                  . Subscriptions auto-renew until canceled, as described in the
                  Terms.{" "}
                  <span
                    style={{
                      color: "#1C9BEF",
                    }}
                  >
                    Cancel anytime
                  </span>
                  . Cancel at least 24 hours prior to renewal to avoid
                  additional charges. A verified phone number is required to
                  subscribe. If you've subscribed on another platform, manage
                  your subscription through that platform.
                </div>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      )}

      {width <= 700 && (
        <>
          {showSubscribeModalPremiumSignUpPage && (
            <Modal
              className={subscriptionModalShowed ? "hide-me-modal" : null}
              backdropClassName={
                themeName === "dark-theme"
                  ? `back-drop-${themeName}`
                  : subscriptionModalShowed
                  ? "hide-me-modal-fade"
                  : null
              }
              show={showSubscribeModalPremiumSignUpPage}
              onHide={handleCloseSubscribeAndPayModal}
              style={{
                overflowX: "hidden",
                overflowY: "hidden",
                padding: "0px !important",
                margin: "0px !important",
                zIndex: 9999999,
              }}
              dialogClassName="modal-body-sub-modal-premium_sign_up_page"
              contentClassName={`${themeName}-sub-basic-modal`}
            >
              <div
                onClick={handleCloseSubscribeAndPayModal}
                style={{
                  cursor: "pointer",
                  padding: "12px",
                  zIndex: -1,
                }}
              >
                <div
                  className={
                    themeName === "dark-theme"
                      ? `close-button-${themeName}`
                      : `close-button`
                  }
                  style={{
                    display: "inline-flex",
                    borderRadius: "50%",
                  }}
                >
                  <svg
                    style={{
                      border: "none",
                      fontSize: "15px",
                      margin: "5px",
                    }}
                    onClick={handleCloseSubscribeAndPayModal}
                    width={20}
                    height={20}
                    color={
                      themeName === "dark-theme" ? "white" : "rgb(15,20,25)"
                    }
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
              <Modal.Body>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    padding: "64px",
                    position: "relative",
                    bottom: "15px",
                  }}
                >
                  <div
                    // className="mb-4"
                    style={{
                      fontSize: "26px",
                      lineHeight: "32px",
                      fontWeight: "800",
                      color: themeName === "dark-theme" ? "white" : "black",
                      position: "relative",
                      bottom: "30px",
                    }}
                  >
                    {selectedPremiumOption === "Annual plan basic-option" &&
                    clickedOptionIndex === 0
                      ? "Basic"
                      : selectedPremiumOption === "Monthly plan basic-option" &&
                        clickedOptionIndex === 0
                      ? "Basic"
                      : selectedPremiumOption === "Annual plan basic-option" &&
                        clickedOptionIndex === 1
                      ? "Premium"
                      : selectedPremiumOption === "Monthly plan basic-option" &&
                        clickedOptionIndex === 1
                      ? "Premium"
                      : selectedPremiumOption === "Annual plan basic-option" &&
                        clickedOptionIndex === 2
                      ? "Premium+"
                      : selectedPremiumOption === "Monthly plan basic-option" &&
                        clickedOptionIndex === 2
                      ? "Premium+"
                      : null}
                  </div>
                  <div
                    // className="mt-4"
                    style={{
                      fontSize: "36px",
                      lineHeight: "36px",
                      fontWeight: "700",
                      color: themeName === "dark-theme" ? "white" : "black",
                    }}
                  >
                    <span>
                      {" "}
                      {selectedPremiumOption === "Annual plan basic-option" &&
                      clickedOptionIndex === 0
                        ? "€38.08"
                        : selectedPremiumOption ===
                            "Monthly plan basic-option" &&
                          clickedOptionIndex === 0
                        ? "€3.57"
                        : selectedPremiumOption ===
                            "Annual plan basic-option" &&
                          clickedOptionIndex === 1
                        ? "€99.96"
                        : selectedPremiumOption ===
                            "Monthly plan basic-option" &&
                          clickedOptionIndex === 1
                        ? "€9.52"
                        : selectedPremiumOption ===
                            "Annual plan basic-option" &&
                          clickedOptionIndex === 2
                        ? "€199.92"
                        : selectedPremiumOption ===
                            "Monthly plan basic-option" &&
                          clickedOptionIndex === 2
                        ? "€19.04"
                        : null}
                    </span>{" "}
                    <span
                      style={{
                        color:
                          themeName === "dark-theme" ? "#E6E9EA" : "#363B3F",
                        fontSize: "15px",
                        lineHeight: "20px",
                        fontWeight: "400",
                      }}
                    >
                      {" "}
                      {selectedPremiumOption === "Annual plan basic-option" &&
                      clickedOptionIndex === 0
                        ? "/ year"
                        : selectedPremiumOption ===
                            "Monthly plan basic-option" &&
                          clickedOptionIndex === 0
                        ? "/ month"
                        : selectedPremiumOption ===
                            "Annual plan basic-option" &&
                          clickedOptionIndex === 1
                        ? "/ year"
                        : selectedPremiumOption ===
                            "Monthly plan basic-option" &&
                          clickedOptionIndex === 1
                        ? "/ month"
                        : selectedPremiumOption ===
                            "Annual plan basic-option" &&
                          clickedOptionIndex === 2
                        ? "/ year"
                        : selectedPremiumOption ===
                            "Monthly plan basic-option" &&
                          clickedOptionIndex === 2
                        ? "/ month"
                        : null}
                    </span>
                  </div>
                  <div className="mt-1">
                    <span
                      style={{
                        color:
                          themeName === "dark-theme" ? "#E6E9EA" : "#363B3F",
                        fontSize: "15px",
                        lineHeight: "20px",
                        fontWeight: "400",
                      }}
                    >
                      {selectedPremiumOption === "Annual plan basic-option" &&
                      clickedOptionIndex === 0
                        ? "Billed annually"
                        : selectedPremiumOption ===
                            "Monthly plan basic-option" &&
                          clickedOptionIndex === 0
                        ? "Billed monthly"
                        : selectedPremiumOption ===
                            "Annual plan basic-option" &&
                          clickedOptionIndex === 1
                        ? "Billed annually"
                        : selectedPremiumOption ===
                            "Monthly plan basic-option" &&
                          clickedOptionIndex === 1
                        ? "Billed monthly"
                        : selectedPremiumOption ===
                            "Annual plan basic-option" &&
                          clickedOptionIndex === 2
                        ? "Billed annually"
                        : selectedPremiumOption ===
                            "Monthly plan basic-option" &&
                          clickedOptionIndex === 2
                        ? "Billed monthly"
                        : null}{" "}
                    </span>{" "}
                    <span
                      style={{
                        backgroundColor:
                          themeName === "dark-theme" ? "#00251A" : "#DAF8EB",
                        color:
                          themeName === "dark-theme" ? "#C1F1DC" : "#004329",
                        fontSize: "11px",
                        fontWeight: "700",
                        padding: "2px 4px",
                        borderRadius: "9999px",
                        position: "relative",
                        display:
                          selectedPremiumOption ===
                            "Monthly plan basic-option" &&
                          (clickedOptionIndex === 0 ||
                            clickedOptionIndex === 1 ||
                            clickedOptionIndex === 2)
                            ? "none"
                            : "inline-flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {selectedPremiumOption === "Annual plan basic-option" &&
                      clickedOptionIndex === 0
                        ? "SAVE 11%"
                        : selectedPremiumOption ===
                            "Annual plan basic-option" &&
                          clickedOptionIndex === 1
                        ? "SAVE 12%"
                        : selectedPremiumOption ===
                            "Annual plan basic-option" &&
                          clickedOptionIndex === 2
                        ? "SAVE 12%"
                        : null}
                    </span>{" "}
                  </div>
                  <div
                    style={{
                      position: "relative",
                      bottom: "8px",
                    }}
                    className="mt-5"
                  >
                    {" "}
                    <Button
                      onClick={() => {
                        setSubLoading(true);

                        setTimeout(() => {
                          setSubLoading(false);
                          handleRedirectIndividualSignUpRoute();
                          handlePremiumInfoDetailToUp();
                        }, 500);
                      }}
                      className={
                        themeName === "dark-theme"
                          ? "premium_sign_up_page_subscribe_and_pay_btn_dark-theme"
                          : "premium_sign_up_page_subscribe_and_pay_btn_light-theme"
                      }
                      style={{
                        width: "100%",
                        height: "36px",
                        border: "none",
                        outlineStyle: "none",
                        color:
                          themeName === "dark-theme" ? "#0F141A" : "#FFFFFF",
                        backgroundColor:
                          themeName === "dark-theme" ? "#EFF3F4" : "#0F141A",
                        opacity: subLoading ? "0.5" : "1",
                      }}
                    >
                      {subLoading ? (
                        <div
                          style={{
                            fontSize: "15px",
                          }}
                        >
                          <LoadingSpinner
                            isCheckoutProcess={true}
                            strokeColor={"rgb(29, 155, 240)"}
                          ></LoadingSpinner>
                        </div>
                      ) : (
                        <div>Subscribe & Pay</div>
                      )}
                    </Button>
                  </div>
                  <div
                    style={{
                      border:
                        themeName !== "dark-theme"
                          ? "1px solid rgba(0, 0, 0, 0.1)"
                          : // : "0.1px solid rgb(70, 70, 70)",
                            "1px solid rgb(70, 70, 70)",
                      borderRadius: "8px",
                      position: "relative",
                      bottom: "10px",
                    }}
                    className="mt-3 mb-3"
                  >
                    <div
                      style={{
                        padding: "8px",
                        fontSize: "13px",
                        lineHeight: "16px",
                        fontWeight: "400",
                        color:
                          themeName === "dark-theme" ? "#B6B9BC" : "#36434D",
                      }}
                    >
                      By subscribing, you agree to our{" "}
                      <span
                        style={{
                          color: "#1C9BEF",
                        }}
                      >
                        Purchaser Terms of Service
                      </span>
                      . Subscriptions auto-renew until canceled, as described in
                      the Terms.{" "}
                      <span
                        style={{
                          color: "#1C9BEF",
                        }}
                      >
                        Cancel anytime
                      </span>
                      . Cancel at least 24 hours prior to renewal to avoid
                      additional charges. A verified phone number is required to
                      subscribe. If you've subscribed on another platform,
                      manage your subscription through that platform.
                    </div>
                  </div>
                </div>
              </Modal.Body>
            </Modal>
          )}
        </>
      )}

      <Container
        fluid
        style={{
          overflowY: "auto",
          overflowX: "hidden",
          backgroundColor: themeName === "dark-theme" ? "black" : "white",
        }}
      >
        <Row>
          <Col
            style={{
              padding: "0px",
              margin: "0px",
            }}
            xl={1}
          >
            <div
              onClick={() => navigate("/home")}
              className={
                themeName === "dark-theme"
                  ? `close-btn-extra-premium-sign-up-dark-theme mt-4 ml-2`
                  : `close-btn-extra-premium-sign-up-light-theme mt-4 ml-2 `
              }
              style={{
                display: "inline-flex",
                borderRadius: "50%",
                cursor: "pointer",
                position: "relative",
                left: "10px",
                bottom: "5px",
                width: "36px",
                height: "36px",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <svg
                style={{
                  border: "none",
                  fontSize: "15px",
                  margin: "5px",
                  zIndex: 9999,
                }}
                width={20}
                height={20}
                color={themeName === "dark-theme" ? "#EFF3F4" : "rgb(15,20,25)"}
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
            <div
              className={
                themeName === "dark-theme"
                  ? "color-dark-theme"
                  : "color-light-theme"
              }
            ></div>
          </Col>
          <Col
            style={{
              zIndex: 9999,
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                marginTop: width < 600 ? "0px" : "75px",
              }}
              className="wrapper_premium_sign_up"
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                className="header_premium_sign_up"
              >
                <div
                  style={{
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      fontSize: width < 600 ? "48px" : "64px",
                      fontWeight: "700",
                      lineHeight: width < 600 ? "55px" : "70px",
                      color: themeName === "dark-theme" ? "white" : "black",
                      letterSpacing: "1.2px",
                      position: "relative",
                      bottom: "2px",
                    }}
                  >
                    Upgrade to Premium
                  </div>
                  <div
                    style={{
                      fontSize: "18px",
                      fontWeight: "400",
                      lineHeight: "24px",
                      color: themeName === "dark-theme" ? "#B5B9BD" : "#36444F",
                      maxWidth: "723px",
                      textAlign: width < 600 ? "center" : "left",
                      marginTop: "35px",
                    }}
                  >
                    <span>
                      Enjoy an enhanced experience, exclusive creator tools,
                      top-tier verification and security.
                    </span>
                    <div
                      style={{
                        textAlign: "center",
                      }}
                    >
                      (For organizations,{" "}
                      <span
                        onClick={() => {
                          handleRedirectOrganizationSignUpRoute();
                          setorganizationSubscribeOptionClicked(true);
                        }}
                        style={{
                          fontSize: "18px",
                          fontWeight: "700",
                          lineHeight: "24px",
                          color: themeName === "dark-theme" ? "white" : "black",
                          textDecoration: "underline",
                          cursor: "pointer",
                        }}
                      >
                        sign up here
                      </span>
                      )
                    </div>
                  </div>
                  <div
                    style={{
                      cursor: "pointer",
                      marginTop: "35px",
                      display: "inline-flex",
                    }}
                  >
                    <div
                      style={{
                        backgroundColor:
                          themeName === "dark-theme" ? "#202428" : "#EFF3F4",
                        display: "inline",
                        padding: "6px 4px",
                        borderRadius: "999px",
                      }}
                    >
                      <span
                        onClick={() => {
                          setSelectedPremiumOption("Annual plan basic-option");
                        }}
                        style={{
                          backgroundColor:
                            themeName === "dark-theme" &&
                            selectedPremiumOption === "Annual plan basic-option"
                              ? "black"
                              : themeName === "dark-theme" &&
                                selectedPremiumOption !==
                                  "Annual plan basic-option"
                              ? "#202327"
                              : themeName !== "dark-theme" &&
                                selectedPremiumOption ===
                                  "Annual plan basic-option"
                              ? "white"
                              : themeName !== "dark-theme" &&
                                selectedPremiumOption !==
                                  "Annual plan basic-option"
                              ? "#EEF3F4"
                              : null,
                          padding: "6px",
                          borderRadius: "9999px",
                          color: themeName === "dark-theme" ? "white" : "black",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "15px",
                            fontWeight: "700",
                            lineHeight: "24px",
                            color:
                              themeName === "dark-theme" ? "white" : "black",
                          }}
                        >
                          Annual
                        </span>{" "}
                        <span
                          style={{
                            backgroundColor:
                              themeName === "dark-theme"
                                ? "#00251A"
                                : "#DAF8EB",
                            color:
                              themeName === "dark-theme" ? "#C1F1DC" : "black",
                            fontSize: "11px",
                            fontWeight: "700",
                            padding: "2px 4px",
                            borderRadius: "999px",
                            position: "relative",
                            bottom: "1px",
                          }}
                        >
                          Best value
                        </span>
                      </span>
                      <span
                        onClick={() => {
                          setSelectedPremiumOption("Monthly plan basic-option");
                        }}
                        style={{
                          padding: "6px",
                          borderRadius: "999px",

                          backgroundColor:
                            themeName === "dark-theme" &&
                            selectedPremiumOption ===
                              "Monthly plan basic-option"
                              ? "black"
                              : themeName === "dark-theme" &&
                                selectedPremiumOption !==
                                  "Monthly plan basic-option"
                              ? "#202327"
                              : themeName !== "dark-theme" &&
                                selectedPremiumOption ===
                                  "Monthly plan basic-option"
                              ? "white"
                              : themeName !== "dark-theme" &&
                                selectedPremiumOption !==
                                  "Monthly plan basic-option"
                              ? "#EEF3F4"
                              : null,
                          fontSize: "15px",
                          fontWeight: "700",
                          lineHeight: "24px",
                          color: themeName === "dark-theme" ? "white" : "black",
                        }}
                      >
                        Monthly
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: width < 600 ? "column-reverse" : "row",
                  justifyContent: "center",
                  gap: "32px",
                }}
                className="options_wrapper mt-4"
              >
                <div
                  style={{
                    backgroundColor: "yellow",
                    minWidth: "315px",
                    maxWidth: width < 600 ? "" : "315px",
                    minHeight: "432px",
                    borderRadius: "12px",
                    padding: "32px",
                    width: width < 600 ? "95vw" : "",
                    marginBottom: "5%",
                    backgroundImage:
                      "linear-gradient(216.66deg, rgb(26, 29, 33) 2.89%, rgb(16, 16, 16) 97.26%), linear-gradient(rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.2) 100%)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      padding: "0px",
                      margin: "0px",
                    }}
                  >
                    <div
                      style={{
                        color: "white",
                        fontSize: "20px",
                        fontWeight: "400",
                        lineHeight: "24px",
                      }}
                    >
                      Basic
                    </div>
                    <div
                      className="mt-3"
                      style={{
                        color: "white",
                        fontSize: "36px",
                        fontWeight: "700",
                        lineHeight: "36px",
                      }}
                    >
                      {selectedPremiumOption === "Monthly plan basic-option"
                        ? "€3.57"
                        : selectedPremiumOption === "Annual plan basic-option"
                        ? "€3.17"
                        : null}{" "}
                      <span
                        style={{
                          color: "white",
                          fontSize: "15px",
                          fontWeight: "400",
                          lineHeight: "20px",
                        }}
                      >
                        / month
                      </span>
                    </div>
                    <div className="mt-2" style={{ color: "white" }}>
                      <span
                        style={{
                          color: "white",
                          fontSize: "15px",
                          fontWeight: "400",
                          lineHeight: "20px",
                        }}
                      >
                        {selectedPremiumOption === "Monthly plan basic-option"
                          ? "Billed monthly"
                          : selectedPremiumOption === "Annual plan basic-option"
                          ? `Billed annually`
                          : null}{" "}
                      </span>
                      {selectedPremiumOption === "Annual plan basic-option" && (
                        <span
                          style={{
                            backgroundColor:
                              themeName === "dark-theme"
                                ? "#00251A"
                                : "#DAF8EB",
                            color:
                              themeName === "dark-theme"
                                ? "#C1F1DC"
                                : "#004329",
                            fontSize: "11px",
                            fontWeight: "700",
                            padding: "2px 4px",
                            borderRadius: "9999px",
                            position: "relative",
                            display: "inline-flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          SAVE 11%
                        </span>
                      )}
                    </div>
                    <div className="mt-3">
                      <Button
                        onClick={() => {
                          setorganizationSubscribeOptionClicked(false);
                          setClickedOptionIndex(0);
                          setSubscriptionModalShowed(false);
                          setshowSubscribeModalPremiumSignUpPage(true);
                        }}
                        className="hover-sub-btn"
                        style={{
                          maxHeight: "36px",
                          backgroundColor: "#EFF3F4",
                          color: "black",
                          border: "none",
                          outlineStyle: "none",
                          maxWidth: width < 600 ? "" : "251px",
                          width: width < 600 ? "100%" : "",
                        }}
                      >
                        Subscribe
                      </Button>
                    </div>

                    <div
                      className="mt-3"
                      style={{
                        color: "white",
                        fontSize: "15px",
                        lineHeight: "20px",
                        fontWeight: "400",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "flex-end",
                        }}
                      >
                        <div>
                          <svg
                            height={`1.25em`}
                            width={`1.25em`}
                            fill="white"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                            className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-1gs4q39"
                          >
                            <g>
                              <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                            </g>
                          </svg>
                        </div>
                        <div
                          style={{
                            marginLeft: "5px",
                          }}
                        >
                          Small reply boost
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "flex-end",
                          marginTop: "5px",
                        }}
                      >
                        <div>
                          {" "}
                          <svg
                            height={`1.25em`}
                            width={`1.25em`}
                            fill="white"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                            className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-1gs4q39"
                          >
                            <g>
                              <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                            </g>
                          </svg>
                        </div>
                        <div
                          style={{
                            marginLeft: "5px",
                          }}
                        >
                          Encrypted direct messages
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "flex-end",
                          marginTop: "5px",
                        }}
                      >
                        <div>
                          {" "}
                          <svg
                            height={`1.25em`}
                            width={`1.25em`}
                            fill="white"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                            className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-1gs4q39"
                          >
                            <g>
                              <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                            </g>
                          </svg>
                        </div>
                        <div
                          style={{
                            marginLeft: "5px",
                          }}
                        >
                          Bookmark folders
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "flex-end",
                          marginTop: "5px",
                        }}
                      >
                        <div>
                          {" "}
                          <svg
                            height={`1.25em`}
                            width={`1.25em`}
                            fill="white"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                            className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-1gs4q39"
                          >
                            <g>
                              <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                            </g>
                          </svg>
                        </div>
                        <div
                          style={{
                            marginLeft: "5px",
                          }}
                        >
                          Highlights tab
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "flex-end",
                          marginTop: "5px",
                        }}
                      >
                        <div>
                          {" "}
                          <svg
                            height={`1.25em`}
                            width={`1.25em`}
                            fill="white"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                            className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-1gs4q39"
                          >
                            <g>
                              <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                            </g>
                          </svg>
                        </div>
                        <div
                          style={{
                            marginLeft: "5px",
                          }}
                        >
                          Edit post
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "flex-end",
                          marginTop: "5px",
                        }}
                      >
                        <div>
                          {" "}
                          <svg
                            height={`1.25em`}
                            width={`1.25em`}
                            fill="white"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                            className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-1gs4q39"
                          >
                            <g>
                              <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                            </g>
                          </svg>
                        </div>
                        <div
                          style={{
                            marginLeft: "5px",
                          }}
                        >
                          Post longer videos
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "flex-end",
                          marginTop: "5px",
                        }}
                      >
                        <div>
                          {" "}
                          <svg
                            height={`1.25em`}
                            width={`1.25em`}
                            fill="white"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                            className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-1gs4q39"
                          >
                            <g>
                              <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                            </g>
                          </svg>
                        </div>
                        <div
                          style={{
                            marginLeft: "5px",
                          }}
                        >
                          Hide your likes
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "flex-end",
                          marginTop: "5px",
                        }}
                      >
                        <div>
                          {" "}
                          <svg
                            height={`1.25em`}
                            width={`1.25em`}
                            fill="white"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                            className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-1gs4q39"
                          >
                            <g>
                              <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                            </g>
                          </svg>
                        </div>
                        <div
                          style={{
                            marginLeft: "5px",
                          }}
                        >
                          Longer posts
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    backgroundColor: "yellow",
                    minWidth: "315px",
                    maxWidth: width < 600 ? "" : "315px",
                    minHeight: "432px",
                    borderRadius: "12px",
                    padding: "32px",
                    width: width < 600 ? "100%" : "",
                    marginBottom: "5%",
                    backgroundImage:
                      "linear-gradient(216.66deg, rgb(26, 29, 33) 2.89%, rgb(16, 16, 16) 97.26%), linear-gradient(rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.2) 100%)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      padding: "0px",
                      margin: "0px",
                    }}
                  >
                    <div
                      style={{
                        color: "white",
                        fontSize: "20px",
                        fontWeight: "400",
                        lineHeight: "24px",
                      }}
                    >
                      Premium
                    </div>
                    <div
                      className="mt-3"
                      style={{
                        color: "white",
                        fontSize: "36px",
                        fontWeight: "700",
                        lineHeight: "36px",
                      }}
                    >
                      {selectedPremiumOption === "Monthly plan basic-option"
                        ? "€9.52"
                        : selectedPremiumOption === "Annual plan basic-option"
                        ? "€8.33"
                        : null}{" "}
                      <span
                        style={{
                          color: "white",
                          fontSize: "15px",
                          fontWeight: "400",
                          lineHeight: "20px",
                        }}
                      >
                        / month
                      </span>
                    </div>
                    <div className="mt-2" style={{ color: "white" }}>
                      <span
                        style={{
                          color: "white",
                          fontSize: "15px",
                          fontWeight: "400",
                          lineHeight: "20px",
                        }}
                      >
                        {selectedPremiumOption === "Monthly plan basic-option"
                          ? "Billed monthly"
                          : selectedPremiumOption === "Annual plan basic-option"
                          ? `Billed annually`
                          : null}{" "}
                      </span>
                      {selectedPremiumOption === "Annual plan basic-option" && (
                        <span
                          style={{
                            backgroundColor:
                              themeName === "dark-theme"
                                ? "#00251A"
                                : "#DAF8EB",
                            color:
                              themeName === "dark-theme"
                                ? "#C1F1DC"
                                : "#004329",

                            fontSize: "11px",
                            fontWeight: "700",
                            padding: "2px 4px",
                            borderRadius: "9999px",
                            position: "relative",
                            display: "inline-flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          SAVE 12%
                        </span>
                      )}
                    </div>
                    <div className="mt-3">
                      <Button
                        onClick={() => {
                          setorganizationSubscribeOptionClicked(false);
                          setClickedOptionIndex(1);
                          setSubscriptionModalShowed(false);
                          setshowSubscribeModalPremiumSignUpPage(true);
                        }}
                        className="hover-sub-btn"
                        style={{
                          maxHeight: "36px",
                          backgroundColor: "#EFF3F4",
                          color: "black",
                          border: "none",
                          outlineStyle: "none",
                          maxWidth: width < 600 ? "" : "251px",
                          width: width < 600 ? "100%" : "",
                        }}
                      >
                        Subscribe
                      </Button>
                    </div>
                    <div
                      className="mt-3"
                      style={{
                        color: "white",
                        fontWeight: "700",
                        fontSize: "15px",
                        lineHeight: " 20px",
                      }}
                    >
                      Everything in Basic, and
                    </div>
                    <div
                      className="mt-2"
                      style={{
                        color: "white",
                        fontSize: "15px",
                        lineHeight: "20px",
                        fontWeight: "400",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "flex-end",
                        }}
                      >
                        <div>
                          {" "}
                          <svg
                            height={`1.25em`}
                            width={`1.25em`}
                            fill="white"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                            className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-1gs4q39"
                          >
                            <g>
                              <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                            </g>
                          </svg>
                        </div>
                        <div
                          style={{
                            position: "relative",
                            left: "5px",
                          }}
                        >
                          Half Ads in For You and Following
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "flex-end",
                          marginTop: "5px",
                        }}
                      >
                        <div>
                          {" "}
                          <svg
                            height={`1.25em`}
                            width={`1.25em`}
                            fill="white"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                            className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-1gs4q39"
                          >
                            <g>
                              <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                            </g>
                          </svg>
                        </div>
                        <div
                          style={{
                            marginLeft: "5px",
                          }}
                        >
                          Larger reply boost
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "flex-end",
                          marginTop: "5px",
                        }}
                      >
                        <div>
                          {" "}
                          <svg
                            height={`1.25em`}
                            width={`1.25em`}
                            fill="white"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                            className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-1gs4q39"
                          >
                            <g>
                              <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                            </g>
                          </svg>
                        </div>
                        <div
                          style={{
                            marginLeft: "5px",
                          }}
                        >
                          Get paid to post
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "flex-end",
                          marginTop: "5px",
                        }}
                      >
                        <div>
                          {" "}
                          <svg
                            height={`1.25em`}
                            width={`1.25em`}
                            fill="white"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                            className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-1gs4q39"
                          >
                            <g>
                              <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                            </g>
                          </svg>
                        </div>
                        <div
                          style={{
                            marginLeft: "5px",
                          }}
                        >
                          Checkmark
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "flex-end",
                          marginTop: "5px",
                        }}
                      >
                        <div>
                          {" "}
                          <svg
                            height={`1.25em`}
                            width={`1.25em`}
                            fill="white"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                            className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-1gs4q39"
                          >
                            <g>
                              <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                            </g>
                          </svg>
                        </div>
                        <div
                          style={{
                            marginLeft: "5px",
                          }}
                        >
                          Grok Early Access
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "flex-end",
                          marginTop: "5px",
                        }}
                      >
                        <div>
                          {" "}
                          <svg
                            height={`1.25em`}
                            width={`1.25em`}
                            fill="white"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                            className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-1gs4q39"
                          >
                            <g>
                              <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                            </g>
                          </svg>
                        </div>
                        <div
                          style={{
                            marginLeft: "5px",
                          }}
                        >
                          X Pro, Analytics, Media Studio
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "flex-end",
                          marginTop: "5px",
                        }}
                      >
                        <div>
                          {" "}
                          <svg
                            height={`1.25em`}
                            width={`1.25em`}
                            fill="white"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                            className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-1gs4q39"
                          >
                            <g>
                              <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                            </g>
                          </svg>
                        </div>
                        <div
                          style={{
                            marginLeft: "5px",
                          }}
                        >
                          Creator Subscriptions
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    backgroundColor: "yellow",
                    minWidth: "315px",
                    maxWidth: width < 600 ? "" : "315px",
                    minHeight: "432px",
                    borderRadius: "12px",
                    padding: "32px",
                    width: width < 600 ? "100%" : "",
                    marginBottom: "5%",
                    backgroundImage:
                      "linear-gradient(216.66deg, rgb(29, 155, 240) 2.89%, rgb(0, 131, 235) 97.26%)",
                    boxShadow:
                      themeName === "dark-theme"
                        ? "rgba(67, 179, 246, 0.5) 0px 0px 250px 0px"
                        : "rgba(67, 179, 246, 0.5) 0px 0px 250px 0px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      padding: "0px",
                      margin: "0px",
                    }}
                  >
                    <div
                      style={{
                        color: "white",
                        fontSize: "20px",
                        fontWeight: "400",
                        lineHeight: "24px",
                      }}
                    >
                      Premium+
                    </div>
                    <div
                      className="mt-3"
                      style={{
                        color: "white",
                        fontSize: "36px",
                        fontWeight: "700",
                        lineHeight: "36px",
                      }}
                    >
                      {selectedPremiumOption === "Monthly plan basic-option"
                        ? "€19.04"
                        : selectedPremiumOption === "Annual plan basic-option"
                        ? "€16.66"
                        : null}{" "}
                      <span
                        style={{
                          color: "white",
                          fontSize: "15px",
                          fontWeight: "400",
                          lineHeight: "20px",
                        }}
                      >
                        / month
                      </span>
                    </div>
                    <div className="mt-2" style={{ color: "white" }}>
                      <span
                        style={{
                          color: "white",
                          fontSize: "15px",
                          fontWeight: "400",
                          lineHeight: "20px",
                        }}
                      >
                        {selectedPremiumOption === "Monthly plan basic-option"
                          ? "Billed monthly"
                          : selectedPremiumOption === "Annual plan basic-option"
                          ? `Billed annually`
                          : null}{" "}
                      </span>
                      {selectedPremiumOption === "Annual plan basic-option" && (
                        <span
                          style={{
                            backgroundColor:
                              themeName === "dark-theme"
                                ? "#DBF8EB"
                                : "#DAF8EB",
                            color:
                              themeName === "dark-theme"
                                ? "#004329 "
                                : "#004329",
                            fontSize: "11px",
                            fontWeight: "700",
                            padding: "2px 4px",
                            borderRadius: "9999px",
                            position: "relative",
                            display: "inline-flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          SAVE 12%
                        </span>
                      )}
                    </div>
                    <div className="mt-3">
                      <Button
                        onClick={() => {
                          setorganizationSubscribeOptionClicked(false);
                          setClickedOptionIndex(2);
                          setSubscriptionModalShowed(false);
                          setshowSubscribeModalPremiumSignUpPage(true);
                        }}
                        className="hover-sub-btn"
                        style={{
                          maxHeight: "36px",
                          backgroundColor: "#EFF3F4",
                          color: "black",
                          border: "none",
                          outlineStyle: "none",
                          maxWidth: width < 600 ? "" : "251px",
                          width: width < 600 ? "100%" : "",
                        }}
                      >
                        Subscribe
                      </Button>
                    </div>
                    <div
                      className="mt-3"
                      style={{
                        color: "white",
                        fontWeight: "700",
                        fontSize: "15px",
                        lineHeight: " 20px",
                      }}
                    >
                      Everything in Premium, and
                    </div>
                    <div
                      className="mt-2"
                      style={{
                        color: "white",
                        fontSize: "15px",
                        lineHeight: "20px",
                        fontWeight: "400",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "flex-end",
                        }}
                      >
                        <div>
                          {" "}
                          <svg
                            height={`1.25em`}
                            width={`1.25em`}
                            fill="white"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                            className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-1gs4q39"
                          >
                            <g>
                              <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                            </g>
                          </svg>
                        </div>
                        <div
                          style={{
                            marginLeft: "5px",
                          }}
                        >
                          No Ads in For You and Following
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "flex-end",
                          marginTop: "5px",
                        }}
                      >
                        <div>
                          {" "}
                          <svg
                            height={`1.25em`}
                            width={`1.25em`}
                            fill="white"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                            className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-1gs4q39"
                          >
                            <g>
                              <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                            </g>
                          </svg>
                        </div>
                        <div
                          style={{
                            marginLeft: "5px",
                          }}
                        >
                          Largest reply boost
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "flex-end",
                          marginTop: "5px",
                        }}
                      >
                        <div>
                          {" "}
                          <svg
                            height={`1.25em`}
                            width={`1.25em`}
                            fill="white"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                            className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-1gs4q39"
                          >
                            <g>
                              <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                            </g>
                          </svg>
                        </div>
                        <div
                          style={{
                            marginLeft: "5px",
                          }}
                        >
                          Write Articles
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              style={{
                paddingBottom: "128px",
                minWidth: "fit-content",
                width: "100%",
                display: "flex",
                justifyContent: width < 600 ? "flex-start" : "center",
              }}
              className="option_detail_header mt-5"
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: width < 600 ? "100%" : "81.5%",
                }}
              >
                <div
                  style={{
                    fontSize: "34px",
                    lineHeight: "40px",
                    fontWeight: "700",
                  }}
                >
                  Compare tiers & features
                </div>
                <div
                  className="table-divs mt-4"
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    color: themeName === "dark-theme" ? "white" : "#0F141A",
                    fontSize: "17px",
                    lineHeight: "20px",
                    fontWeight: "700",
                  }}
                >
                  <div style={{ width: "25%" }}>Enhanced Experience</div>
                  <div style={{ width: "25%" }}>Basic</div>
                  <div style={{ width: "25%" }}>Premium</div>
                  <div style={{ width: "25%" }}>Premium+</div>
                </div>
                <div
                  className="mt-2 mb-2"
                  style={{
                    borderBottom:
                      themeName !== "dark-theme"
                        ? "1px solid rgba(0, 0, 0, 0.1)"
                        : // : "0.1px solid rgb(70, 70, 70)",
                          "1px solid rgb(70, 70, 70)",
                  }}
                ></div>
                <div
                  className="table-divs"
                  style={{
                    display: "flex",
                    flexDirection: "row",
                  }}
                >
                  <div
                    style={{
                      width: "25%",
                      color: themeName === "dark-theme" ? "#B6B9BC" : "#36434D",
                      fontSize: "15px",
                      lineHeight: "20px",
                      fontWeight: "400px",
                    }}
                  >
                    Grok Early Access
                  </div>
                  <div style={{ width: "25%" }}></div>
                  <div style={{ width: "25%" }}>
                    {" "}
                    <svg
                      height={`1.25em`}
                      width={`1.25em`}
                      fill={themeName === "dark-theme" ? "white" : "black"}
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-1gs4q39"
                    >
                      <g>
                        <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                      </g>
                    </svg>
                  </div>
                  <div style={{ width: "25%" }}>
                    {" "}
                    <svg
                      height={`1.25em`}
                      width={`1.25em`}
                      fill={themeName === "dark-theme" ? "white" : "black"}
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-1gs4q39"
                    >
                      <g>
                        <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                      </g>
                    </svg>
                  </div>
                </div>
                <div
                  className="mt-2 mb-2"
                  style={{
                    borderBottom:
                      themeName !== "dark-theme"
                        ? "1px solid rgba(0, 0, 0, 0.1)"
                        : // : "0.1px solid rgb(70, 70, 70)",
                          "1px solid rgb(70, 70, 70)",
                  }}
                ></div>
                <div
                  className="table-divs"
                  style={{
                    display: "flex",
                    flexDirection: "row",
                  }}
                >
                  <div
                    style={{
                      width: "25%",
                      color: themeName === "dark-theme" ? "#B6B9BC" : "#36434D",

                      fontSize: "15px",
                      lineHeight: "20px",
                      fontWeight: "400px",
                    }}
                  >
                    <span>Ads in For You and Following</span>
                    <svg
                      height={`1em`}
                      width={`1em`}
                      style={{
                        position: "relative",
                        left: "5px",
                        bottom: "2px",
                      }}
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      fill={themeName === "dark-theme" ? "#B6B9BC" : "#36434D"}
                      className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-10ptun7 r-1janqcz r-1ion2gp r-1inkyih"
                    >
                      <g>
                        <path d="M13.5 8.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5S11.17 7 12 7s1.5.67 1.5 1.5zM13 17v-5h-2v5h2zm-1 5.25c5.66 0 10.25-4.59 10.25-10.25S17.66 1.75 12 1.75 1.75 6.34 1.75 12 6.34 22.25 12 22.25zM20.25 12c0 4.56-3.69 8.25-8.25 8.25S3.75 16.56 3.75 12 7.44 3.75 12 3.75s8.25 3.69 8.25 8.25z"></path>
                      </g>
                    </svg>
                  </div>
                  <div
                    style={{
                      width: "25%",
                      color: themeName === "dark-theme" ? "white" : "black",
                    }}
                  >
                    Full
                  </div>
                  <div
                    style={{
                      width: "25%",
                      color: themeName === "dark-theme" ? "white" : "black",
                    }}
                  >
                    Half
                  </div>
                  <div
                    style={{
                      width: "25%",
                      color: themeName === "dark-theme" ? "white" : "black",
                    }}
                  >
                    None
                  </div>
                </div>
                <div
                  className="mt-2 mb-2"
                  style={{
                    borderBottom:
                      themeName !== "dark-theme"
                        ? "1px solid rgba(0, 0, 0, 0.1)"
                        : // : "0.1px solid rgb(70, 70, 70)",
                          "1px solid rgb(70, 70, 70)",
                  }}
                ></div>
                <div
                  className="table-divs"
                  style={{
                    display: "flex",
                    flexDirection: "row",
                  }}
                >
                  <div
                    style={{
                      width: "25%",
                      color: themeName === "dark-theme" ? "#B6B9BC" : "#36434D",

                      fontSize: "15px",
                      lineHeight: "20px",
                      fontWeight: "400px",
                    }}
                  >
                    Reply boost
                  </div>
                  <div
                    style={{
                      width: "25%",
                      color: themeName === "dark-theme" ? "white" : "black",
                    }}
                  >
                    Smallest
                  </div>
                  <div
                    style={{
                      width: "25%",
                      color: themeName === "dark-theme" ? "white" : "black",
                    }}
                  >
                    Larger
                  </div>
                  <div
                    style={{
                      width: "25%",
                      color: themeName === "dark-theme" ? "white" : "black",
                    }}
                  >
                    Largest
                  </div>
                </div>
                <div
                  className="mt-2 mb-2"
                  style={{
                    borderBottom:
                      themeName !== "dark-theme"
                        ? "1px solid rgba(0, 0, 0, 0.1)"
                        : // : "0.1px solid rgb(70, 70, 70)",
                          "1px solid rgb(70, 70, 70)",
                  }}
                ></div>
                <div
                  className="table-divs"
                  style={{
                    display: "flex",
                    flexDirection: "row",
                  }}
                >
                  <div
                    style={{
                      width: "25%",
                      color: themeName === "dark-theme" ? "#B6B9BC" : "#36434D",

                      fontSize: "15px",
                      lineHeight: "20px",
                      fontWeight: "400px",
                    }}
                  >
                    {" "}
                    Edit post
                  </div>
                  <div style={{ width: "25%" }}>
                    {" "}
                    <svg
                      height={`1.25em`}
                      width={`1.25em`}
                      fill={themeName === "dark-theme" ? "white" : "black"}
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-1gs4q39"
                    >
                      <g>
                        <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                      </g>
                    </svg>
                  </div>
                  <div style={{ width: "25%" }}>
                    {" "}
                    <svg
                      height={`1.25em`}
                      width={`1.25em`}
                      fill={themeName === "dark-theme" ? "white" : "black"}
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-1gs4q39"
                    >
                      <g>
                        <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                      </g>
                    </svg>
                  </div>
                  <div style={{ width: "25%" }}>
                    {" "}
                    <svg
                      height={`1.25em`}
                      width={`1.25em`}
                      fill={themeName === "dark-theme" ? "white" : "black"}
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-1gs4q39"
                    >
                      <g>
                        <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                      </g>
                    </svg>
                  </div>
                </div>
                <div
                  className="mt-2 mb-2"
                  style={{
                    borderBottom:
                      themeName !== "dark-theme"
                        ? "1px solid rgba(0, 0, 0, 0.1)"
                        : // : "0.1px solid rgb(70, 70, 70)",
                          "1px solid rgb(70, 70, 70)",
                  }}
                ></div>
                <div
                  className="table-divs"
                  style={{
                    display: "flex",
                    flexDirection: "row",
                  }}
                >
                  <div
                    style={{
                      width: "25%",
                      color: themeName === "dark-theme" ? "#B6B9BC" : "#36434D",

                      fontSize: "15px",
                      lineHeight: "20px",
                      fontWeight: "400px",
                    }}
                  >
                    Longer posts
                  </div>
                  <div style={{ width: "25%" }}>
                    {" "}
                    <svg
                      height={`1.25em`}
                      width={`1.25em`}
                      fill={themeName === "dark-theme" ? "white" : "black"}
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-1gs4q39"
                    >
                      <g>
                        <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                      </g>
                    </svg>
                  </div>
                  <div style={{ width: "25%" }}>
                    {" "}
                    <svg
                      height={`1.25em`}
                      width={`1.25em`}
                      fill={themeName === "dark-theme" ? "white" : "black"}
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-1gs4q39"
                    >
                      <g>
                        <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                      </g>
                    </svg>
                  </div>
                  <div style={{ width: "25%" }}>
                    {" "}
                    <svg
                      height={`1.25em`}
                      width={`1.25em`}
                      fill={themeName === "dark-theme" ? "white" : "black"}
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-1gs4q39"
                    >
                      <g>
                        <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                      </g>
                    </svg>
                  </div>
                </div>
                <div
                  className="mt-2 mb-2"
                  style={{
                    borderBottom:
                      themeName !== "dark-theme"
                        ? "1px solid rgba(0, 0, 0, 0.1)"
                        : // : "0.1px solid rgb(70, 70, 70)",
                          "1px solid rgb(70, 70, 70)",
                  }}
                ></div>
                <div
                  className="table-divs"
                  style={{
                    display: "flex",
                    flexDirection: "row",
                  }}
                >
                  <div
                    style={{
                      width: "25%",
                      color: themeName === "dark-theme" ? "#B6B9BC" : "#36434D",

                      fontSize: "15px",
                      lineHeight: "20px",
                      fontWeight: "400px",
                    }}
                  >
                    Undo post
                  </div>
                  <div style={{ width: "25%" }}>
                    {" "}
                    <svg
                      height={`1.25em`}
                      width={`1.25em`}
                      fill={themeName === "dark-theme" ? "white" : "black"}
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-1gs4q39"
                    >
                      <g>
                        <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                      </g>
                    </svg>
                  </div>
                  <div style={{ width: "25%" }}>
                    {" "}
                    <svg
                      height={`1.25em`}
                      width={`1.25em`}
                      fill={themeName === "dark-theme" ? "white" : "black"}
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-1gs4q39"
                    >
                      <g>
                        <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                      </g>
                    </svg>
                  </div>
                  <div style={{ width: "25%" }}>
                    {" "}
                    <svg
                      height={`1.25em`}
                      width={`1.25em`}
                      fill={themeName === "dark-theme" ? "white" : "black"}
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-1gs4q39"
                    >
                      <g>
                        <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                      </g>
                    </svg>
                  </div>
                </div>
                <div
                  className="mt-2 mb-2"
                  style={{
                    borderBottom:
                      themeName !== "dark-theme"
                        ? "1px solid rgba(0, 0, 0, 0.1)"
                        : // : "0.1px solid rgb(70, 70, 70)",
                          "1px solid rgb(70, 70, 70)",
                  }}
                ></div>
                <div
                  className="table-divs"
                  style={{
                    display: "flex",
                    flexDirection: "row",
                  }}
                >
                  <div
                    style={{
                      width: "25%",
                      color: themeName === "dark-theme" ? "#B6B9BC" : "#36434D",

                      fontSize: "15px",
                      lineHeight: "20px",
                      fontWeight: "400px",
                    }}
                  >
                    Top Articles
                  </div>
                  <div style={{ width: "25%" }}>
                    {" "}
                    <svg
                      height={`1.25em`}
                      width={`1.25em`}
                      fill={themeName === "dark-theme" ? "white" : "black"}
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-1gs4q39"
                    >
                      <g>
                        <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                      </g>
                    </svg>
                  </div>
                  <div style={{ width: "25%" }}>
                    {" "}
                    <svg
                      height={`1.25em`}
                      width={`1.25em`}
                      fill={themeName === "dark-theme" ? "white" : "black"}
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-1gs4q39"
                    >
                      <g>
                        <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                      </g>
                    </svg>
                  </div>
                  <div style={{ width: "25%" }}>
                    {" "}
                    <svg
                      height={`1.25em`}
                      width={`1.25em`}
                      fill={themeName === "dark-theme" ? "white" : "black"}
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-1gs4q39"
                    >
                      <g>
                        <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                      </g>
                    </svg>
                  </div>
                </div>
                <div
                  className="mt-2 mb-2"
                  style={{
                    borderBottom:
                      themeName !== "dark-theme"
                        ? "1px solid rgba(0, 0, 0, 0.1)"
                        : // : "0.1px solid rgb(70, 70, 70)",
                          "1px solid rgb(70, 70, 70)",
                  }}
                ></div>
                <div
                  className="table-divs"
                  style={{
                    display: "flex",
                    flexDirection: "row",
                  }}
                >
                  <div
                    style={{
                      width: "25%",
                      color: themeName === "dark-theme" ? "#B6B9BC" : "#36434D",

                      fontSize: "15px",
                      lineHeight: "20px",
                      fontWeight: "400px",
                    }}
                  >
                    Background video playback
                  </div>
                  <div style={{ width: "25%" }}>
                    {" "}
                    <svg
                      height={`1.25em`}
                      width={`1.25em`}
                      fill={themeName === "dark-theme" ? "white" : "black"}
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-1gs4q39"
                    >
                      <g>
                        <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                      </g>
                    </svg>
                  </div>
                  <div style={{ width: "25%" }}>
                    {" "}
                    <svg
                      height={`1.25em`}
                      width={`1.25em`}
                      fill={themeName === "dark-theme" ? "white" : "black"}
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-1gs4q39"
                    >
                      <g>
                        <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                      </g>
                    </svg>
                  </div>
                  <div style={{ width: "25%" }}>
                    {" "}
                    <svg
                      height={`1.25em`}
                      width={`1.25em`}
                      fill={themeName === "dark-theme" ? "white" : "black"}
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-1gs4q39"
                    >
                      <g>
                        <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                      </g>
                    </svg>
                  </div>
                </div>
                <div
                  className="mt-2 mb-2"
                  style={{
                    borderBottom:
                      themeName !== "dark-theme"
                        ? "1px solid rgba(0, 0, 0, 0.1)"
                        : // : "0.1px solid rgb(70, 70, 70)",
                          "1px solid rgb(70, 70, 70)",
                  }}
                ></div>
                <div
                  className="table-divs"
                  style={{
                    display: "flex",
                    flexDirection: "row",
                  }}
                >
                  <div
                    style={{
                      width: "25%",
                      color: themeName === "dark-theme" ? "#B6B9BC" : "#36434D",

                      fontSize: "15px",
                      lineHeight: "20px",
                      fontWeight: "400px",
                    }}
                  >
                    Download videos
                  </div>
                  <div style={{ width: "25%" }}>
                    {" "}
                    <svg
                      height={`1.25em`}
                      width={`1.25em`}
                      fill={themeName === "dark-theme" ? "white" : "black"}
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-1gs4q39"
                    >
                      <g>
                        <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                      </g>
                    </svg>
                  </div>
                  <div style={{ width: "25%" }}>
                    {" "}
                    <svg
                      height={`1.25em`}
                      width={`1.25em`}
                      fill={themeName === "dark-theme" ? "white" : "black"}
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-1gs4q39"
                    >
                      <g>
                        <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                      </g>
                    </svg>
                  </div>
                  <div style={{ width: "25%" }}>
                    {" "}
                    <svg
                      height={`1.25em`}
                      width={`1.25em`}
                      fill={themeName === "dark-theme" ? "white" : "black"}
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-1gs4q39"
                    >
                      <g>
                        <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                      </g>
                    </svg>
                  </div>
                </div>
                <div
                  className="mt-2 mb-2"
                  style={{
                    borderBottom:
                      themeName !== "dark-theme"
                        ? "1px solid rgba(0, 0, 0, 0.1)"
                        : // : "0.1px solid rgb(70, 70, 70)",
                          "1px solid rgb(70, 70, 70)",
                  }}
                ></div>
                <div
                  className="table-divs mt-4"
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    color: themeName === "dark-theme" ? "white" : "#0F141A",
                    fontSize: "17px",
                    lineHeight: "20px",
                    fontWeight: "700",
                  }}
                >
                  <div style={{ width: "25%" }}>Creator Hub</div>
                  <div style={{ width: "25%" }}>Basic</div>
                  <div style={{ width: "25%" }}>Premium</div>
                  <div style={{ width: "25%" }}>Premium+</div>
                </div>
                <div
                  className="mt-2 mb-2"
                  style={{
                    borderBottom:
                      themeName !== "dark-theme"
                        ? "1px solid rgba(0, 0, 0, 0.1)"
                        : // : "0.1px solid rgb(70, 70, 70)",
                          "1px solid rgb(70, 70, 70)",
                  }}
                ></div>
                <div
                  className="table-divs"
                  style={{
                    display: "flex",
                    flexDirection: "row",
                  }}
                >
                  <div
                    style={{
                      width: "25%",
                      color: themeName === "dark-theme" ? "#B6B9BC" : "#36434D",

                      fontSize: "15px",
                      lineHeight: "20px",
                      fontWeight: "400px",
                    }}
                  >
                    <span>Write Articles</span>
                    <svg
                      height={`1em`}
                      width={`1em`}
                      style={{
                        position: "relative",
                        left: "5px",
                        bottom: "2px",
                      }}
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      fill={themeName === "dark-theme" ? "#B6B9BC" : "#36434D"}
                      className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-10ptun7 r-1janqcz r-1ion2gp r-1inkyih"
                    >
                      <g>
                        <path d="M13.5 8.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5S11.17 7 12 7s1.5.67 1.5 1.5zM13 17v-5h-2v5h2zm-1 5.25c5.66 0 10.25-4.59 10.25-10.25S17.66 1.75 12 1.75 1.75 6.34 1.75 12 6.34 22.25 12 22.25zM20.25 12c0 4.56-3.69 8.25-8.25 8.25S3.75 16.56 3.75 12 7.44 3.75 12 3.75s8.25 3.69 8.25 8.25z"></path>
                      </g>
                    </svg>
                  </div>
                  <div style={{ width: "25%" }}></div>
                  <div style={{ width: "25%" }}> </div>
                  <div style={{ width: "25%" }}>
                    {" "}
                    <svg
                      height={`1.25em`}
                      width={`1.25em`}
                      fill={themeName === "dark-theme" ? "white" : "black"}
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-1gs4q39"
                    >
                      <g>
                        <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                      </g>
                    </svg>
                  </div>
                </div>{" "}
                <div
                  className="mt-2 mb-2"
                  style={{
                    borderBottom:
                      themeName !== "dark-theme"
                        ? "1px solid rgba(0, 0, 0, 0.1)"
                        : // : "0.1px solid rgb(70, 70, 70)",
                          "1px solid rgb(70, 70, 70)",
                  }}
                ></div>
                <div
                  className="table-divs"
                  style={{
                    display: "flex",
                    flexDirection: "row",
                  }}
                >
                  <div
                    style={{
                      width: "25%",
                      color: themeName === "dark-theme" ? "#B6B9BC" : "#36434D",

                      fontSize: "15px",
                      lineHeight: "20px",
                      fontWeight: "400px",
                    }}
                  >
                    <span>Get paid to post</span>
                    <svg
                      height={`1em`}
                      width={`1em`}
                      style={{
                        position: "relative",
                        left: "5px",
                        bottom: "2px",
                      }}
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      fill={themeName === "dark-theme" ? "#B6B9BC" : "#36434D"}
                      className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-10ptun7 r-1janqcz r-1ion2gp r-1inkyih"
                    >
                      <g>
                        <path d="M13.5 8.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5S11.17 7 12 7s1.5.67 1.5 1.5zM13 17v-5h-2v5h2zm-1 5.25c5.66 0 10.25-4.59 10.25-10.25S17.66 1.75 12 1.75 1.75 6.34 1.75 12 6.34 22.25 12 22.25zM20.25 12c0 4.56-3.69 8.25-8.25 8.25S3.75 16.56 3.75 12 7.44 3.75 12 3.75s8.25 3.69 8.25 8.25z"></path>
                      </g>
                    </svg>
                  </div>
                  <div style={{ width: "25%" }}></div>
                  <div style={{ width: "25%" }}>
                    {" "}
                    <svg
                      height={`1.25em`}
                      width={`1.25em`}
                      fill={themeName === "dark-theme" ? "white" : "black"}
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-1gs4q39"
                    >
                      <g>
                        <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                      </g>
                    </svg>
                  </div>
                  <div style={{ width: "25%" }}>
                    {" "}
                    <svg
                      height={`1.25em`}
                      width={`1.25em`}
                      fill={themeName === "dark-theme" ? "white" : "black"}
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-1gs4q39"
                    >
                      <g>
                        <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                      </g>
                    </svg>
                  </div>
                </div>{" "}
                <div
                  className="mt-2 mb-2"
                  style={{
                    borderBottom:
                      themeName !== "dark-theme"
                        ? "1px solid rgba(0, 0, 0, 0.1)"
                        : // : "0.1px solid rgb(70, 70, 70)",
                          "1px solid rgb(70, 70, 70)",
                  }}
                ></div>
                <div
                  className="table-divs"
                  style={{
                    display: "flex",
                    flexDirection: "row",
                  }}
                >
                  <div
                    style={{
                      width: "25%",
                      color: themeName === "dark-theme" ? "#B6B9BC" : "#36434D",

                      fontSize: "15px",
                      lineHeight: "20px",
                      fontWeight: "400px",
                    }}
                  >
                    <span>Creator Subscriptions</span>
                    <svg
                      height={`1em`}
                      width={`1em`}
                      style={{
                        position: "relative",
                        left: "5px",
                        bottom: "2px",
                      }}
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      fill={themeName === "dark-theme" ? "#B6B9BC" : "#36434D"}
                      className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-10ptun7 r-1janqcz r-1ion2gp r-1inkyih"
                    >
                      <g>
                        <path d="M13.5 8.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5S11.17 7 12 7s1.5.67 1.5 1.5zM13 17v-5h-2v5h2zm-1 5.25c5.66 0 10.25-4.59 10.25-10.25S17.66 1.75 12 1.75 1.75 6.34 1.75 12 6.34 22.25 12 22.25zM20.25 12c0 4.56-3.69 8.25-8.25 8.25S3.75 16.56 3.75 12 7.44 3.75 12 3.75s8.25 3.69 8.25 8.25z"></path>
                      </g>
                    </svg>
                  </div>
                  <div style={{ width: "25%" }}></div>
                  <div style={{ width: "25%" }}>
                    {" "}
                    <svg
                      height={`1.25em`}
                      width={`1.25em`}
                      fill={themeName === "dark-theme" ? "white" : "black"}
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-1gs4q39"
                    >
                      <g>
                        <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                      </g>
                    </svg>
                  </div>
                  <div style={{ width: "25%" }}>
                    {" "}
                    <svg
                      height={`1.25em`}
                      width={`1.25em`}
                      fill={themeName === "dark-theme" ? "white" : "black"}
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-1gs4q39"
                    >
                      <g>
                        <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                      </g>
                    </svg>
                  </div>
                </div>{" "}
                <div
                  className="mt-2 mb-2"
                  style={{
                    borderBottom:
                      themeName !== "dark-theme"
                        ? "1px solid rgba(0, 0, 0, 0.1)"
                        : // : "0.1px solid rgb(70, 70, 70)",
                          "1px solid rgb(70, 70, 70)",
                  }}
                ></div>
                <div
                  className="table-divs"
                  style={{
                    display: "flex",
                    flexDirection: "row",
                  }}
                >
                  <div
                    style={{
                      width: "25%",
                      color: themeName === "dark-theme" ? "#B6B9BC" : "#36434D",

                      fontSize: "15px",
                      lineHeight: "20px",
                      fontWeight: "400px",
                    }}
                  >
                    <span>C Pro</span>
                    <svg
                      height={`1em`}
                      width={`1em`}
                      style={{
                        position: "relative",
                        left: "5px",
                        bottom: "2px",
                      }}
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      fill={themeName === "dark-theme" ? "#B6B9BC" : "#36434D"}
                      className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-10ptun7 r-1janqcz r-1ion2gp r-1inkyih"
                    >
                      <g>
                        <path d="M13.5 8.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5S11.17 7 12 7s1.5.67 1.5 1.5zM13 17v-5h-2v5h2zm-1 5.25c5.66 0 10.25-4.59 10.25-10.25S17.66 1.75 12 1.75 1.75 6.34 1.75 12 6.34 22.25 12 22.25zM20.25 12c0 4.56-3.69 8.25-8.25 8.25S3.75 16.56 3.75 12 7.44 3.75 12 3.75s8.25 3.69 8.25 8.25z"></path>
                      </g>
                    </svg>
                  </div>
                  <div style={{ width: "25%" }}></div>
                  <div style={{ width: "25%" }}>
                    {" "}
                    <svg
                      height={`1.25em`}
                      width={`1.25em`}
                      fill={themeName === "dark-theme" ? "white" : "black"}
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-1gs4q39"
                    >
                      <g>
                        <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                      </g>
                    </svg>
                  </div>
                  <div style={{ width: "25%" }}>
                    {" "}
                    <svg
                      height={`1.25em`}
                      width={`1.25em`}
                      fill={themeName === "dark-theme" ? "white" : "black"}
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-1gs4q39"
                    >
                      <g>
                        <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                      </g>
                    </svg>
                  </div>
                </div>{" "}
                <div
                  className="mt-2 mb-2"
                  style={{
                    borderBottom:
                      themeName !== "dark-theme"
                        ? "1px solid rgba(0, 0, 0, 0.1)"
                        : // : "0.1px solid rgb(70, 70, 70)",
                          "1px solid rgb(70, 70, 70)",
                  }}
                ></div>
                <div
                  className="table-divs"
                  style={{
                    display: "flex",
                    flexDirection: "row",
                  }}
                >
                  <div
                    style={{
                      width: "25%",
                      color: themeName === "dark-theme" ? "#B6B9BC" : "#36434D",

                      fontSize: "15px",
                      lineHeight: "20px",
                      fontWeight: "400px",
                    }}
                  >
                    <span>Media Studio</span>
                    <svg
                      height={`1em`}
                      width={`1em`}
                      style={{
                        position: "relative",
                        left: "5px",
                        bottom: "2px",
                      }}
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      fill={themeName === "dark-theme" ? "#B6B9BC" : "#36434D"}
                      className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-10ptun7 r-1janqcz r-1ion2gp r-1inkyih"
                    >
                      <g>
                        <path d="M13.5 8.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5S11.17 7 12 7s1.5.67 1.5 1.5zM13 17v-5h-2v5h2zm-1 5.25c5.66 0 10.25-4.59 10.25-10.25S17.66 1.75 12 1.75 1.75 6.34 1.75 12 6.34 22.25 12 22.25zM20.25 12c0 4.56-3.69 8.25-8.25 8.25S3.75 16.56 3.75 12 7.44 3.75 12 3.75s8.25 3.69 8.25 8.25z"></path>
                      </g>
                    </svg>
                  </div>
                  <div style={{ width: "25%" }}></div>
                  <div style={{ width: "25%" }}>
                    {" "}
                    <svg
                      height={`1.25em`}
                      width={`1.25em`}
                      fill={themeName === "dark-theme" ? "white" : "black"}
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-1gs4q39"
                    >
                      <g>
                        <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                      </g>
                    </svg>
                  </div>
                  <div style={{ width: "25%" }}>
                    {" "}
                    <svg
                      height={`1.25em`}
                      width={`1.25em`}
                      fill={themeName === "dark-theme" ? "white" : "black"}
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-1gs4q39"
                    >
                      <g>
                        <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                      </g>
                    </svg>
                  </div>
                </div>{" "}
                <div
                  className="mt-2 mb-2"
                  style={{
                    borderBottom:
                      themeName !== "dark-theme"
                        ? "1px solid rgba(0, 0, 0, 0.1)"
                        : // : "0.1px solid rgb(70, 70, 70)",
                          "1px solid rgb(70, 70, 70)",
                  }}
                ></div>
                <div
                  className="table-divs"
                  style={{
                    display: "flex",
                    flexDirection: "row",
                  }}
                >
                  <div
                    style={{
                      width: "25%",
                      color: themeName === "dark-theme" ? "#B6B9BC" : "#36434D",

                      fontSize: "15px",
                      lineHeight: "20px",
                      fontWeight: "400px",
                    }}
                  >
                    <span>Analytics</span>
                    <svg
                      height={`1em`}
                      width={`1em`}
                      style={{
                        position: "relative",
                        left: "5px",
                        bottom: "2px",
                      }}
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      fill={themeName === "dark-theme" ? "#B6B9BC" : "#36434D"}
                      className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-10ptun7 r-1janqcz r-1ion2gp r-1inkyih"
                    >
                      <g>
                        <path d="M13.5 8.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5S11.17 7 12 7s1.5.67 1.5 1.5zM13 17v-5h-2v5h2zm-1 5.25c5.66 0 10.25-4.59 10.25-10.25S17.66 1.75 12 1.75 1.75 6.34 1.75 12 6.34 22.25 12 22.25zM20.25 12c0 4.56-3.69 8.25-8.25 8.25S3.75 16.56 3.75 12 7.44 3.75 12 3.75s8.25 3.69 8.25 8.25z"></path>
                      </g>
                    </svg>
                  </div>
                  <div style={{ width: "25%" }}></div>
                  <div style={{ width: "25%" }}>
                    {" "}
                    <svg
                      height={`1.25em`}
                      width={`1.25em`}
                      fill={themeName === "dark-theme" ? "white" : "black"}
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-1gs4q39"
                    >
                      <g>
                        <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                      </g>
                    </svg>
                  </div>
                  <div style={{ width: "25%" }}>
                    {" "}
                    <svg
                      height={`1.25em`}
                      width={`1.25em`}
                      fill={themeName === "dark-theme" ? "white" : "black"}
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-1gs4q39"
                    >
                      <g>
                        <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                      </g>
                    </svg>
                  </div>
                </div>{" "}
                <div
                  className="mt-2 mb-2"
                  style={{
                    borderBottom:
                      themeName !== "dark-theme"
                        ? "1px solid rgba(0, 0, 0, 0.1)"
                        : // : "0.1px solid rgb(70, 70, 70)",
                          "1px solid rgb(70, 70, 70)",
                  }}
                ></div>
                <div
                  className="table-divs"
                  style={{
                    display: "flex",
                    flexDirection: "row",
                  }}
                >
                  <div
                    style={{
                      width: "25%",
                      color: themeName === "dark-theme" ? "#B6B9BC" : "#36434D",

                      fontSize: "15px",
                      lineHeight: "20px",
                      fontWeight: "400px",
                    }}
                  >
                    <span>Post longer videos</span>
                  </div>
                  <div style={{ width: "25%" }}>
                    {" "}
                    <svg
                      height={`1.25em`}
                      width={`1.25em`}
                      fill={themeName === "dark-theme" ? "white" : "black"}
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-1gs4q39"
                    >
                      <g>
                        <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                      </g>
                    </svg>
                  </div>
                  <div style={{ width: "25%" }}>
                    {" "}
                    <svg
                      height={`1.25em`}
                      width={`1.25em`}
                      fill={themeName === "dark-theme" ? "white" : "black"}
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-1gs4q39"
                    >
                      <g>
                        <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                      </g>
                    </svg>
                  </div>
                  <div style={{ width: "25%" }}>
                    {" "}
                    <svg
                      height={`1.25em`}
                      width={`1.25em`}
                      fill={themeName === "dark-theme" ? "white" : "black"}
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-1gs4q39"
                    >
                      <g>
                        <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                      </g>
                    </svg>
                  </div>
                </div>
                <div
                  className="mt-2 mb-2"
                  style={{
                    borderBottom:
                      themeName !== "dark-theme"
                        ? "1px solid rgba(0, 0, 0, 0.1)"
                        : // : "0.1px solid rgb(70, 70, 70)",
                          "1px solid rgb(70, 70, 70)",
                  }}
                ></div>
                <div
                  className="table-divs mt-4"
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    color: themeName === "dark-theme" ? "white" : "#0F141A",
                    fontSize: "17px",
                    lineHeight: "20px",
                    fontWeight: "700",
                  }}
                >
                  <div style={{ width: "25%" }}>Verification & Security</div>
                  <div style={{ width: "25%" }}>Basic</div>
                  <div style={{ width: "25%" }}>Premium</div>
                  <div style={{ width: "25%" }}>Premium+</div>
                </div>
                <div
                  className="mt-2 mb-2"
                  style={{
                    borderBottom:
                      themeName !== "dark-theme"
                        ? "1px solid rgba(0, 0, 0, 0.1)"
                        : // : "0.1px solid rgb(70, 70, 70)",
                          "1px solid rgb(70, 70, 70)",
                  }}
                ></div>
                <div
                  className="table-divs"
                  style={{
                    display: "flex",
                    flexDirection: "row",
                  }}
                >
                  <div
                    style={{
                      width: "25%",
                      color: themeName === "dark-theme" ? "#B6B9BC" : "#36434D",

                      fontSize: "15px",
                      lineHeight: "20px",
                      fontWeight: "400px",
                    }}
                  >
                    <span>Checkmark</span>
                    <svg
                      height={`1em`}
                      width={`1em`}
                      style={{
                        position: "relative",
                        left: "5px",
                        bottom: "2px",
                      }}
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      fill={themeName === "dark-theme" ? "#B6B9BC" : "#36434D"}
                      className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-10ptun7 r-1janqcz r-1ion2gp r-1inkyih"
                    >
                      <g>
                        <path d="M13.5 8.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5S11.17 7 12 7s1.5.67 1.5 1.5zM13 17v-5h-2v5h2zm-1 5.25c5.66 0 10.25-4.59 10.25-10.25S17.66 1.75 12 1.75 1.75 6.34 1.75 12 6.34 22.25 12 22.25zM20.25 12c0 4.56-3.69 8.25-8.25 8.25S3.75 16.56 3.75 12 7.44 3.75 12 3.75s8.25 3.69 8.25 8.25z"></path>
                      </g>
                    </svg>
                  </div>
                  <div style={{ width: "25%" }}></div>
                  <div style={{ width: "25%" }}>
                    <svg
                      height={`1.25em`}
                      width={`1.25em`}
                      fill={themeName === "dark-theme" ? "white" : "black"}
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-1gs4q39"
                    >
                      <g>
                        <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                      </g>
                    </svg>{" "}
                  </div>
                  <div style={{ width: "25%" }}>
                    {" "}
                    <svg
                      height={`1.25em`}
                      width={`1.25em`}
                      fill={themeName === "dark-theme" ? "white" : "black"}
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-1gs4q39"
                    >
                      <g>
                        <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                      </g>
                    </svg>
                  </div>
                </div>{" "}
                <div
                  className="mt-2 mb-2"
                  style={{
                    borderBottom:
                      themeName !== "dark-theme"
                        ? "1px solid rgba(0, 0, 0, 0.1)"
                        : // : "0.1px solid rgb(70, 70, 70)",
                          "1px solid rgb(70, 70, 70)",
                  }}
                ></div>
                <div
                  className="table-divs"
                  style={{
                    display: "flex",
                    flexDirection: "row",
                  }}
                >
                  <div
                    style={{
                      width: "25%",
                      color: themeName === "dark-theme" ? "#B6B9BC" : "#36434D",

                      fontSize: "15px",
                      lineHeight: "20px",
                      fontWeight: "400px",
                    }}
                  >
                    <span>Optional ID verification</span>
                    <svg
                      height={`1em`}
                      width={`1em`}
                      style={{
                        position: "relative",
                        left: "5px",
                        bottom: "2px",
                      }}
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      fill={themeName === "dark-theme" ? "#B6B9BC" : "#36434D"}
                      className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-10ptun7 r-1janqcz r-1ion2gp r-1inkyih"
                    >
                      <g>
                        <path d="M13.5 8.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5S11.17 7 12 7s1.5.67 1.5 1.5zM13 17v-5h-2v5h2zm-1 5.25c5.66 0 10.25-4.59 10.25-10.25S17.66 1.75 12 1.75 1.75 6.34 1.75 12 6.34 22.25 12 22.25zM20.25 12c0 4.56-3.69 8.25-8.25 8.25S3.75 16.56 3.75 12 7.44 3.75 12 3.75s8.25 3.69 8.25 8.25z"></path>
                      </g>
                    </svg>
                  </div>
                  <div style={{ width: "25%" }}></div>
                  <div style={{ width: "25%" }}>
                    <svg
                      height={`1.25em`}
                      width={`1.25em`}
                      fill={themeName === "dark-theme" ? "white" : "black"}
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-1gs4q39"
                    >
                      <g>
                        <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                      </g>
                    </svg>{" "}
                  </div>
                  <div style={{ width: "25%" }}>
                    {" "}
                    <svg
                      height={`1.25em`}
                      width={`1.25em`}
                      fill={themeName === "dark-theme" ? "white" : "black"}
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-1gs4q39"
                    >
                      <g>
                        <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                      </g>
                    </svg>
                  </div>
                </div>{" "}
                <div
                  className="mt-2 mb-2"
                  style={{
                    borderBottom:
                      themeName !== "dark-theme"
                        ? "1px solid rgba(0, 0, 0, 0.1)"
                        : // : "0.1px solid rgb(70, 70, 70)",
                          "1px solid rgb(70, 70, 70)",
                  }}
                ></div>
                <div
                  className="table-divs"
                  style={{
                    display: "flex",
                    flexDirection: "row",
                  }}
                >
                  <div
                    style={{
                      width: "25%",
                      color: themeName === "dark-theme" ? "#B6B9BC" : "#36434D",

                      fontSize: "15px",
                      lineHeight: "20px",
                      fontWeight: "400px",
                    }}
                  >
                    <span>Encrypted direct messages</span>
                    <svg
                      height={`1em`}
                      width={`1em`}
                      style={{
                        position: "relative",
                        left: "5px",
                        bottom: "2px",
                      }}
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      fill={themeName === "dark-theme" ? "#B6B9BC" : "#36434D"}
                      className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-10ptun7 r-1janqcz r-1ion2gp r-1inkyih"
                    >
                      <g>
                        <path d="M13.5 8.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5S11.17 7 12 7s1.5.67 1.5 1.5zM13 17v-5h-2v5h2zm-1 5.25c5.66 0 10.25-4.59 10.25-10.25S17.66 1.75 12 1.75 1.75 6.34 1.75 12 6.34 22.25 12 22.25zM20.25 12c0 4.56-3.69 8.25-8.25 8.25S3.75 16.56 3.75 12 7.44 3.75 12 3.75s8.25 3.69 8.25 8.25z"></path>
                      </g>
                    </svg>
                  </div>
                  <div style={{ width: "25%" }}>
                    {" "}
                    <svg
                      height={`1.25em`}
                      width={`1.25em`}
                      fill={themeName === "dark-theme" ? "white" : "black"}
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-1gs4q39"
                    >
                      <g>
                        <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                      </g>
                    </svg>
                  </div>
                  <div style={{ width: "25%" }}>
                    <svg
                      height={`1.25em`}
                      width={`1.25em`}
                      fill={themeName === "dark-theme" ? "white" : "black"}
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-1gs4q39"
                    >
                      <g>
                        <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                      </g>
                    </svg>{" "}
                  </div>
                  <div style={{ width: "25%" }}>
                    {" "}
                    <svg
                      height={`1.25em`}
                      width={`1.25em`}
                      fill={themeName === "dark-theme" ? "white" : "black"}
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-1gs4q39"
                    >
                      <g>
                        <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                      </g>
                    </svg>
                  </div>
                </div>{" "}
                <div
                  className="mt-2 mb-2"
                  style={{
                    borderBottom:
                      themeName !== "dark-theme"
                        ? "1px solid rgba(0, 0, 0, 0.1)"
                        : // : "0.1px solid rgb(70, 70, 70)",
                          "1px solid rgb(70, 70, 70)",
                  }}
                ></div>
                <div
                  className="table-divs mt-4"
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    color: themeName === "dark-theme" ? "white" : "#0F141A",
                    fontSize: "17px",
                    lineHeight: "20px",
                    fontWeight: "700",
                  }}
                >
                  <div style={{ width: "25%" }}>Customization</div>
                  <div style={{ width: "25%" }}>Basic</div>
                  <div style={{ width: "25%" }}>Premium</div>
                  <div style={{ width: "25%" }}>Premium+</div>
                </div>
                <div
                  className="mt-2 mb-2"
                  style={{
                    borderBottom:
                      themeName !== "dark-theme"
                        ? "1px solid rgba(0, 0, 0, 0.1)"
                        : // : "0.1px solid rgb(70, 70, 70)",
                          "1px solid rgb(70, 70, 70)",
                  }}
                ></div>
                <div
                  className="table-divs"
                  style={{
                    display: "flex",
                    flexDirection: "row",
                  }}
                >
                  <div
                    style={{
                      width: "25%",
                      color: themeName === "dark-theme" ? "#B6B9BC" : "#36434D",

                      fontSize: "15px",
                      lineHeight: "20px",
                      fontWeight: "400px",
                    }}
                  >
                    <span>Highlights Tab</span>
                    <svg
                      height={`1em`}
                      width={`1em`}
                      style={{
                        position: "relative",
                        left: "5px",
                        bottom: "2px",
                      }}
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      fill={themeName === "dark-theme" ? "#B6B9BC" : "#36434D"}
                      className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-10ptun7 r-1janqcz r-1ion2gp r-1inkyih"
                    >
                      <g>
                        <path d="M13.5 8.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5S11.17 7 12 7s1.5.67 1.5 1.5zM13 17v-5h-2v5h2zm-1 5.25c5.66 0 10.25-4.59 10.25-10.25S17.66 1.75 12 1.75 1.75 6.34 1.75 12 6.34 22.25 12 22.25zM20.25 12c0 4.56-3.69 8.25-8.25 8.25S3.75 16.56 3.75 12 7.44 3.75 12 3.75s8.25 3.69 8.25 8.25z"></path>
                      </g>
                    </svg>
                  </div>
                  <div style={{ width: "25%" }}>
                    {" "}
                    <svg
                      height={`1.25em`}
                      width={`1.25em`}
                      fill={themeName === "dark-theme" ? "white" : "black"}
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-1gs4q39"
                    >
                      <g>
                        <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                      </g>
                    </svg>{" "}
                  </div>
                  <div style={{ width: "25%" }}>
                    <svg
                      height={`1.25em`}
                      width={`1.25em`}
                      fill={themeName === "dark-theme" ? "white" : "black"}
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-1gs4q39"
                    >
                      <g>
                        <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                      </g>
                    </svg>{" "}
                  </div>
                  <div style={{ width: "25%" }}>
                    {" "}
                    <svg
                      height={`1.25em`}
                      width={`1.25em`}
                      fill={themeName === "dark-theme" ? "white" : "black"}
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-1gs4q39"
                    >
                      <g>
                        <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                      </g>
                    </svg>
                  </div>
                </div>{" "}
                <div
                  className="mt-2 mb-2"
                  style={{
                    borderBottom:
                      themeName !== "dark-theme"
                        ? "1px solid rgba(0, 0, 0, 0.1)"
                        : // : "0.1px solid rgb(70, 70, 70)",
                          "1px solid rgb(70, 70, 70)",
                  }}
                ></div>
                <div
                  className="table-divs"
                  style={{
                    display: "flex",
                    flexDirection: "row",
                  }}
                >
                  <div
                    style={{
                      width: "25%",
                      color: themeName === "dark-theme" ? "#B6B9BC" : "#36434D",

                      fontSize: "15px",
                      lineHeight: "20px",
                      fontWeight: "400px",
                    }}
                  >
                    <span>Bookmark folders</span>
                  </div>
                  <div style={{ width: "25%" }}>
                    {" "}
                    <svg
                      height={`1.25em`}
                      width={`1.25em`}
                      fill={themeName === "dark-theme" ? "white" : "black"}
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-1gs4q39"
                    >
                      <g>
                        <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                      </g>
                    </svg>{" "}
                  </div>
                  <div style={{ width: "25%" }}>
                    <svg
                      height={`1.25em`}
                      width={`1.25em`}
                      fill={themeName === "dark-theme" ? "white" : "black"}
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-1gs4q39"
                    >
                      <g>
                        <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                      </g>
                    </svg>{" "}
                  </div>
                  <div style={{ width: "25%" }}>
                    {" "}
                    <svg
                      height={`1.25em`}
                      width={`1.25em`}
                      fill={themeName === "dark-theme" ? "white" : "black"}
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-1gs4q39"
                    >
                      <g>
                        <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                      </g>
                    </svg>
                  </div>
                </div>{" "}
                <div
                  className="mt-2 mb-2"
                  style={{
                    borderBottom:
                      themeName !== "dark-theme"
                        ? "1px solid rgba(0, 0, 0, 0.1)"
                        : // : "0.1px solid rgb(70, 70, 70)",
                          "1px solid rgb(70, 70, 70)",
                  }}
                ></div>
                <div
                  className="table-divs"
                  style={{
                    display: "flex",
                    flexDirection: "row",
                  }}
                >
                  <div
                    style={{
                      width: "25%",
                      color: themeName === "dark-theme" ? "#B6B9BC" : "#36434D",

                      fontSize: "15px",
                      lineHeight: "20px",
                      fontWeight: "400px",
                    }}
                  >
                    <span>App icons</span>
                  </div>
                  <div style={{ width: "25%" }}>
                    {" "}
                    <svg
                      height={`1.25em`}
                      width={`1.25em`}
                      fill={themeName === "dark-theme" ? "white" : "black"}
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-1gs4q39"
                    >
                      <g>
                        <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                      </g>
                    </svg>
                  </div>
                  <div style={{ width: "25%" }}>
                    <svg
                      height={`1.25em`}
                      width={`1.25em`}
                      fill={themeName === "dark-theme" ? "white" : "black"}
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-1gs4q39"
                    >
                      <g>
                        <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                      </g>
                    </svg>{" "}
                  </div>
                  <div style={{ width: "25%" }}>
                    {" "}
                    <svg
                      height={`1.25em`}
                      width={`1.25em`}
                      fill={themeName === "dark-theme" ? "white" : "black"}
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-1gs4q39"
                    >
                      <g>
                        <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                      </g>
                    </svg>
                  </div>
                </div>{" "}
                <div
                  className="mt-2 mb-2"
                  style={{
                    borderBottom:
                      themeName !== "dark-theme"
                        ? "1px solid rgba(0, 0, 0, 0.1)"
                        : // : "0.1px solid rgb(70, 70, 70)",
                          "1px solid rgb(70, 70, 70)",
                  }}
                ></div>
                <div
                  className="table-divs"
                  style={{
                    display: "flex",
                    flexDirection: "row",
                  }}
                >
                  <div
                    style={{
                      width: "25%",
                      color: themeName === "dark-theme" ? "#B6B9BC" : "#36434D",

                      fontSize: "15px",
                      lineHeight: "20px",
                      fontWeight: "400px",
                    }}
                  >
                    <span>Customize navigation</span>
                  </div>
                  <div style={{ width: "25%" }}>
                    {" "}
                    <svg
                      height={`1.25em`}
                      width={`1.25em`}
                      fill={themeName === "dark-theme" ? "white" : "black"}
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-1gs4q39"
                    >
                      <g>
                        <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                      </g>
                    </svg>{" "}
                  </div>
                  <div style={{ width: "25%" }}>
                    <svg
                      height={`1.25em`}
                      width={`1.25em`}
                      fill={themeName === "dark-theme" ? "white" : "black"}
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-1gs4q39"
                    >
                      <g>
                        <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                      </g>
                    </svg>{" "}
                  </div>
                  <div style={{ width: "25%" }}>
                    {" "}
                    <svg
                      height={`1.25em`}
                      width={`1.25em`}
                      fill={themeName === "dark-theme" ? "white" : "black"}
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-1gs4q39"
                    >
                      <g>
                        <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                      </g>
                    </svg>
                  </div>
                </div>{" "}
                <div
                  className="mt-2 mb-2"
                  style={{
                    borderBottom:
                      themeName !== "dark-theme"
                        ? "1px solid rgba(0, 0, 0, 0.1)"
                        : // : "0.1px solid rgb(70, 70, 70)",
                          "1px solid rgb(70, 70, 70)",
                  }}
                ></div>{" "}
                <div
                  className="table-divs"
                  style={{
                    display: "flex",
                    flexDirection: "row",
                  }}
                >
                  <div
                    style={{
                      width: "25%",
                      color: themeName === "dark-theme" ? "#B6B9BC" : "#36434D",
                      fontSize: "15px",
                      lineHeight: "20px",
                      fontWeight: "400px",
                    }}
                  >
                    <span>Hide your likes</span>
                  </div>
                  <div style={{ width: "25%" }}>
                    {" "}
                    <svg
                      height={`1.25em`}
                      width={`1.25em`}
                      fill={themeName === "dark-theme" ? "white" : "black"}
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-1gs4q39"
                    >
                      <g>
                        <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                      </g>
                    </svg>{" "}
                  </div>
                  <div style={{ width: "25%" }}>
                    <svg
                      height={`1.25em`}
                      width={`1.25em`}
                      fill={themeName === "dark-theme" ? "white" : "black"}
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-1gs4q39"
                    >
                      <g>
                        <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                      </g>
                    </svg>{" "}
                  </div>
                  <div style={{ width: "25%" }}>
                    {" "}
                    <svg
                      height={`1.25em`}
                      width={`1.25em`}
                      fill={themeName === "dark-theme" ? "white" : "black"}
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-1gs4q39"
                    >
                      <g>
                        <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                      </g>
                    </svg>
                  </div>
                </div>{" "}
                <div
                  className="mt-2 mb-2"
                  style={{
                    borderBottom:
                      themeName !== "dark-theme"
                        ? "1px solid rgba(0, 0, 0, 0.1)"
                        : // : "0.1px solid rgb(70, 70, 70)",
                          "1px solid rgb(70, 70, 70)",
                  }}
                ></div>
              </div>
            </div>
          </Col>
          <Col
            style={{
              padding: "0px",
              margin: "0px",
            }}
            xl={1}
          ></Col>
        </Row>
      </Container>
    </>
  );
}

export default PremiumSignupPage;
