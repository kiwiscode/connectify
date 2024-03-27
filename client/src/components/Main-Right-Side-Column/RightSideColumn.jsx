import { useContext, useEffect, useRef, useState } from "react";
import { Button, Col, Stack, Modal, Row } from "react-bootstrap";
import axios from "axios";
import { UserContext } from "../../context/UserContext";
import { Link, useNavigate } from "react-router-dom";
import { List } from "antd";
import useWindowDimensions from "../../hooks/getWindowDimensions";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import LoadingSpinner from "../ui/LoadingSpinner";

// when working on local version
const API_URL = "http://localhost:3000";
// when working on deployment version
// ?

function RightSideColumn({
  handleSetSearchTerm,
  searchTerm,
  setSearchTerm,
  filteredSearchResult,
  onModalToggle,
  tabIndexValue,
}) {
  const { getToken, userInfo, logout } = useContext(UserContext);
  const [onFocus, setOnFocus] = useState(false);
  const [user, setUser] = useState([]);
  const [isHovered, setIsHovered] = useState("");
  const navigate = useNavigate();
  const [closeDeleteSearchTermBtn, setCloseDeleteSearchTermBtn] =
    useState(false);
  const onFocusActive = () => {
    setOnFocus(true);
  };

  const { updateUser } = useContext(UserContext);

  const [first3User, setFirst3User] = useState([]);

  const getUser = async () => {
    try {
      const url = `${API_URL}/auth/login-success`;
      const { data } = await axios.get(url, { withCredentials: true });
      updateUser(data.user);
      console.log("data =>", data);
      localStorage.setItem("userInfo", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);
      axios
        .get(`${API_URL}/get-most-followed-3-user`, {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        })
        .then((response) => {
          setFirst3User(response.data.first3User);
        })
        .catch((error) => {
          console.log("Error =>", error);
        });
    } catch (err) {
      console.log("Error =>", err);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  const onFocusInActive = () => {
    setOnFocus(false);
  };

  useEffect(() => {
    const getClickedLocation = (e) => {
      if (
        e.target.classList.contains("right-side-bar-input") ||
        e.target.classList.contains("search-bar-right-side-column") ||
        e.srcElement.parentNode.className ===
          "search-bar-right-side-column-group" ||
        e.target.classList.contains(
          "right-side-input-close-text-search-input"
        ) ||
        e.srcElement.parentNode.className ===
          "search-input-delete-search-term-svg-group" ||
        e.target.classList.contains("search-input-delete-search-term-svg") ||
        e.srcElement.parentNode.className ===
          "div-second-parent-search-input-delete-search-term" ||
        e.srcElement.parentNode.className.baseVal ===
          "search-input-delete-search-term-svg-group"
      ) {
        onFocusActive();
        setCloseDeleteSearchTermBtn(false);
      } else {
        onFocusInActive();
        setCloseDeleteSearchTermBtn(true);
      }
    };

    document.body.addEventListener("click", getClickedLocation);

    return () => {
      document.body.removeEventListener("click", getClickedLocation);
    };
  }, []);

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
  }, []);

  const getFollowingIds = (obj) => {
    if (obj.following) {
      return obj.following.map((eachFollowing) => {
        return eachFollowing._id;
      });
    }
  };

  const [showUnfollowModal, setshowUnfollowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState("");

  const handleFollow = (selectedUser) => {
    axios
      .post(
        `${API_URL}/follow`,
        {
          activeUserId: user._id,
          theFollowedUserID: selectedUser._id,
        },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      )
      .then((response) => {
        console.log("Response after follow =>", response);

        refreshActiveUser();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleUnfollow = (selectedUser) => {
    axios
      .post(
        `${API_URL}/unfollow`,
        {
          activeUserId: user._id,
          theUnfollowedUserID: selectedUser._id,
        },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      )
      .then((response) => {
        console.log("Response after unfollow =>", response);
        setshowUnfollowModal(false);
        refreshActiveUser();
      })
      .catch((error) => {
        console.log("Error =>", error);
      });
  };

  const handleClose = () => {
    setshowUnfollowModal(false);
  };

  const openUnfollowModal = (selectedUser) => {
    console.log("Selected user =>", selectedUser);
    console.log("Open unfollow modal !");
    setSelectedUser(selectedUser);
    setshowUnfollowModal(true);
  };

  const [isHoveredListItem, setIsHoveredListItem] = useState("");

  const { height, width } = useWindowDimensions();

  const [showSubscriptionModal, setshowSubscriptionModal] = useState(false);

  const handleShowSubscriptionModal = () => {
    setshowSubscriptionModal(true);
    setTabIndex(0);
    // props from child to parent then parent to another component start to check
    onModalToggle(true);
    tabIndexValue(0);
    // props from child to parent then parent to another component finish to check
  };

  const [activeIndividualOptionTabStyle, setactiveIndividualOptionTabStyle] =
    useState(true);

  const [
    activeOrganizationOptionTabStyle,
    setactiveOrganizationOptionTabStyle,
  ] = useState(false);

  const [isIndividualSubscriptionClicked, setisIndividualSubscriptionClicked] =
    useState(true);
  const [
    isOrganizationSubscriptionClicked,
    setisOrganizationSubscriptionClicked,
  ] = useState(false);

  const [tabIndex, setTabIndex] = useState(null);

  const [selectedOption, setselectedOption] = useState("");
  const [helperStateSelectedOption, sethelperStateSelectedOption] =
    useState("");
  const handleCloseSubscriptionModal = () => {
    setindividualSubOptionTab(null);
    setindividualSubOptionTab(2);

    if (tabIndex >= 1) {
      setTabIndex(tabIndex - 1);
    } else if ((tabIndex === 2 && !phoneVerified) || phoneVerified) {
      setTabIndex(tabIndex - 1);
      setisOrganizationSubscriptionClicked(false);
      setactiveOrganizationOptionTabStyle(false);
      setactiveIndividualOptionTabStyle(true);
      setisIndividualSubscriptionClicked(true);
    } else if (tabIndex === null) {
      onModalToggle(false);
      tabIndexValue(null);
    } else if (tabIndex === 0) {
      onModalToggle(false);
      tabIndexValue(null);
      setshowSubscriptionModal(false);
      setisOrganizationSubscriptionClicked(false);
      setactiveOrganizationOptionTabStyle(false);
      setactiveIndividualOptionTabStyle(true);
      setisIndividualSubscriptionClicked(true);
      setTimeout(() => {
        setTabIndex(null);
      }, 500);
    } else {
      onModalToggle(false);
      tabIndexValue(null);
      setshowSubscriptionModal(false);
      setisOrganizationSubscriptionClicked(false);
      setactiveOrganizationOptionTabStyle(false);
      setactiveIndividualOptionTabStyle(true);
      setisIndividualSubscriptionClicked(true);
      setTimeout(() => {
        setTabIndex(null);
      }, 500);
    }
  };
  useEffect(() => {
    if (tabIndex === 1 || tabIndex === 2) {
      setselectedOption(helperStateSelectedOption);
      sethelperStateSelectedOption(selectedOption);
    } else {
      setselectedOption("");
      sethelperStateSelectedOption("");
    }
  }, [tabIndex]);

  const [individualSubOptionTab, setindividualSubOptionTab] = useState(2);
  const handleChooseActionForSubscriptionModal = (individual, organization) => {
    if (individual) {
      setselectedOption("individual");
      sethelperStateSelectedOption("individual");
      setTabIndex(1);
      setindividualSubOptionTab(2);
    } else if (organization) {
      setselectedOption("organization");
      sethelperStateSelectedOption("organization");
      setTabIndex(1);
      setindividualSubOptionTab(2);
    } else {
      return 404;
    }
  };

  const [tabStyleOrganizationBasicPlan, setTabStyleOrganizationBasicPlan] =
    useState(true);
  const [
    tabStyleOrganizationFullAccessPlan,
    setTabStyleOrganizationFullAccessPlan,
  ] = useState(false);

  const [
    subTabIndexFromOrganizatonSelect,
    setSubTabIndexFromOrganizatonSelect,
  ] = useState(1);

  const tabStyleOrganizationBasicStyle = {
    backgroundColor: tabStyleOrganizationBasicPlan ? "white" : "black",
    color: tabStyleOrganizationBasicPlan ? "black" : "white",
    fontWeight: "600",
    fontSize: "18px",
    borderRadius: "9999px",
    border: "none",

    height: "32px",
  };
  const tabStyleOrganizationFullAccessStyle = {
    backgroundColor: tabStyleOrganizationFullAccessPlan ? "white" : "black",
    color: tabStyleOrganizationFullAccessPlan ? "black" : "white",

    fontWeight: "600",
    fontSize: "18px",
    borderRadius: "9999px",
    border: "none",
    height: "32px",
  };

  const basicPlanClick = () => {
    setTabStyleOrganizationBasicPlan(true);
    setTabStyleOrganizationFullAccessPlan(false);
    setSubTabIndexFromOrganizatonSelect(1);
    console.log("Show basic plan options !");
  };

  const fullAccessPlanClick = () => {
    setTabStyleOrganizationBasicPlan(false);
    setTabStyleOrganizationFullAccessPlan(true);
    setSubTabIndexFromOrganizatonSelect(2);
    console.log("Show full access plan options !");
  };

  const [basicAnnualTabStyle, setbasicAnnualTabStyle] = useState(true);
  const [basicMonthlyTabStyle, setbasicMonthlyTabStyle] = useState(false);

  const yearlyFee = "€2,261";
  const monthyleFee = "€226.10";

  const [fullAccessAnnualTabStyle, setfullAccessAnnualTabStyle] =
    useState(true);
  const [fullAccessMonthlyTabStyle, setfullAccessMonthlyTabStyle] =
    useState(false);

  const [
    individualSubOptionPremiumPlusAnnualTab,
    setindividualSubOptionPremiumPlusAnnualTab,
  ] = useState(true);
  const [
    individualSubOptionPremiumPlusMonthlyTab,
    setindividualSubOptionPremiumPlusMonthlyTab,
  ] = useState(false);

  const yearlyFeeFullAccess = "€11,305";
  const monthyleFeeFullAccess = "€1,130.50";

  const [
    premiumPlusTabIndividualSubIndex,
    setpremiumPlusTabIndividualSubIndex,
  ] = useState(2);

  const [sliderAnimation, setSliderAnimation] = useState(false);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    initialSlide: 2,
  };

  let sliderRef = useRef(null);

  const next = () => {
    // sliderRef.current.slickNext();
    if (individualSubOptionTab !== 2) {
      setTimeout(() => {
        setindividualSubOptionTab(individualSubOptionTab + 1);
      }, 500);
      sliderRef.current.slickNext();
    } else {
      setTimeout(() => {
        setindividualSubOptionTab(2);
      }, 500);
    }
  };

  const previous = () => {
    // sliderRef.current.slickPrev();
    if (individualSubOptionTab >= 0) {
      setTimeout(() => {
        setindividualSubOptionTab(individualSubOptionTab - 1);
      }, 500);
      sliderRef.current.slickPrev();
    } else {
      setTimeout(() => {
        setindividualSubOptionTab(0);
      }, 500);
    }
  };

  const settings2 = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    initialSlide: 2,
  };

  let sliderRef2 = useRef(null);
  const next2 = () => {
    if (individualSubOptionTab !== 2) {
      setTimeout(() => {
        setindividualSubOptionTab(individualSubOptionTab + 1);
      }, 500);
      sliderRef2.current.slickNext();
    } else {
      setTimeout(() => {
        setindividualSubOptionTab(2);
      }, 500);
    }
  };
  const previous2 = () => {
    if (individualSubOptionTab >= 0) {
      setTimeout(() => {
        setindividualSubOptionTab(individualSubOptionTab - 1);
      }, 500);
      sliderRef2.current.slickPrev();
    } else {
      setTimeout(() => {
        setindividualSubOptionTab(0);
      }, 500);
    }
  };

  const [phoneVerified, setphoneVerified] = useState(false);
  const [phoneVerifiedErrorMessage, setPhoneVerifiedErrorMessage] =
    useState(null);

  const [subErrorPhoneVerifiedTabLoading, setsubErrorPhoneVerifiedTabLoading] =
    useState(false);

  const [phoneVerifiedStatus, setphoneVerifiedStatus] = useState(null);

  const handlePhoneVerifiedCheck = () => {
    console.log("Button clicked !");

    axios
      .post(`${API_URL}/is-phone-verified`, {
        isPhoneVerifiedThisUser: userInfo,
      })
      .then((isPhoneVerifiedResponse) => {
        setsubErrorPhoneVerifiedTabLoading(true);
        setTabIndex(tabIndex + 1);
        // setphoneVerified(??)
        console.log("Is phone verified =>", isPhoneVerifiedResponse);
      })
      .catch((error) => {
        const { status } = error.response;
        sethelperStateSelectedOption(selectedOption);
        setselectedOption(helperStateSelectedOption);
        setphoneVerified(status);
        setTabIndex(tabIndex + 1);
        setsubErrorPhoneVerifiedTabLoading(true);
        setTimeout(() => {
          setsubErrorPhoneVerifiedTabLoading(false);
          setphoneVerified(false);
          setPhoneVerifiedErrorMessage(true);
        }, 500);
      });
  };

  const [
    subscriptionPremiumPlusPaymentScreen,
    setsubscriptionPremiumPlusPaymentScreen,
  ] = useState(false);
  const [
    subscriptionPremiumPaymentScreen,
    setsubscriptionPremiumPaymentScreen,
  ] = useState(false);
  const [subscriptionBasicPaymentScreen, setsubscriptionBasicPaymentScreen] =
    useState(false);

  const showPremiumPlusPaymentScreen = () => {
    setsubscriptionPremiumPlusPaymentScreen(true);
    setsubscriptionBasicPaymentScreen(false);
    setsubscriptionPremiumPaymentScreen(false);
  };

  const showPremiumPaymentScreen = () => {
    setsubscriptionPremiumPaymentScreen(true);
    setsubscriptionPremiumPlusPaymentScreen(false);
    setsubscriptionBasicPaymentScreen(false);
  };

  const showBasicPaymentScreen = () => {
    console.log("Show basic payment screen !");
    setsubscriptionBasicPaymentScreen(true);
    setsubscriptionPremiumPaymentScreen(false);
    setsubscriptionPremiumPlusPaymentScreen(false);
  };

  const handleClosePremiumPlusPaymentScreen = () => {
    setsubscriptionPremiumPlusPaymentScreen(false);
  };

  const handleClosePremiumPaymentScreen = () => {
    setsubscriptionPremiumPaymentScreen(false);
  };

  const handleCloseBasicPaymentScreen = () => {
    setsubscriptionBasicPaymentScreen(false);
  };

  const handleCheckoutStripeApi = (priceBasic, paymentPeriodBasic) => {
    axios
      .post(
        `${API_URL}/stripe/create-checkout-session`,
        {
          subscriptionOption: {
            price: priceBasic,
            description: paymentPeriodBasic,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      )
      .then((response) => {
        console.log("Response =>", response);
        if (response.data.url) {
          window.location.href = response.data.url;
        }
      })
      .catch((err) => window.alert("Error !!!", err ? err : null));
  };

  const handleFullAccessOrganizationPlanModal = () => {
    window.alert("Apply for Full Access");
  };

  return (
    <>
      {width <= 700 ? (
        <>
          <Modal
            style={{
              height: "100%",
              overflowX: "hidden",
              overflowY: "hidden",
            }}
            dialogClassName={"modal-fullscreen"}
            show={showSubscriptionModal}
            onHide={handleCloseSubscriptionModal}
            centered={true}
            className="widthsmallerthan700-sub-modal"
          >
            <>
              <Modal.Header
                className="signin-modal-header-child-non-reactivate"
                style={{
                  border: "none",
                  zIndex: 999,
                  backgroundColor: "white",
                  width: "97%",
                }}
              >
                <div
                  onClick={handleCloseSubscriptionModal}
                  className="close-button"
                  style={{
                    borderRadius: "50%",
                    cursor: "pointer",
                  }}
                >
                  <div
                    style={{
                      display: " flex",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    {/* close signin modal icon start to check  */}
                    <svg
                      style={{
                        border: "none",
                        fontSize: "15px",
                        margin: "5px",
                      }}
                      onClick={handleCloseSubscriptionModal}
                      width={20}
                      height={20}
                      color="rgb(15,20,25)"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      className=" r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-z80fyv r-19wmn03"
                    >
                      <g>
                        <path d="M10.59 12L4.54 5.96l1.42-1.42L12 10.59l6.04-6.05 1.42 1.42L13.41 12l6.05 6.04-1.42 1.42L12 13.41l-6.04 6.05-1.42-1.42L10.59 12z"></path>
                      </g>
                    </svg>{" "}
                    {/* close signin modal icon finish to check  */}
                  </div>
                </div>{" "}
                <span
                  style={{
                    fontWeight: "700",
                    fontSize: "20px",
                    lineHeight: "24px",
                    position: "absolute",
                    left: "15%",
                    display:
                      (selectedOption === "individual" ||
                        helperStateSelectedOption === "individual") &&
                      tabIndex !== 2
                        ? ""
                        : "none",
                  }}
                >
                  Subscribe
                </span>
                <div
                  style={{
                    fontWeight: "700",
                    fontSize: "20px",
                    lineHeight: "24px",
                    margin: "0 auto",
                    position: "relative",
                    right: "15px",
                    display:
                      (selectedOption === "organization" ||
                        helperStateSelectedOption === "organization") &&
                      tabIndex !== 2
                        ? ""
                        : "none",
                  }}
                >
                  Verified Organizations
                </div>
              </Modal.Header>
            </>

            {tabIndex === 0 ? (
              <>
                <Modal.Body
                  // className="mt-5"
                  style={{
                    position: "relative",
                    top: "4.8%",
                  }}
                >
                  <div
                    style={{
                      lineHeight: "36px",
                      fontSize: "31px",
                      fontWeight: "800",
                    }}
                  >
                    Who are you?
                  </div>

                  <div
                    className="mt-3"
                    style={{
                      lineHeight: "20px",
                      fontSize: "15px",
                      fontWeight: "400",
                      color: "rgb(15, 20, 25)",
                    }}
                  >
                    Choose the right subscription for you:
                  </div>
                  <div
                    className="mt-4"
                    style={{
                      display: "flex",
                      gap: "2.5%",
                      width: "81.5%",
                    }}
                  >
                    <div
                      onClick={() => {
                        setactiveIndividualOptionTabStyle(true);
                        setisIndividualSubscriptionClicked(true);
                        setactiveOrganizationOptionTabStyle(false);
                        setisOrganizationSubscriptionClicked(false);
                        setindividualSubOptionTab(2);
                      }}
                      style={
                        ({ activeIndividualOptionTabStyle },
                        {
                          flex: 1,
                          backgroundColor: "white",
                          minHeight: "112px",
                          padding: "12px",
                          cursor: "pointer",
                          borderWidth: "1px",
                          borderRadius: "16px",
                          boxShadow:
                            "0 0 15px rgba(101, 119,134,0.2), 0 0 3px 1px rgba(101,119,134,0.15)",
                          border: activeIndividualOptionTabStyle
                            ? "2px solid #339bf0"
                            : "2px solid transparent",
                          transition: "transform 0.3s ease",
                        })
                      }
                      className="individual-subscription-box"
                    >
                      <div
                        style={{
                          position: "relative",
                          top: "5px",
                        }}
                      >
                        <div
                          style={{
                            color: "#697884",
                            fontSize: "15px",
                            fontWeight: "400",
                          }}
                        >
                          Premium
                        </div>
                        <div
                          style={{
                            color: "rgb(15, 20, 25)",
                            fontSize: "18px",
                            fontWeight: "600",
                          }}
                        >
                          {" "}
                          I am an individual
                        </div>
                        <div
                          style={{
                            color: "#697884",
                            fontSize: "14px",
                            fontWeight: "400",
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
                      }}
                      style={
                        ({ activeOrganizationOptionTabStyle },
                        {
                          flex: 1,
                          backgroundColor: "white",
                          minHeight: "112px",
                          padding: "12px",
                          cursor: "pointer",
                          borderWidth: "1px",
                          borderRadius: "16px",
                          boxShadow:
                            "0 0 15px rgba(101, 119,134,0.2), 0 0 3px 1px rgba(101,119,134,0.15)",
                          border: activeOrganizationOptionTabStyle
                            ? "2px solid #339bf0"
                            : "2px solid transparent",
                          transition: "transform 0.3s ease",
                        })
                      }
                      className="organization-subscription-box"
                    >
                      <div
                        style={{
                          position: "relative",
                        }}
                      >
                        <div
                          style={{
                            color: "#697884",
                            fontSize: "15px",
                            fontWeight: "400",
                          }}
                        >
                          {" "}
                          Verified Organizations
                        </div>{" "}
                        <div
                          style={{
                            color: "rgb(15, 20, 25)",
                            fontSize: "18px",
                            fontWeight: "600",
                          }}
                        >
                          I am an organization
                        </div>{" "}
                        <div
                          style={{
                            color: "#697884",
                            fontSize: "14px",
                            fontWeight: "400",
                          }}
                        >
                          For businesses, government agencies, and non-profits
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={() => {
                      handleChooseActionForSubscriptionModal(
                        isIndividualSubscriptionClicked,
                        isOrganizationSubscriptionClicked
                      );
                    }}
                    style={{
                      width: "81.5%",
                      height: "54px",
                      backgroundColor: "#0f141a",
                    }}
                    className="next-btn mt-4"
                  >
                    Subscribe
                  </Button>
                  <div
                    style={{
                      fontSize: "15px",
                      fontWeight: "400",
                      lineHeight: "20px",
                      color: "rgb(15, 20, 25)",
                    }}
                    className="mt-4"
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
                </Modal.Body>
              </>
            ) : tabIndex === 1 && isIndividualSubscriptionClicked ? (
              <>
                <Modal.Body
                  className="scrollbar-add"
                  style={{
                    overflowY: "auto",
                    overflowX: "hidden",
                    opacity:
                      subscriptionPremiumPlusPaymentScreen ||
                      subscriptionPremiumPaymentScreen ||
                      subscriptionBasicPaymentScreen
                        ? "0.5"
                        : "1",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      margin: "0 auto",
                    }}
                  >
                    <Slider ref={sliderRef} {...settings}>
                      {/* first div basic plan start to check   */}
                      <div
                        style={{
                          width: "100%",
                          margin: "0px auto",
                        }}
                      >
                        <Stack
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            backgroundImage:
                              "url(https://abs.twimg.com/responsive-web/client-web/background-basic-web@3x.0f5af6ea.png)",
                            backgroundPosition: "center",
                            backgroundSize: "cover",
                            borderRadius: "16px",
                            color: "white",
                            height: "60px",
                          }}
                          direction="horizontal"
                          gap={1}
                        >
                          <div
                            className="p-2"
                            style={{
                              visibility: "hidden",
                            }}
                          >
                            {" "}
                            <span
                              onClick={() => {
                                previous();
                              }}
                              className="premium-btn-back"
                              style={{
                                color: "white",
                                backgroundColor: "#13181c",
                                width: "30px",
                                height: "30px",
                                borderRadius: "50%",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <svg
                                width={20}
                                height={20}
                                color="white"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                                className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-z80fyv r-19wmn03 r-jwli3a"
                              >
                                <g>
                                  <path d="M7.414 13l5.043 5.04-1.414 1.42L3.586 12l7.457-7.46 1.414 1.42L7.414 11H21v2H7.414z"></path>
                                </g>
                              </svg>
                            </span>
                          </div>
                          <div style={{}}>
                            {" "}
                            <span
                              style={{
                                color: "white",
                                lineHeight: "20px",
                                fontWeight: "500",
                                fontSize: "17px",
                                position: "relative",
                                left: "5px",
                              }}
                            >
                              Basic
                              <span
                                span
                                style={{
                                  visibility: "hidden",
                                }}
                              >
                                +
                              </span>
                            </span>
                          </div>
                          <div className="p-2" style={{}}>
                            {" "}
                            <span
                              onClick={() => {
                                next();
                              }}
                              className="premium-btn-back"
                              style={{
                                color: "white",
                                backgroundColor: "#13181c",
                                width: "30px",
                                height: "30px",
                                borderRadius: "50%",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <svg
                                width={20}
                                height={20}
                                color="white"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                                className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-z80fyv r-19wmn03 r-jwli3a"
                              >
                                <g>
                                  <path d="M12.957 4.54L20.414 12l-7.457 7.46-1.414-1.42L16.586 13H3v-2h13.586l-5.043-5.04 1.414-1.42z"></path>
                                </g>
                              </svg>
                            </span>
                          </div>
                        </Stack>{" "}
                        {/* enhanced experience start to check  */}
                        <div
                          className="mt-3 premium-plus-parent-div"
                          style={{
                            padding: "32px",
                            borderRadius: "16px",
                            backgroundColor: "#eff3f4",
                          }}
                        >
                          <div className="premium-plus-header">
                            Enhanced Experience
                          </div>
                          <div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <div>
                                <span>Ads in For You</span>
                                <svg
                                  width={16}
                                  height={16}
                                  color="rgba(83,100,113,1.00)"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="exclamation r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-10ptun7 r-1janqcz r-14j79pv"
                                >
                                  <g>
                                    <path d="M13.5 8.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5S11.17 7 12 7s1.5.67 1.5 1.5zM13 17v-5h-2v5h2zm-1 5.25c5.66 0 10.25-4.59 10.25-10.25S17.66 1.75 12 1.75 1.75 6.34 1.75 12 6.34 22.25 12 22.25zM20.25 12c0 4.56-3.69 8.25-8.25 8.25S3.75 16.56 3.75 12 7.44 3.75 12 3.75s8.25 3.69 8.25 8.25z"></path>
                                  </g>
                                </svg>
                              </div>
                              <div>Full</div>
                            </div>
                          </div>
                          <div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <div>
                                <span>Reply boost</span>
                              </div>
                              <div>Largest</div>
                            </div>
                          </div>
                          <div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <div>
                                <span>Smallest</span>{" "}
                              </div>
                              <div>
                                {" "}
                                <svg
                                  color="rgb(0, 186, 124)"
                                  fill="currentColor"
                                  width={20}
                                  height={20}
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-o6sn0f"
                                >
                                  <g>
                                    <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                  </g>
                                </svg>
                              </div>
                            </div>
                          </div>
                          <div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <div>
                                <span>Longer posts</span>{" "}
                              </div>
                              <div>
                                {" "}
                                <svg
                                  color="rgb(0, 186, 124)"
                                  fill="currentColor"
                                  width={20}
                                  height={20}
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-o6sn0f"
                                >
                                  <g>
                                    <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                  </g>
                                </svg>
                              </div>
                            </div>
                          </div>
                          <div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <div>
                                <span>Undo post</span>{" "}
                              </div>
                              <div>
                                {" "}
                                <svg
                                  color="rgb(0, 186, 124)"
                                  fill="currentColor"
                                  width={20}
                                  height={20}
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-o6sn0f"
                                >
                                  <g>
                                    <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                  </g>
                                </svg>
                              </div>
                            </div>
                          </div>
                          <div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <div>
                                <span>Post longer videos</span>{" "}
                              </div>
                              <div>
                                {" "}
                                <svg
                                  color="rgb(0, 186, 124)"
                                  fill="currentColor"
                                  width={20}
                                  height={20}
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-o6sn0f"
                                >
                                  <g>
                                    <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                  </g>
                                </svg>
                              </div>
                            </div>
                          </div>
                          <div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <div>
                                <span>Top Articles</span>{" "}
                              </div>
                              <div>
                                {" "}
                                <svg
                                  color="rgb(0, 186, 124)"
                                  fill="currentColor"
                                  width={20}
                                  height={20}
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-o6sn0f"
                                >
                                  <g>
                                    <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                  </g>
                                </svg>
                              </div>
                            </div>
                          </div>
                          {/* reader check  */}
                          <div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <div>
                                <span>Reader</span>{" "}
                                <svg
                                  width={20}
                                  height={20}
                                  color="rgba(83,100,113,1.00)"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="exclamation r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-10ptun7 r-1janqcz r-14j79pv"
                                >
                                  <g>
                                    <path d="M13.5 8.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5S11.17 7 12 7s1.5.67 1.5 1.5zM13 17v-5h-2v5h2zm-1 5.25c5.66 0 10.25-4.59 10.25-10.25S17.66 1.75 12 1.75 1.75 6.34 1.75 12 6.34 22.25 12 22.25zM20.25 12c0 4.56-3.69 8.25-8.25 8.25S3.75 16.56 3.75 12 7.44 3.75 12 3.75s8.25 3.69 8.25 8.25z"></path>
                                  </g>
                                </svg>
                              </div>
                              <div>
                                {" "}
                                <svg
                                  color="rgb(0, 186, 124)"
                                  fill="currentColor"
                                  width={20}
                                  height={20}
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-o6sn0f"
                                >
                                  <g>
                                    <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                  </g>
                                </svg>
                              </div>
                            </div>
                          </div>
                          {/* reader check  */}
                          <div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <div>
                                <span>Background video playback</span>{" "}
                              </div>
                              <div>
                                {" "}
                                <svg
                                  color="rgb(0, 186, 124)"
                                  fill="currentColor"
                                  width={20}
                                  height={20}
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-o6sn0f"
                                >
                                  <g>
                                    <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                  </g>
                                </svg>
                              </div>
                            </div>
                          </div>
                          <div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <div>
                                <span>Download videos</span>{" "}
                              </div>
                              <div>
                                {" "}
                                <svg
                                  color="rgb(0, 186, 124)"
                                  fill="currentColor"
                                  width={20}
                                  height={20}
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-o6sn0f"
                                >
                                  <g>
                                    <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                  </g>
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* enhanced experience finish to check  */}
                        {/* creator hub start to check  */}
                        <div
                          className="mt-3 premium-plus-parent-div"
                          style={{
                            padding: "32px",
                            borderRadius: "16px",
                            backgroundColor: "#eff3f4",
                          }}
                        >
                          <div className="premium-plus-header">Creator Hub</div>
                          <div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <div>
                                <span
                                  style={{
                                    color:
                                      "rgb(83, 100, 113)                                  ",
                                  }}
                                >
                                  Write Articles
                                </span>
                                <svg
                                  width={20}
                                  height={20}
                                  color="rgba(83,100,113,1.00)"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="exclamation r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-10ptun7 r-1janqcz r-14j79pv"
                                >
                                  <g>
                                    <path d="M13.5 8.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5S11.17 7 12 7s1.5.67 1.5 1.5zM13 17v-5h-2v5h2zm-1 5.25c5.66 0 10.25-4.59 10.25-10.25S17.66 1.75 12 1.75 1.75 6.34 1.75 12 6.34 22.25 12 22.25zM20.25 12c0 4.56-3.69 8.25-8.25 8.25S3.75 16.56 3.75 12 7.44 3.75 12 3.75s8.25 3.69 8.25 8.25z"></path>
                                  </g>
                                </svg>
                              </div>
                              <div>
                                {" "}
                                <svg
                                  width={`${1.25}em`}
                                  height={`${1.25}em`}
                                  color="rgba(83,100,113,1.00)"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-14j79pv"
                                >
                                  <g>
                                    <path d="M14 13c0 .74-.4 1.39-1 1.73V17h-2v-2.27c-.59-.34-1-.99-1-1.73 0-1.1.9-2 2-2 1.11 0 2 .9 2 2zm3.5-6H17v-.25c0-2.76-2.24-5-5-5s-5 2.24-5 5V7h-.5C5.12 7 4 8.12 4 9.5v9C4 19.88 5.12 21 6.5 21h11c1.38 0 2.5-1.12 2.5-2.5v-9C20 8.12 18.88 7 17.5 7zM9 6.75c0-1.66 1.34-3 3-3s3 1.34 3 3V7H9v-.25zm9 11.75c0 .28-.22.5-.5.5h-11c-.28 0-.5-.22-.5-.5v-9c0-.28.22-.5.5-.5h11c.28 0 .5.22.5.5v9z"></path>
                                  </g>
                                </svg>
                              </div>
                            </div>
                          </div>
                          <div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <div>
                                <span
                                  style={{
                                    color:
                                      "rgb(83, 100, 113)                                  ",
                                  }}
                                >
                                  Get paid to post
                                </span>
                                <svg
                                  width={20}
                                  height={20}
                                  color="rgba(83,100,113,1.00)"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="exclamation r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-10ptun7 r-1janqcz r-14j79pv"
                                >
                                  <g>
                                    <path d="M13.5 8.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5S11.17 7 12 7s1.5.67 1.5 1.5zM13 17v-5h-2v5h2zm-1 5.25c5.66 0 10.25-4.59 10.25-10.25S17.66 1.75 12 1.75 1.75 6.34 1.75 12 6.34 22.25 12 22.25zM20.25 12c0 4.56-3.69 8.25-8.25 8.25S3.75 16.56 3.75 12 7.44 3.75 12 3.75s8.25 3.69 8.25 8.25z"></path>
                                  </g>
                                </svg>
                              </div>
                              <div>
                                {" "}
                                <svg
                                  width={`${1.25}em`}
                                  height={`${1.25}em`}
                                  color="rgba(83,100,113,1.00)"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-14j79pv"
                                >
                                  <g>
                                    <path d="M14 13c0 .74-.4 1.39-1 1.73V17h-2v-2.27c-.59-.34-1-.99-1-1.73 0-1.1.9-2 2-2 1.11 0 2 .9 2 2zm3.5-6H17v-.25c0-2.76-2.24-5-5-5s-5 2.24-5 5V7h-.5C5.12 7 4 8.12 4 9.5v9C4 19.88 5.12 21 6.5 21h11c1.38 0 2.5-1.12 2.5-2.5v-9C20 8.12 18.88 7 17.5 7zM9 6.75c0-1.66 1.34-3 3-3s3 1.34 3 3V7H9v-.25zm9 11.75c0 .28-.22.5-.5.5h-11c-.28 0-.5-.22-.5-.5v-9c0-.28.22-.5.5-.5h11c.28 0 .5.22.5.5v9z"></path>
                                  </g>
                                </svg>
                              </div>
                            </div>
                          </div>
                          <div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <div>
                                <span
                                  style={{
                                    color:
                                      "rgb(83, 100, 113)                                  ",
                                  }}
                                >
                                  Creator Subscriptions
                                </span>
                                <svg
                                  width={20}
                                  height={20}
                                  color="rgba(83,100,113,1.00)"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="exclamation r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-10ptun7 r-1janqcz r-14j79pv"
                                >
                                  <g>
                                    <path d="M13.5 8.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5S11.17 7 12 7s1.5.67 1.5 1.5zM13 17v-5h-2v5h2zm-1 5.25c5.66 0 10.25-4.59 10.25-10.25S17.66 1.75 12 1.75 1.75 6.34 1.75 12 6.34 22.25 12 22.25zM20.25 12c0 4.56-3.69 8.25-8.25 8.25S3.75 16.56 3.75 12 7.44 3.75 12 3.75s8.25 3.69 8.25 8.25z"></path>
                                  </g>
                                </svg>
                              </div>
                              <div>
                                {" "}
                                <svg
                                  width={`${1.25}em`}
                                  height={`${1.25}em`}
                                  color="rgba(83,100,113,1.00)"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-14j79pv"
                                >
                                  <g>
                                    <path d="M14 13c0 .74-.4 1.39-1 1.73V17h-2v-2.27c-.59-.34-1-.99-1-1.73 0-1.1.9-2 2-2 1.11 0 2 .9 2 2zm3.5-6H17v-.25c0-2.76-2.24-5-5-5s-5 2.24-5 5V7h-.5C5.12 7 4 8.12 4 9.5v9C4 19.88 5.12 21 6.5 21h11c1.38 0 2.5-1.12 2.5-2.5v-9C20 8.12 18.88 7 17.5 7zM9 6.75c0-1.66 1.34-3 3-3s3 1.34 3 3V7H9v-.25zm9 11.75c0 .28-.22.5-.5.5h-11c-.28 0-.5-.22-.5-.5v-9c0-.28.22-.5.5-.5h11c.28 0 .5.22.5.5v9z"></path>
                                  </g>
                                </svg>
                              </div>
                            </div>
                          </div>
                          <div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <div>
                                <span
                                  style={{
                                    color:
                                      "rgb(83, 100, 113)                                  ",
                                  }}
                                >
                                  X Pro
                                </span>
                                <svg
                                  width={20}
                                  height={20}
                                  color="rgba(83,100,113,1.00)"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="exclamation r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-10ptun7 r-1janqcz r-14j79pv"
                                >
                                  <g>
                                    <path d="M13.5 8.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5S11.17 7 12 7s1.5.67 1.5 1.5zM13 17v-5h-2v5h2zm-1 5.25c5.66 0 10.25-4.59 10.25-10.25S17.66 1.75 12 1.75 1.75 6.34 1.75 12 6.34 22.25 12 22.25zM20.25 12c0 4.56-3.69 8.25-8.25 8.25S3.75 16.56 3.75 12 7.44 3.75 12 3.75s8.25 3.69 8.25 8.25z"></path>
                                  </g>
                                </svg>
                              </div>
                              <div>
                                {" "}
                                <svg
                                  width={`${1.25}em`}
                                  height={`${1.25}em`}
                                  color="rgba(83,100,113,1.00)"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-14j79pv"
                                >
                                  <g>
                                    <path d="M14 13c0 .74-.4 1.39-1 1.73V17h-2v-2.27c-.59-.34-1-.99-1-1.73 0-1.1.9-2 2-2 1.11 0 2 .9 2 2zm3.5-6H17v-.25c0-2.76-2.24-5-5-5s-5 2.24-5 5V7h-.5C5.12 7 4 8.12 4 9.5v9C4 19.88 5.12 21 6.5 21h11c1.38 0 2.5-1.12 2.5-2.5v-9C20 8.12 18.88 7 17.5 7zM9 6.75c0-1.66 1.34-3 3-3s3 1.34 3 3V7H9v-.25zm9 11.75c0 .28-.22.5-.5.5h-11c-.28 0-.5-.22-.5-.5v-9c0-.28.22-.5.5-.5h11c.28 0 .5.22.5.5v9z"></path>
                                  </g>
                                </svg>
                              </div>
                            </div>
                          </div>
                          <div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <div>
                                <span
                                  style={{
                                    color:
                                      "rgb(83, 100, 113)                                  ",
                                  }}
                                >
                                  Media Studio
                                </span>
                                <svg
                                  width={20}
                                  height={20}
                                  color="rgba(83,100,113,1.00)"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="exclamation r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-10ptun7 r-1janqcz r-14j79pv"
                                >
                                  <g>
                                    <path d="M13.5 8.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5S11.17 7 12 7s1.5.67 1.5 1.5zM13 17v-5h-2v5h2zm-1 5.25c5.66 0 10.25-4.59 10.25-10.25S17.66 1.75 12 1.75 1.75 6.34 1.75 12 6.34 22.25 12 22.25zM20.25 12c0 4.56-3.69 8.25-8.25 8.25S3.75 16.56 3.75 12 7.44 3.75 12 3.75s8.25 3.69 8.25 8.25z"></path>
                                  </g>
                                </svg>
                              </div>
                              <div>
                                {" "}
                                <svg
                                  width={`${1.25}em`}
                                  height={`${1.25}em`}
                                  color="rgba(83,100,113,1.00)"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-14j79pv"
                                >
                                  <g>
                                    <path d="M14 13c0 .74-.4 1.39-1 1.73V17h-2v-2.27c-.59-.34-1-.99-1-1.73 0-1.1.9-2 2-2 1.11 0 2 .9 2 2zm3.5-6H17v-.25c0-2.76-2.24-5-5-5s-5 2.24-5 5V7h-.5C5.12 7 4 8.12 4 9.5v9C4 19.88 5.12 21 6.5 21h11c1.38 0 2.5-1.12 2.5-2.5v-9C20 8.12 18.88 7 17.5 7zM9 6.75c0-1.66 1.34-3 3-3s3 1.34 3 3V7H9v-.25zm9 11.75c0 .28-.22.5-.5.5h-11c-.28 0-.5-.22-.5-.5v-9c0-.28.22-.5.5-.5h11c.28 0 .5.22.5.5v9z"></path>
                                  </g>
                                </svg>
                              </div>
                            </div>
                          </div>
                          <div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <div>
                                <span
                                  style={{
                                    color:
                                      "rgb(83, 100, 113)                                  ",
                                  }}
                                >
                                  Analytics
                                </span>
                                <svg
                                  width={20}
                                  height={20}
                                  color="rgba(83,100,113,1.00)"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="exclamation r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-10ptun7 r-1janqcz r-14j79pv"
                                >
                                  <g>
                                    <path d="M13.5 8.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5S11.17 7 12 7s1.5.67 1.5 1.5zM13 17v-5h-2v5h2zm-1 5.25c5.66 0 10.25-4.59 10.25-10.25S17.66 1.75 12 1.75 1.75 6.34 1.75 12 6.34 22.25 12 22.25zM20.25 12c0 4.56-3.69 8.25-8.25 8.25S3.75 16.56 3.75 12 7.44 3.75 12 3.75s8.25 3.69 8.25 8.25z"></path>
                                  </g>
                                </svg>
                              </div>
                              <div>
                                {" "}
                                <svg
                                  width={`${1.25}em`}
                                  height={`${1.25}em`}
                                  color="rgba(83,100,113,1.00)"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-14j79pv"
                                >
                                  <g>
                                    <path d="M14 13c0 .74-.4 1.39-1 1.73V17h-2v-2.27c-.59-.34-1-.99-1-1.73 0-1.1.9-2 2-2 1.11 0 2 .9 2 2zm3.5-6H17v-.25c0-2.76-2.24-5-5-5s-5 2.24-5 5V7h-.5C5.12 7 4 8.12 4 9.5v9C4 19.88 5.12 21 6.5 21h11c1.38 0 2.5-1.12 2.5-2.5v-9C20 8.12 18.88 7 17.5 7zM9 6.75c0-1.66 1.34-3 3-3s3 1.34 3 3V7H9v-.25zm9 11.75c0 .28-.22.5-.5.5h-11c-.28 0-.5-.22-.5-.5v-9c0-.28.22-.5.5-.5h11c.28 0 .5.22.5.5v9z"></path>
                                  </g>
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* creator hub finish to check  */}
                        {/* Verification and security start to check */}
                        <div
                          className="mt-3 premium-plus-parent-div"
                          style={{
                            padding: "32px",
                            borderRadius: "16px",
                            backgroundColor: "#eff3f4",
                          }}
                        >
                          <div className="premium-plus-header">
                            Verification & Security
                          </div>
                          <div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <div>
                                <span
                                  style={{
                                    color:
                                      "rgb(83, 100, 113)                                  ",
                                  }}
                                >
                                  {" "}
                                  Checkmark
                                </span>
                                <svg
                                  width={20}
                                  height={20}
                                  color="rgba(83,100,113,1.00)"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="exclamation r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-10ptun7 r-1janqcz r-14j79pv"
                                >
                                  <g>
                                    <path d="M13.5 8.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5S11.17 7 12 7s1.5.67 1.5 1.5zM13 17v-5h-2v5h2zm-1 5.25c5.66 0 10.25-4.59 10.25-10.25S17.66 1.75 12 1.75 1.75 6.34 1.75 12 6.34 22.25 12 22.25zM20.25 12c0 4.56-3.69 8.25-8.25 8.25S3.75 16.56 3.75 12 7.44 3.75 12 3.75s8.25 3.69 8.25 8.25z"></path>
                                  </g>
                                </svg>
                              </div>
                              <div>
                                {" "}
                                <svg
                                  width={`${1.25}em`}
                                  height={`${1.25}em`}
                                  color="rgba(83,100,113,1.00)"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-14j79pv"
                                >
                                  <g>
                                    <path d="M14 13c0 .74-.4 1.39-1 1.73V17h-2v-2.27c-.59-.34-1-.99-1-1.73 0-1.1.9-2 2-2 1.11 0 2 .9 2 2zm3.5-6H17v-.25c0-2.76-2.24-5-5-5s-5 2.24-5 5V7h-.5C5.12 7 4 8.12 4 9.5v9C4 19.88 5.12 21 6.5 21h11c1.38 0 2.5-1.12 2.5-2.5v-9C20 8.12 18.88 7 17.5 7zM9 6.75c0-1.66 1.34-3 3-3s3 1.34 3 3V7H9v-.25zm9 11.75c0 .28-.22.5-.5.5h-11c-.28 0-.5-.22-.5-.5v-9c0-.28.22-.5.5-.5h11c.28 0 .5.22.5.5v9z"></path>
                                  </g>
                                </svg>
                              </div>
                            </div>
                          </div>
                          <div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <div>
                                <span>Encrypted direct messages</span>
                                <svg
                                  width={20}
                                  height={20}
                                  color="rgba(83,100,113,1.00)"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="exclamation r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-10ptun7 r-1janqcz r-14j79pv"
                                >
                                  <g>
                                    <path d="M13.5 8.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5S11.17 7 12 7s1.5.67 1.5 1.5zM13 17v-5h-2v5h2zm-1 5.25c5.66 0 10.25-4.59 10.25-10.25S17.66 1.75 12 1.75 1.75 6.34 1.75 12 6.34 22.25 12 22.25zM20.25 12c0 4.56-3.69 8.25-8.25 8.25S3.75 16.56 3.75 12 7.44 3.75 12 3.75s8.25 3.69 8.25 8.25z"></path>
                                  </g>
                                </svg>
                              </div>
                              <div>
                                {" "}
                                <svg
                                  color="rgb(0, 186, 124)"
                                  fill="currentColor"
                                  width={20}
                                  height={20}
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-o6sn0f"
                                >
                                  <g>
                                    <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                  </g>
                                </svg>
                              </div>
                            </div>
                          </div>
                          <div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <div>
                                <span
                                  style={{
                                    color:
                                      "rgb(83, 100, 113)                                  ",
                                  }}
                                >
                                  Optional ID verification
                                </span>
                                <svg
                                  width={20}
                                  height={20}
                                  color="rgba(83,100,113,1.00)"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="exclamation r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-10ptun7 r-1janqcz r-14j79pv"
                                >
                                  <g>
                                    <path d="M13.5 8.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5S11.17 7 12 7s1.5.67 1.5 1.5zM13 17v-5h-2v5h2zm-1 5.25c5.66 0 10.25-4.59 10.25-10.25S17.66 1.75 12 1.75 1.75 6.34 1.75 12 6.34 22.25 12 22.25zM20.25 12c0 4.56-3.69 8.25-8.25 8.25S3.75 16.56 3.75 12 7.44 3.75 12 3.75s8.25 3.69 8.25 8.25z"></path>
                                  </g>
                                </svg>
                              </div>
                              <div>
                                {" "}
                                <svg
                                  width={`${1.25}em`}
                                  height={`${1.25}em`}
                                  color="rgba(83,100,113,1.00)"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-14j79pv"
                                >
                                  <g>
                                    <path d="M14 13c0 .74-.4 1.39-1 1.73V17h-2v-2.27c-.59-.34-1-.99-1-1.73 0-1.1.9-2 2-2 1.11 0 2 .9 2 2zm3.5-6H17v-.25c0-2.76-2.24-5-5-5s-5 2.24-5 5V7h-.5C5.12 7 4 8.12 4 9.5v9C4 19.88 5.12 21 6.5 21h11c1.38 0 2.5-1.12 2.5-2.5v-9C20 8.12 18.88 7 17.5 7zM9 6.75c0-1.66 1.34-3 3-3s3 1.34 3 3V7H9v-.25zm9 11.75c0 .28-.22.5-.5.5h-11c-.28 0-.5-.22-.5-.5v-9c0-.28.22-.5.5-.5h11c.28 0 .5.22.5.5v9z"></path>
                                  </g>
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* verification and security finish to check */}
                        {/* Customization start to check  */}
                        <div
                          className="mt-3 premium-plus-parent-div"
                          style={{
                            padding: "32px",
                            borderRadius: "16px",
                            backgroundColor: "#eff3f4",
                          }}
                        >
                          <div className="premium-plus-header">
                            Customization
                          </div>
                          <div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <div>
                                <span>App icons</span>
                              </div>
                              <div>
                                {" "}
                                <svg
                                  color="rgb(0, 186, 124)"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-o6sn0f"
                                >
                                  <g>
                                    <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                  </g>
                                </svg>
                              </div>
                            </div>
                          </div>

                          <div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <div>
                                <span>Bookmark folders</span>{" "}
                              </div>
                              <div>
                                {" "}
                                <svg
                                  color="rgb(0, 186, 124)"
                                  fill="currentColor"
                                  width={20}
                                  height={20}
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-o6sn0f"
                                >
                                  <g>
                                    <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                  </g>
                                </svg>
                              </div>
                            </div>
                          </div>
                          <div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <div>
                                <span>Customize navigation</span>{" "}
                              </div>
                              <div>
                                {" "}
                                <svg
                                  color="rgb(0, 186, 124)"
                                  fill="currentColor"
                                  width={20}
                                  height={20}
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-o6sn0f"
                                >
                                  <g>
                                    <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                  </g>
                                </svg>
                              </div>
                            </div>
                          </div>
                          <div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <div>
                                <span>Highlights tab</span>{" "}
                                <svg
                                  width={20}
                                  height={20}
                                  color="rgba(83,100,113,1.00)"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="exclamation r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-10ptun7 r-1janqcz r-14j79pv"
                                >
                                  <g>
                                    <path d="M13.5 8.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5S11.17 7 12 7s1.5.67 1.5 1.5zM13 17v-5h-2v5h2zm-1 5.25c5.66 0 10.25-4.59 10.25-10.25S17.66 1.75 12 1.75 1.75 6.34 1.75 12 6.34 22.25 12 22.25zM20.25 12c0 4.56-3.69 8.25-8.25 8.25S3.75 16.56 3.75 12 7.44 3.75 12 3.75s8.25 3.69 8.25 8.25z"></path>
                                  </g>
                                </svg>
                              </div>
                              <div>
                                {" "}
                                <svg
                                  color="rgb(0, 186, 124)"
                                  fill="currentColor"
                                  width={20}
                                  height={20}
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-o6sn0f"
                                >
                                  <g>
                                    <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                  </g>
                                </svg>
                              </div>
                            </div>
                          </div>
                          <div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <div>
                                <span>Hide your likes</span>{" "}
                              </div>
                              <div>
                                {" "}
                                <svg
                                  color="rgb(0, 186, 124)"
                                  fill="currentColor"
                                  width={20}
                                  height={20}
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-o6sn0f"
                                >
                                  <g>
                                    <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                  </g>
                                </svg>
                              </div>
                            </div>
                          </div>
                          <div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <div>
                                <span>Hide your checkmark</span>{" "}
                              </div>
                              <div>
                                {" "}
                                <svg
                                  color="rgb(0, 186, 124)"
                                  fill="currentColor"
                                  width={20}
                                  height={20}
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-o6sn0f"
                                >
                                  <g>
                                    <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                  </g>
                                </svg>
                              </div>
                            </div>
                          </div>
                          {/* reader check  */}
                          <div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <div>Hide your subscriptions</div>
                              <div>
                                {" "}
                                <svg
                                  color="rgb(0, 186, 124)"
                                  fill="currentColor"
                                  width={20}
                                  height={20}
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-o6sn0f"
                                >
                                  <g>
                                    <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                  </g>
                                </svg>
                              </div>
                            </div>
                          </div>
                          {/* reader check  */}
                        </div>
                        {/* Customization finish to check  */}
                      </div>
                      {/* first div basic plan finish to check   */}
                      {/* second div premium plan start to check  */}
                      <div
                        style={{
                          width: "81.5%",
                          margin: "0px auto",
                        }}
                      >
                        <Stack
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            backgroundImage:
                              "url(https://abs.twimg.com/responsive-web/client-web/background-premium-web@3x.44f5419a.png)",
                            backgroundPosition: "center",
                            backgroundSize: "cover",
                            borderRadius: "16px",
                            color: "white",
                            height: "60px",
                          }}
                          direction="horizontal"
                          gap={1}
                        >
                          <div className="p-2" style={{}}>
                            {" "}
                            <span
                              onClick={() => {
                                previous();
                              }}
                              className="premium-btn-back"
                              style={{
                                color: "white",
                                backgroundColor: "#13181c",
                                width: "30px",
                                height: "30px",
                                borderRadius: "50%",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <svg
                                width={20}
                                height={20}
                                color="white"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                                className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-z80fyv r-19wmn03 r-jwli3a"
                              >
                                <g>
                                  <path d="M7.414 13l5.043 5.04-1.414 1.42L3.586 12l7.457-7.46 1.414 1.42L7.414 11H21v2H7.414z"></path>
                                </g>
                              </svg>
                            </span>
                          </div>
                          <div style={{}}>
                            {" "}
                            <span
                              style={{
                                color: "white",
                                lineHeight: "20px",
                                fontWeight: "500",
                                fontSize: "17px",
                                position: "relative",
                                left: "5px",
                              }}
                            >
                              Premium
                              <span
                                span
                                style={{
                                  visibility: "hidden",
                                }}
                              >
                                +
                              </span>
                            </span>
                          </div>
                          <div className="p-2" style={{}}>
                            {" "}
                            <span
                              onClick={() => {
                                next();
                              }}
                              className="premium-btn-back"
                              style={{
                                color: "white",
                                backgroundColor: "#13181c",
                                width: "30px",
                                height: "30px",
                                borderRadius: "50%",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <svg
                                width={20}
                                height={20}
                                color="white"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                                className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-z80fyv r-19wmn03 r-jwli3a"
                              >
                                <g>
                                  <path d="M12.957 4.54L20.414 12l-7.457 7.46-1.414-1.42L16.586 13H3v-2h13.586l-5.043-5.04 1.414-1.42z"></path>
                                </g>
                              </svg>
                            </span>
                          </div>
                        </Stack>{" "}
                        {/* enhanced experience start to check  */}
                        <div
                          className="mt-3 premium-plus-parent-div"
                          style={{
                            padding: "32px",
                            borderRadius: "16px",
                            backgroundColor: "#eff3f4",
                          }}
                        >
                          <div className="premium-plus-header">
                            Enhanced Experience
                          </div>
                          <div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <div>
                                <span>Ads in For You</span>
                                <svg
                                  width={16}
                                  height={16}
                                  color="rgba(83,100,113,1.00)"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="exclamation r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-10ptun7 r-1janqcz r-14j79pv"
                                >
                                  <g>
                                    <path d="M13.5 8.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5S11.17 7 12 7s1.5.67 1.5 1.5zM13 17v-5h-2v5h2zm-1 5.25c5.66 0 10.25-4.59 10.25-10.25S17.66 1.75 12 1.75 1.75 6.34 1.75 12 6.34 22.25 12 22.25zM20.25 12c0 4.56-3.69 8.25-8.25 8.25S3.75 16.56 3.75 12 7.44 3.75 12 3.75s8.25 3.69 8.25 8.25z"></path>
                                  </g>
                                </svg>
                              </div>
                              <div>Half</div>
                            </div>
                          </div>
                          <div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <div>
                                <span>Reply boost</span>
                              </div>
                              <div>Larger</div>
                            </div>
                          </div>
                          <div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <div>
                                <span>Edit post</span>{" "}
                              </div>
                              <div>
                                {" "}
                                <svg
                                  color="rgb(0, 186, 124)"
                                  fill="currentColor"
                                  width={20}
                                  height={20}
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-o6sn0f"
                                >
                                  <g>
                                    <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                  </g>
                                </svg>
                              </div>
                            </div>
                          </div>
                          <div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <div>
                                <span>Longer posts</span>{" "}
                              </div>
                              <div>
                                {" "}
                                <svg
                                  color="rgb(0, 186, 124)"
                                  fill="currentColor"
                                  width={20}
                                  height={20}
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-o6sn0f"
                                >
                                  <g>
                                    <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                  </g>
                                </svg>
                              </div>
                            </div>
                          </div>
                          <div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <div>
                                <span>Undo post</span>{" "}
                              </div>
                              <div>
                                {" "}
                                <svg
                                  color="rgb(0, 186, 124)"
                                  fill="currentColor"
                                  width={20}
                                  height={20}
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-o6sn0f"
                                >
                                  <g>
                                    <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                  </g>
                                </svg>
                              </div>
                            </div>
                          </div>
                          <div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <div>
                                <span>Post longer videos</span>{" "}
                              </div>
                              <div>
                                {" "}
                                <svg
                                  color="rgb(0, 186, 124)"
                                  fill="currentColor"
                                  width={20}
                                  height={20}
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-o6sn0f"
                                >
                                  <g>
                                    <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                  </g>
                                </svg>
                              </div>
                            </div>
                          </div>
                          <div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <div>
                                <span>Top Articles</span>{" "}
                              </div>
                              <div>
                                {" "}
                                <svg
                                  color="rgb(0, 186, 124)"
                                  fill="currentColor"
                                  width={20}
                                  height={20}
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-o6sn0f"
                                >
                                  <g>
                                    <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                  </g>
                                </svg>
                              </div>
                            </div>
                          </div>
                          {/* reader check  */}
                          <div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <div>
                                <span>Reader</span>{" "}
                                <svg
                                  width={20}
                                  height={20}
                                  color="rgba(83,100,113,1.00)"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="exclamation r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-10ptun7 r-1janqcz r-14j79pv"
                                >
                                  <g>
                                    <path d="M13.5 8.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5S11.17 7 12 7s1.5.67 1.5 1.5zM13 17v-5h-2v5h2zm-1 5.25c5.66 0 10.25-4.59 10.25-10.25S17.66 1.75 12 1.75 1.75 6.34 1.75 12 6.34 22.25 12 22.25zM20.25 12c0 4.56-3.69 8.25-8.25 8.25S3.75 16.56 3.75 12 7.44 3.75 12 3.75s8.25 3.69 8.25 8.25z"></path>
                                  </g>
                                </svg>
                              </div>
                              <div>
                                {" "}
                                <svg
                                  color="rgb(0, 186, 124)"
                                  fill="currentColor"
                                  width={20}
                                  height={20}
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-o6sn0f"
                                >
                                  <g>
                                    <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                  </g>
                                </svg>
                              </div>
                            </div>
                          </div>
                          {/* reader check  */}
                          <div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <div>
                                <span>Background video playback</span>{" "}
                              </div>
                              <div>
                                {" "}
                                <svg
                                  color="rgb(0, 186, 124)"
                                  fill="currentColor"
                                  width={20}
                                  height={20}
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-o6sn0f"
                                >
                                  <g>
                                    <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                  </g>
                                </svg>
                              </div>
                            </div>
                          </div>
                          <div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <div>
                                <span>Download videos</span>{" "}
                              </div>
                              <div>
                                {" "}
                                <svg
                                  color="rgb(0, 186, 124)"
                                  fill="currentColor"
                                  width={20}
                                  height={20}
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-o6sn0f"
                                >
                                  <g>
                                    <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                  </g>
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* enhanced experience finish to check  */}
                        {/* creator hub start to check  */}
                        <div
                          className="mt-3 premium-plus-parent-div"
                          style={{
                            padding: "32px",
                            borderRadius: "16px",
                            backgroundColor: "#eff3f4",
                          }}
                        >
                          <div className="premium-plus-header">Creator Hub</div>
                          <div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <div>
                                <span
                                  style={{
                                    color:
                                      "rgb(83, 100, 113)                                  ",
                                  }}
                                >
                                  Write Articles
                                </span>

                                <svg
                                  width={20}
                                  height={20}
                                  color="rgba(83,100,113,1.00)"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="exclamation r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-10ptun7 r-1janqcz r-14j79pv"
                                >
                                  <g>
                                    <path d="M13.5 8.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5S11.17 7 12 7s1.5.67 1.5 1.5zM13 17v-5h-2v5h2zm-1 5.25c5.66 0 10.25-4.59 10.25-10.25S17.66 1.75 12 1.75 1.75 6.34 1.75 12 6.34 22.25 12 22.25zM20.25 12c0 4.56-3.69 8.25-8.25 8.25S3.75 16.56 3.75 12 7.44 3.75 12 3.75s8.25 3.69 8.25 8.25z"></path>
                                  </g>
                                </svg>
                              </div>
                              <div>
                                {" "}
                                <svg
                                  width={`${1.25}em`}
                                  height={`${1.25}em`}
                                  color="rgba(83,100,113,1.00)"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-14j79pv"
                                >
                                  <g>
                                    <path d="M14 13c0 .74-.4 1.39-1 1.73V17h-2v-2.27c-.59-.34-1-.99-1-1.73 0-1.1.9-2 2-2 1.11 0 2 .9 2 2zm3.5-6H17v-.25c0-2.76-2.24-5-5-5s-5 2.24-5 5V7h-.5C5.12 7 4 8.12 4 9.5v9C4 19.88 5.12 21 6.5 21h11c1.38 0 2.5-1.12 2.5-2.5v-9C20 8.12 18.88 7 17.5 7zM9 6.75c0-1.66 1.34-3 3-3s3 1.34 3 3V7H9v-.25zm9 11.75c0 .28-.22.5-.5.5h-11c-.28 0-.5-.22-.5-.5v-9c0-.28.22-.5.5-.5h11c.28 0 .5.22.5.5v9z"></path>
                                  </g>
                                </svg>
                              </div>
                            </div>
                          </div>
                          <div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <div>
                                <span>Get paid to post</span>
                                <svg
                                  width={20}
                                  height={20}
                                  color="rgba(83,100,113,1.00)"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="exclamation r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-10ptun7 r-1janqcz r-14j79pv"
                                >
                                  <g>
                                    <path d="M13.5 8.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5S11.17 7 12 7s1.5.67 1.5 1.5zM13 17v-5h-2v5h2zm-1 5.25c5.66 0 10.25-4.59 10.25-10.25S17.66 1.75 12 1.75 1.75 6.34 1.75 12 6.34 22.25 12 22.25zM20.25 12c0 4.56-3.69 8.25-8.25 8.25S3.75 16.56 3.75 12 7.44 3.75 12 3.75s8.25 3.69 8.25 8.25z"></path>
                                  </g>
                                </svg>
                              </div>
                              <div>
                                {" "}
                                <svg
                                  color="rgb(0, 186, 124)"
                                  fill="currentColor"
                                  width={20}
                                  height={20}
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-o6sn0f"
                                >
                                  <g>
                                    <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                  </g>
                                </svg>
                              </div>
                            </div>
                          </div>
                          <div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <div>
                                <span>Creator Subscriptions</span>
                                <svg
                                  width={20}
                                  height={20}
                                  color="rgba(83,100,113,1.00)"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="exclamation r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-10ptun7 r-1janqcz r-14j79pv"
                                >
                                  <g>
                                    <path d="M13.5 8.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5S11.17 7 12 7s1.5.67 1.5 1.5zM13 17v-5h-2v5h2zm-1 5.25c5.66 0 10.25-4.59 10.25-10.25S17.66 1.75 12 1.75 1.75 6.34 1.75 12 6.34 22.25 12 22.25zM20.25 12c0 4.56-3.69 8.25-8.25 8.25S3.75 16.56 3.75 12 7.44 3.75 12 3.75s8.25 3.69 8.25 8.25z"></path>
                                  </g>
                                </svg>
                              </div>
                              <div>
                                {" "}
                                <svg
                                  color="rgb(0, 186, 124)"
                                  fill="currentColor"
                                  width={20}
                                  height={20}
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-o6sn0f"
                                >
                                  <g>
                                    <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                  </g>
                                </svg>
                              </div>
                            </div>
                          </div>
                          <div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <div>
                                <span>X Pro</span>
                                <svg
                                  width={20}
                                  height={20}
                                  color="rgba(83,100,113,1.00)"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="exclamation r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-10ptun7 r-1janqcz r-14j79pv"
                                >
                                  <g>
                                    <path d="M13.5 8.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5S11.17 7 12 7s1.5.67 1.5 1.5zM13 17v-5h-2v5h2zm-1 5.25c5.66 0 10.25-4.59 10.25-10.25S17.66 1.75 12 1.75 1.75 6.34 1.75 12 6.34 22.25 12 22.25zM20.25 12c0 4.56-3.69 8.25-8.25 8.25S3.75 16.56 3.75 12 7.44 3.75 12 3.75s8.25 3.69 8.25 8.25z"></path>
                                  </g>
                                </svg>
                              </div>
                              <div>
                                {" "}
                                <svg
                                  color="rgb(0, 186, 124)"
                                  fill="currentColor"
                                  width={20}
                                  height={20}
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-o6sn0f"
                                >
                                  <g>
                                    <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                  </g>
                                </svg>
                              </div>
                            </div>
                          </div>
                          <div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <div>
                                <span>Media Studio</span>
                                <svg
                                  width={20}
                                  height={20}
                                  color="rgba(83,100,113,1.00)"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="exclamation r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-10ptun7 r-1janqcz r-14j79pv"
                                >
                                  <g>
                                    <path d="M13.5 8.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5S11.17 7 12 7s1.5.67 1.5 1.5zM13 17v-5h-2v5h2zm-1 5.25c5.66 0 10.25-4.59 10.25-10.25S17.66 1.75 12 1.75 1.75 6.34 1.75 12 6.34 22.25 12 22.25zM20.25 12c0 4.56-3.69 8.25-8.25 8.25S3.75 16.56 3.75 12 7.44 3.75 12 3.75s8.25 3.69 8.25 8.25z"></path>
                                  </g>
                                </svg>
                              </div>
                              <div>
                                {" "}
                                <svg
                                  color="rgb(0, 186, 124)"
                                  fill="currentColor"
                                  width={20}
                                  height={20}
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-o6sn0f"
                                >
                                  <g>
                                    <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                  </g>
                                </svg>
                              </div>
                            </div>
                          </div>
                          <div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <div>
                                <span>Analytics</span>
                                <svg
                                  width={20}
                                  height={20}
                                  color="rgba(83,100,113,1.00)"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="exclamation r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-10ptun7 r-1janqcz r-14j79pv"
                                >
                                  <g>
                                    <path d="M13.5 8.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5S11.17 7 12 7s1.5.67 1.5 1.5zM13 17v-5h-2v5h2zm-1 5.25c5.66 0 10.25-4.59 10.25-10.25S17.66 1.75 12 1.75 1.75 6.34 1.75 12 6.34 22.25 12 22.25zM20.25 12c0 4.56-3.69 8.25-8.25 8.25S3.75 16.56 3.75 12 7.44 3.75 12 3.75s8.25 3.69 8.25 8.25z"></path>
                                  </g>
                                </svg>
                              </div>
                              <div>
                                {" "}
                                <svg
                                  color="rgb(0, 186, 124)"
                                  fill="currentColor"
                                  width={20}
                                  height={20}
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-o6sn0f"
                                >
                                  <g>
                                    <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                  </g>
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* creator hub finish to check  */}
                        {/* Verification and security start to check */}
                        <div
                          className="mt-3 premium-plus-parent-div"
                          style={{
                            padding: "32px",
                            borderRadius: "16px",
                            backgroundColor: "#eff3f4",
                          }}
                        >
                          <div className="premium-plus-header">
                            Verification & Security
                          </div>
                          <div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <div>
                                <span>Checkmark</span>
                                <svg
                                  width={20}
                                  height={20}
                                  color="rgba(83,100,113,1.00)"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="exclamation r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-10ptun7 r-1janqcz r-14j79pv"
                                >
                                  <g>
                                    <path d="M13.5 8.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5S11.17 7 12 7s1.5.67 1.5 1.5zM13 17v-5h-2v5h2zm-1 5.25c5.66 0 10.25-4.59 10.25-10.25S17.66 1.75 12 1.75 1.75 6.34 1.75 12 6.34 22.25 12 22.25zM20.25 12c0 4.56-3.69 8.25-8.25 8.25S3.75 16.56 3.75 12 7.44 3.75 12 3.75s8.25 3.69 8.25 8.25z"></path>
                                  </g>
                                </svg>
                              </div>
                              <div>
                                {" "}
                                <svg
                                  color="rgb(0, 186, 124)"
                                  fill="currentColor"
                                  width={20}
                                  height={20}
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-o6sn0f"
                                >
                                  <g>
                                    <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                  </g>
                                </svg>
                              </div>
                            </div>
                          </div>
                          <div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <div>
                                <span>Encrypted direct messages</span>
                                <svg
                                  width={20}
                                  height={20}
                                  color="rgba(83,100,113,1.00)"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="exclamation r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-10ptun7 r-1janqcz r-14j79pv"
                                >
                                  <g>
                                    <path d="M13.5 8.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5S11.17 7 12 7s1.5.67 1.5 1.5zM13 17v-5h-2v5h2zm-1 5.25c5.66 0 10.25-4.59 10.25-10.25S17.66 1.75 12 1.75 1.75 6.34 1.75 12 6.34 22.25 12 22.25zM20.25 12c0 4.56-3.69 8.25-8.25 8.25S3.75 16.56 3.75 12 7.44 3.75 12 3.75s8.25 3.69 8.25 8.25z"></path>
                                  </g>
                                </svg>
                              </div>
                              <div>
                                {" "}
                                <svg
                                  color="rgb(0, 186, 124)"
                                  fill="currentColor"
                                  width={20}
                                  height={20}
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-o6sn0f"
                                >
                                  <g>
                                    <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                  </g>
                                </svg>
                              </div>
                            </div>
                          </div>
                          <div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <div>
                                <span>Optional ID verification</span>
                                <svg
                                  width={20}
                                  height={20}
                                  color="rgba(83,100,113,1.00)"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="exclamation r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-10ptun7 r-1janqcz r-14j79pv"
                                >
                                  <g>
                                    <path d="M13.5 8.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5S11.17 7 12 7s1.5.67 1.5 1.5zM13 17v-5h-2v5h2zm-1 5.25c5.66 0 10.25-4.59 10.25-10.25S17.66 1.75 12 1.75 1.75 6.34 1.75 12 6.34 22.25 12 22.25zM20.25 12c0 4.56-3.69 8.25-8.25 8.25S3.75 16.56 3.75 12 7.44 3.75 12 3.75s8.25 3.69 8.25 8.25z"></path>
                                  </g>
                                </svg>
                              </div>
                              <div>
                                {" "}
                                <svg
                                  color="rgb(0, 186, 124)"
                                  fill="currentColor"
                                  width={20}
                                  height={20}
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-o6sn0f"
                                >
                                  <g>
                                    <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                  </g>
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* verification and security finish to check */}
                        {/* Customization start to check  */}
                        <div
                          className="mt-3 premium-plus-parent-div"
                          style={{
                            padding: "32px",
                            borderRadius: "16px",
                            backgroundColor: "#eff3f4",
                          }}
                        >
                          <div className="premium-plus-header">
                            Customization
                          </div>
                          <div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <div>
                                <span>App icons</span>
                              </div>
                              <div>
                                {" "}
                                <svg
                                  color="rgb(0, 186, 124)"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-o6sn0f"
                                >
                                  <g>
                                    <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                  </g>
                                </svg>
                              </div>
                            </div>
                          </div>

                          <div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <div>
                                <span>Bookmark folders</span>{" "}
                              </div>
                              <div>
                                {" "}
                                <svg
                                  color="rgb(0, 186, 124)"
                                  fill="currentColor"
                                  width={20}
                                  height={20}
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-o6sn0f"
                                >
                                  <g>
                                    <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                  </g>
                                </svg>
                              </div>
                            </div>
                          </div>
                          <div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <div>
                                <span>Customize navigation</span>{" "}
                              </div>
                              <div>
                                {" "}
                                <svg
                                  color="rgb(0, 186, 124)"
                                  fill="currentColor"
                                  width={20}
                                  height={20}
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-o6sn0f"
                                >
                                  <g>
                                    <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                  </g>
                                </svg>
                              </div>
                            </div>
                          </div>
                          <div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <div>
                                <span>Highlights tab</span>{" "}
                                <svg
                                  width={20}
                                  height={20}
                                  color="rgba(83,100,113,1.00)"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="exclamation r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-10ptun7 r-1janqcz r-14j79pv"
                                >
                                  <g>
                                    <path d="M13.5 8.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5S11.17 7 12 7s1.5.67 1.5 1.5zM13 17v-5h-2v5h2zm-1 5.25c5.66 0 10.25-4.59 10.25-10.25S17.66 1.75 12 1.75 1.75 6.34 1.75 12 6.34 22.25 12 22.25zM20.25 12c0 4.56-3.69 8.25-8.25 8.25S3.75 16.56 3.75 12 7.44 3.75 12 3.75s8.25 3.69 8.25 8.25z"></path>
                                  </g>
                                </svg>
                              </div>
                              <div>
                                {" "}
                                <svg
                                  color="rgb(0, 186, 124)"
                                  fill="currentColor"
                                  width={20}
                                  height={20}
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-o6sn0f"
                                >
                                  <g>
                                    <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                  </g>
                                </svg>
                              </div>
                            </div>
                          </div>
                          <div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <div>
                                <span>Hide your likes</span>{" "}
                              </div>
                              <div>
                                {" "}
                                <svg
                                  color="rgb(0, 186, 124)"
                                  fill="currentColor"
                                  width={20}
                                  height={20}
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-o6sn0f"
                                >
                                  <g>
                                    <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                  </g>
                                </svg>
                              </div>
                            </div>
                          </div>
                          <div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <div>
                                <span>Hide your checkmark</span>{" "}
                              </div>
                              <div>
                                {" "}
                                <svg
                                  color="rgb(0, 186, 124)"
                                  fill="currentColor"
                                  width={20}
                                  height={20}
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-o6sn0f"
                                >
                                  <g>
                                    <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                  </g>
                                </svg>
                              </div>
                            </div>
                          </div>
                          {/* reader check  */}
                          <div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <div>Hide your subscriptions</div>
                              <div>
                                {" "}
                                <svg
                                  color="rgb(0, 186, 124)"
                                  fill="currentColor"
                                  width={20}
                                  height={20}
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-o6sn0f"
                                >
                                  <g>
                                    <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                  </g>
                                </svg>
                              </div>
                            </div>
                          </div>
                          {/* reader check  */}
                        </div>
                        {/* Customization finish to check  */}
                      </div>
                      {/* second div premium plan finish to check  */}
                      {/* third div premium plus plan start to check   */}
                      <div
                        style={{
                          width: "81.5%",
                          margin: "0px auto",
                        }}
                      >
                        <Stack
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            backgroundImage:
                              "url(https://abs.twimg.com/responsive-web/client-web/background-premiumplus-web@3x.f3a57bda.png)",
                            backgroundPosition: "center",
                            backgroundSize: "cover",
                            borderRadius: "16px",
                            color: "white",
                            height: "60px",
                          }}
                          direction="horizontal"
                          gap={1}
                        >
                          <div className="p-2" style={{}}>
                            {" "}
                            <span
                              onClick={() => {
                                previous();
                              }}
                              className="premium-btn-back"
                              style={{
                                color: "white",
                                backgroundColor: "#13181c",
                                width: "30px",
                                height: "30px",
                                borderRadius: "50%",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <svg
                                width={20}
                                height={20}
                                color="white"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                                className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-z80fyv r-19wmn03 r-jwli3a"
                              >
                                <g>
                                  <path d="M7.414 13l5.043 5.04-1.414 1.42L3.586 12l7.457-7.46 1.414 1.42L7.414 11H21v2H7.414z"></path>
                                </g>
                              </svg>
                            </span>
                          </div>
                          <div style={{}}>
                            {" "}
                            <span
                              style={{
                                color: "white",
                                lineHeight: "20px",
                                fontWeight: "500",
                                fontSize: "17px",
                                position: "relative",
                                left: "5px",
                              }}
                            >
                              Premium+
                            </span>
                          </div>
                          <div className="p-2" style={{}}>
                            {" "}
                            <span
                              onClick={() => {
                                next();
                              }}
                              className="premium-btn-back"
                              style={{
                                color: "white",
                                backgroundColor: "#13181c",
                                width: "30px",
                                height: "30px",
                                borderRadius: "50%",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                visibility: "hidden",
                              }}
                            >
                              <svg
                                width={20}
                                height={20}
                                color="white"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                                className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-z80fyv r-19wmn03 r-jwli3a"
                              >
                                <g>
                                  <path d="M12.957 4.54L20.414 12l-7.457 7.46-1.414-1.42L16.586 13H3v-2h13.586l-5.043-5.04 1.414-1.42z"></path>
                                </g>
                              </svg>
                            </span>
                          </div>
                        </Stack>{" "}
                        {/* enhanced experience start to check  */}
                        <div
                          className="mt-3 premium-plus-parent-div"
                          style={{
                            padding: "32px",
                            borderRadius: "16px",
                            backgroundColor: "#eff3f4",
                          }}
                        >
                          <div className="premium-plus-header">
                            Enhanced Experience
                          </div>
                          <div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <div>
                                <span>Ads in For You</span>
                                <svg
                                  width={16}
                                  height={16}
                                  color="rgba(83,100,113,1.00)"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="exclamation r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-10ptun7 r-1janqcz r-14j79pv"
                                >
                                  <g>
                                    <path d="M13.5 8.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5S11.17 7 12 7s1.5.67 1.5 1.5zM13 17v-5h-2v5h2zm-1 5.25c5.66 0 10.25-4.59 10.25-10.25S17.66 1.75 12 1.75 1.75 6.34 1.75 12 6.34 22.25 12 22.25zM20.25 12c0 4.56-3.69 8.25-8.25 8.25S3.75 16.56 3.75 12 7.44 3.75 12 3.75s8.25 3.69 8.25 8.25z"></path>
                                  </g>
                                </svg>
                              </div>
                              <div>None</div>
                            </div>
                          </div>
                          <div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <div>
                                <span>Reply boost</span>
                              </div>
                              <div>Largest</div>
                            </div>
                          </div>
                          <div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <div>
                                <span>Edit post</span>{" "}
                              </div>
                              <div>
                                {" "}
                                <svg
                                  color="rgb(0, 186, 124)"
                                  fill="currentColor"
                                  width={20}
                                  height={20}
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-o6sn0f"
                                >
                                  <g>
                                    <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                  </g>
                                </svg>
                              </div>
                            </div>
                          </div>
                          <div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <div>
                                <span>Longer posts</span>{" "}
                              </div>
                              <div>
                                {" "}
                                <svg
                                  color="rgb(0, 186, 124)"
                                  fill="currentColor"
                                  width={20}
                                  height={20}
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-o6sn0f"
                                >
                                  <g>
                                    <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                  </g>
                                </svg>
                              </div>
                            </div>
                          </div>
                          <div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <div>
                                <span>Undo post</span>{" "}
                              </div>
                              <div>
                                {" "}
                                <svg
                                  color="rgb(0, 186, 124)"
                                  fill="currentColor"
                                  width={20}
                                  height={20}
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-o6sn0f"
                                >
                                  <g>
                                    <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                  </g>
                                </svg>
                              </div>
                            </div>
                          </div>
                          <div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <div>
                                <span>Post longer videos</span>{" "}
                              </div>
                              <div>
                                {" "}
                                <svg
                                  color="rgb(0, 186, 124)"
                                  fill="currentColor"
                                  width={20}
                                  height={20}
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-o6sn0f"
                                >
                                  <g>
                                    <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                  </g>
                                </svg>
                              </div>
                            </div>
                          </div>
                          <div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <div>
                                <span>Top Articles</span>{" "}
                              </div>
                              <div>
                                {" "}
                                <svg
                                  color="rgb(0, 186, 124)"
                                  fill="currentColor"
                                  width={20}
                                  height={20}
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-o6sn0f"
                                >
                                  <g>
                                    <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                  </g>
                                </svg>
                              </div>
                            </div>
                          </div>
                          {/* reader check  */}
                          <div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <div>
                                <span>Reader</span>{" "}
                                <svg
                                  width={20}
                                  height={20}
                                  color="rgba(83,100,113,1.00)"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="exclamation r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-10ptun7 r-1janqcz r-14j79pv"
                                >
                                  <g>
                                    <path d="M13.5 8.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5S11.17 7 12 7s1.5.67 1.5 1.5zM13 17v-5h-2v5h2zm-1 5.25c5.66 0 10.25-4.59 10.25-10.25S17.66 1.75 12 1.75 1.75 6.34 1.75 12 6.34 22.25 12 22.25zM20.25 12c0 4.56-3.69 8.25-8.25 8.25S3.75 16.56 3.75 12 7.44 3.75 12 3.75s8.25 3.69 8.25 8.25z"></path>
                                  </g>
                                </svg>
                              </div>
                              <div>
                                {" "}
                                <svg
                                  color="rgb(0, 186, 124)"
                                  fill="currentColor"
                                  width={20}
                                  height={20}
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-o6sn0f"
                                >
                                  <g>
                                    <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                  </g>
                                </svg>
                              </div>
                            </div>
                          </div>
                          {/* reader check  */}
                          <div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <div>
                                <span>Background video playback</span>{" "}
                              </div>
                              <div>
                                {" "}
                                <svg
                                  color="rgb(0, 186, 124)"
                                  fill="currentColor"
                                  width={20}
                                  height={20}
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-o6sn0f"
                                >
                                  <g>
                                    <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                  </g>
                                </svg>
                              </div>
                            </div>
                          </div>
                          <div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <div>
                                <span>Download videos</span>{" "}
                              </div>
                              <div>
                                {" "}
                                <svg
                                  color="rgb(0, 186, 124)"
                                  fill="currentColor"
                                  width={20}
                                  height={20}
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-o6sn0f"
                                >
                                  <g>
                                    <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                  </g>
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* enhanced experience finish to check  */}
                        {/* creator hub start to check  */}
                        <div
                          className="mt-3 premium-plus-parent-div"
                          style={{
                            padding: "32px",
                            borderRadius: "16px",
                            backgroundColor: "#eff3f4",
                          }}
                        >
                          <div className="premium-plus-header">Creator Hub</div>
                          <div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <div>
                                <span>Write Articles</span>
                                <svg
                                  width={20}
                                  height={20}
                                  color="rgba(83,100,113,1.00)"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="exclamation r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-10ptun7 r-1janqcz r-14j79pv"
                                >
                                  <g>
                                    <path d="M13.5 8.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5S11.17 7 12 7s1.5.67 1.5 1.5zM13 17v-5h-2v5h2zm-1 5.25c5.66 0 10.25-4.59 10.25-10.25S17.66 1.75 12 1.75 1.75 6.34 1.75 12 6.34 22.25 12 22.25zM20.25 12c0 4.56-3.69 8.25-8.25 8.25S3.75 16.56 3.75 12 7.44 3.75 12 3.75s8.25 3.69 8.25 8.25z"></path>
                                  </g>
                                </svg>
                              </div>
                              <div>
                                {" "}
                                <svg
                                  color="rgb(0, 186, 124)"
                                  fill="currentColor"
                                  width={20}
                                  height={20}
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-o6sn0f"
                                >
                                  <g>
                                    <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                  </g>
                                </svg>
                              </div>
                            </div>
                          </div>
                          <div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <div>
                                <span>Get paid to post</span>
                                <svg
                                  width={20}
                                  height={20}
                                  color="rgba(83,100,113,1.00)"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="exclamation r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-10ptun7 r-1janqcz r-14j79pv"
                                >
                                  <g>
                                    <path d="M13.5 8.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5S11.17 7 12 7s1.5.67 1.5 1.5zM13 17v-5h-2v5h2zm-1 5.25c5.66 0 10.25-4.59 10.25-10.25S17.66 1.75 12 1.75 1.75 6.34 1.75 12 6.34 22.25 12 22.25zM20.25 12c0 4.56-3.69 8.25-8.25 8.25S3.75 16.56 3.75 12 7.44 3.75 12 3.75s8.25 3.69 8.25 8.25z"></path>
                                  </g>
                                </svg>
                              </div>
                              <div>
                                {" "}
                                <svg
                                  color="rgb(0, 186, 124)"
                                  fill="currentColor"
                                  width={20}
                                  height={20}
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-o6sn0f"
                                >
                                  <g>
                                    <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                  </g>
                                </svg>
                              </div>
                            </div>
                          </div>
                          <div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <div>
                                <span>Creator Subscriptions</span>
                                <svg
                                  width={20}
                                  height={20}
                                  color="rgba(83,100,113,1.00)"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="exclamation r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-10ptun7 r-1janqcz r-14j79pv"
                                >
                                  <g>
                                    <path d="M13.5 8.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5S11.17 7 12 7s1.5.67 1.5 1.5zM13 17v-5h-2v5h2zm-1 5.25c5.66 0 10.25-4.59 10.25-10.25S17.66 1.75 12 1.75 1.75 6.34 1.75 12 6.34 22.25 12 22.25zM20.25 12c0 4.56-3.69 8.25-8.25 8.25S3.75 16.56 3.75 12 7.44 3.75 12 3.75s8.25 3.69 8.25 8.25z"></path>
                                  </g>
                                </svg>
                              </div>
                              <div>
                                {" "}
                                <svg
                                  color="rgb(0, 186, 124)"
                                  fill="currentColor"
                                  width={20}
                                  height={20}
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-o6sn0f"
                                >
                                  <g>
                                    <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                  </g>
                                </svg>
                              </div>
                            </div>
                          </div>
                          <div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <div>
                                <span>X Pro</span>
                                <svg
                                  width={20}
                                  height={20}
                                  color="rgba(83,100,113,1.00)"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="exclamation r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-10ptun7 r-1janqcz r-14j79pv"
                                >
                                  <g>
                                    <path d="M13.5 8.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5S11.17 7 12 7s1.5.67 1.5 1.5zM13 17v-5h-2v5h2zm-1 5.25c5.66 0 10.25-4.59 10.25-10.25S17.66 1.75 12 1.75 1.75 6.34 1.75 12 6.34 22.25 12 22.25zM20.25 12c0 4.56-3.69 8.25-8.25 8.25S3.75 16.56 3.75 12 7.44 3.75 12 3.75s8.25 3.69 8.25 8.25z"></path>
                                  </g>
                                </svg>
                              </div>
                              <div>
                                {" "}
                                <svg
                                  color="rgb(0, 186, 124)"
                                  fill="currentColor"
                                  width={20}
                                  height={20}
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-o6sn0f"
                                >
                                  <g>
                                    <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                  </g>
                                </svg>
                              </div>
                            </div>
                          </div>
                          <div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <div>
                                <span>Media Studio</span>
                                <svg
                                  width={20}
                                  height={20}
                                  color="rgba(83,100,113,1.00)"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="exclamation r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-10ptun7 r-1janqcz r-14j79pv"
                                >
                                  <g>
                                    <path d="M13.5 8.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5S11.17 7 12 7s1.5.67 1.5 1.5zM13 17v-5h-2v5h2zm-1 5.25c5.66 0 10.25-4.59 10.25-10.25S17.66 1.75 12 1.75 1.75 6.34 1.75 12 6.34 22.25 12 22.25zM20.25 12c0 4.56-3.69 8.25-8.25 8.25S3.75 16.56 3.75 12 7.44 3.75 12 3.75s8.25 3.69 8.25 8.25z"></path>
                                  </g>
                                </svg>
                              </div>
                              <div>
                                {" "}
                                <svg
                                  color="rgb(0, 186, 124)"
                                  fill="currentColor"
                                  width={20}
                                  height={20}
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-o6sn0f"
                                >
                                  <g>
                                    <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                  </g>
                                </svg>
                              </div>
                            </div>
                          </div>
                          <div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <div>
                                <span>Analytics</span>
                                <svg
                                  width={20}
                                  height={20}
                                  color="rgba(83,100,113,1.00)"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="exclamation r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-10ptun7 r-1janqcz r-14j79pv"
                                >
                                  <g>
                                    <path d="M13.5 8.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5S11.17 7 12 7s1.5.67 1.5 1.5zM13 17v-5h-2v5h2zm-1 5.25c5.66 0 10.25-4.59 10.25-10.25S17.66 1.75 12 1.75 1.75 6.34 1.75 12 6.34 22.25 12 22.25zM20.25 12c0 4.56-3.69 8.25-8.25 8.25S3.75 16.56 3.75 12 7.44 3.75 12 3.75s8.25 3.69 8.25 8.25z"></path>
                                  </g>
                                </svg>
                              </div>
                              <div>
                                {" "}
                                <svg
                                  color="rgb(0, 186, 124)"
                                  fill="currentColor"
                                  width={20}
                                  height={20}
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-o6sn0f"
                                >
                                  <g>
                                    <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                  </g>
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* creator hub finish to check  */}
                        {/* Verification and security start to check */}
                        <div
                          className="mt-3 premium-plus-parent-div"
                          style={{
                            padding: "32px",
                            borderRadius: "16px",
                            backgroundColor: "#eff3f4",
                          }}
                        >
                          <div className="premium-plus-header">
                            Verification & Security
                          </div>
                          <div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <div>
                                <span>Checkmark</span>
                                <svg
                                  width={20}
                                  height={20}
                                  color="rgba(83,100,113,1.00)"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="exclamation r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-10ptun7 r-1janqcz r-14j79pv"
                                >
                                  <g>
                                    <path d="M13.5 8.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5S11.17 7 12 7s1.5.67 1.5 1.5zM13 17v-5h-2v5h2zm-1 5.25c5.66 0 10.25-4.59 10.25-10.25S17.66 1.75 12 1.75 1.75 6.34 1.75 12 6.34 22.25 12 22.25zM20.25 12c0 4.56-3.69 8.25-8.25 8.25S3.75 16.56 3.75 12 7.44 3.75 12 3.75s8.25 3.69 8.25 8.25z"></path>
                                  </g>
                                </svg>
                              </div>
                              <div>
                                {" "}
                                <svg
                                  color="rgb(0, 186, 124)"
                                  fill="currentColor"
                                  width={20}
                                  height={20}
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-o6sn0f"
                                >
                                  <g>
                                    <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                  </g>
                                </svg>
                              </div>
                            </div>
                          </div>
                          <div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <div>
                                <span>Encrypted direct messages</span>
                                <svg
                                  width={20}
                                  height={20}
                                  color="rgba(83,100,113,1.00)"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="exclamation r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-10ptun7 r-1janqcz r-14j79pv"
                                >
                                  <g>
                                    <path d="M13.5 8.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5S11.17 7 12 7s1.5.67 1.5 1.5zM13 17v-5h-2v5h2zm-1 5.25c5.66 0 10.25-4.59 10.25-10.25S17.66 1.75 12 1.75 1.75 6.34 1.75 12 6.34 22.25 12 22.25zM20.25 12c0 4.56-3.69 8.25-8.25 8.25S3.75 16.56 3.75 12 7.44 3.75 12 3.75s8.25 3.69 8.25 8.25z"></path>
                                  </g>
                                </svg>
                              </div>
                              <div>
                                {" "}
                                <svg
                                  color="rgb(0, 186, 124)"
                                  fill="currentColor"
                                  width={20}
                                  height={20}
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-o6sn0f"
                                >
                                  <g>
                                    <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                  </g>
                                </svg>
                              </div>
                            </div>
                          </div>
                          <div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <div>
                                <span>Optional ID verification</span>
                                <svg
                                  width={20}
                                  height={20}
                                  color="rgba(83,100,113,1.00)"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="exclamation r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-10ptun7 r-1janqcz r-14j79pv"
                                >
                                  <g>
                                    <path d="M13.5 8.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5S11.17 7 12 7s1.5.67 1.5 1.5zM13 17v-5h-2v5h2zm-1 5.25c5.66 0 10.25-4.59 10.25-10.25S17.66 1.75 12 1.75 1.75 6.34 1.75 12 6.34 22.25 12 22.25zM20.25 12c0 4.56-3.69 8.25-8.25 8.25S3.75 16.56 3.75 12 7.44 3.75 12 3.75s8.25 3.69 8.25 8.25z"></path>
                                  </g>
                                </svg>
                              </div>
                              <div>
                                {" "}
                                <svg
                                  color="rgb(0, 186, 124)"
                                  fill="currentColor"
                                  width={20}
                                  height={20}
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-o6sn0f"
                                >
                                  <g>
                                    <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                  </g>
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* verification and security finish to check */}
                        {/* Customization start to check  */}
                        <div
                          className="mt-3 premium-plus-parent-div"
                          style={{
                            padding: "32px",
                            borderRadius: "16px",
                            backgroundColor: "#eff3f4",
                          }}
                        >
                          <div className="premium-plus-header">
                            Customization
                          </div>
                          <div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <div>
                                <span>App icons</span>
                              </div>
                              <div>
                                {" "}
                                <svg
                                  color="rgb(0, 186, 124)"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-o6sn0f"
                                >
                                  <g>
                                    <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                  </g>
                                </svg>
                              </div>
                            </div>
                          </div>

                          <div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <div>
                                <span>Bookmark folders</span>{" "}
                              </div>
                              <div>
                                {" "}
                                <svg
                                  color="rgb(0, 186, 124)"
                                  fill="currentColor"
                                  width={20}
                                  height={20}
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-o6sn0f"
                                >
                                  <g>
                                    <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                  </g>
                                </svg>
                              </div>
                            </div>
                          </div>
                          <div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <div>
                                <span>Customize navigation</span>{" "}
                              </div>
                              <div>
                                {" "}
                                <svg
                                  color="rgb(0, 186, 124)"
                                  fill="currentColor"
                                  width={20}
                                  height={20}
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-o6sn0f"
                                >
                                  <g>
                                    <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                  </g>
                                </svg>
                              </div>
                            </div>
                          </div>
                          <div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <div>
                                <span>Highlights tab</span>{" "}
                                <svg
                                  width={20}
                                  height={20}
                                  color="rgba(83,100,113,1.00)"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="exclamation r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-10ptun7 r-1janqcz r-14j79pv"
                                >
                                  <g>
                                    <path d="M13.5 8.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5S11.17 7 12 7s1.5.67 1.5 1.5zM13 17v-5h-2v5h2zm-1 5.25c5.66 0 10.25-4.59 10.25-10.25S17.66 1.75 12 1.75 1.75 6.34 1.75 12 6.34 22.25 12 22.25zM20.25 12c0 4.56-3.69 8.25-8.25 8.25S3.75 16.56 3.75 12 7.44 3.75 12 3.75s8.25 3.69 8.25 8.25z"></path>
                                  </g>
                                </svg>
                              </div>
                              <div>
                                {" "}
                                <svg
                                  color="rgb(0, 186, 124)"
                                  fill="currentColor"
                                  width={20}
                                  height={20}
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-o6sn0f"
                                >
                                  <g>
                                    <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                  </g>
                                </svg>
                              </div>
                            </div>
                          </div>
                          <div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <div>
                                <span>Hide your likes</span>{" "}
                              </div>
                              <div>
                                {" "}
                                <svg
                                  color="rgb(0, 186, 124)"
                                  fill="currentColor"
                                  width={20}
                                  height={20}
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-o6sn0f"
                                >
                                  <g>
                                    <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                  </g>
                                </svg>
                              </div>
                            </div>
                          </div>
                          <div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <div>
                                <span>Hide your checkmark</span>{" "}
                              </div>
                              <div>
                                {" "}
                                <svg
                                  color="rgb(0, 186, 124)"
                                  fill="currentColor"
                                  width={20}
                                  height={20}
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-o6sn0f"
                                >
                                  <g>
                                    <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                  </g>
                                </svg>
                              </div>
                            </div>
                          </div>
                          {/* reader check  */}
                          <div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <div>Hide your subscriptions</div>
                              <div>
                                {" "}
                                <svg
                                  color="rgb(0, 186, 124)"
                                  fill="currentColor"
                                  width={20}
                                  height={20}
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-o6sn0f"
                                >
                                  <g>
                                    <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                  </g>
                                </svg>
                              </div>
                            </div>
                          </div>
                          {/* reader check  */}
                        </div>
                        {/* Customization finish to check  */}
                      </div>
                      {/* third div premium plus plan finish to check   */}
                    </Slider>
                  </div>
                </Modal.Body>
                {subscriptionPremiumPlusPaymentScreen ? (
                  <>
                    <Modal
                      onHide={handleClosePremiumPlusPaymentScreen}
                      show={subscriptionPremiumPlusPaymentScreen}
                      style={{
                        overflowX: "hidden",
                        overflowY: "hidden",
                      }}
                      className="modal-sub-modal-payment-screen-parent"
                      dialogClassName="modal-body-sub-modal-payment-screen"
                    >
                      <Modal.Body
                        style={{
                          height: setPhoneVerifiedErrorMessage
                            ? "530px"
                            : "490px",
                        }}
                      >
                        <div
                          style={{
                            width: "95%",
                            fontSize: "23px",
                            fontWeight: "700",
                            lineHeight: "28px",
                            margin: "0 auto",
                          }}
                        >
                          Premium+
                        </div>

                        <div
                          onClick={() => {
                            setindividualSubOptionPremiumPlusAnnualTab(true);
                            setindividualSubOptionPremiumPlusMonthlyTab(false);
                          }}
                          className="individual-subscription-box mt-4"
                          style={{
                            width: "95%",

                            backgroundColor: "white",
                            minHeight: "96px",
                            padding: "12px",
                            cursor: "pointer",
                            borderWidth: "1px",
                            borderRadius: "16px",
                            boxShadow:
                              "0 0 15px rgba(101, 119,134,0.2), 0 0 3px 1px rgba(101,119,134,0.15)",
                            border: individualSubOptionPremiumPlusAnnualTab
                              ? "2px solid #339bf0"
                              : "2px solid transparent",
                            transition: "transform 0.3s ease",
                          }}
                        >
                          <span
                            style={{
                              color: "#697884",
                              fontSize: "14px",
                              fontWeight: "400",
                              lineHeight: "16px",
                            }}
                          >
                            Annual Plan{" "}
                            <span
                              style={{
                                fontSize: "11px",
                                backgroundColor: "#dcf8eb",
                                borderRadius: "9999px",
                                color: "black",
                                position: "relative",
                                bottom: "1px",
                                fontWeight: "700",
                                lineHeight: "12px",
                                padding: "4px",
                                height: "20px",
                              }}
                            >
                              <span>Save 12%</span>
                            </span>
                          </span>

                          <span
                            style={{
                              color: "rgb(15, 20, 25)",
                              fontSize: "17px",
                              fontWeight: "700",
                              lineHeight: "20px",
                              display: "block",
                            }}
                          >
                            €199.92 / year
                          </span>
                          <div
                            style={{
                              color: "rgb(83, 100, 113)",
                              fontSize: "13px",
                              fontWeight: "400",
                              lineHeight: "16px",
                            }}
                          >
                            €199.92 per year billed annually
                          </div>
                        </div>
                        <div
                          className="organization-subscription-box mt-3"
                          onClick={() => {
                            setindividualSubOptionPremiumPlusMonthlyTab(true);
                            setindividualSubOptionPremiumPlusAnnualTab(false);
                          }}
                          style={{
                            width: "95%",
                            backgroundColor: "white",
                            minHeight: "96px",
                            padding: "12px",
                            cursor: "pointer",
                            borderWidth: "1px",
                            borderRadius: "16px",
                            boxShadow:
                              "0 0 15px rgba(101, 119,134,0.2), 0 0 3px 1px rgba(101,119,134,0.15)",
                            border: individualSubOptionPremiumPlusMonthlyTab
                              ? "2px solid #339bf0"
                              : "2px solid transparent",
                            transition: "transform 0.3s ease",
                          }}
                        >
                          <span
                            style={{
                              color: "#697884",
                              fontSize: "14px",
                              fontWeight: "400",
                              lineHeight: "16px",
                            }}
                          >
                            Monthly Plan{" "}
                          </span>

                          <div
                            style={{
                              color: "rgb(15, 20, 25)",
                              fontSize: "17px",
                              fontWeight: "700",
                              lineHeight: "20px",
                            }}
                          >
                            €19.04 / month
                            <div
                              style={{
                                color: "rgb(83, 100, 113)",
                                fontSize: "13px",
                                fontWeight: "400",
                                lineHeight: "16px",
                              }}
                            >
                              €228.48 per year billed monthly
                            </div>
                          </div>
                        </div>
                        {setPhoneVerifiedErrorMessage ? (
                          <div
                            style={{
                              borderRadius: "8px",
                              color: "rgb(15, 20, 25)",
                              lineHeight: "16px",
                              fontSize: "14px",
                              fontWeight: "400",
                              backgroundColor: "#fef1f1",
                              width: "95%",
                              marginTop: "10px",
                              height: "40px",
                              display: "flex",
                              justifyContent: "left",
                              alignItems: "center",
                            }}
                          >
                            <span
                              style={{
                                position: "relative",
                                left: "15px",
                              }}
                            >
                              Something went wrong. Please try again.
                            </span>
                          </div>
                        ) : null}
                        <Button
                          onClick={() => handlePhoneVerifiedCheck()}
                          className={`login-button next-btn ${
                            setPhoneVerifiedErrorMessage ? "mt-2" : "mt-4"
                          }`}
                          variant="dark"
                          style={{
                            width: "95%",
                            height: "36px",
                            color: "white",
                            backgroundColor: "#0f141a",
                          }}
                        >
                          Subscribe & Pay
                        </Button>

                        <div
                          className="mt-3"
                          style={{
                            width: "95%",
                            fontSize: "13px",
                            lineHeight: "16px",
                            fontWeight: "400",
                            border: "1px solid black",
                            borderRadius: "8px",
                            padding: "6px",
                          }}
                        >
                          {`By subscribing, you agree to our `}
                          <span
                            className="sub-modal-text-footer"
                            style={{
                              color: "rgb(29, 155, 240)",
                            }}
                          >
                            Purchaser Terms of Service
                          </span>
                          {`. Subscriptions auto-renew until canceled, as described in the Terms.`}{" "}
                          <span
                            className="sub-modal-text-footer"
                            style={{
                              color: "rgb(29, 155, 240)",
                            }}
                          >
                            Cancel anytime
                          </span>
                          {`. Cancel at least 24 hours prior to renewal to avoid additional charges. A verified phone number is required to subscribe. If you've subscribed on another platform, manage your subscription through that platform.`}
                        </div>
                      </Modal.Body>
                    </Modal>
                  </>
                ) : subscriptionPremiumPaymentScreen ? (
                  <>
                    <Modal
                      onHide={handleClosePremiumPaymentScreen}
                      show={subscriptionPremiumPaymentScreen}
                      style={{
                        overflowX: "hidden",
                        overflowY: "hidden",
                      }}
                      className="modal-sub-modal-payment-screen-parent"
                      dialogClassName="modal-body-sub-modal-payment-screen"
                    >
                      <Modal.Body
                        style={{
                          height: setPhoneVerifiedErrorMessage
                            ? "530px"
                            : "490px",
                        }}
                      >
                        <div
                          style={{
                            width: "95%",
                            fontSize: "23px",
                            fontWeight: "700",
                            lineHeight: "28px",
                            margin: "0 auto",
                          }}
                        >
                          Premium
                        </div>

                        <div
                          onClick={() => {
                            setindividualSubOptionPremiumPlusAnnualTab(true);
                            setindividualSubOptionPremiumPlusMonthlyTab(false);
                          }}
                          className="individual-subscription-box mt-4"
                          style={{
                            width: "95%",

                            backgroundColor: "white",
                            minHeight: "96px",
                            padding: "12px",
                            cursor: "pointer",
                            borderWidth: "1px",
                            borderRadius: "16px",
                            boxShadow:
                              "0 0 15px rgba(101, 119,134,0.2), 0 0 3px 1px rgba(101,119,134,0.15)",
                            border: individualSubOptionPremiumPlusAnnualTab
                              ? "2px solid #339bf0"
                              : "2px solid transparent",
                            transition: "transform 0.3s ease",
                          }}
                        >
                          <span
                            style={{
                              color: "#697884",
                              fontSize: "14px",
                              fontWeight: "400",
                              lineHeight: "16px",
                            }}
                          >
                            Annual Plan{" "}
                            <span
                              style={{
                                fontSize: "11px",
                                backgroundColor: "#dcf8eb",
                                borderRadius: "9999px",
                                color: "black",
                                position: "relative",
                                bottom: "1px",
                                fontWeight: "700",
                                lineHeight: "12px",
                                padding: "4px",
                                height: "20px",
                              }}
                            >
                              <span>Save 12%</span>
                            </span>
                          </span>

                          <span
                            style={{
                              color: "rgb(15, 20, 25)",
                              fontSize: "17px",
                              fontWeight: "700",
                              lineHeight: "20px",
                              display: "block",
                            }}
                          >
                            €99.96 / year
                          </span>
                          <div
                            style={{
                              color: "rgb(83, 100, 113)",
                              fontSize: "13px",
                              fontWeight: "400",
                              lineHeight: "16px",
                            }}
                          >
                            €99.96 per year billed annually
                          </div>
                        </div>
                        <div
                          className="organization-subscription-box mt-3"
                          onClick={() => {
                            setindividualSubOptionPremiumPlusMonthlyTab(true);
                            setindividualSubOptionPremiumPlusAnnualTab(false);
                          }}
                          style={{
                            width: "95%",
                            backgroundColor: "white",
                            minHeight: "96px",
                            padding: "12px",
                            cursor: "pointer",
                            borderWidth: "1px",
                            borderRadius: "16px",
                            boxShadow:
                              "0 0 15px rgba(101, 119,134,0.2), 0 0 3px 1px rgba(101,119,134,0.15)",
                            border: individualSubOptionPremiumPlusMonthlyTab
                              ? "2px solid #339bf0"
                              : "2px solid transparent",
                            transition: "transform 0.3s ease",
                          }}
                        >
                          <span
                            style={{
                              color: "#697884",
                              fontSize: "14px",
                              fontWeight: "400",
                              lineHeight: "16px",
                            }}
                          >
                            Monthly Plan{" "}
                          </span>

                          <div
                            style={{
                              color: "rgb(15, 20, 25)",
                              fontSize: "17px",
                              fontWeight: "700",
                              lineHeight: "20px",
                            }}
                          >
                            €9.52 / month
                            <div
                              style={{
                                color: "rgb(83, 100, 113)",
                                fontSize: "13px",
                                fontWeight: "400",
                                lineHeight: "16px",
                              }}
                            >
                              €114.24 per year billed monthly
                            </div>
                          </div>
                        </div>
                        {setPhoneVerifiedErrorMessage ? (
                          <div
                            style={{
                              borderRadius: "8px",
                              color: "rgb(15, 20, 25)",
                              lineHeight: "16px",
                              fontSize: "14px",
                              fontWeight: "400",
                              backgroundColor: "#fef1f1",
                              width: "95%",
                              marginTop: "10px",
                              height: "40px",
                              display: "flex",
                              justifyContent: "left",
                              alignItems: "center",
                            }}
                          >
                            <span
                              style={{
                                position: "relative",
                                left: "15px",
                              }}
                            >
                              Something went wrong. Please try again.
                            </span>
                          </div>
                        ) : null}
                        <Button
                          onClick={() => handlePhoneVerifiedCheck()}
                          className={`login-button next-btn ${
                            setPhoneVerifiedErrorMessage ? "mt-2" : "mt-4"
                          }`}
                          variant="dark"
                          style={{
                            width: "95%",
                            height: "36px",
                            color: "white",
                            backgroundColor: "#0f141a",
                          }}
                        >
                          Subscribe & Pay
                        </Button>

                        <div
                          className="mt-3"
                          style={{
                            width: "95%",
                            fontSize: "13px",
                            lineHeight: "16px",
                            fontWeight: "400",
                            border: "1px solid black",
                            borderRadius: "8px",
                            padding: "6px",
                          }}
                        >
                          {`By subscribing, you agree to our `}
                          <span
                            className="sub-modal-text-footer"
                            style={{
                              color: "rgb(29, 155, 240)",
                            }}
                          >
                            Purchaser Terms of Service
                          </span>
                          {`. Subscriptions auto-renew until canceled, as described in the Terms.`}{" "}
                          <span
                            className="sub-modal-text-footer"
                            style={{
                              color: "rgb(29, 155, 240)",
                            }}
                          >
                            Cancel anytime
                          </span>
                          {`. Cancel at least 24 hours prior to renewal to avoid additional charges. A verified phone number is required to subscribe. If you've subscribed on another platform, manage your subscription through that platform.`}
                        </div>
                      </Modal.Body>
                    </Modal>
                  </>
                ) : subscriptionBasicPaymentScreen ? (
                  <>
                    <Modal
                      onHide={handleCloseBasicPaymentScreen}
                      show={subscriptionBasicPaymentScreen}
                      style={{
                        overflowX: "hidden",
                        overflowY: "hidden",
                      }}
                      className="modal-sub-modal-payment-screen-parent"
                      dialogClassName="modal-body-sub-modal-payment-screen"
                    >
                      <Modal.Body
                        style={{
                          height: setPhoneVerifiedErrorMessage
                            ? "530px"
                            : "490px",
                        }}
                      >
                        <div
                          style={{
                            width: "95%",
                            fontSize: "23px",
                            fontWeight: "700",
                            lineHeight: "28px",
                            margin: "0 auto",
                          }}
                        >
                          Basic
                        </div>

                        <div
                          onClick={() => {
                            setindividualSubOptionPremiumPlusAnnualTab(true);
                            setindividualSubOptionPremiumPlusMonthlyTab(false);
                          }}
                          className="individual-subscription-box mt-4"
                          style={{
                            width: "95%",

                            backgroundColor: "white",
                            minHeight: "96px",
                            padding: "12px",
                            cursor: "pointer",
                            borderWidth: "1px",
                            borderRadius: "16px",
                            boxShadow:
                              "0 0 15px rgba(101, 119,134,0.2), 0 0 3px 1px rgba(101,119,134,0.15)",
                            border: individualSubOptionPremiumPlusAnnualTab
                              ? "2px solid #339bf0"
                              : "2px solid transparent",
                            transition: "transform 0.3s ease",
                          }}
                        >
                          <span
                            style={{
                              color: "#697884",
                              fontSize: "14px",
                              fontWeight: "400",
                              lineHeight: "16px",
                            }}
                          >
                            Annual Plan{" "}
                            <span
                              style={{
                                fontSize: "11px",
                                backgroundColor: "#dcf8eb",
                                borderRadius: "9999px",
                                color: "black",
                                position: "relative",
                                bottom: "1px",
                                fontWeight: "700",
                                lineHeight: "12px",
                                padding: "4px",
                                height: "20px",
                              }}
                            >
                              <span>Save 11%</span>
                            </span>
                          </span>

                          <span
                            style={{
                              color: "rgb(15, 20, 25)",
                              fontSize: "17px",
                              fontWeight: "700",
                              lineHeight: "20px",
                              display: "block",
                            }}
                          >
                            €38.08 / year
                          </span>
                          <div
                            style={{
                              color: "rgb(83, 100, 113)",
                              fontSize: "13px",
                              fontWeight: "400",
                              lineHeight: "16px",
                            }}
                          >
                            €38.08 per year billed annually
                          </div>
                        </div>
                        <div
                          className="organization-subscription-box mt-3"
                          onClick={() => {
                            setindividualSubOptionPremiumPlusMonthlyTab(true);
                            setindividualSubOptionPremiumPlusAnnualTab(false);
                          }}
                          style={{
                            width: "95%",
                            backgroundColor: "white",
                            minHeight: "96px",
                            padding: "12px",
                            cursor: "pointer",
                            borderWidth: "1px",
                            borderRadius: "16px",
                            boxShadow:
                              "0 0 15px rgba(101, 119,134,0.2), 0 0 3px 1px rgba(101,119,134,0.15)",
                            border: individualSubOptionPremiumPlusMonthlyTab
                              ? "2px solid #339bf0"
                              : "2px solid transparent",
                            transition: "transform 0.3s ease",
                          }}
                        >
                          <span
                            style={{
                              color: "#697884",
                              fontSize: "14px",
                              fontWeight: "400",
                              lineHeight: "16px",
                            }}
                          >
                            Monthly Plan{" "}
                          </span>

                          <div
                            style={{
                              color: "rgb(15, 20, 25)",
                              fontSize: "17px",
                              fontWeight: "700",
                              lineHeight: "20px",
                            }}
                          >
                            €3.57 / month
                            <div
                              style={{
                                color: "rgb(83, 100, 113)",
                                fontSize: "13px",
                                fontWeight: "400",
                                lineHeight: "16px",
                              }}
                            >
                              €42.84 per year billed monthly
                            </div>
                          </div>
                        </div>
                        {setPhoneVerifiedErrorMessage ? (
                          <div
                            style={{
                              borderRadius: "8px",
                              color: "rgb(15, 20, 25)",
                              lineHeight: "16px",
                              fontSize: "14px",
                              fontWeight: "400",
                              backgroundColor: "#fef1f1",
                              width: "95%",
                              marginTop: "10px",
                              height: "40px",
                              display: "flex",
                              justifyContent: "left",
                              alignItems: "center",
                            }}
                          >
                            <span
                              style={{
                                position: "relative",
                                left: "15px",
                              }}
                            >
                              Something went wrong. Please try again.
                            </span>
                          </div>
                        ) : null}

                        <Button
                          onClick={() => handlePhoneVerifiedCheck()}
                          className={`login-button next-btn ${
                            setPhoneVerifiedErrorMessage ? "mt-2" : "mt-4"
                          }`}
                          variant="dark"
                          style={{
                            width: "95%",
                            height: "36px",
                            color: "white",
                            backgroundColor: "#0f141a",
                          }}
                        >
                          Subscribe & Pay
                        </Button>

                        <div
                          className="mt-3"
                          style={{
                            width: "95%",
                            fontSize: "13px",
                            lineHeight: "16px",
                            fontWeight: "400",
                            border: "1px solid black",
                            borderRadius: "8px",
                            padding: "6px",
                          }}
                        >
                          {`By subscribing, you agree to our `}
                          <span
                            className="sub-modal-text-footer"
                            style={{
                              color: "rgb(29, 155, 240)",
                            }}
                          >
                            Purchaser Terms of Service
                          </span>
                          {`. Subscriptions auto-renew until canceled, as described in the Terms.`}{" "}
                          <span
                            className="sub-modal-text-footer"
                            style={{
                              color: "rgb(29, 155, 240)",
                            }}
                          >
                            Cancel anytime
                          </span>
                          {`. Cancel at least 24 hours prior to renewal to avoid additional charges. A verified phone number is required to subscribe. If you've subscribed on another platform, manage your subscription through that platform.`}
                        </div>
                      </Modal.Body>
                    </Modal>
                  </>
                ) : null}
                {individualSubOptionTab === 2 ? (
                  <Modal.Footer
                    style={{
                      height: "69px",
                      backgroundColor: "#fdfdfe",
                      position: "relative",
                      right: "15px",
                    }}
                  >
                    <div
                      style={{
                        width: "90%",
                        height: "69px",
                        padding: "22px 0px",
                        position: "relative",
                        borderRight: "1px solid rgba(0,0,0,0.1)",
                        borderLeft: "1px solid rgba(0,0,0,0.1)",
                        top: "17px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "#ffffff",
                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                      }}
                    >
                      <Button
                        onClick={showPremiumPlusPaymentScreen}
                        className="login-button next-btn"
                        variant="dark"
                        style={{
                          width: "75%",
                          color: "white",
                          backgroundColor: "#0f141a",
                        }}
                      >
                        Starting at €19.04
                      </Button>
                    </div>
                  </Modal.Footer>
                ) : individualSubOptionTab === 1 ? (
                  <Modal.Footer
                    style={{
                      height: "69px",
                      backgroundColor: "#fdfdfe",
                      position: "relative",
                      right: "15px",
                    }}
                  >
                    <div
                      style={{
                        width: "90%",
                        height: "69px",
                        padding: "22px 0px",
                        position: "relative",
                        borderRight: "1px solid rgba(0,0,0,0.1)",
                        borderLeft: "1px solid rgba(0,0,0,0.1)",
                        top: "17px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "#ffffff",
                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                      }}
                    >
                      <Button
                        onClick={showPremiumPaymentScreen}
                        className="login-button next-btn"
                        variant="dark"
                        style={{
                          width: "75%",
                          color: "white",
                          backgroundColor: "#0f141a",
                        }}
                      >
                        Starting at €9.60
                      </Button>
                    </div>
                  </Modal.Footer>
                ) : individualSubOptionTab === 0 ? (
                  <Modal.Footer
                    style={{
                      height: "69px",
                      backgroundColor: "#fdfdfe",
                      position: "relative",
                      right: "15px",
                    }}
                  >
                    <div
                      style={{
                        width: "90%",
                        height: "69px",
                        padding: "22px 0px",
                        position: "relative",
                        borderRight: "1px solid rgba(0,0,0,0.1)",
                        borderLeft: "1px solid rgba(0,0,0,0.1)",
                        top: "17px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "#ffffff",
                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                      }}
                    >
                      <Button
                        onClick={showBasicPaymentScreen}
                        className="login-button next-btn"
                        variant="dark"
                        style={{
                          width: "75%",
                          color: "white",
                          backgroundColor: "#0f141a",
                        }}
                      >
                        Starting at €3.57
                      </Button>
                    </div>
                  </Modal.Footer>
                ) : null}
              </>
            ) : tabIndex === 1 && isOrganizationSubscriptionClicked ? (
              <>
                {" "}
                <>
                  <Modal.Body
                    className="scrollbar-add"
                    style={{
                      position: "relative",
                      bottom: "35px",
                      zIndex: 1,
                    }}
                  >
                    <div
                      className="mt-4"
                      style={{
                        backgroundColor: "black",
                        borderRadius: "9999px",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <div
                        style={{
                          width: "184px",
                          height: "40px",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <button
                          onClick={() => {
                            basicPlanClick();
                          }}
                          style={tabStyleOrganizationBasicStyle}
                        >
                          <span
                            style={{
                              padding: "6px",
                            }}
                          >
                            Basic
                          </span>
                        </button>
                        <button
                          onClick={() => {
                            fullAccessPlanClick();
                          }}
                          style={tabStyleOrganizationFullAccessStyle}
                        >
                          <span style={{}}>Full Access</span>
                        </button>
                      </div>
                    </div>
                    {subTabIndexFromOrganizatonSelect === 1 &&
                    tabStyleOrganizationBasicPlan ? (
                      <>
                        <div
                          className="mt-2"
                          style={{
                            width: "100%",
                            backgroundColor: "rgba(247, 249, 249, 1.00)",
                            borderRadius: "16px",
                            padding: "16px",
                          }}
                        >
                          <div
                            style={{
                              color: "rgb(83, 100, 113)",
                              lineHeight: "28px",
                              fontWeight: "700",
                              fontSize: "23px",
                            }}
                          >
                            Basic
                          </div>
                          <div
                            style={{
                              fontSize: "34px",
                              lineHeight: "40px",
                              fontWeight: "700",
                            }}
                          >
                            Find your customers and grow your business
                          </div>
                          <div
                            className="basic-plan-parent-div"
                            style={{
                              lineHeight: "20px",
                              fontWeight: "500",
                              fontSize: "15px",
                            }}
                          >
                            <div>
                              Try advertising and grow your business with
                              priority support and ads credits.
                            </div>
                            <div>
                              <div
                                style={{
                                  display: "flex",
                                }}
                              >
                                <svg
                                  width={`${1.25}em`}
                                  height={`${1.25}em`}
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr"
                                >
                                  <g>
                                    <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                  </g>
                                </svg>
                                <span>Gold checkmark</span>
                              </div>
                            </div>
                            <div>
                              {" "}
                              <div
                                style={{
                                  display: "flex",
                                }}
                              >
                                <svg
                                  width={`${1.25}em`}
                                  height={`${1.25}em`}
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr"
                                >
                                  <g>
                                    <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                  </g>
                                </svg>
                                <span>Priority support</span>
                              </div>{" "}
                            </div>
                            <div>
                              {" "}
                              <div
                                style={{
                                  display: "flex",
                                }}
                              >
                                <svg
                                  width={`${1.25}em`}
                                  height={`${1.25}em`}
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr"
                                >
                                  <g>
                                    <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                  </g>
                                </svg>
                                <span>Premium+</span>
                              </div>
                            </div>
                            <div>
                              {" "}
                              <div
                                style={{
                                  display: "flex",
                                }}
                              >
                                <svg
                                  width={`${1.25}em`}
                                  height={`${1.25}em`}
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr"
                                >
                                  <g>
                                    <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                  </g>
                                </svg>
                                <span>Hiring</span>
                              </div>
                            </div>
                            <div>
                              {" "}
                              <div
                                style={{
                                  display: "flex",
                                }}
                              >
                                <svg
                                  color="rgba(83, 100, 113, 1.00)"
                                  fill="currentColor"
                                  width={`${1.25}em`}
                                  height={`${1.25}em`}
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-14j79pv"
                                >
                                  <g>
                                    <path d="M14 13c0 .74-.4 1.39-1 1.73V17h-2v-2.27c-.59-.34-1-.99-1-1.73 0-1.1.9-2 2-2 1.11 0 2 .9 2 2zm3.5-6H17v-.25c0-2.76-2.24-5-5-5s-5 2.24-5 5V7h-.5C5.12 7 4 8.12 4 9.5v9C4 19.88 5.12 21 6.5 21h11c1.38 0 2.5-1.12 2.5-2.5v-9C20 8.12 18.88 7 17.5 7zM9 6.75c0-1.66 1.34-3 3-3s3 1.34 3 3V7H9v-.25zm9 11.75c0 .28-.22.5-.5.5h-11c-.28 0-.5-.22-.5-.5v-9c0-.28.22-.5.5-.5h11c.28 0 .5.22.5.5v9z"></path>
                                  </g>
                                </svg>
                                <span>2x boost</span>
                              </div>
                            </div>
                            <div>
                              {" "}
                              <div
                                style={{
                                  display: "flex",
                                }}
                              >
                                <svg
                                  color="rgba(83, 100, 113, 1.00)"
                                  fill="currentColor"
                                  width={`${1.25}em`}
                                  height={`${1.25}em`}
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-14j79pv"
                                >
                                  <g>
                                    <path d="M14 13c0 .74-.4 1.39-1 1.73V17h-2v-2.27c-.59-.34-1-.99-1-1.73 0-1.1.9-2 2-2 1.11 0 2 .9 2 2zm3.5-6H17v-.25c0-2.76-2.24-5-5-5s-5 2.24-5 5V7h-.5C5.12 7 4 8.12 4 9.5v9C4 19.88 5.12 21 6.5 21h11c1.38 0 2.5-1.12 2.5-2.5v-9C20 8.12 18.88 7 17.5 7zM9 6.75c0-1.66 1.34-3 3-3s3 1.34 3 3V7H9v-.25zm9 11.75c0 .28-.22.5-.5.5h-11c-.28 0-.5-.22-.5-.5v-9c0-.28.22-.5.5-.5h11c.28 0 .5.22.5.5v9z"></path>
                                  </g>
                                </svg>
                                <span>Affiliations</span>
                              </div>
                            </div>
                          </div>
                          <div
                            style={{
                              fontSize: "15px",
                              fontWeight: "400",
                              lineHeight: "20px",
                            }}
                            className="mt-1"
                          >
                            + For a limited time, advertising credit to spend on
                            your organization{" "}
                            <span
                              style={{
                                lineHeight: "20px",
                                fontSize: "15px",
                                fontWeight: "700",
                                textDecoration: "underline",
                              }}
                            >
                              {basicAnnualTabStyle
                                ? "every year"
                                : "every month"}
                            </span>{" "}
                            with dedicated support.{" "}
                            <span
                              className="learn-more-basic-plan"
                              style={{
                                cursor: "pointer",
                                color: "rgb(29, 155, 240)",
                              }}
                            >
                              Learn more
                            </span>
                          </div>
                        </div>
                        <div
                          style={{
                            width: "100%",
                            // position: "absolute",
                            // bottom: "0px",
                            // backgroundColor: "yellow",
                          }}
                        >
                          <div
                            className="mt-4"
                            style={{
                              display: "flex",
                              gap: "2.5%",
                            }}
                          >
                            {/* annual plan start to check  */}
                            <div
                              onClick={() => {
                                setbasicAnnualTabStyle(true);
                                setbasicMonthlyTabStyle(false);
                              }}
                              style={
                                ({ activeIndividualOptionTabStyle },
                                {
                                  flex: 1,
                                  backgroundColor: "white",
                                  maxHeight: "72px",
                                  padding: "12px",
                                  cursor: "pointer",
                                  borderWidth: "1px",
                                  borderRadius: "16px",
                                  boxShadow:
                                    "0 0 15px rgba(101, 119,134,0.2), 0 0 3px 1px rgba(101,119,134,0.15)",
                                  border: basicAnnualTabStyle
                                    ? "2px solid #339bf0"
                                    : "2px solid transparent",
                                  transition: "transform 0.3s ease",
                                })
                              }
                              className="individual-subscription-box"
                            >
                              <div>
                                <div
                                  style={{
                                    color: "rgb(15, 20, 25)",
                                    fontSize: "18px",
                                    fontWeight: "600",
                                    display: " flex",
                                  }}
                                >
                                  {" "}
                                  <div>{yearlyFee} / year</div>
                                  <div
                                    style={{
                                      fontSize: "12px",
                                      backgroundColor: "#dcf8eb",
                                      borderRadius: "9999px",
                                      height: "20px",
                                      display: "flex",
                                      justifyContent: "center",
                                      alignItems: "center",
                                      position: "relative",
                                      top: "5px",
                                    }}
                                  >
                                    <span
                                      style={{
                                        padding: "4px 4px",
                                      }}
                                    >
                                      Save 16%
                                    </span>
                                  </div>
                                </div>
                                <div
                                  style={{
                                    color: "#697884",
                                    fontSize: "14px",
                                    fontWeight: "400",
                                  }}
                                >
                                  {" "}
                                  Annual plan
                                </div>
                              </div>
                            </div>
                            {/* annual plan finish to check  */}
                            {/* monthly plan start to check  */}
                            <div
                              onClick={() => {
                                setbasicMonthlyTabStyle(true);
                                setbasicAnnualTabStyle(false);
                              }}
                              style={
                                ({ activeOrganizationOptionTabStyle },
                                {
                                  flex: 1,
                                  backgroundColor: "white",
                                  maxHeight: "72px",
                                  padding: "12px",
                                  cursor: "pointer",
                                  borderWidth: "1px",
                                  borderRadius: "16px",
                                  boxShadow:
                                    "0 0 15px rgba(101, 119,134,0.2), 0 0 3px 1px rgba(101,119,134,0.15)",
                                  border: basicMonthlyTabStyle
                                    ? "2px solid #339bf0"
                                    : "2px solid transparent",
                                  transition: "transform 0.3s ease",
                                })
                              }
                              className="organization-subscription-box"
                            >
                              <div
                                style={{
                                  position: "relative",
                                }}
                              >
                                <div
                                  style={{
                                    color: "rgb(15, 20, 25)",
                                    fontSize: "18px",
                                    fontWeight: "600",
                                  }}
                                >
                                  {monthyleFee} / month
                                </div>{" "}
                                <div
                                  style={{
                                    color: "#697884",
                                    fontSize: "14px",
                                    fontWeight: "400",
                                  }}
                                >
                                  Monthly plan
                                </div>
                              </div>
                            </div>
                            {/* monthly plan finish to check  */}
                          </div>
                          <div
                            className="mt-3"
                            style={{
                              color: "rgb(83, 100, 113)",
                              fontSize: "11px",
                              lineHeight: "12px",
                              fontWeight: "400",
                              height: "20px",
                            }}
                          >
                            {" "}
                            <span>
                              Basic is{" "}
                              {basicAnnualTabStyle
                                ? yearlyFee
                                : monthyleFee
                                ? monthyleFee
                                : null}
                              /
                              {basicAnnualTabStyle
                                ? "year"
                                : monthyleFee
                                ? "month"
                                : null}{" "}
                              (tax inclusive).{" "}
                            </span>
                            <span
                              className="learn-more-basic-plan"
                              style={{
                                color: "rgb(29, 155, 240)",
                                cursor: "pointer",
                              }}
                            >
                              Learn more
                            </span>
                          </div>
                          <Button
                            onClick={() =>
                              handleCheckoutStripeApi(
                                basicAnnualTabStyle
                                  ? yearlyFee
                                  : basicMonthlyTabStyle
                                  ? monthyleFee
                                  : null,
                                basicAnnualTabStyle ? "per year" : "per month"
                              )
                            }
                            className="mt-4 subscribe-btn-basic-plan"
                            style={{
                              backgroundColor: "#0f1518",
                              color: "white",
                              height: "34px",
                              width: "100%",
                              borderRadius: "9999px",
                              border: " none",
                            }}
                            variant="info"
                          >
                            <div
                              style={{
                                fontSize: "15px",
                                lineHeight: "20px",
                                fontWeight: "700",
                              }}
                            >
                              <span>Subscribe</span>
                              <span
                                style={{
                                  marginLeft: "5px",
                                }}
                              >
                                &middot;
                              </span>
                              <span>
                                {" "}
                                {basicAnnualTabStyle
                                  ? `${yearlyFee} per year`
                                  : `${monthyleFee} per month`}{" "}
                              </span>
                            </div>
                          </Button>
                          <div
                            className="mt-4"
                            style={{
                              width: "100%",
                              color: "rgb(83, 100, 113)",
                              fontSize: "11px",
                              fontWeight: "400",
                              lineHeight: "12px",
                              height: "40px",
                            }}
                          >
                            By clicking Subscribe, you agree to our{" "}
                            <span
                              className="text-decoration-thickness-2px"
                              style={{
                                cursor: "pointer",
                                color: "rgb(15, 20, 25)",
                                textDecoration: "underline",
                                textDecorationColor: "rgb(15, 20, 25)",
                              }}
                            >
                              Purchaser Terms of Service.
                            </span>
                            Subscriptions auto-renew until canceled. All
                            accounts that sign up must pass manual approval.
                          </div>
                        </div>
                      </>
                    ) : subTabIndexFromOrganizatonSelect === 2 &&
                      tabStyleOrganizationFullAccessPlan ? (
                      <>
                        {" "}
                        <div
                          className="mt-2"
                          style={{
                            width: "100%",
                            backgroundColor: "rgba(247, 249, 249, 1.00)",
                            borderRadius: "16px",
                            padding: "16px",
                          }}
                        >
                          <div
                            style={{
                              color: "rgb(83, 100, 113)",
                              lineHeight: "28px",
                              fontWeight: "700",
                              fontSize: "23px",
                            }}
                          >
                            Full Access
                          </div>
                          <div
                            style={{
                              fontSize: "34px",
                              lineHeight: "40px",
                              fontWeight: "700",
                            }}
                          >
                            Find your customers and grow your business
                          </div>
                          <div
                            className="basic-plan-parent-div"
                            style={{
                              lineHeight: "20px",
                              fontWeight: "500",
                              fontSize: "15px",
                            }}
                          >
                            <div>
                              Reach more customers organically, affiliate your
                              network, or find your next hire.
                            </div>
                            <div>
                              <div
                                style={{
                                  display: "flex",
                                }}
                              >
                                <svg
                                  width={`${1.25}em`}
                                  height={`${1.25}em`}
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr"
                                >
                                  <g>
                                    <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                  </g>
                                </svg>
                                <span>Gold checkmark</span>
                              </div>
                            </div>
                            <div>
                              {" "}
                              <div
                                style={{
                                  display: "flex",
                                }}
                              >
                                <svg
                                  width={`${1.25}em`}
                                  height={`${1.25}em`}
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr"
                                >
                                  <g>
                                    <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                  </g>
                                </svg>
                                <span>Priority support</span>
                              </div>{" "}
                            </div>
                            <div>
                              {" "}
                              <div
                                style={{
                                  display: "flex",
                                }}
                              >
                                <svg
                                  width={`${1.25}em`}
                                  height={`${1.25}em`}
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr"
                                >
                                  <g>
                                    <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                  </g>
                                </svg>
                                <span>Premium+</span>
                              </div>
                            </div>
                            <div>
                              {" "}
                              <div
                                style={{
                                  display: "flex",
                                }}
                              >
                                <svg
                                  width={`${1.25}em`}
                                  height={`${1.25}em`}
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr"
                                >
                                  <g>
                                    <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                  </g>
                                </svg>
                                <span>Hiring</span>
                              </div>
                            </div>
                            <div>
                              {" "}
                              <div
                                style={{
                                  display: "flex",
                                }}
                              >
                                <svg
                                  color="rgba(83, 100, 113, 1.00)"
                                  fill="currentColor"
                                  width={`${1.25}em`}
                                  height={`${1.25}em`}
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-14j79pv"
                                >
                                  <g>
                                    <path d="M14 13c0 .74-.4 1.39-1 1.73V17h-2v-2.27c-.59-.34-1-.99-1-1.73 0-1.1.9-2 2-2 1.11 0 2 .9 2 2zm3.5-6H17v-.25c0-2.76-2.24-5-5-5s-5 2.24-5 5V7h-.5C5.12 7 4 8.12 4 9.5v9C4 19.88 5.12 21 6.5 21h11c1.38 0 2.5-1.12 2.5-2.5v-9C20 8.12 18.88 7 17.5 7zM9 6.75c0-1.66 1.34-3 3-3s3 1.34 3 3V7H9v-.25zm9 11.75c0 .28-.22.5-.5.5h-11c-.28 0-.5-.22-.5-.5v-9c0-.28.22-.5.5-.5h11c.28 0 .5.22.5.5v9z"></path>
                                  </g>
                                </svg>
                                <span>2x boost</span>
                              </div>
                            </div>
                            <div>
                              {" "}
                              <div
                                style={{
                                  display: "flex",
                                }}
                              >
                                <svg
                                  color="rgba(83, 100, 113, 1.00)"
                                  fill="currentColor"
                                  width={`${1.25}em`}
                                  height={`${1.25}em`}
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-14j79pv"
                                >
                                  <g>
                                    <path d="M14 13c0 .74-.4 1.39-1 1.73V17h-2v-2.27c-.59-.34-1-.99-1-1.73 0-1.1.9-2 2-2 1.11 0 2 .9 2 2zm3.5-6H17v-.25c0-2.76-2.24-5-5-5s-5 2.24-5 5V7h-.5C5.12 7 4 8.12 4 9.5v9C4 19.88 5.12 21 6.5 21h11c1.38 0 2.5-1.12 2.5-2.5v-9C20 8.12 18.88 7 17.5 7zM9 6.75c0-1.66 1.34-3 3-3s3 1.34 3 3V7H9v-.25zm9 11.75c0 .28-.22.5-.5.5h-11c-.28 0-.5-.22-.5-.5v-9c0-.28.22-.5.5-.5h11c.28 0 .5.22.5.5v9z"></path>
                                  </g>
                                </svg>
                                <span>Affiliations</span>
                              </div>
                            </div>
                          </div>
                          <div
                            style={{
                              fontSize: "15px",
                              fontWeight: "400",
                              lineHeight: "20px",
                            }}
                            className="mt-1"
                          >
                            + For a limited time, advertising credit to spend on
                            your organization any of its affiliates{" "}
                            <span
                              style={{
                                lineHeight: "20px",
                                fontSize: "15px",
                                fontWeight: "700",
                                textDecoration: "underline",
                              }}
                            >
                              {fullAccessAnnualTabStyle
                                ? "every year"
                                : "every month"}
                            </span>{" "}
                            with dedicated support.{" "}
                            <span
                              className="learn-more-full-access-plan"
                              style={{
                                cursor: "pointer",
                                color: "rgb(29, 155, 240)",
                              }}
                            >
                              Learn more
                            </span>
                          </div>
                        </div>
                        <div
                          style={{
                            width: "100%",
                            // position: "absolute",
                            // bottom: "0px",
                            // backgroundColor: "yellow",
                          }}
                        >
                          <div
                            className="mt-4"
                            style={{
                              display: "flex",
                              gap: "2.5%",
                            }}
                          >
                            {/* annual plan start to check  */}
                            <div
                              onClick={() => {
                                setfullAccessAnnualTabStyle(true);
                                setfullAccessMonthlyTabStyle(false);
                              }}
                              style={
                                ({ activeIndividualOptionTabStyle },
                                {
                                  flex: 1,
                                  backgroundColor: "white",
                                  maxHeight: "72px",
                                  padding: "12px",
                                  cursor: "pointer",
                                  borderWidth: "1px",
                                  borderRadius: "16px",
                                  boxShadow:
                                    "0 0 15px rgba(101, 119,134,0.2), 0 0 3px 1px rgba(101,119,134,0.15)",
                                  border: fullAccessAnnualTabStyle
                                    ? "2px solid #339bf0"
                                    : "2px solid transparent",
                                  transition: "transform 0.3s ease",
                                })
                              }
                              className="individual-subscription-box"
                            >
                              <div>
                                <div
                                  style={{
                                    color: "rgb(15, 20, 25)",
                                    fontSize: "18px",
                                    fontWeight: "600",
                                    display: " flex",
                                  }}
                                >
                                  {" "}
                                  <div>{yearlyFeeFullAccess} / year</div>
                                  <div
                                    style={{
                                      fontSize: "12px",
                                      backgroundColor: "#dcf8eb",
                                      borderRadius: "9999px",
                                      height: "20px",
                                      display: "flex",
                                      justifyContent: "center",
                                      alignItems: "center",
                                      position: "relative",
                                      top: "5px",
                                    }}
                                  >
                                    <span
                                      style={{
                                        padding: "4px 4px",
                                      }}
                                    >
                                      Save 16%
                                    </span>
                                  </div>
                                </div>
                                <div
                                  style={{
                                    color: "#697884",
                                    fontSize: "14px",
                                    fontWeight: "400",
                                  }}
                                >
                                  {" "}
                                  Annual plan
                                </div>
                              </div>
                            </div>
                            {/* annual plan finish to check  */}
                            {/* monthly plan start to check  */}
                            <div
                              onClick={() => {
                                setfullAccessMonthlyTabStyle(true);
                                setfullAccessAnnualTabStyle(false);
                              }}
                              style={
                                ({ activeOrganizationOptionTabStyle },
                                {
                                  flex: 1,
                                  backgroundColor: "white",
                                  maxHeight: "72px",
                                  padding: "12px",
                                  cursor: "pointer",
                                  borderWidth: "1px",
                                  borderRadius: "16px",
                                  boxShadow:
                                    "0 0 15px rgba(101, 119,134,0.2), 0 0 3px 1px rgba(101,119,134,0.15)",
                                  border: fullAccessMonthlyTabStyle
                                    ? "2px solid #339bf0"
                                    : "2px solid transparent",
                                  transition: "transform 0.3s ease",
                                })
                              }
                              className="organization-subscription-box"
                            >
                              <div
                                style={{
                                  position: "relative",
                                }}
                              >
                                <div
                                  style={{
                                    color: "rgb(15, 20, 25)",
                                    fontSize: "18px",
                                    fontWeight: "600",
                                  }}
                                >
                                  {monthyleFeeFullAccess} / month
                                </div>{" "}
                                <div
                                  style={{
                                    color: "#697884",
                                    fontSize: "14px",
                                    fontWeight: "400",
                                  }}
                                >
                                  Monthly plan
                                </div>
                              </div>
                            </div>
                            {/* monthly plan finish to check  */}
                          </div>
                          <div
                            className="mt-3"
                            style={{
                              color: "rgb(83, 100, 113)",
                              fontSize: "11px",
                              lineHeight: "12px",
                              fontWeight: "400",
                              height: "20px",
                            }}
                          >
                            {" "}
                            <span>
                              Full Access is asd
                              {fullAccessAnnualTabStyle
                                ? yearlyFeeFullAccess
                                : monthyleFeeFullAccess
                                ? monthyleFeeFullAccess
                                : null}
                              /
                              {fullAccessAnnualTabStyle
                                ? "year"
                                : monthyleFeeFullAccess
                                ? "month"
                                : null}{" "}
                              (tax inclusive). Each additional affiliated
                              account is{" "}
                              {fullAccessAnnualTabStyle
                                ? "€714 per handle per year"
                                : "€59.50 per handle per month"}{" "}
                              (tax inclusive)
                            </span>
                            <span
                              className="learn-more-basic-plan"
                              style={{
                                color: "rgb(29, 155, 240)",
                                cursor: "pointer",
                              }}
                            >
                              Learn more
                            </span>
                          </div>
                          <Button
                            onClick={() =>
                              handleFullAccessOrganizationPlanModal()
                            }
                            className="mt-4 subscribe-btn-full-access-plan"
                            style={{
                              backgroundColor: "#0f1518",
                              color: "white",
                              height: "34px",
                              width: "100%",
                              borderRadius: "9999px",
                              border: " none",
                            }}
                            variant="info"
                          >
                            <div
                              style={{
                                fontSize: "15px",
                                lineHeight: "20px",
                                fontWeight: "700",
                              }}
                            >
                              <span>Subscribe</span>
                              <span
                                style={{
                                  marginLeft: "5px",
                                }}
                              >
                                &middot;
                              </span>
                              <span>
                                {" "}
                                {fullAccessAnnualTabStyle
                                  ? `${yearlyFeeFullAccess} per year`
                                  : `${monthyleFeeFullAccess} per month`}{" "}
                              </span>
                            </div>
                          </Button>
                          <div
                            className="mt-4"
                            style={{
                              color: "rgb(83, 100, 113)",
                              fontSize: "11px",
                              fontWeight: "400",
                              lineHeight: "12px",
                              height: "40px",
                            }}
                          >
                            By clicking Subscribe, you agree to our{" "}
                            <span
                              className="text-decoration-thickness-2px"
                              style={{
                                cursor: "pointer",
                                color: "rgb(15, 20, 25)",
                                textDecoration: "underline",
                                textDecorationColor: "rgb(15, 20, 25)",
                              }}
                            >
                              Purchaser Terms of Service.
                            </span>
                            Subscriptions auto-renew until canceled. Accounts
                            that sign up are reviewed for authenticity. If an
                            account signs up and is not an organization, you
                            will be rejected and not refunded.
                          </div>
                        </div>
                      </>
                    ) : null}
                  </Modal.Body>
                </>
              </>
            ) : tabIndex === 2 && !phoneVerified ? (
              <>
                {subErrorPhoneVerifiedTabLoading ? (
                  <Modal.Body
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                    }}
                    className="signin-modal-body-child-non-reactivate sub-modal"
                  >
                    <LoadingSpinner
                      strokeColor={"rgb(29, 155, 240)"}
                    ></LoadingSpinner>
                  </Modal.Body>
                ) : (
                  <Modal.Body
                    style={{
                      margin: "0px",
                      padding: "0px",
                    }}
                    className="signin-modal-body-child-non-reactivate sub-modal"
                  >
                    <img
                      className="mt-0"
                      width={"100%"}
                      style={{
                        maxHeight: "300px",
                        minHeight: "270px",
                      }}
                      src="https://ton.twimg.com/onboarding/subscriptions_product/twitter_blue_verified_full_v1.png"
                      alt=""
                    />
                    <div
                      style={{
                        width: "70%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        marginTop: "100px",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "26px",
                          lineHeight: "32px",
                          fontWeight: "800",
                        }}
                      >
                        Verify your phone number
                      </div>
                      <div
                        className="mt-2"
                        style={{
                          fontSize: "15px",
                          fontWeight: "400",
                          lineHeight: "20px",
                          color: "rgb(83, 100, 113)",
                        }}
                      >
                        Verify your phone number to subscribe for Premium. It
                        should just take a few minutes.
                      </div>
                      <Button
                        className="login-button next-btn mt-4"
                        variant="dark"
                        style={{
                          width: "100%",
                          height: "52px",
                          color: "white",
                          backgroundColor: "#0f141a",
                        }}
                      >
                        Verify your phone number
                      </Button>
                    </div>
                  </Modal.Body>
                )}
              </>
            ) : tabIndex === 2 && phoneVerified ? (
              <>
                {subErrorPhoneVerifiedTabLoading ? (
                  <Modal.Body
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                    }}
                    className="signin-modal-body-child-non-reactivate sub-modal"
                  >
                    <LoadingSpinner
                      strokeColor={"rgb(29, 155, 240)"}
                    ></LoadingSpinner>
                  </Modal.Body>
                ) : (
                  <Modal.Body
                    style={{
                      margin: "0px",
                      padding: "0px",
                    }}
                    className="signin-modal-body-child-non-reactivate sub-modal"
                  >
                    <div>Phone verified !</div>
                  </Modal.Body>
                )}
              </>
            ) : tabIndex === 4 ? (
              <>Tab 4 </>
            ) : (
              <></>
            )}
          </Modal>
        </>
      ) : (
        <>
          <Modal
            // className={"signin-modal-parent-non-reactivate "}
            className={
              tabIndex !== 0 && !isOrganizationSubscriptionClicked
                ? "subscription-modal-basic-width-smaller-700"
                : "signin-modal-parent-non-reactivate"
            }
            show={showSubscriptionModal}
            onHide={handleCloseSubscriptionModal}
            centered={true}
          >
            {tabIndex === 0 ? (
              <>
                <Modal.Header
                  className="signin-modal-header-child-non-reactivate"
                  style={{
                    border: "none",
                    zIndex: 999,
                  }}
                >
                  <div
                    onClick={handleCloseSubscriptionModal}
                    className="close-button"
                    style={{
                      borderRadius: "50%",
                      cursor: "pointer",
                    }}
                  >
                    <div
                      style={{
                        display: " flex",
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      {/* close signin modal icon start to check  */}
                      <svg
                        style={{
                          border: "none",
                          fontSize: "15px",
                          margin: "5px",
                        }}
                        onClick={handleCloseSubscriptionModal}
                        width={20}
                        height={20}
                        color="rgb(15,20,25)"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        className=" r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-z80fyv r-19wmn03"
                      >
                        <g>
                          <path d="M10.59 12L4.54 5.96l1.42-1.42L12 10.59l6.04-6.05 1.42 1.42L13.41 12l6.05 6.04-1.42 1.42L12 13.41l-6.04 6.05-1.42-1.42L10.59 12z"></path>
                        </g>
                      </svg>{" "}
                      {/* close signin modal icon finish to check  */}
                    </div>
                  </div>{" "}
                  <span
                    style={{
                      fontWeight: "700",
                      fontSize: "20px",
                      lineHeight: "24px",
                      position: "absolute",
                      left: "15%",
                      display: selectedOption === "individual" ? "" : "none",
                    }}
                  >
                    Subscribe
                  </span>
                  <div
                    style={{
                      fontWeight: "700",
                      fontSize: "20px",
                      lineHeight: "24px",
                      margin: "0 auto",
                      position: "relative",
                      right: "15px",
                      display: selectedOption === "organization" ? "" : "none",
                    }}
                  >
                    Verified Organizations
                  </div>
                </Modal.Header>
              </>
            ) : null}

            {tabIndex === 0 ? (
              <>
                <Modal.Body className="subscription-modal">
                  <div
                    style={{
                      lineHeight: "36px",
                      fontSize: "31px",
                      fontWeight: "800",
                    }}
                  >
                    Who are you?
                  </div>
                  <div
                    className="mt-3"
                    style={{
                      lineHeight: "20px",
                      fontSize: "15px",
                      fontWeight: "400",
                      color: "rgb(15, 20, 25)",
                    }}
                  >
                    Choose the right subscription for you:
                  </div>
                  <div
                    className="mt-4"
                    style={{
                      display: "flex",
                      gap: "2.5%",
                      width: "81.5%",
                    }}
                  >
                    <div
                      onClick={() => {
                        setactiveIndividualOptionTabStyle(true);
                        setisIndividualSubscriptionClicked(true);
                        setactiveOrganizationOptionTabStyle(false);
                        setisOrganizationSubscriptionClicked(false);
                      }}
                      style={
                        ({ activeIndividualOptionTabStyle },
                        {
                          flex: 1,
                          backgroundColor: "white",
                          minHeight: "112px",
                          padding: "12px",
                          cursor: "pointer",
                          borderWidth: "1px",
                          borderRadius: "16px",
                          boxShadow:
                            "0 0 15px rgba(101, 119,134,0.2), 0 0 3px 1px rgba(101,119,134,0.15)",
                          border: activeIndividualOptionTabStyle
                            ? "2px solid #339bf0"
                            : "2px solid transparent",
                          transition: "transform 0.3s ease",
                        })
                      }
                      className="individual-subscription-box"
                    >
                      <div
                        style={{
                          position: "relative",
                          top: "5px",
                        }}
                      >
                        <div
                          style={{
                            color: "#697884",
                            fontSize: "15px",
                            fontWeight: "400",
                          }}
                        >
                          Premium
                        </div>
                        <div
                          style={{
                            color: "rgb(15, 20, 25)",
                            fontSize: "18px",
                            fontWeight: "600",
                          }}
                        >
                          {" "}
                          I am an individual
                        </div>
                        <div
                          style={{
                            color: "#697884",
                            fontSize: "14px",
                            fontWeight: "400",
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
                      }}
                      style={
                        ({ activeOrganizationOptionTabStyle },
                        {
                          flex: 1,
                          backgroundColor: "white",
                          minHeight: "112px",
                          padding: "12px",
                          cursor: "pointer",
                          borderWidth: "1px",
                          borderRadius: "16px",
                          boxShadow:
                            "0 0 15px rgba(101, 119,134,0.2), 0 0 3px 1px rgba(101,119,134,0.15)",
                          border: activeOrganizationOptionTabStyle
                            ? "2px solid #339bf0"
                            : "2px solid transparent",
                          transition: "transform 0.3s ease",
                        })
                      }
                      className="organization-subscription-box"
                    >
                      <div
                        style={{
                          position: "relative",
                        }}
                      >
                        <div
                          style={{
                            color: "#697884",
                            fontSize: "15px",
                            fontWeight: "400",
                          }}
                        >
                          {" "}
                          Verified Organizations
                        </div>{" "}
                        <div
                          style={{
                            color: "rgb(15, 20, 25)",
                            fontSize: "18px",
                            fontWeight: "600",
                          }}
                        >
                          I am an organization
                        </div>{" "}
                        <div
                          style={{
                            color: "#697884",
                            fontSize: "14px",
                            fontWeight: "400",
                          }}
                        >
                          For businesses, government agencies, and non-profits
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={() => {
                      handleChooseActionForSubscriptionModal(
                        isIndividualSubscriptionClicked,
                        isOrganizationSubscriptionClicked
                      );
                    }}
                    style={{
                      width: "81.5%",
                      height: "54px",
                      backgroundColor: "#0f141a",
                    }}
                    className="next-btn mt-4"
                  >
                    Subscribe
                  </Button>
                  <div
                    style={{
                      fontSize: "15px",
                      fontWeight: "400",
                      lineHeight: "20px",
                      color: "rgb(15, 20, 25)",
                    }}
                    className="mt-4"
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
                </Modal.Body>
              </>
            ) : tabIndex === 1 && isIndividualSubscriptionClicked ? (
              <>
                <Modal.Body
                  className="scrollbar-add individual-bigger-than-700-width"
                  style={{
                    overflowY: "auto",
                    width: "100%",
                  }}
                >
                  <div
                    style={{
                      width: "81.5%",
                      margin: "0 auto",
                    }}
                  >
                    {" "}
                    <div
                      onClick={handleCloseSubscriptionModal}
                      style={{
                        borderRadius: "50%",
                        cursor: "pointer",
                        position: "relative",
                        right: "30px",
                      }}
                    >
                      <div
                        className="close-button"
                        style={{
                          display: " flex",
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "center",
                          width: "30px",
                          height: "36px",
                          borderRadius: "50%",
                        }}
                      >
                        {/* close signin modal icon start to check  */}
                        <svg
                          style={{
                            border: "none",
                            fontSize: "15px",
                            margin: "5px",
                          }}
                          onClick={handleCloseSubscriptionModal}
                          width={20}
                          height={20}
                          color="rgb(15,20,25)"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                          className=" r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-z80fyv r-19wmn03"
                        >
                          <g>
                            <path d="M10.59 12L4.54 5.96l1.42-1.42L12 10.59l6.04-6.05 1.42 1.42L13.41 12l6.05 6.04-1.42 1.42L12 13.41l-6.04 6.05-1.42-1.42L10.59 12z"></path>
                          </g>
                        </svg>{" "}
                        {/* close signin modal icon finish to check  */}
                      </div>{" "}
                    </div>{" "}
                    <div
                      style={{
                        fontWeight: "700",
                        fontSize: "20px",
                        lineHeight: "24px",
                        position: "absolute",
                        left: "20%",
                        top: "19px",
                      }}
                    >
                      Subscribe
                    </div>
                    <div className="mt-4">
                      <Slider ref={sliderRef2} {...settings2}>
                        {/* first div basic plan start to check   */}
                        <div
                          style={{
                            width: "81.5%",
                            margin: "0px auto",
                          }}
                        >
                          <Stack
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              backgroundImage:
                                "url(https://abs.twimg.com/responsive-web/client-web/background-basic-web@3x.0f5af6ea.png)",
                              backgroundPosition: "center",
                              backgroundSize: "cover",
                              borderRadius: "16px",
                              color: "white",
                              minHeight: "60px",
                            }}
                            direction="horizontal"
                            gap={1}
                          >
                            <div
                              className="p-2"
                              style={{
                                visibility: "hidden",
                              }}
                            >
                              {" "}
                              <span
                                onClick={() => {
                                  previous2();
                                }}
                                className="premium-btn-back"
                                style={{
                                  color: "white",
                                  backgroundColor: "#13181c",
                                  width: "30px",
                                  height: "30px",
                                  borderRadius: "50%",
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                <svg
                                  width={20}
                                  height={20}
                                  color="white"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-z80fyv r-19wmn03 r-jwli3a"
                                >
                                  <g>
                                    <path d="M7.414 13l5.043 5.04-1.414 1.42L3.586 12l7.457-7.46 1.414 1.42L7.414 11H21v2H7.414z"></path>
                                  </g>
                                </svg>
                              </span>
                            </div>
                            <div style={{}}>
                              {" "}
                              <span
                                style={{
                                  color: "white",
                                  lineHeight: "20px",
                                  fontWeight: "500",
                                  fontSize: "17px",
                                  position: "relative",
                                  left: "5px",
                                }}
                              >
                                Basic
                                <span
                                  span
                                  style={{
                                    visibility: "hidden",
                                  }}
                                >
                                  +
                                </span>
                              </span>
                            </div>
                            <div className="p-2" style={{}}>
                              {" "}
                              <span
                                onClick={() => {
                                  next2();
                                }}
                                className="premium-btn-back"
                                style={{
                                  color: "white",
                                  backgroundColor: "#13181c",
                                  width: "30px",
                                  height: "30px",
                                  borderRadius: "50%",
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                <svg
                                  width={20}
                                  height={20}
                                  color="white"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-z80fyv r-19wmn03 r-jwli3a"
                                >
                                  <g>
                                    <path d="M12.957 4.54L20.414 12l-7.457 7.46-1.414-1.42L16.586 13H3v-2h13.586l-5.043-5.04 1.414-1.42z"></path>
                                  </g>
                                </svg>
                              </span>
                            </div>
                          </Stack>{" "}
                          {/* enhanced experience start to check  */}
                          <div
                            className="mt-3 premium-plus-parent-div"
                            style={{
                              padding: "32px",
                              borderRadius: "16px",
                              backgroundColor: "#eff3f4",
                            }}
                          >
                            <div className="premium-plus-header">
                              Enhanced Experience
                            </div>
                            <div>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <div>
                                  <span>Ads in For You</span>
                                  <svg
                                    width={16}
                                    height={16}
                                    color="rgba(83,100,113,1.00)"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                    className="exclamation r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-10ptun7 r-1janqcz r-14j79pv"
                                  >
                                    <g>
                                      <path d="M13.5 8.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5S11.17 7 12 7s1.5.67 1.5 1.5zM13 17v-5h-2v5h2zm-1 5.25c5.66 0 10.25-4.59 10.25-10.25S17.66 1.75 12 1.75 1.75 6.34 1.75 12 6.34 22.25 12 22.25zM20.25 12c0 4.56-3.69 8.25-8.25 8.25S3.75 16.56 3.75 12 7.44 3.75 12 3.75s8.25 3.69 8.25 8.25z"></path>
                                    </g>
                                  </svg>
                                </div>
                                <div>Full</div>
                              </div>
                            </div>
                            <div>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <div>
                                  <span>Reply boost</span>
                                </div>
                                <div>Largest</div>
                              </div>
                            </div>
                            <div>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <div>
                                  <span>Smallest</span>{" "}
                                </div>
                                <div>
                                  {" "}
                                  <svg
                                    color="rgb(0, 186, 124)"
                                    fill="currentColor"
                                    width={20}
                                    height={20}
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                    className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-o6sn0f"
                                  >
                                    <g>
                                      <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                    </g>
                                  </svg>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <div>
                                  <span>Longer posts</span>{" "}
                                </div>
                                <div>
                                  {" "}
                                  <svg
                                    color="rgb(0, 186, 124)"
                                    fill="currentColor"
                                    width={20}
                                    height={20}
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                    className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-o6sn0f"
                                  >
                                    <g>
                                      <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                    </g>
                                  </svg>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <div>
                                  <span>Undo post</span>{" "}
                                </div>
                                <div>
                                  {" "}
                                  <svg
                                    color="rgb(0, 186, 124)"
                                    fill="currentColor"
                                    width={20}
                                    height={20}
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                    className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-o6sn0f"
                                  >
                                    <g>
                                      <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                    </g>
                                  </svg>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <div>
                                  <span>Post longer videos</span>{" "}
                                </div>
                                <div>
                                  {" "}
                                  <svg
                                    color="rgb(0, 186, 124)"
                                    fill="currentColor"
                                    width={20}
                                    height={20}
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                    className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-o6sn0f"
                                  >
                                    <g>
                                      <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                    </g>
                                  </svg>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <div>
                                  <span>Top Articles</span>{" "}
                                </div>
                                <div>
                                  {" "}
                                  <svg
                                    color="rgb(0, 186, 124)"
                                    fill="currentColor"
                                    width={20}
                                    height={20}
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                    className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-o6sn0f"
                                  >
                                    <g>
                                      <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                    </g>
                                  </svg>
                                </div>
                              </div>
                            </div>
                            {/* reader check  */}
                            <div>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <div>
                                  <span>Reader</span>{" "}
                                  <svg
                                    width={20}
                                    height={20}
                                    color="rgba(83,100,113,1.00)"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                    className="exclamation r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-10ptun7 r-1janqcz r-14j79pv"
                                  >
                                    <g>
                                      <path d="M13.5 8.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5S11.17 7 12 7s1.5.67 1.5 1.5zM13 17v-5h-2v5h2zm-1 5.25c5.66 0 10.25-4.59 10.25-10.25S17.66 1.75 12 1.75 1.75 6.34 1.75 12 6.34 22.25 12 22.25zM20.25 12c0 4.56-3.69 8.25-8.25 8.25S3.75 16.56 3.75 12 7.44 3.75 12 3.75s8.25 3.69 8.25 8.25z"></path>
                                    </g>
                                  </svg>
                                </div>
                                <div>
                                  {" "}
                                  <svg
                                    color="rgb(0, 186, 124)"
                                    fill="currentColor"
                                    width={20}
                                    height={20}
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                    className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-o6sn0f"
                                  >
                                    <g>
                                      <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                    </g>
                                  </svg>
                                </div>
                              </div>
                            </div>
                            {/* reader check  */}
                            <div>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <div>
                                  <span>Background video playback</span>{" "}
                                </div>
                                <div>
                                  {" "}
                                  <svg
                                    color="rgb(0, 186, 124)"
                                    fill="currentColor"
                                    width={20}
                                    height={20}
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                    className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-o6sn0f"
                                  >
                                    <g>
                                      <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                    </g>
                                  </svg>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <div>
                                  <span>Download videos</span>{" "}
                                </div>
                                <div>
                                  {" "}
                                  <svg
                                    color="rgb(0, 186, 124)"
                                    fill="currentColor"
                                    width={20}
                                    height={20}
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                    className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-o6sn0f"
                                  >
                                    <g>
                                      <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                    </g>
                                  </svg>
                                </div>
                              </div>
                            </div>
                          </div>
                          {/* enhanced experience finish to check  */}
                          {/* creator hub start to check  */}
                          <div
                            className="mt-3 premium-plus-parent-div"
                            style={{
                              padding: "32px",
                              borderRadius: "16px",
                              backgroundColor: "#eff3f4",
                            }}
                          >
                            <div className="premium-plus-header">
                              Creator Hub
                            </div>
                            <div>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <div>
                                  <span
                                    style={{
                                      color:
                                        "rgb(83, 100, 113)                                  ",
                                    }}
                                  >
                                    Write Articles
                                  </span>
                                  <svg
                                    width={20}
                                    height={20}
                                    color="rgba(83,100,113,1.00)"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                    className="exclamation r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-10ptun7 r-1janqcz r-14j79pv"
                                  >
                                    <g>
                                      <path d="M13.5 8.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5S11.17 7 12 7s1.5.67 1.5 1.5zM13 17v-5h-2v5h2zm-1 5.25c5.66 0 10.25-4.59 10.25-10.25S17.66 1.75 12 1.75 1.75 6.34 1.75 12 6.34 22.25 12 22.25zM20.25 12c0 4.56-3.69 8.25-8.25 8.25S3.75 16.56 3.75 12 7.44 3.75 12 3.75s8.25 3.69 8.25 8.25z"></path>
                                    </g>
                                  </svg>
                                </div>
                                <div>
                                  {" "}
                                  <svg
                                    width={`${1.25}em`}
                                    height={`${1.25}em`}
                                    color="rgba(83,100,113,1.00)"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                    className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-14j79pv"
                                  >
                                    <g>
                                      <path d="M14 13c0 .74-.4 1.39-1 1.73V17h-2v-2.27c-.59-.34-1-.99-1-1.73 0-1.1.9-2 2-2 1.11 0 2 .9 2 2zm3.5-6H17v-.25c0-2.76-2.24-5-5-5s-5 2.24-5 5V7h-.5C5.12 7 4 8.12 4 9.5v9C4 19.88 5.12 21 6.5 21h11c1.38 0 2.5-1.12 2.5-2.5v-9C20 8.12 18.88 7 17.5 7zM9 6.75c0-1.66 1.34-3 3-3s3 1.34 3 3V7H9v-.25zm9 11.75c0 .28-.22.5-.5.5h-11c-.28 0-.5-.22-.5-.5v-9c0-.28.22-.5.5-.5h11c.28 0 .5.22.5.5v9z"></path>
                                    </g>
                                  </svg>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <div>
                                  <span
                                    style={{
                                      color:
                                        "rgb(83, 100, 113)                                  ",
                                    }}
                                  >
                                    Get paid to post
                                  </span>
                                  <svg
                                    width={20}
                                    height={20}
                                    color="rgba(83,100,113,1.00)"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                    className="exclamation r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-10ptun7 r-1janqcz r-14j79pv"
                                  >
                                    <g>
                                      <path d="M13.5 8.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5S11.17 7 12 7s1.5.67 1.5 1.5zM13 17v-5h-2v5h2zm-1 5.25c5.66 0 10.25-4.59 10.25-10.25S17.66 1.75 12 1.75 1.75 6.34 1.75 12 6.34 22.25 12 22.25zM20.25 12c0 4.56-3.69 8.25-8.25 8.25S3.75 16.56 3.75 12 7.44 3.75 12 3.75s8.25 3.69 8.25 8.25z"></path>
                                    </g>
                                  </svg>
                                </div>
                                <div>
                                  {" "}
                                  <svg
                                    width={`${1.25}em`}
                                    height={`${1.25}em`}
                                    color="rgba(83,100,113,1.00)"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                    className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-14j79pv"
                                  >
                                    <g>
                                      <path d="M14 13c0 .74-.4 1.39-1 1.73V17h-2v-2.27c-.59-.34-1-.99-1-1.73 0-1.1.9-2 2-2 1.11 0 2 .9 2 2zm3.5-6H17v-.25c0-2.76-2.24-5-5-5s-5 2.24-5 5V7h-.5C5.12 7 4 8.12 4 9.5v9C4 19.88 5.12 21 6.5 21h11c1.38 0 2.5-1.12 2.5-2.5v-9C20 8.12 18.88 7 17.5 7zM9 6.75c0-1.66 1.34-3 3-3s3 1.34 3 3V7H9v-.25zm9 11.75c0 .28-.22.5-.5.5h-11c-.28 0-.5-.22-.5-.5v-9c0-.28.22-.5.5-.5h11c.28 0 .5.22.5.5v9z"></path>
                                    </g>
                                  </svg>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <div>
                                  <span
                                    style={{
                                      color:
                                        "rgb(83, 100, 113)                                  ",
                                    }}
                                  >
                                    Creator Subscriptions
                                  </span>
                                  <svg
                                    width={20}
                                    height={20}
                                    color="rgba(83,100,113,1.00)"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                    className="exclamation r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-10ptun7 r-1janqcz r-14j79pv"
                                  >
                                    <g>
                                      <path d="M13.5 8.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5S11.17 7 12 7s1.5.67 1.5 1.5zM13 17v-5h-2v5h2zm-1 5.25c5.66 0 10.25-4.59 10.25-10.25S17.66 1.75 12 1.75 1.75 6.34 1.75 12 6.34 22.25 12 22.25zM20.25 12c0 4.56-3.69 8.25-8.25 8.25S3.75 16.56 3.75 12 7.44 3.75 12 3.75s8.25 3.69 8.25 8.25z"></path>
                                    </g>
                                  </svg>
                                </div>
                                <div>
                                  {" "}
                                  <svg
                                    width={`${1.25}em`}
                                    height={`${1.25}em`}
                                    color="rgba(83,100,113,1.00)"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                    className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-14j79pv"
                                  >
                                    <g>
                                      <path d="M14 13c0 .74-.4 1.39-1 1.73V17h-2v-2.27c-.59-.34-1-.99-1-1.73 0-1.1.9-2 2-2 1.11 0 2 .9 2 2zm3.5-6H17v-.25c0-2.76-2.24-5-5-5s-5 2.24-5 5V7h-.5C5.12 7 4 8.12 4 9.5v9C4 19.88 5.12 21 6.5 21h11c1.38 0 2.5-1.12 2.5-2.5v-9C20 8.12 18.88 7 17.5 7zM9 6.75c0-1.66 1.34-3 3-3s3 1.34 3 3V7H9v-.25zm9 11.75c0 .28-.22.5-.5.5h-11c-.28 0-.5-.22-.5-.5v-9c0-.28.22-.5.5-.5h11c.28 0 .5.22.5.5v9z"></path>
                                    </g>
                                  </svg>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <div>
                                  <span
                                    style={{
                                      color:
                                        "rgb(83, 100, 113)                                  ",
                                    }}
                                  >
                                    X Pro
                                  </span>
                                  <svg
                                    width={20}
                                    height={20}
                                    color="rgba(83,100,113,1.00)"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                    className="exclamation r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-10ptun7 r-1janqcz r-14j79pv"
                                  >
                                    <g>
                                      <path d="M13.5 8.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5S11.17 7 12 7s1.5.67 1.5 1.5zM13 17v-5h-2v5h2zm-1 5.25c5.66 0 10.25-4.59 10.25-10.25S17.66 1.75 12 1.75 1.75 6.34 1.75 12 6.34 22.25 12 22.25zM20.25 12c0 4.56-3.69 8.25-8.25 8.25S3.75 16.56 3.75 12 7.44 3.75 12 3.75s8.25 3.69 8.25 8.25z"></path>
                                    </g>
                                  </svg>
                                </div>
                                <div>
                                  {" "}
                                  <svg
                                    width={`${1.25}em`}
                                    height={`${1.25}em`}
                                    color="rgba(83,100,113,1.00)"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                    className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-14j79pv"
                                  >
                                    <g>
                                      <path d="M14 13c0 .74-.4 1.39-1 1.73V17h-2v-2.27c-.59-.34-1-.99-1-1.73 0-1.1.9-2 2-2 1.11 0 2 .9 2 2zm3.5-6H17v-.25c0-2.76-2.24-5-5-5s-5 2.24-5 5V7h-.5C5.12 7 4 8.12 4 9.5v9C4 19.88 5.12 21 6.5 21h11c1.38 0 2.5-1.12 2.5-2.5v-9C20 8.12 18.88 7 17.5 7zM9 6.75c0-1.66 1.34-3 3-3s3 1.34 3 3V7H9v-.25zm9 11.75c0 .28-.22.5-.5.5h-11c-.28 0-.5-.22-.5-.5v-9c0-.28.22-.5.5-.5h11c.28 0 .5.22.5.5v9z"></path>
                                    </g>
                                  </svg>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <div>
                                  <span
                                    style={{
                                      color:
                                        "rgb(83, 100, 113)                                  ",
                                    }}
                                  >
                                    Media Studio
                                  </span>
                                  <svg
                                    width={20}
                                    height={20}
                                    color="rgba(83,100,113,1.00)"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                    className="exclamation r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-10ptun7 r-1janqcz r-14j79pv"
                                  >
                                    <g>
                                      <path d="M13.5 8.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5S11.17 7 12 7s1.5.67 1.5 1.5zM13 17v-5h-2v5h2zm-1 5.25c5.66 0 10.25-4.59 10.25-10.25S17.66 1.75 12 1.75 1.75 6.34 1.75 12 6.34 22.25 12 22.25zM20.25 12c0 4.56-3.69 8.25-8.25 8.25S3.75 16.56 3.75 12 7.44 3.75 12 3.75s8.25 3.69 8.25 8.25z"></path>
                                    </g>
                                  </svg>
                                </div>
                                <div>
                                  {" "}
                                  <svg
                                    width={`${1.25}em`}
                                    height={`${1.25}em`}
                                    color="rgba(83,100,113,1.00)"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                    className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-14j79pv"
                                  >
                                    <g>
                                      <path d="M14 13c0 .74-.4 1.39-1 1.73V17h-2v-2.27c-.59-.34-1-.99-1-1.73 0-1.1.9-2 2-2 1.11 0 2 .9 2 2zm3.5-6H17v-.25c0-2.76-2.24-5-5-5s-5 2.24-5 5V7h-.5C5.12 7 4 8.12 4 9.5v9C4 19.88 5.12 21 6.5 21h11c1.38 0 2.5-1.12 2.5-2.5v-9C20 8.12 18.88 7 17.5 7zM9 6.75c0-1.66 1.34-3 3-3s3 1.34 3 3V7H9v-.25zm9 11.75c0 .28-.22.5-.5.5h-11c-.28 0-.5-.22-.5-.5v-9c0-.28.22-.5.5-.5h11c.28 0 .5.22.5.5v9z"></path>
                                    </g>
                                  </svg>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <div>
                                  <span
                                    style={{
                                      color:
                                        "rgb(83, 100, 113)                                  ",
                                    }}
                                  >
                                    Analytics
                                  </span>
                                  <svg
                                    width={20}
                                    height={20}
                                    color="rgba(83,100,113,1.00)"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                    className="exclamation r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-10ptun7 r-1janqcz r-14j79pv"
                                  >
                                    <g>
                                      <path d="M13.5 8.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5S11.17 7 12 7s1.5.67 1.5 1.5zM13 17v-5h-2v5h2zm-1 5.25c5.66 0 10.25-4.59 10.25-10.25S17.66 1.75 12 1.75 1.75 6.34 1.75 12 6.34 22.25 12 22.25zM20.25 12c0 4.56-3.69 8.25-8.25 8.25S3.75 16.56 3.75 12 7.44 3.75 12 3.75s8.25 3.69 8.25 8.25z"></path>
                                    </g>
                                  </svg>
                                </div>
                                <div>
                                  {" "}
                                  <svg
                                    width={`${1.25}em`}
                                    height={`${1.25}em`}
                                    color="rgba(83,100,113,1.00)"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                    className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-14j79pv"
                                  >
                                    <g>
                                      <path d="M14 13c0 .74-.4 1.39-1 1.73V17h-2v-2.27c-.59-.34-1-.99-1-1.73 0-1.1.9-2 2-2 1.11 0 2 .9 2 2zm3.5-6H17v-.25c0-2.76-2.24-5-5-5s-5 2.24-5 5V7h-.5C5.12 7 4 8.12 4 9.5v9C4 19.88 5.12 21 6.5 21h11c1.38 0 2.5-1.12 2.5-2.5v-9C20 8.12 18.88 7 17.5 7zM9 6.75c0-1.66 1.34-3 3-3s3 1.34 3 3V7H9v-.25zm9 11.75c0 .28-.22.5-.5.5h-11c-.28 0-.5-.22-.5-.5v-9c0-.28.22-.5.5-.5h11c.28 0 .5.22.5.5v9z"></path>
                                    </g>
                                  </svg>
                                </div>
                              </div>
                            </div>
                          </div>
                          {/* creator hub finish to check  */}
                          {/* Verification and security start to check */}
                          <div
                            className="mt-3 premium-plus-parent-div"
                            style={{
                              padding: "32px",
                              borderRadius: "16px",
                              backgroundColor: "#eff3f4",
                            }}
                          >
                            <div className="premium-plus-header">
                              Verification & Security
                            </div>
                            <div>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <div>
                                  <span
                                    style={{
                                      color:
                                        "rgb(83, 100, 113)                                  ",
                                    }}
                                  >
                                    {" "}
                                    Checkmark
                                  </span>
                                  <svg
                                    width={20}
                                    height={20}
                                    color="rgba(83,100,113,1.00)"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                    className="exclamation r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-10ptun7 r-1janqcz r-14j79pv"
                                  >
                                    <g>
                                      <path d="M13.5 8.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5S11.17 7 12 7s1.5.67 1.5 1.5zM13 17v-5h-2v5h2zm-1 5.25c5.66 0 10.25-4.59 10.25-10.25S17.66 1.75 12 1.75 1.75 6.34 1.75 12 6.34 22.25 12 22.25zM20.25 12c0 4.56-3.69 8.25-8.25 8.25S3.75 16.56 3.75 12 7.44 3.75 12 3.75s8.25 3.69 8.25 8.25z"></path>
                                    </g>
                                  </svg>
                                </div>
                                <div>
                                  {" "}
                                  <svg
                                    width={`${1.25}em`}
                                    height={`${1.25}em`}
                                    color="rgba(83,100,113,1.00)"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                    className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-14j79pv"
                                  >
                                    <g>
                                      <path d="M14 13c0 .74-.4 1.39-1 1.73V17h-2v-2.27c-.59-.34-1-.99-1-1.73 0-1.1.9-2 2-2 1.11 0 2 .9 2 2zm3.5-6H17v-.25c0-2.76-2.24-5-5-5s-5 2.24-5 5V7h-.5C5.12 7 4 8.12 4 9.5v9C4 19.88 5.12 21 6.5 21h11c1.38 0 2.5-1.12 2.5-2.5v-9C20 8.12 18.88 7 17.5 7zM9 6.75c0-1.66 1.34-3 3-3s3 1.34 3 3V7H9v-.25zm9 11.75c0 .28-.22.5-.5.5h-11c-.28 0-.5-.22-.5-.5v-9c0-.28.22-.5.5-.5h11c.28 0 .5.22.5.5v9z"></path>
                                    </g>
                                  </svg>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <div>
                                  <span>Encrypted direct messages</span>
                                  <svg
                                    width={20}
                                    height={20}
                                    color="rgba(83,100,113,1.00)"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                    className="exclamation r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-10ptun7 r-1janqcz r-14j79pv"
                                  >
                                    <g>
                                      <path d="M13.5 8.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5S11.17 7 12 7s1.5.67 1.5 1.5zM13 17v-5h-2v5h2zm-1 5.25c5.66 0 10.25-4.59 10.25-10.25S17.66 1.75 12 1.75 1.75 6.34 1.75 12 6.34 22.25 12 22.25zM20.25 12c0 4.56-3.69 8.25-8.25 8.25S3.75 16.56 3.75 12 7.44 3.75 12 3.75s8.25 3.69 8.25 8.25z"></path>
                                    </g>
                                  </svg>
                                </div>
                                <div>
                                  {" "}
                                  <svg
                                    color="rgb(0, 186, 124)"
                                    fill="currentColor"
                                    width={20}
                                    height={20}
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                    className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-o6sn0f"
                                  >
                                    <g>
                                      <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                    </g>
                                  </svg>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <div>
                                  <span
                                    style={{
                                      color:
                                        "rgb(83, 100, 113)                                  ",
                                    }}
                                  >
                                    Optional ID verification
                                  </span>
                                  <svg
                                    width={20}
                                    height={20}
                                    color="rgba(83,100,113,1.00)"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                    className="exclamation r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-10ptun7 r-1janqcz r-14j79pv"
                                  >
                                    <g>
                                      <path d="M13.5 8.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5S11.17 7 12 7s1.5.67 1.5 1.5zM13 17v-5h-2v5h2zm-1 5.25c5.66 0 10.25-4.59 10.25-10.25S17.66 1.75 12 1.75 1.75 6.34 1.75 12 6.34 22.25 12 22.25zM20.25 12c0 4.56-3.69 8.25-8.25 8.25S3.75 16.56 3.75 12 7.44 3.75 12 3.75s8.25 3.69 8.25 8.25z"></path>
                                    </g>
                                  </svg>
                                </div>
                                <div>
                                  {" "}
                                  <svg
                                    width={`${1.25}em`}
                                    height={`${1.25}em`}
                                    color="rgba(83,100,113,1.00)"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                    className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-14j79pv"
                                  >
                                    <g>
                                      <path d="M14 13c0 .74-.4 1.39-1 1.73V17h-2v-2.27c-.59-.34-1-.99-1-1.73 0-1.1.9-2 2-2 1.11 0 2 .9 2 2zm3.5-6H17v-.25c0-2.76-2.24-5-5-5s-5 2.24-5 5V7h-.5C5.12 7 4 8.12 4 9.5v9C4 19.88 5.12 21 6.5 21h11c1.38 0 2.5-1.12 2.5-2.5v-9C20 8.12 18.88 7 17.5 7zM9 6.75c0-1.66 1.34-3 3-3s3 1.34 3 3V7H9v-.25zm9 11.75c0 .28-.22.5-.5.5h-11c-.28 0-.5-.22-.5-.5v-9c0-.28.22-.5.5-.5h11c.28 0 .5.22.5.5v9z"></path>
                                    </g>
                                  </svg>
                                </div>
                              </div>
                            </div>
                          </div>
                          {/* verification and security finish to check */}
                          {/* Customization start to check  */}
                          <div
                            className="mt-3 premium-plus-parent-div"
                            style={{
                              padding: "32px",
                              borderRadius: "16px",
                              backgroundColor: "#eff3f4",
                            }}
                          >
                            <div className="premium-plus-header">
                              Customization
                            </div>
                            <div>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <div>
                                  <span>App icons</span>
                                </div>
                                <div>
                                  {" "}
                                  <svg
                                    color="rgb(0, 186, 124)"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                    className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-o6sn0f"
                                  >
                                    <g>
                                      <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                    </g>
                                  </svg>
                                </div>
                              </div>
                            </div>

                            <div>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <div>
                                  <span>Bookmark folders</span>{" "}
                                </div>
                                <div>
                                  {" "}
                                  <svg
                                    color="rgb(0, 186, 124)"
                                    fill="currentColor"
                                    width={20}
                                    height={20}
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                    className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-o6sn0f"
                                  >
                                    <g>
                                      <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                    </g>
                                  </svg>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <div>
                                  <span>Customize navigation</span>{" "}
                                </div>
                                <div>
                                  {" "}
                                  <svg
                                    color="rgb(0, 186, 124)"
                                    fill="currentColor"
                                    width={20}
                                    height={20}
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                    className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-o6sn0f"
                                  >
                                    <g>
                                      <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                    </g>
                                  </svg>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <div>
                                  <span>Highlights tab</span>{" "}
                                  <svg
                                    width={20}
                                    height={20}
                                    color="rgba(83,100,113,1.00)"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                    className="exclamation r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-10ptun7 r-1janqcz r-14j79pv"
                                  >
                                    <g>
                                      <path d="M13.5 8.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5S11.17 7 12 7s1.5.67 1.5 1.5zM13 17v-5h-2v5h2zm-1 5.25c5.66 0 10.25-4.59 10.25-10.25S17.66 1.75 12 1.75 1.75 6.34 1.75 12 6.34 22.25 12 22.25zM20.25 12c0 4.56-3.69 8.25-8.25 8.25S3.75 16.56 3.75 12 7.44 3.75 12 3.75s8.25 3.69 8.25 8.25z"></path>
                                    </g>
                                  </svg>
                                </div>
                                <div>
                                  {" "}
                                  <svg
                                    color="rgb(0, 186, 124)"
                                    fill="currentColor"
                                    width={20}
                                    height={20}
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                    className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-o6sn0f"
                                  >
                                    <g>
                                      <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                    </g>
                                  </svg>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <div>
                                  <span>Hide your likes</span>{" "}
                                </div>
                                <div>
                                  {" "}
                                  <svg
                                    color="rgb(0, 186, 124)"
                                    fill="currentColor"
                                    width={20}
                                    height={20}
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                    className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-o6sn0f"
                                  >
                                    <g>
                                      <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                    </g>
                                  </svg>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <div>
                                  <span>Hide your checkmark</span>{" "}
                                </div>
                                <div>
                                  {" "}
                                  <svg
                                    color="rgb(0, 186, 124)"
                                    fill="currentColor"
                                    width={20}
                                    height={20}
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                    className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-o6sn0f"
                                  >
                                    <g>
                                      <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                    </g>
                                  </svg>
                                </div>
                              </div>
                            </div>
                            {/* reader check  */}
                            <div>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <div>Hide your subscriptions</div>
                                <div>
                                  {" "}
                                  <svg
                                    color="rgb(0, 186, 124)"
                                    fill="currentColor"
                                    width={20}
                                    height={20}
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                    className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-o6sn0f"
                                  >
                                    <g>
                                      <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                    </g>
                                  </svg>
                                </div>
                              </div>
                            </div>
                            {/* reader check  */}
                          </div>
                          {/* Customization finish to check  */}
                        </div>
                        {/* first div basic plan finish to check   */}
                        {/* second div premium  plan start to check   */}
                        <div
                          style={{
                            width: "81.5%",
                            margin: "0px auto",
                          }}
                        >
                          <Stack
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              backgroundImage:
                                "url(https://abs.twimg.com/responsive-web/client-web/background-premium-web@3x.44f5419a.png)",
                              backgroundPosition: "center",
                              backgroundSize: "cover",
                              borderRadius: "16px",
                              color: "white",
                              minHeight: "60px",
                            }}
                            direction="horizontal"
                            gap={1}
                          >
                            <div className="p-2" style={{}}>
                              {" "}
                              <span
                                onClick={() => {
                                  previous2();
                                }}
                                className="premium-btn-back"
                                style={{
                                  color: "white",
                                  backgroundColor: "#13181c",
                                  width: "30px",
                                  height: "30px",
                                  borderRadius: "50%",
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                <svg
                                  width={20}
                                  height={20}
                                  color="white"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-z80fyv r-19wmn03 r-jwli3a"
                                >
                                  <g>
                                    <path d="M7.414 13l5.043 5.04-1.414 1.42L3.586 12l7.457-7.46 1.414 1.42L7.414 11H21v2H7.414z"></path>
                                  </g>
                                </svg>
                              </span>
                            </div>
                            <div style={{}}>
                              {" "}
                              <span
                                style={{
                                  color: "white",
                                  lineHeight: "20px",
                                  fontWeight: "500",
                                  fontSize: "17px",
                                  position: "relative",
                                  left: "5px",
                                }}
                              >
                                Premium
                                <span
                                  span
                                  style={{
                                    visibility: "hidden",
                                  }}
                                >
                                  +
                                </span>
                              </span>
                            </div>
                            <div className="p-2" style={{}}>
                              {" "}
                              <span
                                onClick={() => {
                                  next2();
                                }}
                                className="premium-btn-back"
                                style={{
                                  color: "white",
                                  backgroundColor: "#13181c",
                                  width: "30px",
                                  height: "30px",
                                  borderRadius: "50%",
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                <svg
                                  width={20}
                                  height={20}
                                  color="white"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-z80fyv r-19wmn03 r-jwli3a"
                                >
                                  <g>
                                    <path d="M12.957 4.54L20.414 12l-7.457 7.46-1.414-1.42L16.586 13H3v-2h13.586l-5.043-5.04 1.414-1.42z"></path>
                                  </g>
                                </svg>
                              </span>
                            </div>
                          </Stack>{" "}
                          {/* enhanced experience start to check  */}
                          <div
                            className="mt-3 premium-plus-parent-div"
                            style={{
                              padding: "32px",
                              borderRadius: "16px",
                              backgroundColor: "#eff3f4",
                            }}
                          >
                            <div className="premium-plus-header">
                              Enhanced Experience
                            </div>
                            <div>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <div>
                                  <span>Ads in For You</span>
                                  <svg
                                    width={16}
                                    height={16}
                                    color="rgba(83,100,113,1.00)"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                    className="exclamation r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-10ptun7 r-1janqcz r-14j79pv"
                                  >
                                    <g>
                                      <path d="M13.5 8.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5S11.17 7 12 7s1.5.67 1.5 1.5zM13 17v-5h-2v5h2zm-1 5.25c5.66 0 10.25-4.59 10.25-10.25S17.66 1.75 12 1.75 1.75 6.34 1.75 12 6.34 22.25 12 22.25zM20.25 12c0 4.56-3.69 8.25-8.25 8.25S3.75 16.56 3.75 12 7.44 3.75 12 3.75s8.25 3.69 8.25 8.25z"></path>
                                    </g>
                                  </svg>
                                </div>
                                <div>Half</div>
                              </div>
                            </div>
                            <div>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <div>
                                  <span>Reply boost</span>
                                </div>
                                <div>Larger</div>
                              </div>
                            </div>
                            <div>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <div>
                                  <span>Edit post</span>{" "}
                                </div>
                                <div>
                                  {" "}
                                  <svg
                                    color="rgb(0, 186, 124)"
                                    fill="currentColor"
                                    width={20}
                                    height={20}
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                    className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-o6sn0f"
                                  >
                                    <g>
                                      <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                    </g>
                                  </svg>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <div>
                                  <span>Longer posts</span>{" "}
                                </div>
                                <div>
                                  {" "}
                                  <svg
                                    color="rgb(0, 186, 124)"
                                    fill="currentColor"
                                    width={20}
                                    height={20}
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                    className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-o6sn0f"
                                  >
                                    <g>
                                      <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                    </g>
                                  </svg>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <div>
                                  <span>Undo post</span>{" "}
                                </div>
                                <div>
                                  {" "}
                                  <svg
                                    color="rgb(0, 186, 124)"
                                    fill="currentColor"
                                    width={20}
                                    height={20}
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                    className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-o6sn0f"
                                  >
                                    <g>
                                      <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                    </g>
                                  </svg>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <div>
                                  <span>Post longer videos</span>{" "}
                                </div>
                                <div>
                                  {" "}
                                  <svg
                                    color="rgb(0, 186, 124)"
                                    fill="currentColor"
                                    width={20}
                                    height={20}
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                    className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-o6sn0f"
                                  >
                                    <g>
                                      <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                    </g>
                                  </svg>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <div>
                                  <span>Top Articles</span>{" "}
                                </div>
                                <div>
                                  {" "}
                                  <svg
                                    color="rgb(0, 186, 124)"
                                    fill="currentColor"
                                    width={20}
                                    height={20}
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                    className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-o6sn0f"
                                  >
                                    <g>
                                      <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                    </g>
                                  </svg>
                                </div>
                              </div>
                            </div>
                            {/* reader check  */}
                            <div>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <div>
                                  <span>Reader</span>{" "}
                                  <svg
                                    width={20}
                                    height={20}
                                    color="rgba(83,100,113,1.00)"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                    className="exclamation r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-10ptun7 r-1janqcz r-14j79pv"
                                  >
                                    <g>
                                      <path d="M13.5 8.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5S11.17 7 12 7s1.5.67 1.5 1.5zM13 17v-5h-2v5h2zm-1 5.25c5.66 0 10.25-4.59 10.25-10.25S17.66 1.75 12 1.75 1.75 6.34 1.75 12 6.34 22.25 12 22.25zM20.25 12c0 4.56-3.69 8.25-8.25 8.25S3.75 16.56 3.75 12 7.44 3.75 12 3.75s8.25 3.69 8.25 8.25z"></path>
                                    </g>
                                  </svg>
                                </div>
                                <div>
                                  {" "}
                                  <svg
                                    color="rgb(0, 186, 124)"
                                    fill="currentColor"
                                    width={20}
                                    height={20}
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                    className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-o6sn0f"
                                  >
                                    <g>
                                      <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                    </g>
                                  </svg>
                                </div>
                              </div>
                            </div>
                            {/* reader check  */}
                            <div>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <div>
                                  <span>Background video playback</span>{" "}
                                </div>
                                <div>
                                  {" "}
                                  <svg
                                    color="rgb(0, 186, 124)"
                                    fill="currentColor"
                                    width={20}
                                    height={20}
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                    className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-o6sn0f"
                                  >
                                    <g>
                                      <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                    </g>
                                  </svg>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <div>
                                  <span>Download videos</span>{" "}
                                </div>
                                <div>
                                  {" "}
                                  <svg
                                    color="rgb(0, 186, 124)"
                                    fill="currentColor"
                                    width={20}
                                    height={20}
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                    className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-o6sn0f"
                                  >
                                    <g>
                                      <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                    </g>
                                  </svg>
                                </div>
                              </div>
                            </div>
                          </div>
                          {/* enhanced experience finish to check  */}
                          {/* creator hub start to check  */}
                          <div
                            className="mt-3 premium-plus-parent-div"
                            style={{
                              padding: "32px",
                              borderRadius: "16px",
                              backgroundColor: "#eff3f4",
                            }}
                          >
                            <div className="premium-plus-header">
                              Creator Hub
                            </div>
                            <div>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <div>
                                  <span
                                    style={{
                                      color:
                                        "rgb(83, 100, 113)                                  ",
                                    }}
                                  >
                                    Write Articles
                                  </span>

                                  <svg
                                    width={20}
                                    height={20}
                                    color="rgba(83,100,113,1.00)"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                    className="exclamation r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-10ptun7 r-1janqcz r-14j79pv"
                                  >
                                    <g>
                                      <path d="M13.5 8.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5S11.17 7 12 7s1.5.67 1.5 1.5zM13 17v-5h-2v5h2zm-1 5.25c5.66 0 10.25-4.59 10.25-10.25S17.66 1.75 12 1.75 1.75 6.34 1.75 12 6.34 22.25 12 22.25zM20.25 12c0 4.56-3.69 8.25-8.25 8.25S3.75 16.56 3.75 12 7.44 3.75 12 3.75s8.25 3.69 8.25 8.25z"></path>
                                    </g>
                                  </svg>
                                </div>
                                <div>
                                  {" "}
                                  <svg
                                    width={`${1.25}em`}
                                    height={`${1.25}em`}
                                    color="rgba(83,100,113,1.00)"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                    className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-14j79pv"
                                  >
                                    <g>
                                      <path d="M14 13c0 .74-.4 1.39-1 1.73V17h-2v-2.27c-.59-.34-1-.99-1-1.73 0-1.1.9-2 2-2 1.11 0 2 .9 2 2zm3.5-6H17v-.25c0-2.76-2.24-5-5-5s-5 2.24-5 5V7h-.5C5.12 7 4 8.12 4 9.5v9C4 19.88 5.12 21 6.5 21h11c1.38 0 2.5-1.12 2.5-2.5v-9C20 8.12 18.88 7 17.5 7zM9 6.75c0-1.66 1.34-3 3-3s3 1.34 3 3V7H9v-.25zm9 11.75c0 .28-.22.5-.5.5h-11c-.28 0-.5-.22-.5-.5v-9c0-.28.22-.5.5-.5h11c.28 0 .5.22.5.5v9z"></path>
                                    </g>
                                  </svg>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <div>
                                  <span>Get paid to post</span>
                                  <svg
                                    width={20}
                                    height={20}
                                    color="rgba(83,100,113,1.00)"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                    className="exclamation r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-10ptun7 r-1janqcz r-14j79pv"
                                  >
                                    <g>
                                      <path d="M13.5 8.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5S11.17 7 12 7s1.5.67 1.5 1.5zM13 17v-5h-2v5h2zm-1 5.25c5.66 0 10.25-4.59 10.25-10.25S17.66 1.75 12 1.75 1.75 6.34 1.75 12 6.34 22.25 12 22.25zM20.25 12c0 4.56-3.69 8.25-8.25 8.25S3.75 16.56 3.75 12 7.44 3.75 12 3.75s8.25 3.69 8.25 8.25z"></path>
                                    </g>
                                  </svg>
                                </div>
                                <div>
                                  {" "}
                                  <svg
                                    color="rgb(0, 186, 124)"
                                    fill="currentColor"
                                    width={20}
                                    height={20}
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                    className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-o6sn0f"
                                  >
                                    <g>
                                      <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                    </g>
                                  </svg>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <div>
                                  <span>Creator Subscriptions</span>
                                  <svg
                                    width={20}
                                    height={20}
                                    color="rgba(83,100,113,1.00)"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                    className="exclamation r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-10ptun7 r-1janqcz r-14j79pv"
                                  >
                                    <g>
                                      <path d="M13.5 8.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5S11.17 7 12 7s1.5.67 1.5 1.5zM13 17v-5h-2v5h2zm-1 5.25c5.66 0 10.25-4.59 10.25-10.25S17.66 1.75 12 1.75 1.75 6.34 1.75 12 6.34 22.25 12 22.25zM20.25 12c0 4.56-3.69 8.25-8.25 8.25S3.75 16.56 3.75 12 7.44 3.75 12 3.75s8.25 3.69 8.25 8.25z"></path>
                                    </g>
                                  </svg>
                                </div>
                                <div>
                                  {" "}
                                  <svg
                                    color="rgb(0, 186, 124)"
                                    fill="currentColor"
                                    width={20}
                                    height={20}
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                    className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-o6sn0f"
                                  >
                                    <g>
                                      <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                    </g>
                                  </svg>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <div>
                                  <span>X Pro</span>
                                  <svg
                                    width={20}
                                    height={20}
                                    color="rgba(83,100,113,1.00)"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                    className="exclamation r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-10ptun7 r-1janqcz r-14j79pv"
                                  >
                                    <g>
                                      <path d="M13.5 8.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5S11.17 7 12 7s1.5.67 1.5 1.5zM13 17v-5h-2v5h2zm-1 5.25c5.66 0 10.25-4.59 10.25-10.25S17.66 1.75 12 1.75 1.75 6.34 1.75 12 6.34 22.25 12 22.25zM20.25 12c0 4.56-3.69 8.25-8.25 8.25S3.75 16.56 3.75 12 7.44 3.75 12 3.75s8.25 3.69 8.25 8.25z"></path>
                                    </g>
                                  </svg>
                                </div>
                                <div>
                                  {" "}
                                  <svg
                                    color="rgb(0, 186, 124)"
                                    fill="currentColor"
                                    width={20}
                                    height={20}
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                    className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-o6sn0f"
                                  >
                                    <g>
                                      <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                    </g>
                                  </svg>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <div>
                                  <span>Media Studio</span>
                                  <svg
                                    width={20}
                                    height={20}
                                    color="rgba(83,100,113,1.00)"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                    className="exclamation r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-10ptun7 r-1janqcz r-14j79pv"
                                  >
                                    <g>
                                      <path d="M13.5 8.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5S11.17 7 12 7s1.5.67 1.5 1.5zM13 17v-5h-2v5h2zm-1 5.25c5.66 0 10.25-4.59 10.25-10.25S17.66 1.75 12 1.75 1.75 6.34 1.75 12 6.34 22.25 12 22.25zM20.25 12c0 4.56-3.69 8.25-8.25 8.25S3.75 16.56 3.75 12 7.44 3.75 12 3.75s8.25 3.69 8.25 8.25z"></path>
                                    </g>
                                  </svg>
                                </div>
                                <div>
                                  {" "}
                                  <svg
                                    color="rgb(0, 186, 124)"
                                    fill="currentColor"
                                    width={20}
                                    height={20}
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                    className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-o6sn0f"
                                  >
                                    <g>
                                      <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                    </g>
                                  </svg>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <div>
                                  <span>Analytics</span>
                                  <svg
                                    width={20}
                                    height={20}
                                    color="rgba(83,100,113,1.00)"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                    className="exclamation r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-10ptun7 r-1janqcz r-14j79pv"
                                  >
                                    <g>
                                      <path d="M13.5 8.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5S11.17 7 12 7s1.5.67 1.5 1.5zM13 17v-5h-2v5h2zm-1 5.25c5.66 0 10.25-4.59 10.25-10.25S17.66 1.75 12 1.75 1.75 6.34 1.75 12 6.34 22.25 12 22.25zM20.25 12c0 4.56-3.69 8.25-8.25 8.25S3.75 16.56 3.75 12 7.44 3.75 12 3.75s8.25 3.69 8.25 8.25z"></path>
                                    </g>
                                  </svg>
                                </div>
                                <div>
                                  {" "}
                                  <svg
                                    color="rgb(0, 186, 124)"
                                    fill="currentColor"
                                    width={20}
                                    height={20}
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                    className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-o6sn0f"
                                  >
                                    <g>
                                      <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                    </g>
                                  </svg>
                                </div>
                              </div>
                            </div>
                          </div>
                          {/* creator hub finish to check  */}
                          {/* Verification and security start to check */}
                          <div
                            className="mt-3 premium-plus-parent-div"
                            style={{
                              padding: "32px",
                              borderRadius: "16px",
                              backgroundColor: "#eff3f4",
                            }}
                          >
                            <div className="premium-plus-header">
                              Verification & Security
                            </div>
                            <div>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <div>
                                  <span>Checkmark</span>
                                  <svg
                                    width={20}
                                    height={20}
                                    color="rgba(83,100,113,1.00)"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                    className="exclamation r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-10ptun7 r-1janqcz r-14j79pv"
                                  >
                                    <g>
                                      <path d="M13.5 8.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5S11.17 7 12 7s1.5.67 1.5 1.5zM13 17v-5h-2v5h2zm-1 5.25c5.66 0 10.25-4.59 10.25-10.25S17.66 1.75 12 1.75 1.75 6.34 1.75 12 6.34 22.25 12 22.25zM20.25 12c0 4.56-3.69 8.25-8.25 8.25S3.75 16.56 3.75 12 7.44 3.75 12 3.75s8.25 3.69 8.25 8.25z"></path>
                                    </g>
                                  </svg>
                                </div>
                                <div>
                                  {" "}
                                  <svg
                                    color="rgb(0, 186, 124)"
                                    fill="currentColor"
                                    width={20}
                                    height={20}
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                    className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-o6sn0f"
                                  >
                                    <g>
                                      <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                    </g>
                                  </svg>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <div>
                                  <span>Encrypted direct messages</span>
                                  <svg
                                    width={20}
                                    height={20}
                                    color="rgba(83,100,113,1.00)"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                    className="exclamation r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-10ptun7 r-1janqcz r-14j79pv"
                                  >
                                    <g>
                                      <path d="M13.5 8.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5S11.17 7 12 7s1.5.67 1.5 1.5zM13 17v-5h-2v5h2zm-1 5.25c5.66 0 10.25-4.59 10.25-10.25S17.66 1.75 12 1.75 1.75 6.34 1.75 12 6.34 22.25 12 22.25zM20.25 12c0 4.56-3.69 8.25-8.25 8.25S3.75 16.56 3.75 12 7.44 3.75 12 3.75s8.25 3.69 8.25 8.25z"></path>
                                    </g>
                                  </svg>
                                </div>
                                <div>
                                  {" "}
                                  <svg
                                    color="rgb(0, 186, 124)"
                                    fill="currentColor"
                                    width={20}
                                    height={20}
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                    className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-o6sn0f"
                                  >
                                    <g>
                                      <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                    </g>
                                  </svg>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <div>
                                  <span>Optional ID verification</span>
                                  <svg
                                    width={20}
                                    height={20}
                                    color="rgba(83,100,113,1.00)"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                    className="exclamation r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-10ptun7 r-1janqcz r-14j79pv"
                                  >
                                    <g>
                                      <path d="M13.5 8.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5S11.17 7 12 7s1.5.67 1.5 1.5zM13 17v-5h-2v5h2zm-1 5.25c5.66 0 10.25-4.59 10.25-10.25S17.66 1.75 12 1.75 1.75 6.34 1.75 12 6.34 22.25 12 22.25zM20.25 12c0 4.56-3.69 8.25-8.25 8.25S3.75 16.56 3.75 12 7.44 3.75 12 3.75s8.25 3.69 8.25 8.25z"></path>
                                    </g>
                                  </svg>
                                </div>
                                <div>
                                  {" "}
                                  <svg
                                    color="rgb(0, 186, 124)"
                                    fill="currentColor"
                                    width={20}
                                    height={20}
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                    className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-o6sn0f"
                                  >
                                    <g>
                                      <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                    </g>
                                  </svg>
                                </div>
                              </div>
                            </div>
                          </div>
                          {/* verification and security finish to check */}
                          {/* Customization start to check  */}
                          <div
                            className="mt-3 premium-plus-parent-div"
                            style={{
                              padding: "32px",
                              borderRadius: "16px",
                              backgroundColor: "#eff3f4",
                            }}
                          >
                            <div className="premium-plus-header">
                              Customization
                            </div>
                            <div>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <div>
                                  <span>App icons</span>
                                </div>
                                <div>
                                  {" "}
                                  <svg
                                    color="rgb(0, 186, 124)"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                    className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-o6sn0f"
                                  >
                                    <g>
                                      <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                    </g>
                                  </svg>
                                </div>
                              </div>
                            </div>

                            <div>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <div>
                                  <span>Bookmark folders</span>{" "}
                                </div>
                                <div>
                                  {" "}
                                  <svg
                                    color="rgb(0, 186, 124)"
                                    fill="currentColor"
                                    width={20}
                                    height={20}
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                    className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-o6sn0f"
                                  >
                                    <g>
                                      <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                    </g>
                                  </svg>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <div>
                                  <span>Customize navigation</span>{" "}
                                </div>
                                <div>
                                  {" "}
                                  <svg
                                    color="rgb(0, 186, 124)"
                                    fill="currentColor"
                                    width={20}
                                    height={20}
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                    className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-o6sn0f"
                                  >
                                    <g>
                                      <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                    </g>
                                  </svg>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <div>
                                  <span>Highlights tab</span>{" "}
                                  <svg
                                    width={20}
                                    height={20}
                                    color="rgba(83,100,113,1.00)"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                    className="exclamation r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-10ptun7 r-1janqcz r-14j79pv"
                                  >
                                    <g>
                                      <path d="M13.5 8.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5S11.17 7 12 7s1.5.67 1.5 1.5zM13 17v-5h-2v5h2zm-1 5.25c5.66 0 10.25-4.59 10.25-10.25S17.66 1.75 12 1.75 1.75 6.34 1.75 12 6.34 22.25 12 22.25zM20.25 12c0 4.56-3.69 8.25-8.25 8.25S3.75 16.56 3.75 12 7.44 3.75 12 3.75s8.25 3.69 8.25 8.25z"></path>
                                    </g>
                                  </svg>
                                </div>
                                <div>
                                  {" "}
                                  <svg
                                    color="rgb(0, 186, 124)"
                                    fill="currentColor"
                                    width={20}
                                    height={20}
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                    className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-o6sn0f"
                                  >
                                    <g>
                                      <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                    </g>
                                  </svg>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <div>
                                  <span>Hide your likes</span>{" "}
                                </div>
                                <div>
                                  {" "}
                                  <svg
                                    color="rgb(0, 186, 124)"
                                    fill="currentColor"
                                    width={20}
                                    height={20}
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                    className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-o6sn0f"
                                  >
                                    <g>
                                      <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                    </g>
                                  </svg>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <div>
                                  <span>Hide your checkmark</span>{" "}
                                </div>
                                <div>
                                  {" "}
                                  <svg
                                    color="rgb(0, 186, 124)"
                                    fill="currentColor"
                                    width={20}
                                    height={20}
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                    className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-o6sn0f"
                                  >
                                    <g>
                                      <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                    </g>
                                  </svg>
                                </div>
                              </div>
                            </div>
                            {/* reader check  */}
                            <div>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <div>Hide your subscriptions</div>
                                <div>
                                  {" "}
                                  <svg
                                    color="rgb(0, 186, 124)"
                                    fill="currentColor"
                                    width={20}
                                    height={20}
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                    className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-o6sn0f"
                                  >
                                    <g>
                                      <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                    </g>
                                  </svg>
                                </div>
                              </div>
                            </div>
                            {/* reader check  */}
                          </div>
                          {/* Customization finish to check  */}
                        </div>
                        {/* second div premium plan finish to check   */}
                        {/* third div premium plus plan start to check  */}
                        <div
                          style={{
                            width: "81.5%",
                            margin: "0px auto",
                          }}
                        >
                          <Stack
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              backgroundImage:
                                "url(https://abs.twimg.com/responsive-web/client-web/background-premiumplus-web@3x.f3a57bda.png)",
                              backgroundPosition: "center",
                              backgroundSize: "cover",
                              borderRadius: "16px",
                              color: "white",
                              minHeight: "60px",
                            }}
                            direction="horizontal"
                            gap={1}
                          >
                            <div className="p-2" style={{}}>
                              {" "}
                              <span
                                onClick={() => {
                                  previous2();
                                }}
                                className="premium-btn-back"
                                style={{
                                  color: "white",
                                  backgroundColor: "#13181c",
                                  width: "30px",
                                  height: "30px",
                                  borderRadius: "50%",
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                <svg
                                  width={20}
                                  height={20}
                                  color="white"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-z80fyv r-19wmn03 r-jwli3a"
                                >
                                  <g>
                                    <path d="M7.414 13l5.043 5.04-1.414 1.42L3.586 12l7.457-7.46 1.414 1.42L7.414 11H21v2H7.414z"></path>
                                  </g>
                                </svg>
                              </span>
                            </div>
                            <div style={{}}>
                              {" "}
                              <span
                                style={{
                                  color: "white",
                                  lineHeight: "20px",
                                  fontWeight: "500",
                                  fontSize: "17px",
                                  position: "relative",
                                  left: "5px",
                                }}
                              >
                                Premium+
                              </span>
                            </div>
                            <div className="p-2" style={{}}>
                              {" "}
                              <span
                                onClick={() => {
                                  next2();
                                }}
                                className="premium-btn-back"
                                style={{
                                  color: "white",
                                  backgroundColor: "#13181c",
                                  width: "30px",
                                  height: "30px",
                                  borderRadius: "50%",
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  visibility: "hidden",
                                }}
                              >
                                <svg
                                  width={20}
                                  height={20}
                                  color="white"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-z80fyv r-19wmn03 r-jwli3a"
                                >
                                  <g>
                                    <path d="M12.957 4.54L20.414 12l-7.457 7.46-1.414-1.42L16.586 13H3v-2h13.586l-5.043-5.04 1.414-1.42z"></path>
                                  </g>
                                </svg>
                              </span>
                            </div>
                          </Stack>{" "}
                          {/* enhanced experience start to check  */}
                          <div
                            className="mt-3 premium-plus-parent-div"
                            style={{
                              padding: "32px",
                              borderRadius: "16px",
                              backgroundColor: "#eff3f4",
                            }}
                          >
                            <div className="premium-plus-header">
                              Enhanced Experience
                            </div>
                            <div>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <div>
                                  <span>Ads in For You</span>
                                  <svg
                                    width={16}
                                    height={16}
                                    color="rgba(83,100,113,1.00)"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                    className="exclamation r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-10ptun7 r-1janqcz r-14j79pv"
                                  >
                                    <g>
                                      <path d="M13.5 8.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5S11.17 7 12 7s1.5.67 1.5 1.5zM13 17v-5h-2v5h2zm-1 5.25c5.66 0 10.25-4.59 10.25-10.25S17.66 1.75 12 1.75 1.75 6.34 1.75 12 6.34 22.25 12 22.25zM20.25 12c0 4.56-3.69 8.25-8.25 8.25S3.75 16.56 3.75 12 7.44 3.75 12 3.75s8.25 3.69 8.25 8.25z"></path>
                                    </g>
                                  </svg>
                                </div>
                                <div>None</div>
                              </div>
                            </div>
                            <div>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <div>
                                  <span>Reply boost</span>
                                </div>
                                <div>Largest</div>
                              </div>
                            </div>
                            <div>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <div>
                                  <span>Edit post</span>{" "}
                                </div>
                                <div>
                                  {" "}
                                  <svg
                                    color="rgb(0, 186, 124)"
                                    fill="currentColor"
                                    width={20}
                                    height={20}
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                    className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-o6sn0f"
                                  >
                                    <g>
                                      <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                    </g>
                                  </svg>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <div>
                                  <span>Longer posts</span>{" "}
                                </div>
                                <div>
                                  {" "}
                                  <svg
                                    color="rgb(0, 186, 124)"
                                    fill="currentColor"
                                    width={20}
                                    height={20}
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                    className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-o6sn0f"
                                  >
                                    <g>
                                      <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                    </g>
                                  </svg>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <div>
                                  <span>Undo post</span>{" "}
                                </div>
                                <div>
                                  {" "}
                                  <svg
                                    color="rgb(0, 186, 124)"
                                    fill="currentColor"
                                    width={20}
                                    height={20}
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                    className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-o6sn0f"
                                  >
                                    <g>
                                      <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                    </g>
                                  </svg>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <div>
                                  <span>Post longer videos</span>{" "}
                                </div>
                                <div>
                                  {" "}
                                  <svg
                                    color="rgb(0, 186, 124)"
                                    fill="currentColor"
                                    width={20}
                                    height={20}
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                    className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-o6sn0f"
                                  >
                                    <g>
                                      <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                    </g>
                                  </svg>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <div>
                                  <span>Top Articles</span>{" "}
                                </div>
                                <div>
                                  {" "}
                                  <svg
                                    color="rgb(0, 186, 124)"
                                    fill="currentColor"
                                    width={20}
                                    height={20}
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                    className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-o6sn0f"
                                  >
                                    <g>
                                      <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                    </g>
                                  </svg>
                                </div>
                              </div>
                            </div>
                            {/* reader check  */}
                            <div>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <div>
                                  <span>Reader</span>{" "}
                                  <svg
                                    width={20}
                                    height={20}
                                    color="rgba(83,100,113,1.00)"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                    className="exclamation r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-10ptun7 r-1janqcz r-14j79pv"
                                  >
                                    <g>
                                      <path d="M13.5 8.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5S11.17 7 12 7s1.5.67 1.5 1.5zM13 17v-5h-2v5h2zm-1 5.25c5.66 0 10.25-4.59 10.25-10.25S17.66 1.75 12 1.75 1.75 6.34 1.75 12 6.34 22.25 12 22.25zM20.25 12c0 4.56-3.69 8.25-8.25 8.25S3.75 16.56 3.75 12 7.44 3.75 12 3.75s8.25 3.69 8.25 8.25z"></path>
                                    </g>
                                  </svg>
                                </div>
                                <div>
                                  {" "}
                                  <svg
                                    color="rgb(0, 186, 124)"
                                    fill="currentColor"
                                    width={20}
                                    height={20}
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                    className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-o6sn0f"
                                  >
                                    <g>
                                      <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                    </g>
                                  </svg>
                                </div>
                              </div>
                            </div>
                            {/* reader check  */}
                            <div>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <div>
                                  <span>Background video playback</span>{" "}
                                </div>
                                <div>
                                  {" "}
                                  <svg
                                    color="rgb(0, 186, 124)"
                                    fill="currentColor"
                                    width={20}
                                    height={20}
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                    className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-o6sn0f"
                                  >
                                    <g>
                                      <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                    </g>
                                  </svg>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <div>
                                  <span>Download videos</span>{" "}
                                </div>
                                <div>
                                  {" "}
                                  <svg
                                    color="rgb(0, 186, 124)"
                                    fill="currentColor"
                                    width={20}
                                    height={20}
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                    className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-o6sn0f"
                                  >
                                    <g>
                                      <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                    </g>
                                  </svg>
                                </div>
                              </div>
                            </div>
                          </div>
                          {/* enhanced experience finish to check  */}
                          {/* creator hub start to check  */}
                          <div
                            className="mt-3 premium-plus-parent-div"
                            style={{
                              padding: "32px",
                              borderRadius: "16px",
                              backgroundColor: "#eff3f4",
                            }}
                          >
                            <div className="premium-plus-header">
                              Creator Hub
                            </div>
                            <div>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <div>
                                  <span>Write Articles</span>
                                  <svg
                                    width={20}
                                    height={20}
                                    color="rgba(83,100,113,1.00)"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                    className="exclamation r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-10ptun7 r-1janqcz r-14j79pv"
                                  >
                                    <g>
                                      <path d="M13.5 8.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5S11.17 7 12 7s1.5.67 1.5 1.5zM13 17v-5h-2v5h2zm-1 5.25c5.66 0 10.25-4.59 10.25-10.25S17.66 1.75 12 1.75 1.75 6.34 1.75 12 6.34 22.25 12 22.25zM20.25 12c0 4.56-3.69 8.25-8.25 8.25S3.75 16.56 3.75 12 7.44 3.75 12 3.75s8.25 3.69 8.25 8.25z"></path>
                                    </g>
                                  </svg>
                                </div>
                                <div>
                                  {" "}
                                  <svg
                                    color="rgb(0, 186, 124)"
                                    fill="currentColor"
                                    width={20}
                                    height={20}
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                    className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-o6sn0f"
                                  >
                                    <g>
                                      <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                    </g>
                                  </svg>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <div>
                                  <span>Get paid to post</span>
                                  <svg
                                    width={20}
                                    height={20}
                                    color="rgba(83,100,113,1.00)"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                    className="exclamation r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-10ptun7 r-1janqcz r-14j79pv"
                                  >
                                    <g>
                                      <path d="M13.5 8.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5S11.17 7 12 7s1.5.67 1.5 1.5zM13 17v-5h-2v5h2zm-1 5.25c5.66 0 10.25-4.59 10.25-10.25S17.66 1.75 12 1.75 1.75 6.34 1.75 12 6.34 22.25 12 22.25zM20.25 12c0 4.56-3.69 8.25-8.25 8.25S3.75 16.56 3.75 12 7.44 3.75 12 3.75s8.25 3.69 8.25 8.25z"></path>
                                    </g>
                                  </svg>
                                </div>
                                <div>
                                  {" "}
                                  <svg
                                    color="rgb(0, 186, 124)"
                                    fill="currentColor"
                                    width={20}
                                    height={20}
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                    className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-o6sn0f"
                                  >
                                    <g>
                                      <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                    </g>
                                  </svg>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <div>
                                  <span>Creator Subscriptions</span>
                                  <svg
                                    width={20}
                                    height={20}
                                    color="rgba(83,100,113,1.00)"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                    className="exclamation r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-10ptun7 r-1janqcz r-14j79pv"
                                  >
                                    <g>
                                      <path d="M13.5 8.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5S11.17 7 12 7s1.5.67 1.5 1.5zM13 17v-5h-2v5h2zm-1 5.25c5.66 0 10.25-4.59 10.25-10.25S17.66 1.75 12 1.75 1.75 6.34 1.75 12 6.34 22.25 12 22.25zM20.25 12c0 4.56-3.69 8.25-8.25 8.25S3.75 16.56 3.75 12 7.44 3.75 12 3.75s8.25 3.69 8.25 8.25z"></path>
                                    </g>
                                  </svg>
                                </div>
                                <div>
                                  {" "}
                                  <svg
                                    color="rgb(0, 186, 124)"
                                    fill="currentColor"
                                    width={20}
                                    height={20}
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                    className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-o6sn0f"
                                  >
                                    <g>
                                      <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                    </g>
                                  </svg>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <div>
                                  <span>X Pro</span>
                                  <svg
                                    width={20}
                                    height={20}
                                    color="rgba(83,100,113,1.00)"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                    className="exclamation r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-10ptun7 r-1janqcz r-14j79pv"
                                  >
                                    <g>
                                      <path d="M13.5 8.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5S11.17 7 12 7s1.5.67 1.5 1.5zM13 17v-5h-2v5h2zm-1 5.25c5.66 0 10.25-4.59 10.25-10.25S17.66 1.75 12 1.75 1.75 6.34 1.75 12 6.34 22.25 12 22.25zM20.25 12c0 4.56-3.69 8.25-8.25 8.25S3.75 16.56 3.75 12 7.44 3.75 12 3.75s8.25 3.69 8.25 8.25z"></path>
                                    </g>
                                  </svg>
                                </div>
                                <div>
                                  {" "}
                                  <svg
                                    color="rgb(0, 186, 124)"
                                    fill="currentColor"
                                    width={20}
                                    height={20}
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                    className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-o6sn0f"
                                  >
                                    <g>
                                      <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                    </g>
                                  </svg>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <div>
                                  <span>Media Studio</span>
                                  <svg
                                    width={20}
                                    height={20}
                                    color="rgba(83,100,113,1.00)"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                    className="exclamation r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-10ptun7 r-1janqcz r-14j79pv"
                                  >
                                    <g>
                                      <path d="M13.5 8.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5S11.17 7 12 7s1.5.67 1.5 1.5zM13 17v-5h-2v5h2zm-1 5.25c5.66 0 10.25-4.59 10.25-10.25S17.66 1.75 12 1.75 1.75 6.34 1.75 12 6.34 22.25 12 22.25zM20.25 12c0 4.56-3.69 8.25-8.25 8.25S3.75 16.56 3.75 12 7.44 3.75 12 3.75s8.25 3.69 8.25 8.25z"></path>
                                    </g>
                                  </svg>
                                </div>
                                <div>
                                  {" "}
                                  <svg
                                    color="rgb(0, 186, 124)"
                                    fill="currentColor"
                                    width={20}
                                    height={20}
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                    className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-o6sn0f"
                                  >
                                    <g>
                                      <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                    </g>
                                  </svg>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <div>
                                  <span>Analytics</span>
                                  <svg
                                    width={20}
                                    height={20}
                                    color="rgba(83,100,113,1.00)"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                    className="exclamation r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-10ptun7 r-1janqcz r-14j79pv"
                                  >
                                    <g>
                                      <path d="M13.5 8.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5S11.17 7 12 7s1.5.67 1.5 1.5zM13 17v-5h-2v5h2zm-1 5.25c5.66 0 10.25-4.59 10.25-10.25S17.66 1.75 12 1.75 1.75 6.34 1.75 12 6.34 22.25 12 22.25zM20.25 12c0 4.56-3.69 8.25-8.25 8.25S3.75 16.56 3.75 12 7.44 3.75 12 3.75s8.25 3.69 8.25 8.25z"></path>
                                    </g>
                                  </svg>
                                </div>
                                <div>
                                  {" "}
                                  <svg
                                    color="rgb(0, 186, 124)"
                                    fill="currentColor"
                                    width={20}
                                    height={20}
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                    className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-o6sn0f"
                                  >
                                    <g>
                                      <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                    </g>
                                  </svg>
                                </div>
                              </div>
                            </div>
                          </div>
                          {/* creator hub finish to check  */}
                          {/* Verification and security start to check */}
                          <div
                            className="mt-3 premium-plus-parent-div"
                            style={{
                              padding: "32px",
                              borderRadius: "16px",
                              backgroundColor: "#eff3f4",
                            }}
                          >
                            <div className="premium-plus-header">
                              Verification & Security
                            </div>
                            <div>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <div>
                                  <span>Checkmark</span>
                                  <svg
                                    width={20}
                                    height={20}
                                    color="rgba(83,100,113,1.00)"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                    className="exclamation r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-10ptun7 r-1janqcz r-14j79pv"
                                  >
                                    <g>
                                      <path d="M13.5 8.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5S11.17 7 12 7s1.5.67 1.5 1.5zM13 17v-5h-2v5h2zm-1 5.25c5.66 0 10.25-4.59 10.25-10.25S17.66 1.75 12 1.75 1.75 6.34 1.75 12 6.34 22.25 12 22.25zM20.25 12c0 4.56-3.69 8.25-8.25 8.25S3.75 16.56 3.75 12 7.44 3.75 12 3.75s8.25 3.69 8.25 8.25z"></path>
                                    </g>
                                  </svg>
                                </div>
                                <div>
                                  {" "}
                                  <svg
                                    color="rgb(0, 186, 124)"
                                    fill="currentColor"
                                    width={20}
                                    height={20}
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                    className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-o6sn0f"
                                  >
                                    <g>
                                      <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                    </g>
                                  </svg>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <div>
                                  <span>Encrypted direct messages</span>
                                  <svg
                                    width={20}
                                    height={20}
                                    color="rgba(83,100,113,1.00)"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                    className="exclamation r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-10ptun7 r-1janqcz r-14j79pv"
                                  >
                                    <g>
                                      <path d="M13.5 8.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5S11.17 7 12 7s1.5.67 1.5 1.5zM13 17v-5h-2v5h2zm-1 5.25c5.66 0 10.25-4.59 10.25-10.25S17.66 1.75 12 1.75 1.75 6.34 1.75 12 6.34 22.25 12 22.25zM20.25 12c0 4.56-3.69 8.25-8.25 8.25S3.75 16.56 3.75 12 7.44 3.75 12 3.75s8.25 3.69 8.25 8.25z"></path>
                                    </g>
                                  </svg>
                                </div>
                                <div>
                                  {" "}
                                  <svg
                                    color="rgb(0, 186, 124)"
                                    fill="currentColor"
                                    width={20}
                                    height={20}
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                    className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-o6sn0f"
                                  >
                                    <g>
                                      <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                    </g>
                                  </svg>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <div>
                                  <span>Optional ID verification</span>
                                  <svg
                                    width={20}
                                    height={20}
                                    color="rgba(83,100,113,1.00)"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                    className="exclamation r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-10ptun7 r-1janqcz r-14j79pv"
                                  >
                                    <g>
                                      <path d="M13.5 8.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5S11.17 7 12 7s1.5.67 1.5 1.5zM13 17v-5h-2v5h2zm-1 5.25c5.66 0 10.25-4.59 10.25-10.25S17.66 1.75 12 1.75 1.75 6.34 1.75 12 6.34 22.25 12 22.25zM20.25 12c0 4.56-3.69 8.25-8.25 8.25S3.75 16.56 3.75 12 7.44 3.75 12 3.75s8.25 3.69 8.25 8.25z"></path>
                                    </g>
                                  </svg>
                                </div>
                                <div>
                                  {" "}
                                  <svg
                                    color="rgb(0, 186, 124)"
                                    fill="currentColor"
                                    width={20}
                                    height={20}
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                    className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-o6sn0f"
                                  >
                                    <g>
                                      <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                    </g>
                                  </svg>
                                </div>
                              </div>
                            </div>
                          </div>
                          {/* verification and security finish to check */}
                          {/* Customization start to check  */}
                          <div
                            className="mt-3 premium-plus-parent-div"
                            style={{
                              padding: "32px",
                              borderRadius: "16px",
                              backgroundColor: "#eff3f4",
                            }}
                          >
                            <div className="premium-plus-header">
                              Customization
                            </div>
                            <div>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <div>
                                  <span>App icons</span>
                                </div>
                                <div>
                                  {" "}
                                  <svg
                                    color="rgb(0, 186, 124)"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                    className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-o6sn0f"
                                  >
                                    <g>
                                      <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                    </g>
                                  </svg>
                                </div>
                              </div>
                            </div>

                            <div>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <div>
                                  <span>Bookmark folders</span>{" "}
                                </div>
                                <div>
                                  {" "}
                                  <svg
                                    color="rgb(0, 186, 124)"
                                    fill="currentColor"
                                    width={20}
                                    height={20}
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                    className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-o6sn0f"
                                  >
                                    <g>
                                      <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                    </g>
                                  </svg>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <div>
                                  <span>Customize navigation</span>{" "}
                                </div>
                                <div>
                                  {" "}
                                  <svg
                                    color="rgb(0, 186, 124)"
                                    fill="currentColor"
                                    width={20}
                                    height={20}
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                    className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-o6sn0f"
                                  >
                                    <g>
                                      <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                    </g>
                                  </svg>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <div>
                                  <span>Highlights tab</span>{" "}
                                  <svg
                                    width={20}
                                    height={20}
                                    color="rgba(83,100,113,1.00)"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                    className="exclamation r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-10ptun7 r-1janqcz r-14j79pv"
                                  >
                                    <g>
                                      <path d="M13.5 8.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5S11.17 7 12 7s1.5.67 1.5 1.5zM13 17v-5h-2v5h2zm-1 5.25c5.66 0 10.25-4.59 10.25-10.25S17.66 1.75 12 1.75 1.75 6.34 1.75 12 6.34 22.25 12 22.25zM20.25 12c0 4.56-3.69 8.25-8.25 8.25S3.75 16.56 3.75 12 7.44 3.75 12 3.75s8.25 3.69 8.25 8.25z"></path>
                                    </g>
                                  </svg>
                                </div>
                                <div>
                                  {" "}
                                  <svg
                                    color="rgb(0, 186, 124)"
                                    fill="currentColor"
                                    width={20}
                                    height={20}
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                    className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-o6sn0f"
                                  >
                                    <g>
                                      <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                    </g>
                                  </svg>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <div>
                                  <span>Hide your likes</span>{" "}
                                </div>
                                <div>
                                  {" "}
                                  <svg
                                    color="rgb(0, 186, 124)"
                                    fill="currentColor"
                                    width={20}
                                    height={20}
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                    className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-o6sn0f"
                                  >
                                    <g>
                                      <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                    </g>
                                  </svg>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <div>
                                  <span>Hide your checkmark</span>{" "}
                                </div>
                                <div>
                                  {" "}
                                  <svg
                                    color="rgb(0, 186, 124)"
                                    fill="currentColor"
                                    width={20}
                                    height={20}
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                    className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-o6sn0f"
                                  >
                                    <g>
                                      <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                    </g>
                                  </svg>
                                </div>
                              </div>
                            </div>
                            {/* reader check  */}
                            <div>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <div>Hide your subscriptions</div>
                                <div>
                                  {" "}
                                  <svg
                                    color="rgb(0, 186, 124)"
                                    fill="currentColor"
                                    width={20}
                                    height={20}
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                    className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-o6sn0f"
                                  >
                                    <g>
                                      <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                    </g>
                                  </svg>
                                </div>
                              </div>
                            </div>
                            {/* reader check  */}
                          </div>
                          {/* Customization finish to check  */}
                        </div>
                        {/* third div premium plus plan finish to check  */}
                      </Slider>
                    </div>
                  </div>
                </Modal.Body>

                {individualSubOptionTab === 2 ? (
                  <div
                    className="mt-3"
                    style={{
                      position: "relative",
                      boxShadow:
                        "0 0 15px rgba(101, 119,134,0.2), 0 0 3px 1px rgba(101,119,134,0.15)",
                      minHeight: setPhoneVerifiedErrorMessage
                        ? "305px"
                        : "260px",

                      borderBottomLeftRadius: "16px",
                      borderBottomRightRadius: "16px",
                      backgroundColor: "#fdfdfe",

                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        display: "flex",
                        flexDirection: "row",
                        gap: "2.5%",
                        padding: "16px",
                        maxHeight: "120px",
                        width: "87%",
                      }}
                    >
                      <div
                        onClick={() => {
                          setindividualSubOptionPremiumPlusAnnualTab(true);
                          setindividualSubOptionPremiumPlusMonthlyTab(false);
                        }}
                        className="individual-subscription-box"
                        style={{
                          flex: 1,
                          backgroundColor: "white",
                          maxHeight: "96px",
                          padding: "12px",
                          cursor: "pointer",
                          borderWidth: "1px",
                          borderRadius: "16px",
                          boxShadow:
                            "0 0 15px rgba(101, 119,134,0.2), 0 0 3px 1px rgba(101,119,134,0.15)",
                          border: individualSubOptionPremiumPlusAnnualTab
                            ? "2px solid #339bf0"
                            : "2px solid transparent",
                          transition: "transform 0.3s ease",
                        }}
                      >
                        <span
                          style={{
                            color: "#697884",
                            fontSize: "14px",
                            fontWeight: "400",
                            lineHeight: "16px",
                          }}
                        >
                          Annual Plan
                          <span
                            style={{
                              fontSize: "11px",
                              backgroundColor: "#dcf8eb",
                              borderRadius: "9999px",
                              color: "black",
                              position: "relative",
                              bottom: "1px",
                              fontWeight: "700",
                              lineHeight: "12px",
                              padding: "4px",
                              height: "20px",
                            }}
                          >
                            <span>Save 12%</span>
                          </span>
                        </span>

                        <span
                          style={{
                            color: "rgb(15, 20, 25)",
                            fontSize: "17px",
                            fontWeight: "700",
                            lineHeight: "20px",
                            display: "block",
                          }}
                        >
                          €199.92 / year
                        </span>
                        <div
                          style={{
                            color: "rgb(83, 100, 113)",
                            fontSize: "13px",
                            fontWeight: "400",
                            lineHeight: "16px",
                          }}
                        >
                          €199.92 per year billed annually
                        </div>
                      </div>
                      <div
                        className="organization-subscription-box"
                        onClick={() => {
                          setindividualSubOptionPremiumPlusMonthlyTab(true);
                          setindividualSubOptionPremiumPlusAnnualTab(false);
                        }}
                        style={{
                          flex: 1,
                          backgroundColor: "white",
                          maxHeight: "96px",
                          padding: "12px",
                          cursor: "pointer",
                          borderWidth: "1px",
                          borderRadius: "16px",
                          boxShadow:
                            "0 0 15px rgba(101, 119,134,0.2), 0 0 3px 1px rgba(101,119,134,0.15)",
                          border: individualSubOptionPremiumPlusMonthlyTab
                            ? "2px solid #339bf0"
                            : "2px solid transparent",
                          transition: "transform 0.3s ease",
                        }}
                      >
                        <span
                          style={{
                            color: "#697884",
                            fontSize: "14px",
                            fontWeight: "400",
                            lineHeight: "16px",
                          }}
                        >
                          Monthly Plan{" "}
                        </span>

                        <div
                          style={{
                            color: "rgb(15, 20, 25)",
                            fontSize: "17px",
                            fontWeight: "700",
                            lineHeight: "20px",
                          }}
                        >
                          €19.04 / month
                          <div
                            style={{
                              color: "rgb(83, 100, 113)",
                              fontSize: "13px",
                              fontWeight: "400",
                              lineHeight: "16px",
                            }}
                          >
                            €228.48 per year billed monthly
                          </div>
                        </div>
                      </div>
                    </div>

                    <div
                      style={{
                        width: "81.5%",
                        position: "relative",
                        top: "115px",
                        margin: "0 auto",
                      }}
                    >
                      {setPhoneVerifiedErrorMessage ? (
                        <div
                          style={{
                            borderRadius: "8px",
                            color: "rgb(15, 20, 25)",
                            lineHeight: "16px",
                            fontSize: "14px",
                            fontWeight: "400",
                            backgroundColor: "#fef1f1",
                            minHeight: "40px",
                            display: "flex",
                            justifyContent: "left",
                            alignItems: "center",
                          }}
                        >
                          <span
                            style={{
                              position: "relative",
                              left: "15px",
                            }}
                          >
                            Something went wrong. Please try again.
                          </span>
                        </div>
                      ) : null}
                      <Button
                        onClick={() => handlePhoneVerifiedCheck()}
                        className={`login-button next-btn ${
                          setPhoneVerifiedErrorMessage ? "mt-2" : "mt-4"
                        }`}
                        variant="dark"
                        style={{
                          width: "100%",
                          height: "36px",
                          color: "white",
                          backgroundColor: "#0f141a",
                        }}
                      >
                        Subscribe & Pay
                      </Button>
                    </div>
                    <div
                      className="mt-1"
                      style={{
                        width: "81.5%",
                        margin: "0 auto",
                        fontSize: "13px",
                        lineHeight: "16px",
                        fontWeight: "400",
                        border: "1px solid black",
                        borderRadius: "8px",
                        padding: "6px",
                        position: "relative",
                        top: "120px",
                      }}
                    >
                      {`By subscribing, you agree to our `}
                      <span
                        className="sub-modal-text-footer"
                        style={{
                          color: "rgb(29, 155, 240)",
                        }}
                      >
                        Purchaser Terms of Service
                      </span>
                      {`. Subscriptions auto-renew until canceled, as described in the Terms.`}{" "}
                      <span
                        className="sub-modal-text-footer"
                        style={{
                          color: "rgb(29, 155, 240)",
                        }}
                      >
                        Cancel anytime
                      </span>
                      {`. Cancel at least 24 hours prior to renewal to avoid additional charges. A verified phone number is required to subscribe. If you've subscribed on another platform, manage your subscription through that platform.`}
                    </div>
                  </div>
                ) : individualSubOptionTab === 1 ? (
                  <div
                    className="mt-3"
                    style={{
                      position: "relative",
                      boxShadow:
                        "0 0 15px rgba(101, 119,134,0.2), 0 0 3px 1px rgba(101,119,134,0.15)",
                      minHeight: setPhoneVerifiedErrorMessage
                        ? "305px"
                        : "260px",
                      borderBottomLeftRadius: "16px",
                      borderBottomRightRadius: "16px",
                      backgroundColor: "#fdfdfe",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        display: "flex",
                        flexDirection: "row",
                        gap: "2.5%",
                        padding: "16px",
                        maxHeight: "120px",
                        width: "87%",
                      }}
                    >
                      <div
                        onClick={() => {
                          setindividualSubOptionPremiumPlusAnnualTab(true);
                          setindividualSubOptionPremiumPlusMonthlyTab(false);
                        }}
                        className="individual-subscription-box"
                        style={{
                          flex: 1,
                          backgroundColor: "white",
                          maxHeight: "96px",
                          padding: "12px",
                          cursor: "pointer",
                          borderWidth: "1px",
                          borderRadius: "16px",
                          boxShadow:
                            "0 0 15px rgba(101, 119,134,0.2), 0 0 3px 1px rgba(101,119,134,0.15)",
                          border: individualSubOptionPremiumPlusAnnualTab
                            ? "2px solid #339bf0"
                            : "2px solid transparent",
                          transition: "transform 0.3s ease",
                        }}
                      >
                        <span
                          style={{
                            color: "#697884",
                            fontSize: "14px",
                            fontWeight: "400",
                            lineHeight: "16px",
                          }}
                        >
                          Annual Plan{" "}
                          <span
                            style={{
                              fontSize: "11px",
                              backgroundColor: "#dcf8eb",
                              borderRadius: "9999px",
                              color: "black",
                              position: "relative",
                              bottom: "1px",
                              fontWeight: "700",
                              lineHeight: "12px",
                              padding: "4px",
                              height: "20px",
                            }}
                          >
                            <span>Save 12%</span>
                          </span>
                        </span>

                        <span
                          style={{
                            color: "rgb(15, 20, 25)",
                            fontSize: "17px",
                            fontWeight: "700",
                            lineHeight: "20px",
                            display: "block",
                          }}
                        >
                          €99.96 / year
                        </span>
                        <div
                          style={{
                            color: "rgb(83, 100, 113)",
                            fontSize: "13px",
                            fontWeight: "400",
                            lineHeight: "16px",
                          }}
                        >
                          €99.96 per year billed annually
                        </div>
                      </div>
                      <div
                        className="organization-subscription-box"
                        onClick={() => {
                          setindividualSubOptionPremiumPlusMonthlyTab(true);
                          setindividualSubOptionPremiumPlusAnnualTab(false);
                        }}
                        style={{
                          flex: 1,
                          backgroundColor: "white",
                          maxHeight: "96px",
                          padding: "12px",
                          cursor: "pointer",
                          borderWidth: "1px",
                          borderRadius: "16px",
                          boxShadow:
                            "0 0 15px rgba(101, 119,134,0.2), 0 0 3px 1px rgba(101,119,134,0.15)",
                          border: individualSubOptionPremiumPlusMonthlyTab
                            ? "2px solid #339bf0"
                            : "2px solid transparent",
                          transition: "transform 0.3s ease",
                        }}
                      >
                        <span
                          style={{
                            color: "#697884",
                            fontSize: "14px",
                            fontWeight: "400",
                            lineHeight: "16px",
                          }}
                        >
                          Monthly Plan{" "}
                        </span>

                        <div
                          style={{
                            color: "rgb(15, 20, 25)",
                            fontSize: "17px",
                            fontWeight: "700",
                            lineHeight: "20px",
                          }}
                        >
                          €9.52 / month
                          <div
                            style={{
                              color: "rgb(83, 100, 113)",
                              fontSize: "13px",
                              fontWeight: "400",
                              lineHeight: "16px",
                            }}
                          >
                            €114.28 per year billed monthly
                          </div>
                        </div>
                      </div>
                    </div>

                    <div
                      style={{
                        width: "81.5%",

                        position: "relative",
                        top: "115px",
                        margin: "0 auto",
                      }}
                    >
                      {" "}
                      {setPhoneVerifiedErrorMessage ? (
                        <div
                          style={{
                            borderRadius: "8px",
                            color: "rgb(15, 20, 25)",
                            lineHeight: "16px",
                            fontSize: "14px",
                            fontWeight: "400",
                            backgroundColor: "#fef1f1",
                            minHeight: "40px",
                            display: "flex",
                            justifyContent: "left",
                            alignItems: "center",
                          }}
                        >
                          <span
                            style={{
                              position: "relative",
                              left: "15px",
                            }}
                          >
                            Something went wrong. Please try again.
                          </span>
                        </div>
                      ) : null}
                      <Button
                        onClick={() => handlePhoneVerifiedCheck()}
                        className={`login-button next-btn ${
                          setPhoneVerifiedErrorMessage ? "mt-2" : "mt-4"
                        }`}
                        variant="dark"
                        style={{
                          width: "100%",
                          height: "36px",
                          color: "white",
                          backgroundColor: "#0f141a",
                        }}
                      >
                        Subscribe & Pay
                      </Button>
                    </div>
                    <div
                      className="mt-1"
                      style={{
                        width: "81.5%",

                        margin: "0 auto",
                        fontSize: "13px",
                        lineHeight: "16px",
                        fontWeight: "400",
                        border: "1px solid black",
                        borderRadius: "8px",
                        padding: "6px",
                        position: "relative",
                        top: "120px",
                      }}
                    >
                      {`By subscribing, you agree to our `}
                      <span
                        className="sub-modal-text-footer"
                        style={{
                          color: "rgb(29, 155, 240)",
                        }}
                      >
                        Purchaser Terms of Service
                      </span>
                      {`. Subscriptions auto-renew until canceled, as described in the Terms.`}{" "}
                      <span
                        className="sub-modal-text-footer"
                        style={{
                          color: "rgb(29, 155, 240)",
                        }}
                      >
                        Cancel anytime
                      </span>
                      {`. Cancel at least 24 hours prior to renewal to avoid additional charges. A verified phone number is required to subscribe. If you've subscribed on another platform, manage your subscription through that platform.`}
                    </div>
                  </div>
                ) : individualSubOptionTab === 0 ? (
                  <div
                    className="mt-3"
                    style={{
                      position: "relative",
                      boxShadow:
                        "0 0 15px rgba(101, 119,134,0.2), 0 0 3px 1px rgba(101,119,134,0.15)",
                      minHeight: setPhoneVerifiedErrorMessage
                        ? "305px"
                        : "260px",
                      borderBottomLeftRadius: "16px",
                      borderBottomRightRadius: "16px",
                      backgroundColor: "#fdfdfe",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        display: "flex",
                        flexDirection: "row",
                        gap: "2.5%",
                        padding: "16px",
                        maxHeight: "120px",
                        width: "87%",
                      }}
                    >
                      <div
                        onClick={() => {
                          setindividualSubOptionPremiumPlusAnnualTab(true);
                          setindividualSubOptionPremiumPlusMonthlyTab(false);
                        }}
                        className="individual-subscription-box"
                        style={{
                          flex: 1,
                          backgroundColor: "white",
                          maxHeight: "96px",
                          padding: "12px",
                          cursor: "pointer",
                          borderWidth: "1px",
                          borderRadius: "16px",
                          boxShadow:
                            "0 0 15px rgba(101, 119,134,0.2), 0 0 3px 1px rgba(101,119,134,0.15)",
                          border: individualSubOptionPremiumPlusAnnualTab
                            ? "2px solid #339bf0"
                            : "2px solid transparent",
                          transition: "transform 0.3s ease",
                        }}
                      >
                        <span
                          style={{
                            color: "#697884",
                            fontSize: "14px",
                            fontWeight: "400",
                            lineHeight: "16px",
                          }}
                        >
                          Annual Plan{" "}
                          <span
                            style={{
                              fontSize: "11px",
                              backgroundColor: "#dcf8eb",
                              borderRadius: "9999px",
                              color: "black",
                              position: "relative",
                              bottom: "1px",
                              fontWeight: "700",
                              lineHeight: "12px",
                              padding: "4px",
                              height: "20px",
                            }}
                          >
                            <span>SAVE 11%</span>
                          </span>
                        </span>

                        <span
                          style={{
                            display: "block",
                            color: "rgb(15, 20, 25)",
                            fontSize: "17px",
                            fontWeight: "700",
                            lineHeight: "20px",
                          }}
                        >
                          €38.08 / year
                        </span>
                        <div
                          style={{
                            color: "rgb(83, 100, 113)",
                            fontSize: "13px",
                            fontWeight: "400",
                            lineHeight: "16px",
                          }}
                        >
                          €38.08 per year billed annually
                        </div>
                      </div>
                      <div
                        className="organization-subscription-box"
                        onClick={() => {
                          setindividualSubOptionPremiumPlusMonthlyTab(true);
                          setindividualSubOptionPremiumPlusAnnualTab(false);
                        }}
                        style={{
                          flex: 1,
                          backgroundColor: "white",
                          maxHeight: "96px",
                          padding: "12px",
                          cursor: "pointer",
                          borderWidth: "1px",
                          borderRadius: "16px",
                          boxShadow:
                            "0 0 15px rgba(101, 119,134,0.2), 0 0 3px 1px rgba(101,119,134,0.15)",
                          border: individualSubOptionPremiumPlusMonthlyTab
                            ? "2px solid #339bf0"
                            : "2px solid transparent",
                          transition: "transform 0.3s ease",
                        }}
                      >
                        <span
                          style={{
                            color: "#697884",
                            fontSize: "14px",
                            fontWeight: "400",
                            lineHeight: "16px",
                          }}
                        >
                          Monthly Plan{" "}
                        </span>

                        <div
                          style={{
                            color: "rgb(15, 20, 25)",
                            fontSize: "17px",
                            fontWeight: "700",
                            lineHeight: "20px",
                          }}
                        >
                          €3.57 / month
                          <div
                            style={{
                              color: "rgb(83, 100, 113)",
                              fontSize: "13px",
                              fontWeight: "400",
                              lineHeight: "16px",
                            }}
                          >
                            €42.84 per year billed monthly
                          </div>
                        </div>
                      </div>
                    </div>

                    <div
                      style={{
                        width: "81.5%",
                        position: "relative",
                        top: "115px",
                        margin: "0 auto",
                      }}
                    >
                      {" "}
                      {setPhoneVerifiedErrorMessage ? (
                        <div
                          style={{
                            borderRadius: "8px",
                            color: "rgb(15, 20, 25)",
                            lineHeight: "16px",
                            fontSize: "14px",
                            fontWeight: "400",
                            backgroundColor: "#fef1f1",
                            minHeight: "40px",
                            display: "flex",
                            justifyContent: "left",
                            alignItems: "center",
                          }}
                        >
                          <span
                            style={{
                              position: "relative",
                              left: "15px",
                            }}
                          >
                            Something went wrong. Please try again.
                          </span>
                        </div>
                      ) : null}
                      <Button
                        onClick={() => handlePhoneVerifiedCheck()}
                        className={`login-button next-btn ${
                          setPhoneVerifiedErrorMessage ? "mt-2" : "mt-4"
                        }`}
                        variant="dark"
                        style={{
                          width: "100%",
                          height: "36px",
                          color: "white",
                          backgroundColor: "#0f141a",
                        }}
                      >
                        Subscribe & Pay
                      </Button>
                    </div>
                    <div
                      className="mt-1"
                      style={{
                        width: "81.5%",
                        margin: "0 auto",
                        fontSize: "13px",
                        lineHeight: "16px",
                        fontWeight: "400",
                        border: "1px solid black",
                        borderRadius: "8px",
                        padding: "6px",
                        position: "relative",
                        top: "120px",
                      }}
                    >
                      {`By subscribing, you agree to our `}
                      <span
                        className="sub-modal-text-footer"
                        style={{
                          color: "rgb(29, 155, 240)",
                        }}
                      >
                        Purchaser Terms of Service
                      </span>
                      {`. Subscriptions auto-renew until canceled, as described in the Terms.`}{" "}
                      <span
                        className="sub-modal-text-footer"
                        style={{
                          color: "rgb(29, 155, 240)",
                        }}
                      >
                        Cancel anytime
                      </span>
                      {`. Cancel at least 24 hours prior to renewal to avoid additional charges. A verified phone number is required to subscribe. If you've subscribed on another platform, manage your subscription through that platform.`}
                    </div>
                  </div>
                ) : null}
              </>
            ) : tabIndex === 1 && isOrganizationSubscriptionClicked ? (
              <>
                {" "}
                <>
                  <Modal.Body
                    className="scrollbar-add"
                    style={{
                      height: "100%",
                      overflowY: "auto",
                    }}
                  >
                    <div
                      onClick={handleCloseSubscriptionModal}
                      style={{
                        borderRadius: "50%",
                        cursor: "pointer",
                        position: "relative",
                        // right: "30px",
                        width: "100%",
                      }}
                    >
                      <div
                        className="close-button"
                        style={{
                          display: " flex",
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "center",

                          width: "36px",
                          height: "36px",
                          borderRadius: "50%",
                        }}
                      >
                        {/* close signin modal icon start to check  */}
                        <svg
                          style={{
                            border: "none",
                            fontSize: "15px",
                            margin: "5px",
                          }}
                          onClick={handleCloseSubscriptionModal}
                          width={20}
                          height={20}
                          color="rgb(15,20,25)"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                          className=" r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-z80fyv r-19wmn03"
                        >
                          <g>
                            <path d="M10.59 12L4.54 5.96l1.42-1.42L12 10.59l6.04-6.05 1.42 1.42L13.41 12l6.05 6.04-1.42 1.42L12 13.41l-6.04 6.05-1.42-1.42L10.59 12z"></path>
                          </g>
                        </svg>{" "}
                        {/* close signin modal icon finish to check  */}
                      </div>{" "}
                    </div>{" "}
                    <div
                      style={{
                        fontWeight: "700",
                        fontSize: "20px",
                        lineHeight: "24px",
                        position: "relative",
                        bottom: "27px",
                      }}
                    >
                      Verified Organizations
                    </div>
                    <div
                      className=""
                      style={{
                        backgroundColor: "black",
                        borderRadius: "9999px",
                        display: "flex",
                        alignItems: "center",
                        position: "relative",
                        bottom: "15px",
                      }}
                    >
                      <div
                        style={{
                          width: "184px",
                          height: "40px",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <button
                          onClick={() => {
                            basicPlanClick();
                          }}
                          style={tabStyleOrganizationBasicStyle}
                        >
                          <span
                            style={{
                              padding: "6px",
                            }}
                          >
                            Basic
                          </span>
                        </button>
                        <button
                          onClick={() => {
                            fullAccessPlanClick();
                          }}
                          style={tabStyleOrganizationFullAccessStyle}
                        >
                          <span style={{}}>Full Access</span>
                        </button>
                      </div>
                    </div>
                    {subTabIndexFromOrganizatonSelect === 1 &&
                    tabStyleOrganizationBasicPlan ? (
                      <>
                        <div
                          style={{
                            width: "81.5%",
                            backgroundColor: "rgba(247, 249, 249, 1.00)",
                            borderRadius: "16px",
                            padding: "16px",
                          }}
                        >
                          <div
                            style={{
                              color: "rgb(83, 100, 113)",
                              lineHeight: "28px",
                              fontWeight: "700",
                              fontSize: "23px",
                            }}
                          >
                            Basic
                          </div>
                          <div
                            style={{
                              fontSize: "34px",
                              lineHeight: "40px",
                              fontWeight: "700",
                            }}
                          >
                            Find your customers and grow your business
                          </div>
                          <div
                            className="basic-plan-parent-div"
                            style={{
                              lineHeight: "20px",
                              fontWeight: "500",
                              fontSize: "15px",
                            }}
                          >
                            <div>
                              Try advertising and grow your business with
                              priority support and ads credits.
                            </div>
                            <div>
                              <div
                                style={{
                                  display: "flex",
                                }}
                              >
                                <svg
                                  width={`${1.25}em`}
                                  height={`${1.25}em`}
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr"
                                >
                                  <g>
                                    <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                  </g>
                                </svg>
                                <span>Gold checkmark</span>
                              </div>
                            </div>
                            <div>
                              {" "}
                              <div
                                style={{
                                  display: "flex",
                                }}
                              >
                                <svg
                                  width={`${1.25}em`}
                                  height={`${1.25}em`}
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr"
                                >
                                  <g>
                                    <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                  </g>
                                </svg>
                                <span>Priority support</span>
                              </div>{" "}
                            </div>
                            <div>
                              {" "}
                              <div
                                style={{
                                  display: "flex",
                                }}
                              >
                                <svg
                                  width={`${1.25}em`}
                                  height={`${1.25}em`}
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr"
                                >
                                  <g>
                                    <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                  </g>
                                </svg>
                                <span>Premium+</span>
                              </div>
                            </div>
                            <div>
                              {" "}
                              <div
                                style={{
                                  display: "flex",
                                }}
                              >
                                <svg
                                  width={`${1.25}em`}
                                  height={`${1.25}em`}
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr"
                                >
                                  <g>
                                    <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                  </g>
                                </svg>
                                <span>Hiring</span>
                              </div>
                            </div>
                            <div>
                              {" "}
                              <div
                                style={{
                                  display: "flex",
                                }}
                              >
                                <svg
                                  color="rgba(83, 100, 113, 1.00)"
                                  fill="currentColor"
                                  width={`${1.25}em`}
                                  height={`${1.25}em`}
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-14j79pv"
                                >
                                  <g>
                                    <path d="M14 13c0 .74-.4 1.39-1 1.73V17h-2v-2.27c-.59-.34-1-.99-1-1.73 0-1.1.9-2 2-2 1.11 0 2 .9 2 2zm3.5-6H17v-.25c0-2.76-2.24-5-5-5s-5 2.24-5 5V7h-.5C5.12 7 4 8.12 4 9.5v9C4 19.88 5.12 21 6.5 21h11c1.38 0 2.5-1.12 2.5-2.5v-9C20 8.12 18.88 7 17.5 7zM9 6.75c0-1.66 1.34-3 3-3s3 1.34 3 3V7H9v-.25zm9 11.75c0 .28-.22.5-.5.5h-11c-.28 0-.5-.22-.5-.5v-9c0-.28.22-.5.5-.5h11c.28 0 .5.22.5.5v9z"></path>
                                  </g>
                                </svg>
                                <span>2x boost</span>
                              </div>
                            </div>
                            <div>
                              {" "}
                              <div
                                style={{
                                  display: "flex",
                                }}
                              >
                                <svg
                                  color="rgba(83, 100, 113, 1.00)"
                                  fill="currentColor"
                                  width={`${1.25}em`}
                                  height={`${1.25}em`}
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-14j79pv"
                                >
                                  <g>
                                    <path d="M14 13c0 .74-.4 1.39-1 1.73V17h-2v-2.27c-.59-.34-1-.99-1-1.73 0-1.1.9-2 2-2 1.11 0 2 .9 2 2zm3.5-6H17v-.25c0-2.76-2.24-5-5-5s-5 2.24-5 5V7h-.5C5.12 7 4 8.12 4 9.5v9C4 19.88 5.12 21 6.5 21h11c1.38 0 2.5-1.12 2.5-2.5v-9C20 8.12 18.88 7 17.5 7zM9 6.75c0-1.66 1.34-3 3-3s3 1.34 3 3V7H9v-.25zm9 11.75c0 .28-.22.5-.5.5h-11c-.28 0-.5-.22-.5-.5v-9c0-.28.22-.5.5-.5h11c.28 0 .5.22.5.5v9z"></path>
                                  </g>
                                </svg>
                                <span>Affiliations</span>
                              </div>
                            </div>
                          </div>
                          <div
                            style={{
                              fontSize: "15px",
                              fontWeight: "400",
                              lineHeight: "20px",
                            }}
                            className="mt-1"
                          >
                            + For a limited time, advertising credit to spend on
                            your organization{" "}
                            <span
                              style={{
                                lineHeight: "20px",
                                fontSize: "15px",
                                fontWeight: "700",
                                textDecoration: "underline",
                              }}
                            >
                              {basicAnnualTabStyle
                                ? "every year"
                                : "every month"}
                            </span>{" "}
                            with dedicated support.{" "}
                            <span
                              className="learn-more-basic-plan"
                              style={{
                                cursor: "pointer",
                                color: "rgb(29, 155, 240)",
                              }}
                            >
                              Learn more
                            </span>
                          </div>
                        </div>
                        <div
                          style={{
                            width: "81.5%",
                            // position: "absolute",
                            // bottom: "0px",
                          }}
                        >
                          <div
                            className="mt-3"
                            style={{
                              display: "flex",
                              gap: "2.5%",
                            }}
                          >
                            {/* annual plan start to check  */}
                            <div
                              onClick={() => {
                                setbasicAnnualTabStyle(true);
                                setbasicMonthlyTabStyle(false);
                              }}
                              style={
                                ({ activeIndividualOptionTabStyle },
                                {
                                  flex: 1,
                                  backgroundColor: "white",
                                  maxHeight: "72px",
                                  padding: "12px",
                                  cursor: "pointer",
                                  borderWidth: "1px",
                                  borderRadius: "16px",
                                  boxShadow:
                                    "0 0 15px rgba(101, 119,134,0.2), 0 0 3px 1px rgba(101,119,134,0.15)",
                                  border: basicAnnualTabStyle
                                    ? "2px solid #339bf0"
                                    : "2px solid transparent",
                                  transition: "transform 0.3s ease",
                                })
                              }
                              className="individual-subscription-box"
                            >
                              <div>
                                <div
                                  style={{
                                    color: "rgb(15, 20, 25)",
                                    fontSize: "18px",
                                    fontWeight: "600",
                                    display: " flex",
                                  }}
                                >
                                  {" "}
                                  <div>{yearlyFee} / year</div>
                                  <div
                                    style={{
                                      fontSize: "11px",
                                      backgroundColor: "#dcf8eb",
                                      borderRadius: "9999px",
                                      height: "20px",
                                      display: "flex",
                                      justifyContent: "center",
                                      alignItems: "center",
                                      position: "relative",
                                      top: "5px",
                                      fontWeight: "700",
                                      color: "rgb(0, 67, 41)",
                                      lineHeight: "12px",
                                    }}
                                  >
                                    <span
                                      style={{
                                        padding: "4px 4px",
                                      }}
                                    >
                                      Save 16%
                                    </span>
                                  </div>
                                </div>
                                <div
                                  style={{
                                    color: "#697884",
                                    fontSize: "14px",
                                    fontWeight: "400",
                                  }}
                                >
                                  {" "}
                                  Annual plan
                                </div>
                              </div>
                            </div>
                            {/* annual plan finish to check  */}
                            {/* monthly plan start to check  */}
                            <div
                              onClick={() => {
                                setbasicMonthlyTabStyle(true);
                                setbasicAnnualTabStyle(false);
                              }}
                              style={
                                ({ activeOrganizationOptionTabStyle },
                                {
                                  flex: 1,
                                  backgroundColor: "white",
                                  maxHeight: "72px",
                                  padding: "12px",
                                  cursor: "pointer",
                                  borderWidth: "1px",
                                  borderRadius: "16px",
                                  boxShadow:
                                    "0 0 15px rgba(101, 119,134,0.2), 0 0 3px 1px rgba(101,119,134,0.15)",
                                  border: basicMonthlyTabStyle
                                    ? "2px solid #339bf0"
                                    : "2px solid transparent",
                                  transition: "transform 0.3s ease",
                                })
                              }
                              className="organization-subscription-box"
                            >
                              <div
                                style={{
                                  position: "relative",
                                }}
                              >
                                <div
                                  style={{
                                    color: "rgb(15, 20, 25)",
                                    fontSize: "18px",
                                    fontWeight: "600",
                                  }}
                                >
                                  {monthyleFee} / month
                                </div>{" "}
                                <div
                                  style={{
                                    color: "#697884",
                                    fontSize: "14px",
                                    fontWeight: "400",
                                  }}
                                >
                                  Monthly plan
                                </div>
                              </div>
                            </div>
                            {/* monthly plan finish to check  */}
                          </div>
                          <div
                            className="mt-3"
                            style={{
                              color: "rgb(83, 100, 113)",
                              fontSize: "11px",
                              lineHeight: "12px",
                              fontWeight: "400",
                              height: "20px",
                            }}
                          >
                            {" "}
                            <span>
                              Basic is{" "}
                              {basicAnnualTabStyle
                                ? yearlyFee
                                : monthyleFee
                                ? monthyleFee
                                : null}
                              /
                              {basicAnnualTabStyle
                                ? "year"
                                : monthyleFee
                                ? "month"
                                : null}{" "}
                              (tax inclusive).{" "}
                            </span>
                            <span
                              className="learn-more-basic-plan"
                              style={{
                                color: "rgb(29, 155, 240)",
                                cursor: "pointer",
                              }}
                            >
                              Learn more
                            </span>
                          </div>
                          <Button
                            onClick={() =>
                              handleCheckoutStripeApi(
                                basicAnnualTabStyle
                                  ? yearlyFee
                                  : basicMonthlyTabStyle
                                  ? monthyleFee
                                  : null,
                                basicAnnualTabStyle ? "per year" : "per month"
                              )
                            }
                            className="mt-4 subscribe-btn-basic-plan"
                            style={{
                              backgroundColor: "#0f1518",
                              color: "white",
                              height: "34px",
                              width: "100%",
                              borderRadius: "9999px",
                              border: " none",
                            }}
                            variant="info"
                          >
                            <div
                              style={{
                                fontSize: "15px",
                                lineHeight: "20px",
                                fontWeight: "700",
                              }}
                            >
                              <span>Subscribe</span>
                              <span
                                style={{
                                  marginLeft: "5px",
                                }}
                              >
                                &middot;
                              </span>
                              <span>
                                {" "}
                                {basicAnnualTabStyle
                                  ? `${yearlyFee} per year`
                                  : `${monthyleFee} per month`}{" "}
                              </span>
                            </div>
                          </Button>
                          <div
                            className="mt-3"
                            style={{
                              width: "100%",
                              color: "rgb(83, 100, 113)",
                              fontSize: "11px",
                              fontWeight: "400",
                              lineHeight: "12px",
                              height: "40px",
                            }}
                          >
                            By clicking Subscribe, you agree to our{" "}
                            <span
                              className="text-decoration-thickness-2px"
                              style={{
                                cursor: "pointer",
                                color: "rgb(15, 20, 25)",
                                textDecoration: "underline",
                                textDecorationColor: "rgb(15, 20, 25)",
                              }}
                            >
                              Purchaser Terms of Service.
                            </span>
                            Subscriptions auto-renew until canceled. All
                            accounts that sign up must pass manual approval.
                          </div>
                        </div>{" "}
                      </>
                    ) : subTabIndexFromOrganizatonSelect === 2 &&
                      tabStyleOrganizationFullAccessPlan ? (
                      <>
                        <div
                          style={{
                            width: "81.5%",
                            backgroundColor: "rgba(247, 249, 249, 1.00)",
                            borderRadius: "16px",
                            padding: "16px",
                          }}
                        >
                          <div
                            style={{
                              color: "rgb(83, 100, 113)",
                              lineHeight: "28px",
                              fontWeight: "700",
                              fontSize: "23px",
                            }}
                          >
                            Full Access
                          </div>
                          <div
                            style={{
                              fontSize: "34px",
                              lineHeight: "40px",
                              fontWeight: "700",
                            }}
                          >
                            Find your customers and grow your business
                          </div>
                          <div
                            className="basic-plan-parent-div"
                            style={{
                              lineHeight: "20px",
                              fontWeight: "500",
                              fontSize: "15px",
                            }}
                          >
                            <div>
                              Reach more customers organically, affiliate your
                              network, or find your next hire.
                            </div>
                            <div>
                              <div
                                style={{
                                  display: "flex",
                                }}
                              >
                                <svg
                                  width={`${1.25}em`}
                                  height={`${1.25}em`}
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr"
                                >
                                  <g>
                                    <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                  </g>
                                </svg>
                                <span>Gold checkmark</span>
                              </div>
                            </div>
                            <div>
                              {" "}
                              <div
                                style={{
                                  display: "flex",
                                }}
                              >
                                <svg
                                  width={`${1.25}em`}
                                  height={`${1.25}em`}
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr"
                                >
                                  <g>
                                    <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                  </g>
                                </svg>
                                <span>Priority support</span>
                              </div>{" "}
                            </div>
                            <div>
                              {" "}
                              <div
                                style={{
                                  display: "flex",
                                }}
                              >
                                <svg
                                  width={`${1.25}em`}
                                  height={`${1.25}em`}
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr"
                                >
                                  <g>
                                    <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                  </g>
                                </svg>
                                <span>Premium+</span>
                              </div>
                            </div>
                            <div>
                              {" "}
                              <div
                                style={{
                                  display: "flex",
                                }}
                              >
                                <svg
                                  width={`${1.25}em`}
                                  height={`${1.25}em`}
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr"
                                >
                                  <g>
                                    <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                  </g>
                                </svg>
                                <span>Hiring</span>
                              </div>
                            </div>
                            <div>
                              {" "}
                              <div
                                style={{
                                  display: "flex",
                                }}
                              >
                                <svg
                                  width={`${1.25}em`}
                                  height={`${1.25}em`}
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr"
                                >
                                  <g>
                                    <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                  </g>
                                </svg>
                                <span>2x boost</span>
                              </div>
                            </div>
                            <div>
                              {" "}
                              <div
                                style={{
                                  display: "flex",
                                }}
                              >
                                <svg
                                  width={`${1.25}em`}
                                  height={`${1.25}em`}
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr"
                                >
                                  <g>
                                    <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                                  </g>
                                </svg>
                                <span>Affiliations</span>
                              </div>
                            </div>
                          </div>
                          <div
                            style={{
                              fontSize: "15px",
                              fontWeight: "400",
                              lineHeight: "20px",
                            }}
                            className="mt-1"
                          >
                            + For a limited time, advertising credit to spend on
                            your organization{" "}
                            <span
                              style={{
                                lineHeight: "20px",
                                fontSize: "15px",
                                fontWeight: "700",
                                textDecoration: "underline",
                              }}
                            >
                              {basicAnnualTabStyle
                                ? "every year"
                                : "every month"}
                            </span>{" "}
                            with dedicated support.{" "}
                            <span
                              className="learn-more-basic-plan"
                              style={{
                                cursor: "pointer",
                                color: "rgb(29, 155, 240)",
                              }}
                            >
                              Learn more
                            </span>
                          </div>
                        </div>
                        <div
                          style={{
                            width: "81.5%",
                          }}
                        >
                          <div
                            className="mt-3"
                            style={{
                              display: "flex",
                              gap: "2.5%",
                            }}
                          >
                            {/* annual plan start to check  */}
                            <div
                              onClick={() => {
                                setbasicAnnualTabStyle(true);
                                setbasicMonthlyTabStyle(false);
                              }}
                              style={
                                ({ activeIndividualOptionTabStyle },
                                {
                                  flex: 1,
                                  backgroundColor: "white",
                                  maxHeight: "72px",
                                  padding: "12px",
                                  cursor: "pointer",
                                  borderWidth: "1px",
                                  borderRadius: "16px",
                                  boxShadow:
                                    "0 0 15px rgba(101, 119,134,0.2), 0 0 3px 1px rgba(101,119,134,0.15)",
                                  border: basicAnnualTabStyle
                                    ? "2px solid #339bf0"
                                    : "2px solid transparent",
                                  transition: "transform 0.3s ease",
                                })
                              }
                              className="individual-subscription-box"
                            >
                              <div>
                                <div
                                  style={{
                                    color: "rgb(15, 20, 25)",
                                    fontSize: "18px",
                                    fontWeight: "600",
                                    display: " flex",
                                  }}
                                >
                                  {" "}
                                  <div>€11,305 / year</div>
                                  <div
                                    style={{
                                      fontSize: "11px",
                                      backgroundColor: "#dcf8eb",
                                      borderRadius: "9999px",
                                      height: "20px",
                                      display: "flex",
                                      justifyContent: "center",
                                      alignItems: "center",
                                      position: "relative",
                                      top: "5px",
                                      fontWeight: "700",
                                      color: "rgb(0, 67, 41)",
                                      lineHeight: "12px",
                                    }}
                                  >
                                    <span
                                      style={{
                                        padding: "4px 4px",
                                      }}
                                    >
                                      Save 16%
                                    </span>
                                  </div>
                                </div>
                                <div
                                  style={{
                                    color: "#697884",
                                    fontSize: "14px",
                                    fontWeight: "400",
                                  }}
                                >
                                  {" "}
                                  Annual plan
                                </div>
                              </div>
                            </div>
                            {/* annual plan finish to check  */}
                            {/* monthly plan start to check  */}
                            <div
                              onClick={() => {
                                setbasicMonthlyTabStyle(true);
                                setbasicAnnualTabStyle(false);
                              }}
                              style={
                                ({ activeOrganizationOptionTabStyle },
                                {
                                  flex: 1,
                                  backgroundColor: "white",
                                  maxHeight: "72px",
                                  padding: "12px",
                                  cursor: "pointer",
                                  borderWidth: "1px",
                                  borderRadius: "16px",
                                  boxShadow:
                                    "0 0 15px rgba(101, 119,134,0.2), 0 0 3px 1px rgba(101,119,134,0.15)",
                                  border: basicMonthlyTabStyle
                                    ? "2px solid #339bf0"
                                    : "2px solid transparent",
                                  transition: "transform 0.3s ease",
                                })
                              }
                              className="organization-subscription-box"
                            >
                              <div
                                style={{
                                  position: "relative",
                                }}
                              >
                                <div
                                  style={{
                                    color: "rgb(15, 20, 25)",
                                    fontSize: "18px",
                                    fontWeight: "600",
                                  }}
                                >
                                  €1,130.50 / month
                                </div>{" "}
                                <div
                                  style={{
                                    color: "#697884",
                                    fontSize: "14px",
                                    fontWeight: "400",
                                  }}
                                >
                                  Monthly plan
                                </div>
                              </div>
                            </div>
                            {/* monthly plan finish to check  */}
                          </div>
                          <div
                            className="mt-3"
                            style={{
                              color: "rgb(83, 100, 113)",
                              fontSize: "11px",
                              lineHeight: "12px",
                              fontWeight: "400",
                              height: "20px",
                            }}
                          >
                            {" "}
                            <span>
                              {basicAnnualTabStyle
                                ? `Full Access is €11,305/year (tax inclusive). Each
                              additional affiliated account is €714 per handle
                              per year (tax inclusive).`
                                : `Full Access is €1,130.50/month (tax inclusive). Each
                              additional affiliated account is €59.50 per handle
                              per month (tax inclusive).`}{" "}
                            </span>
                            <span
                              className="learn-more-basic-plan"
                              style={{
                                color: "rgb(29, 155, 240)",
                                cursor: "pointer",
                              }}
                            >
                              Learn more
                            </span>
                          </div>
                          <Button
                            onClick={() =>
                              handleFullAccessOrganizationPlanModal()
                            }
                            className="mt-4 subscribe-btn-basic-plan"
                            style={{
                              backgroundColor: "#0f1518",
                              color: "white",
                              height: "34px",
                              width: "100%",
                              borderRadius: "9999px",
                              border: " none",
                            }}
                            variant="info"
                          >
                            <div
                              style={{
                                fontSize: "15px",
                                lineHeight: "20px",
                                fontWeight: "700",
                              }}
                            >
                              <span>Subscribe</span>
                              <span
                                style={{
                                  marginLeft: "5px",
                                }}
                              >
                                &middot;
                              </span>
                              <span>
                                {" "}
                                {basicAnnualTabStyle
                                  ? `€11,305 per year`
                                  : `€1,130.50 per month`}{" "}
                              </span>
                            </div>
                          </Button>
                          <div
                            className="mt-3"
                            style={{
                              width: "100%",
                              color: "rgb(83, 100, 113)",
                              fontSize: "11px",
                              fontWeight: "400",
                              lineHeight: "12px",
                              height: "40px",
                            }}
                          >
                            By clicking Subscribe, you agree to our{" "}
                            <span
                              className="text-decoration-thickness-2px"
                              style={{
                                cursor: "pointer",
                                color: "rgb(15, 20, 25)",
                                textDecoration: "underline",
                                textDecorationColor: "rgb(15, 20, 25)",
                              }}
                            >
                              Purchaser Terms of Service.
                            </span>
                            Subscriptions auto-renew until canceled. All
                            accounts that sign up must pass manual approval.
                            Accounts that sign up are reviewed for authenticity.
                            If an account signs up and is not an organization,
                            you will be rejected and not refunded.
                          </div>
                        </div>{" "}
                      </>
                    ) : null}
                  </Modal.Body>
                </>
              </>
            ) : tabIndex === 2 && !phoneVerified ? (
              <>
                {subErrorPhoneVerifiedTabLoading ? (
                  <Modal.Body
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                    }}
                    className="signin-modal-body-child-non-reactivate sub-modal-loading-spinner"
                  >
                    <LoadingSpinner
                      strokeColor={"rgb(29, 155, 240)"}
                    ></LoadingSpinner>
                  </Modal.Body>
                ) : (
                  <Modal.Body
                    style={{
                      margin: "0px",
                      padding: "0px",
                    }}
                    className="signin-modal-body-child-non-reactivate sub-modal"
                  >
                    <div
                      onClick={handleCloseSubscriptionModal}
                      style={{
                        borderRadius: "50%",
                        cursor: "pointer",
                        position: "relative",
                        top: "15px",
                        left: "10px",
                        width: "100%",
                      }}
                    >
                      <div
                        className="close-button"
                        style={{
                          display: " flex",
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "center",
                          width: "30px",
                          height: "30px",
                          borderRadius: "50%",
                        }}
                      >
                        {/* close signin modal icon start to check  */}
                        <svg
                          style={{
                            border: "none",
                            fontSize: "15px",
                            margin: "5px",
                          }}
                          onClick={handleCloseSubscriptionModal}
                          width={20}
                          height={20}
                          color="rgb(15,20,25)"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                          className=" r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-z80fyv r-19wmn03"
                        >
                          <g>
                            <path d="M10.59 12L4.54 5.96l1.42-1.42L12 10.59l6.04-6.05 1.42 1.42L13.41 12l6.05 6.04-1.42 1.42L12 13.41l-6.04 6.05-1.42-1.42L10.59 12z"></path>
                          </g>
                        </svg>{" "}
                        {/* close signin modal icon finish to check  */}
                      </div>{" "}
                    </div>{" "}
                    <img
                      className="mt-4"
                      style={{}}
                      width={"100%"}
                      height={300}
                      src="https://ton.twimg.com/onboarding/subscriptions_product/twitter_blue_verified_full_v1.png"
                      alt=""
                    />
                    <div
                      className="mt-5"
                      style={{
                        width: "70%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "26px",
                          lineHeight: "32px",
                          fontWeight: "800",
                        }}
                      >
                        Verify your phone number
                      </div>
                      <div
                        className="mt-2"
                        style={{
                          fontSize: "15px",
                          fontWeight: "400",
                          lineHeight: "20px",
                          color: "rgb(83, 100, 113)",
                        }}
                      >
                        Verify your phone number to subscribe for Premium. It
                        should just take a few minutes.
                      </div>
                      <Button
                        className="login-button next-btn mt-4 mb-5"
                        variant="dark"
                        style={{
                          width: "100%",
                          height: "52px",
                          color: "white",
                          backgroundColor: "#0f141a",
                        }}
                      >
                        Verify your phone number
                      </Button>
                    </div>
                  </Modal.Body>
                )}
              </>
            ) : tabIndex === 2 && phoneVerified ? (
              <>
                {subErrorPhoneVerifiedTabLoading ? (
                  <Modal.Body
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                    }}
                    className="signin-modal-body-child-non-reactivate sub-modal-loading-spinner"
                  >
                    <LoadingSpinner
                      strokeColor={"rgb(29, 155, 240)"}
                    ></LoadingSpinner>
                  </Modal.Body>
                ) : (
                  <Modal.Body>
                    <div>Phone verified...</div>
                  </Modal.Body>
                )}
              </>
            ) : (
              <>null</>
            )}
          </Modal>
        </>
      )}

      <Modal
        className="right-side-bar-unfollow-modal"
        show={showUnfollowModal}
        onHide={handleClose}
      >
        <Modal.Body
          className="right-side-bar-unfollow-modal-body"
          style={{
            textAlign: "center",
          }}
        >
          <div className="right-side-bar-unfollow-modal-div">
            <div
              style={{
                fontWeight: "700",
                fontSize: "20px",
                lineHeight: "24px",
                textAlign: "left",
              }}
            >
              Unfollow
            </div>
            <div
              style={{
                fontWeight: "700",
                fontSize: "20px",
                lineHeight: "24px",
                textAlign: "left",
              }}
            >
              @{selectedUser.username}?
            </div>
            <div
              style={{
                color: "rgb(83, 100, 113)",
                fontWeight: "400",
                fontSize: "15px",
                lineHeight: "20px",
                textAlign: "left",
                marginTop: "10px",
              }}
            >
              Their posts will no longer show up in your Following timeline. You
              can still view their profile, unless their posts are protected.
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer
          className="right-side-bar-unfollow-modal-footer"
          style={{
            border: "none",
          }}
        >
          <Button
            style={{
              maxWidth: "256px",
              minHeight: "44px ",
            }}
            variant="dark"
            onClick={() => handleUnfollow(selectedUser)}
          >
            Unfollow
          </Button>
          <Button
            className="hover-unfollow-cancel"
            style={{ color: "black", maxWidth: "256px", minHeight: "44px" }}
            variant="light"
            onClick={handleClose}
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
      <Col
        className="side-bar-column d-none d-lg-block d-xxl-block"
        xs={12} // 0px - 576px aralığı
        sm={12} // 576px - 768px aralığı
        md={6} // 768px - 992px aralığı
        lg={4} // 992px - 1400px aralığı
        xxl={4} // 1400px ve sonrası aralığı
        style={{
          position: "relative",
          left: "1.5%",
        }}
      >
        <Stack
          style={{
            height: "100%",
            position: "fixed",
          }}
          gap={3}
        >
          {/* input start to check  */}
          <div
            style={{
              position: "relative",
              right: "40px",
              bottom: "20px",
              marginLeft: "15px",
            }}
            className="p-4"
          >
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg
                color={onFocus ? "#1e9bf0" : "rgba(83, 100, 113, 1.00)"}
                style={{
                  display: "inline-block",
                  position: "relative",
                  left: "30px",
                }}
                fill="currentColor"
                width={`${1.25}em`}
                height={`${1.25}em`}
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="search-bar-right-side-column r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-14j79pv r-4wgw6l r-f727ji"
              >
                <g className="search-bar-right-side-column-group">
                  <path d="M10.25 3.75c-3.59 0-6.5 2.91-6.5 6.5s2.91 6.5 6.5 6.5c1.795 0 3.419-.726 4.596-1.904 1.178-1.177 1.904-2.801 1.904-4.596 0-3.59-2.91-6.5-6.5-6.5zm-8.5 6.5c0-4.694 3.806-8.5 8.5-8.5s8.5 3.806 8.5 8.5c0 1.986-.682 3.815-1.824 5.262l4.781 4.781-1.414 1.414-4.781-4.781c-1.447 1.142-3.276 1.824-5.262 1.824-4.694 0-8.5-3.806-8.5-8.5z"></path>
                </g>
              </svg>
            </div>

            <input
              onFocus={onFocusActive}
              onChange={handleSetSearchTerm}
              style={{
                width: "350px",
                height: "44px",
                backgroundColor: onFocus ? "white" : "#eff3f4",
                border: onFocus ? "1px solid #1e9bf0" : "none",
                outlineStyle: "none",
                borderRadius: "9999px",
                borderWidth: "1px",
                padding: "0px 55px",
                fontSize: "15px",
                fontWeight: "400",
                lineHeight: "20px",
                wordWrap: "break-word",
              }}
              type="text"
              className="right-side-bar-input"
              placeholder="Search"
              value={searchTerm}
            />
            {/* close text start to check right side input  */}
            {searchTerm?.length && !closeDeleteSearchTermBtn ? (
              <div
                style={{
                  display: "inline-block",
                  float: "right",
                  position: "absolute",
                  top: "35px",
                  right: "40px",

                  borderRadius: "50%",
                }}
                className="div-parent-search-input-delete-search-term css-175oi2r r-6koalj r-1777fci"
                onClick={() => {
                  console.log(
                    "Delete search term ! Keep Try searching for people modal open !"
                  );
                  setSearchTerm();
                }}
              >
                <div
                  aria-label="Clear"
                  role="button"
                  className="right-side-input-close-text-search-input css-175oi2r r-sdzlij r-1phboty r-lrvibr r-1yadl64 r-1b7u577 r-12sks89 r-1y7e96w r-1loqt21 r-o7ynqc r-6416eg r-1ny4l3l"
                  data-testid="clearButton"
                  style={{
                    borderColor: "rgb(0,0,0,0)",
                    backgroundColor: "rgb(29,155,240)",
                    display: "flex",
                    justifyContent: "center",
                    borderRadius: "50%",
                    width: "20px",
                    height: "auto",
                  }}
                >
                  <div
                    dir="ltr"
                    className="div-second-parent-search-input-delete-search-term css-1rynq56 r-bcqeeo r-qvutc0 r-37j5jr r-q4m81j r-a023e6 r-rjixqe r-b88u0q r-1awozwy r-6koalj r-18u37iz r-16y2uox r-1777fci"
                    style={{ textOverflow: "unset", color: "rgb(255,255,255)" }}
                  >
                    <svg
                      style={{
                        position: "relative",
                        bottom: "2px",
                      }}
                      color="white"
                      fill="currentColor"
                      width={9}
                      height={9}
                      viewBox="0 0 15 15"
                      aria-hidden="true"
                      className="search-input-delete-search-term-svg r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-jwli3a r-1or9b2r r-5soawk"
                    >
                      <g className="search-input-delete-search-term-svg-group">
                        <path d="M6.09 7.5L.04 1.46 1.46.04 7.5 6.09 13.54.04l1.42 1.42L8.91 7.5l6.05 6.04-1.42 1.42L7.5 8.91l-6.04 6.05-1.42-1.42L6.09 7.5z"></path>
                      </g>
                    </svg>
                  </div>
                </div>
              </div>
            ) : null}

            {/* close text finish to check right side input  */}
            <div
              className="scrollbar-add"
              style={{
                overflowY: "auto",
                overflowX: "hidden",
                maxHeight: "400px",
                minHeight: "100px",
                backgroundColor: "white",
                zIndex: 9999,
                width: "350px",
                borderRadius: "8px",
                border: "none",
                position: "absolute",
                padding: "12px",
                boxShadow:
                  "0 0 15px rgba(101, 119,134,0.2), 0 0 3px 1px rgba(101,119,134,0.15)",
                display: onFocus ? "flex" : "none",
                flexDirection: "column",

                alignItems: "center",
              }}
            >
              {!searchTerm ? (
                <>
                  <div
                    style={{
                      color: "rgb(83, 100, 113)",
                      lineHeight: "20px",
                      fontSize: "15px",
                      fontWeight: "400",
                    }}
                  >
                    Try searching for people
                  </div>
                </>
              ) : (
                <>
                  <List
                    className="right-side-bar-column-search-bar-list"
                    size="small"
                    header={<div>{`Search for "${searchTerm}"`}</div>}
                    bordered
                  >
                    {filteredSearchResult.map((eachUser, index) => (
                      <List.Item
                        onMouseEnter={() => {
                          setIsHoveredListItem(index);
                        }}
                        key={index}
                        style={{
                          backgroundColor:
                            isHoveredListItem === index ? "#f7f9f9" : "",
                          border: "none",
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          navigate(`/profile/${eachUser._doc._id}`);
                        }}
                      >
                        <Stack
                          style={{
                            width: "100%",
                          }}
                          direction="horizontal"
                        >
                          {eachUser._doc?.imageUrl?.slice(0, 3) !== "../" ? (
                            <Link to={`/profile/${eachUser._doc?._id}`}>
                              <img
                                src={eachUser._doc?.imageUrl}
                                alt={`${eachUser._doc?.fullname}'s profile`}
                                width={40}
                                height={40}
                                className="profile-image"
                                style={{
                                  borderRadius: "50%",
                                }}
                              />
                            </Link>
                          ) : (
                            <div>
                              <Link to={`/profile/${eachUser._doc?._id}`}>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="40"
                                  height="40"
                                  fill="rgb(83, 100, 113)"
                                  className="bi bi-person-circle"
                                  viewBox="0 0 16 16"
                                >
                                  <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                                  <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1" />
                                </svg>
                              </Link>
                            </div>
                          )}
                          {/* User Info */}
                          <div className="user-info p-2">
                            {/* Fullname */}
                            <div
                              style={{
                                fontSize: "15px",
                                fontWeight: "700",
                                lineHeight: "20px",
                              }}
                              className="fullname"
                            >
                              <Link
                                to={`/profile/${eachUser._doc?._id}`}
                                className="hover-fullname"
                                style={{
                                  textDecoration: "none",
                                  color: "black",
                                }}
                              >
                                <div
                                  style={{
                                    fontSize: "15px",
                                    fontWeight: "700",
                                    lineHeight: "20px",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                    width: "200px",
                                  }}
                                >
                                  {eachUser._doc?.fullname}
                                </div>
                              </Link>
                            </div>

                            {/* Username */}
                            <div
                              style={{
                                fontSize: "15px",
                                fontWeight: "400",
                                lineHeight: "20px",
                                color: "rgb(83, 100, 113)",
                                position: "relative",
                              }}
                              className="username"
                            >
                              <Link
                                style={{
                                  textDecoration: "none",
                                }}
                                to={`/profile/${eachUser._doc?._id}`}
                              >
                                <span
                                  style={{
                                    fontSize: "15px",
                                    fontWeight: "400",
                                    lineHeight: "20px",
                                    color: "rgb(83, 100, 113)",
                                    position: "relative",
                                  }}
                                >
                                  @{eachUser._doc?.username}
                                </span>
                              </Link>
                            </div>
                          </div>
                        </Stack>
                      </List.Item>
                    ))}
                  </List>
                </>
              )}
            </div>
            {/* close text start to check right side input  */}
          </div>
          {/* input finish to check  */}
          <div
            style={{
              position: "relative",
              bottom: "40px",
            }}
          >
            <div
              style={{
                border: "none",
                borderWidth: "1px",
                borderRadius: "16px",
                backgroundColor: "#eff3f4",
                maxWidth: "350px",
              }}
              className="p-4"
            >
              <div>
                <div
                  style={{
                    fontSize: "20px",
                    fontWeight: "800",
                    lineHeight: "24px",
                  }}
                >
                  Subscribe to Premium
                </div>
                <div
                  style={{
                    fontSize: "15px",
                    fontWeight: "400",
                    lineHeight: "20px",
                    marginTop: "10px",
                  }}
                >
                  Subscribe to unlock new features and if eligible, receive a
                  share of ads revenue.
                </div>

                <Button
                  onClick={handleShowSubscriptionModal}
                  style={{
                    display: "inline",
                    marginTop: "10px",
                    maxWidth: "107px",
                  }}
                  className="login-button"
                  variant="dark"
                >
                  Subscribe
                </Button>
              </div>
            </div>

            {/* start to check first 3 user  */}

            <div
              style={{
                border: "none",
                borderWidth: "1px",
                borderRadius: "16px",
                backgroundColor: "#eff3f4",
                maxWidth: "350px",
                marginTop: "10px",
                display: "flex",
                flexDirection: "column",
                textAlign: "left",
              }}
              className="p-4"
            >
              <div
                style={{
                  fontSize: "20px",
                  fontWeight: "800",
                  lineHeight: "24px",
                  position: "relative",
                  right: "10px",
                }}
              >
                Who to follow
              </div>
              {first3User
                ? first3User.map((eachUser, index) => {
                    return (
                      <div
                        style={{
                          position: "relative",
                          right: "10px",
                        }}
                        key={eachUser._id}
                      >
                        <div>
                          <Stack
                            className="each-who-to-follow-user"
                            style={{
                              width: "108%",
                            }}
                            direction="horizontal"
                          >
                            <div>
                              {" "}
                              {eachUser.imageUrl.slice(0, 3) !== "../" ? (
                                <>
                                  <Link
                                    to={`/profile/${eachUser._id}`}
                                    style={{
                                      textDecoration: "none",
                                      borderRadius: "50%",
                                    }}
                                  >
                                    <img
                                      width={40}
                                      height={40}
                                      style={{
                                        borderRadius: "50%",
                                      }}
                                      src={eachUser.imageUrl}
                                      alt=""
                                    />
                                  </Link>
                                </>
                              ) : (
                                <>
                                  <Link
                                    to={`/profile/${eachUser._id}`}
                                    style={{
                                      textDecoration: "none",
                                    }}
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="40"
                                      height="40"
                                      fill="rgb(83, 100, 113)"
                                      className="bi bi-person-circle"
                                      viewBox="0 0 16 16"
                                    >
                                      <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                                      <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1" />
                                    </svg>
                                  </Link>
                                </>
                              )}
                            </div>
                            <div className="p-3">
                              <Link
                                to={`/profile/${eachUser._id}`}
                                style={{
                                  textDecoration: "none",
                                  color: "black",
                                }}
                              >
                                <div
                                  className="hover-fullname"
                                  style={{
                                    lineHeight: "20px",
                                    fontSize: "15px",
                                    fontWeight: "700",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                    width: "120px",
                                  }}
                                >
                                  <span>{eachUser.fullname}</span>
                                  <span>
                                    {/* start to check  */}{" "}
                                    <span className="css-1qaijid r-bcqeeo r-qvutc0 r-poiln3 r-1awozwy r-xoduu5">
                                      <svg
                                        width={`${1.25}em`}
                                        height={`${1.25}em`}
                                        viewBox="0 0 22 22"
                                        aria-label="Verified account"
                                        role="img"
                                        className="r-4qtqp9 r-yyyyoo r-1xvli5t r-bnwqim r-1plcrui r-lrvibr r-1cvl2hr r-f9ja8p r-og9te1 r-9cviqr"
                                        data-testid="icon-verified"
                                        color="rgba(29,155,240,1.00)"
                                        fill="currentColor"
                                      >
                                        <g>
                                          <path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z"></path>
                                        </g>
                                      </svg>
                                    </span>{" "}
                                  </span>{" "}
                                </div>
                              </Link>
                              <Link
                                to={`/profile/${eachUser._id}`}
                                style={{
                                  textDecoration: "none",
                                  color: "black",
                                }}
                              >
                                <div
                                  // style={{
                                  //   lineHeight: "20px",
                                  //   fontSize: "15px",
                                  //   fontWeight: "700",
                                  //   overflow: "hidden",
                                  //   textOverflow: "ellipsis",
                                  //   whiteSpace: "nowrap",
                                  //   width: "120px",
                                  // }}
                                  style={{
                                    lineHeight: "20px",
                                    fontSize: "15px",
                                    fontWeight: "400",
                                    color: "rgb(83, 100, 113)",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                    width: "120px",
                                  }}
                                >
                                  @{eachUser.username}
                                </div>
                              </Link>
                              {/* start to check verified icon  */}

                              {/* finish to check verified icon  */}
                            </div>
                            <div
                              onMouseEnter={() => {
                                setIsHovered(index);
                              }}
                              onMouseLeave={() => setIsHovered("")}
                              className="ms-auto"
                            >
                              <Button
                                onClick={() =>
                                  getFollowingIds(user)?.includes(eachUser._id)
                                    ? openUnfollowModal(eachUser)
                                    : handleFollow(eachUser)
                                }
                                style={{
                                  maxWidth: "99px",
                                  maxHeight: "32px",
                                  fontSize: "15px",
                                  lineHeight: "20px",
                                  fontWeight: "700",
                                  transitionDuration: "0.2s",
                                  border:
                                    isHovered === index &&
                                    getFollowingIds(user)?.includes(
                                      eachUser._id
                                    )
                                      ? "1px solid rgba(253,201,206,255)"
                                      : getFollowingIds(user)?.includes(
                                          eachUser._id
                                        )
                                      ? "1px solid rgba(0, 0, 0, 0.1)"
                                      : "1px solid rgb(185, 202, 211)",
                                  backgroundColor:
                                    isHovered === index &&
                                    getFollowingIds(user)?.includes(
                                      eachUser._id
                                    )
                                      ? "rgba(255,234,235,255)"
                                      : getFollowingIds(user)?.includes(
                                          eachUser._id
                                        )
                                      ? "transparent"
                                      : "black",

                                  color:
                                    isHovered === index &&
                                    getFollowingIds(user).includes(eachUser._id)
                                      ? "rgba(244,34,45,255)"
                                      : getFollowingIds(user)?.includes(
                                          eachUser._id
                                        )
                                      ? "black"
                                      : "white",
                                }}
                                className="right-side-bar-button"
                                variant="dark"
                              >
                                {isHovered === index
                                  ? getFollowingIds(user)?.includes(
                                      eachUser._id
                                    )
                                    ? "Unfollow"
                                    : "Follow"
                                  : getFollowingIds(user)?.includes(
                                      eachUser._id
                                    )
                                  ? "Following"
                                  : "Follow"}
                              </Button>
                            </div>
                          </Stack>
                        </div>
                      </div>
                    );
                  })
                : null}
              <div
                style={{
                  color: "rgb(29, 155, 240)",
                  fontSize: "15px",
                  lineHeight: "20px",
                  fontWeight: "400",
                  position: "relative",
                  right: "10px",
                }}
              >
                Show more
              </div>
            </div>

            {/* finish to check first 3 user  */}
            <div
              style={{
                width: "375px",
              }}
              className="p-4"
            >
              <ul
                className="right-side-bar-column-list"
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  width: "370px",
                  position: "relative",
                  right: "24px",
                  listStyle: "none",
                  margin: "0px",
                  padding: "0px",
                }}
              >
                <li>Terms of Service</li>
                <li>Privacy Policy</li>
                <li>Cookie Policy</li>
                <li>MStV Transparenzangaben</li>
                <li>Imprint</li>
                <li>Accessibility</li>
                <li>Ads info</li>
                <li>© 2024 Connectify Corp.</li>
              </ul>
            </div>
          </div>
          {/* unfollow modal start to check  */}

          {/* unfollow modal finish to check  */}
        </Stack>
      </Col>
    </>
  );
}

export default RightSideColumn;
