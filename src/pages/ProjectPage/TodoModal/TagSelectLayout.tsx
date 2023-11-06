import React from "react";
import CreatableSelect from "react-select/creatable";
import { ActionMeta, MultiValue } from "react-select";
import { serverTimestamp, updateDoc } from "firebase/firestore";
import MyOption from "./CustomOptions";
import TagContainer from "./TagContainer";

export default function TagSelectLayout({ todoRef, todoDataState }: any) {
  const optionData = todoDataState.todoData.todo_option_list;
  // 유저의 임의 옵션 추가
  function getNewOptionData(inputValue: string, optionLabel: React.ReactNode) {
    return {
      label: optionLabel,
      value: inputValue,
      color: "#fff229",
      canDelete: true,
    };
  }
  const handleSelectChange = async (
    newValue: MultiValue<any>,
    actionMeta: ActionMeta<any>,
  ) => {
    // option 목록 업데이트 (중복 금지)
    if (actionMeta.action === "create-option") {
      const resultValue = newValue.filter(
        (item) =>
          !optionData.some(
            (list: { value: string }) => list.value === item.value,
          ),
      );
      const updatedOptionList = [...optionData, ...resultValue];
      if (resultValue) {
        // firestore : todo 컬렉션의 todo_option_list db 업데이트
        await updateDoc(todoRef, {
          todo_option_list: updatedOptionList,
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
      options={optionData}
      // eslint-disable-next-line react/no-unstable-nested-components
      formatOptionLabel={(option: any) => (
        <TagContainer $dynamicBg={option.color}>{option.label}</TagContainer>
      )}
      value={todoDataState.todoData.todo_tag_list}
      // eslint-disable-next-line react/jsx-no-bind
      getNewOptionData={getNewOptionData}
      onChange={handleSelectChange}
      components={{ Option: MyOption }}
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
          border: "1px solid #eaeaea",
          ":hover": { border: "1px solid gray" },
          ":focus": { border: "1px solid #eaeaea" },
        }),
        valueContainer: (baseStyles) => ({
          ...baseStyles,
          paddingRight: "0",
        }),
      }}
    />
  );
}
