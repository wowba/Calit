/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/react-in-jsx-scope */
import styled from "styled-components";
import { Droppable, Draggable } from "@hello-pangea/dnd";

import icon_plus_circle from "../../../assets/icons/icon_plus_circle.svg";
import Task from "./Todo";

const Container = styled.div`
  margin: 8px;
  border: 1px solid lightgrey;
  border-radius: 2px;
  width: 220px;

  display: flex;
  flex-direction: column;
`;
const Title = styled.h3`
  padding: 8px;
`;

const TodoPlusIcon = styled.img`
  height: 1rem;
  width: 1rem;
  cursor: pointer;
`;

interface ITaskList {
  $isDraggingOver: boolean;
}
const TaskList = styled.div<ITaskList>`
  padding: 8px;
  background-color: ${(props) => (props.$isDraggingOver ? "skyblue" : "white")};
  flex-grow: 1;
`;

interface IColumnProps {
  stage: { id: string; name: string; todoIds: string[] };
  todos: {
    id: string;
    name: string;
  }[];
  index: number;
  handleAddTodoClick: any;
}

function Stage({ stage, todos, index, handleAddTodoClick }: IColumnProps) {
  return (
    <Draggable draggableId={stage.id} index={index}>
      {(provided, snapshot) => {
        // Todo : 드래그 시 요소가 정확한 위치에 오도록 하는 해결법을 찾지 못해 삽질하다가 임시방편으로 해결. 추후 확인할 것.
        // 이 문제는 ProjectModalLayout의 transform translate 속성을 제거할 경우 해결 됨.
        // 참고 깃헙 주소: https://github.com/atlassian/react-beautiful-dnd/issues/1881
        const viewportNode = document.getElementById("kanbanModalContentBox");
        if (snapshot.isDragging) {
          // @ts-ignore
          provided.draggableProps.style.left -= viewportNode.offsetLeft + 206;
          // @ts-ignore
          provided.draggableProps.style.top = "auto !important";
        }

        return (
          <Container ref={provided.innerRef} {...provided.draggableProps}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Title {...provided.dragHandleProps}>{stage.name}</Title>
              <TodoPlusIcon
                src={icon_plus_circle}
                alt="스테이지 추가"
                onClick={() => handleAddTodoClick(stage.id)}
              />
            </div>

            <Droppable droppableId={stage.id} type="task">
              {(provided, snapshot) => (
                <TaskList
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  $isDraggingOver={snapshot.isDraggingOver}
                >
                  <>
                    {todos.map((todo, idx) => (
                      <Task key={todo.id} todo={todo} index={idx} />
                    ))}
                    {provided.placeholder}
                  </>
                </TaskList>
              )}
            </Droppable>
          </Container>
        );
      }}
    </Draggable>
  );
}

export default Stage;
