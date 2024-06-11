import { useContext, useState } from "react";
import { Button, Col, Modal } from "react-bootstrap";
import { ThemeContext } from "../../../context/ThemeContext";
import useWindowDimensions from "../../../hooks/getWindowDimensions";
import { useNavigate } from "react-router-dom";
import SettingsNavigation from "../../../components/SettingsNavigation/SettingsNavigation";
import { useAntdMessageHandler } from "../../../utils/useAntdMessageHandler";

function VerifiedChooseMain() {
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(true);
  const [{ theme, themeName }] = useContext(ThemeContext);
  const { width } = useWindowDimensions();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(null);

  const [activeIndividualOptionTabStyle, setactiveIndividualOptionTabStyle] =
    useState(true);
  const [isIndividualSubscriptionClicked, setisIndividualSubscriptionClicked] =
    useState(true);
  const [
    activeOrganizationOptionTabStyle,
    setactiveOrganizationOptionTabStyle,
  ] = useState(false);
  const [
    isOrganizationSubscriptionClicked,
    setisOrganizationSubscriptionClicked,
  ] = useState(false);
  const [premiumRole, setpremiumRole] = useState("Individual");
  const [tabStyleOrganizationBasicPlan, setTabStyleOrganizationBasicPlan] =
    useState(true);
  const [
    tabStyleOrganizationFullAccessPlan,
    setTabStyleOrganizationFullAccessPlan,
  ] = useState(false);
  const [
    subTabIndexFromOrganizationSelect,
    setSubTabIndexFromOrganizationSelect,
  ] = useState(1);
  const [organizationSubPremiumRole, setorganizationSubPremiumRole] =
    useState("Organization");

  const { contextHolder } = useAntdMessageHandler();
  return (
    <>
      <>
        <Modal
          backdropClassName={
            themeName === "dark-theme" ? `back-drop-${themeName}` : ""
          }
          style={{
            height: "100%",
            overflowX: "hidden",
            overflowY: "hidden",
            margin: "0px",
            padding: "0px",
            backgroundColor:
              width < 700 && themeName === "dark-theme"
                ? "black"
                : width < 700 && themeName !== "dark-theme"
                ? "white"
                : "",
          }}
          dialogClassName={
            width < 700 ? "modal-fullscreen" : "modal_center_with_width"
          }
          contentClassName={
            themeName === "dark-theme" ? "dark-theme-sub-modal " : ""
          }
          show={showSubscriptionModal}
          centered={true}
        >
          <Modal.Header
            className="signin-modal-header-child-non-reactivate"
            style={{
              border: "none",
              zIndex: 999,
              backgroundColor: themeName === "dark-theme" ? "black" : "white",
              outlineStyle: "none",
            }}
          >
            <div
              onClick={() => {
                navigate(-1);
              }}
              className={`arrow arrow-${themeName} mt-2`}
              style={{
                position: "relative",
                width: "36px",
                height: " 36px",
                borderRadius: "50%",
                cursor: "pointer",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 999,
                right: "8px",
                bottom: "10px",
              }}
            >
              {" "}
              <svg
                color={themeName === "dark-theme" ? "white" : ""}
                fill="currentColor"
                width={20}
                height={20}
                style={{
                  position: "absolute",
                  border: "none",
                }}
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-z80fyv r-19wmn03"
              >
                <g>
                  <path d="M10.59 12L4.54 5.96l1.42-1.42L12 10.59l6.04-6.05 1.42 1.42L13.41 12l6.05 6.04-1.42 1.42L12 13.41l-6.04 6.05-1.42-1.42L10.59 12z"></path>
                </g>
              </svg>
            </div>
          </Modal.Header>

          <Modal.Body
            style={{
              padding: "0px",
              margin: "0px",
              height: "482px",
            }}
          >
            {!loading ? (
              <>
                <>
                  <div
                    className={
                      themeName === "dark-theme"
                        ? "soft-grey-dark-theme-text-variant-1 chirp-heavy-font mt-5"
                        : "very-dark-gray-light-theme-text-variant-1 chirp-heavy-font mt-5"
                    }
                    style={{
                      lineHeight: "36px",
                      fontSize: "31px",
                    }}
                  >
                    Who are you?
                  </div>{" "}
                  <div
                    className={
                      themeName === "dark-theme"
                        ? "soft-grey-dark-theme-text-variant-1 chirp-regular-font mt-3"
                        : "very-dark-gray-light-theme-text-variant-1 chirp-regular-font mt-3"
                    }
                    style={{
                      lineHeight: "20px",
                      fontSize: "15px",
                    }}
                  >
                    Choose the right subscription for you:
                  </div>
                  {/* start to check choosing type of subscription  */}
                  <div
                    className="mt-4"
                    style={{
                      display: "flex",
                      gap: "5%",
                      width: "81.5%",
                    }}
                  >
                    <div
                      onClick={() => {
                        setactiveIndividualOptionTabStyle(true);
                        setisIndividualSubscriptionClicked(true);
                        setactiveOrganizationOptionTabStyle(false);
                        setisOrganizationSubscriptionClicked(false);
                        setpremiumRole("Individual");
                      }}
                      style={
                        ({ activeIndividualOptionTabStyle },
                        {
                          flex: 1,
                          backgroundColor:
                            themeName === "dark-theme" ? "black" : "white",
                          minHeight: "112px",
                          padding: "12px",
                          cursor: "pointer",
                          borderWidth: "1px",
                          borderRadius: "16px",
                          filter:
                            themeName === "dark-theme"
                              ? "drop-shadow(rgb(51, 54, 57) 1px -1px 1px)"
                              : "",

                          boxShadow:
                            themeName === "dark-theme"
                              ? "rgba(255, 255, 255, 0.2) 0px 0px 15px, rgba(255, 255, 255, 0.15) 0px 0px 3px 1px"
                              : "0 0 15px rgba(101, 119,134,0.2), 0 0 5px 3px rgba(101,119,134,0.15)",
                          border: activeIndividualOptionTabStyle
                            ? "2px solid #339bf0"
                            : "2px solid transparent",
                          transition: "transform 0.3s ease",
                        })
                      }
                      className={`individual-subscription-box individual-subscription-box-${themeName}`}
                    >
                      {" "}
                      <div
                        style={{
                          position: "relative",
                          top: "5px",
                        }}
                      >
                        <div
                          className={
                            themeName === "dark-theme"
                              ? "soft-grey-dark-theme-text-variant-2 chirp-regular-font"
                              : "very-dark-gray-light-theme-text-variant-2 chirp-regular-font"
                          }
                          style={{
                            fontSize: "15px",
                          }}
                        >
                          Premium
                        </div>
                        <div
                          className={
                            themeName === "dark-theme"
                              ? "soft-grey-dark-theme-text-variant-1 chirp-bold-font"
                              : "very-dark-gray-light-theme-text-variant-1 chirp-bold-font"
                          }
                          style={{
                            fontSize: "18px",
                          }}
                        >
                          {" "}
                          I am an individual
                        </div>
                        <div
                          className={
                            themeName === "dark-theme"
                              ? "soft-grey-dark-theme-text-variant-2 chirp-regular-font"
                              : "very-dark-gray-light-theme-text-variant-2 chirp-regular-font"
                          }
                          style={{
                            fontSize: "14px",
                          }}
                        >
                          {" "}
                          For individuals and creators
                        </div>
                      </div>
                    </div>
                    <div
                      onClick={() => {
                        setactiveOrganizationOptionTabStyle(true);
                        setisOrganizationSubscriptionClicked(true);
                        setactiveIndividualOptionTabStyle(false);
                        setisIndividualSubscriptionClicked(false);
                        setTabStyleOrganizationBasicPlan(false);
                        setTabStyleOrganizationFullAccessPlan(true);
                        setSubTabIndexFromOrganizationSelect(2);
                        setorganizationSubPremiumRole("Organization");
                      }}
                      style={
                        ({ activeOrganizationOptionTabStyle },
                        {
                          flex: 1,
                          backgroundColor:
                            themeName === "dark-theme" ? "black" : "white",
                          minHeight: "112px",
                          padding: "12px",
                          cursor: "pointer",
                          borderWidth: "1px",
                          borderRadius: "16px",
                          filter:
                            themeName === "dark-theme"
                              ? "drop-shadow(rgb(51, 54, 57) 1px -1px 1px)"
                              : "",

                          boxShadow:
                            themeName === "dark-theme"
                              ? "rgba(255, 255, 255, 0.2) 0px 0px 15px, rgba(255, 255, 255, 0.15) 0px 0px 3px 1px"
                              : "0 0 15px rgba(101, 119,134,0.2), 0 0 5px 3px rgba(101,119,134,0.15)",
                          border: activeOrganizationOptionTabStyle
                            ? "2px solid #339bf0"
                            : "2px solid transparent",
                          transition: "transform 0.3s ease",
                        })
                      }
                      className={`organization-subscription-box organization-subscription-box-${themeName}`}
                    >
                      <div
                        style={{
                          position: "relative",
                        }}
                      >
                        <div
                          className={
                            themeName === "dark-theme"
                              ? "soft-grey-dark-theme-text-variant-2 chirp-regular-font"
                              : "very-dark-gray-light-theme-text-variant-2 chirp-regular-font"
                          }
                          style={{
                            fontSize: "15px",
                          }}
                        >
                          {" "}
                          Verified Organizations
                        </div>{" "}
                        <div
                          className={
                            themeName === "dark-theme"
                              ? "soft-grey-dark-theme-text-variant-1 chirp-bold-font"
                              : "very-dark-gray-light-theme-text-variant-1 chirp-bold-font"
                          }
                          style={{
                            fontSize: "18px",
                          }}
                        >
                          I am an organization
                        </div>{" "}
                        <div
                          className={
                            themeName === "dark-theme"
                              ? "soft-grey-dark-theme-text-variant-2 chirp-regular-font"
                              : "very-dark-gray-light-theme-text-variant-2 chirp-regular-font"
                          }
                          style={{
                            fontSize: "14px",
                          }}
                        >
                          For businesses, government agencies, and non-profits
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* finish to check choosing type of subscription  */}
                  <Button
                    onClick={() => {
                      if (isOrganizationSubscriptionClicked) {
                        navigate("/i/verified-orgs-signup");
                      }
                      if (isIndividualSubscriptionClicked) {
                        navigate("/i/premium_sign_up");
                      }
                    }}
                    style={{
                      width: "81.5%",
                      height: "54px",
                      backgroundColor:
                        themeName === "dark-theme" ? "white" : "#0f141a",
                      border: "none",
                    }}
                    className={
                      themeName === "dark-theme"
                        ? "background-hover-next-btn-dark-theme mt-4 soft-grey-dark-theme-text-variant-1 chirp-bold-font"
                        : "background-hover-next-btn-light-theme mt-4 very-dark-gray-light-theme-text-variant-1 chirp-bold-font"
                    }
                  >
                    <span>Subscribe</span>
                  </Button>
                  <div
                    style={{
                      fontSize: "15px",
                      lineHeight: "20px",
                    }}
                    className={
                      themeName === "dark-theme"
                        ? "soft-grey-dark-theme-text-variant-1 mt-4 chirp-regular-font mb-5"
                        : "very-dark-gray-light-theme-text-variant-1 mt-4 chirp-regular-font mb-5"
                    }
                  >
                    Learn more about{" "}
                    <span
                      className="subscription-underline-text"
                      style={{
                        cursor: "pointer",
                        color: "rgb(29, 155, 240)",
                      }}
                    >
                      Premium
                    </span>{" "}
                    and{" "}
                    <span
                      className="subscription-underline-text"
                      style={{
                        cursor: "pointer",
                        color: "rgb(29, 155, 240)",
                      }}
                    >
                      Verified Organizations
                    </span>
                  </div>
                </>
              </>
            ) : (
              <>
                <div
                  style={{
                    fontSize: "15px",
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <LoadingSpinner
                    strokeColor={"rgb(29, 155, 240)"}
                  ></LoadingSpinner>
                </div>
              </>
            )}
          </Modal.Body>
        </Modal>

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
            <div className="mt-3">Monetizations</div>
          </div>

          <div className="mt-4" style={{}}>
            <span
              style={{
                fontSize: "17px",
                lineHeight: "20px",
                fontWeight: "700",
                paddingLeft: width <= 500 ? "32px" : "12px",
                paddingRight: width <= 500 ? "32px" : "12px",
              }}
            >
              {" "}
              Available programs
            </span>
            <div
              style={{
                fontSize: "15px",
                lineHeight: "20px",
                fontWeight: "400",
                paddingLeft: width <= 500 ? "32px" : "12px",
                paddingRight: width <= 500 ? "32px" : "12px",
                color:
                  themeName === "dark-theme" ? "#71767A" : "rgb(83, 100, 113)",
              }}
              className="mt-2"
            >
              Eligible creators can sign up for monthly subscriptions and ads
              revenue sharing.
            </div>
          </div>
          <div
            style={{
              width: "100%",
              minWidth: "fit-content",
            }}
          >
            <div
              onClick={() =>
                navigate("/settings/superfollows/application/eligibility")
              }
              className={
                themeName === "dark-theme"
                  ? "has-children-dark-theme"
                  : "has-children-light-theme"
              }
            >
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <div
                  className={
                    themeName === "dark-theme"
                      ? "settings-icon-dark-theme"
                      : "settings-icon-light-theme"
                  }
                >
                  <div
                    style={{
                      backgroundColor:
                        themeName === "dark-theme"
                          ? "#378FC4"
                          : "rgba(0, 131, 235, 0.8)",
                      width: "48px",
                      height: "48px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: "8px",
                    }}
                  >
                    <svg
                      style={{
                        fill: "#FFFFFF",
                        width: "24px",
                        height: " 24px",
                      }}
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      class="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-1472mwg r-lrsllp r-jwli3a"
                    >
                      <g>
                        <path d="M16 6c0 2.21-1.79 4-4 4S8 8.21 8 6s1.79-4 4-4 4 1.79 4 4zm-.76 8.57l-3.95.58 2.86 2.78-.68 3.92L17 20l3.53 1.85-.68-3.92 2.86-2.78-3.95-.58L17 11l-1.76 3.57zm-.45-3.09c-.89-.32-1.86-.48-2.89-.48-2.35 0-4.37.85-5.86 2.44-1.48 1.57-2.36 3.8-2.63 6.46l-.11 1.09h8.58l.52-2.49-4.05-4.3 5.59-.99.85-1.73z"></path>
                      </g>
                    </svg>
                  </div>
                </div>
                <div
                  style={{
                    width: "100%",
                  }}
                >
                  <div
                    style={{
                      backgroundColor: "rgb(249, 24, 128)",
                      height: "20px",
                      borderRadius: "4px",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "flex-start",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "11px",
                        lineHeight: "16px",
                        fontWeight: "500",
                        color: "white",
                        padding: "6px",
                      }}
                    >
                      Not yet eligible
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: "15px",
                      lineHeight: "20px",
                      fontWeight: "700",
                    }}
                    className={
                      themeName === "dark-theme"
                        ? "settings-text-first-exp-dark-theme"
                        : "settings-text-first-exp-light-theme "
                    }
                  >
                    Subscriptions
                  </div>
                  <div
                    className={
                      themeName === "dark-theme"
                        ? "settings-text-dark-theme"
                        : "settings-text-light-theme"
                    }
                  >
                    Earn a living on C by letting anyone subscribe to you for
                    monthly content.
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
                      <path d="M14.586 12L7.543 4.96l1.414-1.42L17.414 12l-8.457 8.46-1.414-1.42L14.586 12z"></path>
                    </g>
                  </svg>
                </div>
              </div>
            </div>
            <div
              onClick={() => navigate("/settings/ad_rev_share_eligibility")}
              className={
                themeName === "dark-theme"
                  ? "has-children-dark-theme"
                  : "has-children-light-theme"
              }
            >
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <div
                  className={
                    themeName === "dark-theme"
                      ? "settings-icon-dark-theme"
                      : "settings-icon-light-theme"
                  }
                >
                  <div
                    style={{
                      backgroundColor:
                        themeName === "dark-theme"
                          ? "#CB7627"
                          : "rgba(216, 96, 0, 0.8)",
                      width: "48px",
                      height: "48px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: "8px",
                    }}
                  >
                    <svg
                      style={{
                        fill: "#FFFFFF",
                        width: "24px",
                        height: " 24px",
                      }}
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      class="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-1472mwg r-lrsllp r-jwli3a"
                    >
                      <g>
                        <path d="M14.83 13.82c.14.28.33.67.52 1.12.468 1.013.736 2.106.79 3.22-.073 1.544-.865 2.965-2.14 3.84 3.767-.694 6.513-3.96 6.55-7.79 0-6-4.7-10.25-9.5-13v.09c.143 1.768-.142 3.545-.83 5.18-.473-.722-1.068-1.354-1.76-1.87l-.26-.24c-.541 1.036-1.146 2.038-1.81 3C5 9.5 3.5 11.7 3.5 14.25c-.083 2.252.831 4.426 2.5 5.94 1.038.895 2.282 1.517 3.62 1.81-.11-.097-.211-.204-.3-.32-.465-.645-.704-1.425-.68-2.22.062-1.326.724-2.552 1.8-3.33l.66-.56c.836-.649 1.585-1.402 2.23-2.24l.68-.92.58 1 .24.41z"></path>
                      </g>
                    </svg>
                  </div>
                </div>
                <div
                  style={{
                    width: "100%",
                  }}
                >
                  <div
                    style={{
                      backgroundColor: "rgb(249, 24, 128)",
                      height: "20px",
                      borderRadius: "4px",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "flex-start",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "11px",
                        lineHeight: "16px",
                        fontWeight: "500",
                        color: "white",
                        padding: "6px",
                      }}
                    >
                      Not yet eligible
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: "15px",
                      lineHeight: "20px",
                      fontWeight: "700",
                    }}
                    className={
                      themeName === "dark-theme"
                        ? "settings-text-first-exp-dark-theme"
                        : "settings-text-first-exp-light-theme "
                    }
                  >
                    Ads revenue sharing
                  </div>
                  <div
                    className={
                      themeName === "dark-theme"
                        ? "settings-text-dark-theme"
                        : "settings-text-light-theme"
                    }
                  >
                    Earn income from the ads served in the replies to your
                    posts.
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
                      <path d="M14.586 12L7.543 4.96l1.414-1.42L17.414 12l-8.457 8.46-1.414-1.42L14.586 12z"></path>
                    </g>
                  </svg>
                </div>
              </div>
            </div>
            <div
              className={
                themeName === "dark-theme"
                  ? "has-children-dark-theme"
                  : "has-children-light-theme"
              }
            >
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <div
                  className={
                    themeName === "dark-theme"
                      ? "settings-icon-dark-theme"
                      : "settings-icon-light-theme"
                  }
                >
                  <div
                    style={{
                      backgroundColor:
                        themeName === "dark-theme"
                          ? "#745ECB"
                          : "rgba(101, 69, 219, 0.8)",
                      width: "48px",
                      height: "48px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: "8px",
                    }}
                  >
                    <svg
                      style={{
                        fill: "#FFFFFF",
                        width: "24px",
                        height: " 24px",
                      }}
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      class="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-1472mwg r-lrsllp r-jwli3a"
                    >
                      <g>
                        <path d="M13.5 8.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5S11.17 7 12 7s1.5.67 1.5 1.5zM13 17v-5h-2v5h2zm-1 5.25c5.66 0 10.25-4.59 10.25-10.25S17.66 1.75 12 1.75 1.75 6.34 1.75 12 6.34 22.25 12 22.25zM20.25 12c0 4.56-3.69 8.25-8.25 8.25S3.75 16.56 3.75 12 7.44 3.75 12 3.75s8.25 3.69 8.25 8.25z"></path>
                      </g>
                    </svg>
                  </div>
                </div>
                <div
                  style={{
                    width: "100%",
                  }}
                >
                  <div
                    style={{
                      fontSize: "15px",
                      lineHeight: "20px",
                      fontWeight: "700",
                    }}
                    className={
                      themeName === "dark-theme"
                        ? "settings-text-first-exp-dark-theme"
                        : "settings-text-first-exp-light-theme "
                    }
                  >
                    Learn more
                  </div>
                  <div
                    className={
                      themeName === "dark-theme"
                        ? "settings-text-dark-theme"
                        : "settings-text-light-theme"
                    }
                  >
                    Learn more about our Monetization programs and policies
                    here.
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
                      <path d="M14.586 12L7.543 4.96l1.414-1.42L17.414 12l-8.457 8.46-1.414-1.42L14.586 12z"></path>
                    </g>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </Col>
      </>
    </>
  );
}

export default VerifiedChooseMain;
