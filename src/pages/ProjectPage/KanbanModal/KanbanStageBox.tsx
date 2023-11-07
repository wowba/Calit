/* eslint-disable no-param-reassign */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useCallback, useEffect, useState } from "react";
import { styled } from "styled-components";
import { doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { DragDropContext, DropResult, Droppable } from "@hello-pangea/dnd";
import { useRecoilValue } from "recoil";
import { v4 as uuid } from "uuid";

import { createTodo } from "../../../api/CreateCollection";
import todoDataState from "../../../recoil/atoms/todo/todoState";
import icon_plus_circle from "../../../assets/icons/icon_plus_circle.svg";
import trashIcon from "../../../assets/icons/trashIcon.svg";
import { db } from "../../../firebaseSDK";
import Column from "./Stage";

const StageLayout = styled.div`
  display: flex;
`;

const StageBox = styled.div`
  height: 20rem;
  width: 10rem;
  margin: 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StageInfoBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 10rem;
  border-bottom: 2px solid #eaeaea;
  margin-bottom: 0.5rem;
`;
const StageContentBox = styled.div`
  box-sizing: border-box;

  height: 60vh;
  width: 10vw;
  padding: 0 0.5rem;

  background: #ededed;
  border: 1px solid #d5d5d5;
  box-shadow: 3px 4px 9px -2px rgba(0, 0, 0, 0.13);
  border-radius: 10px;
  overflow: scroll;
`;

const StageContent = styled.div`
  height: 4rem;
  width: 100%;
  display: flex;
  flex-direction: column;

  border-radius: 10px;
  border: 1px solid #d5d5d5;
  background: #fff;
`;

const StageContentParagraph = styled.p`
  &.title {
    font-weight: bold;
  }
`;

const StageIconBox = styled.div`
  display: flex;
`;

const StageInfoTrashIcon = styled.img`
  height: 1rem;
  width: 1rem;
  cursor: pointer;
  display: none;
`;

const StageInfoPlusIcon = styled.img`
  height: 1rem;
  width: 1rem;
  cursor: pointer;
`;

const Container = styled.div`
  display: flex;
`;

interface Props {
  stageList: any;
  isKanbanShow: boolean;
}

interface IData {
  tasks: {
    [key: string]: { id: string; content: string };
  };
  columns: {
    [key: string]: { id: string; title: string; taskIds: string[] };
  };
  columnOrder: string[];
}

export interface InitialData {
  todos: {
    [key: string]: { id: string; name: string };
  };
  stages: {
    [key: string]: { id: string; name: string; todoIds: string[] };
  };
  stageOrder: string[];
}

export default function KanbanStageBox({ stageList, isKanbanShow }: Props) {
  const urlQueryString = new URLSearchParams(window.location.search);
  const projectID = window.location.pathname.substring(1);
  const kanbanID = String(urlQueryString.get("kanbanID"));
  const kanbanRef = doc(db, "project", projectID, "kanban", kanbanID);

  const todoState = useRecoilValue(todoDataState);

  const initialData: InitialData = {
    todos: {},
    stages: {},
    stageOrder: [],
  };

  const [data, setData] = useState<InitialData>(initialData);

  useEffect(() => {
    if (!isKanbanShow) return;
    const updatedData: InitialData = {
      todos: {},
      stages: {},
      stageOrder: [],
    };

    // 1-1. stageList 배열 반복문
    stageList.forEach((stage: any) => {
      updatedData.stages[stage.id] = stage;
      updatedData.stageOrder.push(stage.id);
    });

    // 1-2. todoState Map 반복문
    todoState.forEach((value, key) => {
      value.id = key;
      updatedData.todos[key] = value;
    });

    setData(updatedData);
  }, [todoState, stageList, isKanbanShow]);

  // 변경시 업데이트 해야할 것
  // 1. stageList 배열 순서
  // 2. stage 내 todoIds 순서
  const handleOnDragEnd = useCallback(
    (result: DropResult) => {
      const { destination, source, draggableId, type } = result;
      if (!destination) return;
      if (
        destination.droppableId === source.droppableId &&
        source.index === destination.index
      )
        return;

      if (type === "column") {
        const newColumnOrder = Array.from(data.stageOrder);
        newColumnOrder.splice(source.index, 1);
        newColumnOrder.splice(destination.index, 0, draggableId);

        const newData = {
          ...data,
          stageOrder: newColumnOrder,
        };
        setData(newData);
        return;
      }
      const startColumn = data.stages[source.droppableId];
      const finishColumn = data.stages[destination.droppableId];

      if (startColumn === finishColumn) {
        const newTaskIds = Array.from(startColumn.todoIds);
        newTaskIds.splice(source.index, 1);
        newTaskIds.splice(destination.index, 0, draggableId);

        const newColumn = {
          ...startColumn,
          todoIds: newTaskIds,
        };

        const newData = {
          ...data,
          stages: {
            ...data.stages,
            [newColumn.id]: newColumn,
          },
        };

        setData(newData);
      } else {
        const startTaskIds = Array.from(startColumn.todoIds);
        startTaskIds.splice(source.index, 1);
        const newStartColumn = {
          ...startColumn,
          todoIds: startTaskIds,
        };

        const finishTaskIds = Array.from(finishColumn.todoIds);
        finishTaskIds.splice(destination.index, 0, draggableId);
        const newFinishColumn = {
          ...finishColumn,
          todoIds: finishTaskIds,
        };

        const newData = {
          ...data,
          stages: {
            ...data.stages,
            [newStartColumn.id]: newStartColumn,
            [newFinishColumn.id]: newFinishColumn,
          },
        };

        setData(newData);
      }
    },
    [data],
  );

  const handleAddTodoClick = async (stageId: string) => {
    const todoId = await createTodo(projectID, kanbanID, {
      update_list: [],
      user_list: [],
      name: "테스트투두",
      created_date: serverTimestamp(),
      modified_date: serverTimestamp(),
      is_deleted: false,
      deadline: new Date(),
      info: "내용",
      todo_tag_list: [],
      todo_option_list: [
        {
          label: "긴급🔥",
          value: "긴급🔥",
          color: "#f92f66",
          canDelete: false,
        },
        { label: "FE✨", value: "FE✨", color: "#ddafff", canDelete: false },
        { label: "BE🛠️", value: "BE🛠️", color: "#F5F3BB", canDelete: false },
        {
          label: "UX/UI🎨",
          value: "UX/UI🎨",
          color: "#00FFF5",
          canDelete: false,
        },
      ],
    });
    const updatedStageList = stageList.map((stage: any) => {
      if (stage.id === stageId) {
        stage.todoIds.push(todoId);
        return stage;
      }
      return stage;
    });
    await updateDoc(kanbanRef, {
      stage_list: updatedStageList,
    });
  };

  const handleAddStageClick = async () => {
    stageList.push({
      id: uuid(),
      name: `새 스테이지`,
      todoIds: [],
    });
    await updateDoc(kanbanRef, {
      stage_list: stageList,
    });
  };

  return (
    <StageLayout>
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable
          droppableId="all-columns"
          direction="horizontal"
          type="column"
          getContainerForClone={() => document.body}
        >
          {(provided) => (
            <Container {...provided.droppableProps} ref={provided.innerRef}>
              {data.stageOrder.map((columnId, index) => {
                const stage = data.stages[columnId];
                const todos = stage.todoIds.map((todoId) => data.todos[todoId]);
                return (
                  <Column
                    stage={stage}
                    todos={todos}
                    key={stage.id}
                    index={index}
                    handleAddTodoClick={handleAddTodoClick}
                  />
                );
              })}
              {provided.placeholder}
            </Container>
          )}
        </Droppable>
      </DragDropContext>
      <StageBox>
        <StageInfoBox>
          스테이지 추가하기
          <StageInfoTrashIcon src={trashIcon} alt="스테이지 삭제" />
          <StageInfoPlusIcon
            src={icon_plus_circle}
            alt="스테이지 추가"
            onClick={handleAddStageClick}
          />
        </StageInfoBox>
        <StageContentBox />
      </StageBox>
    </StageLayout>
  );
}