/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { useSearchParams } from "react-router-dom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import styled from "styled-components";

import recentKanbanState from "../../recoil/atoms/sidebar/recentKanbanState";
import kanbanState from "../../recoil/atoms/kanban/kanbanState";
import todoLoaded from "../../recoil/atoms/sidebar/todoLoaded";
import deleteIcon, {
  ReactComponent as DeleteIcon,
} from "../../assets/icons/CrossNoFill.svg";
import getTextColorByBackgroundColor from "../../utils/getTextColorByBgColor";

const RecentKanbanContainer = styled.div`
  max-height: 20rem;
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

const KanbanIdBox = styled.div<{ $backgroundColor: string }>`
  display: flex;
  justify-content: space-between;
  border-radius: 3px;
  width: 100%;
  margin: 3px 0px;
  padding: 1px 10px 3px 10px;
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
  button {
    transition: all 0.5s ease;

    opacity: 0;
    visibility: hidden;
  }
  &:hover {
    & button {
      opacity: 1;
      visibility: visible;
    }
  }
`;

const KanbanTitle = styled.span`
  font-size: 0.875rem;
  padding: 0.05rem 0.04rem 0 0.04rem;
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
      setSearchParams({ kanbanID });
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
      <RecentKanbanTitle>💫 Recent Kanban</RecentKanbanTitle>
      <RecentKanbanList>
        {reversedIds === null || reversedIds.length === 0
          ? "방문한 칸반이 없습니다."
          : ""}

        {reversedIds
          ? reversedIds.map((kanbanID: string) => {
              const deleteIconStyle = {
                fill: kanbanData.has(kanbanID)
                  ? getTextColorByBackgroundColor(
                      kanbanData.get(kanbanID).color,
                    )
                  : getTextColorByBackgroundColor("#B0B0B0"),
                width: "0.75rem",
                height: "0.75rem",
              };
              return (
                <KanbanIdBox
                  $backgroundColor={
                    kanbanData.has(kanbanID)
                      ? kanbanData.get(kanbanID).color
                      : "#B0B0B0"
                  }
                  key={kanbanID}
                  onClick={() => handleClick(kanbanID)}
                >
                  <KanbanTitle
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
                  </KanbanTitle>
                  <button
                    type="button"
                    onClick={(event) => handleDelete(event, kanbanID)}
                  >
                    {/* <img style={{ scale: "0.7" }} src={deleteIcon} alt="삭제" /> */}
                    <DeleteIcon style={deleteIconStyle} />
                  </button>
                </KanbanIdBox>
              );
            })
          : null}
      </RecentKanbanList>
    </RecentKanbanContainer>
  );
}
