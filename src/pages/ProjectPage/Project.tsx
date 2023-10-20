import React from "react";
import styled from "styled-components";
import { useSearchParams } from "react-router-dom";

import {
  ProjectModalLayout,
  ProjectModalTabBackground,
  ProjectModalTabText,
  ProjectModalTabBox,
  ProjectModalContentBox,
  ProjectModalContent,
} from "../../components/layout/ProjectModalLayout";
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

const TestBtn = styled.button`
  margin: 10px;
  border: 1px solid black;
  background-color: beige;
`;

export default function Project() {
  const [searchParams, setSearchParams] = useSearchParams();

  let calendarTabColor = "#FFD43B";
  let kanbanTabColor = "#ffea7a";
  let todoTabColor = "#ffea7a";

  let iskanbanShow = false;
  let isTodoShow = false;

  const handleCalClick = () => {
    setSearchParams();
  };

  const handlekanbanCLick = () => {
    setSearchParams({ kanbanID: "1234" });
  };

  const handleTodoCLick = () => {
    setSearchParams({
      kanbanID: searchParams.get("kanbanID")!,
      todoID: "5678",
    });
  };

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
      <ProjectModalLayout $isShow>
        <ProjectModalTabBox $marginLeft={2}>
          <ProjectModalTabBackground $color={calendarTabColor} />
          <ProjectModalTabText $top={0.4} $left={2.5}>
            Calender
          </ProjectModalTabText>
        </ProjectModalTabBox>
        <ProjectModalContentBox>
          <ProjectModalContent>
            <TestBtn type="button" onClick={() => handleCalClick()}>
              calender
            </TestBtn>
            <TestBtn type="button" onClick={() => handlekanbanCLick()}>
              kanban
            </TestBtn>
            <TestBtn type="button" onClick={() => handleTodoCLick()}>
              todo
            </TestBtn>
            <div>calender</div>
          </ProjectModalContent>
        </ProjectModalContentBox>
      </ProjectModalLayout>
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
