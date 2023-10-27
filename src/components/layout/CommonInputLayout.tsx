import styled, { css } from "styled-components";

interface Props {
  $dynamicWidth?: string;
  $dynamicHeight?: string;
  $dynamicPadding?: string;
  $dynamicFontSize?: string;
  $isHover?: boolean;
}

const CommonInputLayout = styled.input<Props>`
  transition: all 0.3s ease-in-out;

  width: ${(props) => (props.$dynamicWidth ? props.$dynamicWidth : "auto")};
  height: ${(props) =>
    props.$dynamicHeight ? props.$dynamicHeight : "1.5rem"};

  padding: ${(props) => (props.$dynamicPadding ? props.$dynamicPadding : "0")};

  font-size: ${(props) =>
    props.$dynamicFontSize ? props.$dynamicFontSize : "1.125rem"};
  color: black;

  border: 1px solid transparent;
  border-radius: 0.3rem;
  outline: none;

  &:focus {
    border-color: black;
  }

  ${(props) =>
    props.$isHover &&
    css`
      &:hover {
        border-color: black;
      }
    `}
`;

export default CommonInputLayout;
