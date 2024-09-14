import { Col } from "react-bootstrap";
import SettingsNavigation from "../../../../../../components/SettingsNavigation/SettingsNavigation";
import { useAntdMessageHandler } from "../../../../../../utils/useAntdMessageHandler";
import useWindowDimensions from "../../../../../../hooks/getWindowDimensions";
import { useContext } from "react";
import { ThemeContext } from "../../../../../../context/ThemeContext";
import { UserContext } from "../../../../../../context/UserContext";
import { useNavigate } from "react-router-dom";
import { useFontSizeHandler } from "../../../../../../utils/useFontSizeHandler";

function Age() {
  const { contextHolder } = useAntdMessageHandler;
  const { width } = useWindowDimensions();
  const [{ theme, themeName }] = useContext(ThemeContext);
  const { userInfo } = useContext(UserContext);
  const navigate = useNavigate();
  const { getFontSizeAndLineHeight20, getFontSizeAndLineHeight15 } =
    useFontSizeHandler();
  const font20 = getFontSizeAndLineHeight20();
  const font15 = getFontSizeAndLineHeight15();
  return (
    <>
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
            Age
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
            fontSize: font15.fontSize,
            lineHeight: font15.lineHeight,
          }}
        >
          These are the age ranges associated with you.
        </div>
        <div
          className="mt-3"
          style={{
            borderTop:
              themeName !== "dark-theme"
                ? "1px solid rgba(0, 0, 0, 0.1)"
                : // : "0.1px solid rgb(70, 70, 70)",
                  "1px solid rgb(70, 70, 70)",
          }}
        ></div>
        <div
          className={
            themeName === "dark-theme"
              ? "soft-grey-dark-theme-text-variant-1 mt-3 chirp-regular-font"
              : "very-dark-gray-light-theme-text-variant-1 mt-3 chirp-regular-font"
          }
          style={{
            paddingLeft: "16px",
            fontSize: font15.fontSize,
            lineHeight: font15.lineHeight,
          }}
        >
          {userInfo.birthDate?.year && (
            <>{new Date().getFullYear() - userInfo.birthDate.year}</>
          )}
        </div>
        <div
          className="mt-3"
          style={{
            borderTop:
              themeName !== "dark-theme"
                ? "1px solid rgba(0, 0, 0, 0.1)"
                : // : "0.1px solid rgb(70, 70, 70)",
                  "1px solid rgb(70, 70, 70)",
          }}
        ></div>
        <div
          className={
            themeName === "dark-theme"
              ? "soft-grey-dark-theme-text-variant-2 mt-3 chirp-regular-font"
              : "very-dark-gray-light-theme-text-variant-2 mt-3 chirp-regular-font"
          }
          style={{
            paddingLeft: "16px",
            fontSize: font15.fontSize,
            lineHeight: font15.lineHeight,
          }}
        >
          Not right? You can add your date of birth to your profile without
          sharing it publicly.
        </div>
      </Col>
    </>
  );
}

export default Age;
