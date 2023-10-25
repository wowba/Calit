import styled from "styled-components";

interface Props {
  $dynamicWidth?: string;
  $dynamicHeight?: string;
  $dynamicMargin?: string;
  $dynamicColor?: string;
  $fontColor?: string;
  $hoverFontColor?: string;
  $hoverBgColor?: string;
}

const ConfirmBtn = styled.button<Props>`
  width: ${(props) => (props.$dynamicWidth ? props.$dynamicWidth : "193px")};
  height: ${(props) => (props.$dynamicHeight ? props.$dynamicHeight : "38px")};
  margin: ${(props) => (props.$dynamicMargin ? props.$dynamicMargin : "0rem")};
  background-color: ${(props) =>
    props.$dynamicColor ? props.$dynamicColor : "#ee6a6a"};
  color: ${(props) => (props.$fontColor ? props.$fontColor : "white")};
  border-radius: 7px;
  &:hover {
    transition: all 0.5s;
    background-color: ${(props) =>
      props.$hoverBgColor ? props.$hoverBgColor : "#d05f5f"};
    color: ${(props) =>
      props.$hoverFontColor ? props.$hoverFontColor : "white"};
  }
`;
export default ConfirmBtn;
