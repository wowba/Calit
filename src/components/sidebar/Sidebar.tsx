import React, { useState } from "react";
import styled, { css } from "styled-components";
import { useRecoilValue } from "recoil";
import { useLocation } from "react-router-dom";
import { doc, updateDoc } from "firebase/firestore";
import defaultProjectImg from "../../assets/images/deafultProjectImg.jpg";
import projectState from "../../recoil/atoms/project/projectState";
import RecentKanban from "./RecentKanban";
import trashIcon from "../../assets/icons/trashIcon.svg";
import { db } from "../../firebaseSDK";

const SidebarLayout = styled.div`
  display: flex;
  position: relative;
  flex-direction: column;
  justify-content: space-between;

  width: 15rem;
  height: 100%;

  padding: 4rem 1.25rem 1.25rem 1.25rem;
`;

const ProjectInfoBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`;

const ProjectTitleParagraph = styled.p`
  font-size: 1.5rem;
  font-weight: 900;
  margin: 0.25rem 0 2.8rem 0;
`;

const ProjectProfileImg = styled.img`
  width: 100%;
  height: 7rem;
  object-fit: cover;
  border-radius: 0.5rem;
`;

const TrashBoxBtn = styled.div`
  transition: all 0.2s;

  position: fixed;

  display: flex;
  justify-content: center;
  align-items: center;

  top: calc(100% - 3.3rem);

  width: 11.5rem;
  height: 2.3rem;
  background-color: ${(props) => props.theme.Color.mainColor1};
  &:hover {
    cursor: pointer;
  }

  border-radius: 0.3rem;

  z-index: 3;
`;
const TrashBoxImg = styled.img`
  width: 1.2rem;
`;
const DeletedListLayout = styled.div<{ $isShow: boolean }>`
  position: fixed;
  overflow: scroll;
  width: 11.5rem;
  height: ${(props) => (props.$isShow ? "24rem" : "0")};
  padding: 1rem 1rem 0 1rem;
  transition:
    height 1s ease,
    color 0.7s ease-in;
  background-color: #f5f5f5;
  border-radius: 0.3rem;
  bottom: 2.4rem;
  color: ${(props) => (props.$isShow ? "black" : "transparent")};
  font-size: 0.95rem;
  ${(props) =>
    !props.$isShow &&
    css`
      bottom: 2.2rem;
    `};
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
const SubtitleText = styled.div`
  font-weight: 900;
  margin: 0 0 1rem;
`;

const DeletedKanbanBox = styled.div<{ $isShow: boolean }>`
  display: flex;
  gap: 0.5rem;
  margin: 0.5rem 0;
`;

const DeletedKanbanName = styled.p`
  width: 7rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export default function Sidebar() {
  const { projectData } = useRecoilValue(projectState);

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
    <SidebarLayout>
      <div style={{ height: "100%" }}>
        <ProjectInfoBox>
          <ProjectProfileImg
            src={
              projectData.project_img_URL
                ? projectData.project_img_URL
                : defaultProjectImg
            }
            alt="Project Profile Img"
          />
          <ProjectTitleParagraph>{projectData.name}</ProjectTitleParagraph>
        </ProjectInfoBox>
        <RecentKanban />
      </div>
      <TrashBoxBtn onClick={handleTrashBoxBtnClick}>
        <TrashBoxImg src={trashIcon} alt="TrashIcon" />
      </TrashBoxBtn>
      <DeletedListLayout $isShow={isListShow}>
        <SubtitleText>🛠️ 쓰레기통</SubtitleText>
        {deletedKanbanInfoList.length === 0 ? "삭제된 칸반이 없습니다." : ""}

        {deletedKanbanInfoList.map(
          (kanbanInfo: { id: string; name: string }) => (
            <DeletedKanbanBox key={kanbanInfo.id} $isShow={isListShow}>
              <DeletedKanbanName>{kanbanInfo.name}</DeletedKanbanName>
              <button
                type="button"
                onClick={() => handleRestoreCLick(kanbanInfo.id)}
              >
                <img
                  style={{ margin: "0 0 0 1rem" }}
                  src={trashIcon}
                  alt="복구"
                />
              </button>
            </DeletedKanbanBox>
          ),
        )}
      </DeletedListLayout>
    </SidebarLayout>
  );
}
