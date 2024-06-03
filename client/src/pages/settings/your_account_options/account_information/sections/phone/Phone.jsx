import { Col } from "react-bootstrap";
import SettingsNavigation from "../../../../../../components/SettingsNavigation/SettingsNavigation";
import { useAntdMessageHandler } from "../../../../../../utils/useAntdMessageHandler";
import useWindowDimensions from "../../../../../../hooks/getWindowDimensions";
import { useContext } from "react";
import { ThemeContext } from "../../../../../../context/ThemeContext";
import { useNavigate } from "react-router-dom";

function Phone() {
  const { contextHolder } = useAntdMessageHandler();
  const { width } = useWindowDimensions();
  const [{ theme, themeName }] = useContext(ThemeContext);
  const navigate = useNavigate();
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
            className={
              themeName === "dark-theme"
                ? "mt-2 first-head chirp-bold-font soft-grey-dark-theme-text-variant-1"
                : "mt-2 first-head chirp-bold-font very-dark-gray-light-theme-text-variant-1"
            }
          >
            Change phone
          </div>
        </div>{" "}
        <div
          onClick={() => {
            navigate("/i/flow/add_phone");
          }}
          className={
            themeName === "dark-theme"
              ? "dark-theme-stylish-blue-background-color mt-1"
              : "light-theme-stylish-blue-background-color mt-1"
          }
          style={{
            padding: "16px",
            textAlign: "center",
            color: "rgb(29, 155, 240)",
            lineHeight: "20px",
            fontSize: "15px",
            fontWeight: "400",
            cursor: "pointer",
          }}
        >
          Add phone number
        </div>
      </Col>
    </>
  );
}

export default Phone;
