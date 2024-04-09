import { Accordion, Col, Container, Row } from "react-bootstrap";
import LeftSideNavBar from "../components/Main-Left-Side-Navbar/LeftSideNavbar";
import RightSideColumn from "../components/Main-Right-Side-Column/RightSideColumn";
import useWindowDimensions from "../hooks/getWindowDimensions";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import axios from "axios";

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

  return (
    <Container
      style={{
        overflowX: "hidden",
      }}
      fluid
    >
      <Row
        style={{
          height: "100vh",
          borderTop: "none",
          borderBottom: "none",
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
            border: "1px solid rgba(0, 0, 0, 0.1)",
            borderTop: "none",
            borderBottom: "none",
            padding: "0px",
            position: "relative",
          }}
        >
          <div>Notifications</div>
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
