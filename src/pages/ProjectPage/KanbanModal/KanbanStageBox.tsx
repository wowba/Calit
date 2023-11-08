/* eslint-disable no-param-reassign */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useCallback, useEffect, useState } from "react";
import { styled } from "styled-components";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { DragDropContext, DropResult, Droppable } from "@hello-pangea/dnd";
import { useRecoilValue } from "recoil";
import { v4 as uuid } from "uuid";

import { createTodo } from "../../../api/CreateCollection";
import todoDataState from "../../../recoil/atoms/todo/todoState";
import { db } from "../../../firebaseSDK";
import Stage from "./Stage";

const StageLayout = styled.div`
  display: flex;

  overflow-x: scroll;

  &::-webkit-scrollbar {
    height: 0.25rem;
    border-radius: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.3);
    border-radius: 6px;
  }
  &::-webkit-scrollbar-corner {
    background: transparent;
  }
`;

const Container = styled.div`
  display: flex;
`;

const AddStageBtn = styled.button`
  width: 3rem;
  margin-top: auto;

  background-color: #ededed;
  border: 1px solid #d5d5d5;
  border-radius: 0.5rem;
`;

interface Props {
  stageList: any;
  isKanbanShow: boolean;
}

interface InitialData {
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

  const handleOnDragEnd = useCallback(
    async (result: DropResult) => {
      // 업데이트 시 사용할 StageList
      const updatedStageList: {
        id: string;
        name: string;
        todoIds: string[];
      }[] = [];
      const { destination, source, draggableId, type } = result;
      // 리스트 밖으로 drop되면 destination이 null이므로 return
      if (!destination) return;

      // 출발지와 도착지가 같으면 return
      if (
        destination.droppableId === source.droppableId &&
        source.index === destination.index
      )
        return;

      // stage의 순서가 바뀔 경우 Kanban의 stage_list 업데이트
      if (type === "stage") {
        const newStageOrder = Array.from(data.stageOrder);
        newStageOrder.splice(source.index, 1);
        newStageOrder.splice(destination.index, 0, draggableId);

        const newData = {
          ...data,
          stageOrder: newStageOrder,
        };
        setData(newData);

        // newStageOrder를 이용해 stage_list 최신화
        newStageOrder.forEach((stageId) => {
          updatedStageList.push(data.stages[stageId]);
        });
        await updateDoc(kanbanRef, {
          stage_list: updatedStageList,
        });

        return;
      }

      // todo의 위치를 변경한 경우
      const startStage = data.stages[source.droppableId];
      const finishStage = data.stages[destination.droppableId];

      // stage 내에서 todo의 index가 변경될 경우
      if (startStage === finishStage) {
        const newTodoIds = Array.from(startStage.todoIds);
        newTodoIds.splice(source.index, 1);
        newTodoIds.splice(destination.index, 0, draggableId);

        const newStage = {
          ...startStage,
          todoIds: newTodoIds,
        };

        const newData = {
          ...data,
          stages: {
            ...data.stages,
            [newStage.id]: newStage,
          },
        };

        setData(newData);
        // newData를 이용해 stage_list 최신화
        data.stageOrder.forEach((stageId) => {
          updatedStageList.push(newData.stages[stageId]);
        });
        await updateDoc(kanbanRef, {
          stage_list: updatedStageList,
        });
      } else {
        // stage 간 todo의 위치가 변경 될 경우
        const startTodoIds = Array.from(startStage.todoIds);
        startTodoIds.splice(source.index, 1);
        const newStartStage = {
          ...startStage,
          todoIds: startTodoIds,
        };

        const finishTodoIds = Array.from(finishStage.todoIds);
        finishTodoIds.splice(destination.index, 0, draggableId);
        const newFinishStage = {
          ...finishStage,
          todoIds: finishTodoIds,
        };

        const newData = {
          ...data,
          stages: {
            ...data.stages,
            [newStartStage.id]: newStartStage,
            [newFinishStage.id]: newFinishStage,
          },
        };
        setData(newData);

        // newData를 이용해 stage_list 최신화
        data.stageOrder.forEach((stageId) => {
          updatedStageList.push(newData.stages[stageId]);
        });
        await updateDoc(kanbanRef, {
          stage_list: updatedStageList,
        });
        // todo의 stage_id 최신화
        const todoRef = doc(
          db,
          "project",
          projectID,
          "kanban",
          kanbanID,
          "todo",
          draggableId,
        );
        await updateDoc(todoRef, {
          stage_id: newFinishStage.id,
        });
      }
    },
    [data],
  );

  const handleAddTodoClick = async (stageId: string) => {
    const todoId = await createTodo(projectID, kanbanID, {
      update_list: [],
      user_list: [],
      name: "테스트투두",
      stage_id: stageId,
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
          type="stage"
          getContainerForClone={() => document.body}
        >
          {(provided) => (
            <Container {...provided.droppableProps} ref={provided.innerRef}>
              {data.stageOrder.map((columnId, index) => {
                const stage = data.stages[columnId];
                const todos = stage.todoIds.map((todoId) => data.todos[todoId]);
                return (
                  <Stage
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
      <AddStageBtn type="button" onClick={handleAddStageClick}>
        AddStageButton
      </AddStageBtn>
    </StageLayout>
  );
}
