import React from "react";
import { styled } from "styled-components";

const ModalArea = styled.div`
  width: 20rem;
  height: 20rem;
  z-index: 999;
  position: absolute;
  right: 0;
  top: 4rem;
  border-radius: 7px;
  box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.3);

  &.isHide {
    display: none;
  }

  &.isShow {
    display: block;
  }
`;
export default function Tutorial() {
  return <ModalArea><div>Tutorial</div></ModalArea>;
}
