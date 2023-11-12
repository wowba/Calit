import React, { useState } from "react";
import styled, { css } from "styled-components";
import { useRecoilValue } from "recoil";
import { doc, updateDoc } from "firebase/firestore";
import { useLocation } from "react-router-dom";

import trashIcon from "../assets/icons/trashIcon.svg";
import projectState from "../recoil/atoms/project/projectState";
import { db } from "../firebaseSDK";

const TrashBoxLayout = styled.div`
  width: 100%;
`;

const TrashBoxBtn = styled.div`
  transition: all 0.2s;

  position: relative;

  display: flex;
  justify-content: center;
  align-items: center;

  width: 100%;
  height: 2.3rem;
  background-color: ${(props) => props.theme.Color.yellow2};
  &:hover {
    background-color: ${(props) => props.theme.Color.yellow1};
    cursor: pointer;
  }

  border-radius: 0.3rem;

  z-index: 3;
`;

const TrashBoxImg = styled.img`
  width: 1.5rem;
`;

const DeletedListLayout = styled.div<{ $isShow: boolean }>`
  position: fixed;

  transition: all 1s ease;

  width: 11.5rem;
  height: 100%;
  padding: 1rem 1rem 0 1rem;

  background-color: #f5f5f5;
  border-radius: 0.3rem;

  top: 14rem;
  ${(props) =>
    !props.$isShow &&
    css`
      top: 100%;
    `};
`;

const DeletedKanbanBox = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const DeletedKanbanName = styled.p`
  width: 7rem;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const WhiteArea = styled.div`
  position: fixed;

  width: inherit;
  height: 100%;

  background-color: white;
  top: calc(100% - 3rem);
`;

export default function TrashBox() {
  const { pathname } = useLocation();

  const { deleted_kanban_info_list: deletedKanbanInfoList } =
    useRecoilValue(projectState).projectData;

  const [isListShow, setIsListShow] = useState(false);

  const handleTrashBoxBtnClick = () => {
    setIsListShow((prev) => !prev);
  };

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
    <>
      <TrashBoxLayout>
        <TrashBoxBtn onClick={handleTrashBoxBtnClick}>
          <TrashBoxImg src={trashIcon} alt="TrashIcon" />
        </TrashBoxBtn>
      </TrashBoxLayout>
      <DeletedListLayout $isShow={isListShow}>
        {deletedKanbanInfoList.length === 0 ? "삭제된 칸반이 없습니다." : ""}
        {deletedKanbanInfoList.map(
          (kanbanInfo: { id: string; name: string }) => (
            <DeletedKanbanBox key={kanbanInfo.id}>
              <DeletedKanbanName>{kanbanInfo.name}</DeletedKanbanName>
              <button
                type="button"
                onClick={() => handleRestoreCLick(kanbanInfo.id)}
              >
                복구
              </button>
            </DeletedKanbanBox>
          ),
        )}
      </DeletedListLayout>
      <WhiteArea />
    </>
  );
}
