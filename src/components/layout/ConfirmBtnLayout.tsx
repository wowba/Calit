import styled from "styled-components";

interface Props {
  $dynamicWidth?: string;
  $dynamicMargin?: string;
  $dynamicColor?: string;
}

const ConfirmBtn = styled.button<Props>`
  color: white;
  background-color: ${(props) =>
    props.$dynamicColor ? props.$dynamicColor : "#ee6a6a"};
  height: 38px;
  width: ${(props) => (props.$dynamicWidth ? props.$dynamicWidth : "193px")};
  border-radius: 7px;
  margin: ${(props) => (props.$dynamicMargin ? props.$dynamicMargin : "0rem")};
  &:hover {
    transition: all 0.5s;
    background-color: #d05f5f;
    color: white;
  }
`;
export default ConfirmBtn;
