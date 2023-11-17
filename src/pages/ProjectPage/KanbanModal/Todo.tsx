/* eslint-disable react/jsx-props-no-spreading */
import styled from "styled-components";
import React from "react";
import { Draggable } from "@hello-pangea/dnd";
import { useSearchParams } from "react-router-dom";
import { doc, updateDoc } from "firebase/firestore";
import { useRecoilValue } from "recoil";

import trashIcon from "../../../assets/icons/trashIcon.svg";
import kanbanState from "../../../recoil/atoms/kanban/kanbanState";
import { db } from "../../../firebaseSDK";
import userListState from "../../../recoil/atoms/userList/userListState";

interface ContainerProps {
  $isDragging: boolean;
}

const TodoLayout = styled.div<ContainerProps>`
  position: relative;

  border: 1px solid lightgrey;
  border-radius: 0.5rem;
  padding: 0.5rem 0.5rem 0.3rem 0.5rem;
  margin-bottom: 8px;
  transition: background-color 0.5s ease;
  background-color: ${(props) => (props.$isDragging ? "#F5F5F5" : "white")};
  box-shadow: ${(props) =>
    props.$isDragging ? props.theme.Bs.default : "none"};

  &:hover {
    background-color: ${(props) => props.theme.Color.activeColor};
  }
`;

const TodoTagListBox = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;

  transform: translateX(-0.1rem);
`;

const TodoTagList = styled.div`
  padding: 0.125rem 1rem;

  border-radius: 0.5rem;

  font-size: ${(props) => props.theme.Fs.size12};
  font-weight: 900;
`;

const TodoNameBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.125rem;

  margin: 0.25rem 0 0.5rem 0;
`;

const TodoNameParagraph = styled.p`
  font-size: ${(props) => props.theme.Fs.default};
  font-weight: 900;
`;

const TodoInfoParagraph = styled.span`
  font-size: ${(props) => props.theme.Fs.size12};
  font-weight: 400;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const TodoUserListBox = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.125rem;
`;

const TodoUserImage = styled.img`
  width: 1.25rem;
  height: 1.25rem;
  object-fit: cover;
  border-radius: 50%;
`;

const TodoTrashIcon = styled.img`
  transition: all 0.5s ease;

  position: absolute;
  top: 0.5rem;
  left: 15.4rem;

  z-index: 2;
  cursor: pointer;

  opacity: 0;
  visibility: hidden;
`;

interface TodoProps {
  todo: {
    id: string;
    name: string;
    info: string;
    todo_tag_list: { color: string; label: string }[];
    user_list: { image: string; label: string; value: string }[];
    stage_id: string;
  };
  index: number;
}

function Todo({ todo, index }: TodoProps) {
  const userListData = useRecoilValue(userListState);

  const [, setSearchParams] = useSearchParams();
  const projectId = window.location.pathname.substring(1);
  const urlQueryString = new URLSearchParams(window.location.search);
  const kanbanId = String(urlQueryString.get("kanbanID"));
  const kanbanRef = doc(db, "project", projectId, "kanban", kanbanId);
  const todoRef = doc(
    db,
    "project",
    projectId,
    "kanban",
    kanbanId,
    "todo",
    todo.id,
  );

  const kanbanDataState = useRecoilValue(kanbanState);

  const handleTodoClick = () => {
    setSearchParams({
      kanbanID: kanbanId,
      todoID: todo.id,
    });
  };

  const handleTodoDeleteBtnClick = async (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    const updatedStageList = kanbanDataState
      .get(kanbanId)
      .stage_list.map((stage: { id: string; todoIds: string[] }) => {
        if (stage.id === todo.stage_id) {
          const updatedTodoIds = stage.todoIds.filter((id) => id !== todo.id);
          return { ...stage, todoIds: updatedTodoIds };
        }
        return stage;
      });
    await updateDoc(kanbanRef, {
      stage_list: updatedStageList,
    });
    await updateDoc(todoRef, {
      is_deleted: true,
    });
  };

  return (
    <Draggable draggableId={todo.id} index={index}>
      {(provided, snapshot) => (
        <TodoLayout
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          $isDragging={snapshot.isDragging}
          onClick={handleTodoClick}
        >
          <TodoTagListBox>
            {todo.todo_tag_list.map((tag) => (
              <TodoTagList
                key={tag.label}
                style={{ backgroundColor: `${tag.color}` }}
              >
                {tag.label}
              </TodoTagList>
            ))}
          </TodoTagListBox>
          <TodoNameBox>
            <TodoNameParagraph>{todo.name}</TodoNameParagraph>
            <TodoInfoParagraph>{todo.info}</TodoInfoParagraph>
          </TodoNameBox>

          <TodoUserListBox>
            {todo.user_list.map((user) => {
              const userData = userListData.get(user.value);
              return (
                <TodoUserImage
                  key={userData.id}
                  src={userData.profile_img_URL}
                  alt={userData.label}
                />
              );
            })}
          </TodoUserListBox>
          <TodoTrashIcon
            src={trashIcon}
            alt="스테이지 삭제"
            onClick={handleTodoDeleteBtnClick}
          />
        </TodoLayout>
      )}
    </Draggable>
  );
}

export default React.memo(Todo);
