import React, { useEffect, useRef } from "react";
import styled, { css } from "styled-components";

const TodoMoreModalLayout = styled.div<{ $isShow: boolean }>`
  position: absolute;
  top: 1.5rem;
  right: 0;

  width: 10rem;
  background-color: ${(props) => props.theme.Color.mainWhite};

  border: ${(props) => props.theme.Border.thickBorder};
  border-radius: ${(props) => props.theme.Br.default};
  box-shadow: ${(props) => props.theme.Bs.default};

  z-index: 999;

  ${(props) =>
    !props.$isShow &&
    css`
      display: none;
    `}
`;

const ModalInnerBtn = styled.button`
  width: 100%;

  text-align: start;
  padding: 0.4rem 0.6rem;

  border-bottom: ${(props) => props.theme.Border.thinBorder};
  transition: background-color 0.3s ease;
  &:hover {
    background-color: ${(props) => props.theme.Color.activeColor};
  }
`;

interface Props {
  isShow: boolean;
  setIsShow: React.Dispatch<React.SetStateAction<boolean>>;
  handleDeleteClick: () => Promise<void>;
}

export default function TodoMoreModal(props: Props) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { isShow, setIsShow, handleDeleteClick } = props;

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
    <TodoMoreModalLayout ref={wrapperRef} $isShow={isShow}>
      <ModalInnerBtn type="button" onClick={handleDeleteClick}>
        투두 삭제하기
      </ModalInnerBtn>
    </TodoMoreModalLayout>
  );
}
