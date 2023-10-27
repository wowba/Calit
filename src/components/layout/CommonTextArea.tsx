import styled from "styled-components";

interface Props {
  $dynamicWidth?: string;
  $dynamicRow?: string;
  $dynamicPadding?: string;
}

const CommonTextArea = styled.textarea<Props>`
  width: ${(props) => (props.$dynamicWidth ? props.$dynamicWidth : "100%")};
  rows: ${(props) => (props.$dynamicRow ? props.$dynamicRow : "1")};
  padding: ${(props) => (props.$dynamicPadding ? props.$dynamicPadding : "0")};
  overflow: hidden;
  border: 1px solid transparent;
  border-radius: 0.3rem;
  outline: none;
  resize: none;
  transition: all 0.3s ease-in-out;
  &:focus {
    border-color: black;
  }
`;

export default CommonTextArea;
