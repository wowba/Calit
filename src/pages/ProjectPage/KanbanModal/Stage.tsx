/* eslint-disable no-alert */
/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/react-in-jsx-scope */
import styled from "styled-components";
import { Droppable, Draggable } from "@hello-pangea/dnd";

import { useRef, useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import icon_plus_circle from "../../../assets/icons/icon_plus_circle.svg";
import Todo from "./Todo";
import CommonInputLayout from "../../../components/layout/CommonInputLayout";
import { db } from "../../../firebaseSDK";
import trashIcon from "../../../assets/icons/trashIcon.svg";

const Container = styled.div`
  display: flex;
  flex-direction: column;

  height: auto;
  width: 18rem;
  margin: 0 1rem 0 0;

  :hover {
    & > img {
      visibility: visible;
    }
  }
`;

const StageInfoBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  border-bottom: 0.2rem solid #eaeaea;

  padding: 0.25rem 0 0.25rem 0;
  margin: 0 0 1rem 0;
`;

const StageTitleBox = styled.div`
  display: flex;
  align-items: center;
  gap: 0.125rem;
`;

const TodoPlusIcon = styled.img`
  height: 1rem;
  width: 1rem;
  cursor: pointer;

  margin: 0 0 0 0.25rem;
`;

const StageTrashIcon = styled.img`
  z-index: 2;
  cursor: pointer;
  visibility: hidden;
`;

const TodoList = styled.div<TodoListProps>`
  overflow-y: scroll;

  flex-grow: 1;

  background-color: ${(props) =>
    props.$isDraggingOver ? "skyblue" : "#EDEDED"};
  border: 1px solid #d5d5d5;
  border-radius: 0.5rem;

  padding: 0.5rem;

  &::-webkit-scrollbar {
    width: 8px;
    overflow-y: scroll;
    border-radius: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.3);
    border-radius: 6px;
  }
  &::-webkit-scrollbar-corner {
    background-color: transparent;
  }
`;
interface TodoListProps {
  $isDraggingOver: boolean;
}

interface StageData {
  stages: {
    [key: string]: { id: string; name: string; todoIds: string[] };
  };
  stageOrder: string[];
}

interface StageProps {
  stage: { id: string; name: string; todoIds: string[] };
  todos: {
    id: string;
    name: string;
    info: string;
    todo_tag_list: { color: string; label: string }[];
    user_list: { image: string; label: string; value: string }[];
    stage_id: string;
  }[];
  index: number;
  handleAddTodoClick: any;
  stageData: StageData;
}

function Stage({
  stage,
  todos,
  index,
  handleAddTodoClick,
  stageData,
}: StageProps) {
  const stageNameInputRef = useRef<HTMLInputElement>(null);

  const urlQueryString = new URLSearchParams(window.location.search);
  const projectId = window.location.pathname.substring(1);
  const kanbanId = String(urlQueryString.get("kanbanID"));
  const kanbanRef = doc(db, "project", projectId, "kanban", kanbanId);

  const [stageName, setStageName] = useState(stage.name);

  const handleStageNameInputBlur = async () => {
    if (stageName) {
      const updatedStageList: {
        id: string;
        name: string;
        todoIds: string[];
      }[] = [];
      stageData.stages[stage.id].name = stageName;
      stageData.stageOrder.forEach((stageId) => {
        updatedStageList.push(stageData.stages[stageId]);
      });
      await updateDoc(kanbanRef, {
        stage_list: updatedStageList,
      });
    } else {
      alert("이름을 입력해 주세요");
    }
  };

  const handleStageDeleteBtnClick = async () => {
    if (todos.length > 0) {
      alert("투두가 존재하는 스테이지는 삭제할 수 없습니다.");
    } else if (stage.id === "default-3") {
      alert("완료 확인 스테이지는 삭제할 수 없습니다.");
    } else {
      const updatedStageList: {
        id: string;
        name: string;
        todoIds: string[];
      }[] = [];
      const updatedStageOrder = stageData.stageOrder.filter(
        (stageId) => stageId !== stage.id,
      );
      updatedStageOrder.forEach((stageId) => {
        updatedStageList.push(stageData.stages[stageId]);
      });
      await updateDoc(kanbanRef, {
        stage_list: updatedStageList,
      });
    }
  };

  return (
    <Draggable draggableId={stage.id} index={index}>
      {(provided) => (
        <Container
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <StageInfoBox>
            <StageTitleBox>
              <CommonInputLayout
                ref={stageNameInputRef}
                maxLength={13}
                value={stageName}
                type="text"
                placeholder="이름을 입력하세요"
                $dynamicWidth="14rem"
                $dynamicFontSize=" 1.1rem"
                $dynamicPadding="1rem 0.5rem"
                style={{ fontWeight: "900" }}
                onChange={(e) => setStageName(e.target.value)}
                onBlur={handleStageNameInputBlur}
                onKeyUp={(e) => {
                  if (e.key === "Enter") {
                    stageNameInputRef.current!.blur();
                  }
                }}
              />
              <p>({todos.length})</p>
              <TodoPlusIcon
                src={icon_plus_circle}
                alt="투두 추가"
                onClick={() => handleAddTodoClick(stage.id)}
              />
            </StageTitleBox>
            <StageTrashIcon
              src={trashIcon}
              alt="스테이지 삭제"
              onClick={handleStageDeleteBtnClick}
            />
          </StageInfoBox>

          <Droppable droppableId={stage.id} type="todo">
            {(provided, snapshot) => (
              <TodoList
                {...provided.droppableProps}
                ref={provided.innerRef}
                $isDraggingOver={snapshot.isDraggingOver}
              >
                <>
                  {todos.map((todo, idx) => (
                    <Todo key={todo.id} todo={todo} index={idx} />
                  ))}
                  {provided.placeholder}
                </>
              </TodoList>
            )}
          </Droppable>
        </Container>
      )}
    </Draggable>
  );
}

export default Stage;
