import React, {
  useRef,
  useState,
  useEffect,
  ReactElement,
  BaseSyntheticEvent,
} from "react";
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

  useEffect(() => {
    setActiveIndex(modalSelected);
  }, [modalSelected]);

  const handleClickBox = () => {
    if (activeIndex === modalIndex) {
      // 같은 모달 아이콘 클릭시 기본 값 -1 부여를 통한 모달 닫힘 처리
      setActiveIndex(-1);
    } else {
      setActiveIndex(modalSelected);
    }
  };

  const handleOutsideClick = () => {
    // 현재 활성화된 모달의 바깥 영역을 클릭한 경우, 기본 값 -1 부여를 통한 모달 닫힘 처리
    setActiveIndex(-1);
  };

  const useOutsideClick = (callback: () => void) => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const handleClick = (event: BaseSyntheticEvent | MouseEvent) => {
        // ref가 존재하고, ref 안에 클릭한 부분이 없을 때에만(ref의 바깥쪽을 눌렀을 때) 동작
        if (ref.current && !ref.current.contains(event.target)) {
          callback();
        }
      };

      document.addEventListener("click", handleClick);

      return () => {
        document.removeEventListener("click", handleClick);
      };
    }, [callback, ref]);
    return ref;
  };

  //
  const ref = useOutsideClick(handleOutsideClick);

  return (
    <ModalLayout className="modallayout">
      {/* ref 속성에는 커스텀 훅 useOutsideClick으로부터 반환받은 ref가 들어감 */}
      <ModalBox onClick={handleClickBox} className="modalbox" ref={ref}>
        {children.props.children[0]}
        {activeIndex === modalIndex ? children.props.children[1] : null}
      </ModalBox>
    </ModalLayout>
  );
}
