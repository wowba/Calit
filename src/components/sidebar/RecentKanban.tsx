import React from "react";
import { useSearchParams } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import styled from "styled-components";
import recentKanbanState from "../../recoil/atoms/sidebar/recentKanbanState";
import kanbanState from "../../recoil/atoms/kanban/kanbanState";
import todoLoaded from "../../recoil/atoms/sidebar/todoLoaded";

const RecentKanbanContainer = styled.div`
  margin: 1px;
  height: 17rem;
`;
const RecentKanbanTitle = styled.div`
  font-weight: 900;
  margin: 1rem 0;
`;

const RecentKanbanList = styled.div`
  overflow: scroll;
  height: 100%;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const KanbanUrlBox = styled.div<{ $backgroundColor: string }>`
  border-radius: 5px;
  width: 100%;
  margin: 3px 0px;
  padding: 8px 10px;
  transition: all 0.3s ease-in-out;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: left;
  word-wrap: break-word;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  background-color: ${(props) => props.$backgroundColor};
  cursor: pointer;

  &:hover {
  }
`;

export default function RecentKanban() {
  const [, setSearchParams] = useSearchParams();
  const setIsLoaded = useSetRecoilState(todoLoaded);
  const projectId = window.location.pathname.substring(1);

  const recentKanbanUrl = useRecoilValue(recentKanbanState);
  const reversedUrls =
    projectId in recentKanbanUrl
      ? [...recentKanbanUrl[projectId]].reverse()
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

  return (
    <RecentKanbanContainer>
      <RecentKanbanTitle>💫 Recent Kanban</RecentKanbanTitle>
      <RecentKanbanList>
        {reversedUrls === null || reversedUrls.length === 0
          ? "방문한 칸반이 없습니다."
          : ""}

        {reversedUrls
          ? reversedUrls
              .filter(
                (kanbanID: string) => !kanbanData.get(kanbanID).is_deleted,
              )
              .map((kanbanID: string) => (
                <KanbanUrlBox
                  $backgroundColor={kanbanData.get(kanbanID).color}
                  key={kanbanID}
                  onClick={() => handleClick(kanbanID)}
                >
                  <span>{kanbanData.get(kanbanID).name}</span>
                </KanbanUrlBox>
              ))
          : null}
      </RecentKanbanList>
    </RecentKanbanContainer>
  );
}
