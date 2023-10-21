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
} from "../../../components/layout/ProjectModalLayout";

type Props = {
  todoTabColor: string;
  isTodoShow: boolean;
};

export default function TodoModal({ todoTabColor, isTodoShow }: Props) {
  const [searchParams, setSearchParams] = useSearchParams();

  const TestBtn = styled.button`
    margin: 10px;
    border: 1px solid black;
    background-color: beige;
  `;

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

  return (
    <ProjectModalLayout $isShow={isTodoShow}>
      <ProjectModalTabBox $marginLeft={19.5}>
        <ProjectModalTabBackground $color={todoTabColor} />
        <ProjectModalTabText $top={0.4} $left={3.3}>
          Todo
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
          <div>Todo</div>
        </ProjectModalContent>
      </ProjectModalContentBox>
    </ProjectModalLayout>
  );
}