import React, { useState, useEffect, ReactElement } from "react";
import { styled } from "styled-components";

const ModalLayout = styled.div`
  height: 100%;
`;

const ModalBox = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  position: relative;
`;


interface ModalInfo {
  modalSelected: number;
  modalIndex: number;
  children: ReactElement;
}

export default function ModalCommon(name: ModalInfo) {
  const { modalIndex, modalSelected, children } = name;
  const [activeIndex, setActiveIndex] = useState<number>();

  const handleClick = () => {
    if (activeIndex === modalIndex) {
      // 같은 모달 아이콘 클릭시 기본 값 -1 부여를 통한 모달 닫힘 처리
      setActiveIndex(-1);
    } else {
      setActiveIndex(modalSelected);
    }
  };

  useEffect(() => {
    setActiveIndex(modalSelected);
  }, [modalSelected]);

  return (
    <ModalLayout>
      <ModalBox onClick={() => handleClick()}>
        <img src={children.props.children[0]} alt="modalIcon" />
        {activeIndex === modalIndex ? children.props.children[1] : null}
      </ModalBox>
    </ModalLayout>
  );
}
