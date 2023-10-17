import styled from "styled-components";

interface Props {
  dynamicWidth?: string;
}

const ConfirmBtn = styled.button<Props>`
  color: white;
  background-color: #ee6a6a;
  height: 38px;
  width: ${(props) => (props.dynamicWidth ? props.dynamicWidth : "193px")};
  border-radius: 7px;
`;
export default ConfirmBtn;
