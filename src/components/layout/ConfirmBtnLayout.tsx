import styled from "styled-components";

interface Props {
  $dynamicWidth?: string;
  $dynamicHeight?: string;
  $dynamicMargin?: string;
  $dynamicColor?: string;
  $fontColor?: string;
  $hoverFontColor?: string;
  $hoverBgColor?: string;
  $isWritten?: string;
}

const ConfirmBtn = styled.button<Props>`
  width: ${(props) => (props.$dynamicWidth ? props.$dynamicWidth : "193px")};
  height: ${(props) => (props.$dynamicHeight ? props.$dynamicHeight : "38px")};
  margin: ${(props) => (props.$dynamicMargin ? props.$dynamicMargin : "0rem")};
  background-color: ${(props) =>
    props.$dynamicColor ? props.$dynamicColor : props.theme.Color.mainColor};
  color: ${(props) => (props.$fontColor ? props.$fontColor : "white")};
  border-radius: 7px;
  visibility: ${(props) => (props.$isWritten === "" ? "hidden" : "visible")};
  opacity: ${(props) => (props.$isWritten === "" ? 0 : 1)};
  transition: all 0.5s;
  &:hover {
    transition: all 0.5s;
    background-color: ${(props) =>
      props.$hoverBgColor ? props.$hoverBgColor : props.theme.Color.hoverColor};
    color: ${(props) =>
      props.$hoverFontColor
        ? props.$hoverFontColor
        : props.theme.Color.mainWhite};
  }
`;
export default ConfirmBtn;
