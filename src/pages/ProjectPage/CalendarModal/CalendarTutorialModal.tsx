import React, { useEffect, useRef } from "react";
import styled, { css } from "styled-components";

const CalendarToturialModalLayout = styled.div<{ $isShow: boolean }>`
  position: absolute;

  top: 10rem;
  left: calc(100% - 14rem);
  transform: translate(-50%, -50%);

  width: 26.3rem;
  height: auto;
  border-radius: 7px;
  box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.3);
  background-color: white;
  padding: 2.5rem 2.5rem 2.5rem 2.5rem;

  z-index: 999;

  display: flex;
  flex-direction: column;
  gap: 1rem;

  ${(props) =>
    !props.$isShow &&
    css`
      display: none;
    `}
`;

interface Props {
  isShow: boolean;
  setIsShow: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function CalendarTutorialModal(props: Props) {
  const { isShow, setIsShow } = props;
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent): void {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setIsShow(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  return (
    <CalendarToturialModalLayout ref={wrapperRef} $isShow={isShow}>
      <div>
        <div style={{ fontWeight: "900" }}>- Drag Calendar</div>
        <div>달력을 드래그 해 칸반을 생성할 수 있습니다.</div>
      </div>

      <div>
        <div style={{ fontWeight: "900" }}>- Drag Kanban</div>
        <div>달력 내 일정을 드래그 하여 날짜를 변경할 수 있습니다.</div>
        <div>일정의 끝부분을 드래그 해 기한을 늘릴 수 있습니다.</div>
      </div>
    </CalendarToturialModalLayout>
  );
}
