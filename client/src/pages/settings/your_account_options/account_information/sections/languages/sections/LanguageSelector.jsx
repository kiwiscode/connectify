import { Button, Col, Modal } from "react-bootstrap";
import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAntdMessageHandler } from "../../../../../../../utils/useAntdMessageHandler";
import useWindowDimensions from "../../../../../../../hooks/getWindowDimensions";
import { ThemeContext } from "../../../../../../../context/ThemeContext";
import { UserContext } from "../../../../../../../context/UserContext";
import SettingsNavigation from "../../../../../../../components/SettingsNavigation/SettingsNavigation";
import axios from "axios";
import LoadingSpinner from "../../../../../../../components/ui/LoadingSpinner";
import { useFontSizeHandler } from "../../../../../../../utils/useFontSizeHandler";
import { v4 as uuidv4 } from "uuid";

const API_URL = import.meta.env.VITE_APP_API_URL;

function LanguageSelector() {
  const { contextHolder } = useAntdMessageHandler;
  const { width } = useWindowDimensions();
  const [{ themeName }] = useContext(ThemeContext);
  const { getToken } = useContext(UserContext);
  const navigate = useNavigate();
  const [user, setUser] = useState([]);
  const [loading, setLoading] = useState(false);
  const [spoken_languages, setSpoken_languages] = useState([]);
  const [which_languages_do_you_speak, setWhich_languages_do_you_speak] =
    useState([]);

  const refreshActiveUser = () => {
    axios
      .get(`${API_URL}/profile`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
      .then((response) => {
        setSpoken_languages(response.data.user.which_languages_do_you_speak);

        setWhich_languages_do_you_speak((prevState) => [
          ...response.data.user.which_languages_do_you_speak,
          ...prevState,
        ]);

        setUser(response.data.user);
      })
      .catch((error) => {
        console.error("Error =>", error);
      });
  };

  useEffect(() => {
    refreshActiveUser();
  }, []);

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
  const [visibleLanguages, setVisibleLanguages] = useState(3);
  const [showMoreMessageVisible, setShowMoreMessageVisible] = useState(true);

  const handleShowMoreLanguages = () => {
    setShowMoreMessageVisible(false);
    setVisibleLanguages(
      (prevVisibleTweets) => prevVisibleTweets + languages.length - 3
    );
  };

  const modalBodyRef = useRef(null);
  const [isBottom, setIsBottom] = useState(false);
  const handleScroll = () => {
    const { scrollTop, scrollHeight, clientHeight } = modalBodyRef.current;
    if (scrollHeight - scrollTop === clientHeight) {
      setIsBottom(true);
    } else {
      setIsBottom(false);
    }
  };

  useEffect(() => {
    const modalBody = modalBodyRef.current;
    if (modalBody) {
      modalBody.addEventListener("scroll", handleScroll);
      return () => modalBody.removeEventListener("scroll", handleScroll);
    }
  }, []);

  const [cancelledSpokenLanguages, setCancelledSpokenLanguages] = useState([]);
  const [addedSpokenLanguages, setAddedSpokenLanguages] = useState([]);
  const add_which_languages_do_you_speak_to_user = async () => {
    setLoading(true);

    try {
      const response = await axios.post(
        `${API_URL}/add_which_languages_do_you_speak_to_user`,
        {
          languages: which_languages_do_you_speak,
        },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      if (response) {
        setTimeout(() => {
          navigate("/settings/languages");
        }, 300);
      }
    } catch (error) {
      console.error("Error =>", error);
    }
  };

  const {
    getFontSizeAndLineHeight31,
    getFontSizeAndLineHeight20,
    getFontSizeAndLineHeight17,
    getFontSizeAndLineHeight15,
    getFontSizeAndLineHeight13,
  } = useFontSizeHandler();
  const font31 = getFontSizeAndLineHeight31();
  const font20 = getFontSizeAndLineHeight20();
  const font17 = getFontSizeAndLineHeight17();
  const font15 = getFontSizeAndLineHeight15();
  const font13 = getFontSizeAndLineHeight13();

  return (
    <>
      {contextHolder}
      <SettingsNavigation />
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
          show={true}
          centered={true}
          dialogClassName={
            width <= 700 ? "modal-fullscreen" : "modal_center_with_width"
          }
          contentClassName={
            width > 700 && themeName === "dark-theme"
              ? "dark-theme-sub-modal settings-modal-type"
              : width > 700 && themeName !== "dark-theme"
              ? "light-theme-sub-modal settings-modal-type"
              : width <= 700 && themeName === "dark-theme"
              ? "dark-theme-sub-modal "
              : null
          }
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
                navigate("/?");
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
                zIndex: 999,
              }}
            >
              {" "}
              {/* <svg
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
              </svg> */}
              {/* <svg
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
              </svg> */}
            </div>
            <div
              style={{
                width: "100%",
                textAlign: "center",
                display: "flex",
                justifyContent: "center",
                position: "absolute",
                left: "0px",
              }}
            >
              <div
                style={{
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
            </div>
          </Modal.Header>

          <Modal.Body
            ref={modalBodyRef}
            className={`scrollbar-add scrollbar-add-${themeName}`}
            style={{
              padding: "0px",
              margin: "0px",
              maxHeight: "600px",
              overflowY: "auto",
              colorScheme: themeName === "dark-theme" ? "dark" : "light",
            }}
          >
            {!loading ? (
              <>
                <>
                  <div
                    className="mt-4"
                    style={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "center",
                      paddingLeft: width <= 700 ? "32px" : "80px",
                      paddingRight: width <= 700 ? "32px" : "80px",
                    }}
                  >
                    <div>
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
                        Which languages do you speak?
                      </div>
                      <div
                        style={{
                          fontSize: font15.fontSize,
                          lineHeight: font15.lineHeight,
                        }}
                        className={
                          themeName === "dark-theme"
                            ? "soft-grey-dark-theme-text-variant-2 mt-2 chirp-regular-font mt-2"
                            : "very-dark-gray-light-theme-text-variant-2 mt-2"
                        }
                      >
                        You’ll be able to see posts, people, and trends in any
                        languages you choose.
                      </div>{" "}
                      <div className="mt-4">
                        <div>
                          {spoken_languages
                            ?.sort()
                            .map((eachSpokenLanguage) => {
                              return (
                                <div key={uuidv4()}>
                                  <div
                                    onClick={() => {
                                      if (
                                        !cancelledSpokenLanguages.includes(
                                          eachSpokenLanguage
                                        )
                                      ) {
                                        setCancelledSpokenLanguages(
                                          (prevState) => [
                                            eachSpokenLanguage,
                                            ...prevState,
                                          ]
                                        );
                                        const shallowCoppy =
                                          which_languages_do_you_speak;
                                        const filteredArray =
                                          shallowCoppy.filter(
                                            (eachLanguageName) => {
                                              return (
                                                eachLanguageName !==
                                                eachSpokenLanguage
                                              );
                                            }
                                          );

                                        setWhich_languages_do_you_speak(
                                          filteredArray
                                        );
                                      } else {
                                        setAddedSpokenLanguages((prevState) => [
                                          eachSpokenLanguage,
                                          ...prevState,
                                        ]);
                                      }
                                    }}
                                    className={
                                      eachSpokenLanguage === "Other"
                                        ? `mt-2 mb-5`
                                        : "mt-2"
                                    }
                                    style={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                      fontSize: font15.fontSize,
                                      lineHeight: "20px",
                                      alignItems: "center",
                                    }}
                                  >
                                    <div
                                      className={
                                        themeName === "dark-theme"
                                          ? "soft-grey-dark-theme-text-variant-1 chirp-regular-font "
                                          : "very-dark-gray-light-theme-text-variant-1 chirp-regular-font "
                                      }
                                    >
                                      {eachSpokenLanguage}
                                    </div>
                                    <div>
                                      {" "}
                                      <div
                                        style={{
                                          width: "36px",
                                          height: "36px",
                                          borderRadius: "50%",
                                          cursor: "pointer",
                                          position: "relative",
                                        }}
                                        className={
                                          (themeName === "dark-theme" &&
                                            !cancelledSpokenLanguages.includes(
                                              eachSpokenLanguage
                                            )) ||
                                          addedSpokenLanguages.includes(
                                            eachSpokenLanguage
                                          )
                                            ? "hover-background-effect-clicked-dark-theme"
                                            : (themeName !== "dark-theme" &&
                                                !cancelledSpokenLanguages.includes(
                                                  eachSpokenLanguage
                                                )) ||
                                              addedSpokenLanguages.includes(
                                                eachSpokenLanguage
                                              )
                                            ? "hover-background-effect-clicked-light-theme"
                                            : (themeName === "dark-theme" &&
                                                cancelledSpokenLanguages.includes(
                                                  eachSpokenLanguage
                                                )) ||
                                              addedSpokenLanguages.includes(
                                                eachSpokenLanguage
                                              )
                                            ? "hover-background-effect-dark-theme"
                                            : (themeName !== "dark-theme" &&
                                                cancelledSpokenLanguages.includes(
                                                  eachSpokenLanguage
                                                )) ||
                                              addedSpokenLanguages.includes(
                                                eachSpokenLanguage
                                              )
                                            ? "hover-background-effect-light-theme"
                                            : ""
                                        }
                                      >
                                        <div
                                          style={{
                                            backgroundColor:
                                              !cancelledSpokenLanguages.includes(
                                                eachSpokenLanguage
                                              ) ||
                                              addedSpokenLanguages.includes(
                                                eachSpokenLanguage
                                              )
                                                ? "#1d9bf0"
                                                : "transparent",
                                            border:
                                              !cancelledSpokenLanguages.includes(
                                                eachSpokenLanguage
                                              ) ||
                                              addedSpokenLanguages.includes(
                                                eachSpokenLanguage
                                              )
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
                                              bottom: "2px",
                                              display:
                                                !cancelledSpokenLanguages.includes(
                                                  eachSpokenLanguage
                                                ) ||
                                                addedSpokenLanguages.includes(
                                                  eachSpokenLanguage
                                                )
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
                                  </div>{" "}
                                  {eachSpokenLanguage !== "Other" && (
                                    <div
                                      className="mt-2"
                                      style={{
                                        borderTop:
                                          themeName !== "dark-theme"
                                            ? "1px solid rgba(0, 0, 0, 0.1)"
                                            : // : "0.1px solid rgb(70, 70, 70)",
                                              "1px solid rgb(70, 70, 70)",
                                      }}
                                    ></div>
                                  )}
                                </div>
                              );
                            })}
                        </div>
                        {languages
                          .slice(0, visibleLanguages)
                          .map((eachLanguage) => {
                            return (
                              <div key={uuidv4()}>
                                {!spoken_languages.includes(
                                  eachLanguage.name
                                ) && (
                                  <>
                                    <div
                                      onClick={() => {
                                        if (
                                          !which_languages_do_you_speak.includes(
                                            eachLanguage.name
                                          )
                                        ) {
                                          setWhich_languages_do_you_speak(
                                            (prevState) => [
                                              eachLanguage.name,
                                              ...prevState,
                                            ]
                                          );
                                        } else {
                                          const shallowCoppy =
                                            which_languages_do_you_speak;
                                          const filteredArray =
                                            shallowCoppy.filter(
                                              (eachLanguageName) => {
                                                return (
                                                  eachLanguageName !==
                                                  eachLanguage.name
                                                );
                                              }
                                            );

                                          setWhich_languages_do_you_speak(
                                            filteredArray
                                          );
                                        }
                                      }}
                                      className={
                                        eachLanguage.name === "Other"
                                          ? `mt-2 mb-5`
                                          : "mt-2"
                                      }
                                      style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        fontSize: font15.fontSize,
                                        lineHeight: font15.lineHeight,
                                        alignItems: "center",
                                      }}
                                    >
                                      <div
                                        className={
                                          themeName === "dark-theme"
                                            ? "soft-grey-dark-theme-text-variant-1 chirp-regular-font "
                                            : "very-dark-gray-light-theme-text-variant-1 chirp-regular-font "
                                        }
                                      >
                                        {eachLanguage.name}
                                      </div>
                                      <div>
                                        {" "}
                                        <div
                                          style={{
                                            width: "36px",
                                            height: "36px",
                                            borderRadius: "50%",
                                            cursor: "pointer",
                                            position: "relative",
                                          }}
                                          className={
                                            themeName === "dark-theme" &&
                                            which_languages_do_you_speak.includes(
                                              eachLanguage.name
                                            )
                                              ? "hover-background-effect-clicked-dark-theme"
                                              : themeName !== "dark-theme" &&
                                                which_languages_do_you_speak.includes(
                                                  eachLanguage.name
                                                )
                                              ? "hover-background-effect-clicked-light-theme"
                                              : themeName === "dark-theme" &&
                                                !which_languages_do_you_speak.includes(
                                                  eachLanguage.name
                                                )
                                              ? "hover-background-effect-dark-theme"
                                              : themeName !== "dark-theme" &&
                                                !which_languages_do_you_speak.includes(
                                                  eachLanguage.name
                                                )
                                              ? "hover-background-effect-light-theme"
                                              : ""
                                          }
                                        >
                                          <div
                                            style={{
                                              backgroundColor:
                                                which_languages_do_you_speak.includes(
                                                  eachLanguage.name
                                                )
                                                  ? "#1d9bf0"
                                                  : "transparent",
                                              border:
                                                which_languages_do_you_speak.includes(
                                                  eachLanguage.name
                                                )
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
                                                bottom: "2px",
                                                display:
                                                  which_languages_do_you_speak.includes(
                                                    eachLanguage.name
                                                  )
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
                                    </div>{" "}
                                    {eachLanguage.name !== "Other" && (
                                      <div
                                        className="mt-2"
                                        style={{
                                          borderTop:
                                            themeName !== "dark-theme"
                                              ? "1px solid rgba(0, 0, 0, 0.1)"
                                              : // : "0.1px solid rgb(70, 70, 70)",
                                                "1px solid rgb(70, 70, 70)",
                                        }}
                                      ></div>
                                    )}
                                  </>
                                )}
                              </div>
                            );
                          })}{" "}
                      </div>
                      {showMoreMessageVisible && (
                        <div
                          onClick={handleShowMoreLanguages}
                          className={
                            themeName === "dark-theme"
                              ? "dark-theme-stylish-blue-background-color chirp-regular-font"
                              : "light-theme-stylish-blue-background-color chirp-regular-font"
                          }
                          style={{
                            cursor: "pointer",
                            textAlign: "center",
                            padding: "16px 0px",
                            color: "#1C9BEF",
                            fontSize: font15.fontSize,
                            lineHeight: font15.lineHeight,
                          }}
                        >
                          Show more
                        </div>
                      )}
                    </div>
                  </div>
                </>
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
          <div
            style={{
              paddingLeft: width <= 700 ? "32px" : "80px",
              paddingRight: width <= 700 ? "32px" : "80px",
              minHeight: "100px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              filter: isBottom
                ? themeName === "dark-theme"
                  ? "drop-shadow(rgb(51, 54, 57) 0px -1px 1px)"
                  : ""
                : "",
              boxShadow: isBottom
                ? themeName === "dark-theme"
                  ? "inset 0px 4px 3px -3px rgba(50, 50, 50, 0.75)"
                  : "inset 0px 4px 3px -3px rgba(101, 119, 134, 0.15)"
                : "",
            }}
          >
            <div
              style={{
                width: "100%",
              }}
            >
              <Button
                onClick={add_which_languages_do_you_speak_to_user}
                style={{
                  width: "100%",
                  minHeight: "52px",
                  border: "none",
                }}
                className={
                  themeName === "dark-theme"
                    ? "background-hover-next-btn-dark-theme soft-grey-dark-theme-text-variant-1 chirp-bold-font"
                    : "background-hover-next-btn-light-theme very-dark-gray-light-theme-text-variant-1 chirp-bold-font"
                }
              >
                <span
                  style={{
                    fontSize: font17.fontSize,
                    lineHeight: font17.lineHeight,
                  }}
                >
                  Done
                </span>
              </Button>
            </div>
          </div>
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
            Languages
          </div>
        </div>{" "}
        <div
          className={
            themeName === "dark-theme"
              ? "soft-grey-dark-theme-text-variant-2 mt-4 chirp-regular-font"
              : "very-dark-gray-light-theme-text-variant-2 mt-4 chirp-regular-font"
          }
          style={{
            paddingLeft: "16px",
            fontSize: font13.fontSize,
            lineHeight: font13.lineHeight,
          }}
        >
          Manage which languages are used to personalize your C experience.
        </div>
        <div
          className={
            themeName === "dark-theme"
              ? "soft-grey-dark-theme-text-variant-1 mt-4 chirp-bold-font"
              : "very-dark-gray-light-theme-text-variant-1 mt-4 chirp-bold-font"
          }
          style={{
            paddingLeft: "16px",
            fontSize: font20.fontSize,
            lineHeight: font20.lineHeight,
          }}
        >
          Display language
        </div>
        <div
          className={
            themeName === "dark-theme"
              ? "soft-grey-dark-theme-text-variant-2 mt-4 chirp-regular-font"
              : "very-dark-gray-light-theme-text-variant-2 mt-4 chirp-regular-font"
          }
          style={{
            paddingLeft: "16px",
            fontSize: font13.fontSize,
            lineHeight: font13.lineHeight,
          }}
        >
          Select your preferred language for headlines, buttons, and other text
          from C.
        </div>
        <div
          onClick={() => {
            navigate("/settings/language");
          }}
          className={
            themeName === "dark-theme"
              ? "dark-hover-effect mt-3"
              : "light-hover-effect mt-3"
          }
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "12px 16px",
          }}
        >
          <div>
            <div
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
              Display language
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
              {!user.displayLanguage ? "English" : user.displayLanguage}
            </div>
          </div>
          <div>
            <svg
              fill={themeName === "dark-theme" ? "#71767a" : "#536371"}
              width={`${1.25}em`}
              height={`${1.25}em`}
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <g>
                <path d="M14.586 12L7.543 4.96l1.414-1.42L17.414 12l-8.457 8.46-1.414-1.42L14.586 12z"></path>
              </g>
            </svg>
          </div>
        </div>
        <div
          className="mt-1"
          style={{
            borderBottom:
              themeName !== "dark-theme"
                ? "1px solid rgba(0, 0, 0, 0.1)"
                : // : "0.1px solid rgb(70, 70, 70)",
                  "1px solid rgb(70, 70, 70)",

            width: "100%",
          }}
        ></div>
        <div
          className={
            themeName === "dark-theme"
              ? "soft-grey-dark-theme-text-variant-1 mt-4 chirp-bold-font"
              : "very-dark-gray-light-theme-text-variant-1 mt-4 chirp-bold-font"
          }
          style={{
            paddingLeft: "16px",
            fontSize: font20.fontSize,
            lineHeight: font20.lineHeight,
          }}
        >
          Select additional languages
        </div>
        <div
          className={
            themeName === "dark-theme"
              ? "soft-grey-dark-theme-text-variant-2 mt-4 chirp-regular-font"
              : "very-dark-gray-light-theme-text-variant-2 mt-4 chirp-regular-font"
          }
          style={{
            paddingLeft: "16px",
            fontSize: font13.fontSize,
            lineHeight: font13.lineHeight,
          }}
        >
          Select additional languages for the content you want to see on C.
        </div>
        <div
          onClick={() => {
            navigate("/i/flow/language_selector");
          }}
          className={
            themeName === "dark-theme"
              ? "dark-hover-effect mt-3"
              : "light-hover-effect mt-3"
          }
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "12px 16px",
          }}
        >
          <div
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
            Additional languages you speak
          </div>
          <div>
            <svg
              fill={themeName === "dark-theme" ? "#71767a" : "#536371"}
              width={`${1.25}em`}
              height={`${1.25}em`}
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <g>
                <path d="M14.586 12L7.543 4.96l1.414-1.42L17.414 12l-8.457 8.46-1.414-1.42L14.586 12z"></path>
              </g>
            </svg>
          </div>
        </div>
        <div
          className="mt-1"
          style={{
            borderBottom:
              themeName !== "dark-theme"
                ? "1px solid rgba(0, 0, 0, 0.1)"
                : // : "0.1px solid rgb(70, 70, 70)",
                  "1px solid rgb(70, 70, 70)",

            width: "100%",
          }}
        ></div>
        <div
          className={
            themeName === "dark-theme"
              ? "soft-grey-dark-theme-text-variant-1 mt-4 chirp-bold-font"
              : "very-dark-gray-light-theme-text-variant-1 mt-4 chirp-bold-font"
          }
          style={{
            paddingLeft: "16px",
            fontSize: font20.fontSize,
            lineHeight: font20.lineHeight,
          }}
        >
          Languages you may know
        </div>{" "}
        <div
          className={
            themeName === "dark-theme"
              ? "soft-grey-dark-theme-text-variant-2 mt-4 chirp-regular-font"
              : "very-dark-gray-light-theme-text-variant-2 mt-4 chirp-regular-font"
          }
          style={{
            paddingLeft: "16px",
            fontSize: font13.fontSize,
            lineHeight: font13.lineHeight,
          }}
        >
          Manage the languages C inferred based on your activity, such as the
          accounts you follow and the posts you engage with.
        </div>{" "}
        <div
          onClick={() => {
            navigate("/settings/your_c_data/language");
          }}
          className={
            themeName === "dark-theme"
              ? "dark-hover-effect mt-3"
              : "light-hover-effect mt-3"
          }
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "12px 16px",
          }}
        >
          <div
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
            Languages you may know
          </div>
          <div>
            <svg
              fill={themeName === "dark-theme" ? "#71767a" : "#536371"}
              width={`${1.25}em`}
              height={`${1.25}em`}
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <g>
                <path d="M14.586 12L7.543 4.96l1.414-1.42L17.414 12l-8.457 8.46-1.414-1.42L14.586 12z"></path>
              </g>
            </svg>
          </div>
        </div>
      </Col>
    </>
  );
}

export default LanguageSelector;
