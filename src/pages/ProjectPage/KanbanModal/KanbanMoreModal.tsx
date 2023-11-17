import React, { useEffect, useRef } from "react";
import styled, { css } from "styled-components";

const KanbanMoreModalLayout = styled.div<{ $isShow: boolean }>`
  position: absolute;

  top: 5rem;
  right: 2.4rem;

  width: auto;
  background-color: ${(props) => props.theme.Color.mainWhite};

  border: ${(props) => props.theme.Border.thickBorder};
  border-radius: ${(props) => props.theme.Br.default};
  box-shadow: ${(props) => props.theme.Bs.default};

  padding: 0.4rem 0.6rem;

  z-index: 999;

  transition: background-color 0.3s ease;
  &:hover {
    background-color: ${(props) => props.theme.Color.activeColor};
  }

  ${(props) =>
    !props.$isShow &&
    css`
      display: none;
    `}
`;

interface Props {
  isShow: boolean;
  setIsShow: React.Dispatch<React.SetStateAction<boolean>>;
  handleDeleteKanban: () => Promise<void>;
}

export default function KanbanMoreModal(props: Props) {
  const { isShow, setIsShow, handleDeleteKanban } = props;

  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sweetAlertComponent =
      document.getElementsByClassName("swal2-container");
    function handleClickOutside(e: MouseEvent): void {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node) &&
        !sweetAlertComponent[0]
      ) {
        setIsShow(false);
      }
    }
    document.addEventListener("mouseup", handleClickOutside);
    return () => {
      document.removeEventListener("mouseup", handleClickOutside);
    };
  }, [wrapperRef]);

  return (
    <KanbanMoreModalLayout ref={wrapperRef} $isShow={isShow}>
      <button
        style={{ display: "inline-block", width: "10rem", textAlign: "start" }}
        type="button"
        onClick={handleDeleteKanban}
      >
        칸반 삭제하기
      </button>
    </KanbanMoreModalLayout>
  );
}
