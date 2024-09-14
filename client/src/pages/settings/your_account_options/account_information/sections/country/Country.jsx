import { Button, Col, Modal } from "react-bootstrap";
import SettingsNavigation from "../../../../../../components/SettingsNavigation/SettingsNavigation";
import { useAntdMessageHandler } from "../../../../../../utils/useAntdMessageHandler";
import useWindowDimensions from "../../../../../../hooks/getWindowDimensions";
import { useContext, useEffect, useRef, useState } from "react";
import { ThemeContext } from "../../../../../../context/ThemeContext";
import { UserContext } from "../../../../../../context/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getCountries } from "react-phone-number-input/input";
import en from "react-phone-number-input/locale/en.json";

import LoadingSpinner from "../../../../../../components/ui/LoadingSpinner";
import { useFontSizeHandler } from "../../../../../../utils/useFontSizeHandler";

const API_URL = import.meta.env.VITE_APP_API_URL;

function Country() {
  const { contextHolder, showCustomMessage } = useAntdMessageHandler();
  const { width } = useWindowDimensions();
  const [{ theme, themeName }] = useContext(ThemeContext);
  const { userInfo, getToken } = useContext(UserContext);
  const navigate = useNavigate();
  const [country, setCountry] = useState(userInfo.country);

  const [showPopoverCountries, setShowPopoverCountries] = useState(false);
  const selectRef = useRef(null);

  const handleShowOptions = () => {
    setShowPopoverCountries(true);
    selectRef.current.focus();
  };

  const [loading, setLoading] = useState();
  const [show, setShowModal] = useState(null);

  const [test, setTest] = useState(userInfo.country);
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
  }, [country, test]);

  const handleSelectChange = (event) => {
    setCountry(event.target.value || undefined);
    refreshActiveUser();
    setLoading(true);
    setShowPopoverCountries(true);
    setTimeout(() => {
      setTest(country);
    }, 50);

    setShowModal(true);
    setTimeout(() => {
      setLoading(false);
    }, 350);
  };
  const sortedCountries = getCountries().sort((a, b) => {
    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
  });

  const handleAddCountry = async () => {
    try {
      const response = await axios.post(
        `${API_URL}/add_country_to_user`,
        {
          countryOption: en[country] || en[test],
        },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      if (response.status === 200) {
        refreshActiveUser();
      }
    } catch (error) {
      console.error("Error response:", error);
    }
  };

  const [tabIndex, setTabIndex] = useState(1);

  const [allowEmailDiscovery, setAllowEmailDiscovery] = useState(null);
  const [allowPhoneNumberDiscovery, setAllowPhoneNumberDiscovery] =
    useState(null);
  const [personalizedAdsEnabled, setPersonalizedAdsEnabled] = useState(null);
  const [crossDevicePersonalization, setCrossDevicePersonalization] =
    useState(null);
  const [locationBasedPersonalization, setLocationBasedPersonalization] =
    useState(null);
  const [dataSharingWithPartners, setDataSharingWithPartners] = useState(null);

  const [newNotifications, setNewNotifications] = useState(null);
  const [directMessages, setDirectMessages] = useState(null);
  const [emails_you_a_tweet, setEmails_you_a_tweet] = useState(null);
  const [top_tweets_and_stories, setTop_tweets_and_stories] = useState(null);
  const [updatesOption_first, setUpdatesOption_first] = useState(null);
  const [updatesOption_second, setUpdatesOption_second] = useState(null);
  const [tips_more_from_c, setTips_more_from_c] = useState(null);
  const [things_you_missed, setThings_you_missed] = useState(null);
  const [news_about_c, setNews_about_c] = useState(null);
  const [participation_in_c, setParticipation_in_c] = useState(null);
  const [
    suggestions_for_recommendeed_accounts,
    setSuggestions_for_recommendeed_accounts,
  ] = useState(null);
  const [
    suggestions_basend_on_recent_follows,
    setSuggestions_basend_on_recent_follows,
  ] = useState(null);
  const [tips_on_c_business_products, setTips_on_c_business_products] =
    useState(null);

  const [showRemoveContactsModal, setShowRemoveContactsModal] = useState(null);

  const openRemoveContactsModal = () => {
    setShowRemoveContactsModal(true);
  };

  const handleCloseRemoveContactsModal = () => {
    setShowRemoveContactsModal(false);
  };

  const [notRemoved, setNotRemoved] = useState(null);
  const {
    getFontSizeAndLineHeight31,
    getFontSizeAndLineHeight26,
    getFontSizeAndLineHeight23,
    getFontSizeAndLineHeight20,
    getFontSizeAndLineHeight17,
    getFontSizeAndLineHeight15,
    getFontSizeAndLineHeight14,
    getFontSizeAndLineHeight13,
  } = useFontSizeHandler();
  const font31 = getFontSizeAndLineHeight31();
  const font26 = getFontSizeAndLineHeight26();
  const font23 = getFontSizeAndLineHeight23();
  const font20 = getFontSizeAndLineHeight20();
  const font17 = getFontSizeAndLineHeight17();
  const font15 = getFontSizeAndLineHeight15();
  const font14 = getFontSizeAndLineHeight14();
  const font13 = getFontSizeAndLineHeight13();
  return (
    <>
      {contextHolder}
      <SettingsNavigation />
      <>
        <Modal
          style={{
            padding: "0px",
            margin: "0px",
          }}
          centered
          show={showRemoveContactsModal}
          onHide={handleCloseRemoveContactsModal}
          backdropClassName={
            themeName === "dark-theme" ? `back-drop-${themeName}` : ""
          }
          className="delete-post"
          contentClassName={
            themeName === "dark-theme"
              ? "delete-post-modal-dark-theme"
              : "delete-post-modal"
          }
        >
          <Modal.Body>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                paddingBottom: "16px",
                paddingTop: "16px",
                maxWidth: "256px",
              }}
            >
              <div
                className="chirp-bold-font"
                style={{
                  color: themeName === "dark-theme" ? "white" : "",
                  fontSize: font20.fontSize,
                  lineHeight: font20.lineHeight,
                }}
              >
                Are you sure?
              </div>
              <div
                style={{
                  color:
                    themeName === "dark-theme"
                      ? "#71767A"
                      : "rgb(83, 100, 113)",
                  fontSize: font15.fontSize,
                  lineHeight: font15.lineHeight,
                }}
                className="mt-2 chirp-regular-font"
              >
                This removes any contacts you’ve previously uploaded and turns
                off address book syncing with C on all your devices. Please be
                aware that this takes a little time.{" "}
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                padding: "12px",
              }}
            >
              <Button
                onClick={() => {
                  if (!notRemoved) {
                    showCustomMessage(
                      "You have successfully removed your contacts.",
                      6
                    );
                    setShowRemoveContactsModal(false);
                    setNotRemoved(true);
                  } else {
                    return;
                  }
                }}
                className={`red-btn ${themeName}-red-btn chirp-bold-font`}
                style={{
                  maxWidth: "256px",
                  minHeight: "44px",
                  color: "white",
                  backgroundColor: "rgb(244, 33, 46)",
                  border: "none",
                }}
              >
                Yes, remove
              </Button>
              <Button
                onClick={() => setShowRemoveContactsModal(false)}
                variant="light"
                style={{
                  color: themeName === "dark-theme" ? "white" : "black",
                  maxWidth: "256px",
                  minHeight: "44px",
                }}
                className={`mt-2 forgot-password-btn ${themeName}-black-btn chirp-bold-font`}
              >
                Cancel
              </Button>
            </div>
          </Modal.Body>
        </Modal>
      </>
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
          show={show}
          centered={true}
          dialogClassName={
            width <= 700 ? "modal-fullscreen" : "modal_center_with_width"
          }
          contentClassName={
            themeName === "dark-theme" &&
            !showRemoveContactsModal &&
            width > 700
              ? "dark-theme-sub-modal settings-modal-type"
              : themeName !== "dark-theme" &&
                !showRemoveContactsModal &&
                width > 700
              ? "settings-modal-type"
              : showRemoveContactsModal &&
                themeName === "dark-theme" &&
                width > 700
              ? "nested-modal-opened_dark_theme settings-modal-type"
              : showRemoveContactsModal &&
                themeName !== "dark-theme" &&
                width > 700
              ? "nested-modal-opened_light_theme settings-modal-type"
              : themeName === "dark-theme" &&
                !showRemoveContactsModal &&
                width <= 700
              ? "dark-theme-sub-modal"
              : themeName !== "dark-theme" &&
                !showRemoveContactsModal &&
                width <= 700
              ? ""
              : showRemoveContactsModal &&
                themeName === "dark-theme" &&
                width <= 700
              ? "nested-modal-opened_dark_theme"
              : showRemoveContactsModal &&
                themeName !== "dark-theme" &&
                width <= 700
              ? "nested-modal-opened_light_theme"
              : null
          }
        >
          <Modal.Body
            style={{
              padding: "0px",
              margin: "0px",
              minHeight: "100%",
              borderRadius: "16px",
            }}
          >
            {!loading ? (
              <>
                {tabIndex === 1 ? (
                  <>
                    <div className="icon">
                      <div
                        style={{
                          position: "relative",
                          borderRadius: "50%",
                          width: "50px",
                          height: "50px",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
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
                              filter:
                                "drop-shadow(0 0 10px rgba(0, 0, 0, 0.5))",
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
                    </div>
                    <div
                      style={{
                        paddingLeft: width <= 700 ? "32px" : "80px",
                        paddingRight: width <= 700 ? "32px" : "80px",
                        width: "100%",
                      }}
                    >
                      <div
                        style={{
                          fontSize: font26.fontSize,
                          lineHeight: font26.lineHeight,
                        }}
                        className={
                          themeName === "dark-theme"
                            ? "soft-grey-dark-theme-text-variant-1 chirp-bold-font mt-4"
                            : "very-dark-gray-light-theme-text-variant-1 chirp-bold-font mt-4"
                        }
                      >
                        Changing your country
                      </div>
                      <div
                        style={{
                          fontSize: font15.fontSize,
                          lineHeight: font15.lineHeight,
                        }}
                        className={
                          themeName === "dark-theme"
                            ? "soft-grey-dark-theme-text-variant-2 chirp-regular-font mt-2"
                            : "very-dark-gray-light-theme-text-variant-2  chirp-regular-font mt-2"
                        }
                      >
                        In order to change your country to{" "}
                        <span>{en[country]}</span>, you’ll need to agree to C’s{" "}
                        <span className="hover-blue-underline">Terms</span>,{" "}
                        <span className="hover-blue-underline">
                          Privacy Policy
                        </span>
                        , and{" "}
                        <span className="hover-blue-underline">Cookie use</span>
                        . You also agree that you’re over 16 years of age. You
                        can review your settings next.
                      </div>
                    </div>
                    <div
                      className="mt-5"
                      style={{
                        paddingLeft: width <= 700 ? "32px" : "80px",
                        paddingRight: width <= 700 ? "32px" : "80px",
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <Button
                        className={
                          themeName === "dark-theme"
                            ? "background-hover-next-btn-dark-theme soft-grey-dark-theme-text-variant-1 chirp-bold-font"
                            : "background-hover-next-btn-light-theme very-dark-gray-light-theme-text-variant-1 chirp-bold-font"
                        }
                        onClick={() => {
                          setCountry(test);
                          setTest(country);
                          setLoading(true);
                          setTimeout(() => {
                            setTabIndex(2);
                          }, 300);
                          setTimeout(() => {
                            setLoading(false);
                          }, 600);
                        }}
                        style={{
                          width: "100%",
                          minHeight: "52px",
                          paddingLeft: "80px",
                          paddingRight: "80px",
                          border: "none",
                          backgroundColor:
                            themeName === "dark-theme" ? "white" : "black",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            padding: "0px",
                            margin: "0px",
                            color:
                              themeName === "dark-theme" ? "black" : "white",
                          }}
                        >
                          <span>
                            {" "}
                            <span>Agree and continue</span>
                          </span>
                        </div>
                      </Button>
                    </div>
                    <div
                      className="mt-3"
                      style={{
                        paddingLeft: width <= 700 ? "32px" : "80px",
                        paddingRight: width <= 700 ? "32px" : "80px",
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <Button
                        className={
                          themeName === "dark-theme"
                            ? "background-hover-cancel-btn-dark-theme-variant-another  soft-grey-dark-theme-text-variant-1"
                            : "background-hover-cancel-btn-light-theme-variant-another  very-dark-gray-light-theme-text-variant-1"
                        }
                        onClick={() => {
                          setLoading(true);

                          setCountry((prevCountry) =>
                            prevCountry ? prevCountry : null
                          );
                          setTest((prevCountryTest) =>
                            prevCountryTest ? prevCountryTest : null
                          );

                          setTimeout(() => {
                            setShowModal(false);
                          }, 300);
                          setTimeout(() => {
                            setLoading(false);
                          }, 600);
                        }}
                        style={{
                          width: "100%",
                          minHeight: "52px",
                          paddingLeft: "80px",
                          paddingRight: "80px",
                          color: themeName === "dark-theme" ? "" : "",
                          backgroundColor: "transparent",
                          border: "none",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            padding: "0px",
                            margin: "0px",
                          }}
                        >
                          <span
                            style={{
                              textOverflow: "unset",
                              borderBottom:
                                themeName !== "dark-theme"
                                  ? "2px solid #0F141A"
                                  : // : "0.1px solid rgb(70, 70, 70)",
                                    "2px solid #EFF3F4",
                            }}
                          >
                            {" "}
                            <span>Cancel</span>
                          </span>
                        </div>
                      </Button>
                    </div>{" "}
                  </>
                ) : tabIndex === 2 ? (
                  <>
                    {" "}
                    <div
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                        maxHeight: "53px",
                        alignItems: "center",
                        borderRadius: "inherit",
                      }}
                      className="icon"
                    >
                      <div
                        style={{
                          position: "relative",
                          borderRadius: "50%",
                          width: "50px",
                          height: "50px",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
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
                              filter:
                                "drop-shadow(0 0 10px rgba(0, 0, 0, 0.5))",
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
                    </div>
                    <div
                      className={
                        !showRemoveContactsModal
                          ? `scrollbar-add scrollbar-add-${themeName}`
                          : showRemoveContactsModal &&
                            themeName === "dark-theme"
                          ? "nested-modal-opened_dark_theme_scroll_bar"
                          : showRemoveContactsModal &&
                            themeName !== "dark-theme"
                          ? "nested-modal-opened_light_theme_scroll_bar"
                          : null
                      }
                      style={{
                        maxHeight: "450px",
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        overflowY: "auto",
                      }}
                    >
                      <div
                        className="mt-3"
                        style={{
                          // backgroundColor: "purple",

                          display: "flex",
                          flexDirection: "column",
                          width: "100%",
                          height: "100dvh",
                          paddingLeft: width <= 700 ? "32px" : "80px",
                          paddingRight: width <= 700 ? "32px" : "80px",
                        }}
                      >
                        <div
                          style={{
                            fontSize: font31.fontSize,
                            lineHeight: font31.lineHeight,
                          }}
                          className={
                            themeName === "dark-theme"
                              ? "soft-grey-dark-theme-text-variant-1 chirp-bold-font"
                              : "very-dark-gray-light-theme-text-variant-1 chirp-bold-font"
                          }
                        >
                          Review your current settings
                        </div>
                        <div
                          style={{
                            fontSize: font15.fontSize,
                            lineHeight: font15.lineHeight,
                          }}
                          className={
                            themeName === "dark-theme"
                              ? "soft-grey-dark-theme-text-variant-2 chirp-regular-font mt-2"
                              : "very-dark-gray-light-theme-text-variant-2 chirp-regular-font mt-2"
                          }
                        >
                          Please take a moment to read and agree to your current
                          selections.
                        </div>
                        <div
                          style={{
                            fontSize: font20.fontSize,
                            lineHeight: font20.lineHeight,
                          }}
                          className={
                            themeName === "dark-theme"
                              ? "soft-grey-dark-theme-text-variant-1 chirp-bold-font mt-5"
                              : "very-dark-gray-light-theme-text-variant-1 chirp-bold-font mt-5"
                          }
                        >
                          Discoverability
                        </div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <div
                            style={{
                              fontSize: font15.fontSize,
                              lineHeight: font15.lineHeight,
                            }}
                            className={
                              themeName === "dark-theme"
                                ? "soft-grey-dark-theme-text-variant-1 chirp-regular-font mt-2"
                                : "very-dark-gray-light-theme-text-variant-1 chirp-regular-font mt-2"
                            }
                          >
                            Let others find you by your email address
                          </div>
                          <div>
                            {" "}
                            <div
                              onClick={() =>
                                setAllowEmailDiscovery(!allowEmailDiscovery)
                              }
                              style={{
                                marginRight: "36px",
                                width: "36px",
                                height: "36px",
                                borderRadius: "50%",
                                cursor: "pointer",
                                position: "relative",
                                left: "30px",
                              }}
                              className={
                                themeName === "dark-theme" &&
                                allowEmailDiscovery
                                  ? "hover-background-effect-clicked-dark-theme"
                                  : themeName !== "dark-theme" &&
                                    allowEmailDiscovery
                                  ? "hover-background-effect-clicked-light-theme"
                                  : themeName === "dark-theme" &&
                                    !allowEmailDiscovery
                                  ? "hover-background-effect-dark-theme"
                                  : themeName !== "dark-theme" &&
                                    !allowEmailDiscovery
                                  ? "hover-background-effect-light-theme"
                                  : ""
                              }
                            >
                              <div
                                style={{
                                  backgroundColor: allowEmailDiscovery
                                    ? "#1d9bf0"
                                    : "transparent",
                                  border: allowEmailDiscovery
                                    ? ""
                                    : themeName === "dark-theme"
                                    ? "2px solid rgb(70,70,70)"
                                    : "2px solid #536471",

                                  borderWidth: "2px ",
                                  width: "20px",
                                  height: "20px",
                                  position: "relative",
                                  left: "8px",
                                  top: "8px",
                                  borderRadius: "3px",
                                }}
                              >
                                <svg
                                  style={{
                                    position: "relative",
                                    left: "2px",
                                    bottom: "4px",
                                    display: allowEmailDiscovery
                                      ? "initial"
                                      : "none",
                                  }}
                                  width={16}
                                  height={16}
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-jwli3a r-1hjwoze r-12ym1je"
                                  color="white"
                                  fill="currentColor"
                                >
                                  <g>
                                    <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                  </g>
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <div
                            style={{
                              fontSize: font15.fontSize,
                              lineHeight: font15.lineHeight,
                            }}
                            className={
                              themeName === "dark-theme"
                                ? "soft-grey-dark-theme-text-variant-1 chirp-regular-font mt-2"
                                : "very-dark-gray-light-theme-text-variant-1 chirp-regular-font mt-2"
                            }
                          >
                            Let others find you by your phone number
                          </div>
                          <div>
                            {" "}
                            <div
                              onClick={() =>
                                setAllowPhoneNumberDiscovery(
                                  !allowPhoneNumberDiscovery
                                )
                              }
                              style={{
                                marginRight: "36px",
                                width: "36px",
                                height: "36px",
                                borderRadius: "50%",
                                cursor: "pointer",
                                position: "relative",
                                left: "30px",
                              }}
                              className={
                                themeName === "dark-theme" &&
                                allowPhoneNumberDiscovery
                                  ? "hover-background-effect-clicked-dark-theme"
                                  : themeName !== "dark-theme" &&
                                    allowPhoneNumberDiscovery
                                  ? "hover-background-effect-clicked-light-theme"
                                  : themeName === "dark-theme" &&
                                    !allowPhoneNumberDiscovery
                                  ? "hover-background-effect-dark-theme"
                                  : themeName !== "dark-theme" &&
                                    !allowPhoneNumberDiscovery
                                  ? "hover-background-effect-light-theme"
                                  : ""
                              }
                            >
                              <div
                                style={{
                                  backgroundColor: allowPhoneNumberDiscovery
                                    ? "#1d9bf0"
                                    : "transparent",
                                  border: allowPhoneNumberDiscovery
                                    ? ""
                                    : themeName === "dark-theme"
                                    ? "2px solid rgb(70,70,70)"
                                    : "2px solid #536471",

                                  borderWidth: "2px ",
                                  width: "20px",
                                  height: "20px",
                                  position: "relative",
                                  left: "8px",
                                  top: "8px",
                                  borderRadius: "3px",
                                }}
                              >
                                <svg
                                  style={{
                                    position: "relative",
                                    left: "2px",
                                    bottom: "4px",
                                    display: allowPhoneNumberDiscovery
                                      ? "initial"
                                      : "none",
                                  }}
                                  width={16}
                                  height={16}
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-jwli3a r-1hjwoze r-12ym1je"
                                  color="white"
                                  fill="currentColor"
                                >
                                  <g>
                                    <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                  </g>
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                          style={{
                            fontSize: font20.fontSize,
                            lineHeight: font20.lineHeight,
                          }}
                          className={
                            themeName === "dark-theme"
                              ? "soft-grey-dark-theme-text-variant-1 chirp-bold-font mt-3"
                              : "very-dark-gray-light-theme-text-variant-1 chirp-bold-font mt-3"
                          }
                        >
                          Notifications
                        </div>
                        <div
                          style={{
                            cursor: "pointer",
                          }}
                          onClick={() => setTabIndex("email_updates")}
                        >
                          <div
                            style={{
                              fontSize: font15.fontSize,
                              lineHeight: font15.lineHeight,
                            }}
                            className={
                              themeName === "dark-theme"
                                ? "soft-grey-dark-theme-text-variant-1 chirp-regular-font mt-3"
                                : "very-dark-gray-light-theme-text-variant-1 chirp-regular-font mt-3"
                            }
                          >
                            Email updates
                          </div>
                          <div
                            style={{
                              fontSize: font13.fontSize,
                              lineHeight: font13.lineHeight,
                            }}
                            className={
                              themeName === "dark-theme"
                                ? "soft-grey-dark-theme-text-variant-2 chirp-regular-font"
                                : "very-dark-gray-light-theme-text-variant-2 chirp-regular-font"
                            }
                          >
                            Allow none
                          </div>
                          <div
                            style={{
                              fontSize: font13.fontSize,
                              lineHeight: font13.lineHeight,
                            }}
                            className={
                              themeName === "dark-theme"
                                ? "soft-grey-dark-theme-text-variant-2 chirp-regular-font mt-3"
                                : "very-dark-gray-light-theme-text-variant-2 chirp-regular-font mt-3"
                            }
                          >
                            C will send you email including recommendations,
                            marketing messages, and information about your C
                            activity.
                          </div>
                        </div>
                        <div
                          style={{
                            fontSize: font20.fontSize,
                            lineHeight: font20.lineHeight,
                          }}
                          className={
                            themeName === "dark-theme"
                              ? "soft-grey-dark-theme-text-variant-1 chirp-bold-font mt-3"
                              : "very-dark-gray-light-theme-text-variant-1 chirp-bold-font mt-3"
                          }
                        >
                          Personalization
                        </div>
                        <div
                          className="mt-3"
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                            }}
                          >
                            <span
                              style={{
                                fontSize: font15.fontSize,
                                lineHeight: font15.lineHeight,
                              }}
                              className={
                                themeName === "dark-theme"
                                  ? "soft-grey-dark-theme-text-variant-1 chirp-regular-font"
                                  : "very-dark-gray-light-theme-text-variant-1 chirp-regular-font"
                              }
                            >
                              Personalized ads
                            </span>
                            <span
                              style={{
                                fontSize: font13.fontSize,
                                lineHeight: font13.lineHeight,
                              }}
                              className={
                                themeName === "dark-theme"
                                  ? "soft-grey-dark-theme-text-variant-2 chirp-regular-font mt-3"
                                  : "very-dark-gray-light-theme-text-variant-2 chirp-regular-font mt-3"
                              }
                            >
                              You will always see ads on C based on your C
                              activity. When this setting is enabled, C may
                              further personalize ads from C advertisers, on and
                              off C, by combining your C activity with other
                              online activity and information from our partners.{" "}
                              <span className="hover-blue-underline">
                                Learn more
                              </span>
                            </span>
                          </div>
                          <div>
                            {" "}
                            <div
                              onClick={() =>
                                setPersonalizedAdsEnabled(
                                  !personalizedAdsEnabled
                                )
                              }
                              style={{
                                marginRight: "36px",
                                width: "36px",
                                height: "36px",
                                borderRadius: "50%",
                                cursor: "pointer",
                                position: "relative",
                                left: "30px",
                              }}
                              className={
                                themeName === "dark-theme" &&
                                personalizedAdsEnabled
                                  ? "hover-background-effect-clicked-dark-theme"
                                  : themeName !== "dark-theme" &&
                                    personalizedAdsEnabled
                                  ? "hover-background-effect-clicked-light-theme"
                                  : themeName === "dark-theme" &&
                                    !personalizedAdsEnabled
                                  ? "hover-background-effect-dark-theme"
                                  : themeName !== "dark-theme" &&
                                    !personalizedAdsEnabled
                                  ? "hover-background-effect-light-theme"
                                  : ""
                              }
                            >
                              <div
                                style={{
                                  backgroundColor: personalizedAdsEnabled
                                    ? "#1d9bf0"
                                    : "transparent",
                                  border: personalizedAdsEnabled
                                    ? ""
                                    : themeName === "dark-theme"
                                    ? "2px solid rgb(70,70,70)"
                                    : "2px solid #536471",

                                  borderWidth: "2px ",
                                  width: "20px",
                                  height: "20px",
                                  position: "relative",
                                  left: "8px",
                                  top: "8px",
                                  borderRadius: "3px",
                                }}
                              >
                                <svg
                                  style={{
                                    position: "relative",
                                    left: "2px",
                                    bottom: "4px",
                                    display: personalizedAdsEnabled
                                      ? "initial"
                                      : "none",
                                  }}
                                  width={16}
                                  height={16}
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-jwli3a r-1hjwoze r-12ym1je"
                                  color="white"
                                  fill="currentColor"
                                >
                                  <g>
                                    <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                  </g>
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                          className="mt-2"
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                            }}
                          >
                            <span
                              style={{
                                fontSize: font15.fontSize,
                                lineHeight: font15.lineHeight,
                              }}
                              className={
                                themeName === "dark-theme"
                                  ? "soft-grey-dark-theme-text-variant-1 chirp-regular-font mt-3"
                                  : "very-dark-gray-light-theme-text-variant-1 chirp-regular-font mt-3"
                              }
                            >
                              Personalize based on your devices
                            </span>
                            <span
                              style={{
                                fontSize: font13.fontSize,
                                lineHeight: font13.lineHeight,
                              }}
                              className={
                                themeName === "dark-theme"
                                  ? "soft-grey-dark-theme-text-variant-2 chirp-regular-font mt-3"
                                  : "very-dark-gray-light-theme-text-variant-2 chirp-regular-font mt-3"
                              }
                            >
                              C will always personalize across the devices
                              you’ve used to log in. When this setting is
                              enabled, C may also link your C account to your
                              other devices — ones you’ve never used to log in
                              to C — to help measure and improve your
                              experience.{" "}
                              <span className="hover-blue-underline">
                                Learn more
                              </span>
                            </span>
                          </div>
                          <div>
                            {" "}
                            <div
                              onClick={() =>
                                setCrossDevicePersonalization(
                                  !crossDevicePersonalization
                                )
                              }
                              style={{
                                marginRight: "36px",
                                width: "36px",
                                height: "36px",
                                borderRadius: "50%",
                                cursor: "pointer",
                                position: "relative",
                                left: "30px",
                              }}
                              className={
                                themeName === "dark-theme" &&
                                crossDevicePersonalization
                                  ? "hover-background-effect-clicked-dark-theme"
                                  : themeName !== "dark-theme" &&
                                    crossDevicePersonalization
                                  ? "hover-background-effect-clicked-light-theme"
                                  : themeName === "dark-theme" &&
                                    !crossDevicePersonalization
                                  ? "hover-background-effect-dark-theme"
                                  : themeName !== "dark-theme" &&
                                    !crossDevicePersonalization
                                  ? "hover-background-effect-light-theme"
                                  : ""
                              }
                            >
                              <div
                                style={{
                                  backgroundColor: crossDevicePersonalization
                                    ? "#1d9bf0"
                                    : "transparent",
                                  border: crossDevicePersonalization
                                    ? ""
                                    : themeName === "dark-theme"
                                    ? "2px solid rgb(70,70,70)"
                                    : "2px solid #536471",

                                  borderWidth: "2px ",
                                  width: "20px",
                                  height: "20px",
                                  position: "relative",
                                  left: "8px",
                                  top: "8px",
                                  borderRadius: "3px",
                                }}
                              >
                                <svg
                                  style={{
                                    position: "relative",
                                    left: "2px",
                                    bottom: "4px",
                                    display: crossDevicePersonalization
                                      ? "initial"
                                      : "none",
                                  }}
                                  width={16}
                                  height={16}
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-jwli3a r-1hjwoze r-12ym1je"
                                  color="white"
                                  fill="currentColor"
                                >
                                  <g>
                                    <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                  </g>
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                          className="mt-2"
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                            }}
                          >
                            <span
                              style={{
                                fontSize: font15.fontSize,
                                lineHeight: font15.lineHeight,
                              }}
                              className={
                                themeName === "dark-theme"
                                  ? "soft-grey-dark-theme-text-variant-1 chirp-regular-font mt-3"
                                  : "very-dark-gray-light-theme-text-variant-1 chirp-regular-font mt-3"
                              }
                            >
                              Personalize based on places you've been
                            </span>
                            <span
                              style={{
                                fontSize: font13.fontSize,
                                lineHeight: font13.lineHeight,
                              }}
                              className={
                                themeName === "dark-theme"
                                  ? "soft-grey-dark-theme-text-variant-2 chirp-regular-font mt-3"
                                  : "very-dark-gray-light-theme-text-variant-2 chirp-regular-font mt-3"
                              }
                            >
                              C always uses some information, like where you
                              signed up and your current location, to help show
                              you more relevant content. When this setting is
                              enabled, C may also personalize your experience
                              based on other places you’ve been.
                            </span>
                          </div>
                          <div>
                            {" "}
                            <div
                              onClick={() =>
                                setLocationBasedPersonalization(
                                  !locationBasedPersonalization
                                )
                              }
                              style={{
                                marginRight: "36px",
                                width: "36px",
                                height: "36px",
                                borderRadius: "50%",
                                cursor: "pointer",
                                position: "relative",
                                left: "30px",
                              }}
                              className={
                                themeName === "dark-theme" &&
                                locationBasedPersonalization
                                  ? "hover-background-effect-clicked-dark-theme"
                                  : themeName !== "dark-theme" &&
                                    locationBasedPersonalization
                                  ? "hover-background-effect-clicked-light-theme"
                                  : themeName === "dark-theme" &&
                                    !locationBasedPersonalization
                                  ? "hover-background-effect-dark-theme"
                                  : themeName !== "dark-theme" &&
                                    !locationBasedPersonalization
                                  ? "hover-background-effect-light-theme"
                                  : ""
                              }
                            >
                              <div
                                style={{
                                  backgroundColor: locationBasedPersonalization
                                    ? "#1d9bf0"
                                    : "transparent",
                                  border: locationBasedPersonalization
                                    ? ""
                                    : themeName === "dark-theme"
                                    ? "2px solid rgb(70,70,70)"
                                    : "2px solid #536471",

                                  borderWidth: "2px ",
                                  width: "20px",
                                  height: "20px",
                                  position: "relative",
                                  left: "8px",
                                  top: "8px",
                                  borderRadius: "3px",
                                }}
                              >
                                <svg
                                  style={{
                                    position: "relative",
                                    left: "2px",
                                    bottom: "4px",
                                    display: locationBasedPersonalization
                                      ? "initial"
                                      : "none",
                                  }}
                                  width={16}
                                  height={16}
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-jwli3a r-1hjwoze r-12ym1je"
                                  color="white"
                                  fill="currentColor"
                                >
                                  <g>
                                    <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                  </g>
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                          style={{
                            fontSize: font20.fontSize,
                            lineHeight: font20.lineHeight,
                          }}
                          className={
                            themeName === "dark-theme"
                              ? "soft-grey-dark-theme-text-variant-1 chirp-bold-font mt-3"
                              : "very-dark-gray-light-theme-text-variant-1 chirp-bold-font mt-3"
                          }
                        >
                          Data
                        </div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                            }}
                          >
                            <span
                              style={{
                                fontSize: font15.fontSize,
                                lineHeight: font15.lineHeight,
                              }}
                              className={
                                themeName === "dark-theme"
                                  ? "soft-grey-dark-theme-text-variant-1 chirp-regular-font mt-3"
                                  : "very-dark-gray-light-theme-text-variant-1 chirp-regular-font mt-3"
                              }
                            >
                              Share your data with C’s business partners
                            </span>
                            <span
                              style={{
                                fontSize: font13.fontSize,
                                lineHeight: font13.lineHeight,
                              }}
                              className={
                                themeName === "dark-theme"
                                  ? "soft-grey-dark-theme-text-variant-2 chirp-regular-font mt-3"
                                  : "very-dark-gray-light-theme-text-variant-2 chirp-regular-font mt-3"
                              }
                            >
                              This setting lets C share non-public data, such as
                              content you’ve seen and your interests, with
                              certain business partners for uses like ads and
                              brand marketing.{" "}
                              <span className="hover-blue-underline">
                                Learn more
                              </span>
                            </span>
                          </div>
                          <div>
                            {" "}
                            <div
                              onClick={() =>
                                setDataSharingWithPartners(
                                  !dataSharingWithPartners
                                )
                              }
                              style={{
                                marginRight: "36px",
                                width: "36px",
                                height: "36px",
                                borderRadius: "50%",
                                cursor: "pointer",
                                position: "relative",
                                left: "30px",
                              }}
                              className={
                                themeName === "dark-theme" &&
                                dataSharingWithPartners
                                  ? "hover-background-effect-clicked-dark-theme"
                                  : themeName !== "dark-theme" &&
                                    dataSharingWithPartners
                                  ? "hover-background-effect-clicked-light-theme"
                                  : themeName === "dark-theme" &&
                                    !dataSharingWithPartners
                                  ? "hover-background-effect-dark-theme"
                                  : themeName !== "dark-theme" &&
                                    !dataSharingWithPartners
                                  ? "hover-background-effect-light-theme"
                                  : ""
                              }
                            >
                              <div
                                style={{
                                  backgroundColor: dataSharingWithPartners
                                    ? "#1d9bf0"
                                    : "transparent",
                                  border: dataSharingWithPartners
                                    ? ""
                                    : themeName === "dark-theme"
                                    ? "2px solid rgb(70,70,70)"
                                    : "2px solid #536471",

                                  borderWidth: "2px ",
                                  width: "20px",
                                  height: "20px",
                                  position: "relative",
                                  left: "8px",
                                  top: "8px",
                                  borderRadius: "3px",
                                }}
                              >
                                <svg
                                  style={{
                                    position: "relative",
                                    left: "2px",
                                    bottom: "4px",
                                    display: dataSharingWithPartners
                                      ? "initial"
                                      : "none",
                                  }}
                                  width={16}
                                  height={16}
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-jwli3a r-1hjwoze r-12ym1je"
                                  color="white"
                                  fill="currentColor"
                                >
                                  <g>
                                    <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                  </g>
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                          style={{
                            fontSize: font20.fontSize,
                            lineHeight: font20.lineHeight,
                          }}
                          className={
                            themeName === "dark-theme"
                              ? "soft-grey-dark-theme-text-variant-1 chirp-bold-font mt-3"
                              : "very-dark-gray-light-theme-text-variant-1 chirp-bold-font mt-3"
                          }
                        >
                          Contacts
                        </div>
                        <div
                          style={{
                            fontSize: font20.fontSize,
                            lineHeight: font20.lineHeight,
                          }}
                          className={
                            themeName === "dark-theme"
                              ? "soft-grey-dark-theme-text-variant-1 chirp-bold-font mt-3"
                              : "very-dark-gray-light-theme-text-variant-1 chirp-bold-font mt-3"
                          }
                        >
                          Uploaded contacts
                        </div>
                        <div
                          style={{
                            fontSize: font15.fontSize,
                            lineHeight: font15.lineHeight,
                          }}
                          className={
                            themeName === "dark-theme"
                              ? "soft-grey-dark-theme-text-variant-2 chirp-regular-font mt-3"
                              : "very-dark-gray-light-theme-text-variant-2 chirp-regular-font mt-3"
                          }
                        >
                          C uses your uploaded contacts to personalize content,
                          such as making suggestions and showing accounts and
                          Tweets for you and others. You can remove any contacts
                          you’ve previously uploaded which also turns off
                          syncing on all your devices.{" "}
                          <span className="hover-blue-underline">
                            Learn more
                          </span>
                        </div>
                        <div
                          style={{
                            fontSize: font15.fontSize,
                            lineHeight: font15.lineHeight,
                          }}
                          className={
                            themeName === "dark-theme"
                              ? "soft-grey-dark-theme-text-variant-1 chirp-regular-font mt-3"
                              : "very-dark-gray-light-theme-text-variant-1 chirp-regular-font mt-3"
                          }
                        >
                          Uploaded contacts
                        </div>
                        <div
                          style={{
                            fontSize: font13.fontSize,
                            lineHeight: font13.lineHeight,
                          }}
                          className={
                            themeName === "dark-theme"
                              ? "soft-grey-dark-theme-text-variant-2 chirp-regular-font mt-3"
                              : "very-dark-gray-light-theme-text-variant-2 chirp-regular-font mt-3"
                          }
                        >
                          C uses your uploaded contacts to personalize content,
                          such as making suggestions and showing accounts and
                          Tweets for you and others. You can remove any contacts
                          you’ve previously uploaded which also turns off
                          syncing on all your devices.{" "}
                          <span className="hover-blue-underline">
                            Learn more
                          </span>
                        </div>

                        <div
                          onClick={() => {
                            if (!notRemoved) {
                              openRemoveContactsModal();
                            }
                          }}
                          className={
                            themeName === "dark-theme" && !notRemoved
                              ? "mt-4 chirp-bold-font deactivate-btn-dark-theme"
                              : themeName !== "dark-theme" && !notRemoved
                              ? "mt-4 chirp-bold-font deactivate-btn-light-theme"
                              : "mt-4 chirp-bold-font"
                          }
                          style={{
                            fontSize: font15.fontSize,
                            lineHeight: font15.lineHeight,
                            color: showRemoveContactsModal
                              ? "#92171C"
                              : "rgb(244, 33, 46)",
                            textAlign: "center",
                            borderRadius: "9999px",
                            padding: "8px 0px",
                            cursor: !notRemoved ? "pointer" : "default",
                            opacity: notRemoved ? "0.5" : "",
                          }}
                        >
                          Remove all contacts
                        </div>
                      </div>
                    </div>
                    <div
                      onClick={() => {
                        // setCountry(test);
                        // setTest(country);
                        setNotRemoved(null);
                        setLoading(true);
                        setTimeout(() => {
                          setTabIndex(1);
                          handleAddCountry();
                          setShowModal(false);
                        }, 300);
                        setTimeout(() => {
                          setLoading(false);
                        }, 600);
                      }}
                      style={{
                        width: "100%",
                        padding: width <= 700 ? "32px" : "32px 80px",
                        position: "absolute",
                        bottom: "0px",
                        filter:
                          themeName === "dark-theme"
                            ? "drop-shadow(rgb(51, 54, 57) 1px -1px 1px)"
                            : "",
                        boxShadow:
                          themeName === "dark-theme"
                            ? "inset 0px 4px 3px -3px rgba(50, 50, 50, 0.75)"
                            : "inset 0px 4px 3px -3px rgba(101, 119, 134, 0.15)",
                      }}
                    >
                      <Button
                        className={
                          themeName === "dark-theme"
                            ? "background-hover-next-btn-dark-theme soft-grey-dark-theme-text-variant-1 chirp-bold-font"
                            : "background-hover-next-btn-light-theme very-dark-gray-light-theme-text-variant-1 chirp-bold-font"
                        }
                        style={{
                          width: "100%",
                          minHeight: "52px",
                          border: "none",
                          outlineStyle: "none",
                        }}
                      >
                        <span>Agree</span>
                      </Button>
                    </div>
                  </>
                ) : tabIndex === "email_updates" ? (
                  <>
                    <div
                      style={{
                        position: "absolute",
                        left: "0px",
                        top: "2px",
                      }}
                      className="settings-header-with-arrow "
                    >
                      <div
                        onClick={() => {
                          setTabIndex(2);
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
                          marginRight: "5px",
                        }}
                      >
                        {" "}
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
                      </div>
                    </div>{" "}
                    <div
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",

                        backgroundColor:
                          themeName === "dark-theme" ? "black" : "white",
                        maxHeight: "53px",
                        alignItems: "center",
                        borderRadius: "inherit",
                      }}
                      className="icon"
                    >
                      <div
                        style={{
                          position: "relative",
                          borderRadius: "50%",
                          width: "50px",
                          height: "50px",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
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
                              filter:
                                "drop-shadow(0 0 10px rgba(0, 0, 0, 0.5))",
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
                    </div>
                    <div
                      style={{
                        fontSize: font23.fontSize,
                        lineHeight: font23.lineHeight,
                        width: "100%",
                        paddingLeft: width <= 700 ? "32px" : "80px",
                        paddingRight: width <= 700 ? "32px" : "80px",
                      }}
                      className={
                        themeName === "dark-theme"
                          ? "soft-grey-dark-theme-text-variant-1 chirp-bold-font mt-3 "
                          : "very-dark-gray-light-theme-text-variant-1 chirp-bold-font mt-3 "
                      }
                    >
                      Email updates
                    </div>
                    <div
                      className="mt-3"
                      style={{
                        width: "100%",
                        paddingLeft: width <= 700 ? "32px" : "80px",
                        paddingRight: width <= 700 ? "32px" : "80px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <div
                          className={
                            themeName === "dark-theme"
                              ? "soft-grey-dark-theme-text-variant-1 chirp-regular-font"
                              : "very-dark-gray-light-theme-text-variant-1 chirp-regular-font"
                          }
                        >
                          New notifications
                        </div>
                        <div>
                          {" "}
                          <div
                            onClick={() =>
                              setNewNotifications(!newNotifications)
                            }
                            style={{
                              marginRight: "36px",
                              width: "36px",
                              height: "36px",
                              borderRadius: "50%",
                              cursor: "pointer",
                              position: "relative",
                              left: "30px",
                            }}
                            className={
                              themeName === "dark-theme" && newNotifications
                                ? "hover-background-effect-clicked-dark-theme"
                                : themeName !== "dark-theme" && newNotifications
                                ? "hover-background-effect-clicked-light-theme"
                                : themeName === "dark-theme" &&
                                  !newNotifications
                                ? "hover-background-effect-dark-theme"
                                : themeName !== "dark-theme" &&
                                  !newNotifications
                                ? "hover-background-effect-light-theme"
                                : ""
                            }
                          >
                            <div
                              style={{
                                backgroundColor: newNotifications
                                  ? "#1d9bf0"
                                  : "transparent",
                                border: newNotifications
                                  ? ""
                                  : themeName === "dark-theme"
                                  ? "2px solid rgb(70,70,70)"
                                  : "2px solid #0f141a",

                                borderWidth: "2px ",
                                width: "20px",
                                height: "20px",
                                position: "relative",
                                left: "8px",
                                top: "8px",
                                borderRadius: "3px",
                              }}
                            >
                              <svg
                                style={{
                                  position: "relative",
                                  left: "2px",
                                  bottom: "4px",
                                  display: newNotifications
                                    ? "initial"
                                    : "none",
                                }}
                                width={16}
                                height={16}
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                                className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-jwli3a r-1hjwoze r-12ym1je"
                                color="white"
                                fill="currentColor"
                              >
                                <g>
                                  <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                </g>
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <div
                          className={
                            themeName === "dark-theme"
                              ? "soft-grey-dark-theme-text-variant-1 chirp-regular-font"
                              : "very-dark-gray-light-theme-text-variant-1 chirp-regular-font"
                          }
                        >
                          Direct Messages
                        </div>
                        <div>
                          {" "}
                          <div
                            onClick={() => setDirectMessages(!directMessages)}
                            style={{
                              marginRight: "36px",
                              width: "36px",
                              height: "36px",
                              borderRadius: "50%",
                              cursor: "pointer",
                              position: "relative",
                              left: "30px",
                            }}
                            className={
                              themeName === "dark-theme" && directMessages
                                ? "hover-background-effect-clicked-dark-theme"
                                : themeName !== "dark-theme" && directMessages
                                ? "hover-background-effect-clicked-light-theme"
                                : themeName === "dark-theme" && !directMessages
                                ? "hover-background-effect-dark-theme"
                                : themeName !== "dark-theme" && !directMessages
                                ? "hover-background-effect-light-theme"
                                : ""
                            }
                          >
                            <div
                              style={{
                                backgroundColor: directMessages
                                  ? "#1d9bf0"
                                  : "transparent",
                                border: directMessages
                                  ? ""
                                  : themeName === "dark-theme"
                                  ? "2px solid rgb(70,70,70)"
                                  : "2px solid #0f141a",

                                borderWidth: "2px ",
                                width: "20px",
                                height: "20px",
                                position: "relative",
                                left: "8px",
                                top: "8px",
                                borderRadius: "3px",
                              }}
                            >
                              <svg
                                style={{
                                  position: "relative",
                                  left: "2px",
                                  bottom: "4px",
                                  display: directMessages ? "initial" : "none",
                                }}
                                width={16}
                                height={16}
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                                className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-jwli3a r-1hjwoze r-12ym1je"
                                color="white"
                                fill="currentColor"
                              >
                                <g>
                                  <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                </g>
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <div
                          className={
                            themeName === "dark-theme"
                              ? "soft-grey-dark-theme-text-variant-1 chirp-regular-font"
                              : "very-dark-gray-light-theme-text-variant-1 chirp-regular-font"
                          }
                        >
                          Someone emails you a Tweet
                        </div>
                        <div>
                          {" "}
                          <div
                            onClick={() =>
                              setEmails_you_a_tweet(!emails_you_a_tweet)
                            }
                            style={{
                              marginRight: "36px",
                              width: "36px",
                              height: "36px",
                              borderRadius: "50%",
                              cursor: "pointer",
                              position: "relative",
                              left: "30px",
                            }}
                            className={
                              themeName === "dark-theme" && emails_you_a_tweet
                                ? "hover-background-effect-clicked-dark-theme"
                                : themeName !== "dark-theme" &&
                                  emails_you_a_tweet
                                ? "hover-background-effect-clicked-light-theme"
                                : themeName === "dark-theme" &&
                                  !emails_you_a_tweet
                                ? "hover-background-effect-dark-theme"
                                : themeName !== "dark-theme" &&
                                  !emails_you_a_tweet
                                ? "hover-background-effect-light-theme"
                                : ""
                            }
                          >
                            <div
                              style={{
                                backgroundColor: emails_you_a_tweet
                                  ? "#1d9bf0"
                                  : "transparent",
                                border: emails_you_a_tweet
                                  ? ""
                                  : themeName === "dark-theme"
                                  ? "2px solid rgb(70,70,70)"
                                  : "2px solid #0f141a",

                                borderWidth: "2px ",
                                width: "20px",
                                height: "20px",
                                position: "relative",
                                left: "8px",
                                top: "8px",
                                borderRadius: "3px",
                              }}
                            >
                              <svg
                                style={{
                                  position: "relative",
                                  left: "2px",
                                  bottom: "4px",
                                  display: emails_you_a_tweet
                                    ? "initial"
                                    : "none",
                                }}
                                width={16}
                                height={16}
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                                className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-jwli3a r-1hjwoze r-12ym1je"
                                color="white"
                                fill="currentColor"
                              >
                                <g>
                                  <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                </g>
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <div
                          className={
                            themeName === "dark-theme"
                              ? "soft-grey-dark-theme-text-variant-1 chirp-regular-font"
                              : "very-dark-gray-light-theme-text-variant-1 chirp-regular-font"
                          }
                        >
                          Top Tweets and stories
                        </div>
                        <div>
                          {" "}
                          <div
                            onClick={() =>
                              setTop_tweets_and_stories(!top_tweets_and_stories)
                            }
                            style={{
                              marginRight: "36px",
                              width: "36px",
                              height: "36px",
                              borderRadius: "50%",
                              cursor: "pointer",
                              position: "relative",
                              left: "30px",
                            }}
                            className={
                              themeName === "dark-theme" &&
                              top_tweets_and_stories
                                ? "hover-background-effect-clicked-dark-theme"
                                : themeName !== "dark-theme" &&
                                  top_tweets_and_stories
                                ? "hover-background-effect-clicked-light-theme"
                                : themeName === "dark-theme" &&
                                  !top_tweets_and_stories
                                ? "hover-background-effect-dark-theme"
                                : themeName !== "dark-theme" &&
                                  !top_tweets_and_stories
                                ? "hover-background-effect-light-theme"
                                : ""
                            }
                          >
                            <div
                              style={{
                                backgroundColor: top_tweets_and_stories
                                  ? "#1d9bf0"
                                  : "transparent",
                                border: top_tweets_and_stories
                                  ? ""
                                  : themeName === "dark-theme"
                                  ? "2px solid rgb(70,70,70)"
                                  : "2px solid #0f141a",

                                borderWidth: "2px ",
                                width: "20px",
                                height: "20px",
                                position: "relative",
                                left: "8px",
                                top: "8px",
                                borderRadius: "3px",
                              }}
                            >
                              <svg
                                style={{
                                  position: "relative",
                                  left: "2px",
                                  bottom: "4px",
                                  display: top_tweets_and_stories
                                    ? "initial"
                                    : "none",
                                }}
                                width={16}
                                height={16}
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                                className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-jwli3a r-1hjwoze r-12ym1je"
                                color="white"
                                fill="currentColor"
                              >
                                <g>
                                  <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                </g>
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <div
                          className={
                            themeName === "dark-theme"
                              ? "soft-grey-dark-theme-text-variant-1 chirp-regular-font"
                              : "very-dark-gray-light-theme-text-variant-1 chirp-regular-font"
                          }
                        >
                          Updates about the performance of your Tweets
                        </div>
                        <div>
                          {" "}
                          <div
                            onClick={() =>
                              setUpdatesOption_first(!updatesOption_first)
                            }
                            style={{
                              marginRight: "36px",
                              width: "36px",
                              height: "36px",
                              borderRadius: "50%",
                              cursor: "pointer",
                              position: "relative",
                              left: "30px",
                            }}
                            className={
                              themeName === "dark-theme" && updatesOption_first
                                ? "hover-background-effect-clicked-dark-theme"
                                : themeName !== "dark-theme" &&
                                  updatesOption_first
                                ? "hover-background-effect-clicked-light-theme"
                                : themeName === "dark-theme" &&
                                  !updatesOption_first
                                ? "hover-background-effect-dark-theme"
                                : themeName !== "dark-theme" &&
                                  !updatesOption_first
                                ? "hover-background-effect-light-theme"
                                : ""
                            }
                          >
                            <div
                              style={{
                                backgroundColor: updatesOption_first
                                  ? "#1d9bf0"
                                  : "transparent",
                                border: updatesOption_first
                                  ? ""
                                  : themeName === "dark-theme"
                                  ? "2px solid rgb(70,70,70)"
                                  : "2px solid #0f141a",

                                borderWidth: "2px ",
                                width: "20px",
                                height: "20px",
                                position: "relative",
                                left: "8px",
                                top: "8px",
                                borderRadius: "3px",
                              }}
                            >
                              <svg
                                style={{
                                  position: "relative",
                                  left: "2px",
                                  bottom: "4px",
                                  display: updatesOption_first
                                    ? "initial"
                                    : "none",
                                }}
                                width={16}
                                height={16}
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                                className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-jwli3a r-1hjwoze r-12ym1je"
                                color="white"
                                fill="currentColor"
                              >
                                <g>
                                  <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                </g>
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <div
                          className={
                            themeName === "dark-theme"
                              ? "soft-grey-dark-theme-text-variant-1 chirp-regular-font"
                              : "very-dark-gray-light-theme-text-variant-1 chirp-regular-font"
                          }
                        >
                          Updates about C products and features
                        </div>
                        <div>
                          {" "}
                          <div
                            onClick={() =>
                              setUpdatesOption_second(!updatesOption_second)
                            }
                            style={{
                              marginRight: "36px",
                              width: "36px",
                              height: "36px",
                              borderRadius: "50%",
                              cursor: "pointer",
                              position: "relative",
                              left: "30px",
                            }}
                            className={
                              themeName === "dark-theme" && updatesOption_second
                                ? "hover-background-effect-clicked-dark-theme"
                                : themeName !== "dark-theme" &&
                                  updatesOption_second
                                ? "hover-background-effect-clicked-light-theme"
                                : themeName === "dark-theme" &&
                                  !updatesOption_second
                                ? "hover-background-effect-dark-theme"
                                : themeName !== "dark-theme" &&
                                  !updatesOption_second
                                ? "hover-background-effect-light-theme"
                                : ""
                            }
                          >
                            <div
                              style={{
                                backgroundColor: updatesOption_second
                                  ? "#1d9bf0"
                                  : "transparent",
                                border: updatesOption_second
                                  ? ""
                                  : themeName === "dark-theme"
                                  ? "2px solid rgb(70,70,70)"
                                  : "2px solid #0f141a",

                                borderWidth: "2px ",
                                width: "20px",
                                height: "20px",
                                position: "relative",
                                left: "8px",
                                top: "8px",
                                borderRadius: "3px",
                              }}
                            >
                              <svg
                                style={{
                                  position: "relative",
                                  left: "2px",
                                  bottom: "4px",
                                  display: updatesOption_second
                                    ? "initial"
                                    : "none",
                                }}
                                width={16}
                                height={16}
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                                className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-jwli3a r-1hjwoze r-12ym1je"
                                color="white"
                                fill="currentColor"
                              >
                                <g>
                                  <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                </g>
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <div
                          className={
                            themeName === "dark-theme"
                              ? "soft-grey-dark-theme-text-variant-1 chirp-regular-font"
                              : "very-dark-gray-light-theme-text-variant-1 chirp-regular-font"
                          }
                        >
                          Tips about getting more from C
                        </div>
                        <div>
                          {" "}
                          <div
                            onClick={() =>
                              setTips_more_from_c(!tips_more_from_c)
                            }
                            style={{
                              marginRight: "36px",
                              width: "36px",
                              height: "36px",
                              borderRadius: "50%",
                              cursor: "pointer",
                              position: "relative",
                              left: "30px",
                            }}
                            className={
                              themeName === "dark-theme" && tips_more_from_c
                                ? "hover-background-effect-clicked-dark-theme"
                                : themeName !== "dark-theme" && tips_more_from_c
                                ? "hover-background-effect-clicked-light-theme"
                                : themeName === "dark-theme" &&
                                  !tips_more_from_c
                                ? "hover-background-effect-dark-theme"
                                : themeName !== "dark-theme" &&
                                  !tips_more_from_c
                                ? "hover-background-effect-light-theme"
                                : ""
                            }
                          >
                            <div
                              style={{
                                backgroundColor: tips_more_from_c
                                  ? "#1d9bf0"
                                  : "transparent",
                                border: tips_more_from_c
                                  ? ""
                                  : themeName === "dark-theme"
                                  ? "2px solid rgb(70,70,70)"
                                  : "2px solid #0f141a",

                                borderWidth: "2px ",
                                width: "20px",
                                height: "20px",
                                position: "relative",
                                left: "8px",
                                top: "8px",
                                borderRadius: "3px",
                              }}
                            >
                              <svg
                                style={{
                                  position: "relative",
                                  left: "2px",
                                  bottom: "4px",
                                  display: tips_more_from_c
                                    ? "initial"
                                    : "none",
                                }}
                                width={16}
                                height={16}
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                                className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-jwli3a r-1hjwoze r-12ym1je"
                                color="white"
                                fill="currentColor"
                              >
                                <g>
                                  <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                </g>
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <div
                          className={
                            themeName === "dark-theme"
                              ? "soft-grey-dark-theme-text-variant-1 chirp-regular-font"
                              : "very-dark-gray-light-theme-text-variant-1 chirp-regular-font"
                          }
                        >
                          Things you’ve missed since you logged in to C
                        </div>
                        <div>
                          {" "}
                          <div
                            onClick={() =>
                              setThings_you_missed(!things_you_missed)
                            }
                            style={{
                              marginRight: "36px",
                              width: "36px",
                              height: "36px",
                              borderRadius: "50%",
                              cursor: "pointer",
                              position: "relative",
                              left: "30px",
                            }}
                            className={
                              themeName === "dark-theme" && things_you_missed
                                ? "hover-background-effect-clicked-dark-theme"
                                : themeName !== "dark-theme" &&
                                  things_you_missed
                                ? "hover-background-effect-clicked-light-theme"
                                : themeName === "dark-theme" &&
                                  !things_you_missed
                                ? "hover-background-effect-dark-theme"
                                : themeName !== "dark-theme" &&
                                  !things_you_missed
                                ? "hover-background-effect-light-theme"
                                : ""
                            }
                          >
                            <div
                              style={{
                                backgroundColor: things_you_missed
                                  ? "#1d9bf0"
                                  : "transparent",
                                border: things_you_missed
                                  ? ""
                                  : themeName === "dark-theme"
                                  ? "2px solid rgb(70,70,70)"
                                  : "2px solid #0f141a",

                                borderWidth: "2px ",
                                width: "20px",
                                height: "20px",
                                position: "relative",
                                left: "8px",
                                top: "8px",
                                borderRadius: "3px",
                              }}
                            >
                              <svg
                                style={{
                                  position: "relative",
                                  left: "2px",
                                  bottom: "4px",
                                  display: things_you_missed
                                    ? "initial"
                                    : "none",
                                }}
                                width={16}
                                height={16}
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                                className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-jwli3a r-1hjwoze r-12ym1je"
                                color="white"
                                fill="currentColor"
                              >
                                <g>
                                  <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                </g>
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <div
                          className={
                            themeName === "dark-theme"
                              ? "soft-grey-dark-theme-text-variant-1 chirp-regular-font"
                              : "very-dark-gray-light-theme-text-variant-1 chirp-regular-font"
                          }
                        >
                          News about C on partner products and other third-party
                          services
                        </div>
                        <div>
                          {" "}
                          <div
                            onClick={() => setNews_about_c(!news_about_c)}
                            style={{
                              marginRight: "36px",
                              width: "36px",
                              height: "36px",
                              borderRadius: "50%",
                              cursor: "pointer",
                              position: "relative",
                              left: "30px",
                            }}
                            className={
                              themeName === "dark-theme" && news_about_c
                                ? "hover-background-effect-clicked-dark-theme"
                                : themeName !== "dark-theme" && news_about_c
                                ? "hover-background-effect-clicked-light-theme"
                                : themeName === "dark-theme" && !news_about_c
                                ? "hover-background-effect-dark-theme"
                                : themeName !== "dark-theme" && !news_about_c
                                ? "hover-background-effect-light-theme"
                                : ""
                            }
                          >
                            <div
                              style={{
                                backgroundColor: news_about_c
                                  ? "#1d9bf0"
                                  : "transparent",
                                border: news_about_c
                                  ? ""
                                  : themeName === "dark-theme"
                                  ? "2px solid rgb(70,70,70)"
                                  : "2px solid #0f141a",

                                borderWidth: "2px ",
                                width: "20px",
                                height: "20px",
                                position: "relative",
                                left: "8px",
                                top: "8px",
                                borderRadius: "3px",
                              }}
                            >
                              <svg
                                style={{
                                  position: "relative",
                                  left: "2px",
                                  bottom: "4px",
                                  display: news_about_c ? "initial" : "none",
                                }}
                                width={16}
                                height={16}
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                                className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-jwli3a r-1hjwoze r-12ym1je"
                                color="white"
                                fill="currentColor"
                              >
                                <g>
                                  <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                </g>
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        className="mt-2"
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <div
                          className={
                            themeName === "dark-theme"
                              ? "soft-grey-dark-theme-text-variant-1 chirp-regular-font"
                              : "very-dark-gray-light-theme-text-variant-1 chirp-regular-font"
                          }
                        >
                          Participation in C research surveys
                        </div>
                        <div>
                          {" "}
                          <div
                            onClick={() =>
                              setParticipation_in_c(!participation_in_c)
                            }
                            style={{
                              marginRight: "36px",
                              width: "36px",
                              height: "36px",
                              borderRadius: "50%",
                              cursor: "pointer",
                              position: "relative",
                              left: "30px",
                            }}
                            className={
                              themeName === "dark-theme" && participation_in_c
                                ? "hover-background-effect-clicked-dark-theme"
                                : themeName !== "dark-theme" &&
                                  participation_in_c
                                ? "hover-background-effect-clicked-light-theme"
                                : themeName === "dark-theme" &&
                                  !participation_in_c
                                ? "hover-background-effect-dark-theme"
                                : themeName !== "dark-theme" &&
                                  !participation_in_c
                                ? "hover-background-effect-light-theme"
                                : ""
                            }
                          >
                            <div
                              style={{
                                backgroundColor: participation_in_c
                                  ? "#1d9bf0"
                                  : "transparent",
                                border: participation_in_c
                                  ? ""
                                  : themeName === "dark-theme"
                                  ? "2px solid rgb(70,70,70)"
                                  : "2px solid #0f141a",

                                borderWidth: "2px ",
                                width: "20px",
                                height: "20px",
                                position: "relative",
                                left: "8px",
                                top: "8px",
                                borderRadius: "3px",
                              }}
                            >
                              <svg
                                style={{
                                  position: "relative",
                                  left: "2px",
                                  bottom: "4px",
                                  display: participation_in_c
                                    ? "initial"
                                    : "none",
                                }}
                                width={16}
                                height={16}
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                                className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-jwli3a r-1hjwoze r-12ym1je"
                                color="white"
                                fill="currentColor"
                              >
                                <g>
                                  <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                </g>
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <div
                          className={
                            themeName === "dark-theme"
                              ? "soft-grey-dark-theme-text-variant-1 chirp-regular-font"
                              : "very-dark-gray-light-theme-text-variant-1 chirp-regular-font"
                          }
                        >
                          Suggestions for recommended accounts
                        </div>
                        <div>
                          {" "}
                          <div
                            onClick={() =>
                              setSuggestions_for_recommendeed_accounts(
                                !suggestions_for_recommendeed_accounts
                              )
                            }
                            style={{
                              marginRight: "36px",
                              width: "36px",
                              height: "36px",
                              borderRadius: "50%",
                              cursor: "pointer",
                              position: "relative",
                              left: "30px",
                            }}
                            className={
                              themeName === "dark-theme" &&
                              suggestions_for_recommendeed_accounts
                                ? "hover-background-effect-clicked-dark-theme"
                                : themeName !== "dark-theme" &&
                                  suggestions_for_recommendeed_accounts
                                ? "hover-background-effect-clicked-light-theme"
                                : themeName === "dark-theme" &&
                                  !suggestions_for_recommendeed_accounts
                                ? "hover-background-effect-dark-theme"
                                : themeName !== "dark-theme" &&
                                  !suggestions_for_recommendeed_accounts
                                ? "hover-background-effect-light-theme"
                                : ""
                            }
                          >
                            <div
                              style={{
                                backgroundColor:
                                  suggestions_for_recommendeed_accounts
                                    ? "#1d9bf0"
                                    : "transparent",
                                border: suggestions_for_recommendeed_accounts
                                  ? ""
                                  : themeName === "dark-theme"
                                  ? "2px solid rgb(70,70,70)"
                                  : "2px solid #0f141a",

                                borderWidth: "2px ",
                                width: "20px",
                                height: "20px",
                                position: "relative",
                                left: "8px",
                                top: "8px",
                                borderRadius: "3px",
                              }}
                            >
                              <svg
                                style={{
                                  position: "relative",
                                  left: "2px",
                                  bottom: "4px",
                                  display: suggestions_for_recommendeed_accounts
                                    ? "initial"
                                    : "none",
                                }}
                                width={16}
                                height={16}
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                                className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-jwli3a r-1hjwoze r-12ym1je"
                                color="white"
                                fill="currentColor"
                              >
                                <g>
                                  <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                </g>
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <div
                          className={
                            themeName === "dark-theme"
                              ? "soft-grey-dark-theme-text-variant-1 chirp-regular-font"
                              : "very-dark-gray-light-theme-text-variant-1 chirp-regular-font"
                          }
                        >
                          Suggestions based on your recent follows
                        </div>
                        <div>
                          {" "}
                          <div
                            onClick={() =>
                              setSuggestions_basend_on_recent_follows(
                                !suggestions_basend_on_recent_follows
                              )
                            }
                            style={{
                              marginRight: "36px",
                              width: "36px",
                              height: "36px",
                              borderRadius: "50%",
                              cursor: "pointer",
                              position: "relative",
                              left: "30px",
                            }}
                            className={
                              themeName === "dark-theme" &&
                              suggestions_basend_on_recent_follows
                                ? "hover-background-effect-clicked-dark-theme"
                                : themeName !== "dark-theme" &&
                                  suggestions_basend_on_recent_follows
                                ? "hover-background-effect-clicked-light-theme"
                                : themeName === "dark-theme" &&
                                  !suggestions_basend_on_recent_follows
                                ? "hover-background-effect-dark-theme"
                                : themeName !== "dark-theme" &&
                                  !suggestions_basend_on_recent_follows
                                ? "hover-background-effect-light-theme"
                                : ""
                            }
                          >
                            <div
                              style={{
                                backgroundColor:
                                  suggestions_basend_on_recent_follows
                                    ? "#1d9bf0"
                                    : "transparent",
                                border: suggestions_basend_on_recent_follows
                                  ? ""
                                  : themeName === "dark-theme"
                                  ? "2px solid rgb(70,70,70)"
                                  : "2px solid #0f141a",

                                borderWidth: "2px ",
                                width: "20px",
                                height: "20px",
                                position: "relative",
                                left: "8px",
                                top: "8px",
                                borderRadius: "3px",
                              }}
                            >
                              <svg
                                style={{
                                  position: "relative",
                                  left: "2px",
                                  bottom: "4px",
                                  display: suggestions_basend_on_recent_follows
                                    ? "initial"
                                    : "none",
                                }}
                                width={16}
                                height={16}
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                                className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-jwli3a r-1hjwoze r-12ym1je"
                                color="white"
                                fill="currentColor"
                              >
                                <g>
                                  <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                </g>
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <div
                          className={
                            themeName === "dark-theme"
                              ? "soft-grey-dark-theme-text-variant-1 chirp-regular-font"
                              : "very-dark-gray-light-theme-text-variant-1 chirp-regular-font"
                          }
                        >
                          Tips on C business products
                        </div>
                        <div>
                          {" "}
                          <div
                            onClick={() =>
                              setTips_on_c_business_products(
                                !tips_on_c_business_products
                              )
                            }
                            style={{
                              marginRight: "36px",
                              width: "36px",
                              height: "36px",
                              borderRadius: "50%",
                              cursor: "pointer",
                              position: "relative",
                              left: "30px",
                            }}
                            className={
                              themeName === "dark-theme" &&
                              tips_on_c_business_products
                                ? "hover-background-effect-clicked-dark-theme"
                                : themeName !== "dark-theme" &&
                                  tips_on_c_business_products
                                ? "hover-background-effect-clicked-light-theme"
                                : themeName === "dark-theme" &&
                                  !tips_on_c_business_products
                                ? "hover-background-effect-dark-theme"
                                : themeName !== "dark-theme" &&
                                  !tips_on_c_business_products
                                ? "hover-background-effect-light-theme"
                                : ""
                            }
                          >
                            <div
                              style={{
                                backgroundColor: tips_on_c_business_products
                                  ? "#1d9bf0"
                                  : "transparent",
                                border: tips_on_c_business_products
                                  ? ""
                                  : themeName === "dark-theme"
                                  ? "2px solid rgb(70,70,70)"
                                  : "2px solid #0f141a",

                                borderWidth: "2px ",
                                width: "20px",
                                height: "20px",
                                position: "relative",
                                left: "8px",
                                top: "8px",
                                borderRadius: "3px",
                              }}
                            >
                              <svg
                                style={{
                                  position: "relative",
                                  left: "2px",
                                  bottom: "4px",
                                  display: tips_on_c_business_products
                                    ? "initial"
                                    : "none",
                                }}
                                width={16}
                                height={16}
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                                className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-jwli3a r-1hjwoze r-12ym1je"
                                color="white"
                                fill="currentColor"
                              >
                                <g>
                                  <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                </g>
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                ) : null}
              </>
            ) : (
              <>
                <div
                  style={{
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
                    fontSize={true}
                  ></LoadingSpinner>
                </div>
              </>
            )}
          </Modal.Body>
        </Modal>
      </>
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
                : "1px solid rgb(70, 70, 70)"
              : null,
          borderRight:
            themeName !== "dark-theme"
              ? "1px solid rgba(0, 0, 0, 0.1)"
              : "1px solid rgb(70, 70, 70)",
          borderTop: "none ",
          borderBottom: "none",
          padding: "0px",
          margin: "0px",
          width: width > 1400 ? "600px" : width <= 500 ? "100%" : null,
          position: "relative",
          right: "10px",
        }}
      >
        {" "}
        <div className="settings-header-with-arrow ">
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
              marginRight: "5px",
            }}
          >
            {" "}
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
          </div>
          <div
            style={{
              fontSize: font20.fontSize,
              lineHeight: font20.lineHeight,
            }}
            className={
              themeName === "dark-theme"
                ? "mt-2 first-head chirp-bold-font soft-grey-dark-theme-text-variant-1"
                : "mt-2 first-head chirp-bold-font very-dark-gray-light-theme-text-variant-1"
            }
          >
            Change country
          </div>
        </div>{" "}
        <div
          className="mt-4"
          style={{
            paddingLeft: "16px",
            paddingRight: "16px",
          }}
        >
          <div
            onClick={handleShowOptions}
            style={{
              borderRadius: "4px",
              cursor: "pointer",
              color: "#536471",
              width: "100%",
              minHeight: "58px",
              padding: "4px",
              border: "1px solid rgb(207, 217, 222)",
              borderWidth: showPopoverCountries ? "2px" : "1px",
              borderColor: showPopoverCountries
                ? "#1d9bf0"
                : themeName === "dark-theme"
                ? "rgb(70,70,70)"
                : "#cfd9de",
            }}
          >
            <div
              onClick={handleShowOptions}
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <div
                onClick={handleShowOptions}
                className="main-outline-text-year-picker chirp-regular-font"
                style={{
                  padding: "0px 8px",
                  fontSize: font13.fontSize,
                  lineHeight: font13.lineHeight,
                  color: showPopoverCountries
                    ? "#1d9bf0"
                    : "rgba(83,100,113,1.00)",
                }}
              >
                <span
                  style={{
                    color: themeName === "dark-theme" ? "#71767A" : "",
                  }}
                >
                  Country
                </span>
                <div
                  onClick={handleShowOptions}
                  className={
                    themeName === "dark-theme"
                      ? "soft-grey-dark-theme-text-variant-1 mt-2 selected-year-string-parent-div"
                      : "very-dark-gray-light-theme-text-variant-1 mt-2 selected-year-string-parent-div"
                  }
                  style={{
                    fontSize: font17.fontSize,
                    lineHeight: font17.lineHeight,
                    color: themeName === "dark-theme" ? "white" : "black",
                  }}
                >
                  {user.country ? <>{user.country}</> : <> {en[test]}</>}
                </div>
              </div>
              <div
                onClick={handleShowOptions}
                style={{
                  position: "relative",
                  top: "10px",
                }}
              >
                <svg
                  onClick={handleShowOptions}
                  width="24"
                  height="24"
                  color={
                    showPopoverCountries
                      ? "#1d9bf0"
                      : themeName === "dark-theme"
                      ? "rgb(70,70,70)"
                      : "rgba(83,100,113,1.00)"
                  }
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="svg-year-picker r-4qtqp9 r-yyyyoo r-dnmrzs r-1plcrui r-lrvibr r-14j79pv r-1pgswnq r-50lct3 r-fdch1b r-633pao r-u8s1d r-1v2oles"
                >
                  <g
                    onClick={handleShowOptions}
                    className="path-parent-g-year-picker"
                  >
                    <path
                      onClick={handleShowOptions}
                      d="M3.543 8.96l1.414-1.42L12 14.59l7.043-7.05 1.414 1.42L12 17.41 3.543 8.96z"
                    ></path>
                  </g>
                </svg>
              </div>
            </div>
          </div>{" "}
          <select
            onClick={handleShowOptions}
            onBlur={() => setShowPopoverCountries(false)}
            ref={selectRef}
            style={{
              position: "relative",
              bottom: "58px",
              borderRadius: "4px",
              cursor: "pointer",
              color: "#536471",
              width: "100%",
              minHeight: "58px",
              padding: "4px",
              border: "1px solid rgb(207, 217, 222)",
              borderWidth: showPopoverCountries ? "2px" : "1px",
              opacity: 0,
            }}
            value={country}
            onChange={(e) => {
              handleSelectChange(e);
            }}
          >
            <option value="">{en["ZZ"]}</option>
            {sortedCountries.map((country, index) => (
              <option key={country._id} value={country}>
                {en[country]}
              </option>
            ))}
          </select>
        </div>
        <div
          style={{
            fontSize: font13.fontSize,
            lineHeight: "20px",
            paddingLeft: "24px",
            paddingRight: "24px",
            position: "relative",
            bottom: "55px",
          }}
          className={
            themeName === "dark-theme"
              ? "chirp-regular-font soft-grey-dark-theme-text-variant-2"
              : "chirp-regular-font very-dark-gray-light-theme-text-variant-2"
          }
        >
          This is the primary country associated with your account. Your country
          helps us to customize your C experience.{" "}
          <span className="hover-blue-underline">Learn more</span>
        </div>
      </Col>
    </>
  );
}

export default Country;
