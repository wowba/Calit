/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/react-in-jsx-scope */
import styled, { css } from "styled-components";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import Swal from "sweetalert2";

import { useRef, useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import Todo from "./Todo";
import CommonInputLayout from "../../../components/layout/CommonInputLayout";
import { db } from "../../../firebaseSDK";
import trashIcon from "../../../assets/icons/trashIcon.svg";
import plus from "../../../assets/icons/plus.svg";
import Check from "../../../assets/icons/Check.svg";

const Container = styled.div<{ $isDragging: boolean }>`
  transition: background-color 0.5s ease;

  display: flex;
  flex-direction: column;

  height: auto;
  width: 18rem;
  margin: 0 1rem 0 0;

  ${(props) =>
    props.$isDragging &&
    css`
      > div:last-child {
        background-color: ${(props) => props.theme.Color.activeColor};
      }
    `}

  :hover {
    & > img {
      opacity: 1;
      visibility: visible;
    }
  }
`;

const StageInfoBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  border-bottom: 0.2rem solid #eaeaea;

  padding: 0.25rem 0.5rem 0.25rem 0.5rem;
  margin: 0 0 0.5rem 0;
`;

const StageTitleBox = styled.div`
  display: flex;
  align-items: center;
  gap: 0.125rem;
`;

const StageTrashIcon = styled.img`
  transition: all 0.5s ease;

  z-index: 2;
  cursor: pointer;

  opacity: 0;
  visibility: hidden;
`;

const AddTodoBtn = styled.button`
  transition: all 0.5s ease;

  opacity: 0;
  visibility: hidden;

  display: flex;
  align-items: center;
  justify-content: center;

  width: 1.875rem;
  height: 1.875rem;

  background-color: ${(props) => props.theme.Color.mainColor};
  border-radius: ${(props) => props.theme.Br.small};

  &:hover {
    background-color: ${(props) => props.theme.Color.hoverColor};
  }
`;

const TodoList = styled.div<TodoListProps>`
  transition: all 0.5s ease;

  overflow-y: scroll;

  flex-grow: 1;

  /* border: 1px solid #d5d5d5; */
  border-radius: ${(props) => props.theme.Br.default};

  padding: 0.5rem calc(0.5rem - 10px) 0.5rem 0.5rem;

  background-color: ${(props) =>
    props.$isDraggingOver
      ? props.theme.Color.activeColor
      : props.theme.Color.mainWhite};

  &:hover {
    > button {
      visibility: visible;
      opacity: 1;
    }
  }

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

const CompleteCheckBox = styled.div`
  position: relative;

  &:hover {
    > div {
      opacity: 1;
    }
  }
`;

const CompleteCheckHover = styled.div`
  transition: all 0.5s ease;

  position: absolute;

  text-align: center;
  font-size: 0.625rem;

  width: 8.875rem;
  height: 1rem;

  top: -0.15rem;
  left: -9.5rem;

  opacity: 0;

  background-color: ${(props) => props.theme.Color.activeColor};
  border-radius: ${(props) => props.theme.Br.small};
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
      Swal.fire({
        icon: "error",
        title: "스테이지 이름을 입력해 주세요.",
        text: "스테이지를 빈 이름으로 수정할 수 없습니다.",
      });
    }
  };

  const handleStageDeleteBtnClick = async () => {
    if (todos.length > 0) {
      Swal.fire({
        icon: "error",
        title: "스테이지를 삭제할 수 없습니다.",
        text: "투두가 존재하는 스테이지는 삭제할 수 없습니다.",
      });
    } else if (stage.id === "default-3") {
      Swal.fire({
        icon: "error",
        title: "스테이지를 삭제할 수 없습니다.",
        text: "완료 확인 스테이지는 삭제할 수 없습니다.",
      });
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
      {(provided, snapshot) => (
        <Container
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          $isDragging={snapshot.isDragging}
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
                $dynamicFontSize=" 1rem"
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
            </StageTitleBox>
            {stage.id === "default-3" ? (
              <CompleteCheckBox>
                <img src={Check} alt="check" />
                <CompleteCheckHover>
                  투두가 완료 상태로 계산됩니다.
                </CompleteCheckHover>
              </CompleteCheckBox>
            ) : (
              <StageTrashIcon
                src={trashIcon}
                alt="스테이지 삭제"
                onClick={handleStageDeleteBtnClick}
              />
            )}
          </StageInfoBox>

          <Droppable droppableId={stage.id} type="todo">
            {(provided, snapshot) => (
              <TodoList
                {...provided.droppableProps}
                ref={provided.innerRef}
                $isDraggingOver={snapshot.isDraggingOver}
              >
                {todos.map((todo, idx) => (
                  <Todo key={todo.id} todo={todo} index={idx} />
                ))}
                {provided.placeholder}
                <AddTodoBtn onClick={() => handleAddTodoClick(stage.id)}>
                  <img src={plus} alt="add todo" style={{ scale: "0.8" }} />
                </AddTodoBtn>
              </TodoList>
            )}
          </Droppable>
        </Container>
      )}
    </Draggable>
  );
}

export default Stage;
