import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";

function IndexFooter() {
  const [
    { theme, themeName },
    lightModeActive,
    darkModeActive,
    cyberpunkModeActive,
  ] = useContext(ThemeContext);
  return (
    <>
      <div
        style={{
          textAlign: "center",
          width: "100%",
          minHeight: "72px",
          padding: "12px 16px",
        }}
        className={`footer-container mt-3 footer-container-${themeName}`}
      >
        <a href="">
          <span>About</span>
        </a>
        <a href="">
          <span>Download the C app</span>
        </a>
        <a href="">
          <span>Help Center</span>
        </a>
        <a href="">
          <span>Terms of Service</span>
        </a>
        <a href="">
          <span>Privacy Policy</span>
        </a>
        <a href="">
          <span>Cookie Policy</span>
        </a>
        <a href="">
          <span>MStV Transparenzangaben</span>
        </a>
        <a href="">
          <span>Imprint</span>
        </a>
        <a href="">
          <span>Accessibility</span>
        </a>
        <a href="">
          <span>Ads info</span>
        </a>
        <a href="">
          <span>Blog</span>
        </a>
        <a href="">
          <span>Status</span>
        </a>
        <a href="">
          <span>Careers</span>
        </a>{" "}
        <a href="">
          <span>Brand Resources</span>
        </a>
        <a href="">
          <span>Advertising</span>
        </a>
        <div></div>
        <a href="">
          <span>Marketing</span>
        </a>
        <a href="">
          <span>C for Business</span>
        </a>
        <a href="https://www.linkedin.com/in/kavaykut/">
          <span>Developers</span>
        </a>
        <a href="">
          <span>Directory</span>
        </a>
        <a href="">
          <span>Settings</span>
        </a>
        <a href="">
          <span>© 2024 C kiwiscode</span>
        </a>
      </div>
    </>
  );
}

export default IndexFooter;
