import React from "react";
import CreatableSelect from "react-select/creatable";
import { ActionMeta, MultiValue } from "react-select";
import { serverTimestamp, updateDoc } from "firebase/firestore";
import CustomOptions from "./CustomOptions";
import TagContainer from "./TagContainer";
import getTextColorByBackgroundColor from "../../../utils/getTextColorByBgColor";

export default function TagSelectLayout({ todoRef, todoDataState }: any) {
  const optionData = todoDataState.todo_option_list;
  // 유저의 임의 옵션 추가 기능
  const getNewOptionData = (
    inputValue: string,
    optionLabel: React.ReactNode,
  ) => ({
    label: optionLabel,
    value: inputValue,
    color: "#7064FF",
    canDelete: true,
  });
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
        <TagContainer
          $dynamicBg={option.color}
          $dynamicColor={getTextColorByBackgroundColor(option.color)}
        >
          {option.label}
        </TagContainer>
      )}
      value={todoDataState.todo_tag_list}
      getNewOptionData={getNewOptionData}
      onChange={handleSelectChange}
      components={{ Option: CustomOptions }}
      styles={{
        multiValue: (baseStyles) => ({
          ...baseStyles,
          padding: "0",
          margin: "-2px -10px -2px -10px",
          borderRadius: "0.5rem",
          backgroundColor: "transparent",
          transition: "all 0.2s ease",
          ":hover": {
            margin: "-2px -2px -2px -10px",
            "div+div>svg": { fill: "#595959" },
          },
        }),
        multiValueRemove: (baseStyles) => ({
          ...baseStyles,
          margin: "0",
          padding: "2px 5px 2px 2px",
          background: "transparent",
          height: "auto",
          transform: "translateX(-4px)",
          transition: "all 0.2s ease",

          ":hover": { ">svg": { fill: "#595959" } },
          ">svg": { fill: "transparent", transition: "all 0.2s ease" },
        }),
        control: (baseStyles) => ({
          ...baseStyles,
          width: "auto",
          transition: "all 0.3s",
          boxShadow: "none",
          backgroundColor: "#fcfcfc",
          border: "1px solid #fcfcfc",
          ":hover": {
            border: "1px solid #dfdfdf",
          },
          ":focus": { border: "1px solid #dfdfdf" },
        }),
        valueContainer: (baseStyles) => ({
          ...baseStyles,
          paddingRight: "0",
        }),
        indicatorsContainer: (baseStyles) => ({
          ...baseStyles,
          visibility: "hidden",
          width: "0",
        }),
      }}
    />
  );
}
