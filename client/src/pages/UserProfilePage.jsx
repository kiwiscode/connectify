import axios from "axios";
import { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../context/UserContext";
import {
  Col,
  Stack,
  Accordion,
  Modal,
  Button,
  OverlayTrigger,
  Popover,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { CommentModal } from "../components/ui/Modal";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import ResponsiveNavigationBarBottom from "../components/Navbar/ResponsiveNavigationBottom";
const API_URL = import.meta.env.VITE_APP_API_URL;

import { ThemeContext } from "../context/ThemeContext";
import PostPopover from "../components/three-dots-popover/Popover";
import useWindowDimensions from "../hooks/getWindowDimensions";
import RepostAction from "../components/ui/RepostAction";
import LikeAction from "../components/ui/LikeAction";
import { ModalVisibilityContext } from "../context/ModalVisibilityContext";
import { useAntdMessageHandler } from "../utils/useAntdMessageHandler";
import BootstrapTooltip from "../components/BootstrapToolTip/BootstrapToolTip";
import BookmarkAction from "../components/ui/BookmarkAction";
import { SubcsriptionStatusContext } from "../context/SubscriptionStatusContext";
import { useFontSizeHandler } from "../utils/useFontSizeHandler";
import { InputLabel, TextField } from "@mui/material";
import { lineHeight } from "@mui/system";

function UserProfile({ isNewPostShared }) {
  const [{ theme, themeName }] = useContext(ThemeContext);
  const {
    subscription,
    remainingTimeSubscriptions,
    remainingTimeSubscriptionsOwnerIds,
  } = useContext(SubcsriptionStatusContext);
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

  const navigate = useNavigate();

  // finish to check

  // use effect to grab current mouse click location start to check
  const [clickedPostBox, setclickedPostBox] = useState(null);
  useEffect(() => {
    const getClickLocation = (e) => {
      const clickedElementParentClass = e.target.parentNode.className;
      const clickedElementClass = e.target.classList;

      if (
        (clickedElementClass.contains("hover-reposted-text") &&
          clickedElementParentClass !== "post-circle-profile-svg-on-point" &&
          clickedElementParentClass !== "post-circle-profile-image-on-point" &&
          clickedElementParentClass !== "post-circle-postowner-fullname" &&
          clickedElementParentClass !== "post-circle-postowner-username" &&
          clickedElementParentClass !== "post-circle-date-post-detail" &&
          clickedElementParentClass !== "svg-three-dots-post-detail" &&
          clickedElementParentClass === "p-1 next-to-comment") ||
        clickedElementParentClass === "p-1 next-to-repost" ||
        clickedElementParentClass === "p-1 next-to-like" ||
        clickedElementParentClass === "parent-footer-stack" ||
        clickedElementParentClass ===
          "posts-details outside-of-inner-circle-actions" ||
        clickedElementParentClass ===
          "outside-of-inner-circle-action-comment-text vstack gap-1" ||
        clickedElementParentClass === "p-2 parent-comment-text" ||
        clickedElementParentClass ===
          "outside-of-inner-circle-post-info-user-info-svg-three-dots hstack gap-1" ||
        clickedElementParentClass === "mt-0 parent-footer-stack hstack" ||
        clickedElementClass.contains("repost-svg-post-box") ||
        clickedElementParentClass === "post-head" ||
        clickedElementClass.contains("each-post") ||
        clickedElementClass.contains("border-extra") ||
        clickedElementParentClass === "each-post"
      ) {
        if (clickedPostBox) {
          navigate(
            `/${clickedPostBox.userId.username}/status/${
              !clickedPostBox.isReposted
                ? clickedPostBox._id
                : clickedPostBox.repostedFromThisOriginalPost[0]?._id
            }`
          );
        }
      }
    };

    document.body.addEventListener("click", getClickLocation);

    return () => {
      document.body.removeEventListener("click", getClickLocation);
    };
  }, [clickedPostBox]);

  // use effect to grab current mouse click location finish to check

  const [userprofiledata, setUserprofiledata] = useState([]);
  const { getToken, userInfo, updateUser } = useContext(UserContext);
  const [favoriteWindow, setFavoriteWindow] = useState("hide");
  const [postsWindow, setPostWindow] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [error, setError] = useState("");
  const [postId, setpostId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [profileImage, setprofileImage] = useState("");
  const [completedProfileImage, setcompletedProfileImage] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);

  const showEditModal = () => {
    setOpenEditModal(true);
  };

  const saveEdit = async () => {
    try {
      await axios.patch(
        `${API_URL}/profile/${userInfo._id}/edit`,
        {
          fullName,
          bioOnEdit,
          locationOnEdit,
          websiteOnEdit,
          birthDateOnEdit,
          birthDateVisibilityRestriction: restrictions,
        },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      updateUser({
        fullname: fullName,
        bio: bioOnEdit,
        location: locationOnEdit,
        webSite: websiteOnEdit,
        birthDate: birthDateOnEdit,
        birthDateVisibility: restrictions,
      });
    } catch (error) {
      console.error("error:", error);
    }
  };

  const handleGetFavorites = () => {
    setActiveTab("likes");
    setFavoriteWindow("");
    setPostWindow("hide");
    axios
      .get(`${API_URL}/favorite`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
      .then((response) => {
        console.log("Response from database for favorites !!!", response);
        setFavorites(response.data.favorites);
      })
      .catch((err) => {
        return err;
      });
  };

  const checkIfAllFavoritesFromDeactivatedUser = () => {
    return favorites.map((eachFavorite) => {
      return eachFavorite.deactivatedOwner;
    });
  };

  const hasFalse = checkIfAllFavoritesFromDeactivatedUser().some(
    (item) => item === false
  );

  const handleGoBack = () => {
    console.log("Go one page back !");
    navigate(-1);
  };
  const [profile, setProfile] = useState([]);
  const [pinnedPost, setPinnedPost] = useState(null);

  const handleShowPostsProfilePage = () => {
    setActiveTab("posts");
    setFavoriteWindow("hide");
    setPostWindow("");
    axios
      .get(`${API_URL}/profile`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
      .then((response) => {
        const { posts } = response.data;
        const { user } = response.data;
        setProfile(user);
        setPinnedPost(user.pinnedPosts[0]);
        setUserprofiledata(posts);
        console.log("Response updated with populate for profile =>", response);
      })
      .catch((err) => {
        return err;
      });
  };

  const { postDeletedMessage, postSharedMessage, contextHolder } =
    useAntdMessageHandler();

  const handleDeletePostFromProfilePage = () => {
    if (favoriteWindow === "") {
      handleGetFavorites();
      postDeletedMessage();
    } else if (postsWindow === "") {
      handleShowPostsProfilePage();
      postDeletedMessage();
    }

    setError("");
  };

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

  const monthsProfile = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const getCreatedDate = (date) => {
    const createdAt = new Date(date);
    const getMonth = createdAt.getMonth();
    return `${months[getMonth]} ${createdAt.getDate()}`;
  };

  const getCreatedDateForProfile = (date) => {
    const createdAt = new Date(date);
    const getMonth = createdAt.getMonth();
    return `${monthsProfile[getMonth]} ${createdAt.getDate()}`;
  };

  const [profileImageChangingLoadingBar, setprofileImageChangingLoadingBar] =
    useState(false);

  const handleChangeProfileImage = (e) => {
    const file = e.target.files[0];
    handleChangeProfileImageSetFileToBase(file);
    setprofileImageChangingLoadingBar(true);
  };

  const handleChangeProfileImageSetFileToBase = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setprofileImageChangingLoadingBar(true);
      setprofileImage(reader.result);
    };
  };

  const changeProfileImage = () => {
    axios
      .post(
        `${API_URL}/profile/add-profile-image`,
        { profileImage },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      )
      .then((response) => {
        setcompletedProfileImage(true);
        updateUser({ imageUrl: response.data.imageInfo.url });
        setprofileImageChangingLoadingBar(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const setLoadingTrue = () => {
    setIsLoading(true);
  };

  const setLoadingFalse = () => {
    setIsLoading(false);
  };

  const getRepostedIds = (array) => {
    return array?.reposted.map((eachRepost) => {
      return eachRepost?._id;
    });
  };

  useEffect(() => {
    if (postsWindow === "hide") {
      if (profileImage) {
        changeProfileImage();
      }
      handleGetFavorites();
    } else if (favoriteWindow === "hide") {
      if (profileImage) {
        changeProfileImage();
      }
      handleShowPostsProfilePage();
    }
  }, [profileImage, postsWindow, favoriteWindow]);

  // const [activeUserFollowing, setactiveUserFollowing] = useState([]);
  // const [activeUserFollowers, setactiveUserFollowers] = useState([]);
  // useEffect(() => {
  //   axios
  //     .get(`${API_URL}/profile`, {
  //       headers: {
  //         Authorization: `Bearer ${getToken()}`,
  //       },
  //     })
  //     .then((response) => {
  //       setactiveUserFollowers(response.data.user.followers);
  //       setactiveUserFollowing(response.data.user.following);
  //     })
  //     .catch((error) => {
  //       console.log("Error =>", error);
  //     });
  // }, []);

  const [visibleTweets, setVisibleTweets] = useState(25);
  const [visibleLikedTweets, setvisibleLikedTweets] = useState(25);
  const handleShowMorePosts = () => {
    setVisibleTweets((prevVisibleTweets) => prevVisibleTweets + 25);
  };

  const handleShowMoreLikedTweets = () => {
    setvisibleLikedTweets((prevVisibleTweets) => prevVisibleTweets + 25);
  };

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const handleResize = () => {
    setWindowWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const { width } = useWindowDimensions();

  const [dataFromCommentModal, setDataFromCommentModal] = useState("");
  function handleDataFromCommentModal(data) {
    console.log("Data =>", data);
    setDataFromCommentModal(data);
  }

  const { isPostModalVisible } = useContext(ModalVisibilityContext);

  useEffect(() => {
    if (isNewPostShared && favoriteWindow === "hide") {
      // setLoadingTrue();
      setTimeout(() => {
        // setLoadingFalse();
        handleShowPostsProfilePage();
      }, 200);
    }
  }, [isNewPostShared]);

  const [headerPosition, setHeaderPosition] = useState(0);

  const handleScroll = () => {
    const scrollPosition = window.pageYOffset;

    if (scrollPosition < 53) {
      setHeaderPosition(-scrollPosition);
    } else {
      setHeaderPosition(-53);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [headerPosition]);
  const [hoveredTab, setHoveredTab] = useState(null);
  const [activeTab, setActiveTab] = useState("forYou");
  const handleHover = (tab) => {
    setHoveredTab(tab);
  };

  const handleLeave = () => {
    setHoveredTab(null);
  };

  const {
    getFontSizeAndLineHeight31,
    getFontSizeAndLineHeight20,
    getFontSizeAndLineHeight17,
    getFontSizeAndLineHeight15,
    getFontSizeAndLineHeight14,
    getFontSizeAndLineHeight13,
  } = useFontSizeHandler();

  const font31 = getFontSizeAndLineHeight31();
  const font20 = getFontSizeAndLineHeight20();
  const font17 = getFontSizeAndLineHeight17();
  const font15 = getFontSizeAndLineHeight15();
  const font14 = getFontSizeAndLineHeight14();
  const font13 = getFontSizeAndLineHeight13();

  // get following users
  const [followedIds, setFollowedIds] = useState([]);

  const getFollowingArray = async () => {
    try {
      const result = await axios.get(
        `${API_URL}/users/${userInfo._id}/following`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      const followedUserIds = result.data.following.map((user) => user._id);
      setFollowedIds(followedUserIds);
    } catch (error) {
      console.error("error:", error);
    }
  };

  const checkIfFollowing = (userId) => {
    return followedIds.includes(userId);
  };

  useEffect(() => {
    if (userInfo._id) {
      getFollowingArray();
    }
  }, []);

  // edit form general scenario
  const [checkFields, setcheckFields] = useState({
    nameInput: false,
    bioInput: false,
    locationInput: false,
    websiteInput: false,
    birthDateInput: false,
  });

  const [onFocusedToFullNameField, setonFocusedToFullNameField] =
    useState(false);
  const [onFocusedToBioField, setonFocusedToBioField] = useState(false);
  const [onFocusedToLocationField, setonFocusedToLocationField] =
    useState(false);
  const [onFocusedToWebsiteField, setonFocusedToWebsiteField] = useState(false);
  const [fullName, setFullName] = useState(userInfo.fullname);
  const [bioOnEdit, setBioOnEdit] = useState("");
  const [locationOnEdit, setLocationOnEdit] = useState("");
  const [websiteOnEdit, setWebsiteOnEdit] = useState("");
  const [birthDateOnEdit, setBirthDateOnEdit] = useState({
    month: "",
    day: "",
    year: "",
  });
  const [fullnameFilled, setfullnameFilled] = useState("");
  const [firstAppearence, setFirstAppearance] = useState("");

  useEffect(() => {
    console.log("birthdate, month:", birthDateOnEdit.month);
    console.log("birthdate, year:", birthDateOnEdit.year);
    console.log("birthdate, day:", birthDateOnEdit.day);
  }, [birthDateOnEdit.month, birthDateOnEdit.year, birthDateOnEdit.day]);

  const handleChangeFullName = (e) => {
    if (e.target.value.length <= 50) {
      setFullName(e.target.value);
      setfullnameFilled(false);
      setFirstAppearance(false);
      setcheckFields((prevState) => ({
        ...prevState,
        nameInput: true,
      }));
    }
  };
  const handleChangeBio = (e) => {
    if (e.target.value.length <= 160) {
      setBioOnEdit(e.target.value);
      setcheckFields((prevState) => ({
        ...prevState,
        bioInput: true,
      }));
    }
  };
  const handleChangeLocation = (e) => {
    if (e.target.value.length <= 30) {
      setLocationOnEdit(e.target.value);
      setcheckFields((prevState) => ({
        ...prevState,
        locationInput: true,
      }));
    }
  };
  const handleChangeWebsite = (e) => {
    if (e.target.value.length <= 100) {
      setWebsiteOnEdit(e.target.value);
      setcheckFields((prevState) => ({
        ...prevState,
        websiteInput: true,
      }));
    }
  };

  const [showWarningAgeEditingModal, setshowWarningAgeEditingModal] =
    useState(false);
  const showWarningForEditAge = () => {
    setshowWarningAgeEditingModal(true);
  };
  const closeWarningForEditAge = () => {
    setshowWarningAgeEditingModal(false);
  };

  const [showBirthDateChangeScenario, setshowBirthDateChangeScenario] =
    useState(false);

  const [showMonthPicker, setshowMonthPicker] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("");

  const [showDayPicker, setshowDayPicker] = useState(false);
  const [selectedDay, setselectedDay] = useState("");

  const [hoveredIndexMonth, setIshoveredIndexMonth] = useState(null);
  const [hoveredIndexDay, setIshoveredIndexDay] = useState(null);
  const [hoveredIndexYear, setIshoveredIndexYear] = useState(null);

  const [styleOfBoxMonth, setStyleOfBoxMonth] = useState(false);
  const [styleOfBoxDay, setStyleOfBoxDay] = useState(false);
  const [styleOfBoxYear, setStyleOfBoxYear] = useState(false);

  const monthPickerRef = useRef(null);
  const dayPickerRef = useRef(null);
  const yearPickerRef = useRef(null);

  const [showYearPicker, setshowYearPicker] = useState(false);
  const [selectedYear, setselectedYear] = useState(new Date().getFullYear());
  const [displayedYear, setdisplayedYear] = useState("");

  const monthsBirthDate = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const isLeapYear = (year) => {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  };

  const getDaysInMonth = (month) => {
    switch (month) {
      case "January":
      case "March":
      case "May":
      case "July":
      case "August":
      case "October":
      case "December":
        return 31;
      case "April":
      case "June":
      case "September":
      case "November":
        return 30;
      case "February":
        return isLeapYear(selectedYear) ? 29 : 28;
      default:
        return 0; // Geçersiz ay ismi durumu
    }
  };

  const [dayNum, setDayNum] = useState([]);

  const currentMonth = monthsBirthDate[new Date().getMonth()];

  console.log("Selected month =>", selectedMonth);
  console.log("Current month =>", currentMonth);

  useEffect(() => {
    const newDays = [];
    if (selectedMonth) {
      console.log("ay seçildi!", selectedMonth);
      console.log("get days in month:", getDaysInMonth(selectedMonth));
      for (let i = 1; i <= getDaysInMonth(selectedMonth); i++) {
        console.log("i: ", i);
        newDays.push(i);
      }
    } else {
      console.log("ay seçimi yapılmadı!");
      for (let i = 1; i <= getDaysInMonth(currentMonth); i++) {
        newDays.push(i);
      }
    }
    setDayNum(newDays);
  }, [selectedMonth]);

  const rangeOfYears120Year = 120;
  const currentYear = new Date().getFullYear();
  const rangeNumbers = [];

  for (let i = currentYear; i >= currentYear - rangeOfYears120Year; i--) {
    rangeNumbers.push(i);
  }

  const handleMonthClick = () => {
    setshowMonthPicker(!showMonthPicker);
  };

  const handleMonthSelect = (month) => {
    // setTimeout(() => {
    setSelectedMonth(month);
    setshowMonthPicker(false);
    setBirthDateOnEdit((prevData) => ({
      ...prevData,
      month: month,
    }));
    // }, 300);
  };

  const handleDayClick = () => {
    setshowDayPicker(!showDayPicker);
    setStyleOfBoxDay(true);
  };

  const handleDaySelect = (day) => {
    // setTimeout(() => {
    setselectedDay(day);
    setshowDayPicker(false);
    setStyleOfBoxDay(false);
    // }, 300);
    setBirthDateOnEdit((prevData) => ({
      ...prevData,
      day: day,
    }));
  };

  const handleYearClick = () => {
    setshowYearPicker(!showYearPicker);
    setStyleOfBoxYear(true);
  };

  const handleYearSelect = (year) => {
    // setTimeout(() => {
    setdisplayedYear(year);
    setshowYearPicker(false);
    setStyleOfBoxYear(false);
    setBirthDateOnEdit((prevData) => ({
      ...prevData,
      year: year,
    }));
    // }, 300);
  };

  const popoverContent = (
    <Popover
      className={`scrollbar-add scrollbar-add-${themeName} chirp-regular-font`}
      style={{
        zIndex: 99999,
        padding: "8px",
        height: "250px",
        width: "175px",
        overflowY: "scroll",
        backgroundColor: themeName === "dark-theme" ? "black" : "#e4e2e9",
        border: "none",
        filter:
          themeName === "dark-theme"
            ? "drop-shadow(rgb(51, 54, 57) 1px -1px 1px)"
            : "",

        boxShadow:
          themeName === "dark-theme"
            ? "rgba(255, 255, 255, 0.2) 0px 0px 15px, rgba(255, 255, 255, 0.15) 0px 0px 3px 1px"
            : "0 0 15px rgba(101, 119,134,0.2), 0 0 5px 3px rgba(101,119,134,0.15)",
      }}
      id="monthPopover"
    >
      {monthsBirthDate.map((month, index) => (
        <div
          className="testtt !!!"
          onMouseEnter={() => {
            setIshoveredIndexMonth(index);
          }}
          key={index}
          onClick={() => handleMonthSelect(month)}
          style={{
            color: themeName === "dark-theme" ? "white" : "black",
            padding: "8px",
            cursor: "pointer",
            backgroundColor: hoveredIndexMonth === index ? "#5aa0ff" : "",
            borderRadius: "4px",
          }}
        >
          {month}
        </div>
      ))}
    </Popover>
  );

  const popoverDayContent = (
    <Popover
      className={`scrollbar-add scrollbar-add-${themeName} chirp-regular-font`}
      style={{
        zIndex: 99999,
        padding: "8px",
        height: "250px",
        width: "175px",
        border: "none",
        overflowY: "scroll",
        backgroundColor: themeName === "dark-theme" ? "black" : "#e4e2e9",
        filter:
          themeName === "dark-theme"
            ? "drop-shadow(rgb(51, 54, 57) 1px -1px 1px)"
            : "",

        boxShadow:
          themeName === "dark-theme"
            ? "rgba(255, 255, 255, 0.2) 0px 0px 15px, rgba(255, 255, 255, 0.15) 0px 0px 3px 1px"
            : "0 0 15px rgba(101, 119,134,0.2), 0 0 5px 3px rgba(101,119,134,0.15)",
      }}
      id="dayPopover"
    >
      {dayNum.map((day, index) => (
        <div
          onMouseEnter={() => {
            setIshoveredIndexDay(index);
          }}
          key={index}
          onClick={() => handleDaySelect(day)}
          style={{
            color: themeName === "dark-theme" ? "white" : "black",
            padding: "8px",
            cursor: "pointer",
            backgroundColor: hoveredIndexDay === index ? "#5aa0ff" : "",
            borderRadius: "4px",
          }}
        >
          {day}
        </div>
      ))}
    </Popover>
  );

  const popoverYearContent = (
    <Popover
      className={`scrollbar-add scrollbar-add-${themeName} chirp-regular-font`}
      style={{
        zIndex: 99999,
        padding: "8px",
        height: "250px",
        width: "175px",
        border: "none",
        overflowY: "scroll",
        backgroundColor: themeName === "dark-theme" ? "black" : "#e4e2e9",
        filter:
          themeName === "dark-theme"
            ? "drop-shadow(rgb(51, 54, 57) 1px -1px 1px)"
            : "",

        boxShadow:
          themeName === "dark-theme"
            ? "rgba(255, 255, 255, 0.2) 0px 0px 15px, rgba(255, 255, 255, 0.15) 0px 0px 3px 1px"
            : "0 0 15px rgba(101, 119,134,0.2), 0 0 5px 3px rgba(101,119,134,0.15)",
      }}
      id="yearPopover"
    >
      {rangeNumbers.map((year, index) => (
        <div
          onMouseEnter={() => {
            setIshoveredIndexYear(index);
          }}
          key={index}
          onClick={() => {
            console.log("picked year:", year);
            if (year) {
              handleYearSelect(year);
            }
          }}
          style={{
            color: themeName === "dark-theme" ? "white" : "black",
            padding: "8px",
            cursor: "pointer",
            backgroundColor: hoveredIndexYear === index ? "#5aa0ff" : "",
            borderRadius: "4px",
          }}
        >
          {year}
        </div>
      ))}
    </Popover>
  );

  const restrictionsMonthAndDay = [
    "Only you",
    "You follow each other",
    "People you follow",
    "Your followers",
    "Public",
  ];
  const restrictionsYear = [
    "Only you",
    "You follow each other",
    "People you follow",
    "Your followers",
    "Public",
  ];

  const [ishoveredRestrictionIndex, setIshoveredRestrictionIndex] =
    useState(null);

  const popoverContentRestrictionMonthAndDay = (
    <Popover
      className={`scrollbar-add scrollbar-add-${themeName} chirp-regular-font`}
      style={{
        zIndex: 99999,
        padding: "8px",
        border: "none",
        overflowY: "auto",
        backgroundColor: themeName === "dark-theme" ? "black" : "#e4e2e9",
        filter:
          themeName === "dark-theme"
            ? "drop-shadow(rgb(51, 54, 57) 1px -1px 1px)"
            : "",

        boxShadow:
          themeName === "dark-theme"
            ? "rgba(255, 255, 255, 0.2) 0px 0px 15px, rgba(255, 255, 255, 0.15) 0px 0px 3px 1px"
            : "0 0 15px rgba(101, 119,134,0.2), 0 0 5px 3px rgba(101,119,134,0.15)",
      }}
      id="yearPopover"
    >
      {restrictionsMonthAndDay.map((restriction, index) => (
        <div
          onMouseEnter={() => {
            setIshoveredRestrictionIndex(index);
          }}
          key={index}
          onClick={() => handleRestrictionMonthAndDaySelect(restriction)}
          style={{
            color: themeName === "dark-theme" ? "white" : "black",
            padding: "8px",
            cursor: "pointer",
            backgroundColor:
              ishoveredRestrictionIndex === index ? "#5aa0ff" : "",
            borderRadius: "4px",
          }}
        >
          {restriction}
        </div>
      ))}
    </Popover>
  );

  const handleRestrictionMonthAndDaySelect = (option) => {
    // setTimeout(() => {
    setStyleOfBoxMonth(false);
    setshowMonthPicker(false);
    setRestrictions((prevData) => ({
      ...prevData,
      monthAndDay: option,
    }));
    // }, 300);
  };

  const handleClickOutsideMonthPicker = (event) => {
    if (
      monthPickerRef.current &&
      !monthPickerRef.current.contains(event.target)
    ) {
      setStyleOfBoxMonth(false);
      setshowMonthPicker(false);
    } else {
      setStyleOfBoxMonth(true);
    }
  };
  const handleClickOutsideDayPicker = (event) => {
    if (dayPickerRef.current && !dayPickerRef.current.contains(event.target)) {
      setStyleOfBoxDay(false);
      setshowDayPicker(false);
    } else {
      setStyleOfBoxDay(true);
    }
  };
  const handleClickOutsideYearPicker = (event) => {
    if (
      yearPickerRef.current &&
      !yearPickerRef.current.contains(event.target)
    ) {
      setStyleOfBoxYear(false);
      setshowYearPicker(false);
    } else {
      setStyleOfBoxYear(true);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutsideYearPicker);

    return () => {
      document.removeEventListener("mousedown", handleClickOutsideYearPicker);
    };
  }, []);
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutsideDayPicker);

    return () => {
      document.removeEventListener("mousedown", handleClickOutsideDayPicker);
    };
  }, []);
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutsideMonthPicker);

    return () => {
      document.removeEventListener("mousedown", handleClickOutsideMonthPicker);
    };
  }, []);

  const restrictionMonthAndDayRef = useRef(null);
  const [
    selectedRestrictionForMonthAndDay,
    setSelectedRestrictionForMonthAndDay,
  ] = useState("Only you");
  const [
    showMonthAndDayRestrictionPicker,
    setshowMonthAndDayRestrictionPicker,
  ] = useState(false);
  const [styleOfRestrictionsMonthAndDayBox, setStyleOfRestrictionsMonthAndDay] =
    useState(false);

  const handleClickOutsideRestrictionsMonthAndDay = (event) => {
    if (
      restrictionMonthAndDayRef.current &&
      !restrictionMonthAndDayRef.current.contains(event.target)
    ) {
      setStyleOfRestrictionsMonthAndDay(false);
      setshowMonthAndDayRestrictionPicker(false);
    } else {
      setStyleOfRestrictionsMonthAndDay(true);
    }
  };

  useEffect(() => {
    document.addEventListener(
      "mousedown",
      handleClickOutsideRestrictionsMonthAndDay
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutsideRestrictionsMonthAndDay
      );
    };
  }, []);

  const [ishoveredRestrictionYearIndex, setIshoveredRestrictionYearIndex] =
    useState(null);

  const popoverContentRestrictionYear = (
    <Popover
      className={`scrollbar-add scrollbar-add-${themeName} chirp-regular-font`}
      style={{
        zIndex: 99999,
        padding: "8px",
        border: "none",
        overflowY: "auto",
        backgroundColor: themeName === "dark-theme" ? "black" : "#e4e2e9",
        filter:
          themeName === "dark-theme"
            ? "drop-shadow(rgb(51, 54, 57) 1px -1px 1px)"
            : "",

        boxShadow:
          themeName === "dark-theme"
            ? "rgba(255, 255, 255, 0.2) 0px 0px 15px, rgba(255, 255, 255, 0.15) 0px 0px 3px 1px"
            : "0 0 15px rgba(101, 119,134,0.2), 0 0 5px 3px rgba(101,119,134,0.15)",
      }}
      id="yearPopover"
    >
      {restrictionsYear.map((restriction, index) => (
        <div
          onMouseEnter={() => {
            setIshoveredRestrictionYearIndex(index);
          }}
          key={index}
          onClick={() => handleRestrictionYearSelect(restriction)}
          style={{
            color: themeName === "dark-theme" ? "white" : "black",
            padding: "8px",
            cursor: "pointer",
            backgroundColor:
              ishoveredRestrictionYearIndex === index ? "#5aa0ff" : "",
            borderRadius: "4px",
          }}
        >
          {restriction}
        </div>
      ))}
    </Popover>
  );

  const handleRestrictionMonthAndDayClick = () => {
    setshowMonthAndDayRestrictionPicker(!showMonthAndDayRestrictionPicker);
  };

  const restrictionYearRef = useRef(null);
  const [selectedRestrictionForYear, setSelectedRestrictionForYear] =
    useState("Only you");
  const [showYearRestrictionPicker, setshowYearRestrictionPicker] =
    useState(false);
  const [styleOfRestrictionsYearBox, setStyleOfRestrictionsYear] =
    useState(false);

  const handleRestrictionYearSelect = (option) => {
    // setTimeout(() => {
    setStyleOfRestrictionsYear(false);
    setshowYearRestrictionPicker(false);
    setRestrictions((prevData) => ({
      ...prevData,
      year: option,
    }));
    // }, 300);
  };

  const handleClickOutsideRestrictionsYear = (event) => {
    if (
      restrictionYearRef.current &&
      !restrictionYearRef.current.contains(event.target)
    ) {
      setStyleOfRestrictionsYear(false);
      setshowYearRestrictionPicker(false);
    } else {
      setStyleOfRestrictionsYear(true);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutsideRestrictionsYear);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutsideRestrictionsYear
      );
    };
  }, []);

  const handleRestrictionYearClick = () => {
    setshowYearRestrictionPicker(!showYearRestrictionPicker);
  };

  const [restrictions, setRestrictions] = useState({
    monthAndDay: "",
    year: "",
  });

  useEffect(() => {
    console.log(
      "data",
      "fullname:",
      fullName,
      "bio:",
      bioOnEdit,
      "location:",
      locationOnEdit,
      "website:",
      websiteOnEdit,
      "birthdate:",
      birthDateOnEdit,
      "restrictions for birthdate:",
      restrictions
    );
  }, [
    fullName,
    bioOnEdit,
    locationOnEdit,
    websiteOnEdit,
    birthDateOnEdit,
    restrictions,
  ]);

  const closeEditModal = () => {
    setWebsiteOnEdit("");
    setLocationOnEdit("");
    setBioOnEdit("");
    setFullName(userInfo.fullname);
    setonFocusedToWebsiteField(false);
    setonFocusedToLocationField(false);
    setonFocusedToBioField(false);
    setonFocusedToFullNameField(false);
    setshowBirthDateChangeScenario(false);
    setOpenEditModal(false);
    setSelectedRestrictionForMonthAndDay("Only you");
    setshowMonthAndDayRestrictionPicker(false);
    setStyleOfRestrictionsMonthAndDay(false);
    setSelectedMonth("");
    setselectedDay("");
    setdisplayedYear("");
    setcheckFields({
      nameInput: "",
      bioInput: "",
      locationInput: "",
      websiteInput: "",
    });
    setBirthDateOnEdit({
      month: "",
      day: "",
      year: "",
    });
    setRestrictions({
      monthAndDay: "",
      year: "",
    });
  };

  return (
    <>
      {/* {contextHolder} */}
      {contextHolder}

      {/* edit age warning modal */}
      <>
        <Modal
          backdropClassName={
            themeName === "dark-theme" ? `back-drop-${themeName}` : ""
          }
          centered={true}
          show={showWarningAgeEditingModal}
          onHide={closeWarningForEditAge}
          className="leave-conversation"
          contentClassName={
            themeName === "dark-theme"
              ? "leave-conversation-modal-dark-theme"
              : "leave-conversation-modal"
          }
          style={{
            zIndex: 9999,
          }}
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
                className={
                  themeName === "dark-theme"
                    ? "soft-grey-dark-theme-text-variant-1 chirp-bold-font"
                    : "very-dark-gray-light-theme-text-variant-1 chirp-bold-font"
                }
                style={{
                  color: themeName === "dark-theme" ? "white" : "",
                  fontSize: font20.fontSize,
                  lineHeight: font20.lineHeight,
                }}
              >
                Edit date of birth?
              </div>
              <div
                className={
                  themeName === "dark-theme"
                    ? "mt-2 soft-grey-dark-theme-text-variant-2 chirp-regular-font"
                    : "mt-2 very-dark-gray-light-theme-text-variant-2 chirp-regular-font"
                }
                style={{
                  fontSize: font15.fontSize,
                  lineHeight: font15.lineHeight,
                }}
              >
                This can only be changed a few times. Make sure you enter the
                age of the person using the account.
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
                  closeWarningForEditAge();
                  setshowBirthDateChangeScenario(true);
                }}
                className={
                  themeName === "light-theme"
                    ? `save-edited-profile-light-theme chirp-bold-font`
                    : `save-edited-profile-dark-theme`
                }
                style={{
                  maxWidth: "256px",
                  minHeight: "44px",
                  color: "white",
                  border: "none",
                  color: themeName === "dark-theme" ? "black" : "white",
                }}
              >
                Edit
              </Button>
              <Button
                variant="light"
                onClick={closeWarningForEditAge}
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

      {/* edit modal */}
      <>
        <Modal
          backdropClassName={
            themeName === "dark-theme" ? `back-drop-${themeName}` : ""
          }
          centered
          style={{
            margin: width <= 768 && "0px",
            padding: width <= 768 && "0px",
          }}
          dialogClassName={width <= 700 ? "modal-fullscreen" : ""}
          className={
            width <= 700 && themeName !== "dark-theme"
              ? "smaller-edit-modal"
              : width <= 700 && themeName === "dark-theme"
              ? `smaller-edit-modal-dark-theme width-smaller-700-post-modal-left-side-navigation-bar width-smaller-700-post-modal-left-side-navigation-bar-${themeName}`
              : `edit-profile-modal edit-profile-modal-${themeName}`
          }
          show={openEditModal}
          onHide={closeEditModal}
        >
          <div>
            <div
              style={{
                padding: "0px 12px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor:
                  themeName === "dark-theme"
                    ? "rgba(0, 0, 0, 0.65)"
                    : "rgba(255, 255, 255, 0.85)",
                backdropFilter: "blur(12px)",
                height: "53px",
                position: "sticky",
                top: "0px",
                width: "100%",
                zIndex: 99999,
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: "26px",
                  alignItems: "center",
                }}
              >
                <div
                  onClick={closeEditModal}
                  className={
                    themeName === "dark-theme"
                      ? `close-button-${themeName}`
                      : `close-button`
                  }
                  style={{
                    display: "inline-flex",
                    borderRadius: "50%",
                    cursor: "pointer",
                    width: "40px",
                    height: "40px",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <svg
                    style={{
                      border: "none",
                      margin: "5px",
                    }}
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
                <div
                  className="chirp-bold-font"
                  style={{
                    fontSize: font20.fontSize,
                    lineHeight: font20.lineHeight,
                    color: themeName === "dark-theme" ? "white" : "black",
                  }}
                >
                  Edit profile
                </div>
              </div>
              <div
                onClick={saveEdit}
                className="chirp-bold-font"
                style={{
                  padding: "12px 12px",
                  textAlign: "right",
                }}
              >
                <button
                  className={
                    themeName === "light-theme"
                      ? `save-edited-profile-light-theme`
                      : `save-edited-profile-dark-theme`
                  }
                  style={{
                    borderRadius: "9999px",
                    border:
                      themeName !== "dark-theme"
                        ? "1px solid rgba(0, 0, 0, 0.1)"
                        : // : "0.1px solid rgb(70, 70, 70)",
                          "1px solid rgb(70, 70, 70)",
                    backgroundColor:
                      themeName === "light-theme" ? "black" : "white",
                    color: themeName === "dark-theme" ? "black" : "white",
                    minHeight: "32px",
                    minWidth: "32px",
                    outlineStyle: "none",
                    cursor: "pointer",
                    transitionDuration: "0.2s",
                    fontSize: font15.fontSize,
                    lineHeight: font15.lineHeight,
                    opacity:
                      !fullnameFilled &&
                      fullName.length === 0 &&
                      !firstAppearence &&
                      "0.5",
                    cursor:
                      !fullnameFilled &&
                      fullName.length === 0 &&
                      !firstAppearence &&
                      "default",
                    pointerEvents:
                      !fullnameFilled &&
                      fullName.length === 0 &&
                      !firstAppearence &&
                      "none",
                  }}
                >
                  <span
                    style={{
                      padding: "0px 12px",
                    }}
                  >
                    Save
                  </span>
                </button>
              </div>
            </div>

            <div
              style={{
                height: "200px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: themeName === "light-theme" && "#B2B2B2",
                opacity: "0.75",
                position: "relative",
              }}
            >
              <div
                className="edit-photo-machine-img"
                style={{
                  width: "50px",
                  height: "50px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "gray",
                  borderRadius: "50%",
                  backgroundColor:
                    themeName === "dark-theme"
                      ? "rgba(15, 20, 25, 0.75)"
                      : "#56595B",
                  cursor: "pointer",
                  position: "relative",
                }}
              >
                <svg
                  width={24}
                  height={24}
                  fill="rgb(255, 255, 255)"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <g>
                    <path d="M9.697 3H11v2h-.697l-3 2H5c-.276 0-.5.224-.5.5v11c0 .276.224.5.5.5h14c.276 0 .5-.224.5-.5V10h2v8.5c0 1.381-1.119 2.5-2.5 2.5H5c-1.381 0-2.5-1.119-2.5-2.5v-11C2.5 6.119 3.619 5 5 5h1.697l3-2zM12 10.5c-1.105 0-2 .895-2 2s.895 2 2 2 2-.895 2-2-.895-2-2-2zm-4 2c0-2.209 1.791-4 4-4s4 1.791 4 4-1.791 4-4 4-4-1.791-4-4zM17 2c0 1.657-1.343 3-3 3v1c1.657 0 3 1.343 3 3h1c0-1.657 1.343-3 3-3V5c-1.657 0-3-1.343-3-3h-1z"></path>
                  </g>
                </svg>
              </div>
            </div>
            <div
              style={{
                position: "relative",
                padding: "0px 12px",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "-50px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: "50%",
                }}
              >
                {profile?.imageUrl?.slice(0, 3) !== "../" ? (
                  <img
                    width={112}
                    height={112}
                    src={profile?.imageUrl}
                    alt=""
                    style={{
                      borderRadius: "50%",
                      opacity: 0.75,
                      border:
                        themeName === "dark-theme"
                          ? "4px solid black"
                          : "4px solid white",
                    }}
                  />
                ) : (
                  <img
                    style={{
                      borderRadius: "50%",
                      opacity: 0.75,
                      border:
                        themeName === "dark-theme"
                          ? "4px solid black"
                          : "4px solid white",
                    }}
                    width="112"
                    height="112"
                    src="https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png"
                    alt=""
                  />
                )}

                <div
                  className="edit-photo-machine-img"
                  style={{
                    width: "50px",
                    height: "50px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "gray",
                    borderRadius: "50%",
                    backgroundColor:
                      themeName === "dark-theme"
                        ? "rgba(15, 20, 25, 0.75)"
                        : "#56595B",
                    cursor: "pointer",
                    position: "absolute",
                    backdropFilter: "blur(12px)",
                    backgroundColor: "rgba(15, 20, 25, 0.75)",
                    opacity: 0.75,
                  }}
                >
                  <svg
                    width={24}
                    height={24}
                    fill="rgb(255, 255, 255)"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <g>
                      <path d="M9.697 3H11v2h-.697l-3 2H5c-.276 0-.5.224-.5.5v11c0 .276.224.5.5.5h14c.276 0 .5-.224.5-.5V10h2v8.5c0 1.381-1.119 2.5-2.5 2.5H5c-1.381 0-2.5-1.119-2.5-2.5v-11C2.5 6.119 3.619 5 5 5h1.697l3-2zM12 10.5c-1.105 0-2 .895-2 2s.895 2 2 2 2-.895 2-2-.895-2-2-2zm-4 2c0-2.209 1.791-4 4-4s4 1.791 4 4-1.791 4-4 4-4-1.791-4-4zM17 2c0 1.657-1.343 3-3 3v1c1.657 0 3 1.343 3 3h1c0-1.657 1.343-3 3-3V5c-1.657 0-3-1.343-3-3h-1z"></path>
                    </g>
                  </svg>
                </div>
              </div>
            </div>
            {/* inputs */}
            <div
              style={{
                marginTop: "80px",
                padding: "0px 12px",
                position: "relative",
                zIndex: 9999,
              }}
            >
              {/* name */}
              <InputLabel
                style={{
                  width: "98%",
                  textAlign: "right",
                }}
              >
                <div
                  className="chirp-regular-font"
                  style={{
                    color:
                      themeName === "dark-theme"
                        ? "#71767A"
                        : "rgb(83, 100, 113)",
                    fontSize: font13.fontSize,
                    lineHeight: font13.lineHeight,
                    visibility: onFocusedToFullNameField ? "visible" : "hidden",
                  }}
                >
                  {fullName.length} / 50
                </div>
              </InputLabel>
              <TextField
                // autoFocus={true}
                onFocus={() => setonFocusedToFullNameField(true)}
                onBlur={() => setonFocusedToFullNameField(false)}
                value={fullName}
                onChange={handleChangeFullName}
                type="text"
                id="outlined-basic"
                variant={"outlined"}
                label={`Name`}
                style={{
                  width: "100%",
                  height: "58px",
                }}
                InputLabelProps={{
                  style: {
                    color: themeName === "dark-theme" ? "#71767B" : "",
                  },
                }}
                InputProps={{
                  style: {
                    color: themeName === "dark-theme" ? "white" : "",
                    fontSize: font17.fontSize,
                    lineHeight: font17.lineHeight,
                  },
                }}
                sx={{
                  "& .Mui-focused input + fieldset": {
                    border:
                      !fullnameFilled &&
                      fullName.length === 0 &&
                      !firstAppearence
                        ? "2px solid rgb(244, 33, 46)!important"
                        : "2px solid #1d9bf0 !important",
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor:
                      !fullnameFilled &&
                      fullName.length === 0 &&
                      !firstAppearence
                        ? "rgb(244, 33, 46)!important"
                        : themeName === "dark-theme"
                        ? "rgb(70, 70, 70) !important"
                        : "#cfd9de !important",
                  },
                  "& .MuiInputLabel-shrink": {
                    color:
                      !fullnameFilled &&
                      fullName.length === 0 &&
                      !firstAppearence
                        ? "rgb(244, 33, 46)!important"
                        : "#1f9cf0 !important",
                  },
                }}
              />
              {!fullnameFilled && fullName.length === 0 && !firstAppearence ? (
                <div
                  className="chirp-regular-font"
                  style={{
                    width: "81.5%",
                    color: "rgb(244, 33, 46)",
                    fontSize: font13.fontSize,
                    lineHeight: font13.lineHeight,
                    position: "relative",
                    left: "10px",
                  }}
                >
                  {"Name can't be blank"}
                </div>
              ) : null}
              <div
                style={{
                  marginTop: "20px",
                }}
              ></div>
              {/* bio */}
              <InputLabel
                style={{
                  width: "98%",
                  textAlign: "right",
                }}
              >
                <div
                  className="chirp-regular-font"
                  style={{
                    color:
                      themeName === "dark-theme"
                        ? "#71767A"
                        : "rgb(83, 100, 113)",
                    fontSize: font13.fontSize,
                    lineHeight: font13.lineHeight,
                    visibility: onFocusedToBioField ? "visible" : "hidden",
                  }}
                >
                  {fullName.length} / 160
                </div>
              </InputLabel>
              <TextField
                className="mui-bio-edit-profile-input"
                // autoFocus={true}
                onFocus={() => setonFocusedToBioField(true)}
                onBlur={() => setonFocusedToBioField(false)}
                value={bioOnEdit}
                onChange={handleChangeBio}
                type="text"
                id="outlined-basic"
                variant={"outlined"}
                autoComplete="off"
                label={`Bio`}
                // IMPORTANT
                // multiline true ve rows 3 kullanıldığında TextField textarea olarak render edilir

                multiline={true}
                rows={3}
                style={{
                  width: "100%",
                }}
                InputLabelProps={{
                  style: {
                    color: themeName === "dark-theme" ? "#71767B" : "",
                  },
                }}
                InputProps={{
                  style: {
                    color: themeName === "dark-theme" ? "white" : "",
                    fontSize: font17.fontSize,
                    lineHeight: font17.lineHeight,
                  },
                }}
                sx={{
                  "& .Mui-focused textarea + fieldset": {
                    border:
                      onFocusedToBioField && "2px solid #1d9bf0 !important",
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor:
                      themeName === "dark-theme"
                        ? "rgb(70, 70, 70) !important"
                        : "#cfd9de !important",
                  },
                  "& .MuiInputLabel-shrink": {
                    color: "#1f9cf0 !important",
                  },
                }}
              />
              <div
                style={{
                  marginTop: "20px",
                }}
              ></div>
              {/* location */}
              <InputLabel
                style={{
                  width: "98%",
                  textAlign: "right",
                }}
              >
                <div
                  className="chirp-regular-font"
                  style={{
                    color:
                      themeName === "dark-theme"
                        ? "#71767A"
                        : "rgb(83, 100, 113)",
                    fontSize: font13.fontSize,
                    lineHeight: font13.lineHeight,
                    visibility: onFocusedToLocationField ? "visible" : "hidden",
                  }}
                >
                  {locationOnEdit.length} / 30
                </div>
              </InputLabel>
              <TextField
                // autoFocus={true}
                onFocus={() => setonFocusedToLocationField(true)}
                onBlur={() => setonFocusedToLocationField(false)}
                value={locationOnEdit}
                onChange={handleChangeLocation}
                type="text"
                id="outlined-basic"
                variant={"outlined"}
                label={`Location`}
                style={{
                  width: "100%",
                  height: "58px",
                }}
                InputLabelProps={{
                  style: {
                    color: themeName === "dark-theme" ? "#71767B" : "",
                  },
                }}
                InputProps={{
                  style: {
                    color: themeName === "dark-theme" ? "white" : "",
                    fontSize: font17.fontSize,
                    lineHeight: font17.lineHeight,
                  },
                }}
                sx={{
                  "& .Mui-focused input + fieldset": {
                    border: "2px solid #1d9bf0 !important",
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor:
                      themeName === "dark-theme"
                        ? "rgb(70, 70, 70) !important"
                        : "#cfd9de !important",
                  },
                  "& .MuiInputLabel-shrink": {
                    color: "#1f9cf0 !important",
                  },
                }}
              />{" "}
              <div
                style={{
                  marginTop: "20px",
                }}
              ></div>
              {/* website */}
              <InputLabel
                style={{
                  width: "98%",
                  textAlign: "right",
                }}
              >
                <div
                  className="chirp-regular-font"
                  style={{
                    color:
                      themeName === "dark-theme"
                        ? "#71767A"
                        : "rgb(83, 100, 113)",
                    fontSize: font13.fontSize,
                    lineHeight: font13.lineHeight,
                    visibility: onFocusedToWebsiteField ? "visible" : "hidden",
                  }}
                >
                  {websiteOnEdit.length} / 100
                </div>
              </InputLabel>
              <TextField
                // autoFocus={true}
                onFocus={() => setonFocusedToWebsiteField(true)}
                onBlur={() => setonFocusedToWebsiteField(false)}
                value={websiteOnEdit}
                onChange={handleChangeWebsite}
                type="text"
                id="outlined-basic"
                variant={"outlined"}
                label={`Website`}
                style={{
                  width: "100%",
                  height: "58px",
                }}
                InputLabelProps={{
                  style: {
                    color: themeName === "dark-theme" ? "#71767B" : "",
                  },
                }}
                InputProps={{
                  style: {
                    color: themeName === "dark-theme" ? "white" : "",
                    fontSize: font17.fontSize,
                    lineHeight: font17.lineHeight,
                  },
                }}
                sx={{
                  "& .Mui-focused input + fieldset": {
                    border: "2px solid #1d9bf0 !important",
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor:
                      themeName === "dark-theme"
                        ? "rgb(70, 70, 70) !important"
                        : "#cfd9de !important",
                  },
                  "& .MuiInputLabel-shrink": {
                    color: "#1f9cf0 !important",
                  },
                }}
              />{" "}
            </div>
            <div
              style={{
                marginTop: "30px",
              }}
            ></div>

            {showBirthDateChangeScenario ? (
              <div
                style={{
                  position: "relative",
                  padding: "0px 12px",
                  marginBottom: "60px",
                }}
              >
                <div>
                  <span
                    style={{
                      fontSize: font15.fontSize,
                      lineHeight: font15.lineHeight,
                    }}
                  >
                    {" "}
                    <span
                      className={
                        themeName === "dark-theme"
                          ? "soft-grey-dark-theme-text-variant-1 chirp-bold-font"
                          : "very-dark-gray-light-theme-text-variant-1 chirp-bold-font"
                      }
                    >
                      Birth date
                    </span>{" "}
                    <span
                      className={
                        themeName === "dark-theme"
                          ? "soft-grey-dark-theme-text-variant-2 chirp-bold-font"
                          : "very-dark-gray-light-theme-text-variant-2 chirp-bold-font"
                      }
                    >
                      {" "}
                      &middot;{" "}
                    </span>
                    <span
                      className="edit-profile-edit-btn"
                      onClick={() => setshowBirthDateChangeScenario(false)}
                    >
                      Cancel
                    </span>
                  </span>
                </div>
                <div
                  className={
                    themeName === "dark-theme"
                      ? "soft-grey-dark-theme-text-variant-2 chirp-regular-font"
                      : "very-dark-gray-light-theme-text-variant-2 chirp-regular-font"
                  }
                  style={{
                    fontSize: font15.fontSize,
                    lineHeight: font15.lineHeight,
                  }}
                >
                  <div>
                    This should be the date of birth of the person using the
                    account. Even if you’re making an account for your business,
                    event, or cat.
                  </div>
                  <div></div>
                  <br />
                  <div>
                    C uses your age to customize your experience, including ads,
                    as explained in our{" "}
                  </div>
                  <div
                    className="edit-profile-edit-btn"
                    style={{
                      display: "inline",
                    }}
                  >
                    Privacy Policy.
                  </div>
                </div>

                {/* date of birth start to check  */}
                <div
                  className="mt-4 chirp-regular-font"
                  style={{
                    width: "100%",
                    height: "58px",
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: font14.fontSize,
                    lineHeight: font14.lineHeight,
                  }}
                >
                  {" "}
                  <OverlayTrigger
                    show={showMonthPicker}
                    trigger="click"
                    placement="top"
                    overlay={popoverContent}
                  >
                    <div
                      ref={monthPickerRef}
                      className="child-div-after-overlay-trigger parent-div-month-content-over-flow-y"
                      onClick={handleMonthClick}
                      style={{
                        borderRadius: "4px",
                        cursor: "pointer",
                        color: "#536471",
                        flex: "255.5px",
                        padding: "4px",
                        border: "1px solid",
                        borderWidth: styleOfBoxMonth ? "2px" : "1px",
                        borderColor: styleOfBoxMonth
                          ? "#1d9bf0                          "
                          : themeName === "dark-theme"
                          ? "rgb(70,70,70)"
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
                          className="main-outline-text"
                          style={{
                            color: themeName === "dark-theme" ? "#71767B" : "",
                          }}
                        >
                          Month
                        </div>
                        <div
                          className="mt-2 selected-month-string-parent-div"
                          style={{
                            fontSize: font17.fontSize,
                            lineHeight: font17.lineHeight,
                            color:
                              themeName === "dark-theme" ? "white" : "black",
                          }}
                        >
                          {selectedMonth || profile?.birthDate?.month}
                        </div>
                      </div>
                      <div
                        style={{
                          float: "right",
                          position: "relative",
                          top: "30%",
                        }}
                      >
                        <svg
                          width={`${1.5}em`}
                          height={`${1.5}em`}
                          color="rgba(83,100,113,1.00)"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                          className="svg-month-picker r-4qtqp9 r-yyyyoo r-dnmrzs r-1plcrui r-lrvibr r-14j79pv r-1pgswnq r-50lct3 r-fdch1b r-633pao r-u8s1d r-1v2oles"
                        >
                          <g className="path-parent-g">
                            <path d="M3.543 8.96l1.414-1.42L12 14.59l7.043-7.05 1.414 1.42L12 17.41 3.543 8.96z"></path>
                          </g>
                        </svg>
                      </div>
                      {/* dropdown month picker start to check  */}

                      {/* dropdown month picker finish to check  */}
                    </div>
                  </OverlayTrigger>
                  <OverlayTrigger
                    show={showDayPicker}
                    trigger="click"
                    placement="top"
                    overlay={popoverDayContent}
                  >
                    <div
                      ref={dayPickerRef}
                      className="child-div-day-picker-after-overlay-trigger parent-div-day-picker-content-over-flow-y"
                      onClick={handleDayClick}
                      style={{
                        borderRadius: "4px",
                        cursor: "pointer",
                        color: "#536471",
                        flex: "113.75px",
                        padding: "4px",
                        marginLeft: "15px",
                        border: "1px solid rgb(207, 217, 222)",
                        borderWidth: styleOfBoxDay ? "2px" : "1px",
                        borderColor: styleOfBoxDay
                          ? "#1d9bf0                          "
                          : themeName === "dark-theme"
                          ? "rgb(70,70,70)"
                          : "rgb(207, 217, 222)",
                      }}
                    >
                      <div
                        style={{
                          display: "inline-block",
                          float: "left",
                        }}
                      >
                        <div
                          className="main-outline-text-day-picker"
                          style={{
                            color: themeName === "dark-theme" ? "#71767A" : "",
                          }}
                        >
                          Day
                        </div>
                        <div
                          className="mt-2 selected-day-string-parent-div"
                          style={{
                            fontSize: font17.fontSize,
                            lineHeight: font17.lineHeight,
                            color:
                              themeName === "dark-theme" ? "white" : "black",
                          }}
                        >
                          {selectedDay || profile?.birthDate?.day}
                        </div>
                      </div>
                      <div
                        style={{
                          float: "right",
                          position: "relative",
                          top: "30%",
                        }}
                      >
                        <svg
                          width={`${1.5}em`}
                          height={`${1.5}em`}
                          color="rgba(83,100,113,1.00)"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                          className="svg-day-picker r-4qtqp9 r-yyyyoo r-dnmrzs r-1plcrui r-lrvibr r-14j79pv r-1pgswnq r-50lct3 r-fdch1b r-633pao r-u8s1d r-1v2oles"
                        >
                          <g className="path-parent-g-day-picker">
                            <path d="M3.543 8.96l1.414-1.42L12 14.59l7.043-7.05 1.414 1.42L12 17.41 3.543 8.96z"></path>
                          </g>
                        </svg>
                      </div>
                    </div>
                  </OverlayTrigger>
                  <OverlayTrigger
                    show={showYearPicker}
                    trigger="click"
                    placement="top"
                    overlay={popoverYearContent}
                  >
                    <div
                      ref={yearPickerRef}
                      className="child-div-year-picker-after-overlay-trigger parent-div-year-picker-content-over-flow-y"
                      onClick={handleYearClick}
                      style={{
                        borderRadius: "4px",

                        cursor: "pointer",
                        color: "#536471",
                        flex: "136.75px",
                        padding: "4px",
                        marginLeft: "15px",
                        border: "1px solid rgb(207, 217, 222)",
                        borderWidth: styleOfBoxYear ? "2px" : "1px",
                        borderColor: styleOfBoxYear
                          ? "#1d9bf0                          "
                          : themeName === "dark-theme"
                          ? "rgb(70,70,70)"
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
                          className="main-outline-text-year-picker"
                          style={{
                            color: themeName === "dark-theme" ? "#71767A" : "",
                          }}
                        >
                          Year
                        </div>
                        <div
                          className="mt-2 selected-year-string-parent-div"
                          style={{
                            fontSize: font17.fontSize,
                            lineHeight: font17.lineHeight,
                            color:
                              themeName === "dark-theme" ? "white" : "black",
                          }}
                        >
                          {displayedYear || profile?.birthDate?.year}
                        </div>
                      </div>
                      <div
                        style={{
                          float: "right",
                          position: "relative",
                          top: "30%",
                        }}
                      >
                        <svg
                          width={`${1.5}em`}
                          height={`${1.5}em`}
                          color="rgba(83,100,113,1.00)"
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
                  </OverlayTrigger>
                </div>
                {/* date of birth finish to check  */}

                <div
                  style={{
                    marginTop: "20px",
                  }}
                ></div>

                {/* who can sees this? start to check*/}
                <div>
                  <span
                    style={{
                      fontSize: font15.fontSize,
                      lineHeight: font15.lineHeight,
                    }}
                  >
                    {" "}
                    <span
                      className={
                        themeName === "dark-theme"
                          ? "soft-grey-dark-theme-text-variant-1 chirp-bold-font"
                          : "very-dark-gray-light-theme-text-variant-1 chirp-bold-font"
                      }
                    >
                      Who sees this?
                    </span>{" "}
                  </span>
                </div>
                <div>
                  <span
                    style={{
                      fontSize: font15.fontSize,
                      lineHeight: font15.lineHeight,
                    }}
                  >
                    {" "}
                    <span
                      className={
                        themeName === "dark-theme"
                          ? "soft-grey-dark-theme-text-variant-2 chirp-regular-font"
                          : "very-dark-gray-light-theme-text-variant-2 chirp-regular-font"
                      }
                    >
                      <span>You can control who sees your birthday on C.</span>{" "}
                      <span className="edit-profile-edit-btn">Learn more</span>
                    </span>{" "}
                  </span>
                </div>
                {/* who can sees this? finish to check*/}

                <div
                  style={{
                    marginTop: "20px",
                  }}
                ></div>

                {/* restrictions */}
                <div
                  className="mt-4 chirp-regular-font"
                  style={{
                    width: "100%",
                    height: "58px",
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: font14.fontSize,
                    lineHeight: font14.lineHeight,
                  }}
                >
                  {" "}
                  <OverlayTrigger
                    show={showMonthAndDayRestrictionPicker}
                    trigger="click"
                    placement="top"
                    overlay={popoverContentRestrictionMonthAndDay}
                  >
                    <div
                      ref={restrictionMonthAndDayRef}
                      className="child-div-after-overlay-trigger parent-div-month-content-over-flow-y"
                      onClick={handleRestrictionMonthAndDayClick}
                      style={{
                        borderRadius: "4px",
                        cursor: "pointer",
                        color: "#536471",
                        flex: "255.5px",
                        padding: "4px",
                        border: "1px solid",
                        borderWidth: styleOfRestrictionsMonthAndDayBox
                          ? "2px"
                          : "1px",
                        borderColor: styleOfRestrictionsMonthAndDayBox
                          ? "#1d9bf0                          "
                          : themeName === "dark-theme"
                          ? "rgb(70,70,70)"
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
                          className="main-outline-text"
                          style={{
                            color: themeName === "dark-theme" ? "#71767B" : "",
                          }}
                        >
                          Month and day
                        </div>
                        <div
                          className="mt-2 selected-month-string-parent-div"
                          style={{
                            fontSize: font17.fontSize,
                            lineHeight: font17.lineHeight,
                            color:
                              themeName === "dark-theme" ? "white" : "black",
                          }}
                        >
                          {restrictions.monthAndDay ||
                            selectedRestrictionForMonthAndDay}
                        </div>
                      </div>
                      <div
                        style={{
                          float: "right",
                          position: "relative",
                          top: "30%",
                        }}
                      >
                        <svg
                          width={`${1.5}em`}
                          height={`${1.5}em`}
                          color="rgba(83,100,113,1.00)"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                          className="svg-month-picker r-4qtqp9 r-yyyyoo r-dnmrzs r-1plcrui r-lrvibr r-14j79pv r-1pgswnq r-50lct3 r-fdch1b r-633pao r-u8s1d r-1v2oles"
                        >
                          <g className="path-parent-g">
                            <path d="M3.543 8.96l1.414-1.42L12 14.59l7.043-7.05 1.414 1.42L12 17.41 3.543 8.96z"></path>
                          </g>
                        </svg>
                      </div>
                      {/* dropdown month picker start to check  */}

                      {/* dropdown month picker finish to check  */}
                    </div>
                  </OverlayTrigger>
                </div>
                <div
                  style={{
                    marginTop: "20px",
                  }}
                ></div>
                <div
                  className="mt-4 chirp-regular-font"
                  style={{
                    width: "100%",
                    height: "58px",
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: font14.fontSize,
                    lineHeight: font14.lineHeight,
                  }}
                >
                  {" "}
                  <OverlayTrigger
                    show={showYearRestrictionPicker}
                    trigger="click"
                    placement="top"
                    overlay={popoverContentRestrictionYear}
                  >
                    <div
                      ref={restrictionYearRef}
                      className="child-div-after-overlay-trigger parent-div-month-content-over-flow-y"
                      onClick={handleRestrictionYearClick}
                      style={{
                        borderRadius: "4px",
                        cursor: "pointer",
                        color: "#536471",
                        flex: "255.5px",
                        padding: "4px",
                        border: "1px solid",
                        borderWidth: styleOfRestrictionsYearBox ? "2px" : "1px",
                        borderColor: styleOfRestrictionsYearBox
                          ? "#1d9bf0                          "
                          : themeName === "dark-theme"
                          ? "rgb(70,70,70)"
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
                          className="main-outline-text"
                          style={{
                            color: themeName === "dark-theme" ? "#71767B" : "",
                          }}
                        >
                          Year
                        </div>
                        <div
                          className="mt-2 selected-month-string-parent-div"
                          style={{
                            fontSize: font17.fontSize,
                            lineHeight: font17.lineHeight,
                            color:
                              themeName === "dark-theme" ? "white" : "black",
                          }}
                        >
                          {restrictions.year || selectedRestrictionForYear}
                        </div>
                      </div>
                      <div
                        style={{
                          float: "right",
                          position: "relative",
                          top: "30%",
                        }}
                      >
                        <svg
                          width={`${1.5}em`}
                          height={`${1.5}em`}
                          color="rgba(83,100,113,1.00)"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                          className="svg-month-picker r-4qtqp9 r-yyyyoo r-dnmrzs r-1plcrui r-lrvibr r-14j79pv r-1pgswnq r-50lct3 r-fdch1b r-633pao r-u8s1d r-1v2oles"
                        >
                          <g className="path-parent-g">
                            <path d="M3.543 8.96l1.414-1.42L12 14.59l7.043-7.05 1.414 1.42L12 17.41 3.543 8.96z"></path>
                          </g>
                        </svg>
                      </div>
                      {/* dropdown month picker start to check  */}

                      {/* dropdown month picker finish to check  */}
                    </div>
                  </OverlayTrigger>
                </div>
                <div
                  style={{
                    marginTop: "30px",
                  }}
                ></div>
                {/* remove birthday start to check */}
                <div
                  // onClick={() => {
                  //   openSecondTabDeactivate();
                  // }}
                  className={
                    themeName === "dark-theme"
                      ? "mt-1 chirp-regular-font deactivate-btn-dark-theme"
                      : "mt-1 chirp-regular-font deactivate-btn-light-theme"
                  }
                  style={{
                    color: "#F4212D",
                    textAlign: "center",
                    padding: "16px",
                    cursor: "pointer",
                    fontSize: font15.fontSize,
                    lineHeight: font15.lineHeight,
                  }}
                >
                  Remove birth date
                </div>
                {/* remove birthday finish to check */}
                <div
                  style={{
                    marginTop: "20px",
                  }}
                ></div>
              </div>
            ) : (
              <div
                style={{
                  position: "relative",
                  padding: "0px 12px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  marginBottom: "60px",
                  color: themeName === "dark-theme" ? "white" : "black",
                }}
              >
                <span
                  style={{
                    fontSize: font15.fontSize,
                    lineHeight: font15.lineHeight,
                  }}
                  className="chirp-regular-font"
                >
                  {" "}
                  Birth date &middot;{" "}
                  <span
                    className="edit-profile-edit-btn"
                    onClick={showWarningForEditAge}
                  >
                    Edit
                  </span>
                </span>
                <span
                  style={{
                    fontSize: font20.fontSize,
                    lineHeight: font20.lineHeight,
                    fontWeight: "900",
                  }}
                  className="chirp-regular-font"
                >
                  {profile?.birthDate?.month} {profile?.birthDate?.day},{" "}
                  {profile?.birthDate?.year}
                </span>
              </div>
            )}
          </div>
        </Modal>
      </>
      {/* start to check */}
      {!isPostModalVisible && !dataFromCommentModal && (
        <ResponsiveNavigationBarBottom
          refreshPosts={() => handleShowPostsProfilePage()}
          setLoadingTrue={() => setLoadingTrue()}
          setLoadingFalse={() => setLoadingFalse()}
        />
      )}
      <Col
        xs={12} // 0px - 576px aralığı
        sm={12} // 576px - 768px aralığı
        md={11} // 768px - 992px aralığı
        lg={
          windowWidth <= 1201 && windowWidth >= 992
            ? 7
            : windowWidth > 1201
            ? 5
            : ""
        } // 992px - 1400px aralığı
        xxl={5} // 1400px ve sonrası aralığı
        className={`main-column`}
        style={{
          borderLeft:
            themeName !== "dark-theme"
              ? "1px solid rgba(0, 0, 0, 0.1)"
              : // : "0.1px solid rgb(70, 70, 70)",
                "1px solid rgb(70, 70, 70)",

          borderRight:
            themeName !== "dark-theme"
              ? "1px solid rgba(0, 0, 0, 0.1)"
              : // : "0.1px solid rgb(70, 70, 70)",
                "1px solid rgb(70, 70, 70)",
          borderTop: "none ",
          borderBottom: "none",
          padding: "0px",
          position: "relative",
        }}
      >
        <Stack
          style={{
            padding: "0px 16px",
            minHeight: "53px",
            transform: width <= 500 && `translateY(${headerPosition}px)`,
            transition:
              width <= 500 && "transform 0.3s cubic-bezier(0, 0, 0, 1)",
            position: width > 500 && "sticky",
            top: width > 500 && "0px",
            width: width > 500 && "100%",
            backgroundColor:
              width > 500 && themeName === "dark-theme"
                ? "rgba(0, 0, 0, 0.65)"
                : width > 500 && themeName === "dark-theme"
                ? "rgba(255, 255, 255, 0.85)"
                : null,
            backdropFilter: width > 500 && "blur(12px)",
            zIndex: width > 500 && 1,
          }}
          direction="horizontal"
          gap={0}
        >
          {/* start to check  */}

          <div
            onClick={handleGoBack}
            // className="p-2 arrow"
            className={`p-2 arrow arrow-${themeName}`}
            style={{
              width: "36px",
              height: " 36px",
              borderRadius: "50%",
              cursor: "pointer",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <svg
              color={themeName === "dark-theme" ? "white" : ""}
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
          </div>

          <div
            className={
              themeName === "dark-theme"
                ? "soft-grey-dark-theme-text-variant-1 p-2 chirp-bold-font"
                : "very-dark-gray-light-theme-text-variant-1 p-2 chirp-bold-font"
            }
            style={{
              fontSize: font20.fontSize,
              lineHeight: font20.lineHeight,
            }}
          >
            <div
              style={{
                display: "flex",
                gap: ".2rem",
                alignItems: "center",
              }}
            >
              <div
                className="chirp-bold-font"
                style={{
                  lineHeight: width <= 500 ? "20px" : "24px",
                  fontSize: width <= 500 ? "17px" : "20px",
                }}
              >
                {userInfo.fullname}
              </div>

              <div>
                {" "}
                {userInfo.hasSubscription ||
                (!subscription?.isActive &&
                  subscription?.remainingTimeSubscription &&
                  subscription?.cancelledDate) ? (
                  <span>
                    {/* start to check  */}{" "}
                    <span className="css-1qaijid r-bcqeeo r-qvutc0 r-poiln3 r-1awozwy r-xoduu5">
                      <svg
                        width={`${20}px`}
                        height={`${20}px`}
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
                ) : (
                  <span> </span>
                )}
              </div>
            </div>

            {userInfo.posts && (
              <div
                style={{
                  color:
                    themeName === "dark-theme"
                      ? "#71767A"
                      : "rgb(83, 100, 113)",
                  fontSize: font13.fontSize,
                  lineHeight: font13.lineHeight,
                }}
                className="profile-paragraph chirp-regular-font"
              >
                {userInfo.posts.length} posts
              </div>
            )}
          </div>
          {/* finish to check  */}
        </Stack>

        {/* start to check */}

        <div
          style={{
            backgroundColor:
              themeName === "light-theme" ? "rgb(207, 217, 222)" : "",
            height: "200px",
            position: "relative",
            backgroundImage: `url("https://marketplace.canva.com/EAE91Kz0wsI/1/0/1600w/canva-blue-yellow-retro-quotes-twitter-header-xTB_BZnqeew.jpg")`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            backgroundSize: "cover",
            backgroundAttachment: "fixed",
          }}
        >
          <div
            style={{
              padding: "12px 16px",
              position: "absolute",
              bottom: -80,
            }}
          >
            {userInfo.imageUrl?.slice(0, 3) !== "../" ? (
              <>
                {profileImageChangingLoadingBar ? (
                  <>
                    <div
                      style={{
                        position: "relative",
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          bottom: "0px",
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <LoadingSpinner
                          strokeColor={"rgb(29, 155, 240)"}
                        ></LoadingSpinner>
                      </div>
                      <img
                        style={{
                          visibility: "hidden",
                        }}
                        src={userInfo.imageUrl}
                        alt=""
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <img
                        width={133}
                        height={133}
                        style={{
                          cursor: "pointer",
                          borderRadius: "50%",
                          border:
                            themeName === "dark-theme"
                              ? "4px solid black"
                              : "4px solid white",
                        }}
                        src={userInfo.imageUrl}
                        alt=""
                        onClick={() =>
                          document
                            .getElementById("formuploadModal-profile-image")
                            .click()
                        }
                      />
                      <input
                        onChange={handleChangeProfileImage}
                        type="file"
                        id="formuploadModal-profile-image"
                        name="modalImage"
                        className="form-control"
                        style={{ display: "none" }}
                      />
                    </div>
                  </>
                )}
              </>
            ) : (
              <div>
                <img
                  onClick={() =>
                    document.getElementById("formuploadModal").click()
                  }
                  style={{
                    cursor: "pointer",
                    borderRadius: "50%",
                    border:
                      themeName === "dark-theme"
                        ? "4px solid black"
                        : "4px solid white",
                    cursor: "pointer",
                  }}
                  width="133"
                  height="133"
                  src="https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png"
                  alt=""
                />
                <input
                  onChange={handleChangeProfileImage}
                  type="file"
                  id="formuploadModal"
                  name="modalImage"
                  className="form-control"
                  style={{ display: "none" }}
                />
              </div>
            )}
          </div>
        </div>

        {/* edit profile btn */}
        <div
          className="chirp-bold-font"
          style={{
            padding: "12px 12px",
            textAlign: "right",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <button
            onClick={showEditModal}
            className={`edit-profile-btn ${themeName}`}
            style={{
              borderRadius: "9999px",
              border:
                themeName !== "dark-theme"
                  ? "1px solid rgba(0, 0, 0, 0.1)"
                  : // : "0.1px solid rgb(70, 70, 70)",
                    "1px solid rgb(70, 70, 70)",
              backgroundColor: "transparent",
              minHeight: "36px",
              minWidth: "36px",
              outlineStyle: "none",
              cursor: "pointer",
              transitionDuration: "0.2s",
              fontSize: font15.fontSize,
              lineHeight: font15.lineHeight,
            }}
          >
            <span
              style={{
                padding: "0px 16px",
              }}
            >
              Edit profile
            </span>
          </button>
        </div>

        {/* finish to check */}
        <div
          style={{
            lineHeight: "30px",
            marginBottom: "20px",
            padding: "0px 16px",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: ".2rem",
              alignItems: "center",
              marginTop: "30px",
            }}
          >
            <div
              style={{
                fontSize: font20.fontSize,
                lineHeight: font20.lineHeight,
              }}
              className={
                themeName === "dark-theme"
                  ? "soft-grey-dark-theme-text-variant-1 chirp-heavy-font"
                  : "very-dark-gray-light-theme-text-variant-1 chirp-heavy-font"
              }
            >
              {userInfo.fullname}
            </div>

            <div>
              {" "}
              {userInfo.hasSubscription ||
              (!subscription?.isActive &&
                subscription?.remainingTimeSubscription &&
                subscription?.cancelledDate) ? (
                <span>
                  {/* start to check  */}{" "}
                  <span className="css-1qaijid r-bcqeeo r-qvutc0 r-poiln3 r-1awozwy r-xoduu5">
                    <svg
                      width={`${20}px`}
                      height={`${20}px`}
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
              ) : (
                <span> </span>
              )}
            </div>
          </div>
          <div
            style={{
              fontSize: font15.fontSize,
              lineHeight: font15.lineHeight,
            }}
            className={
              themeName === "dark-theme"
                ? "soft-grey-dark-theme-text-variant-2 chirp-regular-font"
                : "very-dark-gray-light-theme-text-variant-2 chirp-regular-font"
            }
          >
            @{userInfo.username}
          </div>

          {profile?.automated_account ? (
            <div
              style={{
                marginBottom: "20px",
                marginTop: "10px",
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
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                }}
              >
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  color={
                    themeName === "dark-theme" ? "#71767A" : "rgb(83, 100, 113)"
                  }
                  fill="currentColor"
                  width={`${1.25}em`}
                  height={`${1.25}em`}
                >
                  <g>
                    <path d="M.998 15V9h2v6h-2zm22 0V9h-2v6h2zM12 2c-4.418 0-8 3.58-8 8v7c0 2.76 2.239 5 5 5h6c2.761 0 5-2.24 5-5v-7c0-4.42-3.582-8-8-8zM8.998 14c-1.105 0-2-.9-2-2s.895-2 2-2 2 .9 2 2-.895 2-2 2zm6 0c-1.104 0-2-.9-2-2s.895-2 2-2 2 .9 2 2-.896 2-2 2z"></path>
                  </g>
                </svg>

                <div
                  style={{
                    fontSize: font15.fontSize,
                    lineHeight: font15.lineHeight,
                  }}
                >
                  <span>Automated by</span>{" "}
                  <span
                    onClick={() =>
                      navigate(`/profile/${profile.automated_account._id}`)
                    }
                    className="edit-profile-edit-btn"
                  >
                    @{profile.automated_account.username}
                  </span>
                </div>
              </div>
            </div>
          ) : null}

          {profile?.bio ? (
            <div
              className="unica-regular-font"
              style={{ marginTop: "10px", marginBottom: "10px" }}
            >
              <div
                style={{
                  fontSize: font15.fontSize,
                  lineHeight: font15.lineHeight,
                }}
              >
                {profile.bio}
              </div>
              <div
                style={{
                  fontSize: font13.fontSize,
                  lineHeight: font13.lineHeight,
                  display: "inline",
                  padding: 0,
                  margin: 0,
                }}
                className="edit-profile-edit-btn"
              >
                Translate bio
              </div>
            </div>
          ) : null}

          <div
            className="mt-2 chirp-regular-font"
            style={{
              display: "flex",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >
            {profile?.location ? (
              <div
                className="chirp-regular-font"
                style={{
                  color:
                    themeName === "dark-theme"
                      ? "#71767A"
                      : "rgb(83, 100, 113)",
                  fontSize: font15.fontSize,
                  lineHeight: font15.lineHeight,
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                }}
              >
                <svg
                  color={
                    themeName === "dark-theme" ? "#71767A" : "rgb(83, 100, 113)"
                  }
                  fill="currentColor"
                  width={`${1.25}em`}
                  height={`${1.25}em`}
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <g>
                    <path d="M12 7c-1.93 0-3.5 1.57-3.5 3.5S10.07 14 12 14s3.5-1.57 3.5-3.5S13.93 7 12 7zm0 5c-.827 0-1.5-.673-1.5-1.5S11.173 9 12 9s1.5.673 1.5 1.5S12.827 12 12 12zm0-10c-4.687 0-8.5 3.813-8.5 8.5 0 5.967 7.621 11.116 7.945 11.332l.555.37.555-.37c.324-.216 7.945-5.365 7.945-11.332C20.5 5.813 16.687 2 12 2zm0 17.77c-1.665-1.241-6.5-5.196-6.5-9.27C5.5 6.916 8.416 4 12 4s6.5 2.916 6.5 6.5c0 4.073-4.835 8.028-6.5 9.27z"></path>
                  </g>
                </svg>

                <span
                  style={{
                    fontSize: font15.fontSize,
                    lineHeight: font15.lineHeight,
                  }}
                >
                  {profile.location}
                </span>
              </div>
            ) : null}
            {profile?.webSite ? (
              <div
                className="chirp-regular-font"
                style={{
                  color:
                    themeName === "dark-theme"
                      ? "#71767A"
                      : "rgb(83, 100, 113)",
                  fontSize: font15.fontSize,
                  lineHeight: font15.lineHeight,
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                }}
              >
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  color={
                    themeName === "dark-theme" ? "#71767A" : "rgb(83, 100, 113)"
                  }
                  fill="currentColor"
                  width={`${1.25}em`}
                  height={`${1.25}em`}
                >
                  <g>
                    <path d="M18.36 5.64c-1.95-1.96-5.11-1.96-7.07 0L9.88 7.05 8.46 5.64l1.42-1.42c2.73-2.73 7.16-2.73 9.9 0 2.73 2.74 2.73 7.17 0 9.9l-1.42 1.42-1.41-1.42 1.41-1.41c1.96-1.96 1.96-5.12 0-7.07zm-2.12 3.53l-7.07 7.07-1.41-1.41 7.07-7.07 1.41 1.41zm-12.02.71l1.42-1.42 1.41 1.42-1.41 1.41c-1.96 1.96-1.96 5.12 0 7.07 1.95 1.96 5.11 1.96 7.07 0l1.41-1.41 1.42 1.41-1.42 1.42c-2.73 2.73-7.16 2.73-9.9 0-2.73-2.74-2.73-7.17 0-9.9z"></path>
                  </g>
                </svg>

                <a
                  style={{
                    textDecoration: "none",
                    fontSize: font15.fontSize,
                    lineHeight: font15.lineHeight,
                  }}
                  href={profile.webSite}
                  target="_blank"
                  className="edit-profile-edit-btn"
                >
                  {profile.webSite}
                </a>
              </div>
            ) : null}
            {profile?.birthDate ? (
              <>
                <div
                  className="chirp-regular-font"
                  style={{
                    color:
                      themeName === "dark-theme"
                        ? "#71767A"
                        : "rgb(83, 100, 113)",
                    fontSize: font15.fontSize,
                    lineHeight: font15.lineHeight,
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                  }}
                >
                  <svg
                    color={
                      themeName === "dark-theme"
                        ? "#71767A"
                        : "rgb(83, 100, 113)"
                    }
                    fill="currentColor"
                    width={`${1.25}em`}
                    height={`${1.25}em`}
                    viewBox="0 0 24 24"
                  >
                    <g>
                      <path d="M8 10c0-2.21 1.79-4 4-4v2c-1.1 0-2 .9-2 2H8zm12 1c0 4.27-2.69 8.01-6.44 8.83L15 22H9l1.45-2.17C6.7 19.01 4 15.27 4 11c0-4.84 3.46-9 8-9s8 4.16 8 9zm-8 7c3.19 0 6-3 6-7s-2.81-7-6-7-6 3-6 7 2.81 7 6 7z"></path>
                    </g>
                  </svg>

                  <div
                    style={{
                      textDecoration: "none",
                      fontSize: font15.fontSize,
                      lineHeight: font15.lineHeight,
                      display: "flex",
                      gap: "5px",
                      padding: 0,
                      margin: 0,
                    }}
                  >
                    <div>Born</div>
                    <div>{profile.birthDate.month}</div>
                    <div>{profile.birthDate.day},</div>
                    <div>{profile.birthDate.year}</div>
                  </div>
                </div>
              </>
            ) : null}
            <div
              className="chirp-regular-font"
              style={{
                color:
                  themeName === "dark-theme" ? "#71767A" : "rgb(83, 100, 113)",
                fontSize: font15.fontSize,
                lineHeight: font15.lineHeight,
                display: "flex",
                alignItems: "center",
                gap: "5px",
              }}
            >
              <svg
                color={
                  themeName === "dark-theme" ? "#71767A" : "rgb(83, 100, 113)"
                }
                fill="currentColor"
                width={`${1.25}em`}
                height={`${1.25}em`}
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-14j79pv r-1d4mawv"
              >
                <g>
                  <path d="M7 4V3h2v1h6V3h2v1h1.5C19.89 4 21 5.12 21 6.5v12c0 1.38-1.11 2.5-2.5 2.5h-13C4.12 21 3 19.88 3 18.5v-12C3 5.12 4.12 4 5.5 4H7zm0 2H5.5c-.27 0-.5.22-.5.5v12c0 .28.23.5.5.5h13c.28 0 .5-.22.5-.5v-12c0-.28-.22-.5-.5-.5H17v1h-2V6H9v1H7V6zm0 6h2v-2H7v2zm0 4h2v-2H7v2zm4-4h2v-2h-2v2zm0 4h2v-2h-2v2zm4-4h2v-2h-2v2z"></path>
                </g>
              </svg>

              <span>Joined {getCreatedDateForProfile(userInfo.createdAt)}</span>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: "3%",
              marginTop: "5px",
            }}
          >
            {/* following and followers details start to check  */}
            <Link
              to={`/profile/${userInfo._id}/following`}
              style={{
                textDecoration: "none",
                color: themeName === "dark-theme" ? "white" : "black",
              }}
              className="following-followers-link"
            >
              <span>
                {profile?.following?.length ? (
                  <span
                    className="chirp-bold-font"
                    style={{
                      cursor: "pointer",
                      fontSize: font14.fontSize,
                      lineHeight: font14.lineHeight,
                    }}
                  >
                    {profile?.following?.length}
                  </span>
                ) : (
                  <span
                    className="chirp-bold-font"
                    style={{
                      cursor: "pointer",
                      fontSize: font14.fontSize,
                      lineHeight: font14.lineHeight,
                    }}
                  >
                    0
                  </span>
                )}
              </span>{" "}
              <span
                className="chirp-regular-font"
                style={{
                  cursor: "pointer",
                  color:
                    themeName === "dark-theme"
                      ? "#71767A"
                      : "rgb(83, 100, 113)",
                  fontSize: font14.fontSize,
                  lineHeight: font14.lineHeight,
                }}
              >
                Following
              </span>{" "}
            </Link>
            <Link
              to={`/profile/${userInfo._id}/followers`}
              className="following-followers-link"
              style={{
                textDecoration: "none",
                color: themeName === "dark-theme" ? "white" : "black",
              }}
            >
              <span>
                {profile?.followers?.length ? (
                  <span
                    className="chirp-bold-font"
                    style={{
                      cursor: "pointer",
                      fontSize: font14.fontSize,
                      lineHeight: font14.lineHeight,
                    }}
                  >
                    {profile?.followers?.length}
                  </span>
                ) : (
                  <span
                    className="chirp-bold-font"
                    style={{
                      cursor: "pointer",
                      fontSize: font14.fontSize,
                      lineHeight: font14.lineHeight,
                    }}
                  >
                    0
                  </span>
                )}
              </span>{" "}
              <span
                className="chirp-regular-font"
                style={{
                  cursor: "pointer",
                  color:
                    themeName === "dark-theme"
                      ? "#71767A"
                      : "rgb(83, 100, 113)",
                  fontSize: font14.fontSize,
                  lineHeight: font14.lineHeight,
                }}
              >
                <span>
                  {userInfo.followers
                    ? userInfo.followers.length > 1
                      ? "Followers"
                      : userInfo.followers.length === 0
                      ? "Followers"
                      : "Follower"
                    : null}
                </span>
              </span>
            </Link>
            {/* following and followers details finish to check  */}
          </div>
        </div>

        <div
          style={{
            display: "flex",
          }}
        >
          <span
            className={
              themeName === "dark-theme"
                ? "hover-effect-dark-theme-pointer-plus chirp-bold-font"
                : themeName !== "dark-theme"
                ? "hover-effect-light-theme-pointer-plus"
                : null
            }
            onMouseEnter={() => handleHover("posts")}
            onMouseLeave={handleLeave}
            onClick={() => handleShowPostsProfilePage()}
            style={{
              color:
                activeTab === "posts" && themeName !== "dark-theme"
                  ? "#0f141a"
                  : activeTab === "posts" && themeName === "dark-theme"
                  ? "#e6e9ea"
                  : themeName === "dark-theme"
                  ? "#71767A"
                  : "#526371",
              fontWeight: activeTab === "posts" ? "700" : "500",
              fontSize: font15.fontSize,
              lineHeight: font15.lineHeight,
              cursor: "pointer",
              flex: 1,
              textAlign: "center",
              transition: "background 0.3s",
              maxHeight: "inherit",
            }}
          >
            {/* { color: #e6e9ea !important; }  { color: #0f141a !important; } */}
            <div
              style={{
                display: "inline-flex",
                padding: "16px 0px 16px 0px",
                flexDirection: "column",
                position: "relative",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <span
                className={
                  themeName === "dark-theme" && activeTab === "posts"
                    ? "soft-grey-dark-theme-text-variant-1 chirp-bold-font"
                    : themeName !== "dark-theme" && activeTab === "posts"
                    ? "very-dark-gray-light-theme-text-variant-1 chirp-bold-font"
                    : themeName === "dark-theme" && activeTab !== "posts"
                    ? "soft-grey-dark-theme-text-variant-2 chirp-regular-font"
                    : themeName !== "dark-theme" && activeTab !== "posts"
                    ? "very-dark-gray-light-theme-text-variant-2 chirp-regular-font"
                    : null
                }
              >
                Posts
              </span>
              {activeTab === "posts" && (
                <div
                  style={{
                    backgroundColor: "rgb(29, 155, 240)",
                    height: "4px",
                    width: "100%",
                    minWidth: "56px",
                    position: "absolute",
                    bottom: "0px",
                    borderRadius: "9999px",
                  }}
                ></div>
              )}
            </div>
          </span>

          <span
            className={
              themeName === "dark-theme"
                ? "hover-effect-dark-theme-pointer-plus "
                : themeName !== "dark-theme"
                ? "hover-effect-light-theme-pointer-plus "
                : null
            }
            onMouseEnter={() => handleHover("likes")}
            onMouseLeave={handleLeave}
            onClick={() => handleGetFavorites()}
            style={{
              color:
                activeTab === "likes" && themeName !== "dark-theme"
                  ? "#0f141a"
                  : activeTab === "likes" && themeName === "dark-theme"
                  ? "#e6e9ea"
                  : themeName === "dark-theme"
                  ? "#71767A"
                  : "#526371",
              fontWeight: activeTab === "likes" ? "700" : "500",
              fontSize: font15.fontSize,
              lineHeight: font15.lineHeight,
              cursor: "pointer",
              flex: 1,
              textAlign: "center",
              transition: "background 0.3s",
            }}
          >
            <div
              style={{
                display: "inline-flex",
                padding: "16px 0px 16px 0px",
                flexDirection: "column",
                position: "relative",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <span
                className={
                  themeName === "dark-theme" && activeTab === "likes"
                    ? "soft-grey-dark-theme-text-variant-1 chirp-bold-font"
                    : themeName !== "dark-theme" && activeTab === "likes"
                    ? "very-dark-gray-light-theme-text-variant-1 chirp-bold-font"
                    : themeName === "dark-theme" && activeTab !== "likes"
                    ? "soft-grey-dark-theme-text-variant-2 chirp-regular-font"
                    : themeName !== "dark-theme" && activeTab !== "likes"
                    ? "very-dark-gray-light-theme-text-variant-2 chirp-regular-font"
                    : null
                }
              >
                Likes
              </span>{" "}
              {activeTab === "likes" && (
                <div
                  style={{
                    backgroundColor: "rgb(29, 155, 240)",
                    height: "4px",
                    width: "100%",
                    minWidth: "56px",
                    position: "absolute",
                    bottom: "0px",
                    borderRadius: "9999px",
                  }}
                ></div>
              )}
            </div>
          </span>
        </div>

        {postsWindow || favoriteWindow ? (
          <div
            style={{
              borderBottom:
                themeName !== "dark-theme"
                  ? "1px solid rgba(0, 0, 0, 0.1)"
                  : // : "0.1px solid rgb(70, 70, 70)",
                    "1px solid rgb(70, 70, 70)",
            }}
          ></div>
        ) : null}

        <span>
          {isLoading && favoriteWindow === "hide" ? (
            <LoadingSpinner strokeColor={"rgb(29, 155, 240)"}></LoadingSpinner>
          ) : (
            ""
          )}
        </span>
        {/* mainpage yani home rotasına tüm twitlerin gösterileceği column burası !  */}

        <div
          style={{
            height: width <= 700 && userprofiledata.length < 2 ? "30vh" : "",
          }}
          className={`all-posts ${postsWindow}`}
        >
          {pinnedPost ? (
            <div
              onClick={() => {
                console.log("Post box parent class =>", post);
                setclickedPostBox(pinnedPost);
              }}
              className={
                themeName === "dark-theme"
                  ? `each-post-${themeName}`
                  : "each-post"
              }
              key={pinnedPost._id}
            >
              {/* start to check */}
              <div
                style={{
                  textDecoration: "none",
                }}
                onClick={() => {
                  setclickedPostBox(pinnedPost);
                }}
                className="posts-details outside-of-inner-circle-actions"
              >
                {/* pinned banner */}
                <div
                  style={{
                    cursor: "pointer",
                  }}
                  className="post-head"
                >
                  <svg
                    style={{
                      marginLeft: "10px",
                      position: "relative",
                      top: "5px",
                      left: "20px",
                    }}
                    width={16}
                    height={16}
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    fill={
                      themeName === "dark-theme"
                        ? "#71767A"
                        : "rgb(83, 100, 113)"
                    }
                  >
                    <g>
                      <path d="M7 4.5C7 3.12 8.12 2 9.5 2h5C15.88 2 17 3.12 17 4.5v5.26L20.12 16H13v5l-1 2-1-2v-5H3.88L7 9.76V4.5z"></path>
                    </g>
                  </svg>
                  <Link
                    className={`hover-reposted-text hover-reposted-text-${themeName} chirp-bold-font`}
                    style={{
                      fontSize: font13.fontSize,
                      lineHeight: font13.lineHeight,
                      color:
                        themeName === "dark-theme"
                          ? "#71767A"
                          : "rgb(83, 100, 113)",
                      marginLeft: "10px",
                      cursor: "pointer",
                      textDecoration: "none",
                      position: "relative",
                      top: "5px",
                      left: "15px",
                    }}
                    onClick={() => setclickedPostBox(pinnedPost)}
                    to={`/profile/${pinnedPost}`}
                  >
                    Pinned
                  </Link>
                </div>
                <Stack
                  style={{
                    cursor: "pointer",
                  }}
                  to={`/${pinnedPost?.userId?.userName}/status/${
                    !pinnedPost.isReposted
                      ? pinnedPost._id
                      : pinnedPost.repostedFromThisOriginalPost[0]?._id
                  }`}
                  onClick={() => setclickedPostBox(pinnedPost)}
                  className="outside-of-inner-circle-post-info-user-info-svg-three-dots"
                  direction="horizontal"
                  gap={1}
                >
                  {/* profile image start to check */}
                  <div className="p-1">
                    {pinnedPost?.userId?.imageUrl.slice(0, 3) !== "../" ? (
                      <Link
                        className="post-circle-profile-image-on-point"
                        style={{ cursor: "pointer" }}
                        to={`/profile/${
                          pinnedPost ? pinnedPost?.userId?._id : null
                        }`}
                      >
                        <img
                          width={40}
                          height={40}
                          src={pinnedPost?.userId?.imageUrl}
                          alt=""
                          style={{
                            borderRadius: "50%",
                          }}
                        />
                      </Link>
                    ) : (
                      <Link
                        className="post-circle-profile-svg-on-point"
                        to={`/profile/${
                          pinnedPost.userId ? pinnedPost.userId._id : null
                        }`}
                        style={{ cursor: "pointer" }}
                      >
                        {" "}
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
                    )}
                  </div>
                  {/* profile image finish to check  */}

                  {/* post owner full name + verified account svg + post owner user name + post created date start to check  */}
                  <div className="p-1">
                    {pinnedPost.userId ? (
                      <div>
                        <Link
                          className="post-circle-postowner-fullname"
                          to={`/profile/${pinnedPost.userId._id}`}
                          style={{
                            textDecoration: "none",
                            color: "black",
                          }}
                        >
                          <span
                            className="hover-fullname chirp-bold-font"
                            style={{
                              fontSize: font15.fontSize,
                              lineHeight: font15.lineHeight,
                              color: themeName === "dark-theme" ? "white" : "",
                            }}
                          >
                            {pinnedPost.authorFullName}
                          </span>
                        </Link>{" "}
                        {pinnedPost?.userId.isPrivate && (
                          <span>
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
                        {pinnedPost?.userId.hasSubscription ||
                        (!subscription?.isActive &&
                          subscription?.remainingTimeSubscription &&
                          subscription?.cancelledDate &&
                          subscription?.owner === pinnedPost?.userId._id) ||
                        remainingTimeSubscriptionsOwnerIds.includes(
                          pinnedPost?.userId._id
                        ) ? (
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
                        ) : (
                          <span> </span>
                        )}
                        <Link
                          className="chirp-regular-font"
                          to={`/profile/${pinnedPost.userId._id}`}
                          style={{
                            textDecoration: "none",
                            color:
                              themeName === "dark-theme"
                                ? "#71767A"
                                : "rgb(83, 100, 113)",
                            fontSize: font15.fontSize,
                            lineHeight: font15.lineHeight,
                          }}
                        >
                          <span className="chirp-regular-font">
                            <span>@{pinnedPost.authorUserName}</span>
                          </span>
                        </Link>
                        <Link
                          style={{
                            textDecoration: "none",
                          }}
                          to={`/${pinnedPost.userId.username}/status/${
                            !pinnedPost.isReposted
                              ? pinnedPost._id
                              : pinnedPost.repostedFromThisOriginalPost[0]?._id
                          }`}
                        >
                          <span
                            className="post-circle-date-post-detail chirp-regular-font"
                            style={{
                              color:
                                themeName === "dark-theme"
                                  ? "#71767A"
                                  : "rgb(83, 100, 113)",
                              fontSize: font15.fontSize,
                              lineHeight: font15.lineHeight,
                            }}
                          >
                            {" "}
                            ·{" "}
                            <BootstrapTooltip
                              title={extraDetailedDate(pinnedPost.createdAt)}
                              themeName={
                                themeName === "dark-theme"
                                  ? "dark-theme"
                                  : "light-theme"
                              }
                            >
                              <span className="date-post-detail chirp-regular-font">
                                {getCreatedDate(pinnedPost.createdAt)}
                              </span>
                            </BootstrapTooltip>
                          </span>
                        </Link>
                        {/* finish to check  */}
                      </div>
                    ) : null}
                  </div>
                  {/* post owner full name + verified account svg + post owner user name + post created date  finish to check  */}

                  {/* three dots svg start to check */}
                  <div className="p-1 ms-auto">
                    <PostPopover
                      isPinnedPost={true}
                      post={pinnedPost}
                      refreshPosts={handleShowPostsProfilePage}
                    />
                  </div>
                  {/* three dots svg finish to check */}
                </Stack>

                {/* post content start to check  */}
                <Stack
                  to={`/${pinnedPost.authorUserName}/status/${
                    !pinnedPost.isReposted
                      ? pinnedPost._id
                      : pinnedPost.repostedFromThisOriginalPost[0]?._id
                  }`}
                  onClick={() => setclickedPostBox(pinnedPost)}
                  className="outside-of-inner-circle-action-comment-text"
                  direction="vertical"
                  gap={1}
                >
                  {pinnedPost.isComment ? (
                    <div
                      to={`/${pinnedPost.userId.username}/status/${
                        !pinnedPost.isReposted
                          ? pinnedPost._id
                          : pinnedPost.repostedFromThisOriginalPost[0]?._id
                      }`}
                      onClick={() => setclickedPostBox(pinnedPost)}
                      className="p-2 parent-comment-text"
                    >
                      <span
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
                        Replying to {""}
                      </span>
                      <Link
                        to={`/profile/${pinnedPost.commentedForThisUsersPost._id}`}
                        style={{
                          textDecoration: "none",
                        }}
                      >
                        <span
                          className="replying-to-text chirp-regular-font"
                          style={{
                            color: "rgb(29, 155, 240)",
                            cursor: "pointer",
                            fontSize: font15.fontSize,
                            lineHeight: font15.lineHeight,
                          }}
                        >
                          @{pinnedPost.commentedForThisUsersPost.username}
                        </span>
                      </Link>
                    </div>
                  ) : null}

                  <Link
                    to={`/${pinnedPost.authorUserName}/status/${
                      !pinnedPost.isReposted
                        ? pinnedPost._id
                        : pinnedPost.repostedFromThisOriginalPost[0]?._id
                    }`}
                    style={{
                      textDecoration: "none",
                      color: "rgb(15, 20, 25)",
                    }}
                  >
                    <div
                      className="p-2 chirp-regular-font"
                      style={{
                        fontSize: font15.fontSize,
                        lineHeight: font15.lineHeight,
                        overflowWrap: "break-word",
                        maxWidth: "100%",
                        cursor: "pointer",
                        color: themeName === "dark-theme" ? "white" : "",
                      }}
                    >
                      {pinnedPost.content}
                    </div>
                  </Link>
                </Stack>
                {/* post content finish to check  */}
                {/* start to check NOTE if there is no internet connection images would be hidden because of 'cloudinary connection' */}
                {pinnedPost?.image?.url !== "image@url" ? (
                  <>
                    <Link
                      to={`/${pinnedPost?.userId?.username}/status/${
                        !pinnedPost.isReposted
                          ? pinnedPost._id
                          : pinnedPost?.repostedFromThisOriginalPost[0]
                      }/photo/${1}`}
                      style={{
                        textDecoration: "none",
                      }}
                    >
                      <div
                        style={{
                          overflow: "hidden",
                          borderRadius: "8px",
                          padding: "12px",
                        }}
                      >
                        <img
                          src={pinnedPost?.image?.url}
                          alt="Description"
                          style={{
                            width: "100%",
                            maxWidth: "100%",
                            display: "block",
                            borderRadius: "16px",
                          }}
                        />
                      </div>
                    </Link>
                  </>
                ) : null}
                {/* finish to check NOTE if there is no internet connection images would be hidden because of 'cloudinary connection' */}
                {/* new version favorite repost comment start to check */}
                <Stack
                  className="mt-0"
                  direction="horizontal"
                  style={{
                    justifyContent: "space-between",
                    margin: "5px 0px 5px 0px",
                  }}
                >
                  <div
                    style={{
                      width: "100px",
                    }}
                    onClick={() => setclickedPostBox(pinnedPost)}
                    className="p-1 next-to-comment"
                  >
                    <CommentModal
                      post={pinnedPost}
                      width={`${1.25}em`}
                      height={`${1.25}em`}
                      refreshPosts={handleShowPostsProfilePage}
                      sendDataToParent={handleDataFromCommentModal}
                      postSharedMessage={postSharedMessage}
                    />
                  </div>

                  {/* start to check */}
                  <div
                    style={{
                      width: "100px",
                    }}
                    className="p-1"
                  >
                    <RepostAction
                      post={pinnedPost ? pinnedPost : null}
                      width={`${1.25}em`}
                      height={`${1.25}em`}
                      refreshPosts={handleShowPostsProfilePage}
                      setLoadingFalse={setLoadingFalse}
                      setLoadingTrue={setLoadingTrue}
                    />
                    {/* start  */}
                  </div>

                  {/* finish to check  */}
                  <div
                    style={{
                      width: "100px",
                    }}
                    className="p-1"
                  >
                    <LikeAction
                      post={pinnedPost || null}
                      width={`${1.25}em`}
                      height={`${1.25}em`}
                      refreshPosts={handleShowPostsProfilePage}
                      setLoadingFalse={setLoadingFalse}
                      setLoadingTrue={setLoadingTrue}
                    />
                  </div>
                  <div
                    style={{
                      width: "100px",
                    }}
                    className="p-1"
                  >
                    <BookmarkAction
                      post={pinnedPost || null}
                      width={`${1.25}em`}
                      height={`${1.25}em`}
                      refreshPosts={handleShowPostsProfilePage}
                      setLoadingFalse={setLoadingFalse}
                      setLoadingTrue={setLoadingTrue}
                    />
                  </div>
                </Stack>
                {/* new version favorite repost comment finish to check */}
              </div>
              {/* finish to check */}

              <div
                onClick={() => {
                  console.log("Post box child class =>", pinnedPost);
                  setclickedPostBox(pinnedPost);
                }}
                className="border-extra"
                style={{
                  borderBottom:
                    themeName !== "dark-theme"
                      ? "1px solid rgba(0, 0, 0, 0.1)"
                      : // : "0.1px solid rgb(70, 70, 70)",
                        "1px solid rgb(70, 70, 70)",
                }}
              ></div>
            </div>
          ) : null}
          {userprofiledata.length ? (
            <>
              {userprofiledata.slice(0, visibleTweets).map((post, index) => (
                <div
                  onClick={() => {
                    console.log("Post box parent class =>", post);
                    setclickedPostBox(post);
                  }}
                  className={
                    themeName === "dark-theme"
                      ? `each-post-${themeName}`
                      : "each-post"
                  }
                  key={post._id}
                >
                  {post.deactivatedOwner ||
                  post.pinned ||
                  (post.userId.isPrivate &&
                    !checkIfFollowing(post.userId._id) &&
                    userInfo._id !== post.userId._id) ? null : (
                    <>
                      <div
                        style={{
                          textDecoration: "none",
                        }}
                        onClick={() => {
                          setclickedPostBox(post);
                        }}
                        className="posts-details outside-of-inner-circle-actions"
                      >
                        {" "}
                        <div
                          style={{
                            cursor: "pointer",
                          }}
                          className="post-head"
                        >
                          {getRepostedIds(post).includes(userInfo._id) &&
                          post.isReposted ? (
                            <>
                              <svg
                                style={{
                                  marginLeft: "10px",
                                  position: "relative",
                                  top: "5px",
                                  left: "20px",
                                }}
                                width={16}
                                height={16}
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                                className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-1xvli5t r-1hdv0qi"
                                fill={
                                  themeName === "dark-theme"
                                    ? "#71767A"
                                    : "rgb(83, 100, 113)"
                                }
                              >
                                <g>
                                  <path
                                    stroke="rgb(83, 100, 113)"
                                    strokeWidth="0.1"
                                    d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z"
                                  ></path>
                                </g>
                              </svg>
                              <Link
                                className={`hover-reposted-text hover-reposted-text-${themeName} chirp-bold-font`}
                                style={{
                                  fontSize: font13.fontSize,
                                  lineHeight: font13.lineHeight,
                                  color:
                                    themeName === "dark-theme"
                                      ? "#71767A"
                                      : "rgb(83, 100, 113)",
                                  marginLeft: "10px",
                                  cursor: "pointer",
                                  textDecoration: "none",
                                  position: "relative",
                                  top: "5px",
                                  left: "15px",
                                }}
                                onClick={() => setclickedPostBox(post)}
                                to={`/profile/${post.reposted[0]._id}`}
                              >
                                You reposted
                              </Link>{" "}
                            </>
                          ) : null}
                        </div>
                        <Stack
                          style={{
                            cursor: "pointer",
                          }}
                          to={`/${post.userId.username}/status/${
                            !post.isReposted
                              ? post._id
                              : post.repostedFromThisOriginalPost[0]?._id
                          }`}
                          onClick={() => setclickedPostBox(post)}
                          className="outside-of-inner-circle-post-info-user-info-svg-three-dots"
                          direction="horizontal"
                          gap={1}
                        >
                          {/* profile image start to check */}
                          <div className="p-1">
                            {post.userId.imageUrl.slice(0, 3) !== "../" ? (
                              <Link
                                className="post-circle-profile-image-on-point"
                                style={{ cursor: "pointer" }}
                                to={`/profile/${post ? post.userId._id : null}`}
                              >
                                <img
                                  width={40}
                                  height={40}
                                  src={post.userId.imageUrl}
                                  alt=""
                                  style={{
                                    borderRadius: "50%",
                                  }}
                                />
                              </Link>
                            ) : (
                              <Link
                                className="post-circle-profile-svg-on-point"
                                to={`/profile/${
                                  post.userId ? post.userId._id : null
                                }`}
                                style={{ cursor: "pointer" }}
                              >
                                {" "}
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
                            )}
                          </div>
                          {/* profile image finish to check  */}

                          {/* post owner full name + verified account svg + post owner user name + post created date start to check  */}
                          <div className="p-1">
                            {post.userId ? (
                              <div>
                                <Link
                                  className="post-circle-postowner-fullname"
                                  to={`/profile/${post.userId._id}`}
                                  style={{
                                    textDecoration: "none",
                                    color: "black",
                                  }}
                                >
                                  <span
                                    className="hover-fullname chirp-bold-font"
                                    style={{
                                      fontSize: font15.fontSize,
                                      lineHeight: font15.lineHeight,
                                      color:
                                        themeName === "dark-theme"
                                          ? "white"
                                          : "",
                                    }}
                                  >
                                    {post.authorFullName}
                                  </span>
                                </Link>{" "}
                                {post?.userId.isPrivate && (
                                  <span>
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
                                {post?.userId.hasSubscription ||
                                (!subscription?.isActive &&
                                  subscription?.remainingTimeSubscription &&
                                  subscription?.cancelledDate &&
                                  subscription?.owner === post?.userId._id) ||
                                remainingTimeSubscriptionsOwnerIds.includes(
                                  post?.userId._id
                                ) ? (
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
                                ) : (
                                  <span> </span>
                                )}
                                <Link
                                  className="chirp-regular-font"
                                  to={`/profile/${post.userId._id}`}
                                  style={{
                                    textDecoration: "none",
                                    color:
                                      themeName === "dark-theme"
                                        ? "#71767A"
                                        : "rgb(83, 100, 113)",
                                    fontSize: font15.fontSize,
                                    lineHeight: font15.lineHeight,
                                  }}
                                >
                                  <span className="chirp-regular-font">
                                    <span>@{post.authorUserName}</span>
                                  </span>
                                </Link>
                                <Link
                                  style={{
                                    textDecoration: "none",
                                  }}
                                  to={`/${post.userId.username}/status/${
                                    !post.isReposted
                                      ? post._id
                                      : post.repostedFromThisOriginalPost[0]
                                          ?._id
                                  }`}
                                >
                                  <span
                                    className="post-circle-date-post-detail chirp-regular-font"
                                    style={{
                                      color:
                                        themeName === "dark-theme"
                                          ? "#71767A"
                                          : "rgb(83, 100, 113)",
                                      fontSize: font15.fontSize,
                                      lineHeight: font15.lineHeight,
                                    }}
                                  >
                                    {" "}
                                    ·{" "}
                                    <BootstrapTooltip
                                      title={extraDetailedDate(post.createdAt)}
                                      themeName={
                                        themeName === "dark-theme"
                                          ? "dark-theme"
                                          : "light-theme"
                                      }
                                    >
                                      <span className="date-post-detail chirp-regular-font">
                                        {getCreatedDate(post.createdAt)}
                                      </span>
                                    </BootstrapTooltip>
                                  </span>
                                </Link>
                                {/* finish to check  */}
                              </div>
                            ) : null}
                          </div>
                          {/* post owner full name + verified account svg + post owner user name + post created date  finish to check  */}

                          {/* three dots svg start to check */}
                          <div className="p-1 ms-auto">
                            <PostPopover
                              postDeletionProcess={
                                handleDeletePostFromProfilePage
                              }
                              post={post}
                              refreshPosts={handleShowPostsProfilePage}
                            />
                          </div>
                          {/* three dots svg finish to check */}
                        </Stack>
                        {/* post content start to check  */}
                        <Stack
                          to={`/${post.userId.username}/status/${
                            !post.isReposted
                              ? post._id
                              : post.repostedFromThisOriginalPost[0]?._id
                          }`}
                          onClick={() => setclickedPostBox(post)}
                          className="outside-of-inner-circle-action-comment-text"
                          direction="vertical"
                          gap={1}
                        >
                          {post.isComment ? (
                            <div
                              to={`/${post.userId.username}/status/${
                                !post.isReposted
                                  ? post._id
                                  : post.repostedFromThisOriginalPost[0]?._id
                              }`}
                              onClick={() => setclickedPostBox(post)}
                              className="p-2 parent-comment-text"
                            >
                              <span
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
                                Replying to {""}
                              </span>
                              <Link
                                to={`/profile/${post.commentedForThisUsersPost._id}`}
                                style={{
                                  textDecoration: "none",
                                }}
                              >
                                <span
                                  className="replying-to-text chirp-regular-font"
                                  style={{
                                    color: "rgb(29, 155, 240)",
                                    cursor: "pointer",
                                    fontSize: font15.fontSize,
                                    lineHeight: font15.lineHeight,
                                  }}
                                >
                                  @{post.commentedForThisUsersPost.username}
                                </span>
                              </Link>
                            </div>
                          ) : null}

                          <Link
                            to={`/${post.userId.username}/status/${
                              !post.isReposted
                                ? post._id
                                : post.repostedFromThisOriginalPost[0]?._id
                            }`}
                            style={{
                              textDecoration: "none",
                              color: "rgb(15, 20, 25)",
                            }}
                          >
                            <div
                              className="p-2 chirp-regular-font"
                              style={{
                                fontSize: font15.fontSize,
                                lineHeight: font15.lineHeight,
                                overflowWrap: "break-word",
                                maxWidth: "100%",
                                cursor: "pointer",
                                color:
                                  themeName === "dark-theme" ? "white" : "",
                              }}
                            >
                              {post.content}
                            </div>
                          </Link>
                        </Stack>
                        {/* post content finish to check  */}
                        {/* start to check NOTE if there is no internet connection images would be hidden because of 'cloudinary connection' */}
                        {post.image.url !== "image@url" ? (
                          <>
                            <Link
                              to={`/${post.userId.username}/status/${
                                !post.isReposted
                                  ? post._id
                                  : post?.repostedFromThisOriginalPost[0]
                              }/photo/${1}`}
                              style={{
                                textDecoration: "none",
                              }}
                            >
                              <div
                                style={{
                                  overflow: "hidden",
                                  borderRadius: "8px",
                                  padding: "12px",
                                }}
                              >
                                <img
                                  src={post.image.url}
                                  alt="Description"
                                  style={{
                                    width: "100%",
                                    maxWidth: "100%",
                                    display: "block",
                                    borderRadius: "16px",
                                  }}
                                />
                              </div>
                            </Link>
                          </>
                        ) : null}
                        {/* finish to check NOTE if there is no internet connection images would be hidden because of 'cloudinary connection' */}
                        {/* new version favorite repost comment start to check */}
                        <Stack
                          className="mt-0"
                          direction="horizontal"
                          style={{
                            justifyContent: "space-between",
                            margin: "5px 0px 5px 0px",
                          }}
                        >
                          <div
                            style={{
                              width: "100px",
                            }}
                            onClick={() => setclickedPostBox(post)}
                            className="p-1 next-to-comment"
                          >
                            <CommentModal
                              post={post}
                              width={`${1.25}em`}
                              height={`${1.25}em`}
                              refreshPosts={() => handleShowPostsProfilePage()}
                              sendDataToParent={handleDataFromCommentModal}
                              postSharedMessage={postSharedMessage}
                            />
                          </div>

                          {/* start to check */}
                          <div
                            style={{
                              width: "100px",
                            }}
                            className="p-1"
                          >
                            <RepostAction
                              post={post ? post : null}
                              width={`${1.25}em`}
                              height={`${1.25}em`}
                              refreshPosts={handleShowPostsProfilePage}
                              setLoadingFalse={setLoadingFalse}
                              setLoadingTrue={setLoadingTrue}
                            />

                            {/* start  */}
                          </div>

                          {/* finish to check  */}
                          <div
                            style={{
                              width: "100px",
                            }}
                            className="p-1"
                          >
                            <LikeAction
                              post={post ? post : null}
                              width={`${1.25}em`}
                              height={`${1.25}em`}
                              refreshPosts={handleShowPostsProfilePage}
                              setLoadingFalse={setLoadingFalse}
                              setLoadingTrue={setLoadingTrue}
                            />
                          </div>
                          <div
                            style={{
                              width: "100px",
                            }}
                            className="p-1"
                          >
                            <BookmarkAction
                              post={post ? post : null}
                              width={`${1.25}em`}
                              height={`${1.25}em`}
                              refreshPosts={handleShowPostsProfilePage}
                              setLoadingFalse={setLoadingFalse}
                              setLoadingTrue={setLoadingTrue}
                            />
                          </div>
                        </Stack>
                        {/* new version favorite repost comment finish to check */}
                      </div>
                      <div
                        onClick={() => {
                          console.log("Post box child class =>", post);
                          setclickedPostBox(post);
                        }}
                        className="border-extra"
                        style={{
                          borderBottom:
                            themeName !== "dark-theme"
                              ? "1px solid rgba(0, 0, 0, 0.1)"
                              : // : "0.1px solid rgb(70, 70, 70)",
                                "1px solid rgb(70, 70, 70)",
                        }}
                      ></div>
                    </>
                  )}
                </div>
              ))}
              {visibleTweets < userprofiledata.length && (
                <Accordion defaultActiveKey="0">
                  <Accordion.Item style={{ border: "none" }} eventKey="1">
                    <Accordion.Header
                      style={{ border: "none" }}
                      className={`accordion-2 accordion-2-${themeName}`}
                    >
                      <div
                        className=" chirp-regular-font"
                        onClick={handleShowMorePosts}
                        style={{
                          border: "none",
                          width: "100%",
                          textAlign: "center",
                          color: "rgb(29, 155, 240)",
                          fontSize: font15.fontSize,
                          lineHeight: "24px",
                          cursor: "pointer",
                          backgroundColor: "transparent",
                        }}
                      >
                        Show more
                      </div>
                    </Accordion.Header>
                    <Accordion.Body></Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              )}
            </>
          ) : (
            <>
              {/* when no post shared yet from your posts section in general start to check  */}
              <div
                style={{
                  textAlign: "left",
                  padding: "16px",
                }}
              >
                <div
                  className="chirp-heavy-font"
                  style={{
                    fontSize: font31.fontSize,
                    lineHeight: font31.lineHeight,
                    margin: "10px",
                  }}
                >
                  {"You haven't posted anything yet."}
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
                    margin: "10px",
                  }}
                >
                  Start sharing your thoughts!
                </div>
              </div>
              {/* when no post shared yet from your posts section in general finish to check  */}
            </>
          )}
        </div>

        <div
          style={{
            height: width <= 700 && userprofiledata.length < 2 ? "30vh" : "",
          }}
          className={`${favoriteWindow} all-favorites`}
        >
          {favorites.length && hasFalse ? (
            <>
              {favorites.slice(0, visibleLikedTweets).map((favorite, index) => (
                <div
                  onClick={() => {
                    console.log("Post box parent class =>", favorite);
                    setclickedPostBox(favorite);
                  }}
                  className={
                    themeName === "dark-theme"
                      ? `each-post-${themeName}`
                      : "each-post"
                  }
                  key={favorite._id}
                >
                  {favorite.deactivatedOwner ||
                  (favorite.userId.isPrivate &&
                    !checkIfFollowing(favorite.userId._id) &&
                    userInfo._id !== favorite.userId._id) ? null : (
                    <>
                      <div
                        style={{
                          textDecoration: "none",
                        }}
                        onClick={() => {
                          setclickedPostBox(favorite);
                        }}
                        className="posts-details outside-of-inner-circle-actions"
                      >
                        <div className="favorite-head">
                          <Stack
                            style={{
                              cursor: "pointer",
                            }}
                            to={`/${favorite.userId.username}/status/${
                              !favorite.isReposted
                                ? favorite._id
                                : favorite.repostedFromThisOriginalPost[0]?._id
                            }`}
                            onClick={() => setclickedPostBox(favorite)}
                            className="outside-of-inner-circle-post-info-user-info-svg-three-dots"
                            direction="horizontal"
                            gap={1}
                          >
                            {/* profile image start to check */}
                            <div className="p-1">
                              {favorite.userId.imageUrl.slice(0, 3) !==
                              "../" ? (
                                <Link
                                  className="post-circle-profile-image-on-point"
                                  style={{ cursor: "pointer" }}
                                  to={`/profile/${
                                    favorite ? favorite.userId._id : null
                                  }`}
                                >
                                  <img
                                    width={40}
                                    height={40}
                                    src={favorite.userId.imageUrl}
                                    alt="??"
                                    style={{ borderRadius: "50%" }}
                                  />
                                </Link>
                              ) : (
                                <Link
                                  className="post-circle-profile-svg-on-point"
                                  to={`/profile/${
                                    favorite.userId ? favorite.userId._id : null
                                  }`}
                                  style={{ cursor: "pointer" }}
                                >
                                  {" "}
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
                              )}
                            </div>
                            {/* profile image finish to check  */}

                            {/* post owner full name + verified account svg + post owner user name + post created date start to check  */}
                            <div className="p-1">
                              {favorite.userId ? (
                                <>
                                  <Link
                                    className="post-circle-postowner-fullname"
                                    to={`/profile/${favorite.userId._id}`}
                                    style={{
                                      textDecoration: "none",
                                      color: "black",
                                    }}
                                  >
                                    <span
                                      className="hover-fullname chirp-bold-font"
                                      style={{
                                        fontSize: font15.fontSize,
                                        lineHeight: font15.lineHeight,
                                        color:
                                          themeName === "dark-theme"
                                            ? "white"
                                            : "",
                                      }}
                                    >
                                      {favorite.authorFullName}
                                    </span>
                                  </Link>
                                  {favorite?.userId.isPrivate && (
                                    <span
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
                                  {favorite?.userId.hasSubscription ||
                                  (!subscription?.isActive &&
                                    subscription?.remainingTimeSubscription &&
                                    subscription?.cancelledDate &&
                                    subscription?.owner ===
                                      favorite?.userId._id) ||
                                  remainingTimeSubscriptionsOwnerIds.includes(
                                    favorite?.userId._id
                                  ) ? (
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
                                  ) : (
                                    <span> </span>
                                  )}
                                  <Link
                                    className="chirp-regular-font"
                                    to={`/profile/${favorite.userId._id}`}
                                    style={{
                                      textDecoration: "none",
                                      color:
                                        themeName === "dark-theme"
                                          ? "#71767A"
                                          : "rgb(83, 100, 113)",
                                      fontSize: font15.fontSize,
                                      lineHeight: font15.lineHeight,
                                    }}
                                  >
                                    <span className="chirp-regular-font">
                                      <span>@{favorite.authorUserName}</span>
                                    </span>
                                  </Link>
                                  <Link
                                    style={{
                                      textDecoration: "none",
                                    }}
                                    to={`/${favorite.userId.username}/status/${
                                      !favorite.isReposted
                                        ? favorite._id
                                        : favorite
                                            .repostedFromThisOriginalPost[0]
                                            ?._id
                                    }`}
                                  >
                                    <span
                                      className="post-circle-date-post-detail chirp-regular-font"
                                      style={{
                                        color:
                                          themeName === "dark-theme"
                                            ? "#71767A"
                                            : "rgb(83, 100, 113)",
                                        fontSize: font15.fontSize,
                                        lineHeight: font15.lineHeight,
                                      }}
                                    >
                                      {" "}
                                      ·{" "}
                                      <BootstrapTooltip
                                        title={extraDetailedDate(
                                          favorite.createdAt
                                        )}
                                        themeName={
                                          themeName === "dark-theme"
                                            ? "dark-theme"
                                            : "light-theme"
                                        }
                                      >
                                        <span className="date-post-detail">
                                          {getCreatedDate(favorite.createdAt)}
                                        </span>
                                      </BootstrapTooltip>
                                    </span>
                                  </Link>
                                  {/* finish to check  */}
                                </>
                              ) : null}
                            </div>
                            {/* post owner full name + verified account svg + post owner user name + post created date  finish to check  */}

                            {/* three dots svg start to check */}
                            <div className="p-1 ms-auto">
                              <PostPopover
                                postDeletionProcess={
                                  handleDeletePostFromProfilePage
                                }
                                post={favorite}
                                refreshPosts={handleShowPostsProfilePage}
                              />
                            </div>
                            {/* three dots svg finish to check */}
                          </Stack>
                        </div>

                        {/* post content start to check  */}
                        <Stack
                          to={`/${favorite.userId.username}/status/${
                            !favorite.isReposted
                              ? favorite._id
                              : favorite.repostedFromThisOriginalPost[0]?._id
                          }`}
                          onClick={() => setclickedPostBox(favorite)}
                          className="outside-of-inner-circle-action-comment-text"
                          direction="vertical"
                          gap={1}
                        >
                          <Link
                            style={{
                              textDecoration: "none",
                              color: "rgb(15, 20, 25)",
                            }}
                            to={`/${favorite.userId.username}/status/${
                              !favorite.isReposted
                                ? favorite._id
                                : favorite.repostedFromThisOriginalPost[0]?._id
                            }`}
                          >
                            <div
                              style={{
                                color:
                                  themeName === "dark-theme" ? "white" : "",
                                fontSize: font15.fontSize,
                                lineHeight: font15.lineHeight,
                                overflowWrap: "break-word",
                                maxWidth: "100%",
                              }}
                              className="p-2 chirp-regular-font"
                            >
                              {favorite.content}
                            </div>
                          </Link>
                        </Stack>
                        {/* post content finish to check  */}

                        {/* start to check NOTE if there is no internet connection images would be hidden because of 'cloudinary connection' */}
                        {favorite.image.url !== "image@url" ? (
                          <>
                            <Link
                              to={`/${favorite.userId.username}/status/${
                                !favorite.isReposted
                                  ? favorite._id
                                  : favorite?.repostedFromThisOriginalPost[0]
                              }/photo/${1}`}
                              style={{
                                textDecoration: "none",
                              }}
                            >
                              <div
                                style={{
                                  overflow: "hidden",
                                  borderRadius: "8px",
                                  padding: "12px",
                                }}
                              >
                                <img
                                  src={favorite.image.url}
                                  alt="Description"
                                  style={{
                                    width: "100%",
                                    maxWidth: "100%",
                                    display: "block",
                                    borderRadius: "16px",
                                  }}
                                />
                              </div>
                            </Link>
                          </>
                        ) : null}
                        {/* finish to check NOTE if there is no internet connection images would be hidden because of 'cloudinary connection' */}

                        {/* new version favorite repost comment start to check */}
                        <Stack
                          className="mt-0 parent-footer-stack"
                          onClick={() => setclickedPostBox(favorite)}
                          direction="horizontal"
                          style={{
                            justifyContent: "space-between",
                            margin: "5px 0px 5px 0px",
                            cursor: "pointer",
                          }}
                        >
                          <div
                            style={{
                              width: "100px",
                            }}
                            onClick={() => setclickedPostBox(favorite)}
                            className="p-1 next-to-comment"
                          >
                            <CommentModal
                              post={favorite}
                              width={`${1.25}em`}
                              height={`${1.25}em`}
                              refreshPosts={handleGetFavorites}
                              sendDataToParent={handleDataFromCommentModal}
                              postSharedMessage={postSharedMessage}
                            />
                          </div>

                          {/* start to check */}
                          <div
                            style={{
                              width: "100px",
                            }}
                            onClick={() => setclickedPostBox(favorite)}
                            className="p-1 next-to-repost"
                          >
                            <RepostAction
                              post={favorite ? favorite : null}
                              width={`${1.25}em`}
                              height={`${1.25}em`}
                              refreshPosts={handleGetFavorites}
                              setLoadingFalse={setLoadingFalse}
                              setLoadingTrue={setLoadingTrue}
                            />
                          </div>

                          {/* finish to check  */}
                          <div
                            style={{
                              width: "100px",
                            }}
                            to={`/${favorite.userId.username}/status/${
                              !favorite.isReposted
                                ? favorite._id
                                : favorite.repostedFromThisOriginalPost[0]?._id
                            }`}
                            onClick={() => setclickedPostBox(favorite)}
                            className="p-1 next-to-like"
                          >
                            <LikeAction
                              post={favorite ? favorite : null}
                              width={`${1.25}em`}
                              height={`${1.25}em`}
                              refreshPosts={handleGetFavorites}
                              setLoadingFalse={setLoadingFalse}
                              setLoadingTrue={setLoadingTrue}
                            />
                          </div>
                          <div
                            style={{
                              width: "100px",
                            }}
                            to={`/${favorite.userId.username}/status/${
                              !favorite.isReposted
                                ? favorite._id
                                : favorite.repostedFromThisOriginalPost[0]?._id
                            }`}
                            onClick={() => setclickedPostBox(favorite)}
                            className="p-1 next-to-like"
                          >
                            <BookmarkAction
                              post={favorite ? favorite : null}
                              width={`${1.25}em`}
                              height={`${1.25}em`}
                              refreshPosts={handleGetFavorites}
                              setLoadingFalse={setLoadingFalse}
                              setLoadingTrue={setLoadingTrue}
                            />
                          </div>
                        </Stack>
                        {/* new version favorite repost comment finish to check */}
                      </div>
                      <div
                        onClick={() => {
                          console.log("Post box child class =>", favorite);
                          setclickedPostBox(favorite);
                        }}
                        className="border-extra"
                        style={{
                          borderBottom:
                            themeName !== "dark-theme"
                              ? "1px solid rgba(0, 0, 0, 0.1)"
                              : // : "0.1px solid rgb(70, 70, 70)",
                                "1px solid rgb(70, 70, 70)",
                        }}
                      ></div>
                    </>
                  )}
                </div>
              ))}
              {visibleLikedTweets < favorites.length && (
                <Accordion defaultActiveKey="0">
                  <Accordion.Item style={{ border: "none" }} eventKey="1">
                    <Accordion.Header
                      style={{ border: "none" }}
                      className={`accordion-2 accordion-2-${themeName}`}
                    >
                      <div
                        className=" chirp-regular-font"
                        onClick={handleShowMoreLikedTweets}
                        style={{
                          border: "none",
                          width: "100%",
                          textAlign: "center",
                          color: "rgb(29, 155, 240)",
                          fontSize: font15.fontSize,
                          lineHeight: "24px",
                          cursor: "pointer",
                          backgroundColor: "transparent",
                        }}
                      >
                        Show more
                      </div>
                    </Accordion.Header>
                    <Accordion.Body></Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              )}
            </>
          ) : (
            <>
              {/* when no post liked yet from likes section in general start to check  */}

              <div
                style={{
                  textAlign: "left",
                  padding: "16px",
                }}
              >
                <div
                  className="chirp-heavy-font"
                  style={{
                    fontSize: font31.fontSize,
                    lineHeight: font31.lineHeight,
                    margin: "10px",
                  }}
                >
                  You don’t have any likes yet
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
                    margin: "10px",
                  }}
                >
                  Tap the heart on any post to show it some love. When you do,
                  it’ll show up here.
                </div>
              </div>
              {/* when no post liked yet from likes section in general finish to check  */}
            </>
          )}
        </div>

        {/* mainpage yani home rotasına tüm twitlerin gösterileceği column burası !  */}
      </Col>
    </>
  );
}

export default UserProfile;
