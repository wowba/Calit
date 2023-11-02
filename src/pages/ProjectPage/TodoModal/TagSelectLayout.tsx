import React from "react";
import styled from "styled-components";
import CreatableSelect from "react-select/creatable";
import { serverTimestamp, updateDoc } from "firebase/firestore";
import { useRecoilValue } from "recoil";
import kanbanState from "../../../recoil/atoms/kanban/kanbanState";

interface Props {
  $dynamicBg: string;
}
const TagContainer = styled.div<Props>`
  display: inline-block;
  background-color: ${(props) =>
    props.$dynamicBg ? props.$dynamicBg : "#ffffff"};
  border-radius: 10px;
  white-space: nowrap;
  padding: 2px 10px;
`;

export default function TagSelectLayout({
  kanbanId,
  kanbanRef,
  todoRef,
  todoDataState,
}: any) {
  const kanbanDataState = useRecoilValue(kanbanState);
  const data = [...kanbanDataState];
  const targetKanbanData = data.filter((item) => item[0] === kanbanId);
  const tagData = targetKanbanData[0][1].tag_list;

  function getNewOptionData(inputValue: any, optionLabel: any) {
    return {
      label: optionLabel,
      value: inputValue,
      color: "#fff229",
    };
  }
  const handleSelectChange = async (newValue: any, actionMeta: any) => {
    // option 목록 업데이트 (중복 금지)
    if (actionMeta.action === "create-option") {
      const resultValue = newValue.filter(
        (item: any) => !tagData.some((list: any) => list.value === item.value),
      );
      const updatedOptionList = [...tagData, ...resultValue];
      if (resultValue) {
        // firestore : kanban의 tag_list db 업데이트
        await updateDoc(kanbanRef, {
          tag_list: updatedOptionList,
          modified_date: serverTimestamp(),
        });
      }
    }
    // firestore : todo 컬렉션의 todo_tag_list db 업데이트
    await updateDoc(todoRef, {
      todo_tag_list: newValue,
      modified_date: serverTimestamp(),
    });
  };

  return (
    <CreatableSelect
      closeMenuOnSelect={false}
      isMulti
      options={tagData}
      // eslint-disable-next-line react/no-unstable-nested-components
      formatOptionLabel={(option: any) => (
        <TagContainer $dynamicBg={option.color}>{option.label}</TagContainer>
      )}
      value={todoDataState.todoData.todo_tag_list}
      // eslint-disable-next-line react/jsx-no-bind
      getNewOptionData={getNewOptionData}
      onChange={handleSelectChange}
      styles={{
        multiValue: (baseStyles) => ({
          ...baseStyles,
          padding: "0",
          margin: "0",
          border: "1px solid black",
          borderRadius: "0.5rem",
          backgroundColor: "transparent",
        }),
        multiValueRemove: (baseStyles) => ({
          ...baseStyles,
          borderRadius: "0.5rem",
        }),
        control: (baseStyles) => ({
          ...baseStyles,
          width: "auto",
          transition: "all 0.3s",
          boxShadow: "none",
          border: "1px solid transparent",
          ":hover": { border: "1px solid black" },
          ":focus": { border: "1px solid black" },
        }),
        valueContainer: (baseStyles) => ({
          ...baseStyles,
          paddingRight: "0",
        }),
      }}
    />
  );
}
