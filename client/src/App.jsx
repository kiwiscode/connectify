import { Suspense, lazy, useContext, useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { ThemeContext } from "./context/ThemeContext";
import LoadingSpinner from "./components/ui/LoadingSpinner";
import { Container, Row } from "react-bootstrap";
import { SubscriptionStatusProvider } from "./context/SubscriptionStatusContext";
import io from "socket.io-client";
import { NavigationHistoryContext } from "./context/NavigationHistoryContext";
import { UserContext } from "./context/UserContext";

const HomePage = lazy(() => import("./pages/HomePage"));
const MainPage = lazy(() => import("./pages/MainPage"));
const UserProfile = lazy(() => import("./pages/UserProfilePage"));
const SpesificUserProfile = lazy(() => import("./pages/SpesificUserProfile"));

const MessagesPage = lazy(() => import("./pages/MessagesPage"));
const ChatDetailsPage = lazy(() => import("./pages/ChatDetailsPage"));
const PostDetailPage = lazy(() => import("./pages/PostDetailPage"));
const PostDetailPageWithPicture = lazy(() =>
  import("./pages/PostDetailPageWithPicture")
);
const FollowingRequestsDetailPage = lazy(() =>
  import("./pages/FollowingRequests")
);
const FollowingDetailPage = lazy(() => import("./pages/FollowingDetail"));
const FollowerDetailPage = lazy(() => import("./pages/FollowersDetailPage"));
const DeactivatedPage = lazy(() => import("./pages/DeactivatedPage"));
const NotificationsPage = lazy(() => import("./pages/NotificationsPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

const BookmarksPage = lazy(() => import("./pages/BookmarksPage"));
const PremiumSignupPage = lazy(() => import("./pages/PremiumSignupPage"));
const Settings = lazy(() => import("./pages/Settings"));
const AccountInformationMain = lazy(() =>
  import(
    "./pages/settings/your_account_options/account_information/main/AccountInformationMain"
  )
);
const VerifiedChooseMain = lazy(() =>
  import("./pages/subscription-flow/i-verified-choose/VerifiedChooseMain")
);
const YourAccountMain = lazy(() =>
  import("./pages/settings/your_account_options/main/YourAccountMain")
);
const MonetizationMain = lazy(() =>
  import("./pages/settings/open_monetization_options/main/MonetizationMain")
);
const SuperFollowsApplicationEligibility = lazy(() =>
  import(
    "./pages/settings/open_monetization_options/sections/SuperFollowsApplicationEligibility"
  )
);
const AdRevShareEligibility = lazy(() =>
  import(
    "./pages/settings/open_monetization_options/sections/AdRevShareEligibility"
  )
);

const SecurityAndAccountAccessMain = lazy(() =>
  import(
    "./pages/settings/security_and_account_access/main/SecurityAndAccountAccessMain"
  )
);
const SecurityMain = lazy(() =>
  import(
    "./pages/settings/security_and_account_access/sections/security/main/SecurityMain"
  )
);
const PrivacyAndSafetyMain = lazy(() =>
  import("./pages/settings/privacy_and_safety/main/PrivacyAndSafetyMain")
);
const NotificationMain = lazy(() =>
  import("./pages/settings/notifications/main/NotificationMain")
);
const AccessibilityDisplayAndLanguagesMain = lazy(() =>
  import(
    "./pages/settings/accessibility_display_and_languages/main/AccessibilityDisplayAndLanguagesMain"
  )
);
const Display = lazy(() =>
  import(
    "./pages/settings/accessibility_display_and_languages/sections/display/Display"
  )
);
const About = lazy(() => import("./pages/settings/about/main/About"));
const HelpConnectifyMain = lazy(() =>
  import("./pages/settings/help_connectify/main/HelpConnectifyMain")
);

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
const CreatorSubscriptionMain = lazy(() =>
  import(
    "./pages/settings/creator_subscriptions_options/main/CreatorSubscriptionMain"
  )
);
const BillingStripeSubscriptionMain = lazy(() =>
  import(
    "./pages/settings/creator_subscriptions_options/billing/BillingStripeSubscriptionMain"
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

const Email = lazy(() =>
  import(
    "./pages/settings/your_account_options/account_information/sections/email/main/Email"
  )
);
const FlowPasswordReset = lazy(() =>
  import(
    "./pages/settings/your_account_options/account_information/sections/flow_password_reset/Flow_Password_Reset"
  )
);
const ChangeYourEmail = lazy(() =>
  import(
    "./pages/settings/your_account_options/account_information/sections/email/sections/change_your_email/ChangeYourEmail"
  )
);
const Age = lazy(() =>
  import(
    "./pages/settings/your_account_options/account_information/sections/age/Age"
  )
);
const Gender = lazy(() =>
  import(
    "./pages/settings/your_account_options/account_information/sections/gender/Gender"
  )
);
const Country = lazy(() =>
  import(
    "./pages/settings/your_account_options/account_information/sections/country/Country"
  )
);

const AudienceAndTagging = lazy(() =>
  import(
    "./pages/settings/your_account_options/account_information/sections/protected_posts/main/AudienceAndTagging"
  )
);
const Tagging = lazy(() =>
  import(
    "./pages/settings/your_account_options/account_information/sections/protected_posts/sections/Tagging"
  )
);

const DownloadYourDataMain = lazy(() =>
  import(
    "./pages/settings/your_account_options/download_an_archive_of_your_data/sections/download_your_data_main/DownloadYourDataMain"
  )
);
const Languages = lazy(() =>
  import(
    "./pages/settings/your_account_options/account_information/sections/languages/main/Languages"
  )
);
const Phone = lazy(() =>
  import(
    "./pages/settings/your_account_options/account_information/sections/phone/main/Phone"
  )
);
const AddYourPhoneNumber = lazy(() =>
  import(
    "./pages/settings/your_account_options/account_information/sections/phone/sections/add_your_phone_number/AddYourPhoneNumber"
  )
);
const Automation = lazy(() =>
  import(
    "./pages/settings/your_account_options/account_information/sections/automation/main/Automation"
  )
);
const Enable_Automated_Account = lazy(() =>
  import(
    "./pages/settings/your_account_options/account_information/sections/automation/sections/Enable_Automated_Account"
  )
);
const YourTwitterDataLanguage = lazy(() =>
  import(
    "./pages/settings/your_account_options/account_information/sections/languages/sections/YourTwitterDataLanguage"
  )
);
const LanguageSelector = lazy(() =>
  import(
    "./pages/settings/your_account_options/account_information/sections/languages/sections/LanguageSelector"
  )
);
const ChangeDisplayLanguage = lazy(() =>
  import(
    "./pages/settings/your_account_options/account_information/sections/languages/sections/ChangeDisplayLanguage"
  )
);
const LeftSideNavBar = lazy(() =>
  import("./components/Main-Left-Side-Navbar/LeftSideNavbar")
);
const RightSideColumn = lazy(() =>
  import("./components/Main-Right-Side-Column/RightSideColumn")
);

const socket = io(import.meta.env.VITE_APP_API_URL);

import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const { userInfo } = useContext(UserContext);
  const [{ theme, themeName }] = useContext(ThemeContext);
  const location = useLocation();
  const path = location.pathname;
  const { navigationHistoryArray } = useContext(NavigationHistoryContext);

  // bir rota öncesi işlemleri
  const oneRouteBefore =
    navigationHistoryArray?.length > 0 && navigationHistoryArray[1]
      ? navigationHistoryArray[1]
      : null;
  const chatRoomIdArray = oneRouteBefore?.startsWith("/messages/")
    ? oneRouteBefore?.split("/messages/")[1].split("-")
    : [];

  const chatRoomId = chatRoomIdArray.join("-");

  // Odayı terketme işlemi
  function userLeft(roomName, userName) {
    socket.emit("userLeft", roomName, userName);
  }

  // Odayı terk etme işlemleri
  useEffect(() => {
    if (oneRouteBefore && chatRoomIdArray && chatRoomId) {
      if (
        chatRoomIdArray.includes(userInfo._id) &&
        !path.startsWith("/messages/")
      ) {
        userLeft(chatRoomId, userInfo.username);
      }
    }
  }, [
    path,
    userInfo,
    navigationHistoryArray,
    oneRouteBefore,
    chatRoomIdArray,
    chatRoomId,
  ]);

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
      setOpenVerifiedOrganizationSubscriptionTypedModal(true);
    } else if (path == "/i/flow/subscription_eligibility_check") {
      console.log("Open individual subscription modal ...!");
      setopenIndividualEligibilityVerifyNumberScreen(true);
    } else {
      setOpenVerifiedOrganizationSubscriptionTypedModal(false);
      setopenIndividualEligibilityVerifyNumberScreen(false);
    }
  }, [
    path,
    openVerifiedOrganizationSubscriptionTypedModal,
    openIndividualEligibilityVerifyNumberScreen,
  ]);

  const [premiumInfo, setPremiumInfo] = useState({});

  const handleReceiveBasicIndividualPremiumDetailFromChildPremiumSignUpPage = (
    data
  ) => {
    console.log("Data received about individual subscription detail:", data);

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
  console.log("Active theme =>", themeName);

  return (
    <>
      <div
        style={{
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 0,
          top: 0,
          width: "100%",
          height: "100dvh",
          backgroundColor: path.startsWith("/billing")
            ? ""
            : theme.backgroundColor,
          zIndex: -1,
        }}
      ></div>
      <SubscriptionStatusProvider>
        <div
          // id="smooth-content"
          className={
            themeName === "dark-theme"
              ? "dark-theme"
              : themeName === "light-theme"
              ? "light-theme"
              : null
          }
          style={{
            color: theme.color,
            backgroundColor: path.startsWith("/billing")
              ? ""
              : theme.backgroundColor,
            overflow: path.startsWith("/messages/") ? "hidden" : "",
          }}
        >
          <Container
            style={{
              minHeight: "100dvh",
            }}
            fluid
          >
            <Row
              style={{
                borderTop: "none",
                borderBottom: "none",
                height: !path.startsWith("/account") ? "100%" : "",
                minHeight: "100vh",
              }}
            >
              {path !== "/" &&
                path !== "/settings/deactivated" &&
                path !== "/i/premium_sign_up" &&
                path !== "/help_connectify" &&
                !path.startsWith("/account") &&
                path !== "/billing/stripe/subscription" &&
                path !== "/explore" &&
                !path.endsWith("/communities/explore") &&
                path !== "/settings/apps_and_sessions" &&
                path !== "/settings/connected_accounts" &&
                path !== "/settings/delegate" &&
                path !== "/jobs" &&
                path !== "/help/connectify" &&
                path !== `/${userInfo?.username}/lists` &&
                path !== "/i/spaces/start" &&
                path !== "/i/flow/password_reset" &&
                !path.endsWith(1) && (
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
                  <Route
                    path="/i/bookmarks"
                    element={<BookmarksPage />}
                  ></Route>
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
                    path="/:postOwner/status/:postId/photo/1"
                    element={<PostDetailPageWithPicture />}
                  ></Route>
                  <Route
                    path="/messages/:chatRoomId"
                    element={<ChatDetailsPage />}
                  ></Route>

                  <Route
                    path="/profile/:userId/requests"
                    element={<FollowingRequestsDetailPage />}
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
                  <Route
                    path="/i/flow/add_phone"
                    element={<AddYourPhoneNumber />}
                  ></Route>
                  <Route path="/settings/email" element={<Email />}></Route>
                  <Route
                    path="/i/flow/password_reset"
                    element={<FlowPasswordReset />}
                  ></Route>
                  <Route
                    path="/settings/languages"
                    element={<Languages />}
                  ></Route>
                  <Route
                    path="/settings/your_twitter_data/language"
                    element={<YourTwitterDataLanguage />}
                  ></Route>
                  <Route
                    path="/i/flow/language_selector"
                    element={<LanguageSelector />}
                  ></Route>
                  <Route
                    path="/settings/language"
                    element={<ChangeDisplayLanguage />}
                  ></Route>
                  <Route
                    path="/i/flow/add_email"
                    element={<ChangeYourEmail />}
                  ></Route>
                  <Route
                    path="/settings/your_twitter_data/age"
                    element={<Age />}
                  ></Route>
                  <Route
                    path="/settings/account/automation"
                    element={<Automation />}
                  ></Route>
                  <Route
                    path="/i/flow/enable_automated_account"
                    element={<Enable_Automated_Account />}
                  ></Route>
                  <Route
                    path="/settings/your_twitter_data/gender"
                    element={<Gender />}
                  ></Route>
                  <Route path="/settings/country" element={<Country />}></Route>
                  <Route
                    path="/settings/audience_and_tagging"
                    element={<AudienceAndTagging />}
                  ></Route>
                  <Route path="/settings/tagging" element={<Tagging />}></Route>
                  <Route
                    path="/settings/monetization"
                    element={<MonetizationMain />}
                  ></Route>
                  <Route
                    path="/settings/superfollows/application/eligibility"
                    element={<SuperFollowsApplicationEligibility />}
                  ></Route>
                  <Route
                    path="/settings/ad_rev_share_eligibility"
                    element={<AdRevShareEligibility />}
                  ></Route>
                  <Route
                    path="/i/verified-choose"
                    element={<VerifiedChooseMain />}
                  ></Route>

                  <Route
                    path="/settings/manage_subscriptions"
                    element={<CreatorSubscriptionMain />}
                  ></Route>
                  <Route
                    path="/billing/stripe/subscription"
                    element={<BillingStripeSubscriptionMain />}
                  ></Route>
                  <Route
                    path="/settings/security_and_account_access"
                    element={<SecurityAndAccountAccessMain />}
                  ></Route>
                  <Route
                    path="/settings/security"
                    element={<SecurityMain />}
                  ></Route>
                  <Route
                    path="/settings/privacy_and_safety"
                    element={<PrivacyAndSafetyMain />}
                  ></Route>
                  <Route
                    path="/settings/notifications"
                    element={<NotificationMain />}
                  ></Route>
                  <Route
                    path="/settings/accessibility_display_and_languages"
                    element={<AccessibilityDisplayAndLanguagesMain />}
                  ></Route>
                  <Route path="/settings/display" element={<Display />}></Route>
                  <Route path="/settings/about" element={<About />}></Route>
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
                !path.startsWith("/account") &&
                (path !== "/i/flow" ||
                  path === "/i/flow/subscription_eligibility_check") &&
                path !== "/i/verified-choose" &&
                path !== "/i/flow/add_phone" &&
                path !== "/i/flow/language_selector" &&
                path !== "/i/flow/add_email" &&
                path !== "/i/flow/enable_automated_account" &&
                path !== "/billing/stripe/subscription" &&
                path !== "/explore" &&
                !path.endsWith("/communities/explore") &&
                path !== "/jobs" &&
                path !== "/help/connectify" &&
                path !== `/${userInfo?.username}/lists` &&
                path !== "/i/spaces/start" &&
                path !== "/i/flow/password_reset" &&
                !path.endsWith(1) && (
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
        </div>
      </SubscriptionStatusProvider>
    </>
  );
}

export default App;
