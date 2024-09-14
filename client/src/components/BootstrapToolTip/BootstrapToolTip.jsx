import { Tooltip, tooltipClasses } from "@mui/material";
import { styled } from "@mui/system";

const BootstrapTooltip = styled(({ className, themeName, ...props }) => (
  <Tooltip
    {...props}
    classes={{ popper: className }}
    TransitionProps={{ timeout: { enter: 250, exit: 50 } }}
  />
))(({ theme, themeName }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: "white",
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: themeName === "dark-theme" ? "#495a68" : "",
    opacity: "0.9 !important",
  },
}));

export default BootstrapTooltip;
