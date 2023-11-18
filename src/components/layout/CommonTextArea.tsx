import styled from "styled-components";

interface Props {
  $dynamicWidth?: string;
  $dynamicMaxHeight?: string;
  $dynamicPadding?: string;
  onBlur: any;
}

const CommonTextArea = styled.textarea<Props>`
  background-color: #fcfcfc;
  font-size: 0.9rem;
  width: ${(props) => (props.$dynamicWidth ? props.$dynamicWidth : "100%")};
  max-height: ${(props) =>
    props.$dynamicMaxHeight ? props.$dynamicMaxHeight : "22.5rem"};
  padding: ${(props) =>
    props.$dynamicPadding ? props.$dynamicPadding : "0.3rem"};
  overflow: scroll;
  border: 1px solid transparent;
  border-radius: 0.3rem;
  outline: none;
  resize: none;
  transition: all 0.3s ease-in-out;
  &::-webkit-scrollbar {
    display: none;
  }
  &:focus {
    border-color: #adadad;
  }
`;

export default CommonTextArea;
