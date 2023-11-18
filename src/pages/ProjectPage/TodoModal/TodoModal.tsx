import React, { useState, useEffect, useRef, KeyboardEvent } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { useRecoilValue } from "recoil";
import Swal from "sweetalert2";
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
import dotsIcon from "../../../assets/icons/dots.svg";
import icon_plus from "../../../assets/icons/plusIcon.svg";
import kanbanState from "../../../recoil/atoms/kanban/kanbanState";
import asyncDelay from "../../../utils/asyncDelay";
import todoLoaded from "../../../recoil/atoms/sidebar/todoLoaded";
import LoadingPage from "../../../components/LoadingPage";
import TodoMoreModal from "./TodoMoreModal";

type Props = {
  isTodoShow: boolean;
};

// 스타일
const TodoContainer = styled(ProjectModalContentBox)<{
  $isTodoShow: boolean;
}>`
  padding: 2rem 2rem 0.5rem 2rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 100%;
`;
const TodoTopContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: space-between;
  align-items: flex-start;
  margin: 0 0 0.6rem;
`;
const TodoTitlePointer = styled.div`
  margin: 0.4rem 1rem 0 0;

  width: 0.25rem;
  height: 1.3rem;
  background-color: ${(props) => props.theme.Color.mainColor};

  border-radius: ${(props) => props.theme.Br.small};
`;
const TodoTitle = styled.div`
  display: inline-block;
  font-weight: 900;
  font-size: ${(props) => props.theme.Fs.modalTitle};
`;
const TodoSubtitle = styled.div`
  display: inline-block;
  font-weight: 900;
  font-size: 0.9rem;
  margin: 0.2rem 1rem 1rem 0;
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

const AddUpdateBtn = styled.button<{ $isUpdateClick: boolean }>`
  width: 1rem;
  height: 1rem;
  margin: 0 1rem 0 0;
  transition: transform 0.2s ease;
  transform: ${(props) =>
    props.$isUpdateClick ? "rotate(45deg)" : "rotate(0)"};
`;
const Contour = styled.div`
  background-color: #eaeaea;
  width: 100%;
  height: 0.1rem;
  border-radius: 3px;
`;

export default function TodoModal({ isTodoShow }: Props) {
  const isLoaded = useRecoilValue(todoLoaded);
  const [loadedState, setLoadedState] = useState(true);
  useEffect(() => {
    const setLoaded = async () => {
      if (!isLoaded) {
        setLoadedState(false);
        await asyncDelay(700);
        setLoadedState(true);
      }
    };
    setLoaded();
  }, [isLoaded]);

  const todoNameInputRef = useRef<HTMLInputElement>(null);
  // const infoTextAreaRef = useRef<any>(null);

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
  const [isUpdateClick, setIsUpdateClick] = useState(false);

  const [isMoreModalOpened, setIsMoreModalOpened] = useState(false);

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
      textarea.current.style.height = `${textarea.current.scrollHeight + 7}px`;
    }
  }, [isTodoShow, inputTodoInfo]);

  // Input 및 Textarea 이벤트 로직(Enter키, Focus상태)
  // 1. Enter키
  const handleEnterPress = async (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (inputTodoName) {
        await updateDoc(todoRef, {
          name: inputTodoName,
          modified_date: serverTimestamp(),
        });
      }
    }
  };
  // 2. onBlur
  const handleOnBlur = async () => {
    if (inputTodoName) {
      await updateDoc(todoRef, {
        name: inputTodoName,
        info: inputTodoInfo,
        user_list: userList,
        modified_date: serverTimestamp(),
      });
    } else {
      // inputTodoName이 없을 때 유효성 검사 통과 못하게
      Swal.fire({
        icon: "error",
        title: "투두 제목을 입력해 주세요.",
        text: "투두를 빈 이름으로 수정할 수 없습니다.",
      });
    }
  };

  const handleChange = (e: any) => {
    setInputTodoInfo(e.target.value);
  };

  // 투두 삭제
  const handleDelete = async () => {
    navigate(`/${projectId}?kanbanID=${kanbanId}`);
    await asyncDelay(600);
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
    setIsMoreModalOpened(false);
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

  // TextArea
  const handleTextAreaEnterPress = async (e: any) => {
    if (e.nativeEvent.isComposing) {
      return; // 조합 중일 땐 동작막기
    }

    if (e.key === "Enter" && e.shiftKey) {
      return;
    }

    if (e.key === "Enter") {
      if (inputTodoInfo) {
        await updateDoc(todoRef, {
          info: inputTodoInfo,
          modified_date: serverTimestamp(),
        });
      }
    }
  };

  if (!loadedState || !isLoaded) {
    return (
      <ProjectModalLayout $isShow={isTodoShow}>
        <ProjectModalContentBox>
          <LoadingPage />
        </ProjectModalContentBox>
      </ProjectModalLayout>
    );
  }

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
      <TodoContainer $isTodoShow={isTodoShow}>
        <div style={{ padding: "0 2rem 0 0" }}>
          <TodoTopContainer>
            <div style={{ display: "flex" }}>
              <TodoTitlePointer />
              <TodoTitle>
                <CommonInputLayout
                  ref={todoNameInputRef}
                  type="text"
                  placeholder="제목을 입력하세요"
                  value={inputTodoName}
                  $dynamicFontSize="1.12rem"
                  $dynamicPadding="0.9rem 0.5rem"
                  $dynamicWidth="auto"
                  onKeyDown={handleEnterPress}
                  onChange={(e) => setInputTodoName(e.target.value)}
                  onBlur={handleOnBlur}
                  onKeyUp={(e) => {
                    if (e.key === "Enter") {
                      todoNameInputRef.current!.blur();
                    }
                  }}
                />
              </TodoTitle>
            </div>
            <div style={{ position: "relative" }}>
              <button
                type="button"
                onClick={() => setIsMoreModalOpened(!isMoreModalOpened)}
                style={{ margin: "0 1rem 0 0" }}
              >
                <img
                  src={dotsIcon}
                  alt="더보기"
                  style={{ height: "1rem", width: "1rem" }}
                />
              </button>
              <TodoMoreModal
                isShow={isMoreModalOpened}
                setIsShow={setIsMoreModalOpened}
                handleDeleteClick={handleDelete}
              />
            </div>
          </TodoTopContainer>
          <div style={{ margin: "2.5rem 0 0" }}>
            <UserListContainer>
              <TodoSubtitle>담당자</TodoSubtitle>
              <CommonSelectMemberLayout
                userList={userList}
                setUserList={setUserList}
                // eslint-disable-next-line no-console
                onBlur={handleOnBlur}
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
                onChange={handleChange}
                onBlur={handleOnBlur}
                onKeyDown={handleTextAreaEnterPress}
                onKeyUp={(e) => {
                  if (e.nativeEvent.isComposing) {
                    return; // 조합 중일 땐 동작막기
                  }

                  if (e.key === "Enter" && e.shiftKey) {
                    return;
                  }
                  if (e.key === "Enter") {
                    textarea.current!.blur();
                  }
                }}
              />
            </InfoContainer>
          </div>
        </div>
        <div>
          <TodoTopContainer style={{ alignItems: "baseline" }}>
            <TodoTitle>업데이트</TodoTitle>
            <AddUpdateBtn
              type="button"
              onClick={() => {
                setIsUpdateClick((prev) => !prev);
              }}
              $isUpdateClick={isUpdateClick}
            >
              <img src={icon_plus} alt="투두 업데이트 추가" />
            </AddUpdateBtn>
          </TodoTopContainer>
          <Contour />
          <MarkdownEditor
            todoRef={todoRef}
            todoDataState={currentTodo}
            isUpdateClick={isUpdateClick}
            setIsUpdateClick={setIsUpdateClick}
          />
        </div>
      </TodoContainer>
    </ProjectModalLayout>
  );
}
