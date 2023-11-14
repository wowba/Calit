import styled from "styled-components";

interface Props {
  $dynamicWidth?: string;
  $dynamicMaxHeight?: string;
  $dynamicPadding?: string;
  onBlur: any;
}

const CommonTextArea = styled.textarea<Props>`
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
  &:focus {
    border-color: #adadad;
  }
  &::-webkit-scrollbar {
    width: 8px;
    overflow-x: hidden;
    overflow-y: scroll;
    border-radius: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.3);
    border-radius: 6px;
  }
  &::-webkit-scrollbar-corner {
    background: transparent;
  }
`;

export default CommonTextArea;
