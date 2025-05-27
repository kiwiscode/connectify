import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import { useFontSizeHandler } from "../../utils/useFontSizeHandler";
import useWindowDimensions from "../../hooks/getWindowDimensions";

function IndexFooter() {
  const [{ themeName }] = useContext(ThemeContext);
  const { getFontSizeAndLineHeight13 } = useFontSizeHandler();
  const font13 = getFontSizeAndLineHeight13();
  const { width } = useWindowDimensions();
  const currentYear = new Date().getFullYear();
  return (
    <>
      <div
        style={{
          textAlign: "center",
          width: "100%",
          padding: "0px 16px",
          fontSize: font13.fontSize,
          flexWrap: "wrap",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        className={`footer-container chirp-regular-font ${
          width <= 1440 ? "mt-3" : "mt-5"
        }  footer-container-${themeName}`}
      >
        {/* <a href="">
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
        </a> */}
        <span
          style={{
            color: "rgb(83, 100, 113)",
          }}
        >
          © {currentYear} C
        </span>{" "}
        <a
          style={{
            textDecoration: "none",
            color: "rgb(83, 100, 113)",
            marginLeft: "5px",
          }}
          rel="noreferrer"
          className="kiwisc0de--"
          target="_blank"
          href="https://www.aykutkav.com"
        >
          kiwisc0de
        </a>
      </div>
    </>
  );
}

export default IndexFooter;
