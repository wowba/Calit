import React, { useEffect, useRef } from "react";
import { useRecoilValue } from "recoil";
import styled, { css } from "styled-components";
import { doc, updateDoc } from "firebase/firestore";
import { useLocation } from "react-router-dom";

import projectState from "../../../recoil/atoms/project/projectState";
import { db } from "../../../firebaseSDK";
import update from "../../../assets/icons/update.svg";
import getTextColorByBackgroundColor from "../../../utils/getTextColorByBgColor";

const TrashBoxModalLayout = styled.div<{ $isShow: boolean }>`
  position: absolute;

  top: 5rem;
  right: 1rem;

  width: 17rem;
  height: 12rem;
  background-color: ${(props) => props.theme.Color.mainWhite};

  border: ${(props) => props.theme.Border.thickBorder};
  border-radius: ${(props) => props.theme.Br.default};
  box-shadow: ${(props) => props.theme.Bs.default};

  padding: 0.8rem 0.4rem 0.8rem 0.8rem;

  z-index: 999;

  ${(props) =>
    !props.$isShow &&
    css`
      display: none;
    `}
`;

const TrashBoxTitle = styled.p`
  font-size: ${(props) => props.theme.Fs.default};
  font-weight: 500;
`;

const DeletedListBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;

  margin-top: 0.5rem;

  overflow: scroll;

  height: 92%;

  &::-webkit-scrollbar {
    width: 8px;
    overflow-x: hidden;
    overflow-y: scroll;
    border-radius: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.3);
    border-radius: 6px;
  }
  &::-webkit-scrollbar-corner {
    background: transparent;
  }
`;

const DeletedKanbanBox = styled.div<{ $color: string }>`
  display: flex;
  justify-content: space-between;
  padding: 0.125rem 0.5rem;

  border-radius: ${(props) => props.theme.Br.small};
  background-color: ${(props) => props.$color};
  color: ${(props) => getTextColorByBackgroundColor(props.$color)};
`;

const DeletedKanbanName = styled.p`
  width: 7rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

interface Props {
  isShow: boolean;
  setIsShow: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function TrashModal(props: Props) {
  const { isShow, setIsShow } = props;
  const { pathname } = useLocation();

  const { deleted_kanban_info_list: deletedKanbanInfoList } =
    useRecoilValue(projectState).projectData;

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
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  const handleRestoreCLick = async (id: string) => {
    const updatedDeletedKanbanIdList = deletedKanbanInfoList.filter(
      (kanbanInfo: { id: string; name: string }) => kanbanInfo.id !== id,
    );
    const projectRef = doc(db, "project", pathname);
    await updateDoc(projectRef, {
      deleted_kanban_info_list: updatedDeletedKanbanIdList,
    });
    const kanbanRef = doc(db, "project", pathname, "kanban", id);
    await updateDoc(kanbanRef, {
      is_deleted: false,
    });
  };

  return (
    <TrashBoxModalLayout ref={wrapperRef} $isShow={isShow}>
      <TrashBoxTitle>휴지통</TrashBoxTitle>
      <DeletedListBox>
        {deletedKanbanInfoList.length === 0 ? "삭제된 칸반이 없습니다." : ""}

        {deletedKanbanInfoList.map(
          (kanbanInfo: { id: string; name: string; color: string }) => (
            <DeletedKanbanBox key={kanbanInfo.id} $color={kanbanInfo.color}>
              <DeletedKanbanName>{kanbanInfo.name}</DeletedKanbanName>
              <button
                type="button"
                onClick={() => handleRestoreCLick(kanbanInfo.id)}
              >
                <img style={{ margin: "0 0 0 1rem" }} src={update} alt="복구" />
              </button>
            </DeletedKanbanBox>
          ),
        )}
      </DeletedListBox>
    </TrashBoxModalLayout>
  );
}
