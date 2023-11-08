/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/react-in-jsx-scope */
import styled from "styled-components";
import { Droppable, Draggable } from "@hello-pangea/dnd";

import icon_plus_circle from "../../../assets/icons/icon_plus_circle.svg";
import Todo from "./Todo";

const Container = styled.div`
  display: flex;
  flex-direction: column;

  height: 30rem;
  width: 15rem;
  margin: 0 0.5rem 0 0.5rem;
`;

const StageInfoBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  border-bottom: 2.5px solid #eaeaea;

  padding: 0.5rem 0.5rem;
  margin: 0 0 1rem 0;
`;

const StageTitleBox = styled.div`
  display: flex;
  gap: 0.125rem;
`;

const Title = styled.p`
  font-weight: 900;
`;

const TodoPlusIcon = styled.img`
  height: 1rem;
  width: 1rem;
  cursor: pointer;
`;

const TodoList = styled.div<TodoListProps>`
  flex-grow: 1;

  background-color: ${(props) =>
    props.$isDraggingOver ? "skyblue" : "#EDEDED"};
  border: 1px solid #d5d5d5;
  border-radius: 0.5rem;

  padding: 0.5rem;
`;
interface TodoListProps {
  $isDraggingOver: boolean;
}

interface StageProps {
  stage: { id: string; name: string; todoIds: string[] };
  todos: {
    id: string;
    name: string;
  }[];
  index: number;
  handleAddTodoClick: any;
}

function Stage({ stage, todos, index, handleAddTodoClick }: StageProps) {
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
            <StageInfoBox {...provided.dragHandleProps}>
              <StageTitleBox>
                <Title>{stage.name}</Title>
                <p>({todos.length})</p>
              </StageTitleBox>

              <TodoPlusIcon
                src={icon_plus_circle}
                alt="스테이지 추가"
                onClick={() => handleAddTodoClick(stage.id)}
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
        );
      }}
    </Draggable>
  );
}

export default Stage;
