import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";
import { Button, Col, Container, Row } from "react-bootstrap";
import useWindowDimensions from "../hooks/getWindowDimensions";

function PremiumSignupPage() {
  const navigate = useNavigate();
  const [{ theme, themeName, activeFontSizeOption }] = useContext(ThemeContext);
  const { width } = useWindowDimensions();

  console.log("Width =>", width);

  const [selectedPremiumOption, setSelectedPremiumOption] = useState(
    "Annual plan basic-option"
  );

  return (
    <>
      <Container
        fluid
        style={{
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        <Row>
          <Col xl={1}>
            <div
              className={
                themeName === "dark-theme"
                  ? `close-button-${themeName} mt-4 ml-2`
                  : `close-button mt-4 ml-2 `
              }
              style={{
                display: "inline-flex",
                borderRadius: "50%",
                cursor: "pointer",
              }}
            >
              <svg
                style={{
                  border: "none",
                  fontSize: "15px",
                  margin: "5px",
                }}
                onClick={() => navigate(-1)}
                width={20}
                height={20}
                color={themeName === "dark-theme" ? "white" : "rgb(15,20,25)"}
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
              className={
                themeName === "dark-theme"
                  ? "color-dark-theme"
                  : "color-light-theme"
              }
            ></div>
          </Col>
          <Col
            style={{
              zIndex: 9999,
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "75px",
              }}
              className="wrapper_premium_sign_up"
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                className="header_premium_sign_up"
              >
                <div
                  style={{
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      fontSize: width < 600 ? "48px" : "64px",
                      fontWeight: "700",
                      lineHeight: width < 600 ? "55px" : "70px",
                      color: themeName === "dark-theme" ? "white" : "black",
                      letterSpacing: "1.2px",
                    }}
                  >
                    Upgrade to Premium
                  </div>
                  <div
                    style={{
                      fontSize: "18px",
                      fontWeight: "400",
                      lineHeight: "24px",
                      color: themeName === "dark-theme" ? "#B5B9BD" : "#36444F",
                      maxWidth: "723px",
                      textAlign: "left",
                      marginTop: "35px",
                    }}
                  >
                    <span>
                      Enjoy an enhanced experience, exclusive creator tools,
                      top-tier verification and security.
                    </span>
                    <div
                      style={{
                        textAlign: "center",
                      }}
                    >
                      (For organizations,{" "}
                      <span
                        onClick={() => navigate("/i/verified-orgs-signup")}
                        style={{
                          fontSize: "18px",
                          fontWeight: "700",
                          lineHeight: "24px",
                          color: themeName === "dark-theme" ? "white" : "black",
                          textDecoration: "underline",
                          cursor: "pointer",
                        }}
                      >
                        sign up here)
                      </span>
                    </div>
                  </div>
                  <div
                    style={{
                      cursor: "pointer",
                      marginTop: "35px",
                      display: "inline-flex",
                    }}
                  >
                    <div
                      style={{
                        backgroundColor:
                          themeName === "dark-theme" ? "#202428" : "#EFF3F4",
                        display: "inline",
                        padding: "8px 4px",
                        borderRadius: "99999px",
                      }}
                    >
                      <span
                        onClick={() =>
                          setSelectedPremiumOption("Annual plan basic-option")
                        }
                        style={{
                          backgroundColor:
                            themeName === "dark-theme" &&
                            selectedPremiumOption === "Annual plan basic-option"
                              ? "black"
                              : themeName === "dark-theme" &&
                                selectedPremiumOption !==
                                  "Annual plan basic-option"
                              ? "#202327"
                              : themeName !== "dark-theme" &&
                                selectedPremiumOption ===
                                  "Annual plan basic-option"
                              ? "white"
                              : themeName !== "dark-theme" &&
                                selectedPremiumOption !==
                                  "Annual plan basic-option"
                              ? "#EEF3F4"
                              : null,
                          padding: "8px 8px",
                          borderRadius: "9999px",
                          color: themeName === "dark-theme" ? "white" : "black",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "15px",
                            fontWeight: "700",
                            lineHeight: "24px",
                            color:
                              themeName === "dark-theme" ? "white" : "black",
                          }}
                        >
                          Annual
                        </span>{" "}
                        <span
                          style={{
                            backgroundColor:
                              themeName === "dark-theme"
                                ? "#00251A"
                                : "#DAF8EB",
                            color:
                              themeName === "dark-theme" ? "#C1F1DC" : "black",
                            fontSize: "11px",
                            fontWeight: "700",
                            padding: "2px 4px",
                            borderRadius: "9999px",
                            position: "relative",
                            bottom: "1px",
                          }}
                        >
                          Best value
                        </span>
                      </span>
                      <span
                        onClick={() =>
                          setSelectedPremiumOption("Monthly plan basic-option")
                        }
                        style={{
                          padding: "8px 8px",
                          borderRadius: "99999px",

                          backgroundColor:
                            themeName === "dark-theme" &&
                            selectedPremiumOption ===
                              "Monthly plan basic-option"
                              ? "black"
                              : themeName === "dark-theme" &&
                                selectedPremiumOption !==
                                  "Monthly plan basic-option"
                              ? "#202327"
                              : themeName !== "dark-theme" &&
                                selectedPremiumOption ===
                                  "Monthly plan basic-option"
                              ? "white"
                              : themeName !== "dark-theme" &&
                                selectedPremiumOption !==
                                  "Monthly plan basic-option"
                              ? "#EEF3F4"
                              : null,
                          fontSize: "15px",
                          fontWeight: "700",
                          lineHeight: "24px",
                          color: themeName === "dark-theme" ? "white" : "black",
                        }}
                      >
                        Monthly
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: width < 600 ? "column" : "row",
                  justifyContent: "center",
                  gap: "2.5%",
                }}
                className="options_wrapper mt-4"
              >
                <div
                  style={{
                    backgroundColor: "yellow",
                    minWidth: "315px",
                    maxWidth: width < 600 ? "" : "315px",
                    minHeight: "432px",
                    borderRadius: "12px",
                    padding: "32px",
                    width: width < 600 ? "100%" : "",
                    marginBottom: "5%",
                    backgroundImage:
                      "linear-gradient(216.66deg, rgb(26, 29, 33) 2.89%, rgb(16, 16, 16) 97.26%), linear-gradient(rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.2) 100%)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      padding: "0px",
                      margin: "0px",
                    }}
                  >
                    <div
                      style={{
                        color: "white",
                        fontSize: "20px",
                        fontWeight: "400",
                        lineHeight: "24px",
                      }}
                    >
                      Basic
                    </div>
                    <div
                      className="mt-3"
                      style={{
                        color: "white",
                        fontSize: "36px",
                        fontWeight: "700",
                        lineHeight: "36px",
                      }}
                    >
                      {selectedPremiumOption === "Monthly plan basic-option"
                        ? "€3.57"
                        : selectedPremiumOption === "Annual plan basic-option"
                        ? "€3.17"
                        : null}{" "}
                      <span
                        style={{
                          color: "white",
                          fontSize: "15px",
                          fontWeight: "400",
                          lineHeight: "20px",
                        }}
                      >
                        / month
                      </span>
                    </div>
                    <div className="mt-2" style={{ color: "white" }}>
                      <span
                        style={{
                          color: "white",
                          fontSize: "15px",
                          fontWeight: "400",
                          lineHeight: "20px",
                        }}
                      >
                        {selectedPremiumOption === "Monthly plan basic-option"
                          ? "Billed monthly"
                          : selectedPremiumOption === "Annual plan basic-option"
                          ? `Billed annually`
                          : null}{" "}
                      </span>
                      {selectedPremiumOption === "Annual plan basic-option" && (
                        <span
                          style={{
                            backgroundColor:
                              themeName === "dark-theme"
                                ? "#00251A"
                                : "#DAF8EB",
                            color:
                              themeName === "dark-theme" ? "#C1F1DC" : "black",
                            fontSize: "11px",
                            fontWeight: "700",
                            padding: "2px 4px",
                            borderRadius: "9999px",
                            position: "relative",
                            display: "inline-flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          SAVE 11%
                        </span>
                      )}
                    </div>
                    <div className="mt-3">
                      <Button
                        style={{
                          maxWidth: "251px",
                          maxHeight: "36px",
                          backgroundColor: "#D1D9DD",
                          color: "black",
                          border: "none",
                          outlineStyle: "none",
                        }}
                      >
                        Subscribe
                      </Button>
                    </div>

                    <div
                      className="mt-3"
                      style={{
                        color: "white",
                        fontSize: "15px",
                        lineHeight: "20px",
                        fontWeight: "400",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "flex-end",
                        }}
                      >
                        <div>
                          <svg
                            height={`1.25em`}
                            width={`1.25em`}
                            fill="white"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                            className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-1gs4q39"
                          >
                            <g>
                              <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                            </g>
                          </svg>
                        </div>
                        <div
                          style={{
                            marginLeft: "5px",
                          }}
                        >
                          Small reply boost
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "flex-end",
                          marginTop: "5px",
                        }}
                      >
                        <div>
                          {" "}
                          <svg
                            height={`1.25em`}
                            width={`1.25em`}
                            fill="white"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                            className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-1gs4q39"
                          >
                            <g>
                              <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                            </g>
                          </svg>
                        </div>
                        <div
                          style={{
                            marginLeft: "5px",
                          }}
                        >
                          Encrypted direct messages
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "flex-end",
                          marginTop: "5px",
                        }}
                      >
                        <div>
                          {" "}
                          <svg
                            height={`1.25em`}
                            width={`1.25em`}
                            fill="white"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                            className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-1gs4q39"
                          >
                            <g>
                              <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                            </g>
                          </svg>
                        </div>
                        <div
                          style={{
                            marginLeft: "5px",
                          }}
                        >
                          Bookmark folders
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "flex-end",
                          marginTop: "5px",
                        }}
                      >
                        <div>
                          {" "}
                          <svg
                            height={`1.25em`}
                            width={`1.25em`}
                            fill="white"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                            className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-1gs4q39"
                          >
                            <g>
                              <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                            </g>
                          </svg>
                        </div>
                        <div
                          style={{
                            marginLeft: "5px",
                          }}
                        >
                          Highlights tab
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "flex-end",
                          marginTop: "5px",
                        }}
                      >
                        <div>
                          {" "}
                          <svg
                            height={`1.25em`}
                            width={`1.25em`}
                            fill="white"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                            className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-1gs4q39"
                          >
                            <g>
                              <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                            </g>
                          </svg>
                        </div>
                        <div
                          style={{
                            marginLeft: "5px",
                          }}
                        >
                          Edit post
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "flex-end",
                          marginTop: "5px",
                        }}
                      >
                        <div>
                          {" "}
                          <svg
                            height={`1.25em`}
                            width={`1.25em`}
                            fill="white"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                            className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-1gs4q39"
                          >
                            <g>
                              <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                            </g>
                          </svg>
                        </div>
                        <div
                          style={{
                            marginLeft: "5px",
                          }}
                        >
                          Post longer videos
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "flex-end",
                          marginTop: "5px",
                        }}
                      >
                        <div>
                          {" "}
                          <svg
                            height={`1.25em`}
                            width={`1.25em`}
                            fill="white"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                            className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-1gs4q39"
                          >
                            <g>
                              <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                            </g>
                          </svg>
                        </div>
                        <div
                          style={{
                            marginLeft: "5px",
                          }}
                        >
                          Hide your likes
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "flex-end",
                          marginTop: "5px",
                        }}
                      >
                        <div>
                          {" "}
                          <svg
                            height={`1.25em`}
                            width={`1.25em`}
                            fill="white"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                            className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-1gs4q39"
                          >
                            <g>
                              <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                            </g>
                          </svg>
                        </div>
                        <div
                          style={{
                            marginLeft: "5px",
                          }}
                        >
                          Longer posts
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    backgroundColor: "yellow",
                    minWidth: "315px",
                    maxWidth: width < 600 ? "" : "315px",
                    minHeight: "432px",
                    borderRadius: "12px",
                    padding: "32px",
                    width: width < 600 ? "100%" : "",
                    marginBottom: "5%",
                    backgroundImage:
                      "linear-gradient(216.66deg, rgb(26, 29, 33) 2.89%, rgb(16, 16, 16) 97.26%), linear-gradient(rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.2) 100%)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      padding: "0px",
                      margin: "0px",
                    }}
                  >
                    <div
                      style={{
                        color: "white",
                        fontSize: "20px",
                        fontWeight: "400",
                        lineHeight: "24px",
                      }}
                    >
                      Premium
                    </div>
                    <div
                      className="mt-3"
                      style={{
                        color: "white",
                        fontSize: "36px",
                        fontWeight: "700",
                        lineHeight: "36px",
                      }}
                    >
                      {selectedPremiumOption === "Monthly plan basic-option"
                        ? "€9.52"
                        : selectedPremiumOption === "Annual plan basic-option"
                        ? "€8.33"
                        : null}{" "}
                      <span
                        style={{
                          color: "white",
                          fontSize: "15px",
                          fontWeight: "400",
                          lineHeight: "20px",
                        }}
                      >
                        / month
                      </span>
                    </div>
                    <div className="mt-2" style={{ color: "white" }}>
                      <span
                        style={{
                          color: "white",
                          fontSize: "15px",
                          fontWeight: "400",
                          lineHeight: "20px",
                        }}
                      >
                        {selectedPremiumOption === "Monthly plan basic-option"
                          ? "Billed monthly"
                          : selectedPremiumOption === "Annual plan basic-option"
                          ? `Billed annually`
                          : null}{" "}
                      </span>
                      {selectedPremiumOption === "Annual plan basic-option" && (
                        <span
                          style={{
                            backgroundColor:
                              themeName === "dark-theme"
                                ? "#00251A"
                                : "#DAF8EB",
                            color:
                              themeName === "dark-theme" ? "#C1F1DC" : "black",
                            fontSize: "11px",
                            fontWeight: "700",
                            padding: "2px 4px",
                            borderRadius: "9999px",
                            position: "relative",
                            display: "inline-flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          SAVE 12%
                        </span>
                      )}
                    </div>
                    <div className="mt-3">
                      <Button
                        style={{
                          maxWidth: "251px",
                          maxHeight: "36px",
                          backgroundColor: "#D1D9DD",
                          color: "black",
                          border: "none",
                          outlineStyle: "none",
                        }}
                      >
                        Subscribe
                      </Button>
                    </div>
                    <div
                      className="mt-3"
                      style={{
                        color: "white",
                        fontWeight: "700",
                        fontSize: "15px",
                        lineHeight: " 20px",
                      }}
                    >
                      Everything in Basic, and
                    </div>
                    <div
                      className="mt-2"
                      style={{
                        color: "white",
                        fontSize: "15px",
                        lineHeight: "20px",
                        fontWeight: "400",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "flex-end",
                        }}
                      >
                        <div>
                          {" "}
                          <svg
                            height={`1.25em`}
                            width={`1.25em`}
                            fill="white"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                            className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-1gs4q39"
                          >
                            <g>
                              <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                            </g>
                          </svg>
                        </div>
                        <div
                          style={{
                            position: "relative",
                            left: "5px",
                          }}
                        >
                          Half Ads in For You and Following
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "flex-end",
                          marginTop: "5px",
                        }}
                      >
                        <div>
                          {" "}
                          <svg
                            height={`1.25em`}
                            width={`1.25em`}
                            fill="white"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                            className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-1gs4q39"
                          >
                            <g>
                              <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                            </g>
                          </svg>
                        </div>
                        <div
                          style={{
                            marginLeft: "5px",
                          }}
                        >
                          Larger reply boost
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "flex-end",
                          marginTop: "5px",
                        }}
                      >
                        <div>
                          {" "}
                          <svg
                            height={`1.25em`}
                            width={`1.25em`}
                            fill="white"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                            className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-1gs4q39"
                          >
                            <g>
                              <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                            </g>
                          </svg>
                        </div>
                        <div
                          style={{
                            marginLeft: "5px",
                          }}
                        >
                          Get paid to post
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "flex-end",
                          marginTop: "5px",
                        }}
                      >
                        <div>
                          {" "}
                          <svg
                            height={`1.25em`}
                            width={`1.25em`}
                            fill="white"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                            className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-1gs4q39"
                          >
                            <g>
                              <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                            </g>
                          </svg>
                        </div>
                        <div
                          style={{
                            marginLeft: "5px",
                          }}
                        >
                          Checkmark
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "flex-end",
                          marginTop: "5px",
                        }}
                      >
                        <div>
                          {" "}
                          <svg
                            height={`1.25em`}
                            width={`1.25em`}
                            fill="white"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                            className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-1gs4q39"
                          >
                            <g>
                              <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                            </g>
                          </svg>
                        </div>
                        <div
                          style={{
                            marginLeft: "5px",
                          }}
                        >
                          Grok Early Access
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "flex-end",
                          marginTop: "5px",
                        }}
                      >
                        <div>
                          {" "}
                          <svg
                            height={`1.25em`}
                            width={`1.25em`}
                            fill="white"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                            className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-1gs4q39"
                          >
                            <g>
                              <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                            </g>
                          </svg>
                        </div>
                        <div
                          style={{
                            marginLeft: "5px",
                          }}
                        >
                          X Pro, Analytics, Media Studio
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "flex-end",
                          marginTop: "5px",
                        }}
                      >
                        <div>
                          {" "}
                          <svg
                            height={`1.25em`}
                            width={`1.25em`}
                            fill="white"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                            className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-1gs4q39"
                          >
                            <g>
                              <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                            </g>
                          </svg>
                        </div>
                        <div
                          style={{
                            marginLeft: "5px",
                          }}
                        >
                          Creator Subscriptions
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    backgroundColor: "yellow",
                    minWidth: "315px",
                    maxWidth: width < 600 ? "" : "315px",
                    minHeight: "432px",
                    borderRadius: "12px",
                    padding: "32px",
                    width: width < 600 ? "100%" : "",
                    marginBottom: "5%",
                    backgroundImage:
                      "linear-gradient(216.66deg, rgb(29, 155, 240) 2.89%, rgb(0, 131, 235) 97.26%)",
                    boxShadow:
                      themeName === "dark-theme"
                        ? "rgba(67, 179, 246, 0.5) 0px 0px 250px 0px"
                        : "rgba(67, 179, 246, 0.5) 0px 0px 250px 0px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      padding: "0px",
                      margin: "0px",
                    }}
                  >
                    <div
                      style={{
                        color: "white",
                        fontSize: "20px",
                        fontWeight: "400",
                        lineHeight: "24px",
                      }}
                    >
                      Premium+
                    </div>
                    <div
                      className="mt-3"
                      style={{
                        color: "white",
                        fontSize: "36px",
                        fontWeight: "700",
                        lineHeight: "36px",
                      }}
                    >
                      {selectedPremiumOption === "Monthly plan basic-option"
                        ? "€19.04"
                        : selectedPremiumOption === "Annual plan basic-option"
                        ? "€16.66"
                        : null}{" "}
                      <span
                        style={{
                          color: "white",
                          fontSize: "15px",
                          fontWeight: "400",
                          lineHeight: "20px",
                        }}
                      >
                        / month
                      </span>
                    </div>
                    <div className="mt-2" style={{ color: "white" }}>
                      <span
                        style={{
                          color: "white",
                          fontSize: "15px",
                          fontWeight: "400",
                          lineHeight: "20px",
                        }}
                      >
                        {selectedPremiumOption === "Monthly plan basic-option"
                          ? "Billed monthly"
                          : selectedPremiumOption === "Annual plan basic-option"
                          ? `Billed annually`
                          : null}{" "}
                      </span>
                      {selectedPremiumOption === "Annual plan basic-option" && (
                        <span
                          style={{
                            backgroundColor:
                              themeName === "dark-theme"
                                ? "#DBF8EB"
                                : "#DAF8EB",
                            color:
                              themeName === "dark-theme"
                                ? "#004329 "
                                : "#004329",
                            fontSize: "11px",
                            fontWeight: "700",
                            padding: "2px 4px",
                            borderRadius: "9999px",
                            position: "relative",
                            display: "inline-flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          SAVE 12%
                        </span>
                      )}
                    </div>
                    <div className="mt-3">
                      <Button
                        style={{
                          maxWidth: "251px",
                          maxHeight: "36px",
                          backgroundColor: "#D1D9DD",
                          color: "black",
                          border: "none",
                          outlineStyle: "none",
                        }}
                      >
                        Subscribe
                      </Button>
                    </div>
                    <div
                      className="mt-3"
                      style={{
                        color: "white",
                        fontWeight: "700",
                        fontSize: "15px",
                        lineHeight: " 20px",
                      }}
                    >
                      Everything in Premium, and
                    </div>
                    <div
                      className="mt-2"
                      style={{
                        color: "white",
                        fontSize: "15px",
                        lineHeight: "20px",
                        fontWeight: "400",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "flex-end",
                        }}
                      >
                        <div>
                          {" "}
                          <svg
                            height={`1.25em`}
                            width={`1.25em`}
                            fill="white"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                            className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-1gs4q39"
                          >
                            <g>
                              <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                            </g>
                          </svg>
                        </div>
                        <div
                          style={{
                            marginLeft: "5px",
                          }}
                        >
                          No Ads in For You and Following
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "flex-end",
                          marginTop: "5px",
                        }}
                      >
                        <div>
                          {" "}
                          <svg
                            height={`1.25em`}
                            width={`1.25em`}
                            fill="white"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                            className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-1gs4q39"
                          >
                            <g>
                              <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                            </g>
                          </svg>
                        </div>
                        <div
                          style={{
                            marginLeft: "5px",
                          }}
                        >
                          Largest reply boost
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "flex-end",
                          marginTop: "5px",
                        }}
                      >
                        <div>
                          {" "}
                          <svg
                            height={`1.25em`}
                            width={`1.25em`}
                            fill="white"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                            className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-1gs4q39"
                          >
                            <g>
                              <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
                            </g>
                          </svg>
                        </div>
                        <div
                          style={{
                            marginLeft: "5px",
                          }}
                        >
                          Write Articles
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              style={{
                marginLeft: "108px",
                fontSize: "34px",
                lineHeight: "40px",
                fontWeight: "700",
              }}
              className="option_detail_header"
            >
              Compare tiers & features
            </div>
          </Col>
          <Col xl={1}></Col>
        </Row>
      </Container>
    </>
  );
}

export default PremiumSignupPage;
