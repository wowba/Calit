import React from "react";
import { useSearchParams } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import styled from "styled-components";
import recentKanbanState from "../../recoil/atoms/sidebar/recentKanbanState";
import kanbanState from "../../recoil/atoms/kanban/kanbanState";
import todoLoaded from "../../recoil/atoms/sidebar/todoLoaded";

const KanbanUrlBox = styled.div`
  background-color: green;
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
    <>
      <span>Recent Kanban</span>
      {reversedUrls
        ? reversedUrls.map((kanbanID: string) => (
            <KanbanUrlBox key={kanbanID} onClick={() => handleClick(kanbanID)}>
              <span>{kanbanData.get(kanbanID).name}</span>
            </KanbanUrlBox>
          ))
        : null}
    </>
  );
}
