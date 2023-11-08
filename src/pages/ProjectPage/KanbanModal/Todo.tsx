/* eslint-disable react/jsx-props-no-spreading */
import styled from "styled-components";
import React from "react";
import { Draggable } from "@hello-pangea/dnd";
import { useSearchParams } from "react-router-dom";

interface ContainerProps {
  $isDragging: boolean;
}

const Container = styled.div<ContainerProps>`
  border: 1px solid lightgrey;
  border-radius: 2px;
  padding: 8px;
  margin-bottom: 8px;
  transition: background-color 0.2s ease;
  background-color: ${(props) => (props.$isDragging ? "lightgreen" : "white")};
`;

interface TodoProps {
  todo: {
    id: string;
    name: string;
  };
  index: number;
}

function Todo({ todo, index }: TodoProps) {
  const [, setSearchParams] = useSearchParams();
  const urlQueryString = new URLSearchParams(window.location.search);
  const kanbanID = String(urlQueryString.get("kanbanID"));

  const handleTodoClick = () => {
    setSearchParams({
      kanbanID,
      todoID: todo.id,
    });
  };

  return (
    <Draggable draggableId={todo.id} index={index}>
      {(provided, snapshot) => (
        <Container
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          $isDragging={snapshot.isDragging}
          style={{
            ...provided.draggableProps.style,
            left: "auto !important",
            top: "auto !important",
          }}
          onClick={handleTodoClick}
        >
          {todo.name}
        </Container>
      )}
    </Draggable>
  );
}

export default React.memo(Todo);
