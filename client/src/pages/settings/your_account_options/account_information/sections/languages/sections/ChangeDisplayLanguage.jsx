import { Button, Col, Modal } from "react-bootstrap";
import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAntdMessageHandler } from "../../../../../../../utils/useAntdMessageHandler";
import useWindowDimensions from "../../../../../../../hooks/getWindowDimensions";
import { ThemeContext } from "../../../../../../../context/ThemeContext";
import SettingsNavigation from "../../../../../../../components/SettingsNavigation/SettingsNavigation";
import { NavigationHistoryContext } from "../../../../../../../context/NavigationHistoryContext";
import axios from "axios";
import { UserContext } from "../../../../../../../context/UserContext";
import LoadingSpinner from "../../../../../../../components/ui/LoadingSpinner";
import BootstrapTooltip from "../../../../../../../components/BootstrapToolTip/BootstrapToolTip";

// when working on local version
const API_URL = "http://localhost:3000";

// when working on deployment version
// ?

function ChangeDisplayLanguage() {
  const { contextHolder } = useAntdMessageHandler();
  const { width } = useWindowDimensions();
  const [{ theme, themeName }] = useContext(ThemeContext);
  const navigate = useNavigate();
  const { userInfo, getToken } = useContext(UserContext);
  const { navigationHistoryArray } = useContext(NavigationHistoryContext);
  const [user, setUser] = useState([]);
  console.log("Navigation history =>", navigationHistoryArray);
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
  const [language, setLanguage] = useState("");
  const [loading, setLoading] = useState();
  const [showPopoverLanguages, setShowPopoverLanguages] = useState(false);
  const selectRef = useRef(null);

  const handleShowOptions = () => {
    setShowPopoverLanguages(true);
    selectRef.current.focus();
  };

  const languages = [
    { code: "en", name: "English" },
    { code: "de", name: "German - Deutsch" },
    { code: "tr", name: "Turkish - Türkçe" },
    { code: "am", name: "Amharic - አማርኛ" },
    { code: "ar", name: "Arabic - العربية" },
    { code: "hy", name: "Armenian - հայերեն" },
    { code: "bn", name: "Bangla - বাংলা" },
    { code: "eu", name: "Basque - euskara" },
    { code: "bg", name: "Bulgarian - български" },
    { code: "my", name: "Burmese - မြန်မာ" },
    { code: "ca", name: "Catalan - català" },
    { code: "ckb", name: "Central Kurdish - کوردیی ناوەندی" },
    { code: "zh", name: "Chinese - 中文" },
    { code: "cs", name: "Czech - čeština" },
    { code: "da", name: "Danish - dansk" },
    { code: "dv", name: "Divehi" },
    { code: "nl", name: "Dutch - Nederlands" },
    { code: "eo", name: "Esperanto" },
    { code: "et", name: "Estonian - eesti" },
    { code: "fi", name: "Finnish - suomi" },
    { code: "fr", name: "French - français" },
    { code: "ka", name: "Georgian - ქართული" },
    { code: "el", name: "Greek - Ελληνικά" },
    { code: "gu", name: "Gujarati - ગુજરાતી" },
    { code: "ht", name: "Haitian Creole" },
    { code: "he", name: "Hebrew - עברית" },
    { code: "hi", name: "Hindi - हिन्दी" },
    { code: "hu", name: "Hungarian - magyar" },
    { code: "is", name: "Icelandic - íslenska" },
    { code: "id", name: "Indonesian - Indonesia" },
    { code: "it", name: "Italian - italiano" },
    { code: "ja", name: "Japanese - 日本語" },
    { code: "kn", name: "Kannada - ಕನ್ನಡ" },
    { code: "km", name: "Khmer - ខ្មែរ" },
    { code: "ko", name: "Korean - 한국어" },
    { code: "lo", name: "Lao - ລາວ" },
    { code: "lv", name: "Latvian - latviešu" },
    { code: "lt", name: "Lithuanian - lietuvių" },
    { code: "ms", name: "Malay - Melayu" },
    { code: "ml", name: "Malayalam - മലയാളം" },
    { code: "mr", name: "Marathi - मराठी" },
    { code: "ne", name: "Nepali - नेपाली" },
    { code: "no", name: "Norwegian - norsk" },
    { code: "or", name: "Odia - ଓଡ଼ିଆ" },
    { code: "ps", name: "Pashto - پښتو" },
    { code: "fa", name: "Persian - فارسی" },
    { code: "pl", name: "Polish - polski" },
    { code: "pt", name: "Portuguese - português" },
    { code: "pa", name: "Punjabi - ਪੰਜਾਬੀ" },
    { code: "ro", name: "Romanian - română" },
    { code: "ru", name: "Russian - русский" },
    { code: "sr", name: "Serbian - српски" },
    { code: "sd", name: "Sindhi - سنڌي" },
    { code: "si", name: "Sinhala - සිංහල" },
    { code: "sl", name: "Slovenian - slovenščina" },
    { code: "es", name: "Spanish - español" },
    { code: "sv", name: "Swedish - svenska" },
    { code: "tl", name: "Tagalog" },
    { code: "ta", name: "Tamil - தமிழ்" },
    { code: "te", name: "Telugu - తెలుగు" },
    { code: "th", name: "Thai - ไทย" },
    { code: "bo", name: "Tibetan - བོད་སྐད་" },
    { code: "uk", name: "Ukrainian - українська" },
    { code: "ur", name: "Urdu - اردو" },
    { code: "ug", name: "Uyghur - ئۇيغۇرچە" },
    { code: "vi", name: "Vietnamese - Tiếng Việt" },
    { code: "cy", name: "Welsh - Cymraeg" },
    { code: "other", name: "Other" },
  ];

  const changeDisplayLanguage = () => {
    console.log("Hello world we gehts ??");
  };

  return (
    <>
      {" "}
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
        <div className="settings-header-with-arrow ">
          <div
            onClick={() => {
              if (navigationHistoryArray[1] !== "/i/flow/add_phone") {
                navigate(-1);
              } else {
                navigate("/settings/account");
              }
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
            className={
              themeName === "dark-theme"
                ? "mt-2 first-head chirp-bold-font soft-grey-dark-theme-text-variant-1"
                : "mt-2 first-head chirp-bold-font very-dark-gray-light-theme-text-variant-1"
            }
          >
            Change display language
          </div>
        </div>{" "}
        <div
          className="mt-4"
          style={{
            paddingLeft: "16px",
            paddingRight: "16px",
            maxHeight: "58px",
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
              borderWidth: showPopoverLanguages ? "2px" : "1px",
              borderColor: showPopoverLanguages
                ? "#1d9bf0"
                : themeName === "dark-theme"
                ? "rgb(70,70,70)"
                : "#cfd9de",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <div
                className="main-outline-text-year-picker"
                style={{
                  padding: "0px 8px",
                  fontSize: "14px",
                  lineHeight: "16px",
                  fontWeight: "400",
                  color: showPopoverLanguages
                    ? "#1d9bf0"
                    : "rgba(83,100,113,1.00)",
                }}
              >
                <span
                  style={{
                    color: themeName === "dark-theme" ? "#71767A" : "",
                  }}
                >
                  Display language
                </span>
                <div
                  className={
                    themeName === "dark-theme"
                      ? "soft-grey-dark-theme-text-variant-1 mt-2 selected-year-string-parent-div"
                      : "very-dark-gray-light-theme-text-variant-1 mt-2 selected-year-string-parent-div"
                  }
                  style={{
                    fontSize: "17px",
                    lineHeight: "20px",
                    color: themeName === "dark-theme" ? "white" : "black",
                  }}
                >
                  {user.preferredLanguage && !language ? (
                    <>{user.preferredLanguage}</>
                  ) : (
                    <>{language}</>
                  )}
                </div>
              </div>
              <div
                style={{
                  position: "relative",
                  top: "10px",
                }}
              >
                <svg
                  width="24"
                  height="24"
                  color={
                    showPopoverLanguages
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
                  <g className="path-parent-g-year-picker">
                    <path d="M3.543 8.96l1.414-1.42L12 14.59l7.043-7.05 1.414 1.42L12 17.41 3.543 8.96z"></path>
                  </g>
                </svg>
              </div>
            </div>
          </div>{" "}
          <select
            onClick={handleShowOptions}
            onBlur={() => setShowPopoverLanguages(false)}
            ref={selectRef}
            style={{
              position: "relative",
              bottom: "58px",
              borderRadius: "4px",
              cursor: "pointer",
              color: "#536471",
              width: "100%",
              // minHeight: "58px",
              padding: "4px",
              border: "1px solid rgb(207, 217, 222)",
              borderWidth: showPopoverLanguages ? "2px" : "1px",
              opacity: 0,
            }}
            value={language}
            onChange={(e) => {
              setLanguage(e.target.value);
            }}
          >
            {languages.map((language, index) => (
              <option key={language._id} value={language.name}>
                {language.name}
              </option>
            ))}
          </select>
        </div>
        <div
          className={
            themeName === "dark-theme"
              ? "soft-grey-dark-theme-text-variant-2 chirp-regular-font"
              : "very-dark-gray-light-theme-text-variant-2 chirp-regular-font"
          }
          style={{
            paddingLeft: "24px",
            paddingRight: "24px",
            fontSize: "13px",
            lineHeight: "20px",
          }}
        >
          Select your preferred language for headlines, buttons, and other text
          from C on this account. This does not change the language of the
          content you see in your timeline.
        </div>
        <div
          className="mt-4"
          style={{
            borderTop:
              themeName !== "dark-theme"
                ? "1px solid rgba(0, 0, 0, 0.1)"
                : // : "0.1px solid rgb(70, 70, 70)",
                  "1px solid rgb(70, 70, 70)",
          }}
        ></div>
        <div
          style={{
            textAlign: "right",
            width: "100%",
          }}
        >
          <BootstrapTooltip
            title="This feature is not yet active. "
            themeName={
              themeName === "dark-theme" ? "dark-theme" : "light-theme"
            }
          >
            <Button
              style={{
                height: "45px",
                marginTop: "15px",
                position: "relative",
                right: "20px",
                border: "none",
                maxWidth: "69.17px",
                maxHeight: "36px",
                minHeight: "36px",
                fontSize: "15px",
                cursor:
                  language?.length && language !== userInfo.preferredLanguage
                    ? "default"
                    : // "pointer"
                      "default",
                // backgroundColor:
                //   language?.length && language !== userInfo.preferredLanguage
                //     ? "#99CDF8"
                //     : // ""
                //       "#99CDF8",
                opacity:
                  language?.length && language !== userInfo.preferredLanguage
                    ? "0.5"
                    : null,
              }}
              onClick={
                language?.length < 1 && language !== userInfo.preferredLanguage
                  ? null
                  : null
                // () => changeDisplayLanguage()
              }
              className={
                language?.length
                  ? "change-password-btn"
                  : "disabled-change-password-btn"
              }
            >
              Save
            </Button>
          </BootstrapTooltip>
        </div>
      </Col>
    </>
  );
}

export default ChangeDisplayLanguage;
