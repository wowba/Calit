import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useRecoilState, useSetRecoilState } from "recoil";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebaseSDK";
import kanbanState from "../../../recoil/atoms/kanban/kanbanState";
import todoState from "../../../recoil/atoms/todo/todoState";
import Stage from "./Stage";
import yearMonthDayFormat from "../../../utils/yearMonthDayFormat";
import trashIcon from "../../../assets/icons/trashIcon.svg";
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
  const [stageLists, setStageLists] = useState([]);
  const navigate = useNavigate();
  const kanbanDataState = useRecoilState(kanbanState);
  const setKanbanDataState = useSetRecoilState(kanbanState);
  const todoDataState = useRecoilState(todoState);
  const projectID = window.location.pathname.substring(1);
  const kanbanID = searchParams.get("kanbanID")!;
  const [todoSize, setTodoSize] = useState();
  console.log(kanbanDataState, kanbanID);
  // console.log(todoDataState[0].todoData.size)

  const ProjectKanbanBox = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 1rem;
  `;

  const ProjectKanbanInfoBox = styled.div``;

  const ProjectKanbanInfoInnerBox = styled.div`
    display: flex;
    justify-content: space-between;
  `;

  const ProjectKanbanTrashIcon = styled.img`
    z-index: 2;
    cursor: pointer;
    padding: 0 1rem;
  `;

  const ProjectKanbanProgressBox = styled.div``;

  const ProjectKanbanInfoParagraph = styled.p`
    font-weight: bold;
    font-size: 1.5rem;
  `;

  const ProjectKanbanDateParagraph = styled.p`
    font-size: 0.75rem;
  `;

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

  const handleDelete = async () => {
    const kanbanRef = doc(db, "project", projectID, "kanban", kanbanID);
    const targetKanban = kanbanDataState[0]?.get(kanbanID);
    await updateDoc(kanbanRef, {
      is_deleted: true,
    });
    setKanbanDataState((prev) => {
      prev.set(kanbanID, targetKanban);
      return new Map([...prev]);
    });
    navigate("/");
  };

  useEffect(() => {
    if (!isKanbanShow) {
      return;
    }

    const targetKanban = kanbanDataState[0]?.get(kanbanID);
    setKanbanDataState((prev) => {
      if (targetKanban.stage_list.length === 0) {
        targetKanban.stage_list = DEFAULT_STAGES;
      }
      prev.set(kanbanID, targetKanban);
      return new Map([...prev]);
    });
    console.log("프로젝트 내 칸반 정보", kanbanDataState);
    setTodoSize(todoDataState[0]?.todoData?.size);
    setStageLists(targetKanban.stage_list);
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
        <ProjectKanbanBox>
          <ProjectKanbanInfoBox>
            <ProjectKanbanInfoInnerBox>
              <ProjectKanbanInfoParagraph>
                {kanbanDataState[0].get(kanbanID).name}
              </ProjectKanbanInfoParagraph>
              <ProjectKanbanTrashIcon
                src={trashIcon}
                alt="칸반 삭제"
                onClick={() => handleDelete()}
              />
            </ProjectKanbanInfoInnerBox>
            <ProjectKanbanDateParagraph>
              {`${yearMonthDayFormat(
                kanbanDataState[0]?.get(kanbanID).created_date.seconds,
              )} - ${yearMonthDayFormat(
                kanbanDataState[0]?.get(kanbanID).end_date.seconds,
              )}`}
            </ProjectKanbanDateParagraph>
          </ProjectKanbanInfoBox>
          <ProjectKanbanProgressBox>
            progress bar 들어갈 공간
            {`  ${todoSize} / ${todoSize} `}
          </ProjectKanbanProgressBox>
        </ProjectKanbanBox>
        <Stage stageLists={stageLists} isKanbanShow={isKanbanShow} />
      </ProjectModalContentBox>
    </ProjectModalLayout>
  );
}
