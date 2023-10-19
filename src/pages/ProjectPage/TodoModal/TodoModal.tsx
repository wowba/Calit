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
} from "../../../components/layout/ProjectModalLayout";

type Props = {
  todoTabColor: string;
};

export default function TodoModal({ todoTabColor }: Props) {
  const [searchParams, setSearchParams] = useSearchParams();

  const Btn = styled.button`
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
    <ProjectModalLayout>
      <ProjectModalTabBox style={{ marginLeft: "18rem" }}>
        <ProjectModalTabBackground $color={todoTabColor} />
        <ProjectModalTabText $top={0.4} $left={3.3}>
          Todo
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
          <div>Todo</div>
        </ProjectModalContent>
        <ProjectModalFooter $isShadowExist />
      </ProjectModalContentBox>
    </ProjectModalLayout>
  );
}
