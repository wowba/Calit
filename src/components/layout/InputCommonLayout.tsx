import styled from "styled-components";

interface InputProps {
  $dynamicWidth: string;
  $dynamicMargin?: string;
  $dynamicColor?: string;
}

const InputCommon = styled.input<InputProps>`
  width: ${(props) => props.$dynamicWidth};
  border: 0.2px solid #ededed;
  -webkit-border-radius: 4px;
  padding: 0 8px;
  background: ${(props) =>
    props.$dynamicColor ? props.$dynamicColor : "#fafafa"};
  margin: ${(props) => (props.$dynamicMargin ? props.$dynamicMargin : "2px")};
`;

export default InputCommon;
