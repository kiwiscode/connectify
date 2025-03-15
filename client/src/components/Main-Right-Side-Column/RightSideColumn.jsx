import { useContext, useEffect, useRef, useState } from "react";
import { Button, Col, Stack, Modal } from "react-bootstrap";
import axios from "axios";
import { UserContext } from "../../context/UserContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { List } from "antd";
import useWindowDimensions from "../../hooks/getWindowDimensions";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import LoadingSpinner from "../ui/LoadingSpinner";
import {
  InputLabel,
  OutlinedInput,
  TextField,
  FormControl,
  InputAdornment,
} from "@mui/material";
import Popover from "@mui/material/Popover";
import PopupState, { bindTrigger, bindPopover } from "material-ui-popup-state";
import {
  getCountries,
  getCountryCallingCode,
  isPossiblePhoneNumber,
  isValidPhoneNumber,
} from "react-phone-number-input/input";
import en from "react-phone-number-input/locale/en.json";
import "react-phone-number-input/style.css";
import { CommentModal } from "../ui/Modal";
import { QRCodeSVG } from "qrcode.react";
import { ThemeContext } from "../../context/ThemeContext";
import UnfollowModal from "../unfollow-modal/UnfollowModal";
import { v4 as uuidv4 } from "uuid";
const API_URL = import.meta.env.VITE_APP_API_URL;
const TWILIO_NUMBER = import.meta.env.VITE_APP_TWILIO_ACCOUNT_NUMBER;

import { useAntdMessageHandler } from "../../utils/useAntdMessageHandler";
import RepostAction from "../ui/RepostAction";
import LikeAction from "../ui/LikeAction";
import BootstrapTooltip from "../BootstrapToolTip/BootstrapToolTip";
import PostPopover from "../three-dots-popover/Popover";
import { SubcsriptionStatusContext } from "../../context/SubscriptionStatusContext";
import { useFontSizeHandler } from "../../utils/useFontSizeHandler";
import { StateRefreshTriggersContext } from "../../context/State-refresh-triggers-Context";

function RightSideColumn({
  premium_sign_up_page_active,
  organizationSubscribeOptionClicked,
  sendModalStatuForPremiumSignUpPage,
  sendModalClosedStatusToLogoutModal = () => {},
  widthSmaller700,
  premium_sign_up_page_premium_role,
  premium_sign_up_page_premium_type,
  premium_sign_up_plan_page_plan_type,
  premium_sign_up_plan_page_plan_price,
  isVerifiedOrgsSignUpRoute,
  isSubscriptionEligibilityCheckRouteForIndividualSubscription,
  premiumInfoFromParentAppJsx,
  first3User,
}) {
  const { subscription, remainingTimeSubscriptionsOwnerIds } = useContext(
    SubcsriptionStatusContext
  );

  const {
    getFontSizeAndLineHeight34,
    getFontSizeAndLineHeight31,
    getFontSizeAndLineHeight26,
    getFontSizeAndLineHeight23,
    getFontSizeAndLineHeight20,
    getFontSizeAndLineHeight17,
    getFontSizeAndLineHeight15,
    getFontSizeAndLineHeight14,
    getFontSizeAndLineHeight13,
    getFontSizeAndLineHeight11,
  } = useFontSizeHandler();
  const font34 = getFontSizeAndLineHeight34();
  const font31 = getFontSizeAndLineHeight31();
  const font26 = getFontSizeAndLineHeight26();
  const font23 = getFontSizeAndLineHeight23();
  const font20 = getFontSizeAndLineHeight20();
  const font17 = getFontSizeAndLineHeight17();
  const font15 = getFontSizeAndLineHeight15();
  const font14 = getFontSizeAndLineHeight14();
  const font13 = getFontSizeAndLineHeight13();
  const font11 = getFontSizeAndLineHeight11();

  useEffect(() => {
    if (
      premiumInfoFromParentAppJsx ||
      isSubscriptionEligibilityCheckRouteForIndividualSubscription
    ) {
      setpremiumInfo((prevPremiumInfo) => {
        return {
          ...prevPremiumInfo,
          premiumRole: premiumInfoFromParentAppJsx.premiumRole,
          premiumType: premiumInfoFromParentAppJsx.premiumType,
          planType: premiumInfoFromParentAppJsx.planType,
          planPrice: premiumInfoFromParentAppJsx.planPrice,
        };
      });
    }
  }, [
    premiumInfoFromParentAppJsx,
    isSubscriptionEligibilityCheckRouteForIndividualSubscription,
  ]);

  const { getToken, userInfo } = useContext(UserContext);
  const [activities, setActivities] = useState([]);
  const getActivities = async () => {
    try {
      const response = await axios.get(`${API_URL}/activities`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      setActivities(response.data.activities);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getActivities();
  }, []);

  const [{ themeName }] = useContext(ThemeContext);

  const [onFocus, setOnFocus] = useState(false);
  const [user, setUser] = useState([]);
  const [isHovered, setIsHovered] = useState("");
  const navigate = useNavigate();

  const onFocusActive = () => {
    setOnFocus(true);
  };

  // start to check search implementation for main component right side column
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredSearchResult, setFilteredSearchResult] = useState([]);

  const setSearchTermEmpty = () => {
    setSearchTerm("");
  };
  const handleSetSearchTerm = (e) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    axios
      .get(`${API_URL}/allUsersFromDataBase`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
      .then((response) => {
        const term = searchTerm.split(" ").join("").toLowerCase();

        const filteredUsers = response.data.allUsers.filter((eachUser) => {
          return (
            eachUser.username.includes(term) || eachUser.fullname.includes(term)
          );
        });

        setFilteredSearchResult(filteredUsers);
      })
      .catch((error) => {
        console.error("Error =>", error);
      });
  }, [searchTerm]);

  const [searchBarAnimation, setSearchBarAnimation] = useState(false);
  const [stopAnimation, setStopAnimation] = useState(false);
  // finish to check search implementation for main component right side column

  const { setTriggerRefreshWhoToFollow } = useContext(
    StateRefreshTriggersContext
  );

  // sticky position implementation start to check
  const [scrollPosition, setScrollPosition] = useState(0);
  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrollPosition]);
  const handleScroll = () => {
    const position = window.pageYOffset;
    setScrollPosition(position);
  };
  // sticky position implementation finish to check

  // lifted the state up for general control over who to follow section start to check
  // const [first3User, setFirst3User] = useState([]);
  // useEffect(() => {
  //   axios
  //     .get(`${API_URL}/get-most-followed-3-user`, {
  //       headers: {
  //         Authorization: `Bearer ${getToken()}`,
  //       },
  //     })
  //     .then((response) => {
  //       setFirst3User(response.data.first3User);
  //     })
  //     .catch((error) => {
  //       console.error("Error =>", error);
  //     });
  // }, []);
  // lifted the state up for general control over who to follow section finish to check

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
        console.error("Error =>", error);
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

  const allFollowingsFromActiveUser = () => {
    return user?.following?.map((eachFollowedUser) => {
      return eachFollowedUser._id;
    });
  };

  const [showUnfollowModal, setshowUnfollowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState("");

  const handleFollow = async (selectedUser) => {
    try {
      await axios.post(
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
      );

      refreshActiveUser();
      setTriggerRefreshWhoToFollow((prev) => prev + 1);
    } catch (error) {
      console.error("Error =>", error);
    }
  };

  const handleUnfollow = async (selectedUser) => {
    try {
      await axios.post(
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
      );
      setshowUnfollowModal(false);
      refreshActiveUser();
      setTriggerRefreshWhoToFollow((prev) => prev + 1);
    } catch (error) {
      console.error("Error =>", error);
    }
  };

  const handleClose = () => {
    setshowUnfollowModal(false);
  };

  const openUnfollowModal = (selectedUser) => {
    setSelectedUser(selectedUser);
    setshowUnfollowModal(true);
  };

  const [isHoveredListItem, setIsHoveredListItem] = useState("");

  const { width } = useWindowDimensions();

  const [showSubscriptionModal, setshowSubscriptionModal] = useState(false);
  const [tabIndex, setTabIndex] = useState(null);

  useEffect(() => {
    if (isVerifiedOrgsSignUpRoute) {
      setselectedOption("organization");
      sethelperStateSelectedOption("organization");
      setTabIndex(1);
      setindividualSubOptionTab(2);
      setorganizationSubPremiumRole("Organization");
      setisIndividualSubscriptionClicked(false);
      setshowSubscriptionModal(true);
      setisOrganizationSubscriptionClicked(true);
      setTabStyleOrganizationBasicPlan(false);
      setTabStyleOrganizationFullAccessPlan(true);
      setSubTabIndexFromOrganizationSelect(2);
      setorganizationSubPremiumType("Full Access");
      setorganizationSubPremiumRole("Organization");
      setorganizationSubPlanPriceBasic("");
      setorganizationSubPlanTypeBasic("");
      if (fullAccessAnnualTabStyle) {
        setorganizationSubPlanPriceFullAccess("€11,305");
        setorganizationSubPlanTypeFullAccess("Annual Plan");
      } else if (fullAccessMonthlyTabStyle) {
        setorganizationSubPlanPriceFullAccess("€1,130.50");
        setorganizationSubPlanTypeFullAccess("Monthly Plan");
      } else {
        return;
      }
    }
  }, [isVerifiedOrgsSignUpRoute]);

  useEffect(() => {
    if (isSubscriptionEligibilityCheckRouteForIndividualSubscription) {
      setisIndividualSubscriptionClicked(true);
      setisOrganizationSubscriptionClicked(false);
      setshowSubscriptionModal(true);

      setTabIndex(2);
    }
  }, [isSubscriptionEligibilityCheckRouteForIndividualSubscription]);

  const handleShowSubscriptionModal = () => {
    if (
      !isVerifiedOrgsSignUpRoute &&
      !isSubscriptionEligibilityCheckRouteForIndividualSubscription
    ) {
      setshowSubscriptionModal(true);
      setTabIndex(0);
      setshowVerifyingCodeModal(false);
    }
  };

  const showSubscriptionModalSmallerThan700 = () => {
    setshowSubscriptionModal(true);
    setTabIndex(0);
    setshowVerifyingCodeModal(false);
    sendModalClosedStatusToLogoutModal(true);
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

  const [selectedOption, setselectedOption] = useState("");
  const [helperStateSelectedOption, sethelperStateSelectedOption] =
    useState("");
  const [phoneVerified, setphoneVerified] = useState(false);
  const [phoneVerifiedErrorMessage, setPhoneVerifiedErrorMessage] =
    useState(null);

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

  const tabStyleOrganizationBasicStyle = {
    backgroundColor:
      tabStyleOrganizationBasicPlan && themeName !== "dark-theme"
        ? "white"
        : tabStyleOrganizationBasicPlan && themeName === "dark-theme"
        ? "black"
        : tabStyleOrganizationFullAccessPlan && themeName === "dark-theme"
        ? "rgb(32,35,39)"
        : tabStyleOrganizationFullAccessPlan && themeName !== "dark-theme"
        ? "black"
        : "",
    color:
      tabStyleOrganizationBasicPlan && themeName !== "dark-theme"
        ? "black"
        : "white",
    borderRadius: "9999px",
    border: "none",
    height: "32px",
    fontSize: font15.fontSize,
    lineHeight: font15.lineHeight,
  };
  const tabStyleOrganizationFullAccessStyle = {
    backgroundColor:
      tabStyleOrganizationFullAccessPlan && themeName !== "dark-theme"
        ? "white"
        : tabStyleOrganizationFullAccessPlan && themeName === "dark-theme"
        ? "black"
        : tabStyleOrganizationBasicPlan && themeName === "dark-theme"
        ? "rgb(32,35,39)"
        : tabStyleOrganizationBasicPlan && themeName !== "dark-theme"
        ? "black"
        : "",
    color:
      tabStyleOrganizationFullAccessPlan && themeName !== "dark-theme"
        ? "black"
        : "white",
    fontSize: font15.fontSize,
    lineHeight: font15.lineHeight,
    borderRadius: "9999px",
    border: "none",
    height: "32px",
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

  const [premiumRole, setpremiumRole] = useState("Individual");
  const [premiumType, setpremiumType] = useState(null);
  const [planType, setplanType] = useState(null);
  const [planPrice, setplanPrice] = useState(null);
  const [premiumInfo, setpremiumInfo] = useState({
    user: userInfo,
    premiumRole:
      premiumRole || premium_sign_up_page_premium_role || "Individual",
    premiumType: premiumType || premium_sign_up_page_premium_type || null,
    planType: planType || premium_sign_up_plan_page_plan_type || null,
    planPrice: planPrice || premium_sign_up_plan_page_plan_price || null,
  });

  const handleOutsideClickOfModal = () => {
    if (isVerifiedOrgsSignUpRoute && tabIndex === 1) {
      setshowSubscriptionModal(false);
      navigate("/home");
    }
  };

  const handleOutsideClickOfModal2 = () => {
    if (
      isSubscriptionEligibilityCheckRouteForIndividualSubscription &&
      tabIndex === 2
    ) {
      setshowSubscriptionModal(false);
      navigate("/home");
    }
  };

  useEffect(() => {
    if (
      tabIndex === 0 &&
      (isVerifiedOrgsSignUpRoute ||
        isSubscriptionEligibilityCheckRouteForIndividualSubscription)
    ) {
      navigate("/i/premium_sign_up");
    }
  }, [isVerifiedOrgsSignUpRoute, tabIndex]);

  const handleNavigateClickCloseBtn = () => {
    navigate("/i/premium_sign_up");
  };

  const handleCloseSubscriptionModal = () => {
    setindividualSubOptionTab(null);
    setindividualSubOptionTab(2);
    setShowSubscriptionProcessNotCompletedModal(null);
    setpremiumRole("Individual");
    setpremiumType("Premium+");
    setplanType("Annual Plan");
    setplanPrice("€199.92");
    if (!premium_sign_up_page_active) {
      if (
        tabIndex === 2 &&
        showVerifyPhoneNumberPasswordModal &&
        correctPassword &&
        showgeneratedQrCodeModal
      ) {
        setPhoneVerifiedErrorMessage(null);
        setshowgeneratedQrCodeModal(false);
        setshowVerifyPhoneNumberPasswordModal(false);
        setshowSubscriptionModal(false);
        setphoneNumber("");
        setTabIndex(null);
      } else if (tabIndex >= 1) {
        setTabIndex(tabIndex - 1);
      } else if ((tabIndex === 2 && !phoneVerified) || phoneVerified) {
        setTabIndex(tabIndex - 1);
        setisOrganizationSubscriptionClicked(false);
        setactiveOrganizationOptionTabStyle(false);
        setactiveIndividualOptionTabStyle(true);
        setisIndividualSubscriptionClicked(true);
      } else if (tabIndex === 0) {
        sendModalClosedStatusToLogoutModal(false);
        setshowSubscriptionModal(false);
        setisOrganizationSubscriptionClicked(false);
        setactiveOrganizationOptionTabStyle(false);
        setactiveIndividualOptionTabStyle(true);
        setisIndividualSubscriptionClicked(true);
        setTimeout(() => {
          setTabIndex(null);
        }, 500);
      } else {
        sendModalClosedStatusToLogoutModal(false);
        setshowSubscriptionModal(false);
        setisOrganizationSubscriptionClicked(false);
        setactiveOrganizationOptionTabStyle(false);
        setactiveIndividualOptionTabStyle(true);
        setisIndividualSubscriptionClicked(true);
        setTimeout(() => {
          setTabIndex(null);
        }, 500);
      }
    } else {
      setshowSubscriptionModal(false);
    }
  };
  const [organizationSubPremiumRole, setorganizationSubPremiumRole] =
    useState("Organization");
  const [organizationSubPremiumType, setorganizationSubPremiumType] =
    useState("Full Access");
  const [
    organizationSubPlanTypeFullAccess,
    setorganizationSubPlanTypeFullAccess,
  ] = useState("Annual Plan");
  const [organizationSubPlanTypeBasic, setorganizationSubPlanTypeBasic] =
    useState("");
  const [
    organizationSubPlanPriceFullAccess,
    setorganizationSubPlanPriceFullAccess,
  ] = useState("€11,305");
  const [organizationSubPlanPriceBasic, setorganizationSubPlanPriceBasic] =
    useState("");

  const basicPlanClick = () => {
    setTabStyleOrganizationBasicPlan(true);
    setTabStyleOrganizationFullAccessPlan(false);
    setSubTabIndexFromOrganizationSelect(1);
    setorganizationSubPremiumType("Basic");
    setorganizationSubPlanPriceFullAccess("");
    setorganizationSubPlanTypeFullAccess("");
    if (basicAnnualTabStyle) {
      setorganizationSubPlanPriceBasic("€2,261");
      setorganizationSubPlanTypeBasic("Annual Plan");
    } else if (basicMonthlyTabStyle) {
      setorganizationSubPlanPriceBasic("€226.10");
      setorganizationSubPlanTypeBasic("Monthly Plan");
    } else {
      return;
    }
  };
  const fullAccessPlanClick = () => {
    setTabStyleOrganizationBasicPlan(false);
    setTabStyleOrganizationFullAccessPlan(true);
    setSubTabIndexFromOrganizationSelect(2);
    setorganizationSubPremiumType("Full Access");
    setorganizationSubPlanPriceBasic("");
    setorganizationSubPlanTypeBasic("");

    if (fullAccessAnnualTabStyle) {
      setorganizationSubPlanPriceFullAccess("€11,305");
      setorganizationSubPlanTypeFullAccess("Annual Plan");
    } else if (fullAccessMonthlyTabStyle) {
      setorganizationSubPlanPriceFullAccess("€1,130.50");
      setorganizationSubPlanTypeFullAccess("Monthly Plan");
    } else {
      return;
    }
  };

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
      setorganizationSubPremiumRole("Organization");
    } else {
      return 404;
    }
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

  useEffect(() => {
    if (!premium_sign_up_page_active) {
      if (
        individualSubOptionTab === 0 &&
        (!tabStyleOrganizationBasicPlan || !tabStyleOrganizationFullAccessPlan)
      ) {
        setpremiumType("Basic"),
          setplanType(
            individualSubOptionPremiumPlusAnnualTab
              ? "Annual Plan"
              : individualSubOptionPremiumPlusMonthlyTab
              ? "Monthly Plan"
              : null
          );
        setplanPrice(
          individualSubOptionPremiumPlusAnnualTab
            ? "€38.08"
            : individualSubOptionPremiumPlusMonthlyTab
            ? "€3.57"
            : null
        );
      } else if (
        individualSubOptionTab === 1 &&
        (!tabStyleOrganizationBasicPlan || !tabStyleOrganizationFullAccessPlan)
      ) {
        setpremiumType("Premium"),
          setplanType(
            individualSubOptionPremiumPlusAnnualTab
              ? "Annual Plan"
              : individualSubOptionPremiumPlusMonthlyTab
              ? "Monthly Plan"
              : null
          );
        setplanPrice(
          individualSubOptionPremiumPlusAnnualTab
            ? "€99.96"
            : individualSubOptionPremiumPlusMonthlyTab
            ? "€9.52"
            : null
        );
      } else if (
        individualSubOptionTab === 2 &&
        (!tabStyleOrganizationBasicPlan || !tabStyleOrganizationFullAccessPlan)
      ) {
        setpremiumType("Premium+"),
          setplanType(
            individualSubOptionPremiumPlusAnnualTab
              ? "Annual Plan"
              : individualSubOptionPremiumPlusMonthlyTab
              ? "Monthly Plan"
              : null
          );
        setplanPrice(
          individualSubOptionPremiumPlusAnnualTab
            ? "€199.92"
            : individualSubOptionPremiumPlusMonthlyTab
            ? "€19.04"
            : null
        );
      }
    } else {
      setplanPrice(premium_sign_up_plan_page_plan_price);
      setplanType(premium_sign_up_plan_page_plan_type);
      setpremiumType(premium_sign_up_page_premium_type);
      setpremiumRole(premium_sign_up_page_premium_role);
    }
  }, [
    premium_sign_up_page_active,
    premium_sign_up_page_premium_role,
    premium_sign_up_page_premium_type,
    premium_sign_up_plan_page_plan_type,
    premium_sign_up_plan_page_plan_price,
    individualSubOptionTab,
    individualSubOptionPremiumPlusAnnualTab,
    individualSubOptionPremiumPlusMonthlyTab,
  ]);

  const [subErrorPhoneVerifiedTabLoading, setsubErrorPhoneVerifiedTabLoading] =
    useState(false);

  const [
    showVerifyPhoneNumberPasswordModal,
    setshowVerifyPhoneNumberPasswordModal,
  ] = useState(false);

  const handlePhoneVerifiedCheck = () => {
    setTimeout(() => {
      setpremiumInfo((prevPremiumInfo) => {
        return {
          ...prevPremiumInfo,
          premiumRole,
          premiumType,
          planType,
          planPrice,
        };
      });
    }, 500);

    axios
      .post(`${API_URL}/is-phone-verified`, {
        isPhoneVerifiedThisUser: userInfo,
      })
      .then(() => {
        setsubErrorPhoneVerifiedTabLoading(true);
        setTimeout(() => {
          setindividualSubOptionTab(2);
          showPremiumPlusPaymentScreen();
          setTabIndex(tabIndex + 1);
          setsubErrorPhoneVerifiedTabLoading(false);
        }, 500);
      })
      .catch((error) => {
        const { status } = error.response;
        sethelperStateSelectedOption(selectedOption);
        setselectedOption(helperStateSelectedOption);
        setphoneVerified(status);
        setsubErrorPhoneVerifiedTabLoading(true);
        setTimeout(() => {
          setsubErrorPhoneVerifiedTabLoading(false);
          setphoneVerified(false);
          setPhoneVerifiedErrorMessage(true);
          setTabIndex(tabIndex + 1);
        }, 500);
      });
  };

  const [
    verifyPasswordInputSectionActive,
    setverifyPasswordInputSectionActive,
  ] = useState(false);
  const handleVerifyYourPasswordModalAfterVerifyYourPhoneNumberClick = () => {
    if (premium_sign_up_page_active) {
      setplanPrice(premium_sign_up_plan_page_plan_price);
      setplanType(premium_sign_up_plan_page_plan_type);
      setpremiumType(premium_sign_up_page_premium_type);
      setpremiumRole(premium_sign_up_page_premium_role);
    }
    setsubErrorPhoneVerifiedTabLoading(true);
    setverifyPasswordInputSectionActive(true);
    setTimeout(() => {
      setsubErrorPhoneVerifiedTabLoading(false);
      setshowVerifyPhoneNumberPasswordModal(true);
      setcorrectPassword(false);
      setverifyPasswordInput(null);
    }, 500);
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

  const [checkoutProcessLoadingBar, setCheckoutProcessLoadingBar] =
    useState(false);

  const handleCheckoutStripeApiOrganizationBasic = () => {
    setCheckoutProcessLoadingBar(true);

    axios
      .post(
        `${API_URL}/organization-basic-subscribe-create-checkout-session`,
        {
          userInfo,
          organizationSubPremiumRole,
          organizationSubPremiumType,
          organizationSubPlanTypeBasic,
          organizationSubPlanPriceBasic,
        },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      )
      .then((response) => {
        setTimeout(() => {
          if (response.data.url) {
            window.location.href = response.data.url;
          }
        }, 1000);
      })
      .catch((err) => {
        console.error("Error =>", err);
        setCheckoutProcessLoadingBar(false);
      });
  };

  const handleFullAccessOrganizationPlanModal = () => {
    setSubTabIndexFromOrganizationSelect(subTabIndexFromOrganizationSelect + 1);
  };

  const [showOrganizationTypeContent, setshowOrganizationTypeContent] =
    useState(false);
  const [hoveredOrganizationType, sethoveredOrganizationType] = useState(null);
  const [displayedOrganizationType, setdisplayedOrganizationType] =
    useState("");

  const [clicked, setClicked] = useState(false);

  const [organizationName, setOrganizationName] = useState("");
  const [yourFullName, setYourFullName] = useState(null);
  const [organizationEmailAdress, setOrganizationEmailAdress] = useState("");
  const [organizationWebSite, setOrganizationWebSite] = useState(null);

  const emailRegex =
    /^[a-zA-Z0-9._%+-]+@(gmail|outlook|hotmail|yahoo|proton|zoho|mail|aol|yandex)\.(com|org|net|gov|edu|mil|co|info|de|co.uk|ca|me|tr|com.tr)$/;

  // const websiteRegex =
  //   /^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+\.)(com|net|org|io|gov|edu|mil|co|info|biz|tv|me|ca|us|uk|de|in|es|it|fr|nl|jp|au|nz)(\/\S*)?$/;

  const [invalidEmailError, setInvalidEmailError] = useState(null);

  const handleCheckoutStripeApiOrganizationFullAccess = () => {
    setCheckoutProcessLoadingBar(true);

    axios
      .post(
        `${API_URL}/organization-full-access-subscribe-create-checkout-session`,
        {
          userInfo,
          organizationSubPremiumRole,
          organizationSubPremiumType,
          organizationSubPlanTypeFullAccess,
          organizationSubPlanPriceFullAccess,
          organizationName,
          yourFullName,
          organizationEmailAdress,
          organizationWebSite,
          displayedOrganizationType,
        },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      )
      .then((response) => {
        setTimeout(() => {
          if (response.data.url) {
            window.location.href = response.data.url;
          }
        }, 1000);
      })
      .catch((err) => window.alert("Error !!!", err ? err : null));
  };

  const handleSubmitOrganizationInformationForFullAccessSubscription = (
    organizationName,
    yourFullName,
    organizationEmailAdress,
    organizationWebSite,
    organizationType
  ) => {
    if (!organizationName) {
      setOrganizationNameFilled(true);
    }

    if (!yourFullName) {
      setOrganizationYourFullNameFilled(true);
    }

    if (!organizationEmailAdress) {
      setInvalidEmailError("Invalid Email");
      setOrganizationEmailAdressFilled(true);
    }

    if (!organizationWebSite) {
      setOrganizationWebSiteFilled(true);
    }

    if (!displayedOrganizationType) {
      setOrganizationDisplayedOrganizationTypeFilled(true);
    }

    if (!emailRegex.test(organizationEmailAdress) && organizationEmailAdress) {
      setInvalidEmailError("Invalid Email");
    } else {
      setInvalidEmailError(null);
    }

    if (
      organizationName &&
      yourFullName &&
      emailRegex.test(organizationEmailAdress) &&
      organizationWebSite &&
      organizationType
    ) {
      setInvalidEmailError(null);
      handleCheckoutStripeApiOrganizationFullAccess();
    }
  };

  const [organizationNameFilled, setOrganizationNameFilled] = useState(false);
  const [organizationYourFullNameFilled, setOrganizationYourFullNameFilled] =
    useState(false);
  const [organizationEmailAdressFilled, setOrganizationEmailAdressFilled] =
    useState(false);
  const [organizationWebSiteFilled, setOrganizationWebSiteFilled] =
    useState(false);
  const [
    organizationDisplayedOrganizationTypeFilled,
    setOrganizationDisplayedOrganizationTypeFilled,
  ] = useState(false);

  const [verifyPasswordInput, setverifyPasswordInput] = useState(null);

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (e) => {
    e.preventDefault();
  };

  const handleNewPasswordChange = (e) => {
    setverifyPasswordInput(e.target.value);
  };

  const { showCustomMessage, contextHolder } = useAntdMessageHandler();

  const generateRandomCode = () => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const length = 10;

    let phoneCode = "";
    for (let i = 0; i < length; i++) {
      phoneCode += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }

    return phoneCode;
  };

  const [correctPassword, setcorrectPassword] = useState(false);
  const [verifyPhoneCode, setrandomCode] = useState(null);

  const handleCheckIsPasswordInputCorrect = () => {
    if (premium_sign_up_page_active) {
      setpremiumInfo((prevPremiumInfo) => {
        return {
          ...prevPremiumInfo,
          premiumRole: premium_sign_up_page_premium_role,
          premiumType: premium_sign_up_page_premium_type,
          planType: premium_sign_up_plan_page_plan_type,
          planPrice: premium_sign_up_plan_page_plan_price,
        };
      });
    }

    axios
      .post(`${API_URL}/auth/password-check`, {
        premiumInfo,
        verifyPasswordInput,
      })
      .then(() => {
        setrandomCode(generateRandomCode());
        setsubErrorPhoneVerifiedTabLoading(true);
        setcorrectPassword(true);
        setTimeout(() => {
          setsubErrorPhoneVerifiedTabLoading(false);
        }, 500);
      })
      .catch(() => {
        showCustomMessage("Wrong password!", 4);
      });
  };

  const [country, setCountry] = useState("");
  const [
    showpopoverCountriesAndTheirPhoneCode,
    setpopoverCountriesAndTheirPhoneCode,
  ] = useState(false);
  const selectRef = useRef(null);

  const [phoneNumber, setphoneNumber] = useState(null);
  const [validPhoneNumber, setvalidPhoneNumber] = useState(false);
  const handleShowOptions = () => {
    setpopoverCountriesAndTheirPhoneCode(true);
    selectRef.current.focus();
  };

  const [errorPhoneInValidMessage, setErrorPhoneInValidMessage] = useState(" ");
  const handleSelectChange = (event) => {
    setpopoverCountriesAndTheirPhoneCode(true);
    setCountry(event.target.value || undefined);
  };

  useEffect(() => {
    if (
      (isPossiblePhoneNumber(`${phoneNumber}`, country) &&
        isValidPhoneNumber(`${phoneNumber}`, country)) ||
      (isPossiblePhoneNumber(`${phoneNumber}`, "DE") &&
        isValidPhoneNumber(`${phoneNumber}`, "DE"))
    ) {
      setTimeout(() => {
        setvalidPhoneNumber(true);
        setErrorPhoneInValidMessage("");
      }, 500);
    } else if (!phoneNumber) {
      setTimeout(() => {
        setErrorPhoneInValidMessage("");
        setvalidPhoneNumber("unknown");
      }, 500);
    } else {
      setTimeout(() => {
        setErrorPhoneInValidMessage("Please enter a valid phone number.");
        setvalidPhoneNumber(false);
      }, 500);
    }
  }, [phoneNumber]);
  const sortedCountries = getCountries().sort((a, b) => {
    if (a < b) return -1; // A'dan Z'ye doğru sıralama
    if (a > b) return 1; // Z'den A'ya doğru sıralama
    return 0; // Eşitlik durumu
  });

  const [showgeneratedQrCodeModal, setshowgeneratedQrCodeModal] =
    useState(false);

  const openQrCodeModal = () => {
    setshowgeneratedQrCodeModal(true);
    setsubErrorPhoneVerifiedTabLoading(true);
    setTimeout(() => {
      setsubErrorPhoneVerifiedTabLoading(false);
      setQrCodeScreenOpened(true);
    }, 500);
  };

  const [qrCodeScreenOpened, setQrCodeScreenOpened] = useState(false);

  const handleSubscriptionInfoNonPhoneVerifiedUser = () => {
    openQrCodeModal();
    // test
    setTabIndex(2);
    setshowVerifyPhoneNumberPasswordModal(true);
    setcorrectPassword(true);
    setshowgeneratedQrCodeModal(true);
    setshowVerifyingCodeModal(false);

    axios
      .post(
        `${API_URL}/premium-info-verify-phone-number-individual-subscription`,
        {
          premiumInfo,
          premiumRole,
          verifyPhoneCode,
          countryShortCut: country ? country : "DE",
          countryPhoneCode: country
            ? getCountryCallingCode(country)
            : getCountryCallingCode("DE"),
          selectedCountry: country ? en[country] : en["DE"],
          phoneNumber: phoneNumber,
        },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      )
      .then((response) => {})
      .catch((error) => {
        console.error("Error =>", error);
      });
  };

  const [showVerifyingCodeModal, setshowVerifyingCodeModal] = useState(false);
  const [
    showSubscriptionProcessNotCompletedModal,
    setShowSubscriptionProcessNotCompletedModal,
  ] = useState(null);

  const handleIndividualSubscriptionCheckoutStripeApi = () => {
    axios
      .post(
        `${API_URL}/individual-subscribe-checkout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      )
      .then((response) => {
        setTimeout(() => {
          if (response.data.url) {
            window.location.href = response.data.url;
          }
        }, 1000);
      })
      .catch((err) => window.alert("Error !!!", err ? err : null));
  };

  const handleVerifyPhoneForSubscription = () => {
    setshowVerifyingCodeModal(true);
    setShowSubscriptionProcessNotCompletedModal(null);

    axios
      .post(
        `${API_URL}/verify-phone-for-individual-subscription`,
        {},
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      )
      .then((response) => {
        setTimeout(() => {
          handleIndividualSubscriptionCheckoutStripeApi();
        }, 3000);
      })
      .catch((error) => {
        console.error("error:", error);
        const { status } = error.response;

        if (status === 400 || status === 500) {
          setTimeout(() => {
            setShowSubscriptionProcessNotCompletedModal(true);
          }, 3000);
        }
      });
  };

  const [boxHoveredIndividual, setBoxHoveredIndividual] = useState(false);
  const [boxHoveredOrganization, setBoxHoveredOrganization] = useState(false);

  // onhover popover start to check for post detail

  // onhover popover finish to check for post detail
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
  const navigatePostContentCutePopoverRightSide = (post) => {
    navigate(
      `/${post?.relatedPost?.userId?.username}/status/${post?.relatedPost._id}`
    );
  };

  const location = useLocation();
  const path = location.pathname;

  function sendDataToParentPremiumSignUpPage() {
    sendModalStatuForPremiumSignUpPage(true);
  }

  const [subLoading, setSubLoading] = useState(null);

  useEffect(() => {
    if (!showSubscriptionModal) {
      setpremiumRole("Individual");
      setindividualSubOptionPremiumPlusAnnualTab(true);
      setindividualSubOptionPremiumPlusMonthlyTab(false);
    }
  }, [showSubscriptionModal]);

  const searchBoxRef = useRef(null);

  const [searchBoxClicked, setSearchBoxClicked] = useState(null);
  const handleClick = (event) => {
    if (searchBoxRef.current && searchBoxRef.current.contains(event.target)) {
      setSearchBoxClicked(true);
    }
  };

  return (
    <>
      {contextHolder}
      {premium_sign_up_page_active && !organizationSubscribeOptionClicked && (
        <Button
          onClick={() => {
            setTabIndex(2);
            setSubLoading(true);
            setTimeout(() => {
              setSubLoading(false);
              setactiveIndividualOptionTabStyle(true);
              setisIndividualSubscriptionClicked(true);
              setshowVerifyPhoneNumberPasswordModal(false);
              setactiveOrganizationOptionTabStyle(false);
              setisOrganizationSubscriptionClicked(false);
              sendDataToParentPremiumSignUpPage();
              setphoneVerified(false);

              // burayı açınca problem ortaya çıkıyor, yani modal açıldıktan sonra problem başlıyor
              setshowSubscriptionModal(true);
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
            backgroundColor: themeName === "dark-theme" ? "#EFF3F4" : "#0F141A",
            opacity: subLoading ? "0.5" : "1",
          }}
        >
          {subLoading ? (
            <LoadingSpinner
              isCheckoutProcess={true}
              strokeColor={"rgb(29, 155, 240)"}
            ></LoadingSpinner>
          ) : (
            <div>Subscribe & Pay</div>
          )}
        </Button>
      )}

      {widthSmaller700 && (
        <div
          onClick={(event) => {
            event.stopPropagation();
            showSubscriptionModalSmallerThan700();
          }}
          style={{
            paddingBottom: "12px",
            paddingTop: "12px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            width: "100%",
            height: "100%",
            fontSize: font15.fontSize,
            lineHeight: font15.lineHeight,
          }}
          className={`logout-popover logout-popover-${themeName} chirp-bold-font`}
        >
          <span
            style={{
              position: "relative",
              left: "10px",
              color: themeName === "dark-theme" ? "white" : "",
            }}
          >
            Premium
          </span>
        </div>
      )}

      {width <= 700 ? (
        <>
          {showSubscriptionModal ? (
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
                zIndex: 99999,
                backgroundColor: themeName === "dark-theme" ? "black" : "white",
              }}
              dialogClassName={"modal-fullscreen"}
              show={showSubscriptionModal}
              onHide={
                isVerifiedOrgsSignUpRoute
                  ? handleOutsideClickOfModal
                  : isSubscriptionEligibilityCheckRouteForIndividualSubscription
                  ? handleOutsideClickOfModal2
                  : handleCloseSubscriptionModal
              }
              centered={true}
              contentClassName={
                themeName === "dark-theme" ? "dark-theme-sub-modal" : ""
              }
              className={`widthsmallerthan700-sub-modal widthsmallerthan700-sub-modal-${themeName}`}
            >
              {subTabIndexFromOrganizationSelect !== 3 ? (
                <>
                  <Modal.Header
                    className="signin-modal-header-child-non-reactivate"
                    style={{
                      border: "none",
                      zIndex: 999,
                      backgroundColor:
                        themeName === "dark-theme" ? "black" : "white",
                      width: "97%",
                    }}
                  >
                    <div
                      onClick={() =>
                        isSubscriptionEligibilityCheckRouteForIndividualSubscription
                          ? navigate("/i/premium_sign_up")
                          : handleCloseSubscriptionModal()
                      }
                      className={`close-button close-button-${themeName}`}
                      style={{
                        borderRadius: "50%",
                        cursor: "pointer",
                      }}
                    >
                      <div
                        className={`close-button close-button-${themeName}`}
                        style={{
                          borderRadius: "50%",
                          display:
                            (!verifyPasswordInputSectionActive ||
                              qrCodeScreenOpened) &&
                            !subErrorPhoneVerifiedTabLoading
                              ? "flex"
                              : "none",
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                      >
                        {/* close signin modal icon start to check  */}
                        <svg
                          style={{
                            border: "none",
                            margin: "5px",
                          }}
                          onClick={handleCloseSubscriptionModal}
                          width={20}
                          height={20}
                          color={
                            themeName === "dark-theme"
                              ? "white"
                              : "rgb(15,20,25)"
                          }
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                          className={` r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-z80fyv r-19wmn03`}
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
                        color: themeName === "dark-theme" ? "white" : "",
                        fontWeight: "700",

                        position: "absolute",
                        left: "15%",
                        display:
                          (selectedOption === "individual" ||
                            helperStateSelectedOption === "individual") &&
                          tabIndex !== 2
                            ? ""
                            : "none",
                        fontSize: font20.fontSize,
                        lineHeight: font20.lineHeight,
                      }}
                    >
                      Subscribe
                    </span>
                    <div
                      className="chirp-bold-font"
                      style={{
                        margin: "0 auto",
                        position: "relative",
                        right: "15px",
                        color: themeName === "dark-theme" ? "white" : "black",
                        display:
                          (selectedOption === "organization" ||
                            helperStateSelectedOption === "organization") &&
                          tabIndex !== 2
                            ? ""
                            : "none",
                        fontSize: font20.fontSize,
                        lineHeight: font20.lineHeight,
                      }}
                    >
                      Verified Organizations
                    </div>
                  </Modal.Header>
                </>
              ) : (
                <>
                  <Modal.Header
                    className="signin-modal-header-child-non-reactivate"
                    style={{
                      border: "none",
                      zIndex: 999,
                      backgroundColor:
                        themeName === "dark-theme" ? "black" : "white",
                      width: "97%",
                    }}
                  >
                    <div
                      style={{
                        position: "relative",
                        width: "100%",
                      }}
                    >
                      <div
                        onClick={() => {
                          setSubTabIndexFromOrganizationSelect(
                            subTabIndexFromOrganizationSelect - 1
                          );
                          setTabStyleOrganizationFullAccessPlan(true);
                        }}
                        className={`close-button close-button-${themeName}`}
                        style={{
                          display: " flex",
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "center",
                          width: "36px",
                          height: "36px",
                          borderRadius: "50%",
                          cursor: "pointer",
                        }}
                      >
                        {/* close signin modal icon start to check  */}
                        <svg
                          color={
                            themeName === "dark-theme"
                              ? "white"
                              : `rgb(15,20,25)`
                          }
                          fill="currentColor"
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
                        {/* close signin modal icon finish to check  */}
                      </div>{" "}
                    </div>
                  </Modal.Header>
                </>
              )}
              {tabIndex === 0 && !premium_sign_up_page_active ? (
                <>
                  <Modal.Body
                    // className="mt-5"
                    style={{
                      position: "relative",
                      top: "4.8%",
                    }}
                  >
                    <div
                      className="chirp-heavy-font"
                      style={{
                        fontSize: font31.fontSize,
                        lineHeight: font31.lineHeight,
                        color: themeName === "dark-theme" ? "white" : "black",
                      }}
                    >
                      Who are you?
                    </div>

                    <div
                      className="mt-3 chirp-regular-font"
                      style={{
                        fontSize: font15.fontSize,
                        lineHeight: font15.lineHeight,
                        color: themeName === "dark-theme" ? "white" : "black",
                      }}
                    >
                      Choose the right subscription for you:
                    </div>
                    <div
                      className="mt-4"
                      style={{
                        display: "flex",
                        gap: "5%",
                        width: "81.5%",
                      }}
                    >
                      <div
                        onMouseEnter={() => {
                          setBoxHoveredIndividual(true);
                        }}
                        onMouseLeave={() => setBoxHoveredIndividual(false)}
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
                        className={
                          themeName !== "dark-theme"
                            ? `individual-subscription-box-width-small-than-700 `
                            : `individual-subscription-box-width-small-than-700-${themeName}`
                        }
                      >
                        <div
                          style={{
                            position: "relative",
                            top: "5px",
                          }}
                        >
                          <div
                            className="chirp-regular-font"
                            style={{
                              color:
                                themeName === "dark-theme"
                                  ? "#71767A"
                                  : "rgb(83, 100, 113)",
                              fontSize: font15.fontSize,
                              backgroundColor:
                                boxHoveredIndividual &&
                                themeName === "dark-theme"
                                  ? "#17181c"
                                  : "",
                            }}
                          >
                            Premium
                          </div>
                          <div
                            className="chirp-bold-font"
                            style={{
                              fontSize: font17.fontSize,
                              lineHeight: font17.lineHeight,
                              color:
                                themeName === "dark-theme" ? "white" : "black",
                              backgroundColor:
                                boxHoveredIndividual &&
                                themeName === "dark-theme"
                                  ? "#17181c"
                                  : "",
                            }}
                          >
                            {" "}
                            I am an individual
                          </div>
                          <div
                            className="chirp-regular-font"
                            style={{
                              color:
                                themeName === "dark-theme"
                                  ? "#71767A"
                                  : "rgb(83, 100, 113)",
                              fontSize: font14.fontSize,
                              fontWeight: "400",
                              backgroundColor:
                                boxHoveredIndividual &&
                                themeName === "dark-theme"
                                  ? "#17181c"
                                  : "",
                            }}
                          >
                            {" "}
                            For individuals and creators
                          </div>
                        </div>
                      </div>
                      <div
                        onMouseEnter={() => {
                          setBoxHoveredOrganization(true);
                        }}
                        onMouseLeave={() => setBoxHoveredOrganization(false)}
                        onClick={() => {
                          setactiveOrganizationOptionTabStyle(true);
                          setisOrganizationSubscriptionClicked(true);
                          setactiveIndividualOptionTabStyle(false);
                          setisIndividualSubscriptionClicked(false);
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
                        className={
                          themeName !== "dark-theme"
                            ? `organization-subscription-box-width-small-than-700 `
                            : `organization-subscription-box-width-small-than-700-${themeName}`
                        }
                      >
                        <div
                          style={{
                            position: "relative",
                          }}
                        >
                          <div
                            className="chirp-regular-font"
                            style={{
                              color:
                                themeName === "dark-theme"
                                  ? "#71767A"
                                  : "rgb(83, 100, 113)",

                              backgroundColor:
                                boxHoveredOrganization &&
                                themeName === "dark-theme"
                                  ? "#17181c"
                                  : "",
                              fontSize: font15.fontSize,
                            }}
                          >
                            {" "}
                            Verified Organizations
                          </div>{" "}
                          <div
                            className="chirp-bold-font"
                            style={{
                              fontSize: font17.fontSize,
                              lineHeight: font17.lineHeight,
                              color:
                                themeName === "dark-theme"
                                  ? "white"
                                  : "rgb(15, 20, 25)",
                              backgroundColor:
                                boxHoveredOrganization &&
                                themeName === "dark-theme"
                                  ? "#17181c"
                                  : "",
                            }}
                          >
                            I am an organization
                          </div>{" "}
                          <div
                            className="chirp-regular-font"
                            style={{
                              color:
                                themeName === "dark-theme"
                                  ? "#71767A"
                                  : "rgb(83, 100, 113)",
                              fontSize: font14.fontSize,
                              fontWeight: "400",
                              backgroundColor:
                                boxHoveredOrganization &&
                                themeName === "dark-theme"
                                  ? "#17181c"
                                  : "",
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
                        color: themeName === "dark-theme" ? "black" : "white",
                        backgroundColor:
                          themeName === "dark-theme" ? "white" : "#0f141a",
                      }}
                      className={`next-btn mt-4 next-btn-${themeName}`}
                    >
                      Subscribe
                    </Button>
                    <div
                      style={{
                        color: themeName === "dark-theme" ? "white" : "black",
                        fontSize: font15.fontSize,
                        lineHeight: font15.lineHeight,
                      }}
                      className="mt-4 chirp-regular-font"
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
              ) : tabIndex === 1 &&
                isIndividualSubscriptionClicked &&
                !premium_sign_up_page_active ? (
                <>
                  <Modal.Body
                    className={`scrollbar-add scrollbar-add-${themeName}`}
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
                                className="chirp-medium-font"
                                style={{
                                  color: "white",
                                  fontSize: font17.fontSize,
                                  lineHeight: font17.lineHeight,
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
                            className={`mt-3 premium-plus-parent-div premium-plus-parent-div-${themeName}`}
                            style={{
                              padding: "32px",
                              borderRadius: "16px",
                              backgroundColor:
                                themeName === "dark-theme"
                                  ? "#16181C"
                                  : "#eff3f4",
                            }}
                          >
                            <div
                              style={{
                                fontSize: font17.fontSize,
                                lineHeight: font17.lineHeight,
                              }}
                              className="premium-plus-header chirp-bold-font"
                            >
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
                                  <span
                                    className="chirp-regular-font"
                                    style={{
                                      fontSize: font15.fontSize,
                                      lineHeight: font15.lineHeight,
                                    }}
                                  >
                                    Ads in For You
                                  </span>
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
                                  <span
                                    className="chirp-regular-font"
                                    style={{
                                      fontSize: font15.fontSize,
                                      lineHeight: font15.lineHeight,
                                    }}
                                  >
                                    Reply boost
                                  </span>
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
                                  <span
                                    className="chirp-regular-font"
                                    style={{
                                      fontSize: font15.fontSize,
                                      lineHeight: font15.lineHeight,
                                    }}
                                  >
                                    Longer posts
                                  </span>{" "}
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
                                    className="chirp-regular-font"
                                    style={{
                                      fontSize: font15.fontSize,
                                      lineHeight: font15.lineHeight,
                                    }}
                                  >
                                    Undo post
                                  </span>{" "}
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
                                    className="chirp-regular-font"
                                    style={{
                                      fontSize: font15.fontSize,
                                      lineHeight: font15.lineHeight,
                                    }}
                                  >
                                    Post longer videos
                                  </span>{" "}
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
                                    className="chirp-regular-font"
                                    style={{
                                      fontSize: font15.fontSize,
                                      lineHeight: font15.lineHeight,
                                    }}
                                  >
                                    Top Articles
                                  </span>{" "}
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
                                  <span
                                    className="chirp-regular-font"
                                    style={{
                                      fontSize: font15.fontSize,
                                      lineHeight: font15.lineHeight,
                                    }}
                                  >
                                    Reader
                                  </span>{" "}
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
                                  <span
                                    className="chirp-regular-font"
                                    style={{
                                      fontSize: font15.fontSize,
                                      lineHeight: font15.lineHeight,
                                    }}
                                  >
                                    Background video playback
                                  </span>{" "}
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
                                    className="chirp-regular-font"
                                    style={{
                                      fontSize: font15.fontSize,
                                      lineHeight: font15.lineHeight,
                                    }}
                                  >
                                    Download videos
                                  </span>{" "}
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
                            className={`mt-3 premium-plus-parent-div premium-plus-parent-div-${themeName}`}
                            style={{
                              padding: "32px",
                              borderRadius: "16px",
                              backgroundColor:
                                themeName === "dark-theme"
                                  ? "#16181C"
                                  : "#eff3f4",
                            }}
                          >
                            <div
                              style={{
                                fontSize: font17.fontSize,
                                lineHeight: font17.lineHeight,
                              }}
                              className="premium-plus-header chirp-bold-font"
                            >
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
                                    className="chirp-regular-font"
                                    style={{
                                      fontSize: font15.fontSize,
                                      lineHeight: font15.lineHeight,
                                      color:
                                        themeName === "dark-theme"
                                          ? "#71767A"
                                          : "rgb(83, 100, 113) ",
                                    }}
                                  >
                                    Write Articles
                                  </span>
                                  <svg
                                    width={20}
                                    height={20}
                                    color={
                                      themeName === "dark-theme"
                                        ? "#71767A"
                                        : "rgba(83,100,113,1.00)"
                                    }
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
                                    color={
                                      themeName === "dark-theme"
                                        ? "#71767A"
                                        : "rgba(83,100,113,1.00)"
                                    }
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
                                    className="chirp-regular-font"
                                    style={{
                                      fontSize: font15.fontSize,
                                      lineHeight: font15.lineHeight,
                                      color:
                                        themeName === "dark-theme"
                                          ? "#71767A"
                                          : "rgb(83, 100, 113)",
                                    }}
                                  >
                                    Get paid to post
                                  </span>
                                  <svg
                                    width={20}
                                    height={20}
                                    color={
                                      themeName === "dark-theme"
                                        ? "#71767A"
                                        : "rgba(83,100,113,1.00)"
                                    }
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
                                    color={
                                      themeName === "dark-theme"
                                        ? "#71767A"
                                        : "rgba(83,100,113,1.00)"
                                    }
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
                                    className="chirp-regular-font"
                                    style={{
                                      fontSize: font15.fontSize,
                                      lineHeight: font15.lineHeight,
                                      color:
                                        themeName === "dark-theme"
                                          ? "#71767A"
                                          : "rgb(83, 100, 113)",
                                    }}
                                  >
                                    Creator Subscriptions
                                  </span>
                                  <svg
                                    width={20}
                                    height={20}
                                    color={
                                      themeName === "dark-theme"
                                        ? "#71767A"
                                        : "rgba(83,100,113,1.00)"
                                    }
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
                                    color={
                                      themeName === "dark-theme"
                                        ? "#71767A"
                                        : "rgba(83,100,113,1.00)"
                                    }
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
                                    className="chirp-regular-font"
                                    style={{
                                      fontSize: font15.fontSize,
                                      lineHeight: font15.lineHeight,
                                      color:
                                        themeName === "dark-theme"
                                          ? "#71767A"
                                          : "rgb(83, 100, 113)",
                                    }}
                                  >
                                    C Pro
                                  </span>
                                  <svg
                                    width={20}
                                    height={20}
                                    color={
                                      themeName === "dark-theme"
                                        ? "#71767A"
                                        : "rgba(83,100,113,1.00)"
                                    }
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
                                    color={
                                      themeName === "dark-theme"
                                        ? "#71767A"
                                        : "rgba(83,100,113,1.00)"
                                    }
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
                                    className="chirp-regular-font"
                                    style={{
                                      fontSize: font15.fontSize,
                                      lineHeight: font15.lineHeight,
                                      color:
                                        themeName === "dark-theme"
                                          ? "#71767A"
                                          : "rgb(83, 100, 113)",
                                    }}
                                  >
                                    Media Studio
                                  </span>
                                  <svg
                                    width={20}
                                    height={20}
                                    color={
                                      themeName === "dark-theme"
                                        ? "#71767A"
                                        : "rgba(83,100,113,1.00)"
                                    }
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
                                    color={
                                      themeName === "dark-theme"
                                        ? "#71767A"
                                        : "rgba(83,100,113,1.00)"
                                    }
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
                                    className="chirp-regular-font"
                                    style={{
                                      fontSize: font15.fontSize,
                                      lineHeight: font15.lineHeight,
                                      color:
                                        themeName === "dark-theme"
                                          ? "#71767A"
                                          : "rgb(83, 100, 113)",
                                    }}
                                  >
                                    Analytics
                                  </span>
                                  <svg
                                    width={20}
                                    height={20}
                                    color={
                                      themeName === "dark-theme"
                                        ? "#71767A"
                                        : "rgba(83,100,113,1.00)"
                                    }
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
                                    color={
                                      themeName === "dark-theme"
                                        ? "#71767A"
                                        : "rgba(83,100,113,1.00)"
                                    }
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
                            className={`mt-3 premium-plus-parent-div premium-plus-parent-div-${themeName}`}
                            style={{
                              padding: "32px",
                              borderRadius: "16px",
                              backgroundColor:
                                themeName === "dark-theme"
                                  ? "#16181C"
                                  : "#eff3f4",
                            }}
                          >
                            <div
                              style={{
                                fontSize: font17.fontSize,
                                lineHeight: font17.lineHeight,
                              }}
                              className="premium-plus-header chirp-bold-font"
                            >
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
                                    className="chirp-regular-font"
                                    style={{
                                      fontSize: font15.fontSize,
                                      lineHeight: font15.lineHeight,
                                      color:
                                        themeName === "dark-theme"
                                          ? "#71767A"
                                          : "rgb(83, 100, 113)",
                                    }}
                                  >
                                    {" "}
                                    Checkmark
                                  </span>
                                  <svg
                                    width={20}
                                    height={20}
                                    color={
                                      themeName === "dark-theme"
                                        ? "#71767A"
                                        : "rgba(83,100,113,1.00)"
                                    }
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
                                    color={
                                      themeName === "dark-theme"
                                        ? "#71767A"
                                        : "rgba(83,100,113,1.00)"
                                    }
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
                                    className="chirp-regular-font"
                                    style={{
                                      fontSize: font15.fontSize,
                                      lineHeight: font15.lineHeight,
                                    }}
                                  >
                                    Encrypted direct messages
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
                                    className="chirp-regular-font"
                                    style={{
                                      fontSize: font15.fontSize,
                                      lineHeight: font15.lineHeight,
                                      color:
                                        themeName === "dark-theme"
                                          ? "#71767A"
                                          : "rgb(83, 100, 113)",
                                    }}
                                  >
                                    Optional ID verification
                                  </span>
                                  <svg
                                    width={20}
                                    height={20}
                                    color={
                                      themeName === "dark-theme"
                                        ? "#71767A"
                                        : "rgba(83,100,113,1.00)"
                                    }
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
                                    color={
                                      themeName === "dark-theme"
                                        ? "#71767A"
                                        : "rgba(83,100,113,1.00)"
                                    }
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
                            className={`mt-3 premium-plus-parent-div premium-plus-parent-div-${themeName}`}
                            style={{
                              padding: "32px",
                              borderRadius: "16px",
                              backgroundColor:
                                themeName === "dark-theme"
                                  ? "#16181C"
                                  : "#eff3f4",
                            }}
                          >
                            <div
                              style={{
                                fontSize: font17.fontSize,
                                lineHeight: font17.lineHeight,
                              }}
                              className="premium-plus-header chirp-bold-font"
                            >
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
                                  <span
                                    className="chirp-regular-font"
                                    style={{
                                      fontSize: font15.fontSize,
                                      lineHeight: font15.lineHeight,
                                    }}
                                  >
                                    App icons
                                  </span>
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
                                  <span
                                    className="chirp-regular-font"
                                    style={{
                                      fontSize: font15.fontSize,
                                      lineHeight: font15.lineHeight,
                                    }}
                                  >
                                    Bookmark folders
                                  </span>{" "}
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
                                    className="chirp-regular-font"
                                    style={{
                                      fontSize: font15.fontSize,
                                      lineHeight: font15.lineHeight,
                                    }}
                                  >
                                    Customize navigation
                                  </span>{" "}
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
                                    className="chirp-regular-font"
                                    style={{
                                      fontSize: font15.fontSize,
                                      lineHeight: font15.lineHeight,
                                    }}
                                  >
                                    Highlights tab
                                  </span>{" "}
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
                                    className="chirp-regular-font"
                                    style={{
                                      fontSize: font15.fontSize,
                                      lineHeight: font15.lineHeight,
                                    }}
                                  >
                                    Hide your likes
                                  </span>{" "}
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
                                    className="chirp-regular-font"
                                    style={{
                                      fontSize: font15.fontSize,
                                      lineHeight: font15.lineHeight,
                                    }}
                                  >
                                    Hide your checkmark
                                  </span>{" "}
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
                                <div
                                  className="chirp-regular-font"
                                  style={{
                                    fontSize: font15.fontSize,
                                    lineHeight: font15.lineHeight,
                                  }}
                                >
                                  Hide your subscriptions
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
                                className="chirp-medium-font"
                                style={{
                                  color: "white",
                                  fontSize: font17.fontSize,
                                  lineHeight: font17.lineHeight,
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
                            className={`mt-3 premium-plus-parent-div premium-plus-parent-div-${themeName}`}
                            style={{
                              padding: "32px",
                              borderRadius: "16px",
                              backgroundColor:
                                themeName === "dark-theme"
                                  ? "#16181C"
                                  : "#eff3f4",
                            }}
                          >
                            <div
                              style={{
                                fontSize: font17.fontSize,
                                lineHeight: font17.lineHeight,
                              }}
                              className="premium-plus-header chirp-bold-font"
                            >
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
                                  <span
                                    className="chirp-regular-font"
                                    style={{
                                      fontSize: font15.fontSize,
                                      lineHeight: font15.lineHeight,
                                    }}
                                  >
                                    Ads in For You
                                  </span>
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
                                  <span
                                    className="chirp-regular-font"
                                    style={{
                                      fontSize: font15.fontSize,
                                      lineHeight: font15.lineHeight,
                                    }}
                                  >
                                    Reply boost
                                  </span>
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
                                  <span
                                    className="chirp-regular-font"
                                    style={{
                                      fontSize: font15.fontSize,
                                      lineHeight: font15.lineHeight,
                                    }}
                                  >
                                    Edit post
                                  </span>{" "}
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
                                    className="chirp-regular-font"
                                    style={{
                                      fontSize: font15.fontSize,
                                      lineHeight: font15.lineHeight,
                                    }}
                                  >
                                    Longer posts
                                  </span>{" "}
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
                                    className="chirp-regular-font"
                                    style={{
                                      fontSize: font15.fontSize,
                                      lineHeight: font15.lineHeight,
                                    }}
                                  >
                                    Undo post
                                  </span>{" "}
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
                                    className="chirp-regular-font"
                                    style={{
                                      fontSize: font15.fontSize,
                                      lineHeight: font15.lineHeight,
                                    }}
                                  >
                                    Post longer videos
                                  </span>{" "}
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
                                    className="chirp-regular-font"
                                    style={{
                                      fontSize: font15.fontSize,
                                      lineHeight: font15.lineHeight,
                                    }}
                                  >
                                    Top Articles
                                  </span>{" "}
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
                                  <span
                                    className="chirp-regular-font"
                                    style={{
                                      fontSize: font15.fontSize,
                                      lineHeight: font15.lineHeight,
                                    }}
                                  >
                                    Reader
                                  </span>{" "}
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
                                  <span
                                    className="chirp-regular-font"
                                    style={{
                                      fontSize: font15.fontSize,
                                      lineHeight: font15.lineHeight,
                                    }}
                                  >
                                    Background video playback
                                  </span>{" "}
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
                                    className="chirp-regular-font"
                                    style={{
                                      fontSize: font15.fontSize,
                                      lineHeight: font15.lineHeight,
                                    }}
                                  >
                                    Download videos
                                  </span>{" "}
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
                            className={`mt-3 premium-plus-parent-div premium-plus-parent-div-${themeName}`}
                            style={{
                              padding: "32px",
                              borderRadius: "16px",
                              backgroundColor:
                                themeName === "dark-theme"
                                  ? "#16181C"
                                  : "#eff3f4",
                            }}
                          >
                            <div
                              style={{
                                fontSize: font17.fontSize,
                                lineHeight: font17.lineHeight,
                              }}
                              className="premium-plus-header chirp-bold-font"
                            >
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
                                    className="chirp-regular-font"
                                    style={{
                                      fontSize: font15.fontSize,
                                      lineHeight: font15.lineHeight,
                                      color:
                                        themeName === "dark-theme"
                                          ? "#71767A"
                                          : "rgb(83, 100, 113) ",
                                    }}
                                  >
                                    Write Articles
                                  </span>

                                  <svg
                                    width={20}
                                    height={20}
                                    color={
                                      themeName === "dark-theme"
                                        ? "#71767A"
                                        : "rgba(83,100,113,1.00)"
                                    }
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
                                    color={
                                      themeName === "dark-theme"
                                        ? "#71767A"
                                        : "rgba(83,100,113,1.00)"
                                    }
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
                                    className="chirp-regular-font"
                                    style={{
                                      fontSize: font15.fontSize,
                                      lineHeight: font15.lineHeight,
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
                                    className="chirp-regular-font"
                                    style={{
                                      fontSize: font15.fontSize,
                                      lineHeight: font15.lineHeight,
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
                                    className="chirp-regular-font"
                                    style={{
                                      fontSize: font15.fontSize,
                                      lineHeight: font15.lineHeight,
                                    }}
                                  >
                                    C Pro
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
                                    className="chirp-regular-font"
                                    style={{
                                      fontSize: font15.fontSize,
                                      lineHeight: font15.lineHeight,
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
                                    className="chirp-regular-font"
                                    style={{
                                      fontSize: font15.fontSize,
                                      lineHeight: font15.lineHeight,
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
                            className={`mt-3 premium-plus-parent-div premium-plus-parent-div-${themeName}`}
                            style={{
                              padding: "32px",
                              borderRadius: "16px",
                              backgroundColor:
                                themeName === "dark-theme"
                                  ? "#16181C"
                                  : "#eff3f4",
                            }}
                          >
                            <div
                              style={{
                                fontSize: font17.fontSize,
                                lineHeight: font17.lineHeight,
                              }}
                              className="premium-plus-header chirp-bold-font"
                            >
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
                                    className="chirp-regular-font"
                                    style={{
                                      fontSize: font15.fontSize,
                                      lineHeight: font15.lineHeight,
                                    }}
                                  >
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
                                    className="chirp-regular-font"
                                    style={{
                                      fontSize: font15.fontSize,
                                      lineHeight: font15.lineHeight,
                                    }}
                                  >
                                    Encrypted direct messages
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
                                    className="chirp-regular-font"
                                    style={{
                                      fontSize: font15.fontSize,
                                      lineHeight: font15.lineHeight,
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
                            className={`mt-3 premium-plus-parent-div premium-plus-parent-div-${themeName}`}
                            style={{
                              padding: "32px",
                              borderRadius: "16px",
                              backgroundColor:
                                themeName === "dark-theme"
                                  ? "#16181C"
                                  : "#eff3f4",
                            }}
                          >
                            <div
                              style={{
                                fontSize: font17.fontSize,
                                lineHeight: font17.lineHeight,
                              }}
                              className="premium-plus-header chirp-bold-font"
                            >
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
                                  <span
                                    className="chirp-regular-font"
                                    style={{
                                      fontSize: font15.fontSize,
                                      lineHeight: font15.lineHeight,
                                    }}
                                  >
                                    App icons
                                  </span>
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
                                  <span
                                    className="chirp-regular-font"
                                    style={{
                                      fontSize: font15.fontSize,
                                      lineHeight: font15.lineHeight,
                                    }}
                                  >
                                    Bookmark folders
                                  </span>{" "}
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
                                    className="chirp-regular-font"
                                    style={{
                                      fontSize: font15.fontSize,
                                      lineHeight: font15.lineHeight,
                                    }}
                                  >
                                    Customize navigation
                                  </span>{" "}
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
                                    className="chirp-regular-font"
                                    style={{
                                      fontSize: font15.fontSize,
                                      lineHeight: font15.lineHeight,
                                    }}
                                  >
                                    Highlights tab
                                  </span>{" "}
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
                                    className="chirp-regular-font"
                                    style={{
                                      fontSize: font15.fontSize,
                                      lineHeight: font15.lineHeight,
                                    }}
                                  >
                                    Hide your likes
                                  </span>{" "}
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
                                    className="chirp-regular-font"
                                    style={{
                                      fontSize: font15.fontSize,
                                      lineHeight: font15.lineHeight,
                                    }}
                                  >
                                    Hide your checkmark
                                  </span>{" "}
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
                                <div
                                  className="chirp-regular-font"
                                  style={{
                                    fontSize: font15.fontSize,
                                    lineHeight: font15.lineHeight,
                                  }}
                                >
                                  Hide your subscriptions
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
                                className="chirp-medium-font"
                                style={{
                                  color: "white",
                                  fontSize: font17.fontSize,
                                  lineHeight: font17.lineHeight,
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
                            className={`mt-3 premium-plus-parent-div premium-plus-parent-div-${themeName}`}
                            style={{
                              padding: "32px",
                              borderRadius: "16px",
                              backgroundColor:
                                themeName === "dark-theme"
                                  ? "#16181C"
                                  : "#eff3f4",
                            }}
                          >
                            <div
                              style={{
                                fontSize: font17.fontSize,
                                lineHeight: font17.lineHeight,
                              }}
                              className="premium-plus-header chirp-bold-font"
                            >
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
                                  <span
                                    className="chirp-regular-font"
                                    style={{
                                      fontSize: font15.fontSize,
                                      lineHeight: font15.lineHeight,
                                    }}
                                  >
                                    Ads in For You
                                  </span>
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
                                  <span
                                    className="chirp-regular-font"
                                    style={{
                                      fontSize: font15.fontSize,
                                      lineHeight: font15.lineHeight,
                                    }}
                                  >
                                    Reply boost
                                  </span>
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
                                  <span
                                    className="chirp-regular-font"
                                    style={{
                                      fontSize: font15.fontSize,
                                      lineHeight: font15.lineHeight,
                                    }}
                                  >
                                    Edit post
                                  </span>{" "}
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
                                    className="chirp-regular-font"
                                    style={{
                                      fontSize: font15.fontSize,
                                      lineHeight: font15.lineHeight,
                                    }}
                                  >
                                    Longer posts
                                  </span>{" "}
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
                                    className="chirp-regular-font"
                                    style={{
                                      fontSize: font15.fontSize,
                                      lineHeight: font15.lineHeight,
                                    }}
                                  >
                                    Undo post
                                  </span>{" "}
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
                                    className="chirp-regular-font"
                                    style={{
                                      fontSize: font15.fontSize,
                                      lineHeight: font15.lineHeight,
                                    }}
                                  >
                                    Post longer videos
                                  </span>{" "}
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
                                    className="chirp-regular-font"
                                    style={{
                                      fontSize: font15.fontSize,
                                      lineHeight: font15.lineHeight,
                                    }}
                                  >
                                    Top Articles
                                  </span>{" "}
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
                                  <span
                                    className="chirp-regular-font"
                                    style={{
                                      fontSize: font15.fontSize,
                                      lineHeight: font15.lineHeight,
                                    }}
                                  >
                                    Reader
                                  </span>{" "}
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
                                  <span
                                    className="chirp-regular-font"
                                    style={{
                                      fontSize: font15.fontSize,
                                      lineHeight: font15.lineHeight,
                                    }}
                                  >
                                    Background video playback
                                  </span>{" "}
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
                                    className="chirp-regular-font"
                                    style={{
                                      fontSize: font15.fontSize,
                                      lineHeight: font15.lineHeight,
                                    }}
                                  >
                                    Download videos
                                  </span>{" "}
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
                            className={`mt-3 premium-plus-parent-div premium-plus-parent-div-${themeName}`}
                            style={{
                              padding: "32px",
                              borderRadius: "16px",
                              backgroundColor:
                                themeName === "dark-theme"
                                  ? "#16181C"
                                  : "#eff3f4",
                            }}
                          >
                            <div
                              style={{
                                fontSize: font17.fontSize,
                                lineHeight: font17.lineHeight,
                              }}
                              className="premium-plus-header chirp-bold-font"
                            >
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
                                    className="chirp-regular-font"
                                    style={{
                                      fontSize: font15.fontSize,
                                      lineHeight: font15.lineHeight,
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
                                    className="chirp-regular-font"
                                    style={{
                                      fontSize: font15.fontSize,
                                      lineHeight: font15.lineHeight,
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
                                    className="chirp-regular-font"
                                    style={{
                                      fontSize: font15.fontSize,
                                      lineHeight: font15.lineHeight,
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
                                    className="chirp-regular-font"
                                    style={{
                                      fontSize: font15.fontSize,
                                      lineHeight: font15.lineHeight,
                                    }}
                                  >
                                    C Pro
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
                                    className="chirp-regular-font"
                                    style={{
                                      fontSize: font15.fontSize,
                                      lineHeight: font15.lineHeight,
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
                                    className="chirp-regular-font"
                                    style={{
                                      fontSize: font15.fontSize,
                                      lineHeight: font15.lineHeight,
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
                            className={`mt-3 premium-plus-parent-div premium-plus-parent-div-${themeName}`}
                            style={{
                              padding: "32px",
                              borderRadius: "16px",
                              backgroundColor:
                                themeName === "dark-theme"
                                  ? "#16181C"
                                  : "#eff3f4",
                            }}
                          >
                            <div
                              style={{
                                fontSize: font17.fontSize,
                                lineHeight: font17.lineHeight,
                              }}
                              className="premium-plus-header chirp-bold-font"
                            >
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
                                    className="chirp-regular-font"
                                    style={{
                                      fontSize: font15.fontSize,
                                      lineHeight: font15.lineHeight,
                                    }}
                                  >
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
                                    className="chirp-regular-font"
                                    style={{
                                      fontSize: font15.fontSize,
                                      lineHeight: font15.lineHeight,
                                    }}
                                  >
                                    Encrypted direct messages
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
                                    className="chirp-regular-font"
                                    style={{
                                      fontSize: font15.fontSize,
                                      lineHeight: font15.lineHeight,
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
                            className={`mt-3 premium-plus-parent-div premium-plus-parent-div-${themeName}`}
                            style={{
                              padding: "32px",
                              borderRadius: "16px",
                              backgroundColor:
                                themeName === "dark-theme"
                                  ? "#16181C"
                                  : "#eff3f4",
                            }}
                          >
                            <div
                              style={{
                                fontSize: font17.fontSize,
                                lineHeight: font17.lineHeight,
                              }}
                              className="premium-plus-header chirp-bold-font"
                            >
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
                                  <span
                                    className="chirp-regular-font"
                                    style={{
                                      fontSize: font15.fontSize,
                                      lineHeight: font15.lineHeight,
                                    }}
                                  >
                                    App icons
                                  </span>
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
                                  <span
                                    className="chirp-regular-font"
                                    style={{
                                      fontSize: font15.fontSize,
                                      lineHeight: font15.lineHeight,
                                    }}
                                  >
                                    Bookmark folders
                                  </span>{" "}
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
                                    className="chirp-regular-font"
                                    style={{
                                      fontSize: font15.fontSize,
                                      lineHeight: font15.lineHeight,
                                    }}
                                  >
                                    Customize navigation
                                  </span>{" "}
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
                                    className="chirp-regular-font"
                                    style={{
                                      fontSize: font15.fontSize,
                                      lineHeight: font15.lineHeight,
                                    }}
                                  >
                                    Highlights tab
                                  </span>{" "}
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
                                    className="chirp-regular-font"
                                    style={{
                                      fontSize: font15.fontSize,
                                      lineHeight: font15.lineHeight,
                                    }}
                                  >
                                    Hide your likes
                                  </span>{" "}
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
                                    className="chirp-regular-font"
                                    style={{
                                      fontSize: font15.fontSize,
                                      lineHeight: font15.lineHeight,
                                    }}
                                  >
                                    Hide your checkmark
                                  </span>{" "}
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
                                <div
                                  className="chirp-regular-font"
                                  style={{
                                    fontSize: font15.fontSize,
                                    lineHeight: font15.lineHeight,
                                  }}
                                >
                                  Hide your subscriptions
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
                          zIndex: 9999999999999,
                        }}
                        className="modal-sub-modal-payment-screen-parent"
                        dialogClassName="modal-body-sub-modal-payment-screen"
                        contentClassName={`${themeName}-sub-basic-modal`}
                      >
                        <Modal.Body
                          style={{
                            height: phoneVerifiedErrorMessage
                              ? "530px"
                              : "490px",
                          }}
                        >
                          <div
                            className="chirp-bold-font"
                            style={{
                              width: "95%",
                              fontSize: font23.fontSize,
                              lineHeight: font23.lineHeight,
                              margin: "0 auto",
                              color: themeName === "dark-theme" ? "white" : "",
                            }}
                          >
                            Premium+
                          </div>

                          <div
                            onClick={() => {
                              setindividualSubOptionPremiumPlusAnnualTab(true);
                              setindividualSubOptionPremiumPlusMonthlyTab(
                                false
                              );
                            }}
                            className={`individual-subscription-box individual-subscription-box-${themeName} mt-4`}
                            style={{
                              width: "95%",

                              minHeight: "96px",
                              padding: "12px",
                              cursor: "pointer",
                              borderWidth: "1px",
                              borderRadius: "16px",
                              backgroundColor:
                                themeName === "dark-theme" ? "black" : "",
                              filter:
                                themeName === "dark-theme"
                                  ? "drop-shadow(rgb(51, 54, 57) 1px -1px 1px)"
                                  : "",

                              boxShadow:
                                themeName === "dark-theme"
                                  ? "rgba(255, 255, 255, 0.2) 0px 0px 15px, rgba(255, 255, 255, 0.15) 0px 0px 3px 1px"
                                  : "0 0 15px rgba(101, 119,134,0.2), 0 0 5px 3px rgba(101,119,134,0.15)",
                              border: individualSubOptionPremiumPlusAnnualTab
                                ? "2px solid #339bf0"
                                : "2px solid transparent",
                              transition: "transform 0.3s ease",
                            }}
                          >
                            <span
                              className="chirp-regular-font"
                              style={{
                                color:
                                  themeName === "dark-theme"
                                    ? "#71767A"
                                    : "#697884",
                                fontSize: font14.fontSize,
                                lineHeight: font14.lineHeight,
                              }}
                            >
                              Annual Plan{" "}
                              <span
                                className="chirp-bold-font"
                                style={{
                                  fontSize: font11.fontSize,
                                  lineHeight: font11.lineHeight,
                                  borderRadius: "9999px",
                                  position: "relative",
                                  bottom: "1px",
                                  padding: "4px",
                                  height: "20px",
                                  backgroundColor:
                                    themeName === "dark-theme"
                                      ? "#05241A"
                                      : "#dcf8eb",
                                  color:
                                    themeName === "dark-theme"
                                      ? "#C2F1DC"
                                      : "rgb(0, 67, 41)",
                                }}
                              >
                                <span>Save 12%</span>
                              </span>
                            </span>

                            <span
                              className="chirp-bold-font"
                              style={{
                                color:
                                  themeName === "dark-theme"
                                    ? "white"
                                    : "rgb(15, 20, 25)",
                                fontSize: font17.fontSize,
                                lineHeight: font17.lineHeight,
                                display: "block",
                              }}
                            >
                              €199.92 / year
                            </span>
                            <div
                              className="chirp-regular-font"
                              style={{
                                color:
                                  themeName === "dark-theme"
                                    ? "#71767A"
                                    : "#697884",
                                fontSize: font13.fontSize,
                                lineHeight: font13.lineHeight,
                              }}
                            >
                              €199.92 per year billed annually
                            </div>
                          </div>
                          <div
                            className={`individual-subscription-box individual-subscription-box-${themeName} mt-3`}
                            onClick={() => {
                              setindividualSubOptionPremiumPlusMonthlyTab(true);
                              setindividualSubOptionPremiumPlusAnnualTab(false);
                            }}
                            style={{
                              width: "95%",
                              minHeight: "96px",
                              padding: "12px",
                              cursor: "pointer",
                              borderWidth: "1px",
                              borderRadius: "16px",
                              backgroundColor:
                                themeName === "dark-theme" ? "black" : "",
                              filter:
                                themeName === "dark-theme"
                                  ? "drop-shadow(rgb(51, 54, 57) 1px -1px 1px)"
                                  : "",

                              boxShadow:
                                themeName === "dark-theme"
                                  ? "rgba(255, 255, 255, 0.2) 0px 0px 15px, rgba(255, 255, 255, 0.15) 0px 0px 3px 1px"
                                  : "0 0 15px rgba(101, 119,134,0.2), 0 0 5px 3px rgba(101,119,134,0.15)",
                              border: individualSubOptionPremiumPlusMonthlyTab
                                ? "2px solid #339bf0"
                                : "2px solid transparent",
                              transition: "transform 0.3s ease",
                            }}
                          >
                            <span
                              className="chirp-regular-font"
                              style={{
                                color:
                                  themeName === "dark-theme"
                                    ? "#71767A"
                                    : "#697884",
                                fontSize: font14.fontSize,
                                lineHeight: font14.lineHeight,
                              }}
                            >
                              Monthly Plan{" "}
                            </span>

                            <div
                              className="chirp-bold-font"
                              style={{
                                color:
                                  themeName === "dark-theme"
                                    ? "white"
                                    : "rgb(15, 20, 25)",
                                fontSize: font17.fontSize,
                                lineHeight: font17.lineHeight,
                              }}
                            >
                              €19.04 / month
                              <div
                                className="chirp-regular-font"
                                style={{
                                  color:
                                    themeName === "dark-theme"
                                      ? "#71767A"
                                      : "#697884",
                                  fontSize: font13.fontSize,
                                  lineHeight: font13.lineHeight,
                                }}
                              >
                                €228.48 per year billed monthly
                              </div>
                            </div>
                          </div>
                          {phoneVerifiedErrorMessage ? (
                            <div
                              className="chirp-regular-font"
                              style={{
                                borderRadius: "8px",
                                color: "rgb(15, 20, 25)",
                                fontSize: font14.fontSize,
                                lineHeight: font14.lineHeight,
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
                            className={`login-button next-btn ${themeName}-white-btn ${
                              phoneVerifiedErrorMessage ? "mt-2" : "mt-4"
                            }`}
                            variant="dark"
                            style={{
                              width: "95%",
                              height: "36px",
                              color: "white",
                              backgroundColor:
                                themeName === "dark-theme"
                                  ? "white"
                                  : "#0f141a",
                              opacity: subErrorPhoneVerifiedTabLoading
                                ? "0.5"
                                : "1",
                            }}
                          >
                            {subErrorPhoneVerifiedTabLoading ? (
                              <LoadingSpinner
                                isCheckoutProcess={true}
                                strokeColor={"rgb(29, 155, 240)"}
                              ></LoadingSpinner>
                            ) : (
                              <span>Subscribe & Pay</span>
                            )}
                          </Button>

                          <div
                            className="mt-3 chirp-regular-font"
                            style={{
                              width: "95%",
                              fontSize: font13.fontSize,
                              lineHeight: font13.lineHeight,
                              border:
                                themeName === "dark-theme"
                                  ? "1px solid rgb(70, 70, 70)"
                                  : "1px solid black",
                              color:
                                themeName === "dark-theme"
                                  ? "#71767A"
                                  : "#697884",
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
                          zIndex: 99999999,
                        }}
                        className="modal-sub-modal-payment-screen-parent"
                        dialogClassName="modal-body-sub-modal-payment-screen"
                        contentClassName={`${themeName}-sub-basic-modal`}
                      >
                        <Modal.Body
                          style={{
                            height: phoneVerifiedErrorMessage
                              ? "530px"
                              : "490px",
                          }}
                        >
                          <div
                            className="chirp-bold-font"
                            style={{
                              width: "95%",
                              fontSize: font23.fontSize,
                              lineHeight: font23.lineHeight,
                              margin: "0 auto",
                              color: themeName === "dark-theme" ? "white" : "",
                            }}
                          >
                            Premium
                          </div>

                          <div
                            onClick={() => {
                              setindividualSubOptionPremiumPlusAnnualTab(true);
                              setindividualSubOptionPremiumPlusMonthlyTab(
                                false
                              );
                            }}
                            className={`individual-subscription-box individual-subscription-box-${themeName} mt-4`}
                            style={{
                              width: "95%",

                              minHeight: "96px",
                              padding: "12px",
                              cursor: "pointer",
                              borderWidth: "1px",
                              borderRadius: "16px",
                              backgroundColor:
                                themeName === "dark-theme" ? "black" : "",
                              filter:
                                themeName === "dark-theme"
                                  ? "drop-shadow(rgb(51, 54, 57) 1px -1px 1px)"
                                  : "",

                              boxShadow:
                                themeName === "dark-theme"
                                  ? "rgba(255, 255, 255, 0.2) 0px 0px 15px, rgba(255, 255, 255, 0.15) 0px 0px 3px 1px"
                                  : "0 0 15px rgba(101, 119,134,0.2), 0 0 5px 3px rgba(101,119,134,0.15)",
                              border: individualSubOptionPremiumPlusAnnualTab
                                ? "2px solid #339bf0"
                                : "2px solid transparent",
                              transition: "transform 0.3s ease",
                            }}
                          >
                            <span
                              className="chirp-regular-font"
                              style={{
                                color:
                                  themeName === "dark-theme"
                                    ? "#71767A"
                                    : "#697884",
                                fontSize: font14.fontSize,
                                lineHeight: font14.lineHeight,
                              }}
                            >
                              Annual Plan{" "}
                              <span
                                className="chirp-bold-font"
                                style={{
                                  fontSize: font11.fontSize,
                                  lineHeight: font11.lineHeight,
                                  borderRadius: "9999px",
                                  position: "relative",
                                  bottom: "1px",
                                  padding: "4px",
                                  height: "20px",
                                  backgroundColor:
                                    themeName === "dark-theme"
                                      ? "#05241A"
                                      : "#dcf8eb",
                                  color:
                                    themeName === "dark-theme"
                                      ? "#C2F1DC"
                                      : "rgb(0, 67, 41)",
                                }}
                              >
                                <span>Save 12%</span>
                              </span>
                            </span>

                            <span
                              className="chirp-bold-font"
                              style={{
                                color:
                                  themeName === "dark-theme"
                                    ? "white"
                                    : "rgb(15, 20, 25)",
                                fontSize: font17.fontSize,
                                lineHeight: font17.lineHeight,
                                display: "block",
                              }}
                            >
                              €99.96 / year
                            </span>
                            <div
                              className="chirp-regular-font"
                              style={{
                                color:
                                  themeName === "dark-theme"
                                    ? "#71767A"
                                    : "#697884",
                                fontSize: font13.fontSize,
                                lineHeight: font13.lineHeight,
                              }}
                            >
                              €99.96 per year billed annually
                            </div>
                          </div>
                          <div
                            className={`individual-subscription-box individual-subscription-box-${themeName} mt-3`}
                            onClick={() => {
                              setindividualSubOptionPremiumPlusMonthlyTab(true);
                              setindividualSubOptionPremiumPlusAnnualTab(false);
                            }}
                            style={{
                              width: "95%",
                              minHeight: "96px",
                              padding: "12px",
                              cursor: "pointer",
                              borderWidth: "1px",
                              borderRadius: "16px",
                              backgroundColor:
                                themeName === "dark-theme" ? "black" : "",
                              filter:
                                themeName === "dark-theme"
                                  ? "drop-shadow(rgb(51, 54, 57) 1px -1px 1px)"
                                  : "",

                              boxShadow:
                                themeName === "dark-theme"
                                  ? "rgba(255, 255, 255, 0.2) 0px 0px 15px, rgba(255, 255, 255, 0.15) 0px 0px 3px 1px"
                                  : "0 0 15px rgba(101, 119,134,0.2), 0 0 5px 3px rgba(101,119,134,0.15)",
                              border: individualSubOptionPremiumPlusMonthlyTab
                                ? "2px solid #339bf0"
                                : "2px solid transparent",
                              transition: "transform 0.3s ease",
                            }}
                          >
                            <span
                              className="chirp-regular-font"
                              style={{
                                color:
                                  themeName === "dark-theme"
                                    ? "#71767A"
                                    : "#697884",
                                fontSize: font14.fontSize,
                                lineHeight: font14.lineHeight,
                              }}
                            >
                              Monthly Plan{" "}
                            </span>

                            <div
                              className="chirp-bold-font"
                              style={{
                                color:
                                  themeName === "dark-theme"
                                    ? "white"
                                    : "rgb(15, 20, 25)",
                                fontSize: font17.fontSize,
                                lineHeight: font17.lineHeight,
                              }}
                            >
                              €9.52 / month
                              <div
                                className="chirp-regular-font"
                                style={{
                                  color:
                                    themeName === "dark-theme"
                                      ? "#71767A"
                                      : "#697884",
                                  fontSize: font13.fontSize,
                                  lineHeight: font13.lineHeight,
                                }}
                              >
                                €114.24 per year billed monthly
                              </div>
                            </div>
                          </div>
                          {phoneVerifiedErrorMessage ? (
                            <div
                              className="chirp-regular-font"
                              style={{
                                borderRadius: "8px",
                                color: "rgb(15, 20, 25)",
                                fontSize: font14.fontSize,
                                lineHeight: font14.lineHeight,
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
                            className={`login-button next-btn ${themeName}-white-btn ${
                              phoneVerifiedErrorMessage ? "mt-2" : "mt-4"
                            }`}
                            variant="dark"
                            style={{
                              width: "95%",
                              height: "36px",
                              color: "white",
                              backgroundColor:
                                themeName === "dark-theme"
                                  ? "white"
                                  : "#0f141a",
                              opacity: subErrorPhoneVerifiedTabLoading
                                ? "0.5"
                                : "1",
                            }}
                          >
                            {subErrorPhoneVerifiedTabLoading ? (
                              <LoadingSpinner
                                isCheckoutProcess={true}
                                strokeColor={"rgb(29, 155, 240)"}
                                fontSize={true}
                              ></LoadingSpinner>
                            ) : (
                              <span>Subscribe & Pay</span>
                            )}
                          </Button>

                          <div
                            className="mt-3 chirp-regular-font"
                            style={{
                              width: "95%",
                              fontSize: font13.fontSize,
                              lineHeight: font13.lineHeight,
                              border:
                                themeName === "dark-theme"
                                  ? "1px solid rgb(70, 70, 70)"
                                  : "1px solid black",
                              color:
                                themeName === "dark-theme"
                                  ? "#71767A"
                                  : "#697884",
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
                          zIndex: 99999999,
                        }}
                        className="modal-sub-modal-payment-screen-parent"
                        dialogClassName="modal-body-sub-modal-payment-screen"
                        contentClassName={`${themeName}-sub-basic-modal`}
                      >
                        <Modal.Body
                          style={{
                            height: phoneVerifiedErrorMessage
                              ? "530px"
                              : "490px",
                          }}
                        >
                          <div
                            className="chirp-bold-font"
                            style={{
                              width: "95%",
                              fontSize: font23.fontSize,
                              lineHeight: font23.lineHeight,
                              margin: "0 auto",
                              color: themeName === "dark-theme" ? "white" : "",
                            }}
                          >
                            Basic
                          </div>

                          <div
                            onClick={() => {
                              setindividualSubOptionPremiumPlusAnnualTab(true);
                              setindividualSubOptionPremiumPlusMonthlyTab(
                                false
                              );
                            }}
                            className={`individual-subscription-box individual-subscription-box-${themeName} mt-4`}
                            style={{
                              width: "95%",

                              padding: "12px",
                              cursor: "pointer",
                              borderWidth: "1px",
                              borderRadius: "16px",
                              minHeight: "96px",
                              backgroundColor:
                                themeName === "dark-theme" ? "black" : "",
                              filter:
                                themeName === "dark-theme"
                                  ? "drop-shadow(rgb(51, 54, 57) 1px -1px 1px)"
                                  : "",

                              boxShadow:
                                themeName === "dark-theme"
                                  ? "rgba(255, 255, 255, 0.2) 0px 0px 15px, rgba(255, 255, 255, 0.15) 0px 0px 3px 1px"
                                  : "0 0 15px rgba(101, 119,134,0.2), 0 0 5px 3px rgba(101,119,134,0.15)",
                              border: individualSubOptionPremiumPlusAnnualTab
                                ? "2px solid #339bf0"
                                : "2px solid transparent",
                              transition: "transform 0.3s ease",
                            }}
                          >
                            <span
                              className="chirp-regular-font"
                              style={{
                                color:
                                  themeName === "dark-theme"
                                    ? "#71767A"
                                    : "#697884",
                                fontSize: font14.fontSize,
                                lineHeight: font14.lineHeight,
                              }}
                            >
                              Annual Plan{" "}
                              <span
                                className="chirp-bold-font"
                                style={{
                                  fontSize: font11.fontSize,
                                  lineHeight: font11.lineHeight,
                                  borderRadius: "9999px",
                                  position: "relative",
                                  bottom: "1px",
                                  padding: "4px",
                                  height: "20px",
                                  backgroundColor:
                                    themeName === "dark-theme"
                                      ? "#05241A"
                                      : "#dcf8eb",
                                  color:
                                    themeName === "dark-theme"
                                      ? "#C2F1DC"
                                      : "rgb(0, 67, 41)",
                                }}
                              >
                                <span>Save 11%</span>
                              </span>
                            </span>

                            <span
                              className="chirp-bold-font"
                              style={{
                                color:
                                  themeName === "dark-theme"
                                    ? "white"
                                    : "rgb(15, 20, 25)",
                                fontSize: font17.fontSize,
                                lineHeight: font17.lineHeight,
                                display: "block",
                              }}
                            >
                              €38.08 / year
                            </span>
                            <div
                              className="chirp-regular-font"
                              style={{
                                color:
                                  themeName === "dark-theme"
                                    ? "#71767A"
                                    : "#697884",
                                fontSize: font13.fontSize,
                                lineHeight: font13.lineHeight,
                              }}
                            >
                              €38.08 per year billed annually
                            </div>
                          </div>
                          <div
                            className={`individual-subscription-box individual-subscription-box-${themeName} mt-3`}
                            onClick={() => {
                              setindividualSubOptionPremiumPlusMonthlyTab(true);
                              setindividualSubOptionPremiumPlusAnnualTab(false);
                            }}
                            style={{
                              width: "95%",
                              minHeight: "96px",
                              padding: "12px",
                              cursor: "pointer",
                              borderWidth: "1px",
                              borderRadius: "16px",
                              backgroundColor:
                                themeName === "dark-theme" ? "black" : "",
                              filter:
                                themeName === "dark-theme"
                                  ? "drop-shadow(rgb(51, 54, 57) 1px -1px 1px)"
                                  : "",

                              boxShadow:
                                themeName === "dark-theme"
                                  ? "rgba(255, 255, 255, 0.2) 0px 0px 15px, rgba(255, 255, 255, 0.15) 0px 0px 3px 1px"
                                  : "0 0 15px rgba(101, 119,134,0.2), 0 0 5px 3px rgba(101,119,134,0.15)",
                              border: individualSubOptionPremiumPlusMonthlyTab
                                ? "2px solid #339bf0"
                                : "2px solid transparent",
                              transition: "transform 0.3s ease",
                            }}
                          >
                            <span
                              className="chirp-regular-font"
                              style={{
                                color:
                                  themeName === "dark-theme"
                                    ? "#71767A"
                                    : "#697884",
                                fontSize: font14.fontSize,
                                lineHeight: font14.lineHeight,
                              }}
                            >
                              Monthly Plan{" "}
                            </span>

                            <div
                              className="chirp-bold-font"
                              style={{
                                color:
                                  themeName === "dark-theme"
                                    ? "white"
                                    : "rgb(15, 20, 25)",
                                fontSize: font17.fontSize,
                                lineHeight: font17.lineHeight,
                              }}
                            >
                              €3.57 / month
                              <div
                                className="chirp-regular-font"
                                style={{
                                  color:
                                    themeName === "dark-theme"
                                      ? "#71767A"
                                      : "#697884",
                                  fontSize: font13.fontSize,
                                  lineHeight: font13.lineHeight,
                                }}
                              >
                                €42.84 per year billed monthly
                              </div>
                            </div>
                          </div>
                          {phoneVerifiedErrorMessage ? (
                            <div
                              className="chirp-regular-font"
                              style={{
                                borderRadius: "8px",
                                color: "rgb(15, 20, 25)",
                                fontSize: font14.fontSize,
                                lineHeight: font14.lineHeight,
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
                            className={`login-button next-btn ${themeName}-white-btn ${
                              phoneVerifiedErrorMessage ? "mt-2" : "mt-4"
                            }`}
                            variant="dark"
                            style={{
                              width: "95%",
                              height: "36px",
                              color: "white",
                              backgroundColor:
                                themeName === "dark-theme"
                                  ? "white"
                                  : "#0f141a",
                              opacity: subErrorPhoneVerifiedTabLoading
                                ? "0.5"
                                : "1",
                            }}
                          >
                            {subErrorPhoneVerifiedTabLoading ? (
                              <LoadingSpinner
                                isCheckoutProcess={true}
                                strokeColor={"rgb(29, 155, 240)"}
                                fontSize={true}
                              ></LoadingSpinner>
                            ) : (
                              <span>Subscribe & Pay</span>
                            )}
                          </Button>

                          <div
                            className="mt-3 chirp-regular-font"
                            style={{
                              width: "95%",
                              fontSize: font13.fontSize,
                              lineHeight: font13.lineHeight,
                              border:
                                themeName === "dark-theme"
                                  ? "1px solid rgb(70, 70, 70)"
                                  : "1px solid black",
                              color:
                                themeName === "dark-theme"
                                  ? "#71767A"
                                  : "#697884",
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
                        maxHeight: "69px",
                        border: "none",
                        backgroundColor:
                          themeName === "dark-theme" ? "black" : "#fdfdfe",
                        position: "relative",
                        right: "15px",
                        filter:
                          themeName === "dark-theme"
                            ? "drop-shadow(rgb(51, 54, 57) 0px -1px 1px)"
                            : "",
                        boxShadow:
                          themeName === "dark-theme"
                            ? "inset 0px 4px 3px -3px rgba(50, 50, 50, 0.75)"
                            : "inset 0px 4px 3px -3px rgba(101, 119, 134, 0.15)",
                      }}
                    >
                      <div
                        style={{
                          width: "90%",
                          minHeight: "69px",
                          padding: "35px 0px",
                          position: "relative",
                          borderRight:
                            themeName !== "dark-theme"
                              ? "1px solid rgba(0, 0, 0, 0.1)"
                              : // : "0.1px solid rgb(70, 70, 70)",
                                "1px solid rgb(70, 70, 70)",
                          borderLeft:
                            themeName !== "dark-theme"
                              ? "1px solid rgba(0, 0, 0, 0.1)"
                              : // : "0.1px solid rgb(70, 70, 70)",
                                "1px solid rgb(70, 70, 70)",
                          top: "17px",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          backgroundColor:
                            themeName === "dark-theme" ? "black" : "#ffffff",
                          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                        }}
                      >
                        <Button
                          onClick={showPremiumPlusPaymentScreen}
                          className={`${themeName}-white-btn login-button next-btn `}
                          variant="dark"
                          style={{
                            width: "75%",
                            color: "white",
                            backgroundColor:
                              themeName === "dark-theme" ? "white" : "#0f141a",
                          }}
                        >
                          Starting at €19.04
                        </Button>
                      </div>
                    </Modal.Footer>
                  ) : individualSubOptionTab === 1 ? (
                    <Modal.Footer
                      style={{
                        maxHeight: "69px",
                        border: "none",
                        backgroundColor:
                          themeName === "dark-theme" ? "black" : "#fdfdfe",
                        position: "relative",
                        right: "15px",
                        filter:
                          themeName === "dark-theme"
                            ? "drop-shadow(rgb(51, 54, 57) 0px -1px 1px)"
                            : "",
                        boxShadow:
                          themeName === "dark-theme"
                            ? "inset 0px 4px 3px -3px rgba(50, 50, 50, 0.75)"
                            : "inset 0px 4px 3px -3px rgba(101, 119, 134, 0.15)",
                      }}
                    >
                      <div
                        style={{
                          width: "90%",
                          minHeight: "69px",
                          padding: "35px 0px",
                          position: "relative",
                          borderRight:
                            themeName !== "dark-theme"
                              ? "1px solid rgba(0, 0, 0, 0.1)"
                              : // : "0.1px solid rgb(70, 70, 70)",
                                "1px solid rgb(70, 70, 70)",
                          borderLeft:
                            themeName !== "dark-theme"
                              ? "1px solid rgba(0, 0, 0, 0.1)"
                              : // : "0.1px solid rgb(70, 70, 70)",
                                "1px solid rgb(70, 70, 70)",
                          top: "17px",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          backgroundColor:
                            themeName === "dark-theme" ? "black" : "#ffffff",
                          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                        }}
                      >
                        <Button
                          onClick={showPremiumPaymentScreen}
                          className={`${themeName}-white-btn login-button next-btn `}
                          variant="dark"
                          style={{
                            width: "75%",
                            color: "white",
                            backgroundColor:
                              themeName === "dark-theme" ? "white" : "#0f141a",
                          }}
                        >
                          Starting at €9.60
                        </Button>
                      </div>
                    </Modal.Footer>
                  ) : individualSubOptionTab === 0 ? (
                    <Modal.Footer
                      style={{
                        maxHeight: "69px",
                        border: "none",
                        backgroundColor:
                          themeName === "dark-theme" ? "black" : "#fdfdfe",
                        position: "relative",
                        right: "15px",
                        filter:
                          themeName === "dark-theme"
                            ? "drop-shadow(rgb(51, 54, 57) 0px -1px 1px)"
                            : "",
                        boxShadow:
                          themeName === "dark-theme"
                            ? "inset 0px 4px 3px -3px rgba(50, 50, 50, 0.75)"
                            : "inset 0px 4px 3px -3px rgba(101, 119, 134, 0.15)",
                      }}
                    >
                      <div
                        style={{
                          width: "90%",
                          minHeight: "69px",
                          padding: "35px 0px",
                          position: "relative",
                          borderRight:
                            themeName !== "dark-theme"
                              ? "1px solid rgba(0, 0, 0, 0.1)"
                              : // : "0.1px solid rgb(70, 70, 70)",
                                "1px solid rgb(70, 70, 70)",
                          borderLeft:
                            themeName !== "dark-theme"
                              ? "1px solid rgba(0, 0, 0, 0.1)"
                              : // : "0.1px solid rgb(70, 70, 70)",
                                "1px solid rgb(70, 70, 70)",
                          top: "17px",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          backgroundColor:
                            themeName === "dark-theme" ? "black" : "#ffffff",
                          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                        }}
                      >
                        <Button
                          onClick={showBasicPaymentScreen}
                          className={`${themeName}-white-btn login-button next-btn `}
                          variant="dark"
                          style={{
                            width: "75%",
                            color: "white",
                            backgroundColor:
                              themeName === "dark-theme" ? "white" : "#0f141a",
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
                      className={`scrollbar-add scrollbar-add-${themeName}`}
                      style={{
                        position: "relative",
                        bottom: "35px",
                        zIndex: 1,
                      }}
                    >
                      {subTabIndexFromOrganizationSelect !== 3 ? (
                        <>
                          <div
                            className="mt-4"
                            style={{
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <div
                              style={{
                                borderRadius: "9999px",
                                backgroundColor:
                                  themeName === "dark-theme"
                                    ? "rgb(32,35,39)"
                                    : "black",
                                padding: "2px",
                                width:
                                  font15.fontSize === "Default"
                                    ? "164px"
                                    : font15.fontSize === "Small"
                                    ? "156px"
                                    : font15.fontSize === "Extra small"
                                    ? "152px"
                                    : font15.fontSize === "Large"
                                    ? "184px"
                                    : font15.fontSize === "Extra large"
                                    ? "196px"
                                    : null,
                                height:
                                  font15.fontSize === "Default"
                                    ? "36px"
                                    : font15.fontSize === "Small"
                                    ? "35px"
                                    : font15.fontSize === "Extra small"
                                    ? "34px"
                                    : font15.fontSize === "Large"
                                    ? "38px"
                                    : font15.fontSize === "Extra large"
                                    ? "42px"
                                    : null,
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
                                  className="chirp-bold-font"
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
                                <span className="chirp-bold-font" style={{}}>
                                  Full Access
                                </span>
                              </button>
                            </div>
                          </div>
                        </>
                      ) : null}
                      {subTabIndexFromOrganizationSelect === 1 &&
                      tabStyleOrganizationBasicPlan ? (
                        <>
                          <div
                            className="mt-2"
                            style={{
                              width: "100%",
                              backgroundColor:
                                themeName === "dark-theme"
                                  ? "#16181c"
                                  : "rgba(247, 249, 249, 1.00)",
                              borderRadius: "16px",
                              padding: "16px",
                            }}
                          >
                            <div
                              className="chirp-bold-font"
                              style={{
                                color:
                                  themeName === "dark-theme"
                                    ? "#71767A"
                                    : "rgb(83, 100, 113)",
                                fontSize: font23.fontSize,
                                lineHeight: font23.lineHeight,
                              }}
                            >
                              Basic
                            </div>
                            <div
                              className="chirp-bold-font"
                              style={{
                                fontSize: font34.fontSize,
                                lineHeight: font34.lineHeight,
                                color:
                                  themeName === "dark-theme"
                                    ? "white"
                                    : "black",
                              }}
                            >
                              Find your customers and grow your business
                            </div>
                            <div
                              className="basic-plan-parent-div chirp-medium-font"
                              style={{
                                color:
                                  themeName === "dark-theme"
                                    ? "white"
                                    : "black",
                                fontSize: font15.fontSize,
                                lineHeight: font15.lineHeight,
                              }}
                            >
                              <div className="mt-2">
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
                                    color={
                                      themeName === "dark-theme" ? "white" : ""
                                    }
                                    fill="currentColor"
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
                                    color={
                                      themeName === "dark-theme" ? "white" : ""
                                    }
                                    fill="currentColor"
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
                                    color={
                                      themeName === "dark-theme" ? "white" : ""
                                    }
                                    fill="currentColor"
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
                                    color={
                                      themeName === "dark-theme" ? "white" : ""
                                    }
                                    fill="currentColor"
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
                                color:
                                  themeName === "dark-theme" ? "white" : "",
                                fontSize: font15.fontSize,
                                lineHeight: font15.lineHeight,
                              }}
                              className="mt-1 chirp-regular-font"
                            >
                              + For a limited time, advertising credit to spend
                              on your organization{" "}
                              <span
                                style={{
                                  textDecoration: "underline",
                                  fontSize: font15.fontSize,
                                  lineHeight: font15.lineHeight,
                                }}
                                className="chirp-bold-font"
                              >
                                {basicAnnualTabStyle
                                  ? "every year"
                                  : "every month"}
                              </span>{" "}
                              <span
                                className="chirp-regular-font"
                                style={{
                                  fontSize: font15.fontSize,
                                  lineHeight: font15.lineHeight,
                                }}
                              >
                                with dedicated support.{" "}
                              </span>
                              <span
                                className="learn-more-basic-plan chirp-regular-font"
                                style={{
                                  cursor: "pointer",
                                  color: "rgb(29, 155, 240)",

                                  fontSize: font15.fontSize,
                                  lineHeight: font15.lineHeight,
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
                                  setorganizationSubPlanPriceBasic("€2,261");
                                  setorganizationSubPlanTypeBasic(
                                    "Annual Plan"
                                  );
                                  setorganizationSubPlanPriceFullAccess("");
                                  setorganizationSubPlanTypeFullAccess("");
                                }}
                                style={
                                  ({ activeIndividualOptionTabStyle },
                                  {
                                    flex: 1,
                                    maxHeight: "72px",
                                    padding: "12px",
                                    cursor: "pointer",
                                    borderWidth: "1px",
                                    borderRadius: "16px",
                                    backgroundColor:
                                      themeName === "dark-theme"
                                        ? "black"
                                        : "white",
                                    filter:
                                      themeName === "dark-theme"
                                        ? "drop-shadow(rgb(51, 54, 57) 1px -1px 1px)"
                                        : "",

                                    boxShadow:
                                      themeName === "dark-theme"
                                        ? "rgba(255, 255, 255, 0.2) 0px 0px 15px, rgba(255, 255, 255, 0.15) 0px 0px 3px 1px"
                                        : "0 0 15px rgba(101, 119,134,0.2), 0 0 5px 3px rgba(101,119,134,0.15)",
                                    border: basicAnnualTabStyle
                                      ? "2px solid #339bf0"
                                      : "2px solid transparent",
                                    transition: "transform 0.3s ease",
                                  })
                                }
                                className={`organization-subscription-box organization-subscription-box-${themeName}`}
                              >
                                <div>
                                  <div
                                    className="chirp-bold-font"
                                    style={{
                                      color:
                                        themeName === "dark-theme"
                                          ? "white"
                                          : "rgb(15, 20, 25)",
                                      fontSize: font17.fontSize,
                                      lineHeight: font17.lineHeight,
                                      display: " flex",
                                    }}
                                  >
                                    {" "}
                                    <div>{yearlyFee} / year</div>
                                    <div
                                      className="chirp-bold-font"
                                      style={{
                                        fontSize: font11.fontSize,
                                        lineHeight: font11.lineHeight,
                                        borderRadius: "9999px",
                                        height: "20px",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        position: "relative",
                                        top: "5px",
                                        left: "3px",
                                        backgroundColor:
                                          themeName === "dark-theme"
                                            ? "#05241A"
                                            : "#dcf8eb",
                                        color:
                                          themeName === "dark-theme"
                                            ? "#C2F1DC"
                                            : "rgb(0, 67, 41)",
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
                                    className="chirp-regular-font"
                                    style={{
                                      color:
                                        themeName === "dark-theme"
                                          ? "#71767A"
                                          : "rgb(83, 100, 113)",
                                      fontSize: font14.fontSize,
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
                                  setbasicAnnualTabStyle(false);
                                  setbasicMonthlyTabStyle(true);
                                  setorganizationSubPlanPriceBasic("€226.10");
                                  setorganizationSubPlanTypeBasic(
                                    "Monthly Plan"
                                  );
                                  setorganizationSubPlanPriceFullAccess("");
                                  setorganizationSubPlanTypeFullAccess("");
                                }}
                                style={
                                  ({ activeOrganizationOptionTabStyle },
                                  {
                                    flex: 1,
                                    maxHeight: "72px",
                                    padding: "12px",
                                    cursor: "pointer",
                                    borderWidth: "1px",
                                    borderRadius: "16px",
                                    backgroundColor:
                                      themeName === "dark-theme"
                                        ? "black"
                                        : "white",
                                    filter:
                                      themeName === "dark-theme"
                                        ? "drop-shadow(rgb(51, 54, 57) 1px -1px 1px)"
                                        : "",

                                    boxShadow:
                                      themeName === "dark-theme"
                                        ? "rgba(255, 255, 255, 0.2) 0px 0px 15px, rgba(255, 255, 255, 0.15) 0px 0px 3px 1px"
                                        : "0 0 15px rgba(101, 119,134,0.2), 0 0 5px 3px rgba(101,119,134,0.15)",
                                    border: basicMonthlyTabStyle
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
                                    className="chirp-bold-font"
                                    style={{
                                      color:
                                        themeName === "dark-theme"
                                          ? "white"
                                          : "rgb(15, 20, 25)",
                                      fontSize: font17.fontSize,
                                      lineHeight: font17.lineHeight,
                                    }}
                                  >
                                    {monthyleFee} / month
                                  </div>{" "}
                                  <div
                                    className="chirp-regular-font"
                                    style={{
                                      color:
                                        themeName === "dark-theme"
                                          ? "#71767A"
                                          : "rgb(83, 100, 113)",
                                      fontSize: font14.fontSize,
                                    }}
                                  >
                                    Monthly plan
                                  </div>
                                </div>
                              </div>
                              {/* monthly plan finish to check  */}
                            </div>
                            <div
                              className="mt-3 chirp-regular-font"
                              style={{
                                color:
                                  themeName === "dark-theme"
                                    ? "#4A4F51"
                                    : "rgb(83, 100, 113)",
                                fontSize: font11.fontSize,
                                lineHeight: font11.lineHeight,
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
                              onClick={
                                !checkoutProcessLoadingBar
                                  ? () =>
                                      handleCheckoutStripeApiOrganizationBasic()
                                  : null
                              }
                              className={`mt-4 subscribe-btn-basic-plan subscribe-btn-basic-plan-${themeName}`}
                              style={{
                                backgroundColor:
                                  themeName === "dark-theme"
                                    ? "rgb(239,243,244)"
                                    : "#0f1518",
                                color: "white",
                                height: "34px",
                                width: "100%",
                                borderRadius: "9999px",
                                border: " none",
                                opacity: !checkoutProcessLoadingBar
                                  ? "1"
                                  : "0.5",
                              }}
                              variant="info"
                            >
                              {checkoutProcessLoadingBar ? (
                                <LoadingSpinner
                                  isCheckoutProcess={true}
                                  strokeColor={"rgb(29, 155, 240)"}
                                  fontSize={true}
                                ></LoadingSpinner>
                              ) : (
                                <>
                                  <div
                                    className="chirp-bold-font"
                                    style={{
                                      color:
                                        themeName === "dark-theme"
                                          ? "black"
                                          : "",
                                      fontSize: font15.fontSize,
                                      lineHeight: font15.lineHeight,
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
                                </>
                              )}
                            </Button>
                            <div
                              className="mt-4 chirp-regular-font"
                              style={{
                                width: "100%",
                                color:
                                  themeName === "dark-theme"
                                    ? "#4A4F51"
                                    : "rgb(83, 100, 113)",
                                fontSize: font11.fontSize,
                                lineHeight: font11.lineHeight,
                                height: "40px",
                              }}
                            >
                              By clicking Subscribe, you agree to our{" "}
                              <span
                                className="text-decoration-thickness-2px"
                                style={{
                                  cursor: "pointer",
                                  color:
                                    themeName === "dark-theme"
                                      ? "white"
                                      : "rgb(15, 20, 25)",
                                  textDecoration: "underline",
                                  textDecorationColor:
                                    themeName === "dark-theme"
                                      ? "white"
                                      : "rgb(15, 20, 25)",
                                }}
                              >
                                Purchaser Terms of Service.
                              </span>{" "}
                              Subscriptions auto-renew until canceled. All
                              accounts that sign up must pass manual approval.
                            </div>
                          </div>
                        </>
                      ) : subTabIndexFromOrganizationSelect === 2 &&
                        tabStyleOrganizationFullAccessPlan ? (
                        <>
                          {" "}
                          <div
                            className="mt-2"
                            style={{
                              width: "100%",
                              backgroundColor:
                                themeName === "dark-theme"
                                  ? "#16181c"
                                  : "rgba(247, 249, 249, 1.00)",
                              borderRadius: "16px",
                              padding: "16px",
                            }}
                          >
                            <div
                              className="chirp-bold-font"
                              style={{
                                color:
                                  themeName === "dark-theme"
                                    ? "#71767A"
                                    : "rgb(83, 100, 113)",
                                fontSize: font23.fontSize,
                                lineHeight: font23.lineHeight,
                              }}
                            >
                              Full Access
                            </div>
                            <div
                              className="chirp-bold-font"
                              style={{
                                fontSize: font34.fontSize,
                                lineHeight: font34.lineHeight,
                                color:
                                  themeName === "dark-theme"
                                    ? "white"
                                    : "black",
                              }}
                            >
                              Find your customers and grow your business
                            </div>
                            <div
                              className="basic-plan-parent-div chirp-medium-font"
                              style={{
                                fontSize: font15.fontSize,
                                lineHeight: font15.lineHeight,
                                color:
                                  themeName === "dark-theme"
                                    ? "white"
                                    : "black",
                              }}
                            >
                              <div className="mt-2">
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
                                    color={
                                      themeName === "dark-theme" ? "white" : ""
                                    }
                                    fill="currentColor"
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
                                    color={
                                      themeName === "dark-theme" ? "white" : ""
                                    }
                                    fill="currentColor"
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
                                    color={
                                      themeName === "dark-theme" ? "white" : ""
                                    }
                                    fill="currentColor"
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
                                    color={
                                      themeName === "dark-theme" ? "white" : ""
                                    }
                                    fill="currentColor"
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
                                fontSize: font15.fontSize,
                                lineHeight: font15.lineHeight,
                                color:
                                  themeName === "dark-theme" ? "white" : "",
                              }}
                              className="mt-1 chirp-regular-font"
                            >
                              + For a limited time, advertising credit to spend
                              on your organization any of its affiliates{" "}
                              <span
                                className="chirp-bold-font"
                                style={{
                                  fontSize: font15.fontSize,
                                  lineHeight: font15.lineHeight,
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
                                  setorganizationSubPlanPriceFullAccess(
                                    "€11,305"
                                  );
                                  setorganizationSubPlanTypeFullAccess(
                                    "Annual Plan"
                                  );
                                  setorganizationSubPlanPriceBasic("");
                                  setorganizationSubPlanTypeBasic("");
                                }}
                                style={
                                  ({ activeIndividualOptionTabStyle },
                                  {
                                    flex: 1,
                                    maxHeight: "72px",
                                    padding: "12px",
                                    cursor: "pointer",
                                    borderWidth: "1px",
                                    borderRadius: "16px",
                                    backgroundColor:
                                      themeName === "dark-theme"
                                        ? "black"
                                        : "white",
                                    filter:
                                      themeName === "dark-theme"
                                        ? "drop-shadow(rgb(51, 54, 57) 1px -1px 1px)"
                                        : "",

                                    boxShadow:
                                      themeName === "dark-theme"
                                        ? "rgba(255, 255, 255, 0.2) 0px 0px 15px, rgba(255, 255, 255, 0.15) 0px 0px 3px 1px"
                                        : "0 0 15px rgba(101, 119,134,0.2), 0 0 5px 3px rgba(101,119,134,0.15)",
                                    border: fullAccessAnnualTabStyle
                                      ? "2px solid #339bf0"
                                      : "2px solid transparent",
                                    transition: "transform 0.3s ease",
                                  })
                                }
                                className={`organization-subscription-box organization-subscription-box-${themeName}`}
                              >
                                <div>
                                  <div
                                    className="chirp-bold-font"
                                    style={{
                                      color:
                                        themeName === "dark-theme"
                                          ? "white"
                                          : "rgb(15, 20, 25)",
                                      fontSize: font17.fontSize,
                                      lineHeight: font17.lineHeight,
                                      display: " flex",
                                    }}
                                  >
                                    {" "}
                                    <div>{yearlyFeeFullAccess} / year</div>
                                    <div
                                      className="chirp-bold-font"
                                      style={{
                                        borderRadius: "9999px",
                                        height: "20px",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        position: "relative",
                                        top: "5px",
                                        left: "3px",
                                        backgroundColor:
                                          themeName === "dark-theme"
                                            ? "#05241A"
                                            : "#dcf8eb",
                                        color:
                                          themeName === "dark-theme"
                                            ? "#C2F1DC"
                                            : "rgb(0, 67, 41)",
                                        fontSize: font11.fontSize,
                                        lineHeight: font11.lineHeight,
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
                                    className="chirp-regular-font"
                                    style={{
                                      color:
                                        themeName === "dark-theme"
                                          ? "#71767A"
                                          : "rgb(83, 100, 113)",
                                      fontSize: font14.fontSize,
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
                                  setfullAccessAnnualTabStyle(false);
                                  setfullAccessMonthlyTabStyle(true);
                                  setorganizationSubPlanPriceFullAccess(
                                    "€1,130.50"
                                  );
                                  setorganizationSubPlanTypeFullAccess(
                                    "Monthly Plan"
                                  );
                                  setorganizationSubPlanPriceBasic("");
                                  setorganizationSubPlanTypeBasic("");
                                }}
                                style={
                                  ({ activeOrganizationOptionTabStyle },
                                  {
                                    flex: 1,
                                    maxHeight: "72px",
                                    padding: "12px",
                                    cursor: "pointer",
                                    borderWidth: "1px",
                                    borderRadius: "16px",
                                    backgroundColor:
                                      themeName === "dark-theme"
                                        ? "black"
                                        : "white",
                                    filter:
                                      themeName === "dark-theme"
                                        ? "drop-shadow(rgb(51, 54, 57) 1px -1px 1px)"
                                        : "",

                                    boxShadow:
                                      themeName === "dark-theme"
                                        ? "rgba(255, 255, 255, 0.2) 0px 0px 15px, rgba(255, 255, 255, 0.15) 0px 0px 3px 1px"
                                        : "0 0 15px rgba(101, 119,134,0.2), 0 0 5px 3px rgba(101,119,134,0.15)",
                                    border: fullAccessMonthlyTabStyle
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
                                    className="chirp-bold-font"
                                    style={{
                                      color:
                                        themeName === "dark-theme"
                                          ? "white"
                                          : "rgb(15, 20, 25)",
                                      fontSize: font17.fontSize,
                                      lineHeight: font17.lineHeight,
                                    }}
                                  >
                                    {monthyleFeeFullAccess} / month
                                  </div>{" "}
                                  <div
                                    className="chirp-regular-font"
                                    style={{
                                      color:
                                        themeName === "dark-theme"
                                          ? "#71767A"
                                          : "rgb(83, 100, 113)",
                                      fontSize: font14.fontSize,
                                    }}
                                  >
                                    Monthly plan
                                  </div>
                                </div>
                              </div>
                              {/* monthly plan finish to check  */}
                            </div>
                            <div
                              className="mt-3 chirp-regular-font"
                              style={{
                                color:
                                  themeName === "dark-theme"
                                    ? "#4A4F51"
                                    : "rgb(83, 100, 113)",
                                fontSize: font11.fontSize,
                                lineHeight: font11.lineHeight,
                                height: "20px",
                              }}
                            >
                              {" "}
                              <span>
                                Full Access is{" "}
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
                                handleFullAccessOrganizationPlanModal()
                              }
                              className={`mt-4 subscribe-btn-full-access-plan subscribe-btn-full-access-plan-${themeName}`}
                              style={{
                                backgroundColor:
                                  themeName === "dark-theme"
                                    ? "rgb(239,243,244)"
                                    : "#0f1518",
                                color: "white",
                                height: "34px",
                                width: "100%",
                                borderRadius: "9999px",
                                border: " none",
                                opacity: !checkoutProcessLoadingBar
                                  ? "1"
                                  : "0.5",
                              }}
                              variant="info"
                            >
                              <div
                                className="chirp-bold-font"
                                style={{
                                  color:
                                    themeName === "dark-theme" ? "black" : "",
                                  fontSize: font15.fontSize,
                                  lineHeight: font15.lineHeight,
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
                              className="mt-4 chirp-regular-font"
                              style={{
                                color:
                                  themeName === "dark-theme"
                                    ? "#4A4F51"
                                    : "rgb(83, 100, 113)",
                                fontSize: font11.fontSize,
                                lineHeight: font11.lineHeight,
                                height: "40px",
                              }}
                            >
                              By clicking Subscribe, you agree to our{" "}
                              <span
                                className="text-decoration-thickness-2px"
                                style={{
                                  cursor: "pointer",
                                  color:
                                    themeName === "dark-theme"
                                      ? "white"
                                      : "rgb(15, 20, 25)",
                                  textDecoration: "underline",
                                  textDecorationColor:
                                    themeName === "dark-theme"
                                      ? "white"
                                      : "rgb(15, 20, 25)",
                                }}
                              >
                                Purchaser Terms of Service.
                              </span>{" "}
                              Subscriptions auto-renew until canceled. Accounts
                              that sign up are reviewed for authenticity. If an
                              account signs up and is not an organization, you
                              will be rejected and not refunded.
                            </div>
                          </div>
                        </>
                      ) : subTabIndexFromOrganizationSelect === 3 ? (
                        <>
                          {" "}
                          <div
                            className="mt-4 chirp-heavy-font"
                            style={{
                              color:
                                themeName === "dark-theme" ? "white" : "black",
                              width: "100%",
                              fontSize: font31.fontSize,
                              lineHeight: font31.lineHeight,
                            }}
                          >
                            Apply for Full Access
                          </div>
                          <div
                            className="mt-3 chirp-regular-font"
                            style={{
                              width: "100%",
                              color:
                                themeName === "dark-theme"
                                  ? "#71767A"
                                  : "rgb(83, 100, 113)",
                              fontSize: font15.fontSize,
                              lineHeight: font15.lineHeight,
                            }}
                          >
                            We’ll use this information to assess your
                            application. Upon receipt of payment and if
                            eligible, you’ll be invited to activate your
                            account. For information learn more{" "}
                            <span
                              className="apply-for-access-text-underline"
                              style={{
                                color: "rgb(29, 155, 240)",
                                cursor: "pointer",
                              }}
                            >
                              here
                            </span>
                            .
                          </div>
                          {/* text fields start to check  */}
                          <TextField
                            className="mt-3"
                            value={organizationName}
                            onChange={(e) =>
                              setOrganizationName(e.target.value)
                            }
                            type="text"
                            id="outlined-basic"
                            variant={"outlined"}
                            label={`Organization name`}
                            style={{
                              width: "100%",
                              height: "58px",
                            }}
                            error={organizationNameFilled && !organizationName}
                            InputLabelProps={{
                              style: {
                                color:
                                  themeName === "dark-theme" ? "white" : "",
                              },
                            }}
                            InputProps={{
                              style: {
                                color:
                                  themeName === "dark-theme"
                                    ? "white"
                                    : "black",
                              },
                            }}
                            sx={{
                              "& .Mui-focused input + fieldset": {
                                border:
                                  organizationNameFilled && !organizationName
                                    ? "2px solid rgb(244, 33, 46)!important"
                                    : "2px solid #1d9bf0 !important",
                              },
                              "& .MuiOutlinedInput-notchedOutline": {
                                borderColor:
                                  organizationNameFilled && !organizationName
                                    ? "rgb(244, 33, 46)!important"
                                    : themeName !== "dark-theme"
                                    ? "#cfd9de !important"
                                    : "#333639 !important",
                              },
                              "& .MuiInputLabel-shrink": {
                                color:
                                  organizationNameFilled && !organizationName
                                    ? "rgb(244, 33, 46)!important"
                                    : "#1f9cf0 !important",
                              },
                            }}
                          />
                          <div
                            className="mt-3"
                            style={{
                              width: "100%",
                            }}
                          >
                            <TextField
                              style={{
                                width: "100%",
                                height: "60px",
                              }}
                              disabled
                              id="filled-disabled"
                              label={
                                <div
                                  style={{
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    alignItems: "center",
                                  }}
                                >
                                  <div
                                    style={{
                                      fontSize: font13.fontSize,
                                      position: "relative",
                                      bottom: "5px",
                                    }}
                                  >
                                    Organization @handle
                                  </div>
                                  <div
                                    style={{
                                      position: "relative",
                                      bottom: "5px",
                                    }}
                                  >
                                    {`@${userInfo.username}`}
                                  </div>
                                </div>
                              } // defaultValue={`@${userInfo.username}`}
                              variant="filled"
                              InputLabelProps={{
                                style: {
                                  color:
                                    themeName === "dark-theme"
                                      ? "#3C3F41"
                                      : "#999A9B",
                                },
                              }}
                              InputProps={{
                                disableUnderline: true, // Alt çizgiyi kaldırır
                              }}
                              sx={{
                                "& .MuiFilledInput-root": {
                                  background:
                                    themeName === "dark-theme"
                                      ? "#0D0E11 !important"
                                      : "#f7f9fa !important",
                                  height: "60px",
                                },
                              }}
                            />
                          </div>
                          <TextField
                            className="mt-3"
                            type="text"
                            id="outlined-basic"
                            variant={"outlined"}
                            label={`Your full name`}
                            style={{
                              width: "100%",
                              height: "58px",
                            }}
                            value={yourFullName}
                            onChange={(e) => setYourFullName(e.target.value)}
                            error={
                              organizationYourFullNameFilled && !yourFullName
                            }
                            InputLabelProps={{
                              style: {
                                color:
                                  themeName === "dark-theme" ? "white" : "",
                              },
                            }}
                            InputProps={{
                              style: {
                                color:
                                  themeName === "dark-theme"
                                    ? "white"
                                    : "black",
                              },
                            }}
                            sx={{
                              "& .Mui-focused input + fieldset": {
                                border:
                                  organizationYourFullNameFilled &&
                                  !yourFullName
                                    ? "2px solid rgb(244, 33, 46)!important"
                                    : "2px solid #1d9bf0 !important",
                              },
                              "& .MuiOutlinedInput-notchedOutline": {
                                borderColor:
                                  organizationYourFullNameFilled &&
                                  !yourFullName
                                    ? "rgb(244, 33, 46)!important"
                                    : themeName !== "dark-theme"
                                    ? "#cfd9de !important"
                                    : "#333639 !important",
                              },
                              "& .MuiInputLabel-shrink": {
                                color:
                                  organizationYourFullNameFilled &&
                                  !yourFullName
                                    ? "rgb(244, 33, 46)!important"
                                    : "#1f9cf0 !important",
                              },
                            }}
                          />
                          <TextField
                            className="mt-3"
                            type="text"
                            id="outlined-basic"
                            variant={"outlined"}
                            label={`Organization email address`}
                            style={{
                              width: "100%",
                              height: "58px",
                            }}
                            value={organizationEmailAdress}
                            onChange={(e) =>
                              setOrganizationEmailAdress(e.target.value)
                            }
                            error={
                              (organizationEmailAdressFilled &&
                                !organizationEmailAdress) ||
                              invalidEmailError
                            }
                            InputLabelProps={{
                              style: {
                                color:
                                  themeName === "dark-theme" ? "white" : "",
                              },
                            }}
                            InputProps={{
                              style: {
                                color:
                                  themeName === "dark-theme"
                                    ? "white"
                                    : "black",
                              },
                            }}
                            sx={{
                              "& .Mui-focused input + fieldset": {
                                border:
                                  (organizationEmailAdressFilled &&
                                    !organizationEmailAdress) ||
                                  invalidEmailError
                                    ? "2px solid rgb(244, 33, 46)!important"
                                    : "2px solid #1d9bf0 !important",
                              },
                              "& .MuiOutlinedInput-notchedOutline": {
                                borderColor:
                                  (organizationEmailAdressFilled &&
                                    !organizationEmailAdress) ||
                                  invalidEmailError
                                    ? "rgb(244, 33, 46) !important"
                                    : themeName !== "dark-theme"
                                    ? "#cfd9de !important"
                                    : "#333639 !important",
                              },
                              "& .MuiInputLabel-shrink": {
                                color:
                                  (organizationEmailAdressFilled &&
                                    !organizationEmailAdress) ||
                                  invalidEmailError
                                    ? "rgb(244, 33, 46)!important"
                                    : "#1f9cf0 !important",
                              },
                            }}
                          />
                          {invalidEmailError && organizationEmailAdress ? (
                            <div
                              className="chirp-regular-font"
                              style={{
                                color: "rgb(244, 33, 46)",
                                fontSize: font13.fontSize,
                                lineHeight: font13.lineHeight,
                                width: "100%",
                                position: "relative",
                                left: "10px",
                                top: "2px",
                              }}
                            >
                              {invalidEmailError}
                            </div>
                          ) : null}
                          <TextField
                            className="mt-3"
                            type="text"
                            id="outlined-basic"
                            variant={"outlined"}
                            label={`Organization website`}
                            style={{
                              width: "100%",
                              height: "58px",
                            }}
                            value={organizationWebSite}
                            onChange={(e) =>
                              setOrganizationWebSite(e.target.value)
                            }
                            error={
                              organizationWebSiteFilled && !organizationWebSite
                            }
                            InputLabelProps={{
                              style: {
                                color:
                                  themeName === "dark-theme" ? "white" : "",
                              },
                            }}
                            InputProps={{
                              style: {
                                color:
                                  themeName === "dark-theme"
                                    ? "white"
                                    : "black",
                              },
                            }}
                            sx={{
                              "& .Mui-focused input + fieldset": {
                                border:
                                  organizationWebSiteFilled &&
                                  !organizationWebSite
                                    ? "2px solid rgb(244, 33, 46)!important"
                                    : "2px solid #1d9bf0 !important",
                              },
                              "& .MuiOutlinedInput-notchedOutline": {
                                borderColor:
                                  organizationWebSiteFilled &&
                                  !organizationWebSite
                                    ? "rgb(244, 33, 46)!important"
                                    : themeName !== "dark-theme"
                                    ? "#cfd9de !important"
                                    : "#333639 !important",
                              },
                              "& .MuiInputLabel-shrink": {
                                color:
                                  organizationWebSiteFilled &&
                                  !organizationWebSite
                                    ? "rgb(244, 33, 46)!important"
                                    : "#1f9cf0 !important",
                              },
                            }}
                          />
                          {/* organization type  start to check  */}
                          <PopupState
                            variant="popover"
                            popupId="demo-popup-popover"
                          >
                            {(popupState) => (
                              <div
                                style={{
                                  width: "100%",
                                }}
                              >
                                <div
                                  {...bindTrigger(popupState)}
                                  className="mt-3"
                                  style={{
                                    borderRadius: "4px",
                                    cursor: "pointer",
                                    color: "#536471",
                                    width: "100%",
                                    minHeight: "58px",
                                    padding: "4px",
                                    border:
                                      themeName === "dark-theme"
                                        ? "1px solid #cfd9de"
                                        : "1px solid rgb(207, 217, 222)",
                                    borderWidth: showOrganizationTypeContent
                                      ? "2px"
                                      : "1px",
                                    borderColor:
                                      organizationDisplayedOrganizationTypeFilled &&
                                      !displayedOrganizationType
                                        ? "rgb(244, 33, 46)"
                                        : showOrganizationTypeContent
                                        ? "#1d9bf0"
                                        : themeName === "dark-theme"
                                        ? "#333639"
                                        : "#cfd9de",
                                  }}
                                >
                                  <div
                                    style={{
                                      display: "inline-block",
                                      float: "left",
                                    }}
                                  >
                                    <div
                                      className="main-outline-text-year-picker chirp-regular-font"
                                      style={{
                                        position: "relative",
                                        left: "10px",
                                        top: "5px",
                                        fontSize: font14.fontSize,
                                        lineHeight: font14.lineHeight,
                                        color: showOrganizationTypeContent
                                          ? "#1d9bf0"
                                          : "rgba(83,100,113,1.00)",
                                      }}
                                    >
                                      <span
                                        style={{
                                          color:
                                            organizationDisplayedOrganizationTypeFilled &&
                                            !displayedOrganizationType
                                              ? "rgb(244, 33, 46)"
                                              : themeName === "dark-theme"
                                              ? "#71767A"
                                              : "rgb(83, 100, 113)",
                                        }}
                                      >
                                        Organization Type
                                      </span>
                                    </div>
                                    <div
                                      className="mt-2 selected-year-string-parent-div chirp-bold-font"
                                      style={{
                                        position: "relative",
                                        left: "10px",
                                        fontSize: font17.fontSize,
                                        lineHeight: font17.lineHeight,
                                        color: "black",
                                      }}
                                    >
                                      {displayedOrganizationType}
                                    </div>
                                  </div>
                                  <div
                                    style={{
                                      float: "right",
                                      position: "relative",
                                      // top: "30%",
                                      minHeight: "50px",
                                      display: "flex",
                                      justifyContent: "center",
                                      alignItems: "center",
                                    }}
                                  >
                                    <svg
                                      width={`${1.5}em`}
                                      height={`${1.5}em`}
                                      color={
                                        showOrganizationTypeContent
                                          ? "#1d9bf0"
                                          : "rgba(83,100,113,1.00)"
                                      }
                                      fill="currentColor"
                                      viewBox="0 0 24 24"
                                      aria-hidden="true"
                                      className="svg-year-picker r-4qtqp9 r-yyyyoo r-dnmrzs r-1plcrui r-lrvibr r-14j79pv r-1pgswnq r-50lct3 r-fdch1b r-633pao r-u8s1d r-1v2oles"
                                    >
                                      <g className="path-parent-g-year-picker">
                                        <path d="M3.543 8.96l1.414-1.42L12 14.59l7.043-7.05 1.414 1.42L12 17.41 3.543 8.96z"></path>
                                      </g>
                                    </svg>
                                  </div>
                                </div>
                                <Popover
                                  open={popupState.open}
                                  onClose={popupState.close}
                                  {...bindPopover(popupState)}
                                  anchorOrigin={{
                                    vertical: "top",
                                    horizontal: "center",
                                  }}
                                  transformOrigin={{
                                    vertical: "bottom",
                                    horizontal: "center",
                                  }}
                                  style={{
                                    zIndex: 9999999,
                                  }}
                                  className={`${
                                    themeName === "dark-theme"
                                      ? "popover-material-ui-dark-theme-organization-type"
                                      : themeName !== "dark-theme"
                                      ? "popover-material-ui-light-theme-organization-type"
                                      : "hideshowMessageDeletePopover"
                                  }`}
                                >
                                  <div
                                    onMouseEnter={() => {
                                      sethoveredOrganizationType("business");
                                    }}
                                    onClick={() => {
                                      setshowOrganizationTypeContent(false);
                                      popupState.close();
                                      setTimeout(() => {
                                        setdisplayedOrganizationType(
                                          "Business"
                                        );
                                      }, 150);
                                    }}
                                    style={{
                                      padding: "8px",
                                      cursor: "pointer",
                                      backgroundColor:
                                        hoveredOrganizationType === "business"
                                          ? "#5aa0ff"
                                          : "",
                                      borderRadius: "4px",
                                      color:
                                        themeName === "dark-theme"
                                          ? "white"
                                          : "black",
                                    }}
                                  >
                                    Business
                                  </div>
                                  <div
                                    onMouseEnter={() => {
                                      sethoveredOrganizationType("government");
                                    }}
                                    onClick={() => {
                                      setshowOrganizationTypeContent(false);
                                      popupState.close();
                                      setTimeout(() => {
                                        setdisplayedOrganizationType(
                                          "Government"
                                        );
                                      }, 150);
                                    }}
                                    style={{
                                      padding: "8px",
                                      cursor: "pointer",
                                      backgroundColor:
                                        hoveredOrganizationType === "government"
                                          ? "#5aa0ff"
                                          : "",
                                      borderRadius: "4px",
                                      color:
                                        themeName === "dark-theme"
                                          ? "white"
                                          : "black",
                                    }}
                                  >
                                    Government
                                  </div>
                                </Popover>
                              </div>
                            )}
                          </PopupState>
                          {/* organization type  finish to check  */}
                          {/* text fields finish to check  */}
                          <div
                            className="mt-3"
                            style={{
                              width: "81.5%",
                              gap: "2.5%",
                              display: "flex",
                            }}
                          >
                            <div
                              style={{
                                width: "50px",
                              }}
                            >
                              <div
                                onClick={() => setClicked(!clicked)}
                                style={{
                                  width: "36px",
                                  height: "36px",
                                  borderRadius: "50%",
                                  cursor: "pointer",
                                  marginBlock: "0.5em",
                                }}
                                className={
                                  themeName === "dark-theme" && clicked
                                    ? "hover-background-effect-clicked-dark-theme"
                                    : themeName !== "dark-theme" && clicked
                                    ? "hover-background-effect-clicked-light-theme"
                                    : themeName === "dark-theme" && !clicked
                                    ? "hover-background-effect-dark-theme"
                                    : themeName !== "dark-theme" && !clicked
                                    ? "hover-background-effect-light-theme"
                                    : ""
                                }
                              >
                                <div
                                  style={{
                                    backgroundColor: clicked
                                      ? "#1d9bf0"
                                      : "transparent",
                                    border: clicked
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
                                      display: clicked ? "initial" : "none",
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
                            <div
                              className="mt-2 chirp-regular-font"
                              style={{
                                color:
                                  themeName === "dark-theme"
                                    ? "#71767A"
                                    : "rgb(83, 100, 113)",
                                fontSize: font15.fontSize,
                                lineHeight: font15.lineHeight,
                                position: "relative",
                                bottom: "4px",
                              }}
                            >
                              By checking this box you indicate you have read
                              and agree to the terms and conditions available{" "}
                              <span
                                style={{
                                  color: "rgb(29, 155, 240)",
                                  cursor: "pointer",
                                }}
                              >
                                here
                              </span>
                              .
                            </div>
                          </div>
                          <Button
                            onClick={
                              clicked && !checkoutProcessLoadingBar
                                ? () =>
                                    handleSubmitOrganizationInformationForFullAccessSubscription(
                                      organizationName,
                                      yourFullName,
                                      organizationEmailAdress,
                                      organizationWebSite,
                                      displayedOrganizationType
                                    )
                                : ""
                            }
                            className={`mt-4 subscribe-btn-full-access-plan subscribe-btn-full-access-plan-${themeName}`}
                            variant="dark"
                            style={{
                              outlineStyle: "none",
                              borderStyle: "none",
                              transitionDuration: "0.2s",
                              border: " none",
                              width: "81.5%",
                              height: "36px",
                              color: themeName === "dark-theme" ? "black" : "",
                              backgroundColor:
                                themeName === "dark-theme"
                                  ? "rgb(239,243,244)"
                                  : "#0f1518",
                              opacity:
                                clicked && !checkoutProcessLoadingBar
                                  ? "1"
                                  : "0.5",
                            }}
                          >
                            {checkoutProcessLoadingBar ? (
                              <LoadingSpinner
                                isCheckoutProcess={true}
                                strokeColor={"rgb(29, 155, 240)"}
                                fontSize={true}
                              ></LoadingSpinner>
                            ) : (
                              <span>Submit</span>
                            )}
                          </Button>
                        </>
                      ) : null}
                    </Modal.Body>
                  </>
                </>
              ) : tabIndex === 2 &&
                !phoneVerified &&
                !showVerifyPhoneNumberPasswordModal ? (
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
                          width: "81.5%",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          position: "absolute",
                          bottom: "50px",
                        }}
                      >
                        <div
                          className="chirp-heavy-font"
                          style={{
                            fontSize: font26.fontSize,
                            lineHeight: font26.lineHeight,
                            color: themeName === "dark-theme" ? "white" : "",
                          }}
                        >
                          Verify your phone number
                        </div>
                        <div
                          className="mt-2 chirp-regular-font"
                          style={{
                            fontSize: font15.fontSize,
                            lineHeight: font15.lineHeight,
                            color:
                              themeName === "dark-theme"
                                ? "#71767A"
                                : "rgb(83, 100, 113)",
                          }}
                        >
                          Verify your phone number to subscribe for Premium. It
                          should just take a few minutes.
                        </div>
                        <Button
                          onClick={() => {
                            handleVerifyYourPasswordModalAfterVerifyYourPhoneNumberClick();
                          }}
                          className={`login-button next-btn mt-4 mb-5 ${themeName}-white-btn`}
                          variant="dark"
                          style={{
                            width: "100%",
                            height: "52px",
                            color: "white",
                            backgroundColor:
                              themeName === "dark-theme" ? "white" : "#0f141a",
                          }}
                        >
                          Verify your phone number
                        </Button>
                      </div>
                    </Modal.Body>
                  )}
                </>
              ) : tabIndex === 2 &&
                showVerifyPhoneNumberPasswordModal &&
                !correctPassword ? (
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
                    <>
                      {" "}
                      <Modal.Body
                        style={{
                          margin: "0px",
                          padding: "0px",
                        }}
                        className="verify-password-tab-sub-modal"
                      >
                        <div
                          className="mt-2"
                          style={{
                            width: "90%",
                            minHeight: "530px",
                          }}
                        >
                          <div
                            className="chirp-bold-font"
                            style={{
                              fontSize: font26.fontSize,
                              lineHeight: font26.lineHeight,
                              color: themeName === "dark-theme" ? "white" : "",
                            }}
                          >
                            Verify your password
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
                            Re-enter your C password to continue.
                          </div>
                          {/* start to check verify your password  */}
                          <FormControl
                            className="mt-5"
                            sx={{
                              width: "90%",
                            }}
                            variant="outlined"
                          >
                            <InputLabel
                              sx={{
                                color:
                                  themeName === "dark-theme" ? "#71767B" : "",
                                "&.MuiInputLabel-shrink": {
                                  color: "#1f9cf0 !important",
                                },
                              }}
                              htmlFor="outlined-adornment-password"
                            >
                              Password{" "}
                            </InputLabel>
                            <OutlinedInput
                              autoFocus
                              sx={{
                                color:
                                  themeName === "dark-theme"
                                    ? "white"
                                    : "black",
                                "& .MuiOutlinedInput-notchedOutline": {
                                  borderColor:
                                    themeName === "dark-theme"
                                      ? "rgb(70, 70, 70) !important"
                                      : "#cfd9de !important",
                                  border:
                                    themeName === "dark-theme"
                                      ? "1px solid rgb(70, 70, 70) !important"
                                      : "",
                                },
                                "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                  {
                                    border: "2px solid #1d9bf0 !important",
                                  },
                              }}
                              onChange={(e) => handleNewPasswordChange(e)}
                              value={verifyPasswordInput}
                              id="outlined-adornment-password"
                              type={showPassword ? "text" : "password"}
                              endAdornment={
                                <InputAdornment position="end">
                                  {showPassword ? (
                                    <svg
                                      onClick={handleClickShowPassword}
                                      onMouseDown={handleMouseDownPassword}
                                      style={{
                                        cursor: "pointer",
                                      }}
                                      color={
                                        themeName === "dark-theme"
                                          ? "white"
                                          : "rgb(15, 20, 25)"
                                      }
                                      fill="currentColor"
                                      width={22}
                                      height={22}
                                      viewBox="0 0 24 24"
                                      aria-hidden="true"
                                      className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-18yzcnr r-yc9v9c"
                                    >
                                      <g>
                                        <path d="M3.693 21.707l-1.414-1.414 2.429-2.429c-2.479-2.421-3.606-5.376-3.658-5.513l-.131-.352.131-.352c.133-.353 3.331-8.648 10.937-8.648 2.062 0 3.989.621 5.737 1.85l2.556-2.557 1.414 1.414L3.693 21.707zm-.622-9.706c.356.797 1.354 2.794 3.051 4.449l2.417-2.418c-.361-.609-.553-1.306-.553-2.032 0-2.206 1.794-4 4-4 .727 0 1.424.192 2.033.554l2.263-2.264C14.953 5.434 13.512 5 11.986 5c-5.416 0-8.258 5.535-8.915 7.001zM11.986 10c-1.103 0-2 .897-2 2 0 .178.023.352.067.519l2.451-2.451c-.167-.044-.341-.067-.519-.067zm10.951 1.647l.131.352-.131.352c-.133.353-3.331 8.648-10.937 8.648-.709 0-1.367-.092-2-.223v-2.047c.624.169 1.288.27 2 .27 5.415 0 8.257-5.533 8.915-7-.252-.562-.829-1.724-1.746-2.941l1.438-1.438c1.53 1.971 2.268 3.862 2.33 4.027z"></path>
                                      </g>
                                    </svg>
                                  ) : (
                                    <svg
                                      onClick={handleClickShowPassword}
                                      onMouseDown={handleMouseDownPassword}
                                      style={{
                                        cursor: "pointer",
                                      }}
                                      width={22}
                                      height={22}
                                      color={
                                        themeName === "dark-theme"
                                          ? "white"
                                          : "rgb(15, 20, 25)"
                                      }
                                      fill="currentColor"
                                      viewBox="0 0 24 24"
                                      aria-hidden="true"
                                      className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-18yzcnr r-yc9v9c"
                                    >
                                      <g>
                                        <path d="M12 21c-7.605 0-10.804-8.296-10.937-8.648L.932 12l.131-.352C1.196 11.295 4.394 3 12 3s10.804 8.296 10.937 8.648l.131.352-.131.352C22.804 12.705 19.606 21 12 21zm-8.915-9c.658 1.467 3.5 7 8.915 7s8.257-5.533 8.915-7c-.658-1.467-3.5-7-8.915-7s-8.257 5.533-8.915 7zM12 16c-2.206 0-4-1.794-4-4s1.794-4 4-4 4 1.794 4 4-1.794 4-4 4zm0-6c-1.103 0-2 .897-2 2s.897 2 2 2 2-.897 2-2-.897-2-2-2z"></path>
                                      </g>
                                    </svg>
                                  )}
                                </InputAdornment>
                              }
                              label="Password"
                            />
                          </FormControl>
                          {/* finish to check verify your password  */}
                        </div>

                        {verifyPasswordInput ? (
                          <Button
                            style={{
                              width: "81.5%",
                              height: "52px",
                              color: "white",
                              fontSize: font17.fontSize,
                              lineHeight: font17.lineHeight,
                              position: "absolute",
                              bottom: "20px",
                            }}
                            className={`login-button next-btn ${themeName}-white-btn chirp-bold-font`}
                            variant="dark"
                            onClick={() => {
                              handleCheckIsPasswordInputCorrect();
                            }}
                          >
                            Next
                          </Button>
                        ) : (
                          <Button
                            style={{
                              width: "81.5%",
                              height: "52px",
                              color: "black",
                              fontSize: font17.fontSize,
                              lineHeight: font17.lineHeight,
                              position: "absolute",
                              bottom: "20px",
                            }}
                            className={`forgot-password-button ${themeName}-black-btn chirp-bold-font`}
                            variant="light"
                            onClick={() => {
                              setsubErrorPhoneVerifiedTabLoading(true);
                              setTimeout(() => {
                                setTabIndex(null);
                                setshowVerifyPhoneNumberPasswordModal(false);
                                setphoneVerified(false);
                                setPhoneVerifiedErrorMessage(null);
                                setshowSubscriptionModal(false);
                                setsubErrorPhoneVerifiedTabLoading(false);
                              }, 500);
                            }}
                          >
                            Cancel
                          </Button>
                        )}
                      </Modal.Body>
                    </>
                  )}
                </>
              ) : tabIndex === 2 &&
                showVerifyPhoneNumberPasswordModal &&
                correctPassword &&
                !showgeneratedQrCodeModal ? (
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
                    <>
                      <Modal.Body className="verify-password-tab-sub-modal">
                        <div
                          style={{
                            width: "90%",
                            minHeight: "500px",
                          }}
                        >
                          <div
                            className="chirp-bold-font"
                            style={{
                              fontSize: font26.fontSize,
                              lineHeight: font26.lineHeight,
                              color: themeName === "dark-theme" ? "white" : "",
                            }}
                          >
                            Add a phone number
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
                            Enter the phone number you’d like to associate with
                            your Connectify account.
                          </div>
                          {/* start to check your phone number */}
                          <div
                            className="mt-5"
                            onClick={handleShowOptions}
                            style={{
                              borderRadius: "4px",
                              cursor: "pointer",
                              color: "#536471",
                              width: "100%",
                              minHeight: "58px",
                              padding: "4px",
                              border: "1px solid rgb(207, 217, 222)",
                              borderWidth: showpopoverCountriesAndTheirPhoneCode
                                ? "2px"
                                : "1px",
                              borderColor: showpopoverCountriesAndTheirPhoneCode
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
                                  fontSize: font14.fontSize,
                                  lineHeight: font14.lineHeight,
                                  color: showpopoverCountriesAndTheirPhoneCode
                                    ? "#1d9bf0"
                                    : "rgba(83,100,113,1.00)",
                                }}
                              >
                                <span
                                  style={{
                                    color:
                                      themeName === "dark-theme"
                                        ? "#71767A"
                                        : "",
                                  }}
                                >
                                  Country code
                                </span>
                                <div
                                  onClick={handleShowOptions}
                                  className="mt-2 selected-year-string-parent-div chirp-bold-font"
                                  style={{
                                    fontSize: font17.fontSize,
                                    lineHeight: font17.lineHeight,
                                    color:
                                      themeName === "dark-theme"
                                        ? "white"
                                        : "black",
                                  }}
                                >
                                  {country ? (
                                    <>
                                      +{getCountryCallingCode(country)}{" "}
                                      {en[country]}
                                    </>
                                  ) : (
                                    <>
                                      +{getCountryCallingCode("DE")} {en["DE"]}
                                    </>
                                  )}
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
                                    showpopoverCountriesAndTheirPhoneCode
                                      ? "#1d9bf0"
                                      : themeName === "dark-theme"
                                      ? "rgb(70,70,70)"
                                      : "rgba(83,100,113,1.00)"
                                  }
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
                            onBlur={() =>
                              setpopoverCountriesAndTheirPhoneCode(false)
                            }
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
                              borderWidth: showpopoverCountriesAndTheirPhoneCode
                                ? "2px"
                                : "1px",
                              opacity: 0,
                            }}
                            value={country}
                            onChange={handleSelectChange}
                          >
                            <option value="">{en["ZZ"]}</option>
                            {sortedCountries.map((country) => (
                              <option key={uuidv4()} value={country}>
                                +{getCountryCallingCode(country)} {en[country]}
                              </option>
                            ))}
                          </select>
                          <TextField
                            error={validPhoneNumber && phoneNumber?.length}
                            autoFocus={true}
                            value={phoneNumber}
                            onChange={(e) => setphoneNumber(e.target.value)}
                            type="text"
                            id="outlined-basic"
                            variant={"outlined"}
                            label={`Your phone number`}
                            style={{
                              width: "100%",
                              height: "58px",
                              position: "relative",
                              bottom: "45px",
                            }}
                            InputProps={{
                              style: {
                                color:
                                  themeName === "dark-theme" ? "white" : "",
                              },
                            }}
                            InputLabelProps={{
                              style: {
                                color:
                                  themeName === "dark-theme" ? "#71767B" : "",
                              },
                            }}
                            sx={{
                              "& .Mui-focused input + fieldset": {
                                border: !validPhoneNumber
                                  ? "2px solid rgb(244, 33, 46)!important"
                                  : "2px solid #1d9bf0 !important",
                              },
                              "& .MuiOutlinedInput-notchedOutline": {
                                borderColor: !validPhoneNumber
                                  ? "rgb(244, 33, 46)!important"
                                  : themeName === "dark-theme"
                                  ? "rgb(70,70,70) !important"
                                  : "#cfd9de !important",
                              },
                              "& .MuiInputLabel-shrink": {
                                color: !validPhoneNumber
                                  ? "rgb(244, 33, 46)!important"
                                  : "#1f9cf0 !important",
                              },
                            }}
                          />
                          <div
                            className="chirp-regular-font"
                            style={{
                              color: "rgb(244, 33, 46)",
                              fontSize: font13.fontSize,
                              lineHeight: font13.lineHeight,
                              position: "relative",
                              left: "10px",
                              bottom: "45px",
                            }}
                          >
                            {errorPhoneInValidMessage
                              ? errorPhoneInValidMessage
                              : null}
                          </div>
                          {/* finish to check your phone number  */}
                          {/* footer text and check box  start to check */}
                          <div
                            style={{
                              width: "100%",
                              gap: "2.5%",
                              display: "flex",
                              position: "relative",
                              bottom: "20px",
                            }}
                          >
                            <div
                              className="mt-2 chirp-regular-font"
                              style={{
                                color:
                                  themeName === "dark-theme"
                                    ? "white"
                                    : "rgb(83, 100, 113)",
                                fontSize: font15.fontSize,
                                lineHeight: font15.lineHeight,
                                position: "relative",
                                bottom: "4px",
                              }}
                            >
                              Let people who have your phone number find and
                              connect with you on Connectify.{" "}
                              <span
                                className="learn-more-add-phone-number"
                                style={{
                                  color: "rgb(29, 155, 240)",
                                  cursor: "pointer",
                                }}
                              >
                                Learn more
                              </span>
                            </div>
                            <div
                              style={{
                                width: "50px",
                                minHeight: "50px",
                              }}
                            >
                              <div
                                onClick={() => setClicked(!clicked)}
                                style={{
                                  width: "36px",
                                  minHeight: "36px",
                                  borderRadius: "50%",
                                  cursor: "pointer",
                                  marginBlock: "0.5em",
                                }}
                                className={
                                  themeName === "dark-theme" && clicked
                                    ? "hover-background-effect-clicked-dark-theme"
                                    : themeName !== "dark-theme" && clicked
                                    ? "hover-background-effect-clicked-light-theme"
                                    : themeName === "dark-theme" && !clicked
                                    ? "hover-background-effect-dark-theme"
                                    : themeName !== "dark-theme" && !clicked
                                    ? "hover-background-effect-light-theme"
                                    : ""
                                }
                              >
                                <div
                                  style={{
                                    backgroundColor: clicked
                                      ? "#1d9bf0"
                                      : "transparent",
                                    border: clicked
                                      ? "none"
                                      : themeName === "dark-theme"
                                      ? "2px solid rgb(70,70,70)"
                                      : "2px solid #536471",

                                    borderWidth: "2px ",
                                    width: "20px",
                                    minHeight: "20px",
                                    position: "relative",
                                    left: "8px",
                                    top: "8px",
                                    borderRadius: "3px",
                                  }}
                                >
                                  <svg
                                    style={{
                                      position: "relative",
                                      left: clicked ? "2px" : "",
                                      top: clicked ? "2px" : "",
                                      display: clicked ? "block" : "none",
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
                          {/* footer text and check box  finish to check */}
                        </div>
                        {validPhoneNumber &&
                        phoneNumber?.length &&
                        validPhoneNumber !== "unknown" ? (
                          <Button
                            style={{
                              width: "90%",
                              height: "52px",
                              color: "white",
                              fontSize: font17.fontSize,
                              lineHeight: font17.lineHeight,
                              position: "absolute",
                              bottom: "20px",
                            }}
                            className={`login-button next-btn ${themeName}-white-btn chirp-bold-font`}
                            variant="dark"
                            onClick={() => {
                              handleSubscriptionInfoNonPhoneVerifiedUser();
                            }}
                          >
                            Next
                          </Button>
                        ) : (
                          <Button
                            style={{
                              width: "90%",
                              height: "52px",
                              color:
                                themeName === "dark-theme" ? "white" : "black",
                              fontSize: font17.fontSize,
                              lineHeight: font17.lineHeight,
                              position: "absolute",
                              bottom: "20px",
                            }}
                            className={`forgot-password ${themeName}-black-btn chirp-bold-font`}
                            variant="light"
                            onClick={() => {
                              setsubErrorPhoneVerifiedTabLoading(true);
                              setTimeout(() => {
                                setshowVerifyPhoneNumberPasswordModal(false);
                                setshowSubscriptionModal(false);
                                setphoneVerified(false);
                                setTabIndex(null);
                                setCountry("");
                                setPhoneVerifiedErrorMessage("");
                                setsubErrorPhoneVerifiedTabLoading(false);
                                setQrCodeScreenOpened(false);
                              }, 500);
                            }}
                          >
                            Cancel
                          </Button>
                        )}
                      </Modal.Body>
                    </>
                  )}
                </>
              ) : tabIndex === 2 &&
                showVerifyPhoneNumberPasswordModal &&
                correctPassword &&
                showgeneratedQrCodeModal &&
                !showVerifyingCodeModal ? (
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
                      <div
                        style={{
                          minHeight: "550px",
                          width: "100%",
                        }}
                      >
                        <div
                          className="chirp-bold-font"
                          style={{
                            fontSize: font26.fontSize,
                            lineHeight: font26.lineHeight,
                            color: themeName === "dark-theme" ? "white" : "",
                          }}
                        >
                          Verify your phone number
                        </div>
                        <div
                          className="mt-3 chirp-regular-font"
                          style={{
                            color:
                              themeName === "dark-theme"
                                ? "#71767A"
                                : "rgb(83, 100, 113)",
                            fontSize: font15.fontSize,
                            lineHeight: font15.lineHeight,
                          }}
                        >
                          Use the camera app on your phone to scan this QR code.
                          Send the auto-generated text message to verify your
                          phone number. Standard SMS fees may apply.
                        </div>
                        <div
                          className="mt-5"
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <div>
                            {" "}
                            <QRCodeSVG
                              value={`sms:${TWILIO_NUMBER}&body=${verifyPhoneCode}`}
                            />
                          </div>
                          <div
                            className="mt-5"
                            style={{
                              textAlign: "left",
                            }}
                          >
                            <div
                              className="chirp-regular-font"
                              style={{
                                color:
                                  themeName === "dark-theme"
                                    ? "#71767A"
                                    : "rgb(83, 100, 113)",
                                fontSize: font15.fontSize,
                                lineHeight: font15.lineHeight,
                              }}
                            >
                              {"Can't scan the QR code?"}
                            </div>
                            <div
                              className="chirp-regular-font"
                              style={{
                                color:
                                  themeName === "dark-theme"
                                    ? "#71767A"
                                    : "rgb(83, 100, 113)",
                                fontSize: font15.fontSize,
                                lineHeight: font15.lineHeight,
                              }}
                            >{`Text ${verifyPhoneCode} to ${TWILIO_NUMBER}.`}</div>
                          </div>
                        </div>
                        <div
                          className="mt-5"
                          style={{
                            backgroundColor: "green",
                          }}
                        >
                          {" "}
                          <Button
                            style={{
                              width: "90%",
                              height: "52px",
                              color: "white",
                              fontSize: font17.fontSize,
                              lineHeight: font17.lineHeight,
                              position: "absolute",
                              bottom: "20px",
                            }}
                            className={`login-button next-btn ${themeName}-white-btn chirp-bold-font`}
                            variant="dark"
                            onClick={() => {
                              handleVerifyPhoneForSubscription();
                            }}
                          >
                            Next
                          </Button>
                        </div>
                      </div>
                    </Modal.Body>
                  )}
                </>
              ) : tabIndex === 2 &&
                showVerifyPhoneNumberPasswordModal &&
                correctPassword &&
                showgeneratedQrCodeModal &&
                showVerifyingCodeModal &&
                showSubscriptionProcessNotCompletedModal === null ? (
                <Modal.Body>
                  <div
                    // className="mt-5"
                    style={{
                      minHeight: "550px",
                      width: "100%",
                    }}
                  >
                    <div
                      className="chirp-bold-font"
                      style={{
                        fontSize: font26.fontSize,
                        lineHeight: font26.lineHeight,
                        color: themeName === "dark-theme" ? "white" : "",
                      }}
                    >
                      Verifying code...
                    </div>
                    <div
                      className="mt-3 chirp-regular-font"
                      style={{
                        color:
                          themeName === "dark-theme"
                            ? "#71767A"
                            : "rgb(83, 100, 113)",
                        fontSize: font15.fontSize,
                        lineHeight: font15.lineHeight,
                      }}
                    >
                      Please do not close this screen.
                    </div>
                  </div>
                </Modal.Body>
              ) : tabIndex === 2 &&
                showVerifyPhoneNumberPasswordModal &&
                correctPassword &&
                showgeneratedQrCodeModal &&
                showVerifyingCodeModal &&
                showSubscriptionProcessNotCompletedModal ? (
                <>
                  <Modal.Body
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      minHeight: "600px",
                    }}
                  >
                    <h1
                      className="chirp-heavy-font"
                      style={{
                        fontSize: font31.fontSize,
                        lineHeight: font31.lineHeight,
                        color: themeName === "dark-theme" ? "white" : "",
                      }}
                    >
                      Subscription Error!
                    </h1>{" "}
                    <svg
                      width={`175`}
                      height={`175`}
                      viewBox="0 0 22 22"
                      aria-label="Error"
                      role="img"
                      className="r-4qtqp9 r-yyyyoo r-1xvli5t r-bnwqim r-1plcrui r-lrvibr r-1cvl2hr r-f9ja8p r-og9te1 r-9cviqr"
                      data-testid="icon-error"
                    >
                      <defs>
                        <linearGradient
                          id="gradient"
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="100%"
                        >
                          <stop offset="0%" stopColor="#FF1000" />
                          <stop offset="20%" stopColor="#FF5500" />
                          <stop offset="40%" stopColor="#FF6447" />
                          <stop offset="60%" stopColor="#FF8F50" />
                          <stop offset="80%" stopColor="#FFA08A" />
                          <stop offset="100%" stopColor="#FFC1CB" />
                        </linearGradient>
                      </defs>
                      <circle cx="11" cy="11" r="10" fill="url(#gradient)" />
                      <text
                        x="50%"
                        y="50%"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fontSize="12"
                        fill="#FFF"
                      >
                        X
                      </text>
                    </svg>
                    <Button
                      onClick={handleCloseSubscriptionModal}
                      style={{
                        width: "65%",
                        height: "52px",
                      }}
                      className={`login-button mt-5 ${themeName}-white-btn`}
                      variant="dark"
                    >
                      Continue to Connectify
                    </Button>{" "}
                  </Modal.Body>
                </>
              ) : null}
            </Modal>
          ) : null}
        </>
      ) : (
        <>
          {showSubscriptionModal ? (
            <Modal
              backdropClassName={
                themeName === "dark-theme" ? `back-drop-${themeName}` : ""
              }
              style={{
                backgroundColor:
                  showVerifyPhoneNumberPasswordModal &&
                  themeName !== "dark-theme"
                    ? "#999999"
                    : themeName === "dark-theme" &&
                      showVerifyPhoneNumberPasswordModal
                    ? "#232E36"
                    : "",
                zIndex: 99999,
              }}
              contentClassName={
                themeName === "dark-theme" ? "dark-theme-sub-modal" : ""
              }
              // className={"signin-modal-parent-non-reactivate "}
              className={
                tabIndex !== 0 && !isOrganizationSubscriptionClicked
                  ? "subscription-modal-basic-width-smaller-700"
                  : "signin-modal-parent-non-reactivate subscribe-modal-abcde"
              }
              show={showSubscriptionModal}
              onHide={
                isVerifiedOrgsSignUpRoute
                  ? handleOutsideClickOfModal
                  : isSubscriptionEligibilityCheckRouteForIndividualSubscription
                  ? handleOutsideClickOfModal2
                  : handleCloseSubscriptionModal
              }
              centered={true}
            >
              {tabIndex === 0 ? (
                <>
                  <Modal.Header
                    className={`signin-modal-header-child-non-reactivate signin-modal-header-child-non-reactivate-${themeName}`}
                    style={{
                      border: "none",
                      zIndex: 999,
                    }}
                  >
                    <div
                      onClick={() => {
                        handleCloseSubscriptionModal();
                      }}
                      className={`close-button close-button-${themeName}`}
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
                            margin: "5px",
                          }}
                          onClick={handleCloseSubscriptionModal}
                          width={20}
                          height={20}
                          color={
                            themeName === "dark-theme"
                              ? "white"
                              : "rgb(15,20,25)"
                          }
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
                        fontSize: font20.fontSize,
                        lineHeight: font20.lineHeight,
                        position: "absolute",
                        left: "15%",
                        display: selectedOption === "individual" ? "" : "none",
                        color: themeName === "dark-theme" ? "white" : "black",
                      }}
                    >
                      Subscribe
                    </span>
                    <div
                      style={{
                        fontWeight: "700",
                        fontSize: font20.fontSize,
                        lineHeight: font20.lineHeight,
                        margin: "0 auto",
                        position: "relative",
                        right: "15px",
                        display:
                          selectedOption === "organization" ? "" : "none",
                        color: themeName === "dark-theme" ? "white" : "black",
                      }}
                    >
                      Verified Organizations
                    </div>
                  </Modal.Header>
                </>
              ) : null}

              {tabIndex === 0 && !premium_sign_up_page_active ? (
                <>
                  <Modal.Body
                    style={{
                      height: "482px",
                    }}
                    className={`subscription-modal subscription-modal-${themeName}`}
                  >
                    <div
                      className="chirp-heavy-font"
                      style={{
                        fontSize: font31.fontSize,
                        lineHeight: font31.lineHeight,
                        color: themeName === "dark-theme" ? "white" : "black",
                      }}
                    >
                      Who are you?
                    </div>
                    <div
                      className="mt-3 chirp-regular-font"
                      style={{
                        fontSize: font15.fontSize,
                        lineHeight: font15.lineHeight,
                        color: themeName === "dark-theme" ? "white" : "black",
                      }}
                    >
                      Choose the right subscription for you:
                    </div>
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
                        <div
                          style={{
                            position: "relative",
                            top: "5px",
                          }}
                        >
                          <div
                            className="chirp-regular-font"
                            style={{
                              color:
                                themeName === "dark-theme"
                                  ? "#71767A"
                                  : "rgb(83, 100, 113)",
                              fontSize: font15.fontSize,
                            }}
                          >
                            Premium
                          </div>
                          <div
                            className="chirp-bold-font"
                            style={{
                              fontSize: font17.fontSize,
                              lineHeight: font17.lineHeight,
                              color:
                                themeName === "dark-theme" ? "white" : "black",
                            }}
                          >
                            {" "}
                            I am an individual
                          </div>
                          <div
                            className="chirp-regular-font"
                            style={{
                              color:
                                themeName === "dark-theme"
                                  ? "#71767A"
                                  : "rgb(83, 100, 113)",
                              fontSize: font14.fontSize,
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
                            className="chirp-regular-font"
                            style={{
                              color:
                                themeName === "dark-theme"
                                  ? "#71767A"
                                  : "rgb(83, 100, 113)",
                              fontSize: font15.fontSize,
                            }}
                          >
                            {" "}
                            Verified Organizations
                          </div>{" "}
                          <div
                            className="chirp-bold-font"
                            style={{
                              color:
                                themeName === "dark-theme"
                                  ? "white"
                                  : "rgb(15, 20, 25)",
                              fontSize: font17.fontSize,
                              lineHeight: font17.lineHeight,
                            }}
                          >
                            I am an organization
                          </div>{" "}
                          <div
                            className="chirp-regular-font"
                            style={{
                              color:
                                themeName === "dark-theme"
                                  ? "#71767A"
                                  : "rgb(83, 100, 113)",
                              fontSize: font14.fontSize,
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
                        color: themeName === "dark-theme" ? "black" : "white",
                        backgroundColor:
                          themeName === "dark-theme" ? "white" : "#0f141a",
                      }}
                      className={`next-btn mt-4 next-btn-${themeName}`}
                    >
                      Subscribe
                    </Button>
                    <div
                      style={{
                        fontSize: font15.fontSize,
                        lineHeight: font15.lineHeight,
                        color: themeName === "dark-theme" ? "white" : "black",
                      }}
                      className="mt-4 chirp-regular-font"
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
              ) : tabIndex === 1 &&
                isIndividualSubscriptionClicked &&
                !premium_sign_up_page_active ? (
                <>
                  <Modal.Body
                    className={`scrollbar-add individual-bigger-than-700-width scrollbar-add-${themeName}`}
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
                        onClick={() => {
                          handleCloseSubscriptionModal();
                        }}
                        style={{
                          borderRadius: "50%",
                          cursor: "pointer",
                          position: "relative",
                          right: "50px",
                        }}
                      >
                        <div
                          className={`close-button close-button-${themeName}`}
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
                              margin: "5px",
                            }}
                            onClick={handleCloseSubscriptionModal}
                            width={20}
                            height={20}
                            color={
                              themeName === "dark-theme"
                                ? "white"
                                : `rgb(15,20,25)`
                            }
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
                        className="chirp-bold-font"
                        style={{
                          color: themeName === "dark-theme" ? "white" : "black",
                          fontSize: font20.fontSize,
                          lineHeight: font20.lineHeight,
                          position: "absolute",
                          // left: "20%",
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
                                  className="chirp-medium-font"
                                  style={{
                                    color: "white",
                                    fontSize: font17.fontSize,
                                    lineHeight: font17.lineHeight,
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
                              className={`mt-3 premium-plus-parent-div premium-plus-parent-div-${themeName}`}
                              style={{
                                padding: "32px",
                                borderRadius: "16px",
                                backgroundColor:
                                  themeName === "dark-theme"
                                    ? "#16181C"
                                    : "#eff3f4",
                              }}
                            >
                              <div
                                style={{
                                  fontSize: font17.fontSize,
                                  lineHeight: font17.lineHeight,
                                }}
                                className="premium-plus-header chirp-bold-font"
                              >
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
                                    <span
                                      className="chirp-regular-font"
                                      style={{
                                        fontSize: font15.fontSize,
                                        lineHeight: font15.lineHeight,
                                      }}
                                    >
                                      Ads in For You
                                    </span>
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
                                    <span
                                      className="chirp-regular-font"
                                      style={{
                                        fontSize: font15.fontSize,
                                        lineHeight: font15.lineHeight,
                                      }}
                                    >
                                      Reply boost
                                    </span>
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
                                    <span
                                      className="chirp-regular-font"
                                      style={{
                                        fontSize: font15.fontSize,
                                        lineHeight: font15.lineHeight,
                                      }}
                                    >
                                      Longer posts
                                    </span>{" "}
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
                                      className="chirp-regular-font"
                                      style={{
                                        fontSize: font15.fontSize,
                                        lineHeight: font15.lineHeight,
                                      }}
                                    >
                                      Undo post
                                    </span>{" "}
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
                                      className="chirp-regular-font"
                                      style={{
                                        fontSize: font15.fontSize,
                                        lineHeight: font15.lineHeight,
                                      }}
                                    >
                                      Post longer videos
                                    </span>{" "}
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
                                      className="chirp-regular-font"
                                      style={{
                                        fontSize: font15.fontSize,
                                        lineHeight: font15.lineHeight,
                                      }}
                                    >
                                      Top Articles
                                    </span>{" "}
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
                                    <span
                                      className="chirp-regular-font"
                                      style={{
                                        fontSize: font15.fontSize,
                                        lineHeight: font15.lineHeight,
                                      }}
                                    >
                                      Reader
                                    </span>{" "}
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
                                    <span
                                      className="chirp-regular-font"
                                      style={{
                                        fontSize: font15.fontSize,
                                        lineHeight: font15.lineHeight,
                                      }}
                                    >
                                      Background video playback
                                    </span>{" "}
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
                                      className="chirp-regular-font"
                                      style={{
                                        fontSize: font15.fontSize,
                                        lineHeight: font15.lineHeight,
                                      }}
                                    >
                                      Download videos
                                    </span>{" "}
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
                              className={`mt-3 premium-plus-parent-div premium-plus-parent-div-${themeName}`}
                              style={{
                                padding: "32px",
                                borderRadius: "16px",
                                backgroundColor:
                                  themeName === "dark-theme"
                                    ? "#16181C"
                                    : "#eff3f4",
                              }}
                            >
                              <div
                                style={{
                                  fontSize: font17.fontSize,
                                  lineHeight: font17.lineHeight,
                                }}
                                className="premium-plus-header chirp-bold-font"
                              >
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
                                      className="chirp-regular-font"
                                      style={{
                                        fontSize: font15.fontSize,
                                        lineHeight: font15.lineHeight,
                                        color:
                                          themeName === "dark-theme"
                                            ? "#71767A"
                                            : "rgb(83, 100, 113) ",
                                      }}
                                    >
                                      Write Articles
                                    </span>
                                    <svg
                                      width={20}
                                      height={20}
                                      color={
                                        themeName === "dark-theme"
                                          ? "#71767A"
                                          : "rgba(83,100,113,1.00)"
                                      }
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
                                      color={
                                        themeName === "dark-theme"
                                          ? "#71767A"
                                          : "rgba(83,100,113,1.00)"
                                      }
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
                                      className="chirp-regular-font"
                                      style={{
                                        fontSize: font15.fontSize,
                                        lineHeight: font15.lineHeight,
                                        color:
                                          themeName === "dark-theme"
                                            ? "#71767A"
                                            : "rgb(83, 100, 113)",
                                      }}
                                    >
                                      Get paid to post
                                    </span>
                                    <svg
                                      width={20}
                                      height={20}
                                      color={
                                        themeName === "dark-theme"
                                          ? "#71767A"
                                          : "rgba(83,100,113,1.00)"
                                      }
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
                                      color={
                                        themeName === "dark-theme"
                                          ? "#71767A"
                                          : "rgba(83,100,113,1.00)"
                                      }
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
                                      className="chirp-regular-font"
                                      style={{
                                        fontSize: font15.fontSize,
                                        lineHeight: font15.lineHeight,
                                        color:
                                          themeName === "dark-theme"
                                            ? "#71767A"
                                            : "rgb(83, 100, 113)",
                                      }}
                                    >
                                      Creator Subscriptions
                                    </span>
                                    <svg
                                      width={20}
                                      height={20}
                                      color={
                                        themeName === "dark-theme"
                                          ? "#71767A"
                                          : "rgba(83,100,113,1.00)"
                                      }
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
                                      color={
                                        themeName === "dark-theme"
                                          ? "#71767A"
                                          : "rgba(83,100,113,1.00)"
                                      }
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
                                      className="chirp-regular-font"
                                      style={{
                                        fontSize: font15.fontSize,
                                        lineHeight: font15.lineHeight,
                                        color:
                                          themeName === "dark-theme"
                                            ? "#71767A"
                                            : "rgb(83, 100, 113)",
                                      }}
                                    >
                                      C Pro
                                    </span>
                                    <svg
                                      width={20}
                                      height={20}
                                      color={
                                        themeName === "dark-theme"
                                          ? "#71767A"
                                          : "rgba(83,100,113,1.00)"
                                      }
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
                                      color={
                                        themeName === "dark-theme"
                                          ? "#71767A"
                                          : "rgba(83,100,113,1.00)"
                                      }
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
                                      className="chirp-regular-font"
                                      style={{
                                        fontSize: font15.fontSize,
                                        lineHeight: font15.lineHeight,
                                        color:
                                          themeName === "dark-theme"
                                            ? "#71767A"
                                            : "rgb(83, 100, 113)",
                                      }}
                                    >
                                      Media Studio
                                    </span>
                                    <svg
                                      width={20}
                                      height={20}
                                      color={
                                        themeName === "dark-theme"
                                          ? "#71767A"
                                          : "rgba(83,100,113,1.00)"
                                      }
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
                                      color={
                                        themeName === "dark-theme"
                                          ? "#71767A"
                                          : "rgba(83,100,113,1.00)"
                                      }
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
                                      className="chirp-regular-font"
                                      style={{
                                        fontSize: font15.fontSize,
                                        lineHeight: font15.lineHeight,
                                        color:
                                          themeName === "dark-theme"
                                            ? "#71767A"
                                            : "rgb(83, 100, 113)",
                                      }}
                                    >
                                      Analytics
                                    </span>
                                    <svg
                                      width={20}
                                      height={20}
                                      color={
                                        themeName === "dark-theme"
                                          ? "#71767A"
                                          : "rgba(83,100,113,1.00)"
                                      }
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
                                      color={
                                        themeName === "dark-theme"
                                          ? "#71767A"
                                          : "rgba(83,100,113,1.00)"
                                      }
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
                              className={`mt-3 premium-plus-parent-div premium-plus-parent-div-${themeName}`}
                              style={{
                                padding: "32px",
                                borderRadius: "16px",
                                backgroundColor:
                                  themeName === "dark-theme"
                                    ? "#16181C"
                                    : "#eff3f4",
                              }}
                            >
                              <div
                                style={{
                                  fontSize: font17.fontSize,
                                  lineHeight: font17.lineHeight,
                                }}
                                className="premium-plus-header chirp-bold-font"
                              >
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
                                      className="chirp-regular-font"
                                      style={{
                                        fontSize: font15.fontSize,
                                        lineHeight: font15.lineHeight,
                                        color:
                                          themeName === "dark-theme"
                                            ? "#71767A"
                                            : "rgb(83, 100, 113)",
                                      }}
                                    >
                                      {" "}
                                      Checkmark
                                    </span>
                                    <svg
                                      width={20}
                                      height={20}
                                      color={
                                        themeName === "dark-theme"
                                          ? "#71767A"
                                          : "rgba(83,100,113,1.00)"
                                      }
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
                                      color={
                                        themeName === "dark-theme"
                                          ? "#71767A"
                                          : "rgba(83,100,113,1.00)"
                                      }
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
                                      className="chirp-regular-font"
                                      style={{
                                        fontSize: font15.fontSize,
                                        lineHeight: font15.lineHeight,
                                      }}
                                    >
                                      Encrypted direct messages
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
                                      className="chirp-regular-font"
                                      style={{
                                        fontSize: font15.fontSize,
                                        lineHeight: font15.lineHeight,
                                        color:
                                          themeName === "dark-theme"
                                            ? "#71767A"
                                            : "rgb(83, 100, 113)",
                                      }}
                                    >
                                      Optional ID verification
                                    </span>
                                    <svg
                                      width={20}
                                      height={20}
                                      color={
                                        themeName === "dark-theme"
                                          ? "#71767A"
                                          : "rgba(83,100,113,1.00)"
                                      }
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
                                      color={
                                        themeName === "dark-theme"
                                          ? "#71767A"
                                          : "rgba(83,100,113,1.00)"
                                      }
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
                              className={`mt-3 premium-plus-parent-div premium-plus-parent-div-${themeName}`}
                              style={{
                                padding: "32px",
                                borderRadius: "16px",
                                backgroundColor:
                                  themeName === "dark-theme"
                                    ? "#16181C"
                                    : "#eff3f4",
                              }}
                            >
                              <div
                                style={{
                                  fontSize: font17.fontSize,
                                  lineHeight: font17.lineHeight,
                                }}
                                className="premium-plus-header chirp-bold-font"
                              >
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
                                    <span
                                      className="chirp-regular-font"
                                      style={{
                                        fontSize: font15.fontSize,
                                        lineHeight: font15.lineHeight,
                                      }}
                                    >
                                      App icons
                                    </span>
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
                                    <span
                                      className="chirp-regular-font"
                                      style={{
                                        fontSize: font15.fontSize,
                                        lineHeight: font15.lineHeight,
                                      }}
                                    >
                                      Bookmark folders
                                    </span>{" "}
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
                                      className="chirp-regular-font"
                                      style={{
                                        fontSize: font15.fontSize,
                                        lineHeight: font15.lineHeight,
                                      }}
                                    >
                                      Customize navigation
                                    </span>{" "}
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
                                      className="chirp-regular-font"
                                      style={{
                                        fontSize: font15.fontSize,
                                        lineHeight: font15.lineHeight,
                                      }}
                                    >
                                      Highlights tab
                                    </span>{" "}
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
                                      className="chirp-regular-font"
                                      style={{
                                        fontSize: font15.fontSize,
                                        lineHeight: font15.lineHeight,
                                      }}
                                    >
                                      Hide your likes
                                    </span>{" "}
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
                                      className="chirp-regular-font"
                                      style={{
                                        fontSize: font15.fontSize,
                                        lineHeight: font15.lineHeight,
                                      }}
                                    >
                                      Hide your checkmark
                                    </span>{" "}
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
                                  <div
                                    className="chirp-regular-font"
                                    style={{
                                      fontSize: font15.fontSize,
                                      lineHeight: font15.lineHeight,
                                    }}
                                  >
                                    Hide your subscriptions
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
                                  className="chirp-medium-font"
                                  style={{
                                    color: "white",
                                    fontSize: font17.fontSize,
                                    lineHeight: font17.lineHeight,
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
                              className={`mt-3 premium-plus-parent-div premium-plus-parent-div-${themeName}`}
                              style={{
                                padding: "32px",
                                borderRadius: "16px",
                                backgroundColor:
                                  themeName === "dark-theme"
                                    ? "#16181C"
                                    : "#eff3f4",
                              }}
                            >
                              <div
                                style={{
                                  fontSize: font17.fontSize,
                                  lineHeight: font17.lineHeight,
                                }}
                                className="premium-plus-header chirp-bold-font"
                              >
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
                                    <span
                                      className="chirp-regular-font"
                                      style={{
                                        fontSize: font15.fontSize,
                                        lineHeight: font15.lineHeight,
                                      }}
                                    >
                                      Ads in For You
                                    </span>
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
                                    <span
                                      className="chirp-regular-font"
                                      style={{
                                        fontSize: font15.fontSize,
                                        lineHeight: font15.lineHeight,
                                      }}
                                    >
                                      Reply boost
                                    </span>
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
                                    <span
                                      className="chirp-regular-font"
                                      style={{
                                        fontSize: font15.fontSize,
                                        lineHeight: font15.lineHeight,
                                      }}
                                    >
                                      Edit post
                                    </span>{" "}
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
                                      className="chirp-regular-font"
                                      style={{
                                        fontSize: font15.fontSize,
                                        lineHeight: font15.lineHeight,
                                      }}
                                    >
                                      Longer posts
                                    </span>{" "}
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
                                      className="chirp-regular-font"
                                      style={{
                                        fontSize: font15.fontSize,
                                        lineHeight: font15.lineHeight,
                                      }}
                                    >
                                      Undo post
                                    </span>{" "}
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
                                      className="chirp-regular-font"
                                      style={{
                                        fontSize: font15.fontSize,
                                        lineHeight: font15.lineHeight,
                                      }}
                                    >
                                      Post longer videos
                                    </span>{" "}
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
                                      className="chirp-regular-font"
                                      style={{
                                        fontSize: font15.fontSize,
                                        lineHeight: font15.lineHeight,
                                      }}
                                    >
                                      Top Articles
                                    </span>{" "}
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
                                    <span
                                      className="chirp-regular-font"
                                      style={{
                                        fontSize: font15.fontSize,
                                        lineHeight: font15.lineHeight,
                                      }}
                                    >
                                      Reader
                                    </span>{" "}
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
                                    <span
                                      className="chirp-regular-font"
                                      style={{
                                        fontSize: font15.fontSize,
                                        lineHeight: font15.lineHeight,
                                      }}
                                    >
                                      Background video playback
                                    </span>{" "}
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
                                      className="chirp-regular-font"
                                      style={{
                                        fontSize: font15.fontSize,
                                        lineHeight: font15.lineHeight,
                                      }}
                                    >
                                      Download videos
                                    </span>{" "}
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
                              className={`mt-3 premium-plus-parent-div premium-plus-parent-div-${themeName}`}
                              style={{
                                padding: "32px",
                                borderRadius: "16px",
                                backgroundColor:
                                  themeName === "dark-theme"
                                    ? "#16181C"
                                    : "#eff3f4",
                              }}
                            >
                              <div
                                style={{
                                  fontSize: font17.fontSize,
                                  lineHeight: font17.lineHeight,
                                }}
                                className="premium-plus-header chirp-bold-font"
                              >
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
                                      className="chirp-regular-font"
                                      style={{
                                        fontSize: font15.fontSize,
                                        lineHeight: font15.lineHeight,
                                        color:
                                          themeName === "dark-theme"
                                            ? "#71767A"
                                            : "rgb(83, 100, 113) ",
                                      }}
                                    >
                                      Write Articles
                                    </span>

                                    <svg
                                      width={20}
                                      height={20}
                                      color={
                                        themeName === "dark-theme"
                                          ? "#71767A"
                                          : "rgba(83,100,113,1.00)"
                                      }
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
                                      color={
                                        themeName === "dark-theme"
                                          ? "#71767A"
                                          : "rgba(83,100,113,1.00)"
                                      }
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
                                      className="chirp-regular-font"
                                      style={{
                                        fontSize: font15.fontSize,
                                        lineHeight: font15.lineHeight,
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
                                      className="chirp-regular-font"
                                      style={{
                                        fontSize: font15.fontSize,
                                        lineHeight: font15.lineHeight,
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
                                      className="chirp-regular-font"
                                      style={{
                                        fontSize: font15.fontSize,
                                        lineHeight: font15.lineHeight,
                                      }}
                                    >
                                      C Pro
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
                                      className="chirp-regular-font"
                                      style={{
                                        fontSize: font15.fontSize,
                                        lineHeight: font15.lineHeight,
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
                                      className="chirp-regular-font"
                                      style={{
                                        fontSize: font15.fontSize,
                                        lineHeight: font15.lineHeight,
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
                              className={`mt-3 premium-plus-parent-div premium-plus-parent-div-${themeName}`}
                              style={{
                                padding: "32px",
                                borderRadius: "16px",
                                backgroundColor:
                                  themeName === "dark-theme"
                                    ? "#16181C"
                                    : "#eff3f4",
                              }}
                            >
                              <div
                                style={{
                                  fontSize: font17.fontSize,
                                  lineHeight: font17.lineHeight,
                                }}
                                className="premium-plus-header chirp-bold-font"
                              >
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
                                      className="chirp-regular-font"
                                      style={{
                                        fontSize: font15.fontSize,
                                        lineHeight: font15.lineHeight,
                                      }}
                                    >
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
                                      className="chirp-regular-font"
                                      style={{
                                        fontSize: font15.fontSize,
                                        lineHeight: font15.lineHeight,
                                      }}
                                    >
                                      Encrypted direct messages
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
                                      className="chirp-regular-font"
                                      style={{
                                        fontSize: font15.fontSize,
                                        lineHeight: font15.lineHeight,
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
                              className={`mt-3 premium-plus-parent-div premium-plus-parent-div-${themeName}`}
                              style={{
                                padding: "32px",
                                borderRadius: "16px",
                                backgroundColor:
                                  themeName === "dark-theme"
                                    ? "#16181C"
                                    : "#eff3f4",
                              }}
                            >
                              <div
                                style={{
                                  fontSize: font17.fontSize,
                                  lineHeight: font17.lineHeight,
                                }}
                                className="premium-plus-header chirp-bold-font"
                              >
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
                                    <span
                                      className="chirp-regular-font"
                                      style={{
                                        fontSize: font15.fontSize,
                                        lineHeight: font15.lineHeight,
                                      }}
                                    >
                                      App icons
                                    </span>
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
                                    <span
                                      className="chirp-regular-font"
                                      style={{
                                        fontSize: font15.fontSize,
                                        lineHeight: font15.lineHeight,
                                      }}
                                    >
                                      Bookmark folders
                                    </span>{" "}
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
                                      className="chirp-regular-font"
                                      style={{
                                        fontSize: font15.fontSize,
                                        lineHeight: font15.lineHeight,
                                      }}
                                    >
                                      Customize navigation
                                    </span>{" "}
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
                                      className="chirp-regular-font"
                                      style={{
                                        fontSize: font15.fontSize,
                                        lineHeight: font15.lineHeight,
                                      }}
                                    >
                                      Highlights tab
                                    </span>{" "}
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
                                      className="chirp-regular-font"
                                      style={{
                                        fontSize: font15.fontSize,
                                        lineHeight: font15.lineHeight,
                                      }}
                                    >
                                      Hide your likes
                                    </span>{" "}
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
                                      className="chirp-regular-font"
                                      style={{
                                        fontSize: font15.fontSize,
                                        lineHeight: font15.lineHeight,
                                      }}
                                    >
                                      Hide your checkmark
                                    </span>{" "}
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
                                  <div
                                    className="chirp-regular-font"
                                    style={{
                                      fontSize: font15.fontSize,
                                      lineHeight: font15.lineHeight,
                                    }}
                                  >
                                    Hide your subscriptions
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
                                  className="chirp-medium-font"
                                  style={{
                                    color: "white",
                                    fontSize: font17.fontSize,
                                    lineHeight: font17.lineHeight,
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
                              className={`mt-3 premium-plus-parent-div premium-plus-parent-div-${themeName}`}
                              style={{
                                padding: "32px",
                                borderRadius: "16px",
                                backgroundColor:
                                  themeName === "dark-theme"
                                    ? "#16181C"
                                    : "#eff3f4",
                              }}
                            >
                              <div
                                style={{
                                  fontSize: font17.fontSize,
                                  lineHeight: font17.lineHeight,
                                }}
                                className="premium-plus-header chirp-bold-font"
                              >
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
                                    <span
                                      className="chirp-regular-font"
                                      style={{
                                        fontSize: font15.fontSize,
                                        lineHeight: font15.lineHeight,
                                      }}
                                    >
                                      Ads in For You
                                    </span>
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
                                    <span
                                      className="chirp-regular-font"
                                      style={{
                                        fontSize: font15.fontSize,
                                        lineHeight: font15.lineHeight,
                                      }}
                                    >
                                      Reply boost
                                    </span>
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
                                    <span
                                      className="chirp-regular-font"
                                      style={{
                                        fontSize: font15.fontSize,
                                        lineHeight: font15.lineHeight,
                                      }}
                                    >
                                      Edit post
                                    </span>{" "}
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
                                      className="chirp-regular-font"
                                      style={{
                                        fontSize: font15.fontSize,
                                        lineHeight: font15.lineHeight,
                                      }}
                                    >
                                      Longer posts
                                    </span>{" "}
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
                                      className="chirp-regular-font"
                                      style={{
                                        fontSize: font15.fontSize,
                                        lineHeight: font15.lineHeight,
                                      }}
                                    >
                                      Undo post
                                    </span>{" "}
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
                                      className="chirp-regular-font"
                                      style={{
                                        fontSize: font15.fontSize,
                                        lineHeight: font15.lineHeight,
                                      }}
                                    >
                                      Post longer videos
                                    </span>{" "}
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
                                      className="chirp-regular-font"
                                      style={{
                                        fontSize: font15.fontSize,
                                        lineHeight: font15.lineHeight,
                                      }}
                                    >
                                      Top Articles
                                    </span>{" "}
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
                                    <span
                                      className="chirp-regular-font"
                                      style={{
                                        fontSize: font15.fontSize,
                                        lineHeight: font15.lineHeight,
                                      }}
                                    >
                                      Reader
                                    </span>{" "}
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
                                    <span
                                      className="chirp-regular-font"
                                      style={{
                                        fontSize: font15.fontSize,
                                        lineHeight: font15.lineHeight,
                                      }}
                                    >
                                      Background video playback
                                    </span>{" "}
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
                                      className="chirp-regular-font"
                                      style={{
                                        fontSize: font15.fontSize,
                                        lineHeight: font15.lineHeight,
                                      }}
                                    >
                                      {" "}
                                      Download videos
                                    </span>{" "}
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
                              className={`mt-3 premium-plus-parent-div premium-plus-parent-div-${themeName}`}
                              style={{
                                padding: "32px",
                                borderRadius: "16px",
                                backgroundColor:
                                  themeName === "dark-theme"
                                    ? "#16181C"
                                    : "#eff3f4",
                              }}
                            >
                              <div
                                style={{
                                  fontSize: font17.fontSize,
                                  lineHeight: font17.lineHeight,
                                }}
                                className="premium-plus-header chirp-bold-font"
                              >
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
                                      className="chirp-regular-font"
                                      style={{
                                        fontSize: font15.fontSize,
                                        lineHeight: font15.lineHeight,
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
                                      className="chirp-regular-font"
                                      style={{
                                        fontSize: font15.fontSize,
                                        lineHeight: font15.lineHeight,
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
                                      className="chirp-regular-font"
                                      style={{
                                        fontSize: font15.fontSize,
                                        lineHeight: font15.lineHeight,
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
                                      className="chirp-regular-font"
                                      style={{
                                        fontSize: font15.fontSize,
                                        lineHeight: font15.lineHeight,
                                      }}
                                    >
                                      C Pro
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
                                      className="chirp-regular-font"
                                      style={{
                                        fontSize: font15.fontSize,
                                        lineHeight: font15.lineHeight,
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
                                      className="chirp-regular-font"
                                      style={{
                                        fontSize: font15.fontSize,
                                        lineHeight: font15.lineHeight,
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
                              className={`mt-3 premium-plus-parent-div premium-plus-parent-div-${themeName}`}
                              style={{
                                padding: "32px",
                                borderRadius: "16px",
                                backgroundColor:
                                  themeName === "dark-theme"
                                    ? "#16181C"
                                    : "#eff3f4",
                              }}
                            >
                              <div
                                style={{
                                  fontSize: font17.fontSize,
                                  lineHeight: font17.lineHeight,
                                }}
                                className="premium-plus-header chirp-bold-font"
                              >
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
                                      className="chirp-regular-font"
                                      style={{
                                        fontSize: font15.fontSize,
                                        lineHeight: font15.lineHeight,
                                      }}
                                    >
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
                                      className="chirp-regular-font"
                                      style={{
                                        fontSize: font15.fontSize,
                                        lineHeight: font15.lineHeight,
                                      }}
                                    >
                                      Encrypted direct messages
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
                                      className="chirp-regular-font"
                                      style={{
                                        fontSize: font15.fontSize,
                                        lineHeight: font15.lineHeight,
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
                              className={`mt-3 premium-plus-parent-div premium-plus-parent-div-${themeName}`}
                              style={{
                                padding: "32px",
                                borderRadius: "16px",
                                backgroundColor:
                                  themeName === "dark-theme"
                                    ? "#16181C"
                                    : "#eff3f4",
                              }}
                            >
                              <div
                                style={{
                                  fontSize: font17.fontSize,
                                  lineHeight: font17.lineHeight,
                                }}
                                className="premium-plus-header chirp-bold-font"
                              >
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
                                    <span
                                      className="chirp-regular-font"
                                      style={{
                                        fontSize: font15.fontSize,
                                        lineHeight: font15.lineHeight,
                                      }}
                                    >
                                      App icons
                                    </span>
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
                                    <span
                                      className="chirp-regular-font"
                                      style={{
                                        fontSize: font15.fontSize,
                                        lineHeight: font15.lineHeight,
                                      }}
                                    >
                                      Bookmark folders
                                    </span>{" "}
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
                                      className="chirp-regular-font"
                                      style={{
                                        fontSize: font15.fontSize,
                                        lineHeight: font15.lineHeight,
                                      }}
                                    >
                                      Customize navigation
                                    </span>{" "}
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
                                      className="chirp-regular-font"
                                      style={{
                                        fontSize: font15.fontSize,
                                        lineHeight: font15.lineHeight,
                                      }}
                                    >
                                      Highlights tab
                                    </span>{" "}
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
                                      className="chirp-regular-font"
                                      style={{
                                        fontSize: font15.fontSize,
                                        lineHeight: font15.lineHeight,
                                      }}
                                    >
                                      Hide your likes
                                    </span>{" "}
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
                                      className="chirp-regular-font"
                                      style={{
                                        fontSize: font15.fontSize,
                                        lineHeight: font15.lineHeight,
                                      }}
                                    >
                                      Hide your checkmark
                                    </span>{" "}
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
                                  <div
                                    className="chirp-regular-font"
                                    style={{
                                      fontSize: font15.fontSize,
                                      lineHeight: font15.lineHeight,
                                    }}
                                  >
                                    Hide your subscriptions
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
                        filter:
                          themeName === "dark-theme"
                            ? "drop-shadow(rgb(51, 54, 57) 0px -1px 1px)"
                            : "",
                        boxShadow:
                          themeName === "dark-theme"
                            ? "inset 0px 4px 3px -3px rgba(50, 50, 50, 0.75)"
                            : "inset 0px 4px 3px -3px rgba(101, 119, 134, 0.15)",
                        minHeight: phoneVerifiedErrorMessage
                          ? "305px"
                          : "270px",

                        borderBottomLeftRadius: "16px",
                        borderBottomRightRadius: "16px",
                        backgroundColor:
                          themeName === "dark-theme" ? "black" : "#fdfdfe",

                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        overflowY: "auto",
                        padding: "16px 0px",
                      }}
                    >
                      <div
                        style={{
                          width: "81.5%",
                          display: "flex",
                          gap: "2.5%",
                        }}
                      >
                        <div
                          onClick={() => {
                            setindividualSubOptionPremiumPlusAnnualTab(true);
                            setindividualSubOptionPremiumPlusMonthlyTab(false);
                          }}
                          className={`individual-subscription-box individual-subscription-box-${themeName}`}
                          style={{
                            padding: "8px",
                            flex: 1,
                            maxHeight: "110px",
                            cursor: "pointer",
                            borderWidth: "1px",
                            borderRadius: "16px",
                            backgroundColor:
                              themeName === "dark-theme" ? "black" : "white",
                            filter:
                              themeName === "dark-theme"
                                ? "drop-shadow(rgb(51, 54, 57) 1px -1px 1px)"
                                : "",
                            boxShadow:
                              themeName === "dark-theme"
                                ? "rgba(255, 255, 255, 0.2) 0px 0px 15px, rgba(255, 255, 255, 0.15) 0px 0px 3px 1px"
                                : "0 0 15px rgba(101, 119,134,0.2), 0 0 5px 3px rgba(101,119,134,0.15)",
                            border: individualSubOptionPremiumPlusAnnualTab
                              ? "2px solid #339bf0"
                              : "2px solid transparent",

                            transition: "transform 0.3s ease",
                          }}
                        >
                          <span
                            className="chirp-regular-font"
                            style={{
                              color:
                                themeName === "dark-theme"
                                  ? "#71767A"
                                  : "#697884",
                              fontSize: font14.fontSize,
                              lineHeight: font14.lineHeight,
                            }}
                          >
                            Annual Plan
                            <span
                              className="chirp-bold-font"
                              style={{
                                fontSize: font11.fontSize,
                                lineHeight: font11.lineHeight,
                                borderRadius: "9999px",
                                position: "relative",
                                bottom: "1px",
                                padding: "4px",
                                height: "20px",
                                backgroundColor:
                                  themeName === "dark-theme"
                                    ? "#05241A"
                                    : "#dcf8eb",
                                color:
                                  themeName === "dark-theme"
                                    ? "#C2F1DC"
                                    : "rgb(0, 67, 41)",
                              }}
                            >
                              <span>Save 12%</span>
                            </span>
                          </span>

                          <span
                            className="chirp-bold-font"
                            style={{
                              color:
                                themeName === "dark-theme"
                                  ? "white"
                                  : "rgb(15, 20, 25)",
                              fontSize: font17.fontSize,
                              lineHeight: font17.lineHeight,
                              display: "block",
                            }}
                          >
                            €199.92 / year
                          </span>
                          <div
                            className="chirp-regular-font"
                            style={{
                              color:
                                themeName === "dark-theme"
                                  ? "#71767A"
                                  : "#697884",
                              fontSize: font13.fontSize,
                              lineHeight: font13.lineHeight,
                            }}
                          >
                            €199.92 per year billed annually
                          </div>
                        </div>
                        <div
                          className={`individual-subscription-box individual-subscription-box-${themeName}`}
                          onClick={() => {
                            setindividualSubOptionPremiumPlusMonthlyTab(true);
                            setindividualSubOptionPremiumPlusAnnualTab(false);
                          }}
                          style={{
                            padding: "8px",
                            flex: 1,
                            maxHeight: "110px",
                            cursor: "pointer",
                            borderWidth: "1px",
                            borderRadius: "16px",
                            backgroundColor:
                              themeName === "dark-theme" ? "black" : "white",
                            filter:
                              themeName === "dark-theme"
                                ? "drop-shadow(rgb(51, 54, 57) 1px -1px 1px)"
                                : "",

                            boxShadow:
                              themeName === "dark-theme"
                                ? "rgba(255, 255, 255, 0.2) 0px 0px 15px, rgba(255, 255, 255, 0.15) 0px 0px 3px 1px"
                                : "0 0 15px rgba(101, 119,134,0.2), 0 0 5px 3px rgba(101,119,134,0.15)",
                            border: individualSubOptionPremiumPlusMonthlyTab
                              ? "2px solid #339bf0"
                              : "2px solid transparent",
                            transition: "transform 0.3s ease",
                          }}
                        >
                          <span
                            className="chirp-regular-font"
                            style={{
                              color:
                                themeName === "dark-theme"
                                  ? "#71767A"
                                  : "#697884",
                              fontSize: font14.fontSize,
                              lineHeight: font14.lineHeight,
                            }}
                          >
                            Monthly Plan{" "}
                          </span>

                          <div
                            className="chirp-bold-font"
                            style={{
                              color:
                                themeName === "dark-theme"
                                  ? "white"
                                  : "rgb(15, 20, 25)",
                              fontSize: font17.fontSize,
                              lineHeight: font17.lineHeight,
                            }}
                          >
                            €19.04 / month
                            <div
                              className="chirp-regular-font"
                              style={{
                                color:
                                  themeName === "dark-theme"
                                    ? "#71767A"
                                    : "#697884",
                                fontSize: font13.fontSize,
                                lineHeight: font13.lineHeight,
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
                          marginTop: "24px",
                        }}
                      >
                        {phoneVerifiedErrorMessage ? (
                          <div
                            className="chirp-regular-font"
                            style={{
                              borderRadius: "8px",
                              color: "rgb(15, 20, 25)",
                              fontSize: font14.fontSize,
                              lineHeight: font14.lineHeight,
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
                          className={`${themeName}-white-btn login-button next-btn ${
                            phoneVerifiedErrorMessage ? "mt-2" : ""
                          }`}
                          variant="dark"
                          style={{
                            width: "100%",
                            height: "36px",
                            color: "white",
                            backgroundColor:
                              themeName === "dark-theme" ? "white" : "#0f141a",

                            opacity: subErrorPhoneVerifiedTabLoading
                              ? "0.5"
                              : "1",
                          }}
                        >
                          {subErrorPhoneVerifiedTabLoading ? (
                            <LoadingSpinner
                              isCheckoutProcess={true}
                              strokeColor={"rgb(29, 155, 240)"}
                              fontSize={true}
                            ></LoadingSpinner>
                          ) : (
                            <span>Subscribe & Pay</span>
                          )}
                        </Button>
                      </div>
                      <div
                        className="chirp-regular-font"
                        style={{
                          width: "81.5%",
                          margin: "0 auto",
                          fontSize: font13.fontSize,
                          lineHeight: font13.lineHeight,
                          border:
                            themeName === "dark-theme"
                              ? "1px solid rgb(70, 70, 70)"
                              : "1px solid black",
                          borderRadius: "8px",
                          padding: "6px",
                          color:
                            themeName === "dark-theme" ? "#71767A" : "#697884",
                          marginTop: "24px",
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
                        filter:
                          themeName === "dark-theme"
                            ? "drop-shadow(rgb(51, 54, 57) 0px -1px 1px)"
                            : "",
                        boxShadow:
                          themeName === "dark-theme"
                            ? "inset 0px 4px 3px -3px rgba(50, 50, 50, 0.75)"
                            : "inset 0px 4px 3px -3px rgba(101, 119, 134, 0.15)",
                        minHeight: phoneVerifiedErrorMessage
                          ? "305px"
                          : "270px",
                        borderBottomLeftRadius: "16px",
                        borderBottomRightRadius: "16px",
                        backgroundColor:
                          themeName === "dark-theme" ? "black" : "#fdfdfe",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        overflowY: "auto",
                        padding: "16px 0px",
                      }}
                    >
                      <div
                        style={{
                          width: "81.5%",
                          display: "flex",
                          gap: "2.5%",
                        }}
                      >
                        <div
                          onClick={() => {
                            setindividualSubOptionPremiumPlusAnnualTab(true);
                            setindividualSubOptionPremiumPlusMonthlyTab(false);
                          }}
                          className={`individual-subscription-box individual-subscription-box-${themeName}`}
                          style={{
                            padding: "8px",
                            flex: 1,
                            maxHeight: "110px",
                            cursor: "pointer",
                            borderWidth: "1px",
                            borderRadius: "16px",
                            backgroundColor:
                              themeName === "dark-theme" ? "black" : "white",
                            filter:
                              themeName === "dark-theme"
                                ? "drop-shadow(rgb(51, 54, 57) 1px -1px 1px)"
                                : "",
                            boxShadow:
                              themeName === "dark-theme"
                                ? "rgba(255, 255, 255, 0.2) 0px 0px 15px, rgba(255, 255, 255, 0.15) 0px 0px 3px 1px"
                                : "0 0 15px rgba(101, 119,134,0.2), 0 0 5px 3px rgba(101,119,134,0.15)",
                            border: individualSubOptionPremiumPlusAnnualTab
                              ? "2px solid #339bf0"
                              : "2px solid transparent",
                            transition: "transform 0.3s ease",
                          }}
                        >
                          <span
                            className="chirp-regular-font"
                            style={{
                              color:
                                themeName === "dark-theme"
                                  ? "#71767A"
                                  : "#697884",
                              fontSize: font14.fontSize,
                              lineHeight: font14.lineHeight,
                            }}
                          >
                            Annual Plan{" "}
                            <span
                              className="chirp-bold-font"
                              style={{
                                fontSize: font11.fontSize,
                                lineHeight: font11.lineHeight,
                                borderRadius: "9999px",
                                position: "relative",
                                bottom: "1px",
                                padding: "4px",
                                height: "20px",
                                backgroundColor:
                                  themeName === "dark-theme"
                                    ? "#05241A"
                                    : "#dcf8eb",
                                color:
                                  themeName === "dark-theme"
                                    ? "#C2F1DC"
                                    : "rgb(0, 67, 41)",
                              }}
                            >
                              <span>Save 12%</span>
                            </span>
                          </span>

                          <span
                            className="chirp-bold-font"
                            style={{
                              color:
                                themeName === "dark-theme"
                                  ? "white"
                                  : "rgb(15, 20, 25)",
                              fontSize: font17.fontSize,
                              lineHeight: font17.lineHeight,
                              display: "block",
                            }}
                          >
                            €99.96 / year
                          </span>
                          <div
                            className="chirp-regular-font"
                            style={{
                              color:
                                themeName === "dark-theme"
                                  ? "#71767A"
                                  : "#697884",
                              fontSize: font13.fontSize,
                              lineHeight: font13.lineHeight,
                            }}
                          >
                            €99.96 per year billed annually
                          </div>
                        </div>
                        <div
                          className={`individual-subscription-box individual-subscription-box-${themeName}`}
                          onClick={() => {
                            setindividualSubOptionPremiumPlusMonthlyTab(true);
                            setindividualSubOptionPremiumPlusAnnualTab(false);
                          }}
                          style={{
                            padding: "8px",
                            flex: 1,
                            maxHeight: "110px",
                            cursor: "pointer",
                            borderWidth: "1px",
                            borderRadius: "16px",
                            backgroundColor:
                              themeName === "dark-theme" ? "black" : "white",
                            filter:
                              themeName === "dark-theme"
                                ? "drop-shadow(rgb(51, 54, 57) 1px -1px 1px)"
                                : "",

                            boxShadow:
                              themeName === "dark-theme"
                                ? "rgba(255, 255, 255, 0.2) 0px 0px 15px, rgba(255, 255, 255, 0.15) 0px 0px 3px 1px"
                                : "0 0 15px rgba(101, 119,134,0.2), 0 0 5px 3px rgba(101,119,134,0.15)",
                            border: individualSubOptionPremiumPlusMonthlyTab
                              ? "2px solid #339bf0"
                              : "2px solid transparent",
                            transition: "transform 0.3s ease",
                          }}
                        >
                          <span
                            className="chirp-regular-font"
                            style={{
                              color:
                                themeName === "dark-theme"
                                  ? "#71767A"
                                  : "#697884",
                              fontSize: font14.fontSize,
                              lineHeight: font14.lineHeight,
                            }}
                          >
                            Monthly Plan{" "}
                          </span>

                          <div
                            className="chirp-bold-font"
                            style={{
                              color:
                                themeName === "dark-theme"
                                  ? "white"
                                  : "rgb(15, 20, 25)",
                              fontSize: font17.fontSize,
                              lineHeight: font17.lineHeight,
                            }}
                          >
                            €9.52 / month
                            <div
                              className="chirp-regular-font"
                              style={{
                                color:
                                  themeName === "dark-theme"
                                    ? "#71767A"
                                    : "#697884",
                                fontSize: font13.fontSize,
                                lineHeight: font13.lineHeight,
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
                          marginTop: "24px",
                        }}
                      >
                        {" "}
                        {phoneVerifiedErrorMessage ? (
                          <div
                            className="chirp-regular-font"
                            style={{
                              borderRadius: "8px",
                              color: "rgb(15, 20, 25)",
                              fontSize: font14.fontSize,
                              lineHeight: font14.lineHeight,
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
                          className={`${themeName}-white-btn login-button next-btn ${
                            phoneVerifiedErrorMessage ? "mt-2" : ""
                          }`}
                          variant="dark"
                          style={{
                            width: "100%",
                            height: "36px",
                            color: "white",
                            backgroundColor:
                              themeName === "dark-theme" ? "white" : "#0f141a",

                            opacity: subErrorPhoneVerifiedTabLoading
                              ? "0.5"
                              : "1",
                          }}
                        >
                          {subErrorPhoneVerifiedTabLoading ? (
                            <LoadingSpinner
                              isCheckoutProcess={true}
                              strokeColor={"rgb(29, 155, 240)"}
                              fontSize={true}
                            ></LoadingSpinner>
                          ) : (
                            <span>Subscribe & Pay</span>
                          )}
                        </Button>
                      </div>
                      <div
                        className="chirp-regular-font"
                        style={{
                          width: "81.5%",
                          margin: "0 auto",
                          fontSize: font13.fontSize,
                          lineHeight: font13.lineHeight,
                          border:
                            themeName === "dark-theme"
                              ? "1px solid rgb(70, 70, 70)"
                              : "1px solid black",
                          borderRadius: "8px",
                          padding: "6px",
                          color:
                            themeName === "dark-theme" ? "#71767A" : "#697884",
                          marginTop: "24px",
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
                        filter:
                          themeName === "dark-theme"
                            ? "drop-shadow(rgb(51, 54, 57) 0px -1px 1px)"
                            : "",
                        boxShadow:
                          themeName === "dark-theme"
                            ? "inset 0px 4px 3px -3px rgba(50, 50, 50, 0.75)"
                            : "inset 0px 4px 3px -3px rgba(101, 119, 134, 0.15)",
                        minHeight: phoneVerifiedErrorMessage
                          ? "305px"
                          : "270px",
                        borderBottomLeftRadius: "16px",
                        borderBottomRightRadius: "16px",
                        backgroundColor:
                          themeName === "dark-theme" ? "black" : "#fdfdfe",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        overflowY: "auto",
                        padding: "16px 0px",
                      }}
                    >
                      <div
                        style={{
                          width: "81.5%",
                          display: "flex",
                          gap: "2.5%",
                        }}
                      >
                        <div
                          onClick={() => {
                            setindividualSubOptionPremiumPlusAnnualTab(true);
                            setindividualSubOptionPremiumPlusMonthlyTab(false);
                          }}
                          className={`individual-subscription-box individual-subscription-box-${themeName}`}
                          style={{
                            padding: "8px",
                            flex: 1,
                            maxHeight: "110px",
                            cursor: "pointer",
                            borderWidth: "1px",
                            borderRadius: "16px",
                            backgroundColor:
                              themeName === "dark-theme" ? "black" : "white",
                            filter:
                              themeName === "dark-theme"
                                ? "drop-shadow(rgb(51, 54, 57) 1px -1px 1px)"
                                : "",
                            boxShadow:
                              themeName === "dark-theme"
                                ? "rgba(255, 255, 255, 0.2) 0px 0px 15px, rgba(255, 255, 255, 0.15) 0px 0px 3px 1px"
                                : "0 0 15px rgba(101, 119,134,0.2), 0 0 5px 3px rgba(101,119,134,0.15)",
                            border: individualSubOptionPremiumPlusAnnualTab
                              ? "2px solid #339bf0"
                              : "2px solid transparent",
                            transition: "transform 0.3s ease",
                          }}
                        >
                          <span
                            className="chirp-regular-font"
                            style={{
                              color:
                                themeName === "dark-theme"
                                  ? "#71767A"
                                  : "#697884",
                              fontSize: font14.fontSize,
                              lineHeight: font14.lineHeight,
                            }}
                          >
                            Annual Plan{" "}
                            <span
                              className="chirp-bold-font"
                              style={{
                                fontSize: font11.fontSize,
                                lineHeight: font11.lineHeight,
                                borderRadius: "9999px",
                                position: "relative",
                                bottom: "1px",
                                padding: "4px",
                                height: "20px",
                                backgroundColor:
                                  themeName === "dark-theme"
                                    ? "#05241A"
                                    : "#dcf8eb",
                                color:
                                  themeName === "dark-theme"
                                    ? "#C2F1DC"
                                    : "rgb(0, 67, 41)",
                              }}
                            >
                              <span>Save 11%</span>
                            </span>
                          </span>

                          <span
                            className="chirp-bold-font"
                            style={{
                              color:
                                themeName === "dark-theme"
                                  ? "white"
                                  : "rgb(15, 20, 25)",
                              display: "block",
                              fontSize: font17.fontSize,
                              lineHeight: font17.lineHeight,
                            }}
                          >
                            €38.08 / year
                          </span>
                          <div
                            className="chirp-regular-font"
                            style={{
                              color:
                                themeName === "dark-theme"
                                  ? "#71767A"
                                  : "#697884",
                              fontSize: font13.fontSize,
                              lineHeight: font13.lineHeight,
                            }}
                          >
                            €38.08 per year billed annually
                          </div>
                        </div>
                        <div
                          className={`individual-subscription-box individual-subscription-box-${themeName}`}
                          onClick={() => {
                            setindividualSubOptionPremiumPlusMonthlyTab(true);
                            setindividualSubOptionPremiumPlusAnnualTab(false);
                          }}
                          style={{
                            padding: "8px",
                            flex: 1,
                            maxHeight: "110px",
                            cursor: "pointer",
                            borderWidth: "1px",
                            borderRadius: "16px",
                            backgroundColor:
                              themeName === "dark-theme" ? "black" : "white",
                            filter:
                              themeName === "dark-theme"
                                ? "drop-shadow(rgb(51, 54, 57) 1px -1px 1px)"
                                : "",

                            boxShadow:
                              themeName === "dark-theme"
                                ? "rgba(255, 255, 255, 0.2) 0px 0px 15px, rgba(255, 255, 255, 0.15) 0px 0px 3px 1px"
                                : "0 0 15px rgba(101, 119,134,0.2), 0 0 5px 3px rgba(101,119,134,0.15)",
                            border: individualSubOptionPremiumPlusMonthlyTab
                              ? "2px solid #339bf0"
                              : "2px solid transparent",
                            transition: "transform 0.3s ease",
                          }}
                        >
                          <span
                            className="chirp-regular-font"
                            style={{
                              color:
                                themeName === "dark-theme"
                                  ? "#71767A"
                                  : "#697884",
                              fontSize: font14.fontSize,
                              lineHeight: font14.lineHeight,
                            }}
                          >
                            Monthly Plan{" "}
                          </span>

                          <div
                            className="chirp-bold-font"
                            style={{
                              color:
                                themeName === "dark-theme"
                                  ? "white"
                                  : "rgb(15, 20, 25)",
                              fontSize: font17.fontSize,
                              lineHeight: font17.lineHeight,
                            }}
                          >
                            €3.57 / month
                            <div
                              className="chirp-regular-font"
                              style={{
                                color:
                                  themeName === "dark-theme"
                                    ? "#71767A"
                                    : "#697884",
                                fontSize: font13.fontSize,
                                lineHeight: font13.lineHeight,
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
                          marginTop: "24px",
                        }}
                      >
                        {" "}
                        {phoneVerifiedErrorMessage ? (
                          <div
                            className="chirp-regular-font"
                            style={{
                              borderRadius: "8px",
                              color: "rgb(15, 20, 25)",
                              fontSize: font14.fontSize,
                              lineHeight: font14.lineHeight,
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
                          className={`${themeName}-white-btn login-button next-btn ${
                            phoneVerifiedErrorMessage ? "mt-2" : ""
                          }`}
                          variant="dark"
                          style={{
                            width: "100%",
                            height: "36px",
                            color: "white",
                            backgroundColor:
                              themeName === "dark-theme" ? "white" : "#0f141a",
                            opacity: subErrorPhoneVerifiedTabLoading
                              ? "0.5"
                              : "1",
                          }}
                        >
                          {subErrorPhoneVerifiedTabLoading ? (
                            <LoadingSpinner
                              isCheckoutProcess={true}
                              strokeColor={"rgb(29, 155, 240)"}
                              fontSize={true}
                            ></LoadingSpinner>
                          ) : (
                            <span>Subscribe & Pay</span>
                          )}
                        </Button>
                      </div>
                      <div
                        className="chirp-regular-font"
                        style={{
                          width: "81.5%",
                          margin: "0 auto",
                          fontSize: font13.fontSize,
                          lineHeight: font13.lineHeight,
                          border:
                            themeName === "dark-theme"
                              ? "1px solid rgb(70, 70, 70)"
                              : "1px solid black",
                          color:
                            themeName === "dark-theme" ? "#71767A" : "#697884",
                          borderRadius: "8px",
                          padding: "6px",
                          marginTop: "24px",
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
                  <Modal.Body
                    className={`scrollbar-add full-access-sub-index-first full-access-sub-index-first-${themeName} scrollbar-add-${themeName}`}
                    style={{
                      height: "100%",
                      overflowY: "auto",
                    }}
                  >
                    {subTabIndexFromOrganizationSelect !== 3 ? (
                      <>
                        <div
                          onClick={() => {
                            handleCloseSubscriptionModal();
                          }}
                          style={{
                            cursor: "pointer",
                            position: "relative",
                            // right: "30px",
                            width: "100%",
                          }}
                        >
                          <div
                            className={`close-button close-button-${themeName}`}
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
                                margin: "5px",
                              }}
                              onClick={() =>
                                isVerifiedOrgsSignUpRoute
                                  ? handleNavigateClickCloseBtn
                                  : handleCloseSubscriptionModal
                              }
                              width={20}
                              height={20}
                              color={
                                themeName === "dark-theme"
                                  ? "white"
                                  : "rgb(15,20,25)"
                              }
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
                        </div>
                        <div
                          className="chirp-bold-font"
                          style={{
                            fontSize: font20.fontSize,
                            lineHeight: font20.lineHeight,
                            position: "relative",
                            bottom: "30px",
                            color:
                              themeName === "dark-theme" ? "white" : "black",
                          }}
                        >
                          Verified Organizations
                        </div>
                        <div
                          className=""
                          style={{
                            backgroundColor:
                              themeName === "dark-theme"
                                ? "rgb(32,35,39)"
                                : "black",
                            borderRadius: "9999px",
                            display: "flex",
                            alignItems: "center",
                            position: "relative",
                            bottom: "15px",
                            padding: "2px",
                          }}
                        >
                          <div
                            style={{
                              width:
                                font15.fontSize === "Default"
                                  ? "164px"
                                  : font15.fontSize === "Small"
                                  ? "156px"
                                  : font15.fontSize === "Extra small"
                                  ? "152px"
                                  : font15.fontSize === "Large"
                                  ? "184px"
                                  : font15.fontSize === "Extra large"
                                  ? "196px"
                                  : null,
                              height:
                                font15.fontSize === "Default"
                                  ? "36px"
                                  : font15.fontSize === "Small"
                                  ? "35px"
                                  : font15.fontSize === "Extra small"
                                  ? "34px"
                                  : font15.fontSize === "Large"
                                  ? "38px"
                                  : font15.fontSize === "Extra large"
                                  ? "42px"
                                  : null,
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
                                className="chirp-bold-font"
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
                              <span className="chirp-bold-font" style={{}}>
                                Full Access
                              </span>
                            </button>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div
                        onClick={() => {
                          setSubTabIndexFromOrganizationSelect(
                            subTabIndexFromOrganizationSelect - 1
                          );
                          setTabStyleOrganizationFullAccessPlan(true);
                        }}
                        style={{
                          cursor: "pointer",
                          position: "relative",
                          // right: "30px",
                          width: "100%",
                        }}
                      >
                        {" "}
                        <div
                          onClick={() => {
                            setSubTabIndexFromOrganizationSelect(
                              subTabIndexFromOrganizationSelect - 1
                            );
                            setTabStyleOrganizationFullAccessPlan(true);
                          }}
                          className={`close-button close-button-${themeName}`}
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
                            color={
                              themeName === "dark-theme"
                                ? "white"
                                : `rgb(15,20,25)`
                            }
                            fill="currentColor"
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
                          {/* close signin modal icon finish to check  */}
                        </div>{" "}
                      </div>
                    )}

                    {/* seperator  */}
                    {subTabIndexFromOrganizationSelect === 1 &&
                    tabStyleOrganizationBasicPlan ? (
                      <>
                        <div
                          style={{
                            width: "89.5%",
                            backgroundColor:
                              themeName === "dark-theme"
                                ? "#16181C"
                                : "rgba(247, 249, 249, 1.00)",
                            borderRadius: "16px",
                            padding: "16px",
                          }}
                        >
                          <div
                            className="chirp-bold-font"
                            style={{
                              color:
                                themeName === "dark-theme"
                                  ? "#71767B"
                                  : "rgb(83, 100, 113)",
                              fontSize: font23.fontSize,
                              lineHeight: font23.lineHeight,
                            }}
                          >
                            Basic
                          </div>
                          <div
                            className="chirp-bold-font"
                            style={{
                              fontSize: font34.fontSize,
                              lineHeight: font34.lineHeight,
                              color:
                                themeName === "dark-theme" ? "white" : "black",
                            }}
                          >
                            Find your customers and grow your business
                          </div>
                          <div
                            className="basic-plan-parent-div chirp-medium-font"
                            style={{
                              fontSize: font15.fontSize,
                              lineHeight: font15.lineHeight,
                              color:
                                themeName === "dark-theme" ? "white" : "black",
                            }}
                          >
                            <div className="mt-2">
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
                                  color={
                                    themeName === "dark-theme" ? "white" : ""
                                  }
                                  fill="currentColor"
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
                                  color={
                                    themeName === "dark-theme" ? "white" : ""
                                  }
                                  fill="currentColor"
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
                                  color={
                                    themeName === "dark-theme" ? "white" : ""
                                  }
                                  fill="currentColor"
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
                                  color={
                                    themeName === "dark-theme" ? "white" : ""
                                  }
                                  fill="currentColor"
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
                              fontSize: font15.fontSize,
                              lineHeight: font15.lineHeight,
                              color: themeName === "dark-theme" ? "white" : "",
                            }}
                            className="mt-1 chirp-regular-font"
                          >
                            + For a limited time, advertising credit to spend on
                            your organization{" "}
                            <span
                              className="chirp-bold-font"
                              style={{
                                fontSize: font15.fontSize,
                                lineHeight: font15.lineHeight,
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
                            width: "89.5%",
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
                                setorganizationSubPlanPriceBasic("€2,261");
                                setorganizationSubPlanTypeBasic("Annual Plan");
                                setorganizationSubPlanPriceFullAccess("");
                                setorganizationSubPlanTypeFullAccess("");
                              }}
                              style={
                                ({ activeIndividualOptionTabStyle },
                                {
                                  flex: 1,
                                  maxHeight: "72px",
                                  padding: "12px",
                                  cursor: "pointer",
                                  borderWidth: "1px",
                                  borderRadius: "16px",
                                  backgroundColor:
                                    themeName === "dark-theme"
                                      ? "black"
                                      : "white",
                                  filter:
                                    themeName === "dark-theme"
                                      ? "drop-shadow(rgb(51, 54, 57) 1px -1px 1px)"
                                      : "",

                                  boxShadow:
                                    themeName === "dark-theme"
                                      ? "rgba(255, 255, 255, 0.2) 0px 0px 15px, rgba(255, 255, 255, 0.15) 0px 0px 3px 1px"
                                      : "0 0 15px rgba(101, 119,134,0.2), 0 0 5px 3px rgba(101,119,134,0.15)",
                                  border: basicAnnualTabStyle
                                    ? "2px solid #339bf0"
                                    : "2px solid transparent",
                                  transition: "transform 0.3s ease",
                                })
                              }
                              className={`organization-subscription-box organization-subscription-box-${themeName}`}
                            >
                              <div>
                                <div
                                  className="chirp-bold-font"
                                  style={{
                                    color:
                                      themeName === "dark-theme"
                                        ? "white"
                                        : "rgb(15, 20, 25)",
                                    fontSize: font17.fontSize,
                                    lineHeight: font17.lineHeight,
                                    display: " flex",
                                  }}
                                >
                                  {" "}
                                  <div>{yearlyFee} / year</div>
                                  <div
                                    className="chirp-bold-font"
                                    style={{
                                      fontSize: font11.fontSize,
                                      lineHeight: font11.lineHeight,
                                      borderRadius: "9999px",
                                      height: "20px",
                                      display: "flex",
                                      justifyContent: "center",
                                      alignItems: "center",
                                      position: "relative",
                                      left: "3px",
                                      top: "5px",
                                      backgroundColor:
                                        themeName === "dark-theme"
                                          ? "#05241A"
                                          : "#dcf8eb",
                                      color:
                                        themeName === "dark-theme"
                                          ? "#C2F1DC"
                                          : "rgb(0, 67, 41)",
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
                                  className="chirp-regular-font"
                                  style={{
                                    color:
                                      themeName === "dark-theme"
                                        ? "#71767A"
                                        : "rgb(83, 100, 113)",
                                    fontSize: font14.fontSize,
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
                                setbasicAnnualTabStyle(false);
                                setbasicMonthlyTabStyle(true);
                                setorganizationSubPlanPriceBasic("€226.10");
                                setorganizationSubPlanTypeBasic("Monthly Plan");
                                setorganizationSubPlanPriceFullAccess("");
                                setorganizationSubPlanTypeFullAccess("");
                              }}
                              style={
                                ({ activeOrganizationOptionTabStyle },
                                {
                                  flex: 1,
                                  maxHeight: "72px",
                                  padding: "12px",
                                  cursor: "pointer",
                                  borderWidth: "1px",
                                  borderRadius: "16px",
                                  backgroundColor:
                                    themeName === "dark-theme"
                                      ? "black"
                                      : "white",
                                  filter:
                                    themeName === "dark-theme"
                                      ? "drop-shadow(rgb(51, 54, 57) 1px -1px 1px)"
                                      : "",

                                  boxShadow:
                                    themeName === "dark-theme"
                                      ? "rgba(255, 255, 255, 0.2) 0px 0px 15px, rgba(255, 255, 255, 0.15) 0px 0px 3px 1px"
                                      : "0 0 15px rgba(101, 119,134,0.2), 0 0 5px 3px rgba(101,119,134,0.15)",
                                  border: basicMonthlyTabStyle
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
                                  className="chirp-bold-font"
                                  style={{
                                    color:
                                      themeName === "dark-theme"
                                        ? "white"
                                        : "rgb(15, 20, 25)",
                                    fontSize: font17.fontSize,
                                    lineHeight: font17.lineHeight,
                                  }}
                                >
                                  {monthyleFee} / month
                                </div>{" "}
                                <div
                                  className="chirp-regular-font"
                                  style={{
                                    color:
                                      themeName === "dark-theme"
                                        ? "#71767A"
                                        : "rgb(83, 100, 113)",
                                    fontSize: font14.fontSize,
                                  }}
                                >
                                  Monthly plan
                                </div>
                              </div>
                            </div>
                            {/* monthly plan finish to check  */}
                          </div>
                          <div
                            className="mt-3 chirp-regular-font"
                            style={{
                              color:
                                themeName === "dark-theme"
                                  ? "#4A4F51"
                                  : "rgb(83, 100, 113)",
                              fontSize: font11.fontSize,
                              lineHeight: font11.lineHeight,
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
                            onClick={
                              !checkoutProcessLoadingBar
                                ? () =>
                                    handleCheckoutStripeApiOrganizationBasic()
                                : null
                            }
                            className={`mt-4 subscribe-btn-basic-plan subscribe-btn-basic-plan-${themeName}`}
                            style={{
                              backgroundColor:
                                themeName === "dark-theme"
                                  ? "rgb(239,243,244)"
                                  : "#0f1518",
                              color: "white",
                              height: "34px",
                              width: "100%",
                              borderRadius: "9999px",
                              border: " none",
                              opacity: !checkoutProcessLoadingBar ? "1" : "0.5",
                            }}
                            variant="info"
                          >
                            {checkoutProcessLoadingBar ? (
                              <LoadingSpinner
                                isCheckoutProcess={true}
                                strokeColor={"rgb(29, 155, 240)"}
                                fontSize={true}
                              ></LoadingSpinner>
                            ) : (
                              <>
                                <div
                                  className="chirp-bold-font"
                                  style={{
                                    color:
                                      themeName === "dark-theme" ? "black" : "",
                                    fontSize: font15.fontSize,
                                    lineHeight: font15.lineHeight,
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
                              </>
                            )}
                          </Button>
                          <div
                            className="mt-3 chirp-regular-font"
                            style={{
                              width: "100%",
                              color:
                                themeName === "dark-theme"
                                  ? "#4A4F51"
                                  : "rgb(83, 100, 113)",

                              fontSize: font11.fontSize,
                              lineHeight: font11.lineHeight,
                              height: "40px",
                            }}
                          >
                            By clicking Subscribe, you agree to our{" "}
                            <span
                              className="text-decoration-thickness-2px"
                              style={{
                                cursor: "pointer",
                                color:
                                  themeName === "dark-theme"
                                    ? "white"
                                    : "rgb(15, 20, 25)",
                                textDecoration: "underline",
                                textDecorationColor:
                                  themeName === "dark-theme"
                                    ? "white"
                                    : "rgb(15, 20, 25)",
                              }}
                            >
                              Purchaser Terms of Service.
                            </span>{" "}
                            Subscriptions auto-renew until canceled. All
                            accounts that sign up must pass manual approval.
                          </div>
                        </div>{" "}
                      </>
                    ) : subTabIndexFromOrganizationSelect === 2 &&
                      tabStyleOrganizationFullAccessPlan ? (
                      <>
                        <div
                          style={{
                            width: "89.5%",
                            backgroundColor:
                              themeName === "dark-theme"
                                ? "#16181c"
                                : "rgba(247, 249, 249, 1.00)",
                            borderRadius: "16px",
                            padding: "16px",
                          }}
                        >
                          <div
                            className="chirp-bold-font"
                            style={{
                              color:
                                themeName === "dark-theme"
                                  ? "#71767A"
                                  : "rgb(83, 100, 113)",
                              fontSize: font23.fontSize,
                              lineHeight: font23.lineHeight,
                            }}
                          >
                            Full Access
                          </div>
                          <div
                            className="chirp-bold-font"
                            style={{
                              fontSize: font34.fontSize,
                              lineHeight: font34.lineHeight,
                              color:
                                themeName === "dark-theme" ? "white" : "black",
                            }}
                          >
                            Find your customers and grow your business
                          </div>
                          <div
                            className="basic-plan-parent-div chirp-medium-font"
                            style={{
                              fontSize: font15.fontSize,
                              lineHeight: font15.lineHeight,
                              color:
                                themeName === "dark-theme" ? "white" : "black",
                            }}
                          >
                            <div className="mt-2">
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
                                  color={
                                    themeName === "dark-theme" ? "white" : ""
                                  }
                                  fill="currentColor"
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
                                  color={
                                    themeName === "dark-theme" ? "white" : ""
                                  }
                                  fill="currentColor"
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
                                  color={
                                    themeName === "dark-theme" ? "white" : ""
                                  }
                                  fill="currentColor"
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
                                  color={
                                    themeName === "dark-theme" ? "white" : ""
                                  }
                                  fill="currentColor"
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
                                  color={
                                    themeName === "dark-theme" ? "white" : ""
                                  }
                                  fill="currentColor"
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
                                  color={
                                    themeName === "dark-theme" ? "white" : ""
                                  }
                                  fill="currentColor"
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
                              fontSize: font15.fontSize,
                              lineHeight: font15.lineHeight,
                              color: themeName === "dark-theme" ? "white" : "",
                            }}
                            className="mt-1 chirp-regular-font"
                          >
                            + For a limited time, advertising credit to spend on
                            your organization{" "}
                            <span
                              className="chirp-bold-font"
                              style={{
                                fontSize: font15.fontSize,
                                lineHeight: font15.lineHeight,
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
                            width: "89.5%",
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
                                setfullAccessAnnualTabStyle(true);
                                setfullAccessMonthlyTabStyle(false);
                                setorganizationSubPlanPriceFullAccess(
                                  "€11,305"
                                );
                                setorganizationSubPlanTypeFullAccess(
                                  "Annual Plan"
                                );
                                setorganizationSubPlanPriceBasic("");
                                setorganizationSubPlanTypeBasic("");
                              }}
                              style={
                                ({ activeIndividualOptionTabStyle },
                                {
                                  flex: 1,
                                  maxHeight: "72px",
                                  padding: "12px",
                                  cursor: "pointer",
                                  borderWidth: "1px",
                                  borderRadius: "16px",
                                  backgroundColor:
                                    themeName === "dark-theme"
                                      ? "black"
                                      : "white",
                                  filter:
                                    themeName === "dark-theme"
                                      ? "drop-shadow(rgb(51, 54, 57) 1px -1px 1px)"
                                      : "",

                                  boxShadow:
                                    themeName === "dark-theme"
                                      ? "rgba(255, 255, 255, 0.2) 0px 0px 15px, rgba(255, 255, 255, 0.15) 0px 0px 3px 1px"
                                      : "0 0 15px rgba(101, 119,134,0.2), 0 0 5px 3px rgba(101,119,134,0.15)",
                                  border: fullAccessAnnualTabStyle
                                    ? "2px solid #339bf0"
                                    : "2px solid transparent",
                                  transition: "transform 0.3s ease",
                                })
                              }
                              className={`organization-subscription-box organization-subscription-box-${themeName}`}
                            >
                              <div>
                                <div
                                  className="chirp-bold-font"
                                  style={{
                                    color:
                                      themeName === "dark-theme"
                                        ? "white"
                                        : "rgb(15, 20, 25)",
                                    fontSize: font17.fontSize,
                                    lineHeight: font17.lineHeight,
                                    display: " flex",
                                  }}
                                >
                                  {" "}
                                  <div>€11,305 / year</div>
                                  <div
                                    className="chirp-bold-font"
                                    style={{
                                      borderRadius: "9999px",
                                      height: "20px",
                                      display: "flex",
                                      justifyContent: "center",
                                      alignItems: "center",
                                      position: "relative",
                                      left: "3px",
                                      top: "5px",
                                      backgroundColor:
                                        themeName === "dark-theme"
                                          ? "#05241A"
                                          : "#dcf8eb",
                                      color:
                                        themeName === "dark-theme"
                                          ? "#C2F1DC"
                                          : "rgb(0, 67, 41)",
                                      fontSize: font11.fontSize,
                                      lineHeight: font11.lineHeight,
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
                                  className="chirp-regular-font"
                                  style={{
                                    color:
                                      themeName === "dark-theme"
                                        ? "#71767A"
                                        : "rgb(83, 100, 113)",
                                    fontSize: font14.fontSize,
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
                                setfullAccessAnnualTabStyle(false);
                                setfullAccessMonthlyTabStyle(true);
                                setorganizationSubPlanPriceFullAccess(
                                  "€1,130.50"
                                );
                                setorganizationSubPlanTypeFullAccess(
                                  "Monthly Plan"
                                );
                                setorganizationSubPlanPriceBasic("");
                                setorganizationSubPlanTypeBasic("");
                              }}
                              style={
                                ({ activeOrganizationOptionTabStyle },
                                {
                                  flex: 1,
                                  maxHeight: "72px",
                                  padding: "12px",
                                  cursor: "pointer",
                                  borderWidth: "1px",
                                  borderRadius: "16px",
                                  backgroundColor:
                                    themeName === "dark-theme"
                                      ? "black"
                                      : "white",
                                  filter:
                                    themeName === "dark-theme"
                                      ? "drop-shadow(rgb(51, 54, 57) 1px -1px 1px)"
                                      : "",

                                  boxShadow:
                                    themeName === "dark-theme"
                                      ? "rgba(255, 255, 255, 0.2) 0px 0px 15px, rgba(255, 255, 255, 0.15) 0px 0px 3px 1px"
                                      : "0 0 15px rgba(101, 119,134,0.2), 0 0 5px 3px rgba(101,119,134,0.15)",
                                  border: fullAccessMonthlyTabStyle
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
                                  className="chirp-bold-font"
                                  style={{
                                    color:
                                      themeName === "dark-theme"
                                        ? "white"
                                        : "rgb(15, 20, 25)",
                                    fontSize: font17.fontSize,
                                    lineHeight: font17.lineHeight,
                                  }}
                                >
                                  €1,130.50 / month
                                </div>{" "}
                                <div
                                  className="chirp-regular-font"
                                  style={{
                                    color:
                                      themeName === "dark-theme"
                                        ? "#71767A"
                                        : "rgb(83, 100, 113)",
                                    fontSize: font14.fontSize,
                                  }}
                                >
                                  Monthly plan
                                </div>
                              </div>
                            </div>
                            {/* monthly plan finish to check  */}
                          </div>
                          <div
                            className="mt-3 chirp-regular-font"
                            style={{
                              color:
                                themeName === "dark-theme"
                                  ? "#4A4F51"
                                  : "rgb(83, 100, 113)",
                              fontSize: font11.fontSize,
                              lineHeight: font11.lineHeight,
                              height: "20px",
                            }}
                          >
                            {" "}
                            <span>
                              Full Access is{" "}
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
                                : fullAccessMonthlyTabStyle
                                ? "€59.50 per handle per month"
                                : ""}{" "}
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
                              handleFullAccessOrganizationPlanModal()
                            }
                            className={`mt-4 subscribe-btn-full-access-plan subscribe-btn-full-access-plan-${themeName}`}
                            style={{
                              backgroundColor:
                                themeName === "dark-theme"
                                  ? "rgb(239,243,244)"
                                  : "#0f1518",
                              color: "white",
                              height: "34px",
                              width: "100%",
                              borderRadius: "9999px",
                              border: " none",
                            }}
                            variant="info"
                          >
                            <div
                              className="chirp-bold-font"
                              style={{
                                color:
                                  themeName === "dark-theme" ? "black" : "",
                                fontSize: font15.fontSize,
                                lineHeight: font15.lineHeight,
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
                                  ? `€11,305 per year`
                                  : `€1,130.50 per month`}{" "}
                              </span>
                            </div>
                          </Button>
                          <div
                            className="mt-3 chirp-regular-font"
                            style={{
                              width: "100%",
                              color:
                                themeName === "dark-theme"
                                  ? "#4A4F51"
                                  : "rgb(83, 100, 113)",
                              fontSize: font11.fontSize,
                              lineHeight: font11.lineHeight,
                              height: "40px",
                            }}
                          >
                            By clicking Subscribe, you agree to our{" "}
                            <span
                              className="text-decoration-thickness-2px"
                              style={{
                                cursor: "pointer",
                                color:
                                  themeName === "dark-theme"
                                    ? "white"
                                    : "rgb(15, 20, 25)",
                                textDecoration: "underline",
                                textDecorationColor:
                                  themeName === "dark-theme"
                                    ? "white"
                                    : "rgb(15, 20, 25)",
                              }}
                            >
                              Purchaser Terms of Service.
                            </span>{" "}
                            Subscriptions auto-renew until canceled. Accounts
                            that sign up are reviewed for authenticity. If an
                            account signs up and is not an organization, you
                            will be rejected and not refunded.
                          </div>
                        </div>{" "}
                      </>
                    ) : subTabIndexFromOrganizationSelect === 3 ? (
                      <>
                        {" "}
                        <div
                          className="mt-4 chirp-heavy-font"
                          style={{
                            color:
                              themeName === "dark-theme" ? "white" : "black",
                            width: "81.5%",
                            fontSize: font31.fontSize,
                            lineHeight: font31.lineHeight,
                          }}
                        >
                          Apply for Full Access
                        </div>
                        <div
                          className="mt-3 chirp-regular-font"
                          style={{
                            width: "81.5%",
                            color:
                              themeName === "dark-theme"
                                ? "#71767A"
                                : "rgb(83, 100, 113)",
                            fontSize: font15.fontSize,
                            lineHeight: font15.lineHeight,
                          }}
                        >
                          We’ll use this information to assess your application.
                          Upon receipt of payment and if eligible, you’ll be
                          invited to activate your account. For information
                          learn more{" "}
                          <span
                            className="apply-for-access-text-underline"
                            style={{
                              color: "rgb(29, 155, 240)",
                              cursor: "pointer",
                            }}
                          >
                            here
                          </span>
                          .
                        </div>
                        {/* text fields start to check  */}
                        <TextField
                          className="mt-3"
                          value={organizationName}
                          onChange={(e) => setOrganizationName(e.target.value)}
                          type="text"
                          id="outlined-basic"
                          variant={"outlined"}
                          label={`Organization name`}
                          style={{
                            width: "81.5%",
                            height: "58px",
                          }}
                          error={organizationNameFilled && !organizationName}
                          InputLabelProps={{
                            style: {
                              color: themeName === "dark-theme" ? "white" : "",
                            },
                          }}
                          InputProps={{
                            style: {
                              color:
                                themeName === "dark-theme" ? "white" : "black",
                            },
                          }}
                          sx={{
                            color: "green",
                            "& .Mui-focused input + fieldset": {
                              border:
                                organizationNameFilled && !organizationName
                                  ? "2px solid rgb(244, 33, 46)!important"
                                  : "2px solid #1d9bf0 !important",
                            },
                            "& .MuiOutlinedInput-notchedOutline": {
                              borderRadius: "initial !important",
                              borderColor:
                                organizationNameFilled && !organizationName
                                  ? "rgb(244, 33, 46)!important"
                                  : themeName !== "dark-theme"
                                  ? "#cfd9de !important"
                                  : "#333639 !important",
                            },
                            "& .MuiInputLabel-shrink": {
                              color:
                                organizationNameFilled && !organizationName
                                  ? "rgb(244, 33, 46)!important"
                                  : "#1f9cf0 !important",
                            },
                          }}
                        />
                        <div
                          className="mt-3"
                          style={{
                            width: "81.5%",
                          }}
                        >
                          <TextField
                            style={{
                              width: "100%",
                              height: "60px",
                            }}
                            disabled
                            id="filled-disabled"
                            label={
                              <div
                                style={{
                                  flexDirection: "column",
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                <div
                                  style={{
                                    fontSize: font13.fontSize,
                                    position: "relative",
                                    bottom: "5px",
                                  }}
                                >
                                  Organization @handle
                                </div>
                                <div
                                  style={{
                                    position: "relative",
                                    bottom: "5px",
                                  }}
                                >
                                  {`@${userInfo.username}`}
                                </div>
                              </div>
                            }
                            variant="filled"
                            InputLabelProps={{
                              style: {
                                color:
                                  themeName === "dark-theme"
                                    ? "#3C3F41"
                                    : "#999A9B",
                              },
                            }}
                            InputProps={{
                              disableUnderline: true, // Alt çizgiyi kaldırır
                            }}
                            sx={{
                              "& .MuiFilledInput-root": {
                                background:
                                  themeName === "dark-theme"
                                    ? "#0D0E11 !important"
                                    : "#f7f9fa !important",
                                height: "60px",
                                borderRadius: "initial !important",
                              },
                            }}
                          />
                        </div>
                        <TextField
                          className="mt-3"
                          type="text"
                          id="outlined-basic"
                          variant={"outlined"}
                          label={`Your full name`}
                          style={{
                            width: "81.5%",
                            height: "58px",
                          }}
                          value={yourFullName}
                          onChange={(e) => setYourFullName(e.target.value)}
                          error={
                            organizationYourFullNameFilled && !yourFullName
                          }
                          InputLabelProps={{
                            style: {
                              color: themeName === "dark-theme" ? "white" : "",
                            },
                          }}
                          InputProps={{
                            style: {
                              color:
                                themeName === "dark-theme" ? "white" : "black",
                            },
                          }}
                          sx={{
                            "& .Mui-focused input + fieldset": {
                              border:
                                organizationYourFullNameFilled && !yourFullName
                                  ? "2px solid rgb(244, 33, 46)!important"
                                  : "2px solid #1d9bf0 !important",
                            },
                            "& .MuiOutlinedInput-notchedOutline": {
                              borderRadius: "initial !important",

                              borderColor:
                                organizationYourFullNameFilled && !yourFullName
                                  ? "rgb(244, 33, 46)!important"
                                  : themeName !== "dark-theme"
                                  ? "#cfd9de !important"
                                  : "#333639 !important",
                            },
                            "& .MuiInputLabel-shrink": {
                              color:
                                organizationYourFullNameFilled && !yourFullName
                                  ? "rgb(244, 33, 46)!important"
                                  : "#1f9cf0 !important",
                            },
                          }}
                        />
                        <TextField
                          className="mt-3"
                          type="text"
                          id="outlined-basic"
                          variant={"outlined"}
                          label={`Organization email address`}
                          style={{
                            width: "81.5%",
                            height: "58px",
                          }}
                          value={organizationEmailAdress}
                          onChange={(e) =>
                            setOrganizationEmailAdress(e.target.value)
                          }
                          error={
                            (organizationEmailAdressFilled &&
                              !organizationEmailAdress) ||
                            invalidEmailError
                          }
                          InputLabelProps={{
                            style: {
                              color: themeName === "dark-theme" ? "white" : "",
                            },
                          }}
                          InputProps={{
                            style: {
                              color:
                                themeName === "dark-theme" ? "white" : "black",
                            },
                          }}
                          sx={{
                            "& .Mui-focused input + fieldset": {
                              border:
                                (organizationEmailAdressFilled &&
                                  !organizationEmailAdress) ||
                                invalidEmailError
                                  ? "2px solid rgb(244, 33, 46)!important"
                                  : "2px solid #1d9bf0 !important",
                            },
                            "& .MuiOutlinedInput-notchedOutline": {
                              borderRadius: "initial !important",

                              borderColor:
                                (organizationEmailAdressFilled &&
                                  !organizationEmailAdress) ||
                                invalidEmailError
                                  ? "rgb(244, 33, 46) !important"
                                  : themeName !== "dark-theme"
                                  ? "#cfd9de !important"
                                  : "#333639 !important",
                            },
                            "& .MuiInputLabel-shrink": {
                              color:
                                (organizationEmailAdressFilled &&
                                  !organizationEmailAdress) ||
                                invalidEmailError
                                  ? "rgb(244, 33, 46)!important"
                                  : "#1f9cf0 !important",
                            },
                          }}
                        />
                        {invalidEmailError && organizationEmailAdress ? (
                          <div
                            className="chirp-regular-font"
                            style={{
                              color: "rgb(244, 33, 46)",
                              fontSize: font13.fontSize,
                              lineHeight: font13.lineHeight,
                              width: "81.5%",
                              position: "relative",
                              left: "10px",
                              top: "2px",
                            }}
                          >
                            {invalidEmailError}
                          </div>
                        ) : null}
                        <TextField
                          className="mt-3"
                          type="text"
                          id="outlined-basic"
                          variant={"outlined"}
                          label={`Organization website`}
                          style={{
                            width: "81.5%",
                            height: "58px",
                          }}
                          value={organizationWebSite}
                          onChange={(e) =>
                            setOrganizationWebSite(e.target.value)
                          }
                          error={
                            organizationWebSiteFilled && !organizationWebSite
                          }
                          InputLabelProps={{
                            style: {
                              color: themeName === "dark-theme" ? "white" : "",
                            },
                          }}
                          InputProps={{
                            style: {
                              color:
                                themeName === "dark-theme" ? "white" : "black",
                            },
                          }}
                          sx={{
                            "& .Mui-focused input + fieldset": {
                              border:
                                organizationWebSiteFilled &&
                                !organizationWebSite
                                  ? "2px solid rgb(244, 33, 46)!important"
                                  : "2px solid #1d9bf0 !important",
                            },
                            "& .MuiOutlinedInput-notchedOutline": {
                              borderRadius: "initial !important",

                              borderColor:
                                organizationWebSiteFilled &&
                                !organizationWebSite
                                  ? "rgb(244, 33, 46)!important"
                                  : themeName !== "dark-theme"
                                  ? "#cfd9de !important"
                                  : "#333639 !important",
                            },
                            "& .MuiInputLabel-shrink": {
                              color:
                                organizationWebSiteFilled &&
                                !organizationWebSite
                                  ? "rgb(244, 33, 46)!important"
                                  : "#1f9cf0 !important",
                            },
                          }}
                        />
                        {/* organization type  start to check  */}
                        <PopupState
                          variant="popover"
                          popupId="demo-popup-popover"
                        >
                          {(popupState) => (
                            <div
                              style={{
                                width: "81.5%",
                              }}
                            >
                              <div
                                {...bindTrigger(popupState)}
                                className="mt-3"
                                style={{
                                  borderRadius: "4px",
                                  cursor: "pointer",
                                  color: "#536471",
                                  width: "100%",
                                  minHeight: "58px",
                                  padding: "4px",
                                  border:
                                    themeName === "dark-theme"
                                      ? "1px solid #cfd9de"
                                      : "1px solid rgb(207, 217, 222)",
                                  borderWidth: showOrganizationTypeContent
                                    ? "2px"
                                    : "1px",
                                  borderColor:
                                    organizationDisplayedOrganizationTypeFilled &&
                                    !displayedOrganizationType
                                      ? "rgb(244, 33, 46)"
                                      : showOrganizationTypeContent
                                      ? "#1d9bf0"
                                      : themeName === "dark-theme"
                                      ? "#333639"
                                      : "#cfd9de",
                                }}
                              >
                                <div
                                  style={{
                                    display: "inline-block",
                                    float: "left",
                                  }}
                                >
                                  <div
                                    className="main-outline-text-year-picker chirp-regular-font"
                                    style={{
                                      position: "relative",
                                      left: "10px",
                                      top: "5px",
                                      fontSize: font14.fontSize,
                                      lineHeight: font14.lineHeight,
                                      color: showOrganizationTypeContent
                                        ? "#1d9bf0"
                                        : "rgba(83,100,113,1.00)",
                                    }}
                                  >
                                    <span
                                      style={{
                                        color:
                                          organizationDisplayedOrganizationTypeFilled &&
                                          !displayedOrganizationType
                                            ? "rgb(244, 33, 46)"
                                            : themeName === "dark-theme"
                                            ? "#71767A"
                                            : "rgb(83, 100, 113)",
                                      }}
                                    >
                                      Organization Type
                                    </span>
                                  </div>
                                  <div
                                    className="mt-2 selected-year-string-parent-div chirp-bold-font"
                                    style={{
                                      position: "relative",
                                      left: "10px",
                                      fontSize: font17.fontSize,
                                      lineHeight: font17.lineHeight,
                                      color:
                                        themeName === "dark-theme"
                                          ? "white"
                                          : "black",
                                    }}
                                  >
                                    {displayedOrganizationType}
                                  </div>
                                </div>
                                <div
                                  style={{
                                    float: "right",
                                    position: "relative",
                                    // top: "30%",
                                    minHeight: "50px",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                  }}
                                >
                                  <svg
                                    width={`${1.5}em`}
                                    height={`${1.5}em`}
                                    color={
                                      showOrganizationTypeContent
                                        ? "#1d9bf0"
                                        : "rgba(83,100,113,1.00)"
                                    }
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                    className="svg-year-picker r-4qtqp9 r-yyyyoo r-dnmrzs r-1plcrui r-lrvibr r-14j79pv r-1pgswnq r-50lct3 r-fdch1b r-633pao r-u8s1d r-1v2oles"
                                  >
                                    <g className="path-parent-g-year-picker">
                                      <path d="M3.543 8.96l1.414-1.42L12 14.59l7.043-7.05 1.414 1.42L12 17.41 3.543 8.96z"></path>
                                    </g>
                                  </svg>
                                </div>
                              </div>
                              <Popover
                                open={popupState.open}
                                onClose={popupState.close}
                                {...bindPopover(popupState)}
                                anchorOrigin={{
                                  vertical: "top",
                                  horizontal: "center",
                                }}
                                transformOrigin={{
                                  vertical: "bottom",
                                  horizontal: "center",
                                }}
                                style={{
                                  zIndex: 9999999,
                                }}
                                className={`${
                                  themeName === "dark-theme"
                                    ? "popover-material-ui-dark-theme-organization-type"
                                    : themeName !== "dark-theme"
                                    ? "popover-material-ui-light-theme-organization-type"
                                    : "hideshowMessageDeletePopover"
                                }`}
                              >
                                <div
                                  onMouseEnter={() => {
                                    sethoveredOrganizationType("business");
                                  }}
                                  onClick={() => {
                                    setshowOrganizationTypeContent(false);
                                    popupState.close();
                                    setTimeout(() => {
                                      setdisplayedOrganizationType("Business");
                                    }, 150);
                                  }}
                                  style={{
                                    padding: "8px",
                                    cursor: "pointer",
                                    backgroundColor:
                                      hoveredOrganizationType === "business"
                                        ? "#5aa0ff"
                                        : "",
                                    borderRadius: "4px",
                                    color:
                                      themeName === "dark-theme"
                                        ? "white"
                                        : "black",
                                  }}
                                >
                                  Business
                                </div>
                                <div
                                  onMouseEnter={() => {
                                    sethoveredOrganizationType("government");
                                  }}
                                  onClick={() => {
                                    setshowOrganizationTypeContent(false);
                                    popupState.close();
                                    setTimeout(() => {
                                      setdisplayedOrganizationType(
                                        "Government"
                                      );
                                    }, 150);
                                  }}
                                  style={{
                                    padding: "8px",
                                    cursor: "pointer",
                                    backgroundColor:
                                      hoveredOrganizationType === "government"
                                        ? "#5aa0ff"
                                        : "",
                                    borderRadius: "4px",
                                    color:
                                      themeName === "dark-theme"
                                        ? "white"
                                        : "black",
                                  }}
                                >
                                  Government
                                </div>
                              </Popover>
                            </div>
                          )}
                        </PopupState>
                        {/* </div> */}
                        {/* organization type  finish to check  */}
                        {/* text fields finish to check  */}
                        <div
                          className="mt-3"
                          style={{
                            width: "81.5%",
                            gap: "2.5%",
                            display: "flex",
                          }}
                        >
                          <div
                            style={{
                              width: "50px",
                            }}
                          >
                            <div
                              onClick={() => setClicked(!clicked)}
                              style={{
                                width: "36px",
                                height: "36px",
                                borderRadius: "50%",
                                cursor: "pointer",
                                marginBlock: "0.5em",
                              }}
                              className={
                                themeName === "dark-theme" && clicked
                                  ? "hover-background-effect-clicked-dark-theme"
                                  : themeName !== "dark-theme" && clicked
                                  ? "hover-background-effect-clicked-light-theme"
                                  : themeName === "dark-theme" && !clicked
                                  ? "hover-background-effect-dark-theme"
                                  : themeName !== "dark-theme" && !clicked
                                  ? "hover-background-effect-light-theme"
                                  : ""
                              }
                            >
                              <div
                                style={{
                                  backgroundColor: clicked
                                    ? "#1d9bf0"
                                    : "transparent",
                                  border: clicked
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
                                    display: clicked ? "initial" : "none",
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
                          <div
                            className="mt-2 chirp-regular-font"
                            style={{
                              color:
                                themeName === "dark-theme"
                                  ? "#71767A"
                                  : "rgb(83, 100, 113)",
                              fontSize: font15.fontSize,
                              lineHeight: font15.lineHeight,
                              position: "relative",
                              bottom: "4px",
                            }}
                          >
                            By checking this box you indicate you have read and
                            agree to the terms and conditions available{" "}
                            <span
                              style={{
                                color: "rgb(29, 155, 240)",
                                cursor: "pointer",
                              }}
                            >
                              here
                            </span>
                            .
                          </div>
                        </div>
                        <Button
                          onClick={
                            clicked && !checkoutProcessLoadingBar
                              ? () =>
                                  handleSubmitOrganizationInformationForFullAccessSubscription(
                                    organizationName,
                                    yourFullName,
                                    organizationEmailAdress,
                                    organizationWebSite,
                                    displayedOrganizationType
                                  )
                              : ""
                          }
                          //   className={`login-button next-btn mt-4 mb-5
                          // }`}
                          className={`mt-4 subscribe-btn-full-access-plan subscribe-btn-full-access-plan-${themeName}`}
                          variant="dark"
                          style={{
                            outlineStyle: "none",
                            borderStyle: "none",
                            transitionDuration: "0.2s",
                            border: " none",
                            width: "81.5%",
                            height: "36px",
                            color: themeName === "dark-theme" ? "black" : "",
                            backgroundColor:
                              themeName === "dark-theme"
                                ? "rgb(239,243,244)"
                                : "#0f1518",
                            opacity:
                              clicked && !checkoutProcessLoadingBar
                                ? "1"
                                : "0.5",
                          }}
                        >
                          {checkoutProcessLoadingBar ? (
                            <LoadingSpinner
                              isCheckoutProcess={true}
                              strokeColor={"rgb(29, 155, 240)"}
                              fontSize={true}
                            ></LoadingSpinner>
                          ) : (
                            <span>Submit</span>
                          )}
                        </Button>
                      </>
                    ) : null}
                  </Modal.Body>
                </>
              ) : tabIndex === 2 &&
                !phoneVerified &&
                !showVerifyPhoneNumberPasswordModal ? (
                <>
                  {subErrorPhoneVerifiedTabLoading ? (
                    <Modal.Body
                      style={{
                        margin: "0px",
                        padding: "0px",
                      }}
                      className="signin-modal-body-child-non-reactivate sub-modal-loading-spinner"
                    >
                      {" "}
                      <div
                        className="mt-5"
                        style={{
                          minHeight: "550px",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <LoadingSpinner
                          strokeColor={"rgb(29, 155, 240)"}
                        ></LoadingSpinner>
                      </div>
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
                        onClick={() => {
                          handleCloseSubscriptionModal();
                        }}
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
                          onClick={() =>
                            isSubscriptionEligibilityCheckRouteForIndividualSubscription
                              ? navigate("/i/premium_sign_up")
                              : handleCloseSubscriptionModal()
                          }
                          className={`close-button close-button-${themeName}`}
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
                              margin: "5px",
                            }}
                            width={20}
                            height={20}
                            color={
                              themeName === "dark-theme"
                                ? "white"
                                : "rgb(15,20,25)"
                            }
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
                          className="chirp-heavy-font"
                          style={{
                            fontSize: font26.fontSize,
                            lineHeight: font26.lineHeight,
                            color: themeName === "dark-theme" ? "white" : "",
                          }}
                        >
                          Verify your phone number
                        </div>
                        <div
                          className="mt-2 chirp-regular-font"
                          style={{
                            fontSize: font15.fontSize,
                            lineHeight: font15.lineHeight,
                            color:
                              themeName === "dark-theme"
                                ? "#71767A"
                                : "rgb(83, 100, 113)",
                          }}
                        >
                          Verify your phone number to subscribe for Premium. It
                          should just take a few minutes.
                        </div>
                        <Button
                          onClick={() => {
                            handleVerifyYourPasswordModalAfterVerifyYourPhoneNumberClick();
                          }}
                          className={`login-button next-btn mt-4 mb-5 ${themeName}-white-btn`}
                          variant="dark"
                          style={{
                            width: "100%",
                            height: "52px",
                            color: "white",
                            backgroundColor:
                              themeName === "dark-theme" ? "white" : "#0f141a",
                          }}
                        >
                          Verify your phone number
                        </Button>
                      </div>
                    </Modal.Body>
                  )}
                </>
              ) : tabIndex === 2 &&
                showVerifyPhoneNumberPasswordModal &&
                !correctPassword ? (
                <>
                  {subErrorPhoneVerifiedTabLoading ? (
                    <Modal.Body
                      style={{
                        margin: "0px",
                        padding: "0px",
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
                    <>
                      {" "}
                      <Modal.Body
                        style={{
                          margin: "0px",
                          padding: "0px",
                        }}
                        className="verify-password-tab-sub-modal"
                      >
                        <div
                          className="mt-5"
                          style={{
                            width: "81.5%",
                            minHeight: "530px",
                          }}
                        >
                          <div
                            className="chirp-bold-font"
                            style={{
                              fontSize: font31.fontSize,
                              lineHeight: font31.lineHeight,
                              color: themeName === "dark-theme" ? "white" : "",
                            }}
                          >
                            Verify your password
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
                            Re-enter your C password to continue.
                          </div>
                          {/* start to check verify your password  */}
                          <FormControl
                            className="mt-4"
                            sx={{
                              width: "100%",
                            }}
                            variant="outlined"
                          >
                            <InputLabel
                              sx={{
                                color:
                                  themeName === "dark-theme" ? "#71767B" : "",

                                "&.MuiInputLabel-shrink": {
                                  color: "#1f9cf0 !important",
                                },
                              }}
                              htmlFor="outlined-adornment-password"
                            >
                              Password{" "}
                            </InputLabel>
                            <OutlinedInput
                              autoFocus
                              sx={{
                                color:
                                  themeName === "dark-theme"
                                    ? "white"
                                    : "black",
                                "& .MuiOutlinedInput-notchedOutline": {
                                  borderColor:
                                    themeName === "dark-theme"
                                      ? "rgb(70, 70, 70) !important"
                                      : "#cfd9de !important",
                                  border:
                                    themeName === "dark-theme"
                                      ? "1px solid rgb(70, 70, 70) !important"
                                      : "",
                                },
                                "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                  {
                                    border: "2px solid #1d9bf0 !important",
                                  },
                              }}
                              onChange={(e) => handleNewPasswordChange(e)}
                              value={verifyPasswordInput}
                              id="outlined-adornment-password"
                              type={showPassword ? "text" : "password"}
                              endAdornment={
                                <InputAdornment position="end">
                                  {showPassword ? (
                                    <svg
                                      onClick={handleClickShowPassword}
                                      onMouseDown={handleMouseDownPassword}
                                      style={{
                                        cursor: "pointer",
                                      }}
                                      color={
                                        themeName === "dark-theme"
                                          ? "white"
                                          : "rgb(15, 20, 25)"
                                      }
                                      fill="currentColor"
                                      width={22}
                                      height={22}
                                      viewBox="0 0 24 24"
                                      aria-hidden="true"
                                      className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-18yzcnr r-yc9v9c"
                                    >
                                      <g>
                                        <path d="M3.693 21.707l-1.414-1.414 2.429-2.429c-2.479-2.421-3.606-5.376-3.658-5.513l-.131-.352.131-.352c.133-.353 3.331-8.648 10.937-8.648 2.062 0 3.989.621 5.737 1.85l2.556-2.557 1.414 1.414L3.693 21.707zm-.622-9.706c.356.797 1.354 2.794 3.051 4.449l2.417-2.418c-.361-.609-.553-1.306-.553-2.032 0-2.206 1.794-4 4-4 .727 0 1.424.192 2.033.554l2.263-2.264C14.953 5.434 13.512 5 11.986 5c-5.416 0-8.258 5.535-8.915 7.001zM11.986 10c-1.103 0-2 .897-2 2 0 .178.023.352.067.519l2.451-2.451c-.167-.044-.341-.067-.519-.067zm10.951 1.647l.131.352-.131.352c-.133.353-3.331 8.648-10.937 8.648-.709 0-1.367-.092-2-.223v-2.047c.624.169 1.288.27 2 .27 5.415 0 8.257-5.533 8.915-7-.252-.562-.829-1.724-1.746-2.941l1.438-1.438c1.53 1.971 2.268 3.862 2.33 4.027z"></path>
                                      </g>
                                    </svg>
                                  ) : (
                                    <svg
                                      onClick={handleClickShowPassword}
                                      onMouseDown={handleMouseDownPassword}
                                      style={{
                                        cursor: "pointer",
                                      }}
                                      width={22}
                                      height={22}
                                      color={
                                        themeName === "dark-theme"
                                          ? "white"
                                          : "rgb(15, 20, 25)"
                                      }
                                      fill="currentColor"
                                      viewBox="0 0 24 24"
                                      aria-hidden="true"
                                      className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-18yzcnr r-yc9v9c"
                                    >
                                      <g>
                                        <path d="M12 21c-7.605 0-10.804-8.296-10.937-8.648L.932 12l.131-.352C1.196 11.295 4.394 3 12 3s10.804 8.296 10.937 8.648l.131.352-.131.352C22.804 12.705 19.606 21 12 21zm-8.915-9c.658 1.467 3.5 7 8.915 7s8.257-5.533 8.915-7c-.658-1.467-3.5-7-8.915-7s-8.257 5.533-8.915 7zM12 16c-2.206 0-4-1.794-4-4s1.794-4 4-4 4 1.794 4 4-1.794 4-4 4zm0-6c-1.103 0-2 .897-2 2s.897 2 2 2 2-.897 2-2-.897-2-2-2z"></path>
                                      </g>
                                    </svg>
                                  )}
                                </InputAdornment>
                              }
                              label="Password"
                            />
                          </FormControl>
                          {/* finish to check verify your password  */}
                        </div>

                        {verifyPasswordInput ? (
                          <Button
                            style={{
                              width: "81.5%",
                              height: "52px",
                              color: "white",
                              fontSize: font17.fontSize,
                              lineHeight: font17.lineHeight,
                              position: "relative",
                              bottom: "20px",
                            }}
                            className={`login-button next-btn ${themeName}-white-btn chirp-bold-font`}
                            variant="dark"
                            onClick={() => {
                              handleCheckIsPasswordInputCorrect();
                            }}
                          >
                            Next
                          </Button>
                        ) : (
                          <Button
                            style={{
                              width: "81.5%",
                              height: "52px",
                              color: "black",
                              fontSize: font17.fontSize,
                              lineHeight: font17.lineHeight,
                              position: "relative",
                              bottom: "20px",
                            }}
                            className={`forgot-password-button ${themeName}-black-btn ${themeName}-light-theme-white-btn chirp-bold-font`}
                            variant="light"
                            onClick={() => {
                              setsubErrorPhoneVerifiedTabLoading(true);
                              setTimeout(() => {
                                setTabIndex(null);
                                setshowVerifyPhoneNumberPasswordModal(false);
                                setphoneVerified(false);
                                setPhoneVerifiedErrorMessage(null);
                                setshowSubscriptionModal(false);
                                setsubErrorPhoneVerifiedTabLoading(false);
                              }, 500);
                            }}
                          >
                            Cancel
                          </Button>
                        )}
                      </Modal.Body>
                    </>
                  )}
                </>
              ) : tabIndex === 2 &&
                showVerifyPhoneNumberPasswordModal &&
                correctPassword &&
                !showgeneratedQrCodeModal ? (
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
                    <>
                      <Modal.Body className="verify-password-tab-sub-modal">
                        <div
                          className="mt-5"
                          style={{
                            width: "81.5%",
                            minHeight: "500px",
                          }}
                        >
                          <div
                            className="chirp-bold-font"
                            style={{
                              fontSize: font31.fontSize,
                              lineHeight: font31.lineHeight,
                              color:
                                themeName === "dark-theme" ? "white" : "black",
                            }}
                          >
                            Add a phone number
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
                            Enter the phone number you’d like to associate with
                            your Connectify account.
                          </div>
                          {/* start to check your phone number */}
                          <div
                            className="mt-5"
                            onClick={handleShowOptions}
                            style={{
                              borderRadius: "4px",
                              cursor: "pointer",
                              color: "#536471",
                              width: "100%",
                              minHeight: "58px",
                              padding: "4px",
                              border: "1px solid rgb(207, 217, 222)",
                              borderWidth: showpopoverCountriesAndTheirPhoneCode
                                ? "2px"
                                : "1px",
                              borderColor: showpopoverCountriesAndTheirPhoneCode
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
                                  fontSize: font14.fontSize,
                                  lineHeight: font14.lineHeight,
                                  color: showpopoverCountriesAndTheirPhoneCode
                                    ? "#1d9bf0"
                                    : "rgba(83,100,113,1.00)",
                                }}
                              >
                                <span
                                  style={{
                                    color:
                                      themeName === "dark-theme"
                                        ? "#71767A"
                                        : "",
                                  }}
                                >
                                  Country code
                                </span>
                                <div
                                  onClick={handleShowOptions}
                                  className="mt-2 selected-year-string-parent-div"
                                  style={{
                                    fontSize: font17.fontSize,
                                    lineHeight: font17.lineHeight,
                                    color:
                                      themeName === "dark-theme"
                                        ? "white"
                                        : "black",
                                  }}
                                >
                                  {country ? (
                                    <>
                                      +{getCountryCallingCode(country)}{" "}
                                      {en[country]}
                                    </>
                                  ) : (
                                    <>
                                      +{getCountryCallingCode("DE")} {en["DE"]}
                                    </>
                                  )}
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
                                    showpopoverCountriesAndTheirPhoneCode
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
                            onBlur={() =>
                              setpopoverCountriesAndTheirPhoneCode(false)
                            }
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
                              borderWidth: showpopoverCountriesAndTheirPhoneCode
                                ? "2px"
                                : "1px",
                              opacity: 0,
                            }}
                            value={country}
                            onChange={handleSelectChange}
                          >
                            <option value="">{en["ZZ"]}</option>
                            {sortedCountries.map((country) => (
                              <option key={uuidv4()} value={country}>
                                +{getCountryCallingCode(country)} {en[country]}
                              </option>
                            ))}
                          </select>
                          <TextField
                            error={validPhoneNumber && phoneNumber?.length}
                            autoFocus={true}
                            value={phoneNumber}
                            onChange={(e) => setphoneNumber(e.target.value)}
                            type="text"
                            id="outlined-basic"
                            variant={"outlined"}
                            label={`Your phone number`}
                            style={{
                              width: "100%",
                              height: "58px",
                              position: "relative",
                              bottom: "45px",
                            }}
                            InputProps={{
                              style: {
                                color:
                                  themeName === "dark-theme" ? "white" : "",
                              },
                            }}
                            InputLabelProps={{
                              style: {
                                color:
                                  themeName === "dark-theme" ? "#71767B" : "",
                              },
                            }}
                            sx={{
                              "& .Mui-focused input + fieldset": {
                                border: !validPhoneNumber
                                  ? "2px solid rgb(244, 33, 46)!important"
                                  : "2px solid #1d9bf0 !important",
                              },
                              "& .MuiOutlinedInput-notchedOutline": {
                                borderColor: !validPhoneNumber
                                  ? "rgb(244, 33, 46)!important"
                                  : themeName === "dark-theme"
                                  ? "rgb(70,70,70) !important"
                                  : "#cfd9de !important",
                              },
                              "& .MuiInputLabel-shrink": {
                                color: !validPhoneNumber
                                  ? "rgb(244, 33, 46)!important"
                                  : "#1f9cf0 !important",
                              },
                            }}
                          />{" "}
                          <div
                            className="chirp-regular-font"
                            style={{
                              color: "rgb(244, 33, 46)",
                              fontSize: font13.fontSize,
                              lineHeight: font13.lineHeight,
                              position: "relative",
                              left: "10px",
                              bottom: "45px",
                            }}
                          >
                            {errorPhoneInValidMessage
                              ? errorPhoneInValidMessage
                              : null}
                          </div>
                          {/* finish to check your phone number  */}
                          {/* footer text and check box  start to check */}
                          <div
                            style={{
                              width: "100%",
                              gap: "2.5%",
                              display: "flex",
                              position: "relative",
                              bottom: "20px",
                            }}
                          >
                            <div
                              className="mt-2 chirp-regular-font"
                              style={{
                                color:
                                  themeName === "dark-theme"
                                    ? "white"
                                    : "rgb(83, 100, 113)",
                                fontSize: font15.fontSize,
                                lineHeight: font15.lineHeight,
                                position: "relative",
                                bottom: "4px",
                              }}
                            >
                              Let people who have your phone number find and
                              connect with you on Connectify.{" "}
                              <span
                                className="learn-more-add-phone-number"
                                style={{
                                  color: "rgb(29, 155, 240)",
                                  cursor: "pointer",
                                }}
                              >
                                Learn more
                              </span>
                            </div>
                            <div
                              style={{
                                width: "50px",
                                minHeight: "50px",
                              }}
                            >
                              <div
                                onClick={() => setClicked(!clicked)}
                                style={{
                                  width: "36px",
                                  minHeight: "36px",
                                  borderRadius: "50%",
                                  cursor: "pointer",
                                  marginBlock: "0.5em",
                                }}
                                className={
                                  themeName === "dark-theme" && clicked
                                    ? "hover-background-effect-clicked-dark-theme"
                                    : themeName !== "dark-theme" && clicked
                                    ? "hover-background-effect-clicked-light-theme"
                                    : themeName === "dark-theme" && !clicked
                                    ? "hover-background-effect-dark-theme"
                                    : themeName !== "dark-theme" && !clicked
                                    ? "hover-background-effect-light-theme"
                                    : ""
                                }
                              >
                                <div
                                  style={{
                                    backgroundColor: clicked
                                      ? "#1d9bf0"
                                      : "transparent",
                                    border: clicked
                                      ? "none"
                                      : themeName === "dark-theme"
                                      ? "2px solid rgb(70,70,70)"
                                      : "2px solid #536471",

                                    borderWidth: "2px ",
                                    width: "20px",
                                    minHeight: "20px",
                                    position: "relative",
                                    left: "8px",
                                    top: "8px",
                                    borderRadius: "3px",
                                  }}
                                >
                                  <svg
                                    style={{
                                      position: "relative",
                                      left: clicked ? "2px" : "",
                                      top: clicked ? "2px" : "",
                                      display: clicked ? "block" : "none",
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
                          {/* footer text and check box  finish to check */}
                        </div>
                        {validPhoneNumber &&
                        phoneNumber?.length &&
                        validPhoneNumber !== "unknown" ? (
                          <Button
                            style={{
                              width: "81.5%",
                              height: "52px",
                              color: "white",
                              fontSize: font17.fontSize,
                              lineHeight: font17.lineHeight,
                              position: "relative",
                              bottom: "10px",
                            }}
                            className={`login-button next-btn ${themeName}-white-btn chirp-bold-font`}
                            variant="dark"
                            onClick={() => {
                              handleSubscriptionInfoNonPhoneVerifiedUser();
                            }}
                          >
                            Next
                          </Button>
                        ) : (
                          <Button
                            style={{
                              width: "81.5%",
                              height: "52px",
                              color:
                                themeName === "dark-theme" ? "white" : "black",
                              fontSize: font17.fontSize,
                              lineHeight: font17.lineHeight,
                              position: "relative",
                              bottom: "10px",
                            }}
                            className={`forgot-password-button ${themeName}-black-btn ${themeName}-light-theme-white-btn chirp-bold-font`}
                            variant="light"
                            onClick={() => {
                              setsubErrorPhoneVerifiedTabLoading(true);
                              setTimeout(() => {
                                setshowVerifyPhoneNumberPasswordModal(false);
                                setshowSubscriptionModal(false);
                                setphoneVerified(false);
                                setTabIndex(null);
                                setCountry("");
                                setPhoneVerifiedErrorMessage("");
                                setsubErrorPhoneVerifiedTabLoading(false);
                              }, 500);
                            }}
                          >
                            Cancel
                          </Button>
                        )}
                      </Modal.Body>
                    </>
                  )}
                </>
              ) : tabIndex === 2 &&
                showVerifyPhoneNumberPasswordModal &&
                correctPassword &&
                showgeneratedQrCodeModal &&
                !showVerifyingCodeModal ? (
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
                      <div
                        className="mt-5"
                        style={{
                          minHeight: "550px",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <LoadingSpinner
                          strokeColor={"rgb(29, 155, 240)"}
                        ></LoadingSpinner>
                      </div>
                    </Modal.Body>
                  ) : (
                    <Modal.Body>
                      <div
                        className="mt-5"
                        style={{
                          minHeight: "550px",
                          width: "81.5%",
                        }}
                      >
                        {/* start to check close svg  */}
                        <div
                          onClick={() => {
                            handleCloseSubscriptionModal();
                          }}
                          className={`close-button close-button-${themeName}`}
                          style={{
                            cursor: "pointer",
                            position: "absolute",
                            top: "15px",
                            left: "15px",
                            maxHeight: "36px",
                            minWidth: "36px",
                            borderRadius: "50%",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <div>
                            {/* close signin modal icon start to check  */}
                            <svg
                              style={{
                                border: "none",
                                margin: "5px",
                                position: "relative",
                                top: "2.5px",
                                left: "0.5px",
                              }}
                              onClick={handleCloseSubscriptionModal}
                              width={20}
                              height={20}
                              color={
                                themeName === "dark-theme"
                                  ? "white"
                                  : "rgb(15,20,25)"
                              }
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
                        {/* finish to check close svg  */}
                        <div
                          className="chirp-bold-font"
                          style={{
                            fontSize: font31.fontSize,
                            lineHeight: font31.lineHeight,
                            letterSpacing: "0.5px",
                            color: themeName === "dark-theme" ? "white" : "",
                          }}
                        >
                          Verify your phone number
                        </div>
                        <div
                          className="mt-3 chirp-regular-font"
                          style={{
                            color:
                              themeName === "dark-theme"
                                ? "#71767A"
                                : "rgb(83, 100, 113)",
                            fontSize: font15.fontSize,
                            lineHeight: font15.lineHeight,
                          }}
                        >
                          Use the camera app on your phone to scan this QR code.
                          Send the auto-generated text message to verify your
                          phone number. Standard SMS fees may apply.
                        </div>
                        <div
                          className="mt-5"
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <div>
                            {" "}
                            <QRCodeSVG
                              value={`sms:+${TWILIO_NUMBER}&body=${verifyPhoneCode}`}
                            />
                          </div>
                          <div
                            className="mt-5"
                            style={{
                              textAlign: "left",
                            }}
                          >
                            <div
                              className="chirp-regular-font"
                              style={{
                                color:
                                  themeName === "dark-theme"
                                    ? "#71767A"
                                    : "rgb(83, 100, 113)",
                                fontSize: font15.fontSize,
                                lineHeight: font15.lineHeight,
                              }}
                            >
                              {"Can't scan the QR code?"}
                            </div>
                            <div
                              className="chirp-regular-font"
                              style={{
                                color:
                                  themeName === "dark-theme"
                                    ? "#71767A"
                                    : "rgb(83, 100, 113)",
                                fontSize: font15.fontSize,
                                lineHeight: font15.lineHeight,
                              }}
                            >{`Text ${verifyPhoneCode} to ${TWILIO_NUMBER}.`}</div>
                          </div>
                        </div>
                        <div
                          className="mt-5"
                          style={{
                            backgroundColor: "green",
                          }}
                        >
                          {" "}
                          <Button
                            style={{
                              width: "77.5%",
                              height: "52px",
                              color: "white",
                              fontSize: font17.fontSize,
                              lineHeight: font17.lineHeight,
                              position: "absolute",
                              bottom: "20px",
                            }}
                            className={`login-button next-btn ${themeName}-white-btn chirp-bold-font`}
                            variant="dark"
                            onClick={() => {
                              handleVerifyPhoneForSubscription();
                            }}
                          >
                            Next
                          </Button>
                        </div>
                      </div>
                    </Modal.Body>
                  )}
                </>
              ) : tabIndex === 2 &&
                showVerifyPhoneNumberPasswordModal &&
                correctPassword &&
                showgeneratedQrCodeModal &&
                showVerifyingCodeModal &&
                showSubscriptionProcessNotCompletedModal === null ? (
                <Modal.Body>
                  <div
                    className="mt-5"
                    style={{
                      minHeight: "550px",
                      width: "81.5%",
                    }}
                  >
                    {/* start to check close svg  */}
                    <div
                      onClick={() => {
                        handleClose();
                        handleCloseSubscriptionModal();
                      }}
                      className={`close-button close-button-${themeName}`}
                      style={{
                        cursor: "pointer",
                        position: "absolute",
                        top: "15px",
                        left: "15px",
                        maxHeight: "36px",
                        minWidth: "36px",
                        borderRadius: "50%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <div>
                        {/* close signin modal icon start to check  */}
                        <svg
                          style={{
                            border: "none",
                            margin: "5px",
                            position: "relative",
                            top: "2.5px",
                            left: "0.5px",
                          }}
                          onClick={handleCloseSubscriptionModal}
                          width={20}
                          height={20}
                          color={
                            themeName === "dark-theme"
                              ? "white"
                              : "rgb(15,20,25)"
                          }
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
                    {/* finish to check close svg  */}
                    <div
                      className="chirp-bold-font"
                      style={{
                        fontSize: font31.fontSize,
                        lineHeight: font31.lineHeight,
                        letterSpacing: "0.5px",
                        color: themeName === "dark-theme" ? "white" : "",
                      }}
                    >
                      Verifying code...
                    </div>
                    <div
                      className="mt-3 chirp-regular-font"
                      style={{
                        color:
                          themeName === "dark-theme"
                            ? "#71767A"
                            : "rgb(83, 100, 113)",
                        fontSize: font15.fontSize,
                        lineHeight: font15.lineHeight,
                      }}
                    >
                      Please do not close this screen.
                    </div>
                  </div>
                </Modal.Body>
              ) : tabIndex === 2 &&
                showVerifyPhoneNumberPasswordModal &&
                correctPassword &&
                showgeneratedQrCodeModal &&
                showVerifyingCodeModal &&
                showSubscriptionProcessNotCompletedModal ? (
                <>
                  <Modal.Body
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      minHeight: "600px",
                    }}
                  >
                    <h1
                      className="chirp-heavy-font"
                      style={{
                        fontSize: font31.fontSize,
                        lineHeight: font31.lineHeight,
                        color: themeName === "dark-theme" ? "white" : "",
                      }}
                    >
                      Subscription Error!
                    </h1>{" "}
                    <svg
                      width={`175`}
                      height={`175`}
                      viewBox="0 0 22 22"
                      aria-label="Error"
                      role="img"
                      className="r-4qtqp9 r-yyyyoo r-1xvli5t r-bnwqim r-1plcrui r-lrvibr r-1cvl2hr r-f9ja8p r-og9te1 r-9cviqr"
                      data-testid="icon-error"
                    >
                      <defs>
                        <linearGradient
                          id="gradient"
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="100%"
                        >
                          <stop offset="0%" stopColor="#FF1000" />
                          <stop offset="20%" stopColor="#FF5500" />
                          <stop offset="40%" stopColor="#FF6447" />
                          <stop offset="60%" stopColor="#FF8F50" />
                          <stop offset="80%" stopColor="#FFA08A" />
                          <stop offset="100%" stopColor="#FFC1CB" />
                        </linearGradient>
                      </defs>
                      <circle cx="11" cy="11" r="10" fill="url(#gradient)" />
                      <text
                        x="50%"
                        y="50%"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fontSize="12"
                        fill="#FFF"
                      >
                        X
                      </text>
                    </svg>
                    <Button
                      onClick={handleCloseSubscriptionModal}
                      style={{
                        width: "65%",
                        height: "52px",
                      }}
                      className={`login-button mt-5 ${themeName}-white-btn`}
                      variant="dark"
                    >
                      Continue to Connectify
                    </Button>{" "}
                  </Modal.Body>
                </>
              ) : null}
            </Modal>
          ) : null}
        </>
      )}

      <UnfollowModal
        selectedUser={selectedUser}
        handleUnfollow={handleUnfollow}
        showUnfollowModal={showUnfollowModal}
        handleClose={handleClose}
      />

      {!premium_sign_up_page_active && (
        <Col
          className="side-bar-column d-none d-lg-block d-xxl-block"
          xs={1} // 0px - 576px aralığı
          sm={1} // 576px - 768px aralığı
          md={1} // 768px - 992px aralığı
          lg={3} // 992px - 1400px aralığı
          xxl={3} // 1400px ve sonrası aralığı
          style={{
            padding: "0px",
            margin: "0px",
            paddingLeft: "2rem",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {" "}
          <div
            className="first-div-input"
            style={{
              height: "54px",
              maxWidth: "350px",
              minWidth: "fit-content",
              width: "350px",
              position: "sticky",
              top: "0px",
              zIndex: 2,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: themeName === "dark-theme" ? "black" : "white",
            }}
          >
            {" "}
            <div
              style={{
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "7px",
                  left: "1.5rem",
                }}
              >
                <svg
                  fill={
                    themeName === "dark-theme" && !onFocus
                      ? "#71767A"
                      : themeName !== "dark-theme" && !onFocus
                      ? "rgba(83, 100, 113, 1.00)"
                      : themeName === "dark-theme" && onFocus
                      ? "#1C9BEF"
                      : themeName !== "dark-theme" && onFocus
                      ? "#1C9BEF"
                      : null
                  }
                  width={`${1.25}em`}
                  height={`${1.25}em`}
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-14j79pv r-4wgw6l r-2dysd3"
                >
                  <g>
                    <path d="M10.25 3.75c-3.59 0-6.5 2.91-6.5 6.5s2.91 6.5 6.5 6.5c1.795 0 3.419-.726 4.596-1.904 1.178-1.177 1.904-2.801 1.904-4.596 0-3.59-2.91-6.5-6.5-6.5zm-8.5 6.5c0-4.694 3.806-8.5 8.5-8.5s8.5 3.806 8.5 8.5c0 1.986-.682 3.815-1.824 5.262l4.781 4.781-1.414 1.414-4.781-4.781c-1.447 1.142-3.276 1.824-5.262 1.824-4.694 0-8.5-3.806-8.5-8.5z"></path>
                  </g>
                </svg>
              </div>{" "}
              {searchTerm?.length ? (
                <div
                  onClick={() => {
                    setSearchTermEmpty();
                  }}
                  style={{
                    cursor: "pointer",
                    position: "absolute",
                    top: "10px",
                    right: "1.5rem",
                  }}
                >
                  <div
                    style={{
                      backgroundColor: "#1C9BEF",
                      width: "22px",
                      height: "22px",
                      borderRadius: "50%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <svg
                      color={themeName === "dark-theme" ? "black" : "white"}
                      fill="currentColor"
                      width="10px"
                      height="10px"
                      viewBox="0 0 15 15"
                      aria-hidden="true"
                      className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-jwli3a r-1or9b2r r-5soawk"
                    >
                      <g>
                        <path d="M6.09 7.5L.04 1.46 1.46.04 7.5 6.09 13.54.04l1.42 1.42L8.91 7.5l6.05 6.04-1.42 1.42L7.5 8.91l-6.04 6.05-1.42-1.42L6.09 7.5z"></path>
                      </g>
                    </svg>
                  </div>
                </div>
              ) : null}
              <input
                className="chirp-regular-font"
                onFocus={() => {
                  onFocusActive();
                }}
                onBlur={() => {
                  if (!searchBoxClicked) {
                    setTimeout(() => {
                      setOnFocus(false);
                    }, 1000);
                  }
                }}
                onChange={handleSetSearchTerm}
                value={searchTerm}
                style={{
                  height: "44px",
                  backgroundColor:
                    themeName === "dark-theme"
                      ? "#16181c"
                      : onFocus && themeName !== "dark-theme"
                      ? "white"
                      : "#eff3f4",
                  border: onFocus ? "1px solid #1e9bf0" : "none",
                  outlineStyle: "none",
                  borderRadius: "9999px",
                  borderWidth: "1px",
                  fontSize: font15.fontSize,
                  lineHeight: font15.lineHeight,
                  wordWrap: "break-word",
                  color: themeName === "dark-theme" ? "white" : "black",
                  paddingLeft: "60px",
                  paddingRight: "40px",
                  maxWidth: "350px",
                  minWidth: "350px",
                }}
                type="text"
                placeholder="Search"
              />
            </div>
            <div
              ref={searchBoxRef}
              onClick={handleClick}
              className={`scrollbar-add scrollbar-add-${themeName}`}
              style={{
                overflowY: "auto",
                overflowX: "hidden",
                maxHeight: "400px",
                minHeight: "100px",
                backgroundColor: themeName === "dark-theme" ? "black" : "white",
                zIndex: 9999,
                width: "350px",
                borderRadius: "8px",
                border: "none",
                position: "absolute",
                padding: "12px",
                top: "50px",
                display: onFocus ? "flex" : "none",
                filter:
                  themeName === "dark-theme"
                    ? "drop-shadow(rgb(51, 54, 57) 1px -1px 1px)"
                    : "",

                boxShadow:
                  themeName === "dark-theme"
                    ? "rgba(255, 255, 255, 0.2) 0px 0px 15px, rgba(255, 255, 255, 0.15) 0px 0px 3px 1px"
                    : "0 0 15px rgba(101, 119,134,0.2), 0 0 5px 3px rgba(101,119,134,0.15)",

                flexDirection: "column",

                alignItems: "center",
              }}
            >
              <div
                className={
                  searchBarAnimation
                    ? "post_sharing_line_animation"
                    : stopAnimation
                    ? "paused"
                    : null
                }
                style={{
                  position: "absolute",
                  border: "2px solid #1C9BEF",
                  height: "0.2rem",
                  top: "0px",
                  left: "0px",
                  borderTopLeftRadius: "4px",
                  display: searchBarAnimation || stopAnimation ? "" : "none",
                }}
              ></div>
              <div
                className="chirp-regular-font"
                style={{
                  color:
                    themeName === "dark-theme"
                      ? "#71767A"
                      : "rgb(83, 100, 113)",

                  fontSize: font15.fontSize,
                  lineHeight: font15.lineHeight,
                  display: !searchTerm ? "" : "none",
                }}
              >
                Try searching for people
              </div>
              <List
                style={{
                  display: searchTerm ? "" : "none",
                }}
                className={`right-side-bar-column-search-bar-list right-side-bar-column-search-bar-list-${themeName}`}
                size="small"
                bordered
                header={
                  <div
                    style={{
                      color: themeName === "dark-theme" ? "white" : "black",
                    }}
                  >{`Search for "${searchTerm}"`}</div>
                }
              >
                {themeName === "dark-theme" ? (
                  <div
                    style={{
                      borderBottom: "0.1px solid rgb(70, 70, 70)",
                    }}
                  ></div>
                ) : null}

                {filteredSearchResult.map((eachUser, index) => (
                  <div key={eachUser._id}>
                    <List.Item
                      onMouseEnter={() => {
                        setIsHoveredListItem(index);
                      }}
                      onMouseLeave={() => {
                        setIsHoveredListItem("");
                      }}
                      style={{
                        backgroundColor:
                          isHoveredListItem === index &&
                          themeName !== "dark-theme"
                            ? "#f7f9f9"
                            : isHoveredListItem === index &&
                              themeName === "dark-theme"
                            ? "#181818"
                            : "",
                        border: "none",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        setTimeout(() => {
                          setSearchTerm("");
                          setSearchBarAnimation(true);
                        }, 0);
                        setTimeout(() => {
                          setStopAnimation(true);
                        }, 600);
                        setTimeout(() => {
                          setSearchBarAnimation(false);
                          setStopAnimation(false);
                          setOnFocus(false);
                          navigate(`/profile/${eachUser._doc._id}`);
                        }, 700);
                      }}
                    >
                      <Stack
                        style={{
                          width: "100%",
                        }}
                        direction="horizontal"
                      >
                        {eachUser._doc?.imageUrl?.slice(0, 3) !== "../" ? (
                          <Link>
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
                            <Link>
                              <img
                                style={{
                                  borderRadius: "50%",
                                }}
                                width="40"
                                height="40"
                                src="https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png"
                                alt=""
                              />
                            </Link>
                          </div>
                        )}

                        <div className="user-info p-2">
                          <div
                            style={{
                              fontSize: font15.fontSize,
                              lineHeight: font15.lineHeight,
                            }}
                            className="fullname chirp-bold-font"
                          >
                            <Link
                              className="hover-fullname"
                              style={{
                                textDecoration: "none",
                                color: "black",
                                display:
                                  eachUser._doc?.isPrivate ||
                                  eachUser._doc?.hasSubscription
                                    ? "flex"
                                    : "",
                                gap: eachUser._doc?.isPrivate && "5px",
                                alignItems:
                                  eachUser._doc?.isPrivate && "center",
                              }}
                            >
                              <div
                                className="chirp-bold-font"
                                style={{
                                  fontSize: font15.fontSize,
                                  lineHeight: font15.lineHeight,
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                  width: eachUser._doc?.isPrivate
                                    ? ""
                                    : "200px",
                                  color:
                                    themeName === "dark-theme"
                                      ? "white"
                                      : "black",
                                }}
                              >
                                <div className="flex items-center">
                                  <div>{eachUser._doc?.fullname}</div>
                                  {eachUser._doc?.isPrivate && (
                                    <div className="ml-[5px] flex">
                                      <svg
                                        fill={
                                          themeName === "dark-theme"
                                            ? "#E6E9EA"
                                            : "#0F141A"
                                        }
                                        width={`${1.25}em`}
                                        height={`${1.25}em`}
                                        viewBox="0 0 24 24"
                                        aria-label="Protected account"
                                        role="img"
                                        className="r-4qtqp9 r-yyyyoo r-1xvli5t r-bnwqim r-lrvibr r-m6rgpd r-3t4u6i r-18jsvk2 r-f9ja8p r-og9te1"
                                        data-testid="icon-lock"
                                      >
                                        <g>
                                          <path d="M17.5 7H17v-.25c0-2.76-2.24-5-5-5s-5 2.24-5 5V7h-.5C5.12 7 4 8.12 4 9.5v9C4 19.88 5.12 21 6.5 21h11c1.39 0 2.5-1.12 2.5-2.5v-9C20 8.12 18.89 7 17.5 7zM13 14.73V17h-2v-2.27c-.59-.34-1-.99-1-1.73 0-1.1.9-2 2-2 1.11 0 2 .9 2 2 0 .74-.4 1.39-1 1.73zM15 7H9v-.25c0-1.66 1.35-3 3-3 1.66 0 3 1.34 3 3V7z"></path>
                                        </g>
                                      </svg>
                                    </div>
                                  )}
                                </div>
                                {eachUser._doc?.hasSubscription ||
                                (!subscription?.isActive &&
                                  subscription?.remainingTimeSubscription &&
                                  subscription?.cancelledDate &&
                                  subscription?.owner === eachUser._doc?._id) ||
                                remainingTimeSubscriptionsOwnerIds.includes(
                                  eachUser._doc?._id
                                ) ? (
                                  <span
                                    style={{
                                      marginLeft: "5px",
                                    }}
                                  >
                                    {/* start to check  */}{" "}
                                    <span className="css-1qaijid r-bcqeeo r-qvutc0 r-poiln3 r-1awozwy r-xoduu5">
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
                                    </span>{" "}
                                  </span>
                                ) : null}
                              </div>
                            </Link>
                          </div>

                          <div
                            style={{
                              fontSize: font15.fontSize,
                              lineHeight: font15.lineHeight,
                              color: "rgb(83, 100, 113)",
                              position: "relative",
                            }}
                            className="username chirp-regular-font"
                          >
                            <Link
                              style={{
                                textDecoration: "none",
                              }}
                            >
                              <span
                                className="chirp-regular-font"
                                style={{
                                  fontSize: font15.fontSize,
                                  lineHeight: font15.lineHeight,
                                  color:
                                    themeName === "dark-theme"
                                      ? "#71767A"
                                      : "rgb(83, 100, 113)",
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
                  </div>
                ))}
              </List>
            </div>
          </div>
          {path === "/home" && (
            <div
              style={{
                maxWidth: "350px",
                minWidth: "350px",
                border: "none",
                borderWidth: "1px",
                borderRadius: "16px",
                zIndex: 1,
                backgroundColor:
                  themeName === "dark-theme" ? "#16181c" : "#eff3f4",
              }}
              className="second-div-input p-3 mt-3"
            >
              {" "}
              <div>
                <div
                  className="chirp-heavy-font"
                  style={{
                    fontSize: font20.fontSize,
                    lineHeight: font20.lineHeight,
                  }}
                >
                  <span>Subscribe to Premium</span>
                </div>
                <div
                  className="chirp-regular-font"
                  style={{
                    fontSize: font15.fontSize,
                    lineHeight: font15.lineHeight,
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
                  className={`login-button login-button-${themeName} chirp-bold-font`}
                  variant="dark"
                >
                  Subscribe
                </Button>
              </div>
            </div>
          )}
          <div
            className="mt-3 last-two-div-for-sticky-position"
            style={{
              position: "sticky",
              top: "55px",
              maxWidth: "350px",
              minWidth: "350px",
              border: "none",
              borderWidth: "1px",
              borderRadius: "16px",
            }}
          >
            {" "}
            <div
              className="third-div-input p-3 mt-3"
              style={{
                border: "none",
                borderWidth: "1px",
                borderRadius: "16px",
                backgroundColor:
                  themeName === "dark-theme" ? "#16181c" : "#eff3f4",
                maxWidth: "350px",
                minWidth: "350px",
                zIndex: 1,
              }}
            >
              <div
                className="chirp-heavy-font"
                style={{
                  fontSize: font20.fontSize,
                  lineHeight: font20.lineHeight,
                }}
              >
                Who to follow
              </div>
              {first3User
                ? first3User.map((eachUser, index) => {
                    const buttonId = `followButton_${index}`;
                    // const isFollowing = allFollowingsFromActiveUser()?.includes(
                    //   eachUser._id
                    // );
                    const isFollowing = eachUser.followers.includes(
                      userInfo._id
                    );

                    return (
                      <div key={eachUser._id}>
                        {eachUser._id !== userInfo._id && (
                          <div
                            style={{
                              width: "100%",
                            }}
                          >
                            <div>
                              <Stack
                                className="each-who-to-follow-user"
                                direction="horizontal"
                              >
                                <BootstrapTooltip
                                  title={eachUser.fullname}
                                  themeName={
                                    themeName === "dark-theme"
                                      ? "dark-theme"
                                      : "light-theme"
                                  }
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
                                      <div>
                                        <Link
                                          to={`/profile/${eachUser._id}`}
                                          style={{
                                            textDecoration: "none",
                                          }}
                                        >
                                          <img
                                            style={{
                                              borderRadius: "50%",
                                            }}
                                            width="40"
                                            height="40"
                                            src="https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png"
                                            alt=""
                                          />
                                        </Link>
                                      </div>
                                    )}
                                  </div>
                                </BootstrapTooltip>

                                <div className="p-3">
                                  <Link
                                    to={`/profile/${eachUser._id}`}
                                    style={{
                                      textDecoration: "none",
                                      color: "black",
                                    }}
                                  >
                                    <div
                                      className="hover-fullname chirp-bold-font"
                                      style={{
                                        fontSize: font15.fontSize,
                                        lineHeight: font15.lineHeight,
                                        color:
                                          themeName === "dark-theme"
                                            ? "white"
                                            : "black",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                        width: "120px",
                                      }}
                                    >
                                      <div
                                        style={{
                                          display: "flex",
                                          alignItems: "center",
                                        }}
                                      >
                                        <span
                                          style={{
                                            minWidth: 0,
                                            flexShrink: 1,
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            whiteSpace: "nowrap",
                                          }}
                                        >
                                          {eachUser.fullname}
                                        </span>
                                        {eachUser.isPrivate && (
                                          <span
                                            className="flex"
                                            style={{
                                              marginLeft: "5px",
                                            }}
                                          >
                                            <svg
                                              fill={
                                                themeName === "dark-theme"
                                                  ? "#E6E9EA"
                                                  : "#0F141A"
                                              }
                                              width={`${1.25}em`}
                                              height={`${1.25}em`}
                                              viewBox="0 0 24 24"
                                              aria-label="Protected account"
                                              role="img"
                                              className="r-4qtqp9 r-yyyyoo r-1xvli5t r-bnwqim r-lrvibr r-m6rgpd r-3t4u6i r-18jsvk2 r-f9ja8p r-og9te1"
                                              data-testid="icon-lock"
                                            >
                                              <g>
                                                <path d="M17.5 7H17v-.25c0-2.76-2.24-5-5-5s-5 2.24-5 5V7h-.5C5.12 7 4 8.12 4 9.5v9C4 19.88 5.12 21 6.5 21h11c1.39 0 2.5-1.12 2.5-2.5v-9C20 8.12 18.89 7 17.5 7zM13 14.73V17h-2v-2.27c-.59-.34-1-.99-1-1.73 0-1.1.9-2 2-2 1.11 0 2 .9 2 2 0 .74-.4 1.39-1 1.73zM15 7H9v-.25c0-1.66 1.35-3 3-3 1.66 0 3 1.34 3 3V7z"></path>
                                              </g>
                                            </svg>
                                          </span>
                                        )}
                                        {eachUser.hasSubscription ||
                                          (!subscription?.isActive &&
                                            subscription?.remainingTimeSubscription &&
                                            subscription?.cancelledDate &&
                                            subscription?.owner ===
                                              eachUser._id) ||
                                          (remainingTimeSubscriptionsOwnerIds.includes(
                                            eachUser._id
                                          ) && (
                                            <span
                                              style={{
                                                marginLeft: "5px",
                                              }}
                                            >
                                              {/* start to check  */}{" "}
                                              <span className="css-1qaijid r-bcqeeo r-qvutc0 r-poiln3 r-1awozwy r-xoduu5">
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
                                              </span>{" "}
                                            </span>
                                          ))}
                                      </div>
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
                                      className="chirp-regular-font"
                                      style={{
                                        fontSize: font15.fontSize,
                                        lineHeight: font15.lineHeight,
                                        color:
                                          themeName === "dark-theme"
                                            ? "#71767A"
                                            : "rgb(83, 100, 113)",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                        width: "120px",
                                      }}
                                    >
                                      @{eachUser.username}
                                    </div>
                                  </Link>
                                </div>

                                <div
                                  onMouseEnter={() => {
                                    setIsHovered(buttonId);
                                  }}
                                  onMouseLeave={() => setIsHovered(null)}
                                  className="ms-auto"
                                >
                                  <Button
                                    onClick={() =>
                                      getFollowingIds(user)?.includes(
                                        eachUser._id
                                      )
                                        ? openUnfollowModal(eachUser)
                                        : handleFollow(eachUser)
                                    }
                                    style={{
                                      fontSize: font14.fontSize,
                                      lineHeight: font14.lineHeight,
                                      transitionDuration: "0.2s",
                                      width: "78px",
                                      height: "32px",

                                      border:
                                        isHovered === buttonId &&
                                        isFollowing &&
                                        themeName !== "dark-theme"
                                          ? "1px solid rgba(253,201,206,255)"
                                          : isHovered === buttonId &&
                                            isFollowing &&
                                            themeName === "dark-theme"
                                          ? "1px solid #e71f2c"
                                          : isFollowing &&
                                            themeName !== "dark-theme"
                                          ? "1px solid rgba(0, 0, 0, 0.1)"
                                          : "1px solid rgb(70, 70, 70)",
                                      borderRadius: "9999px",

                                      backgroundColor:
                                        !isFollowing &&
                                        themeName === "dark-theme" &&
                                        isHovered !== buttonId
                                          ? "white"
                                          : !isFollowing &&
                                            themeName === "dark-theme" &&
                                            isHovered === buttonId
                                          ? "#d7dbdc"
                                          : isHovered === buttonId &&
                                            isFollowing &&
                                            themeName !== "dark-theme"
                                          ? "rgba(255,234,235,255)"
                                          : isHovered === buttonId &&
                                            isFollowing &&
                                            themeName === "dark-theme"
                                          ? "#230608"
                                          : isFollowing &&
                                            themeName === "dark-theme"
                                          ? "black"
                                          : isFollowing &&
                                            themeName !== "dark-theme"
                                          ? "white"
                                          : !isFollowing &&
                                            themeName !== "dark-theme" &&
                                            isHovered === buttonId
                                          ? "#272c30"
                                          : "black",
                                      color:
                                        !isFollowing &&
                                        themeName === "dark-theme"
                                          ? "black"
                                          : isHovered === buttonId &&
                                            isFollowing
                                          ? "rgba(244,34,45,255)"
                                          : isFollowing &&
                                            themeName !== "dark-theme"
                                          ? "black"
                                          : "white",
                                      display: "flex",
                                      justifyContent: "center",
                                      alignItems: "center",
                                    }}
                                    className="right-side-bar-button chirp-bold-font"
                                    variant="dark"
                                  >
                                    <span style={{}}>
                                      {isFollowing
                                        ? isHovered === buttonId
                                          ? "Unfollow"
                                          : "Following"
                                        : "Follow"}
                                    </span>
                                  </Button>
                                </div>
                              </Stack>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                : null}

              <div
                className="hover-blue-underline chirp-regular-font"
                style={{
                  cursor: "pointer",
                  color: "rgb(29, 155, 240)",
                  fontSize: font15.fontSize,
                  lineHeight: font15.lineHeight,
                }}
              >
                Show more
              </div>
            </div>{" "}
            {activities?.length > 0 && (
              <div
                style={{
                  border: "none",
                  borderWidth: "1px",
                  borderRadius: "16px",
                  backgroundColor:
                    themeName === "dark-theme" ? "#16181c" : "#eff3f4",
                }}
                className="p-3 mt-3"
              >
                <div
                  className="chirp-heavy-font"
                  style={{
                    fontSize: font20.fontSize,
                    lineHeight: font20.lineHeight,
                  }}
                >
                  Recent activities{" "}
                </div>
                {activities?.map((eachActivity) => {
                  return (
                    <div key={eachActivity._id}>
                      {eachActivity.activityHasBeenInitiatedWith._id !==
                        eachActivity.thePersonWhoCarriedOutTheActivity._id &&
                        eachActivity.activityHasBeenInitiatedWith._id !==
                          userInfo._id && (
                          <div
                            style={{
                              display: "flex",
                              padding: "10px 0px",
                              alignItems: "center",
                            }}
                          >
                            <BootstrapTooltip
                              title={
                                eachActivity.thePersonWhoCarriedOutTheActivity
                                  .fullname
                              }
                              themeName={
                                themeName === "dark-theme"
                                  ? "dark-theme"
                                  : "light-theme"
                              }
                            >
                              <div>
                                {eachActivity.thePersonWhoCarriedOutTheActivity?.imageUrl?.slice(
                                  0,
                                  3
                                ) !== "../" ? (
                                  <Link
                                    to={`/profile/${eachActivity.thePersonWhoCarriedOutTheActivity._id}`}
                                  >
                                    <img
                                      src={
                                        eachActivity
                                          .thePersonWhoCarriedOutTheActivity
                                          .imageUrl
                                      }
                                      alt={`${eachActivity.thePersonWhoCarriedOutTheActivity.fullname}'s profile`}
                                      width={32}
                                      height={32}
                                      className="profile-image"
                                      style={{
                                        borderRadius: "50%",
                                      }}
                                    />
                                  </Link>
                                ) : (
                                  <Link
                                    to={`/profile/${eachActivity.thePersonWhoCarriedOutTheActivity._id}`}
                                  >
                                    <img
                                      style={{
                                        borderRadius: "50%",
                                      }}
                                      width={32}
                                      height={32}
                                      src="https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png"
                                      alt=""
                                    />
                                  </Link>
                                )}
                              </div>
                            </BootstrapTooltip>
                            <div
                              className="chirp-regular-font"
                              style={{
                                fontSize: font15.fontSize,
                                lineHeight: font15.lineHeight,
                                overflow: "hidden",
                                marginLeft: "5px",
                              }}
                            >
                              {eachActivity.activityType === "comment" &&
                                "commented"}
                              {eachActivity.activityType === "repost" &&
                                "reposted"}
                              {eachActivity.activityType === "favorite" &&
                                "liked"}
                            </div>
                            <Link
                              to={`/profile/${eachActivity.activityHasBeenInitiatedWith._id}`}
                              style={{
                                textDecoration: "none",
                                color: "black",
                                marginLeft: "5px",
                              }}
                            >
                              <div
                                className={
                                  themeName === "dark-theme"
                                    ? "soft-grey-dark-theme-text-variant-1 chirp-bold-font hover-fullname"
                                    : "very-dark-gray-light-theme-text-variant-1 chirp-bold-font hover-fullname"
                                }
                                style={{
                                  cursor: "pointer",
                                  fontSize: font15.fontSize,
                                  lineHeight: font15.lineHeight,
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                  color:
                                    themeName === "dark-theme"
                                      ? "#71767A"
                                      : "rgb(83, 100, 113)",
                                }}
                              >
                                {`${eachActivity.activityHasBeenInitiatedWith.fullname}'s`}
                              </div>
                            </Link>

                            <div>
                              <PopupState
                                variant="popover"
                                popupId="demo-popup-popover"
                              >
                                {(popupState) => (
                                  <div>
                                    <Button
                                      {...bindTrigger(popupState)}
                                      style={{
                                        border: "none",
                                        padding: "0px",
                                        margin: "0px",
                                        cursor: "pointer",
                                        position: "relative",
                                      }}
                                      variant="text"
                                    >
                                      <div
                                        className="hover-blue-underline chirp-regular-font"
                                        style={{
                                          cursor: "pointer",
                                          color: "rgb(29, 155, 240)",
                                          fontSize: font15.fontSize,
                                          lineHeight: font15.lineHeight,
                                          position: "relative",
                                          bottom: "2.5px",
                                          marginLeft: "5px",
                                        }}
                                      >
                                        post
                                      </div>
                                    </Button>
                                    <Popover
                                      open={popupState.open}
                                      onClose={popupState.close}
                                      {...bindPopover(popupState)}
                                      anchorOrigin={{
                                        vertical: "top",
                                        horizontal: "center",
                                      }}
                                      transformOrigin={{
                                        vertical: "bottom",
                                        horizontal: "center",
                                      }}
                                      className={`${
                                        themeName === "dark-theme"
                                          ? "popover-material-ui-dark-theme special-cute-popover"
                                          : themeName !== "dark-theme"
                                          ? "popover-material-ui-light-theme special-cute-popover"
                                          : "hideshowMessageDeletePopover special-cute-popover"
                                      }`}
                                    >
                                      <div
                                        style={{
                                          display: "flex",
                                          flexDirection: "column",
                                        }}
                                      >
                                        <div
                                          style={{
                                            display: "flex",
                                            alignItems: "center",
                                          }}
                                        >
                                          <div
                                            onClick={() => popupState.close()}
                                            style={{
                                              float: "left",
                                              position: "relative",
                                              top: "13px",
                                            }}
                                          >
                                            {eachActivity.relatedPost?.userId?.imageUrl?.slice(
                                              0,
                                              3
                                            ) !== "../" ? (
                                              <Link
                                                to={`/profile/${eachActivity.relatedPost?.userId?._id}`}
                                              >
                                                <img
                                                  src={
                                                    eachActivity.relatedPost
                                                      ?.userId?.imageUrl
                                                  }
                                                  alt={`${eachActivity.relatedPost?.userId?.fullname}'s profile`}
                                                  width={32}
                                                  height={32}
                                                  className="profile-image"
                                                  style={{
                                                    borderRadius: "50%",
                                                  }}
                                                />
                                              </Link>
                                            ) : (
                                              <div>
                                                <Link
                                                  to={`/profile/${eachActivity.relatedPost?.userId?._id}`}
                                                >
                                                  <img
                                                    style={{
                                                      borderRadius: "50%",
                                                    }}
                                                    width={32}
                                                    height={32}
                                                    src="https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png"
                                                    alt=""
                                                  />
                                                </Link>
                                              </div>
                                            )}
                                          </div>
                                          <div
                                            onClick={() => popupState.close()}
                                          >
                                            <Link
                                              className="post-circle-postowner-fullname hover-fullname chirp-bold-font"
                                              to={`/profile/${eachActivity.relatedPost?.userId?._id}`}
                                              style={{
                                                textDecoration: "none",
                                                color:
                                                  themeName === "dark-theme"
                                                    ? "white"
                                                    : "black",
                                                fontSize: font13.fontSize,
                                                lineHeight: "20px",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                whiteSpace: "nowrap",
                                                width: "120px",
                                                marginLeft: "8px",
                                                position: "relative",
                                                top: "3px",
                                              }}
                                            >
                                              <span>
                                                {
                                                  eachActivity.relatedPost
                                                    ?.userId?.fullname
                                                }
                                              </span>
                                            </Link>
                                          </div>
                                          <div
                                            style={{
                                              margin: "0px 5px",

                                              position: "relative",
                                              top: "2px",
                                            }}
                                          >
                                            {eachActivity.relatedPost?.userId
                                              .hasSubscription ||
                                            (!subscription?.isActive &&
                                              subscription?.remainingTimeSubscription &&
                                              subscription?.cancelledDate &&
                                              subscription?.owner ===
                                                eachActivity.relatedPost?.userId
                                                  ._id) ||
                                            remainingTimeSubscriptionsOwnerIds.includes(
                                              eachActivity.relatedPost?.userId
                                                ._id
                                            ) ? (
                                              <span>
                                                {/* start to check  */}{" "}
                                                <span className="css-1qaijid r-bcqeeo r-qvutc0 r-poiln3 r-1awozwy r-xoduu5">
                                                  <svg
                                                    width={`${1}em`}
                                                    height={`${1}em`}
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
                                              </span>
                                            ) : (
                                              <span> </span>
                                            )}
                                          </div>
                                          <div
                                            onClick={() => popupState.close()}
                                          >
                                            {" "}
                                            <Link
                                              className="chirp-regular-font"
                                              to={`/profile/${eachActivity.relatedPost?.userId?._id}`}
                                              style={{
                                                textDecoration: "none",
                                                color:
                                                  themeName === "dark-theme"
                                                    ? "#71767A"
                                                    : "rgb(83, 100, 113)",
                                                lineHeight: "20px",
                                                fontSize: font13.fontSize,
                                                position: "relative",
                                                top: "3px",
                                              }}
                                            >
                                              {
                                                eachActivity.relatedPost?.userId
                                                  ?.username
                                              }
                                            </Link>
                                          </div>
                                          <div>
                                            {" "}
                                            <Link
                                              to={`/${eachActivity.relatedPost?.userId?.username}/status/${eachActivity.relatedPost._id}`}
                                              style={{
                                                textDecoration: "none",
                                                position: "relative",
                                                top: "3px",
                                              }}
                                            >
                                              <span
                                                onClick={() =>
                                                  popupState.close()
                                                }
                                                className="post-circle-date-post-detail chirp-regular-font"
                                                style={{
                                                  color:
                                                    themeName === "dark-theme"
                                                      ? "#71767A"
                                                      : "rgb(83, 100, 113)",
                                                  lineHeight: "20px",
                                                  fontSize: font13.fontSize,
                                                  marginLeft: "5px",
                                                }}
                                              >
                                                {" "}
                                                ·{" "}
                                                <BootstrapTooltip
                                                  title={extraDetailedDate(
                                                    eachActivity.relatedPost
                                                      .createdAt
                                                  )}
                                                  themeName={
                                                    themeName === "dark-theme"
                                                      ? "dark-theme"
                                                      : "light-theme"
                                                  }
                                                >
                                                  <span
                                                    style={{}}
                                                    className="date-post-detail"
                                                  >
                                                    {getCreatedDate(
                                                      eachActivity.relatedPost
                                                        .createdAt
                                                    )}
                                                  </span>
                                                </BootstrapTooltip>
                                              </span>
                                            </Link>
                                          </div>
                                          <div
                                            style={{
                                              marginLeft: "10px",
                                              position: "relative",
                                              top: "4px",
                                            }}
                                          >
                                            {" "}
                                            <PostPopover
                                              isCutePopoverOnRightSide={true}
                                              post={eachActivity.relatedPost}
                                              // refreshPosts={} // no need to refresh something in here
                                            />
                                          </div>
                                        </div>
                                        <div
                                          onClick={() => popupState.close()}
                                          style={{
                                            width: "75%",
                                            display: "flex",
                                            alignSelf: "center",
                                            position: "relative",
                                            bottom: "5px",
                                            left: "0px",
                                          }}
                                        >
                                          <div>
                                            <div
                                              className="chirp-regular-font"
                                              onClick={() => {
                                                navigatePostContentCutePopoverRightSide(
                                                  eachActivity
                                                );
                                              }}
                                              style={{
                                                fontSize: font13.fontSize,
                                                lineHeight: "20px",
                                                overflowWrap: "break-word",
                                                maxWidth: "100%",
                                                cursor: "pointer",
                                                color:
                                                  themeName === "dark-theme"
                                                    ? "white"
                                                    : "",
                                                textDecoration: "none",
                                                padding: "0px",
                                                margin: "0px",
                                              }}
                                            >
                                              {" "}
                                              {
                                                eachActivity.relatedPost
                                                  ?.content
                                              }
                                            </div>
                                          </div>
                                        </div>
                                        <div
                                          style={{
                                            width: "80%",
                                            display: "flex",
                                            alignSelf: "center",
                                          }}
                                        >
                                          <div
                                            style={{
                                              width: "100px",
                                            }}
                                          >
                                            <CommentModal
                                              post={
                                                eachActivity?.relatedPost
                                                  ? eachActivity.relatedPost
                                                  : null
                                              }
                                              width={`${1.25}em`}
                                              height={`${1.25}em`}
                                              isCutePopoverOnRightSide={true}
                                              refreshPosts={getActivities}
                                            />
                                          </div>
                                          <div
                                            style={{
                                              width: "100px",
                                            }}
                                          >
                                            {" "}
                                            <RepostAction
                                              post={
                                                eachActivity?.relatedPost
                                                  ? eachActivity.relatedPost
                                                  : null
                                              }
                                              width={`${1.25}em`}
                                              height={`${1.25}em`}
                                              isCutePopoverOnRightSide={true}
                                              refreshPosts={getActivities}
                                            />
                                          </div>
                                          <div
                                            style={{
                                              width: "100px",
                                            }}
                                          >
                                            {" "}
                                            <LikeAction
                                              post={
                                                eachActivity?.relatedPost
                                                  ? eachActivity.relatedPost
                                                  : null
                                              }
                                              width={`${1.25}em`}
                                              height={`${1.25}em`}
                                              isCutePopoverOnRightSide={true}
                                              refreshPosts={getActivities}
                                            />
                                          </div>{" "}
                                        </div>
                                      </div>
                                    </Popover>
                                  </div>
                                )}
                              </PopupState>
                            </div>
                          </div>
                        )}
                    </div>
                  );
                })}
                <div
                  className="hover-blue-underline chirp-regular-font"
                  style={{
                    cursor: "pointer",
                    color: "rgb(29, 155, 240)",
                    fontSize: font15.fontSize,
                    lineHeight: font15.lineHeight,
                  }}
                >
                  Show more
                </div>
              </div>
            )}
            {/* <div
              className="p-3 mt-1"
              style={{
                maxWidth: "350px",
                minWidth: "350px",
              }}
            >
              <ul
                className={`right-side-bar-column-list chirp-regular-font ${themeName}-right-side-bar-column-list`}
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  listStyle: "none",
                  margin: "0px",
                  padding: "0px",
                  fontSize: font13.fontSize,
                  lineHeight: font13.lineHeight,
                }}
              >
                <li>Terms of Service</li>
                <li>Privacy Policy</li>
                <li>Cookie Policy</li>
                <li>MStV Transparenzangaben</li>
                <li>Imprint</li>
                <li>Accessibility</li>
                <li>Ads info</li>
                <li>© 2025 Connectify Corp.</li>
              </ul>
            </div>{" "} */}
          </div>
        </Col>
      )}
    </>
  );
}

export default RightSideColumn;
