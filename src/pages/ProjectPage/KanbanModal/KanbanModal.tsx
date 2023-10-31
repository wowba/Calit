import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useSearchParams } from "react-router-dom";
import { useRecoilState, useSetRecoilState } from "recoil";
import kanbanState from "../../../recoil/atoms/kanban/kanbanState";
import Stage from "./Stage";

import {
  ProjectModalLayout,
  ProjectModalTabBackground,
  ProjectModalTabText,
  ProjectModalTabBox,
  ProjectModalContentBox,
} from "../../../components/layout/ProjectModalLayout";

type Props = {
  kanbanTabColor: string;
  isKanbanShow: boolean;
};

const DEFAULT_STAGES = [
  {
    name: "완료",
    order: 0,
    created_date: new Date(),
    modified_date: new Date(),
  },
  {
    name: "작업 중",
    order: 1,
    created_date: new Date(),
    modified_date: new Date(),
  },
  {
    name: "작업 전",
    order: 2,
    created_date: new Date(),
    modified_date: new Date(),
  },
];

export default function KanbanModal({ kanbanTabColor, isKanbanShow }: Props) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoaded, setIsLoaded] = useState(false);
  const kanbanDataState = useRecoilState(kanbanState);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const setKanbanDataState = useSetRecoilState(kanbanState);
  const kanbanID = searchParams.get("kanbanID")!;
  // console.log("...", ...kanbanDataState, DEFAULT_STAGES);

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

  useEffect(() => {
    if (!isKanbanShow) {
      return;
    }

    const targetKanban = kanbanDataState[0].get(kanbanID);
    console.log(targetKanban);
    console.log(targetKanban.stage_list);
    setKanbanDataState((prev) => {
      targetKanban.stage_list = DEFAULT_STAGES;
      prev.set(kanbanID, targetKanban);
      return new Map([...prev]);
    });
    console.log("프로젝트 내 칸반 정보", kanbanDataState);
    setIsLoaded(true);
  }, [kanbanID]);

  if (!isLoaded) {
    return (
      <ProjectModalLayout $isShow={isKanbanShow}>
        <ProjectModalTabBox $marginLeft={10.75}>
          <ProjectModalTabBackground $color={kanbanTabColor} />
          <ProjectModalTabText $top={0.4} $left={2.8}>
            Kanban
          </ProjectModalTabText>
        </ProjectModalTabBox>
        <ProjectModalContentBox>
          <TestBtn type="button" onClick={() => handleCalClick()}>
            calender
          </TestBtn>
          <TestBtn type="button" onClick={() => handlekanbanCLick()}>
            kanban
          </TestBtn>
          <TestBtn type="button" onClick={() => handleTodoCLick()}>
            todo
          </TestBtn>
          <div>kanbannnnn</div>
        </ProjectModalContentBox>
      </ProjectModalLayout>
    );
  }

  return (
    <ProjectModalLayout $isShow={isKanbanShow}>
      <ProjectModalTabBox $marginLeft={10.75}>
        <ProjectModalTabBackground $color={kanbanTabColor} />
        <ProjectModalTabText $top={0.4} $left={2.8}>
          Kanban
        </ProjectModalTabText>
      </ProjectModalTabBox>
      <ProjectModalContentBox>
        <TestBtn type="button" onClick={() => handleCalClick()}>
          calender
        </TestBtn>
        <TestBtn type="button" onClick={() => handlekanbanCLick()}>
          kanban
        </TestBtn>
        <TestBtn type="button" onClick={() => handleTodoCLick()}>
          todo
        </TestBtn>
        <div>kanban</div>
        <Stage />
      </ProjectModalContentBox>
    </ProjectModalLayout>
  );
}
