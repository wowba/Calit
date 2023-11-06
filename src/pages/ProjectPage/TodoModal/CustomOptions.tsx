import React from "react";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { useRecoilValue } from "recoil";
import kanbanState from "../../../recoil/atoms/kanban/kanbanState";
import TagContainer from "./TagContainer";
import closeIcon from "../../../assets/icons/closeIcon.svg";
import { db } from "../../../firebaseSDK";

export default function MyOption({
  innerRef,
  innerProps,
  data: { label, color, title },
}: any) {
  const kanbanDataState = useRecoilValue(kanbanState);
  const urlQueryString = new URLSearchParams(window.location.search);
  const kanbanId = String(urlQueryString.get("kanbanID"));
  const targetKanbanData = kanbanDataState.get(kanbanId);
  const tagData = targetKanbanData.tag_list;
  const projectId = window.location.pathname.substring(1);
  const kanbanRef = doc(db, "project", projectId, "kanban", kanbanId);

  const handleOptionDelete = async (e: any) => {
    e.stopPropagation();

    const selectedLabel = label;
    const updatedTagData = tagData.filter(
      (item: { label: string }) => item.label !== selectedLabel,
    );
    await updateDoc(kanbanRef, {
      tag_list: updatedTagData,
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
      <button type="button" onClick={handleOptionDelete}>
        <img src={closeIcon} alt="삭제" />
      </button>
      <div className="sub">{title} </div>
    </article>
  );
}
