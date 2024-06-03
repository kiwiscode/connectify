import { Suspense, lazy, useContext, useEffect, useState } from "react";
import HomePage from "./pages/HomePage";

const MainPage = lazy(() => import("./pages/MainPage"));
const UserProfile = lazy(() => import("./pages/UserProfilePage"));
const SpesificUserProfile = lazy(() => import("./pages/SpesificUserProfile"));
import { Routes, Route, useLocation } from "react-router-dom";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
const MessagesPage = lazy(() => import("./pages/MessagesPage"));
const ChatDetailsPage = lazy(() => import("./pages/ChatDetailsPage"));
const PostDetailPage = lazy(() => import("./pages/PostDetailPage"));
const FollowingDetailPage = lazy(() => import("./pages/FollowingDetail"));
const FollowerDetailPage = lazy(() => import("./pages/FollowersDetailPage"));
const DeactivatedPage = lazy(() => import("./pages/DeactivatedPage"));
const NotificationsPage = lazy(() => import("./pages/NotificationsPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));
const BookmarksPage = lazy(() => import("./pages/BookmarksPage"));
const PremiumSignupPage = lazy(() => import("./pages/PremiumSignupPage"));
const Settings = lazy(() => import("./pages/Settings"));
const YourAccountMain = lazy(() => import("./pages/YourAccountMain"));
const MonetizationMain = lazy(() => import("./pages/MonetizationMain"));
const CreatorSubscriptionMain = lazy(() =>
  import("./pages/CreatorSubscriptionsMain")
);
const SecurityAndAccountAccessMain = lazy(() =>
  import("./pages/SecurityAndAccountAccessMain")
);
const PrivacyAndSafetyMain = lazy(() => import("./pages/PrivacyAndSafetyMain"));
const SettingsNotificationsMain = lazy(() =>
  import("./pages/SettingsNotificationsMain")
);
const AccessibilityDisplayAndLanguagesMain = lazy(() =>
  import("./pages/AccessibilityDisplayAndLanguagesMain")
);
const AdditionalResourcesMain = lazy(() =>
  import("./pages/AdditionalResourcesMain")
);
const HelpConnectifyMain = lazy(() => import("./pages/HelpConnectifyMain"));

const ChangeYourPasswordMain = lazy(() =>
  import(
    "./pages/settings/your_account_options/change_your_password/ChangeYourPasswordMain"
  )
);
const DeactivateYourAccountMain = lazy(() =>
  import(
    "./pages/settings/your_account_options/deactivate_your_account/DeactivateYourAccountMain"
  )
);
const DownloadAnArchiveOfYourDataMain = lazy(() =>
  import(
    "./pages/settings/your_account_options/download_an_archive_of_your_data/main/DownloadAnArchiveOfYourDataMain"
  )
);
const SendPasswordResetMain = lazy(() =>
  import(
    "./pages/settings/your_account_options/forgot_password/account_send_password_reset/SendPasswordResetMain"
  )
);
const ConfirmPinResetMain = lazy(() =>
  import(
    "./pages/settings/your_account_options/forgot_password/account_confirm_pin_reset/ConfirmPinResetMain"
  )
);
const ResetPasswordMain = lazy(() =>
  import(
    "./pages/settings/your_account_options/forgot_password/account_reset_password/ResetPasswordMain"
  )
);
const PasswordResetSurveyMain = lazy(() =>
  import(
    "./pages/settings/your_account_options/forgot_password/account_password_reset_survey/PasswordResetSurveyMain"
  )
);
const PasswordResetCompleteMain = lazy(() =>
  import(
    "./pages/settings/your_account_options/forgot_password/account_password_reset_complete/PasswordResetCompleteMain"
  )
);
const ScreenName = lazy(() =>
  import(
    "./pages/settings/your_account_options/account_information/sections/username/ScreenName"
  )
);
const Phone = lazy(() =>
  import(
    "./pages/settings/your_account_options/account_information/sections/phone/Phone"
  )
);
const Email = lazy(() =>
  import(
    "./pages/settings/your_account_options/account_information/sections/email/Email"
  )
);
const AudienceAndTagging = lazy(() =>
  import(
    "./pages/settings/your_account_options/account_information/sections/protected_posts/AudienceAndTagging"
  )
);

const DownloadYourDataMain = lazy(() =>
  import(
    "./pages/settings/your_account_options/download_an_archive_of_your_data/sections/download_your_data_main/DownloadYourDataMain"
  )
);

// settings page detailed pages,components if exist start to check

// settings page detailed pages,components if exist finish to check

import { ThemeContext } from "./context/ThemeContext";
import { UserContext, UserProvider } from "./context/UserContext";

import LoadingSpinner from "./components/ui/LoadingSpinner";
import { Bounce, ToastContainer, toast } from "react-toastify";

// when working on local version
const API_URL = "http://localhost:3000";

// when working on deployment version
// ?

import io from "socket.io-client";
const socket = io.connect(`${API_URL}`);
import CustomNotification from "./components/Notifications/CustomNotification";
import { Container, Row } from "react-bootstrap";
import LeftSideNavBar from "./components/Main-Left-Side-Navbar/LeftSideNavbar";
import RightSideColumn from "./components/Main-Right-Side-Column/RightSideColumn";
import useWindowDimensions from "./hooks/getWindowDimensions";
import AccountInformationMain from "./pages/settings/your_account_options/account_information/Main/AccountInformationMain";

function App() {
  const location = useLocation();
  const path = location.pathname;

  console.log("Current path:", path);

  const [{ theme, themeName }] = useContext(ThemeContext);
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  useEffect(() => {
    socket.emit(
      "current_url_for_checking_if_user_inside_chat_details_page",
      path
    );
    socket.emit("socket_userInfo", userInfo);
  }, [path]);

  useEffect(() => {
    socket.on("socket_id_for_user", (socketId) => {
      localStorage.setItem("socketId", socketId);
    });
    socket.emit("setUsername", userInfo?.username);
  }, []);
  useEffect(() => {
    console.log("Custom notification test !!!");
    socket.on("getNotification", (data) => {
      console.log("Data =>", data);
    });

    socket.on("getText", (data) => {
      console.log("Data get text =>", data);
      console.log("User info =>", userInfo);

      if (data.senderName !== userInfo?.username) {
        console.log("Buradayız ve neden çalışmasın ki toast container ???");

        // Path "/messages" veya "/messages/:chatRoomId" ise ve notification type "message" değilse toast göster ???

        toast(
          <CustomNotification
            senderName={data.senderName}
            type={data.type}
            contactHasBeenMade={data.contactHasBeenMade}
            senderInfo={data.senderInfo}
            text={data.text ? data.text : null}
          />,
          {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            transition: Bounce,
          }
        );
      } else {
        console.log("You cannot send a notification to yourself.");
      }
    });
  }, [socket]);

  // left side navigation bar props start to check

  // left side navigation bar props finish to check
  const { width } = useWindowDimensions();

  const writeTheRouteNameForRefreshPosts = (routePath) => {
    console.log("Route path =>", routePath);
  };

  const [isPostShared, setIsPostShared] = useState(false);
  const handleShareNewPost = () => {
    console.log("Post shared =>", isPostShared);
    setTimeout(() => {
      setIsPostShared(true);
    }, 200);
  };

  const handlePostSharingIsDone = () => {
    console.log("Post shared =>", isPostShared);
    setIsPostShared(false);
  };

  // seperate this info to the rightsidecolumn child as a parent
  const [
    openVerifiedOrganizationSubscriptionTypedModal,
    setOpenVerifiedOrganizationSubscriptionTypedModal,
  ] = useState(null);

  const [
    openIndividualEligibilityVerifyNumberScreen,
    setopenIndividualEligibilityVerifyNumberScreen,
  ] = useState(null);

  useEffect(() => {
    if (path == "/i/verified-orgs-signup") {
      console.log(
        "Talking from bubbaa parent : You are in the right path to open verified organization sign up !!!"
      );
      setOpenVerifiedOrganizationSubscriptionTypedModal(true);
    } else if (path == "/i/flow/subscription_eligibility_check") {
      setopenIndividualEligibilityVerifyNumberScreen(true);
    } else {
      console.log(
        "Talking from bubbaa parent : You are not in the right path to open verified organization sign up or individual sign up!!!"
      );
      setOpenVerifiedOrganizationSubscriptionTypedModal(false);
      setopenIndividualEligibilityVerifyNumberScreen(false);
    }
  }, [
    path,
    openVerifiedOrganizationSubscriptionTypedModal,
    openIndividualEligibilityVerifyNumberScreen,
  ]);

  const [planPrice, setPlanPrice] = useState(null);
  const [planType, setPlanType] = useState(null);
  const [premiumRole, setPremiumRole] = useState(null);
  const [premiumType, setPremiumType] = useState(null);
  const [premiumInfo, setPremiumInfo] = useState({});

  const handleReceiveBasicIndividualPremiumDetailFromChildPremiumSignUpPage = (
    data
  ) => {
    console.log("Data received about individual subscription detail:", data);
    setPlanPrice(data.planPrice);
    setPlanType(data.planType);
    setPremiumRole(data.premiumRole);
    setPremiumType(data.premiumType);

    setPremiumInfo((prevPremiumInfo) => {
      return {
        ...prevPremiumInfo,
        premiumRole: data.premiumRole,
        premiumType: data.premiumType,
        planType: data.planType,
        planPrice: data.planPrice,
      };
    });
  };
  return (
    <>
      <UserProvider>
        <ToastContainer theme={themeName === "dark-theme" ? "dark" : "light"} />{" "}
        <div
          className={
            themeName === "dark-theme"
              ? "dark-theme"
              : themeName === "light-theme"
              ? "light-theme"
              : null
          }
          style={{
            color: theme.color,
            backgroundColor: theme.backgroundColor,
            height: "100vh",
            height: "100dvh",
            width: "100%",
            overflow: "auto",
            colorScheme: themeName === "dark-theme" ? "dark" : "light",
          }}
        >
          {/* test for one time component leftsidenavbar start to check  */}
          <Container
            style={{
              height: "100%",
            }}
            fluid
          >
            <Row
              style={{
                borderTop: "none",
                borderBottom: "none",
                height: !path.startsWith("/account") ? "100%" : "",
              }}
            >
              {path !== "/" &&
                path !== "/settings/deactivated" &&
                path !== "/i/premium_sign_up" &&
                path !== "/help_connectify" &&
                !path.startsWith("/account") && (
                  <LeftSideNavBar
                    refreshPosts={handleShareNewPost}
                    setIsPostShared={handlePostSharingIsDone}
                  />
                )}{" "}
              <Suspense
                fallback={
                  <LoadingSpinner
                    isSuspense={true}
                    strokeColor={"rgb(29, 155, 240)"}
                  ></LoadingSpinner>
                }
              >
                <Routes>
                  <Route path="/" element={<HomePage />} />

                  <Route
                    path="/home"
                    element={<MainPage isNewPostShared={isPostShared} />}
                  ></Route>

                  <Route
                    path="/notifications"
                    element={<NotificationsPage />}
                  ></Route>
                  <Route path="/messages" element={<MessagesPage />}></Route>
                  <Route path="/bookmarks" element={<BookmarksPage />}></Route>
                  <Route
                    path="/profile"
                    element={<UserProfile isNewPostShared={isPostShared} />}
                  ></Route>
                  <Route
                    path="/profile/:id"
                    element={
                      <SpesificUserProfile isNewPostShared={isPostShared} />
                    }
                  ></Route>
                  <Route
                    path="/:postOwner/status/:postId"
                    element={<PostDetailPage />}
                  ></Route>
                  <Route
                    path="/messages/:chatRoomId"
                    element={<ChatDetailsPage />}
                  ></Route>

                  <Route
                    path="/profile/:userId/following"
                    element={<FollowingDetailPage />}
                  ></Route>

                  <Route
                    path="/profile/:userId/followers"
                    element={<FollowerDetailPage />}
                  ></Route>

                  <Route
                    path="/settings/deactivated"
                    element={<DeactivatedPage />}
                  ></Route>

                  <Route
                    path="/i/premium_sign_up"
                    element={
                      <PremiumSignupPage
                        sendToAppPlanPrice={
                          handleReceiveBasicIndividualPremiumDetailFromChildPremiumSignUpPage
                        }
                      />
                    }
                  ></Route>

                  <Route
                    path="/i/verified-orgs-signup"
                    element={<MainPage />}
                  ></Route>

                  <Route
                    path="/i/flow/subscription_eligibility_check"
                    element={<MainPage />}
                  ></Route>

                  <Route path="/settings" element={<Settings />}></Route>
                  <Route
                    path="/settings/account"
                    element={<YourAccountMain />}
                  ></Route>
                  <Route
                    path="/settings/your_twitter_data/account"
                    element={<AccountInformationMain />}
                  ></Route>
                  <Route
                    path="/settings/password"
                    element={<ChangeYourPasswordMain />}
                  ></Route>
                  <Route
                    path="/account/send_password_reset"
                    element={<SendPasswordResetMain />}
                  ></Route>
                  <Route
                    path="/account/confirm_pin_reset"
                    element={<ConfirmPinResetMain />}
                  ></Route>
                  <Route
                    path="/account/reset_password"
                    element={<ResetPasswordMain />}
                  ></Route>
                  <Route
                    path="/account/password_reset_survey"
                    element={<PasswordResetSurveyMain />}
                  ></Route>
                  <Route
                    path="/account/password_reset_complete"
                    element={<PasswordResetCompleteMain />}
                  ></Route>
                  <Route
                    path="/settings/deactivate"
                    element={<DeactivateYourAccountMain />}
                  ></Route>

                  <Route
                    path="/i/flow/verify_account_ownership"
                    element={<DownloadAnArchiveOfYourDataMain />}
                  ></Route>
                  <Route
                    path="/settings/download-your-data"
                    element={<DownloadYourDataMain />}
                  ></Route>
                  <Route
                    path="/settings/screen_name"
                    element={<ScreenName />}
                  ></Route>
                  <Route path="/settings/phone" element={<Phone />}></Route>
                  <Route path="/settings/email" element={<Email />}></Route>
                  <Route
                    path="/settings/audience_and_tagging"
                    element={<AudienceAndTagging />}
                  ></Route>
                  <Route
                    path="/settings/monetization"
                    element={<MonetizationMain />}
                  ></Route>
                  <Route
                    path="/settings/manage_subscriptions"
                    element={<CreatorSubscriptionMain />}
                  ></Route>
                  <Route
                    path="/settings/security_and_account_access"
                    element={<SecurityAndAccountAccessMain />}
                  ></Route>
                  <Route
                    path="/settings/privacy_and_safety"
                    element={<PrivacyAndSafetyMain />}
                  ></Route>
                  <Route
                    path="/settings/notifications"
                    element={<SettingsNotificationsMain />}
                  ></Route>
                  <Route
                    path="/settings/accessibility_display_and_languages"
                    element={<AccessibilityDisplayAndLanguagesMain />}
                  ></Route>
                  <Route
                    path="/settings/about"
                    element={<AdditionalResourcesMain />}
                  ></Route>
                  <Route
                    path="/help_connectify"
                    element={<HelpConnectifyMain />}
                  ></Route>

                  <Route path="/*" element={<NotFoundPage />}></Route>
                </Routes>
              </Suspense>
              {path !== "/" &&
                path !== "/settings/deactivated" &&
                path !== "/i/premium_sign_up" &&
                !path.startsWith("/settings") &&
                path !== "/help_connectify" &&
                path !== "/i/flow/verify_account_ownership" &&
                !path.startsWith("/account") && (
                  <RightSideColumn
                    isVerifiedOrgsSignUpRoute={
                      openVerifiedOrganizationSubscriptionTypedModal
                    }
                    isSubscriptionEligibilityCheckRouteForIndividualSubscription={
                      openIndividualEligibilityVerifyNumberScreen
                    }
                    premiumInfoFromParentAppJsx={premiumInfo}
                  />
                )}
            </Row>
          </Container>
          {/* test for one time component leftsidenavbar finish to check  */}
        </div>
      </UserProvider>
    </>
  );
}

export default App;
