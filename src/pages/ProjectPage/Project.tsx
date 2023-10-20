import React from "react";
import styled from "styled-components";
import { useSearchParams } from "react-router-dom";

import {
  ProjectModalLayout,
  ProjectModalTabBackground,
  ProjectModalTabText,
  ProjectModalTabBox,
  ProjectModalContentBox,
  ProjectModalFooter,
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

const Btn = styled.button`
  margin: 10px;
  border: 1px solid black;
  background-color: beige;
`;

export default function Project() {
  const [searchParams, setSearchParams] = useSearchParams();

  let calendarTabColor = "#FFD43B";
  let kanbanTabColor = "#ffea7a";
  let todoTabColor = "#ffea7a";

  let iskanbanShow;
  let isTodoShow;

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
      <ProjectModalLayout>
        <ProjectModalTabBox>
          <ProjectModalTabBackground $color={calendarTabColor} />
          <ProjectModalTabText $top={0.4} $left={2.5}>
            Calender
          </ProjectModalTabText>
        </ProjectModalTabBox>
        <ProjectModalContentBox $isShadowExist>
          <ProjectModalContent>
            <Btn type="button" onClick={() => handleCalClick()}>
              calender
            </Btn>
            <Btn type="button" onClick={() => handlekanbanCLick()}>
              kanban
            </Btn>
            <Btn type="button" onClick={() => handleTodoCLick()}>
              todo
            </Btn>
            <div>calender</div>
          </ProjectModalContent>
          <ProjectModalFooter $isShadowExist />
        </ProjectModalContentBox>
      </ProjectModalLayout>
      {iskanbanShow ? <KanbanModal kanbanTabColor={kanbanTabColor} /> : null}
      {isTodoShow ? <TodoModal todoTabColor={todoTabColor} /> : null}
    </ProjectLayout>
  );
}
