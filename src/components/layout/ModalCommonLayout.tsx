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
        {activeIndex === modalIndex ? (
          <ModalArea className="isShow">
            {children.props.children[1]}
          </ModalArea>
        ) : null}
      </ModalBox>
    </ModalLayout>
  );
}
