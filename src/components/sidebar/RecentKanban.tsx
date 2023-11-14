import React from "react";
import { useSearchParams } from "react-router-dom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import styled from "styled-components";

import recentKanbanState from "../../recoil/atoms/sidebar/recentKanbanState";
import kanbanState from "../../recoil/atoms/kanban/kanbanState";
import todoLoaded from "../../recoil/atoms/sidebar/todoLoaded";
import deleteIcon from "../../assets/icons/closeIcon.svg";
import getTextColorByBackgroundColor from "../../utils/getTextColorByBgColor";

const RecentKanbanContainer = styled.div`
  margin: 1px;
  height: 17rem;
`;
const RecentKanbanTitle = styled.div`
  font-weight: 900;
  font-size: 1.5rem;
  margin: 0 0 0.25rem 0;
`;

const RecentKanbanList = styled.div`
  overflow: scroll;
  height: 100%;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const KanbanIdBox = styled.div<{ $backgroundColor: string }>`
  display: flex;
  justify-content: space-between;
  border-radius: 5px;
  width: 100%;
  margin: 3px 0px;
  padding: 0.3rem 0.5rem;
  transition: all 0.3s ease-in-out;
  background-color: ${(props) => props.$backgroundColor};
  cursor: pointer;
  > span {
    max-width: 90%;
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: left;
    word-wrap: break-word;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  &:hover {
    /* transform: scale(110%); */
  }
`;

export default function RecentKanban() {
  const [, setSearchParams] = useSearchParams();
  const setIsLoaded = useSetRecoilState(todoLoaded);
  const projectId = window.location.pathname.substring(1);

  const [recentKanbanId, setRecentKanbanId] = useRecoilState(recentKanbanState);
  const reversedIds =
    projectId in recentKanbanId
      ? [...recentKanbanId[projectId]].reverse()
      : null;
  const kanbanData = useRecoilValue(kanbanState);
  const urlQueryString = new URLSearchParams(window.location.search);
  const curKanbanId = String(urlQueryString.get("kanbanID"));

  // 최근 칸반 바로가기 기능
  const handleClick = (kanbanID: string) => {
    // 현재 위치한 페이지가 바로가기 목적지이면 동작 X
    if (curKanbanId === kanbanID) {
      return;
    }
    setIsLoaded(false);
    setSearchParams({ kanbanID });
  };

  const handleDelete = (event: any, kanbanID: string) => {
    event?.stopPropagation();
    const newIds = recentKanbanId[projectId].filter(
      (id: string) => id !== kanbanID,
    );
    setRecentKanbanId((prev: any) => ({
      ...prev,
      [projectId]: [...newIds],
    }));
  };

  return (
    <RecentKanbanContainer>
      <RecentKanbanTitle>Recent Kanban</RecentKanbanTitle>
      <RecentKanbanList>
        {reversedIds === null || reversedIds.length === 0
          ? "방문한 칸반이 없습니다."
          : ""}

        {reversedIds
          ? reversedIds.map((kanbanID: string) => (
              <KanbanIdBox
                $backgroundColor={
                  kanbanData.has(kanbanID)
                    ? kanbanData.get(kanbanID).color
                    : "gray"
                }
                key={kanbanID}
                onClick={() => handleClick(kanbanID)}
              >
                <span
                  style={
                    kanbanData.get(kanbanID).color
                      ? {
                          color: getTextColorByBackgroundColor(
                            kanbanData.get(kanbanID).color,
                          ),
                        }
                      : { color: "white" }
                  }
                >
                  {kanbanData.has(kanbanID)
                    ? kanbanData.get(kanbanID).name
                    : "제거된 칸반입니다"}
                </span>
                <button
                  type="button"
                  onClick={(event) => handleDelete(event, kanbanID)}
                >
                  <img src={deleteIcon} alt="삭제" />
                </button>
              </KanbanIdBox>
            ))
          : null}
      </RecentKanbanList>
    </RecentKanbanContainer>
  );
}
