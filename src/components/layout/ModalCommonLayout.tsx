import React, { useRef, useState, useEffect, ReactElement } from "react";
import { useLocation } from "react-router-dom";
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
  const [historyIdx, setHistoryIdx] = useState<number>(
    window.history.state.idx,
  );
  const location = useLocation();

  useEffect(() => {
    setActiveIndex(modalSelected);
  }, [modalSelected]);

  useEffect(() => {
    setActiveIndex(-1);
  }, [location.pathname]);

  // 페이지 뒤로가기 동작시 변경된 화면에서도 선택된 헤더 모달의 Index가 전달되어 모달이 잠시 켜졌다 사라지는 오류 발생함
  // window 객체의 history 프로퍼티를 통해 브라우저 히스토리에 접근
  // state의 idx가 변경된 경우(화면 이동) 렌더링 과정에서 activeindex 기본값으로 변경
  if (historyIdx !== window.history.state.idx) {
    setHistoryIdx(window.history.state.idx);
    setActiveIndex(-1);
  }

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
