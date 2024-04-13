import { Accordion, Col, Container, Row, Stack } from "react-bootstrap";
import LeftSideNavBar from "../components/Main-Left-Side-Navbar/LeftSideNavbar";
import RightSideColumn from "../components/Main-Right-Side-Column/RightSideColumn";
import useWindowDimensions from "../hooks/getWindowDimensions";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import axios from "axios";
import { ThemeContext } from "../context/ThemeContext";
import { Link } from "react-router-dom";

// when working on local version
const API_URL = "http://localhost:3000";

// when working on deployment version
// ?

function NotificationsPage() {
  const { getToken } = useContext(UserContext);
  const { height, width } = useWindowDimensions();

  const [isSubModalOpened, setIsSubModalOpened] = useState(false);
  const [tabIndexValue, settabIndexValue] = useState(null);

  const handleModalToggle = (modalOpen) => {
    setIsSubModalOpened(modalOpen);
  };
  const handleReceiveTabIndexValue = (value) => {
    settabIndexValue(value);
  };

  const [subscriptionCompletedStatus, setsubscriptionCompletedStatus] =
    useState(null);
  const [
    { theme, themeName },
    lightModeActive,
    darkModeActive,
    cyberpunkModeActive,
  ] = useContext(ThemeContext);
  return (
    <Container
      style={{
        overflowX: "hidden",
        overflowY: "hidden",
      }}
      fluid
    >
      <Row
        style={{
          borderTop: "none",
          borderBottom: "none",
          overflowX: "hidden",
          overflowY: "hidden",
        }}
      >
        <LeftSideNavBar
        // refreshPosts={() => handleShowPostsHomePage()}
        // setLoadingTrue={() => setLoadingTrue()}
        // setLoadingFalse={() => setLoadingFalse()}
        // parentCallBack={handleCallback}
        />

        <Col
          xs={12} // 0px - 576px aralığı
          sm={12} // 576px - 768px aralığı
          md={11} // 768px - 992px aralığı
          lg={width <= 1201 && width >= 992 ? 7 : width > 1201 ? 5 : ""} // 992px - 1400px aralığı
          xxl={5} // 1400px ve sonrası aralığı
          className={`main-column `}
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
              paddingLeft: "12px",
              paddingRight: "12px",
            }}
            direction="horizontal"
            gap={3}
          >
            <Link className="responsive-home-arrow" to={"/home"}>
              <svg
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
            </Link>
            <div
              style={{
                lineHeight: "24px",
                fontWeight: "700",
                fontSize: "20px",
              }}
              className="p-2"
            >
              Notifications
            </div>
            {/* settings icon start to check  */}
            <div
              // className="p-2 ms-auto settings-icon"
              className={`p-2 ms-auto settings-icon settings-icon-${themeName}`}
              style={{
                cursor: "pointer",
                borderRadius: "50%",
                position: "relative",
                width: "40px",
                height: "40px",
              }}
            >
              <svg
                style={{
                  lineHeight: "20px",
                  fontSize: "15px",
                  fontWeight: "700",
                  cursor: "pointer",
                }}
                color={themeName === "dark-theme" ? "white" : ""}
                fill="currentColor"
                width={20}
                height={20}
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="messages-settings-and-privacy r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-z80fyv r-19wmn03"
              >
                <g>
                  <path d="M10.54 1.75h2.92l1.57 2.36c.11.17.32.25.53.21l2.53-.59 2.17 2.17-.58 2.54c-.05.2.04.41.21.53l2.36 1.57v2.92l-2.36 1.57c-.17.12-.26.33-.21.53l.58 2.54-2.17 2.17-2.53-.59c-.21-.04-.42.04-.53.21l-1.57 2.36h-2.92l-1.58-2.36c-.11-.17-.32-.25-.52-.21l-2.54.59-2.17-2.17.58-2.54c.05-.2-.03-.41-.21-.53l-2.35-1.57v-2.92L4.1 8.97c.18-.12.26-.33.21-.53L3.73 5.9 5.9 3.73l2.54.59c.2.04.41-.04.52-.21l1.58-2.36zm1.07 2l-.98 1.47C10.05 6.08 9 6.5 7.99 6.27l-1.46-.34-.6.6.33 1.46c.24 1.01-.18 2.07-1.05 2.64l-1.46.98v.78l1.46.98c.87.57 1.29 1.63 1.05 2.64l-.33 1.46.6.6 1.46-.34c1.01-.23 2.06.19 2.64 1.05l.98 1.47h.78l.97-1.47c.58-.86 1.63-1.28 2.65-1.05l1.45.34.61-.6-.34-1.46c-.23-1.01.18-2.07 1.05-2.64l1.47-.98v-.78l-1.47-.98c-.87-.57-1.28-1.63-1.05-2.64l.34-1.46-.61-.6-1.45.34c-1.02.23-2.07-.19-2.65-1.05l-.97-1.47h-.78zM12 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5c.82 0 1.5-.67 1.5-1.5s-.68-1.5-1.5-1.5zM8.5 12c0-1.93 1.56-3.5 3.5-3.5 1.93 0 3.5 1.57 3.5 3.5s-1.57 3.5-3.5 3.5c-1.94 0-3.5-1.57-3.5-3.5z"></path>
                </g>
              </svg>
            </div>
            {/* settings icon finish to check  */}
          </Stack>
        </Col>
        {/* finish to check  main column */}
        {/* 3.column burası olucak */}
        <RightSideColumn
          onModalToggle={handleModalToggle}
          tabIndexValue={handleReceiveTabIndexValue}
          isSubscriptionCompleted={subscriptionCompletedStatus}
        />
      </Row>
    </Container>
  );
}

export default NotificationsPage;
