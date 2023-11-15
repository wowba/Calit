import React, { useRef, useState } from "react";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import _ from "lodash";
import TagContainer from "./TagContainer";
import closeIcon from "../../../assets/icons/Cross.svg";
import { db } from "../../../firebaseSDK";
import {
  ColorModal,
  ColorModalBackground,
} from "../CalendarModal/CalendarModal";
import paintIcon from "../../../assets/icons/Pantone.svg";
import getTextColorByBackgroundColor from "../../../utils/getTextColorByBgColor";
import todoState from "../../../recoil/atoms/todo/todoState";

const CustomOptionContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  padding: 0 0.5rem;
  transition: all 0.2s ease;
  &:hover {
    background-color: #ecebff;
  }
`;
const TodoColorModal = styled(ColorModal)`
  position: relative;
  z-index: 1000;
  margin: 0 0.4rem 0 0;
`;

const TodoColorModalBackground = styled(ColorModalBackground)`
  width: 100vw;
  height: 100vh;
  background-color: transparent;
`;

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
  const todoDataState = useRecoilValue(todoState);
  const currentTodo = todoDataState.get(todoId);
  const optionData = currentTodo.todo_option_list;
  const [isColorModalShow, setIsColorModalShow] = useState(false);
  const [tagBgColor, setTagBgColor] = useState(color);

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

  // 태그 배경 색상 변경
  const handleOptionColor = (e: any) => {
    e.stopPropagation();
    setIsColorModalShow(true);
  };

  const handleTodoColorModalChange = (e: any) => {
    setTagBgColor(e.target.value);
  };
  // 태그 배경 색상 변경 최적화
  const handleTodoColorModalthrottle = useRef(
    _.throttle((e: React.ChangeEvent<HTMLInputElement>) => {
      handleTodoColorModalChange(e);
    }, 100),
  );
  // react select 기본 선택 동작 방지
  const handleStopPropagation = (e: any) => {
    e.stopPropagation();
  };

  const handleModalCloseClick = async (e: any) => {
    e.stopPropagation();
    const updatedTodoOptionList = optionData.map((option: any) => {
      if (option.label === label) {
        return {
          ...option,
          color: tagBgColor,
        };
      }
      return option;
    });

    await updateDoc(todoRef, {
      todo_option_list: updatedTodoOptionList,
      modified_date: serverTimestamp(),
    });
    setIsColorModalShow(false);
  };

  return (
    <CustomOptionContainer
      ref={innerRef}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...innerProps}
      className="custom-option"
    >
      <TagContainer
        style={{ fontSize: "0.8rem", margin: "0.2rem" }}
        $dynamicBg={tagBgColor}
        $dynamicColor={getTextColorByBackgroundColor(tagBgColor)}
      >
        {label}
      </TagContainer>
      <div>
        {canDelete ? (
          <button
            type="button"
            onClick={handleOptionDelete}
            style={{ width: "0.7rem", height: "0.7rem" }}
          >
            <img src={closeIcon} alt="삭제" />
          </button>
        ) : null}
        <button type="button" onClick={handleOptionColor}>
          <img
            src={paintIcon}
            alt="색상"
            style={{
              width: "0.8rem",
              height: "0.8rem",
              margin: "0.2rem 0.8rem",
              transform: "translateY(4px)",
            }}
          />
        </button>
        {isColorModalShow ? (
          <TodoColorModal
            type="color"
            $isShow={isColorModalShow}
            $top={0}
            $left={0}
            value={tagBgColor}
            onChange={handleTodoColorModalthrottle.current}
            onClick={handleStopPropagation}
          />
        ) : null}
        <TodoColorModalBackground
          $isShow={isColorModalShow}
          onClick={handleModalCloseClick}
        />
      </div>
    </CustomOptionContainer>
  );
}
