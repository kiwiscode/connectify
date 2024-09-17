import { useContext } from "react";
import { FontSizeContext } from "../context/FontSizeContext";

export const useFontSizeHandler = () => {
  const { fontSize } = useContext(FontSizeContext);

  const getFontSizeAndLineHeight64 = () => {
    const fontSizes = {
      Default: "64px",
      Small: "61px",
      "Extra small": "58px",
      Large: "70px",
      "Extra large": "77px",
    };

    const lineHeights = {
      Default: "84px",
      Small: "80px",
      "Extra small": "76px",
      Large: "92px",
      "Extra large": "101px",
    };

    return {
      fontSize: fontSizes[fontSize] || "64px",
      lineHeight: lineHeights[fontSize] || "84px",
    };
  };
  const getFontSizeAndLineHeight36 = () => {
    const fontSizes = {
      Default: "36px",
      Small: "34px",
      "Extra small": "32px",
      Large: "40px",
      "Extra large": "43px",
    };

    const lineHeights = {
      Default: "36px",
      Small: "34px",
      "Extra small": "32px",
      Large: "40px",
      "Extra large": "43px",
    };

    return {
      fontSize: fontSizes[fontSize] || "36px",
      lineHeight: lineHeights[fontSize] || "36px",
    };
  };
  const getFontSizeAndLineHeight34 = () => {
    const fontSizes = {
      Default: "34px",
      Small: "32px",
      "Extra small": "31px",
      Large: "37px",
      "Extra large": "41px",
    };

    const lineHeights = {
      Default: "40px",
      Small: "38px",
      "Extra small": "36px",
      Large: "44px",
      "Extra large": "48px",
    };

    return {
      fontSize: fontSizes[fontSize] || "34px",
      lineHeight: lineHeights[fontSize] || "40px",
    };
  };
  const getFontSizeAndLineHeight31 = () => {
    const fontSizes = {
      Default: "31px",
      Small: "29px",
      "Extra small": "28px",
      Large: "34px",
      "Extra large": "37px",
    };

    const lineHeights = {
      Default: "36px",
      Small: "34px",
      "Extra small": "32px",
      Large: "40px",
      "Extra large": "43px",
    };

    return {
      fontSize: fontSizes[fontSize] || "31px",
      lineHeight: lineHeights[fontSize] || "36px",
    };
  };
  const getFontSizeAndLineHeight26 = () => {
    const fontSizes = {
      Default: "26px",
      Small: "25px",
      "Extra small": "23px",
      Large: "29px",
      "Extra large": "31px",
    };

    const lineHeights = {
      Default: "32px",
      Small: "30px",
      "Extra small": "29px",
      Large: "35px",
      "Extra large": "38px",
    };

    return {
      fontSize: fontSizes[fontSize] || "26px",
      lineHeight: lineHeights[fontSize] || "32px",
    };
  };
  const getFontSizeAndLineHeight23 = () => {
    const fontSizes = {
      Default: "23px",
      Small: "22px",
      "Extra small": "21px",
      Large: "25px",
      "Extra large": "28px",
    };

    const lineHeights = {
      Default: "28px",
      Small: "27px",
      "Extra small": "25px",
      Large: "31px",
      "Extra large": "34px",
    };

    return {
      fontSize: fontSizes[fontSize] || "23px",
      lineHeight: lineHeights[fontSize] || "28px",
    };
  };
  const getFontSizeAndLineHeight20 = () => {
    const fontSizes = {
      Default: "20px",
      Small: "19px",
      "Extra small": "18px",
      Large: "22px",
      "Extra large": "24px",
    };

    const lineHeights = {
      Default: "24px",
      Small: "23px",
      "Extra small": "22px",
      Large: "26px",
      "Extra large": "29px",
    };

    return {
      fontSize: fontSizes[fontSize] || "20px",
      lineHeight: lineHeights[fontSize] || "24px",
    };
  };
  const getFontSizeAndLineHeight18 = () => {
    const fontSizes = {
      Default: "18px",
      Small: "17px",
      "Extra small": "16px",
      Large: "20px",
      "Extra large": "22px",
    };

    const lineHeights = {
      Default: "24px",
      Small: "23px",
      "Extra small": "22px",
      Large: "26px",
      "Extra large": "29px",
    };

    return {
      fontSize: fontSizes[fontSize] || "18px",
      lineHeight: lineHeights[fontSize] || "24px",
    };
  };
  const getFontSizeAndLineHeight17 = () => {
    const fontSizes = {
      Default: "17px",
      Small: "16px",
      "Extra small": "15px",
      Large: "19px",
      "Extra large": "20px",
    };

    const lineHeights = {
      Default: "20px",
      Small: "19px",
      "Extra small": "18px",
      Large: "22px",
      "Extra large": "24px",
    };

    return {
      fontSize: fontSizes[fontSize] || "17px",
      lineHeight: lineHeights[fontSize] || "20px",
    };
  };
  const getFontSizeAndLineHeight15 = () => {
    const fontSizes = {
      Default: "15px",
      Small: "14px",
      "Extra small": "14px",
      Large: "17px",
      "Extra large": "18px",
    };

    const lineHeights = {
      Default: "20px",
      Small: "19px",
      "Extra small": "18px",
      Large: "22px",
      "Extra large": "24px",
    };

    return {
      fontSize: fontSizes[fontSize] || "15px",
      lineHeight: lineHeights[fontSize] || "20px",
    };
  };
  const getFontSizeAndLineHeight14 = () => {
    const fontSizes = {
      Default: "14px",
      Small: "13px",
      "Extra small": "13px",
      Large: "15px",
      "Extra large": "17px",
    };

    const lineHeights = {
      Default: "16px",
      Small: "15px",
      "Extra small": "14px",
      Large: "18px",
      "Extra large": "19px",
    };

    return {
      fontSize: fontSizes[fontSize] || "14px",
      lineHeight: lineHeights[fontSize] || "16px",
    };
  };
  const getFontSizeAndLineHeight13 = () => {
    const fontSizes = {
      Default: "13px",
      Small: "12px",
      "Extra small": "12px",
      Large: "14px",
      "Extra large": "16px",
    };

    const lineHeights = {
      Default: "16px",
      Small: "15px",
      "Extra small": "14px",
      Large: "18px",
      "Extra large": "19px",
    };

    return {
      fontSize: fontSizes[fontSize] || "13px",
      lineHeight: lineHeights[fontSize] || "16px",
    };
  };
  const getFontSizeAndLineHeight11 = () => {
    const fontSizes = {
      Default: "11px",
      Small: "10px",
      "Extra small": "10px",
      Large: "12px",
      "Extra large": "13px",
    };

    const lineHeights = {
      Default: "12px",
      Small: "11px",
      "Extra small": "11px",
      Large: "13px",
      "Extra large": "14px",
    };

    return {
      fontSize: fontSizes[fontSize] || "11px",
      lineHeight: lineHeights[fontSize] || "12px",
    };
  };

  return {
    getFontSizeAndLineHeight64,
    getFontSizeAndLineHeight36,
    getFontSizeAndLineHeight34,
    getFontSizeAndLineHeight31,
    getFontSizeAndLineHeight26,
    getFontSizeAndLineHeight23,
    getFontSizeAndLineHeight20,
    getFontSizeAndLineHeight18,
    getFontSizeAndLineHeight17,
    getFontSizeAndLineHeight15,
    getFontSizeAndLineHeight14,
    getFontSizeAndLineHeight13,
    getFontSizeAndLineHeight11,
  };
};
