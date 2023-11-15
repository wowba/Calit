import styled from "styled-components";

interface Props {
  $dynamicBg: string;
  $dynamicColor: string;
}
const TagContainer = styled.div<Props>`
  display: inline-block;
  background-color: ${(props) =>
    props.$dynamicBg ? props.$dynamicBg : "#c9c9c9"};
  border-radius: 7px;
  white-space: nowrap;
  padding: 4px 10px;
  color: ${(props) => (props.$dynamicColor ? props.$dynamicColor : "#000")};
`;

export default TagContainer;
