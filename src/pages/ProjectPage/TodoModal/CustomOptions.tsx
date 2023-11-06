import React from "react";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { useRecoilValue } from "recoil";
import TagContainer from "./TagContainer";
import closeIcon from "../../../assets/icons/closeIcon.svg";
import { db } from "../../../firebaseSDK";
import singleTodoState from "../../../recoil/atoms/todo/singleTodoState";

export default function CustomOptions({
  innerRef,
  innerProps,
  data: { label, color, canDelete },
}: any) {
  const urlQueryString = new URLSearchParams(window.location.search);
  const projectId = window.location.pathname.substring(1);
  const kanbanId = String(urlQueryString.get("kanbanID"));
  const todoId = String(urlQueryString.get("todoID"));
  const todoRef = doc(
    db,
    "project",
    projectId,
    "kanban",
    kanbanId,
    "todo",
    todoId,
  );
  const todoDataState = useRecoilValue(singleTodoState);
  const optionData = todoDataState.todoData.todo_option_list;

  // 옵션 삭제
  const handleOptionDelete = async (e: any) => {
    e.stopPropagation();

    const selectedLabel = label;
    const updatedTagData = optionData.filter(
      (item: { label: string }) => item.label !== selectedLabel,
    );
    await updateDoc(todoRef, {
      todo_option_list: updatedTagData,
      modified_date: serverTimestamp(),
    });
  };

  return (
    <article
      ref={innerRef}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...innerProps}
      className="custom-option"
    >
      <TagContainer $dynamicBg={color}>{label}</TagContainer>
      {canDelete ? (
        <button type="button" onClick={handleOptionDelete}>
          <img src={closeIcon} alt="삭제" />
        </button>
      ) : null}
    </article>
  );
}
