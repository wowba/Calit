import React from "react";
import styled from "styled-components";

const ModalBox = styled.div`
  img {
    padding-left: 1rem;
  }
  img:hover {
    cursor: pointer;
  }
`;

interface ModalInfo {
  modalName: string;
  modalIcon: string;
}

export default function ModalCommon(name: ModalInfo) {
  const { modalName, modalIcon } = name;
  return (
    <ModalBox>
      <img key={modalName} src={modalIcon} alt={modalName} />
    </ModalBox>
  );
}
