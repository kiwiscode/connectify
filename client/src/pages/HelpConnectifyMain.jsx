import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import { ThemeContext } from "../context/ThemeContext";
import useWindowDimensions from "../hooks/getWindowDimensions";
import { Button, Col, Container, Modal, Stack } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Popover from "@mui/material/Popover";
import PopupState, { bindTrigger, bindPopover } from "material-ui-popup-state";
import BootstrapTooltip from "../components/BootstrapToolTip/BootstrapToolTip";

// when working on local version
const API_URL = "http://localhost:3000";

// when working on deployment version
// ?
function HelpConnectifyMain() {
  return (
    <div
      style={{
        textAlign: "center",
        fontSize: "64px",
        fontWeight: "800",
      }}
    >
      Help connectify
    </div>
  );
}
export default HelpConnectifyMain;
