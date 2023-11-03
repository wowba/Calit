import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import {
  doc,
  onSnapshot,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { useRecoilState } from "recoil";
import { db } from "../../../firebaseSDK";
import {
  ProjectModalLayout,
  ProjectModalTabBackground,
  ProjectModalTabText,
  ProjectModalTabBox,
  ProjectModalContentBox,
} from "../../../components/layout/ProjectModalLayout";
import CommonInputLayout from "../../../components/layout/CommonInputLayout";
import CommonTextArea from "../../../components/layout/CommonTextArea";
import MarkdownEditor from "./MarkdownEditor";
import DatePicker from "../../../components/DatePicker";
import singleTodoState from "../../../recoil/atoms/todo/singleTodoState";
import CommonSelectMemberLayout from "../../../components/layout/CommonSelectMemberLayout";
import TagSelectLayout from "./TagSelectLayout";

type Props = {
  todoTabColor: string;
  isTodoShow: boolean;
};

// 스타일
const TodoContainer = styled(ProjectModalContentBox)`
  padding: 2rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  overflow: hidden;
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
const UserListContainer = styled(Container)``;
const DeadlineContainer = styled(Container)``;
const TagContainer = styled(Container)``;
const InfoContainer = styled(Container)``;

const Contour = styled.div`
  background-color: #eaeaea;
  width: 100%;
  height: 0.2rem;
  transform: translateY(-1.5rem);
  border-radius: 1px;
`;

export default function TodoModal({ todoTabColor, isTodoShow }: Props) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [todoDataState, setTodoDataState] = useRecoilState(singleTodoState);
  const navigate = useNavigate();
  const [userList, setUserList] = useState<any[]>([]);

  const [inputTodoName, setInputTodoName] = useState("");
  const [inputTodoInfo, setInputTodoInfo] = useState("");

  const textarea = useRef<HTMLTextAreaElement | null>(null);

  const [startDate, setStartDate] = useState(new Date());

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

  // todo 문서 snapshot
  useEffect(() => {
    if (!isTodoShow) {
      return;
    }
    const unsub = onSnapshot(todoRef, async (todoDoc) => {
      if (todoDoc.exists() && !todoDoc.data().is_deleted) {
        setTodoDataState({ todoData: todoDoc.data() });
        setIsLoaded(true);
        setInputTodoName(todoDoc.data().name);
        setInputTodoInfo(todoDoc.data().info);
        setStartDate(todoDoc.data().deadline.toDate());
        setUserList(todoDoc.data().user_list);
      } else {
        unsub();
        navigate(`/${projectId}?kanbanID=${kanbanId}`);
      }
    });

    // eslint-disable-next-line consistent-return
    return () => {
      unsub();
      setIsLoaded(false);
    };
  }, [todoId, isTodoShow]);

  // textarea height 자동 조절 (debouncing하기)
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

  // 마감일 업데이트
  const handleUpdateDatePicker = async (selectedDate: Date) => {
    setStartDate(selectedDate);
    if (selectedDate) {
      await updateDoc(todoRef, {
        deadline: selectedDate,
        modified_date: serverTimestamp(),
      });
    }
  };

  // isLoaded===false일 때 tag만 렌더링
  if (!isLoaded) {
    return (
      <ProjectModalLayout $isShow={isTodoShow}>
        <ProjectModalTabBox $marginLeft={19.5}>
          <ProjectModalTabBackground $color={todoTabColor} />
          <ProjectModalTabText $top={0.28} $left={3.3}>
            Todo
          </ProjectModalTabText>
        </ProjectModalTabBox>
      </ProjectModalLayout>
    );
  }

  return (
    <ProjectModalLayout $isShow={isTodoShow}>
      <ProjectModalTabBox $marginLeft={19.5} $isShow={isTodoShow}>
        <ProjectModalTabBackground $color={todoTabColor} />
        <ProjectModalTabText $top={0.28} $left={3.3}>
          Todo
        </ProjectModalTabText>
      </ProjectModalTabBox>
      <TodoContainer>
        <div style={{ padding: "0 2rem 0 0" }}>
          <TodoTitle>
            <CommonInputLayout
              type="text"
              placeholder="제목을 입력하세요"
              value={inputTodoName}
              $dynamicFontSize=" 1.2rem"
              $dynamicPadding="1rem 0.5rem"
              $dynamicWidth="auto"
              // onKeyDown={handleEnterPress}
              onChange={(e) => setInputTodoName(e.target.value)}
              onBlur={handleFocus}
            />
          </TodoTitle>
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
                date={startDate}
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
                todoDataState={todoDataState}
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
          <MarkdownEditor todoRef={todoRef} todoDataState={todoDataState} />
        </div>
      </TodoContainer>
    </ProjectModalLayout>
  );
}
