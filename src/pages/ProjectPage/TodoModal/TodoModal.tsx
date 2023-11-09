import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { useRecoilValue } from "recoil";
import { db } from "../../../firebaseSDK";
import {
  ProjectModalLayout,
  ProjectModalContentBox,
} from "../../../components/layout/ProjectModalLayout";
import CommonInputLayout from "../../../components/layout/CommonInputLayout";
import CommonTextArea from "../../../components/layout/CommonTextArea";
import MarkdownEditor from "./MarkdownEditor";
import DatePicker from "../../../components/DatePicker";
import todoState from "../../../recoil/atoms/todo/todoState";
import CommonSelectMemberLayout from "../../../components/layout/CommonSelectMemberLayout";
import TagSelectLayout from "./TagSelectLayout";
import ErrorPage from "../../../components/ErrorPage";
import trashIcon from "../../../assets/icons/trashIcon.svg";
import kanbanState from "../../../recoil/atoms/kanban/kanbanState";

type Props = {
  isTodoShow: boolean;
};

// 스타일
const TodoContainer = styled(ProjectModalContentBox)`
  padding: 2rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 100%;
`;
const TodoTitle = styled.div`
  display: inline-block;
  font-weight: 900;
  font-size: 1.2rem;
  margin: 0 1rem 2rem 0;
`;
const TodoSubtitle = styled.div`
  display: inline-block;
  font-weight: 900;
  font-size: 0.9rem;
  margin: 0 1rem 1rem 0;
`;

const Container = styled.div`
  display: grid;
  grid-template-columns: 4.5rem 1fr;
  grid-template-rows: 1fr;
`;
const UserListContainer = styled(Container)`
  margin: 0.5rem 0 0 0;
`;
const DeadlineContainer = styled(Container)`
  margin: 0.5rem 0 0 0;
`;
const TagContainer = styled(Container)`
  margin: 0.5rem 0 0 0;
`;
const InfoContainer = styled(Container)`
  margin: 0.5rem 0 0 0;
`;

const Contour = styled.div`
  background-color: #eaeaea;
  width: 100%;
  height: 0.2rem;
  transform: translateY(-1.5rem);
  border-radius: 1px;
`;

export default function TodoModal({ isTodoShow }: Props) {
  const todoNameInputRef = useRef<HTMLInputElement>(null);

  const projectId = window.location.pathname.substring(1);
  const urlQueryString = new URLSearchParams(window.location.search);
  const kanbanId = isTodoShow ? String(urlQueryString.get("kanbanID")) : "null";
  const todoId = isTodoShow ? String(urlQueryString.get("todoID")) : "null";

  const kanbanRef = doc(db, "project", projectId, "kanban", kanbanId);
  const todoRef = doc(
    db,
    "project",
    projectId,
    "kanban",
    kanbanId,
    "todo",
    todoId,
  );

  const navigate = useNavigate();

  const [lastTodoId, setLastTodoId] = useState("");

  const todoDataState = useRecoilValue(todoState);
  const kanbanDataState = useRecoilValue(kanbanState);

  const currentTodo =
    todoDataState.get(todoId) || todoDataState.get(lastTodoId);

  const [inputTodoName, setInputTodoName] = useState("");
  const [inputTodoInfo, setInputTodoInfo] = useState("");
  const [userList, setUserList] = useState<any[]>([]);

  useEffect(() => {
    if (!isTodoShow || todoId === "null" || !currentTodo) {
      return;
    }
    setLastTodoId(todoId);
    setInputTodoName(currentTodo.name);
    setInputTodoInfo(currentTodo.info);
    setUserList(currentTodo.user_list);
  }, [todoId, isTodoShow, currentTodo]);

  const textarea = useRef<HTMLTextAreaElement | null>(null);

  // textarea height 자동 조절
  useEffect(() => {
    if (textarea.current) {
      textarea.current.style.height = "auto";
      textarea.current.style.height = `${textarea.current.scrollHeight}px`;
    }
  }, [inputTodoInfo]);

  // Input 및 Textarea 이벤트 로직(Enter키, Focus상태)
  // 1. Enter키
  // const handleEnterPress = async (e: KeyboardEvent<HTMLInputElement>) => {
  //   if (e.key === "Enter") {
  //     if (inputTodoName) {
  //       await updateDoc(todoRef, {
  //         name: inputTodoName,
  //         info: inputTodoInfo,
  //         modified_date: serverTimestamp(),
  //       });
  //     }
  //     // 포커스 해제
  //   }
  // };
  // 2. Focus 상태
  const handleFocus = async () => {
    if (inputTodoName) {
      await updateDoc(todoRef, {
        name: inputTodoName,
        info: inputTodoInfo,
        user_list: userList,
        modified_date: serverTimestamp(),
      });
    } else {
      // inputTodoName이 없을 때 유효성 검사 통과 못하게
      // eslint-disable-next-line no-alert
      alert("제목을 입력해주세요");
    }
  };

  const handleChange = (e: any) => {
    setInputTodoInfo(e.target.value);
  };

  // 투두 삭제
  const handleDelete = async () => {
    const updatedStageList = kanbanDataState
      .get(kanbanId)
      .stage_list.map((stage: { id: string; todoIds: string[] }) => {
        if (stage.id === currentTodo.stage_id) {
          const updatedTodoIds = stage.todoIds.filter((id) => id !== todoId);
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
    navigate(`/${projectId}?kanbanID=${kanbanId}`);
  };

  // 마감일 업데이트
  const handleUpdateDatePicker = async (selectedDate: Date) => {
    if (selectedDate) {
      await updateDoc(todoRef, {
        deadline: selectedDate,
        modified_date: serverTimestamp(),
      });
    }
  };

  // 에러 페이지
  if (!currentTodo) {
    return (
      <ProjectModalLayout $isShow={isTodoShow}>
        <ProjectModalContentBox>
          <ErrorPage isTodo404 />
        </ProjectModalContentBox>
      </ProjectModalLayout>
    );
  }

  return (
    <ProjectModalLayout $isShow={isTodoShow}>
      <TodoContainer
        style={{
          boxShadow: isTodoShow
            ? "none"
            : "0px 0px 10px 6px rgba(0, 0, 0, 0.05)",
        }}
      >
        <div style={{ padding: "0 2rem 0 0" }}>
          <TodoTitle>
            <CommonInputLayout
              ref={todoNameInputRef}
              type="text"
              placeholder="제목을 입력하세요"
              value={inputTodoName}
              $dynamicFontSize=" 1.2rem"
              $dynamicPadding="1rem 0.5rem"
              $dynamicWidth="auto"
              // onKeyDown={handleEnterPress}
              onChange={(e) => setInputTodoName(e.target.value)}
              onBlur={handleFocus}
              onKeyUp={(e) => {
                if (e.key === "Enter") {
                  todoNameInputRef.current!.blur();
                }
              }}
            />
          </TodoTitle>
          <button type="button" onClick={handleDelete}>
            <img src={trashIcon} alt="삭제" />
          </button>
          <div>
            <UserListContainer>
              <TodoSubtitle>담당자</TodoSubtitle>
              <CommonSelectMemberLayout
                userList={userList}
                setUserList={setUserList}
                // eslint-disable-next-line no-console
                onBlur={handleFocus}
              />
            </UserListContainer>
            <DeadlineContainer>
              <TodoSubtitle>마감일</TodoSubtitle>
              <DatePicker
                date={currentTodo.deadline.toDate()}
                onChange={(arg: Date) => handleUpdateDatePicker(arg)}
                $width="10rem"
                $height="1.5rem"
                $padding="0.25rem"
                $isHover={false}
                $fontsize="1.125"
              />
            </DeadlineContainer>
            <TagContainer>
              <TodoSubtitle>태그</TodoSubtitle>
              <TagSelectLayout
                kanbanId={kanbanId}
                kanbanRef={kanbanRef}
                todoRef={todoRef}
                todoDataState={currentTodo}
                isTodoShow={isTodoShow}
              />
            </TagContainer>
            <InfoContainer>
              <TodoSubtitle>설명</TodoSubtitle>
              <CommonTextArea
                ref={textarea}
                placeholder="설명을 입력하세요"
                value={inputTodoInfo}
                // onKeyDown={handleEnterPress}
                onChange={handleChange}
                onBlur={handleFocus}
              />
            </InfoContainer>
          </div>
        </div>
        <div>
          <TodoTitle>업데이트</TodoTitle>
          <Contour />
          <MarkdownEditor todoRef={todoRef} todoDataState={currentTodo} />
        </div>
      </TodoContainer>
    </ProjectModalLayout>
  );
}
