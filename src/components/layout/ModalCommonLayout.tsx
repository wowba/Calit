import React, { useRef, useState, useEffect, ReactElement } from "react";
import { styled } from "styled-components";

interface Props {
  $dynamicWidth?: string;
  $dynamicHeight?: string;
}

interface ModalInfo {
  modalSelected: number;
  modalIndex: number;
  children: ReactElement;
}

const ModalLayout = styled.div`
  height: 100%;
`;

const ModalBox = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  position: relative;
`;

export const ModalArea = styled.div<Props>`
  width: ${(props) => (props.$dynamicWidth ? props.$dynamicWidth : "20rem")};
  height: ${(props) => (props.$dynamicHeight ? props.$dynamicHeight : "20rem")};
  z-index: 999;
  position: absolute;
  right: 0;
  top: 4rem;
  border-radius: 7px;
  box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.3);
  background-color: white;
  padding: 20px 28px;
`;
export const ModalTitle = styled.div`
  font-weight: 900;
  font-size: 1.2rem;
  margin: 0 0 0.8rem 0;
`;

export default function ModalCommon(name: ModalInfo) {
  const { modalIndex, modalSelected, children } = name;
  const [activeIndex, setActiveIndex] = useState<number>();
  const path = window.location.href;

  useEffect(() => {
    setActiveIndex(modalSelected);
  }, [modalSelected]);

  // URL 변경 시(프로젝트 페이지 진입, 칸반 및 투두 선택.. ) 모달 activeIndex 값 초기화해 화면 바뀌었을때 모달 뜨지 않게 수정
  useEffect(() => {
    setActiveIndex(-1);
  }, [path]);

  const wrapperRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handleClickOutside(e: MouseEvent): void {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setActiveIndex(-1);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  const handleClickBox = () => {
    if (activeIndex === modalIndex) {
      // 같은 모달 아이콘 클릭시 기본 값 -1 부여를 통한 모달 닫힘 처리
      setActiveIndex(-1);
    } else {
      setActiveIndex(modalSelected);
    }
  };

  return (
    <ModalLayout>
      <ModalBox onClick={handleClickBox} ref={wrapperRef} className="modalBox">
        {children.props.children[0]}
        {activeIndex === modalIndex ? children.props.children[1] : null}
      </ModalBox>
    </ModalLayout>
  );
}
