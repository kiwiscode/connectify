import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import { useFontSizeHandler } from "../../utils/useFontSizeHandler";

function IndexFooter() {
  const [{ theme, themeName }] = useContext(ThemeContext);
  const { getFontSizeAndLineHeight13 } = useFontSizeHandler();
  const font13 = getFontSizeAndLineHeight13();

  return (
    <>
      <div
        style={{
          textAlign: "center",
          width: "100%",
          minHeight: "72px",
          padding: "12px 16px",
        }}
        className={`footer-container chirp-regular-font mt-3 footer-container-${themeName}`}
      >
        <a href="">
          <span
            style={{
              fontSize: font13.fontSize,
            }}
          >
            About
          </span>
        </a>
        <a href="">
          <span
            style={{
              fontSize: font13.fontSize,
            }}
          >
            Download the C app
          </span>
        </a>
        <a href="">
          <span
            style={{
              fontSize: font13.fontSize,
            }}
          >
            Help Center
          </span>
        </a>
        <a href="">
          <span
            style={{
              fontSize: font13.fontSize,
            }}
          >
            Terms of Service
          </span>
        </a>
        <a href="">
          <span
            style={{
              fontSize: font13.fontSize,
            }}
          >
            Privacy Policy
          </span>
        </a>
        <a href="">
          <span
            style={{
              fontSize: font13.fontSize,
            }}
          >
            Cookie Policy
          </span>
        </a>
        <a href="">
          <span
            style={{
              fontSize: font13.fontSize,
            }}
          >
            MStV Transparenzangaben
          </span>
        </a>
        <a href="">
          <span
            style={{
              fontSize: font13.fontSize,
            }}
          >
            Imprint
          </span>
        </a>
        <a href="">
          <span
            style={{
              fontSize: font13.fontSize,
            }}
          >
            Accessibility
          </span>
        </a>
        <a href="">
          <span
            style={{
              fontSize: font13.fontSize,
            }}
          >
            Ads info
          </span>
        </a>
        <a href="">
          <span
            style={{
              fontSize: font13.fontSize,
            }}
          >
            Blog
          </span>
        </a>
        <a href="">
          <span
            style={{
              fontSize: font13.fontSize,
            }}
          >
            Status
          </span>
        </a>
        <a href="">
          <span
            style={{
              fontSize: font13.fontSize,
            }}
          >
            Careers
          </span>
        </a>{" "}
        <a href="">
          <span
            style={{
              fontSize: font13.fontSize,
            }}
          >
            Brand Resources
          </span>
        </a>
        <a href="">
          <span
            style={{
              fontSize: font13.fontSize,
            }}
          >
            Advertising
          </span>
        </a>
        <div></div>
        <a href="">
          <span
            style={{
              fontSize: font13.fontSize,
            }}
          >
            Marketing
          </span>
        </a>
        <a href="">
          <span
            style={{
              fontSize: font13.fontSize,
            }}
          >
            C for Business
          </span>
        </a>
        <a href="https://www.linkedin.com/in/kavaykut/">
          <span
            style={{
              fontSize: font13.fontSize,
            }}
          >
            Developers
          </span>
        </a>
        <a href="">
          <span
            style={{
              fontSize: font13.fontSize,
            }}
          >
            Directory
          </span>
        </a>
        <a href="">
          <span
            style={{
              fontSize: font13.fontSize,
            }}
          >
            Settings
          </span>
        </a>
        <a href="https://github.com/kiwiscode">
          <span
            style={{
              fontSize: font13.fontSize,
            }}
          >
            © 2024 C kiwiscode
          </span>
        </a>
      </div>
    </>
  );
}

export default IndexFooter;
