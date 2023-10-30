import styled, { css } from "styled-components";
import Arrow from "../../assets/images/Arrow.svg";

interface Props {
  $dynamicChildMargin?: string;
  $dynamicHeight?: string;
  $upArrow?: boolean;
  $downArrow?: boolean;
}

const CommonSettingModal = styled.div<Props>`
  display: flex;
  background-color: #c9c9c9;
  border-radius: 4px;
  padding: 0.3rem 0.5rem;
  position: absolute;
  z-index: 2;
  box-shadow: 1px 0px 9px 4px rgba(0, 0, 0, 0.15);
  -webkit-box-shadow: 1px 0px 9px 4px rgba(0, 0, 0, 0.15);
  -moz-box-shadow: 1px 0px 9px 4px rgba(0, 0, 0, 0.15);

  ${(props) =>
    props.$upArrow &&
    css`
      &:before {
        content: url(${Arrow});
        position: absolute;
        top: -1rem;
        right: 0.35rem;
        fill: #c9c9c9;
      }
    `}
  ${(props) =>
    props.$downArrow &&
    css`
      &:before {
        content: url(${Arrow});
        transform: rotate(180deg);
        position: absolute;
        bottom: -1rem;
        right: 0.35rem;
        fill: #c9c9c9;
      }
    `}

  > :not(:last-child) {
    margin: ${(props) =>
      props.$dynamicChildMargin ? props.$dynamicChildMargin : "0 0.5rem 0 0"};
  }
`;
export default CommonSettingModal;
