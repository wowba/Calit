import React from "react";
import styled from "styled-components";
import { useSearchParams } from "react-router-dom";

import CalendarModal from "./CalendarModal/CalendarModal";
import KanbanModal from "./KanbanModal/KanbanModal";
import TodoModal from "./TodoModal/TodoModal";

const ProjectLayout = styled.div`
  position: relative;

  width: 100%;
  height: 100%;
  padding: 1rem 1.75rem 0 0.5rem;
`;

const ProjectLayoutFooter = styled.div`
  position: fixed;
  z-index: 999;
  top: calc(100% - 0.6rem);

  /* 사이드바 width 변경시 수정 필요. */
  width: calc(100% - 14rem);
  height: 0.6rem;

  border-radius: 0 0.6rem 0 0;
  background-color: #ffea7a;
  box-shadow: -2px 4px 20px 0px rgba(0, 0, 0, 0.6);
`;

export default function Project() {
  const [searchParams] = useSearchParams();

  let calendarTabColor = "#FFD43B";
  let kanbanTabColor = "#ffea7a";
  let todoTabColor = "#ffea7a";

  let iskanbanShow = false;
  let isTodoShow = false;

  if (searchParams.has("kanbanID")) {
    calendarTabColor = "#ffea7a";
    kanbanTabColor = "#FFD43B";
    iskanbanShow = true;
  }
  if (searchParams.has("todoID")) {
    kanbanTabColor = "#ffea7a";
    todoTabColor = "#FFD43B";
    isTodoShow = true;
  }

  return (
    <ProjectLayout>
      {/* 캘린더 */}
      <CalendarModal calendarTabColor={calendarTabColor} />
      {/* 칸반 */}
      <KanbanModal
        kanbanTabColor={kanbanTabColor}
        isKanbanShow={iskanbanShow}
      />
      {/* 투두 */}
      <TodoModal todoTabColor={todoTabColor} isTodoShow={isTodoShow} />
      <ProjectLayoutFooter />
    </ProjectLayout>
  );
}
