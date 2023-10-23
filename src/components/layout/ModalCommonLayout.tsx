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
  const [isClick, setIsClick] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>();

  const handleClick = () => {
    setIsClick(!isClick);
  };

  useEffect(() => {
    if (modalSelected !== modalIndex && isClick === true) {
      setIsClick(false);
    }
    setActiveIndex(modalSelected);
  }, [modalSelected]);

  return (
    <ModalLayout className="outerbox">
      <ModalBox className="innerbox" onClick={() => handleClick()}>
        <>
          <img src={children.props.children[0]} alt="Icon" />
          {activeIndex === modalIndex ? (
            <ModalArea className={isClick === true ? "isShow" : "isHide"}>
              {children.props.children[1]}
            </ModalArea>
          ) : null}
        </>
      </ModalBox>
    </ModalLayout>
  );
}
