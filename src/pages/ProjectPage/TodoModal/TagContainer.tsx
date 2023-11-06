import styled from "styled-components";

interface Props {
  $dynamicBg: string;
}
const TagContainer = styled.div<Props>`
  display: inline-block;
  background-color: ${(props) =>
    props.$dynamicBg ? props.$dynamicBg : "#ffffff"};
  border-radius: 10px;
  white-space: nowrap;
  padding: 2px 10px;
`;

export default TagContainer;
