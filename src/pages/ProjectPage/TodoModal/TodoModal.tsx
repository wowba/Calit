/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { useLocation, useNavigate } from "react-router-dom";
import {
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
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
// import MarkdownEditor from "./MarkdownEditor";
import DatePicker from "../../../components/DatePicker";

type Props = {
  todoTabColor: string;
  isTodoShow: boolean;
};

// 스타일
const TodoContainer = styled(ProjectModalContentBox)`
  padding: 2rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
`;
const TodoTitle = styled.div`
  display: inline-block;
  font-weight: 900;
  font-size: 1.5rem;
  margin: 0 1rem 2rem 0;
`;
const TodoSubtitle = styled.div`
  display: inline-block;
  font-weight: 900;
  font-size: 1.1rem;
  margin: 0 1rem 1rem 0;
`;
const ManagedUser = styled.div`
  background-color: pink;
  border-radius: 8px;
  display: inline-block;
  white-space: nowrap;
  padding: 5px 7px;
  margin: 0 0.5rem 0 0;
`;
const ProfileImg = styled.img`
  border-radius: 50%;
  width: 1.5rem;
  height: 1.5rem;
  display: inline-block;
  vertical-align: middle;
  margin: 0 0.5rem 0 0;
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
  // const [todoDataState, setTodoDataState] = useRecoilState(todoState);
  const navigate = useNavigate();
  const [userData, setUserData] = useState<any[]>([]);

  const [inputTodoName, setInputTodoName] = useState("");
  const [inputTodoInfo, setInputTodoInfo] = useState("");

  const textarea = useRef<HTMLTextAreaElement | null>(null);

  const [startDate, setStartDate] = useState(new Date());

  const projectId = useLocation().pathname.substring(1);
  const queryString = useLocation().search;
  const kanbanId = queryString.substring(
    queryString.lastIndexOf("kanbanID=") + 9,
    queryString.indexOf("&"),
  );
  const todoId = queryString.substring(queryString.lastIndexOf("todoID=") + 7);
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
    const unsub =
      isTodoShow &&
      onSnapshot(todoRef, async (todoDoc) => {
        if (todoDoc.exists() && !todoDoc.data().is_deleted) {
          // setTodoDataState({ todoData: todoDoc.data() });
          setIsLoaded(true);
          setInputTodoName(todoDoc.data().name);
          setInputTodoInfo(todoDoc.data().info);
          setStartDate(todoDoc.data().deadline.toDate());

          const fetchData = async () => {
            const data = await Promise.all(
              todoDoc.data().user_list.map(async (id: string) => {
                const userRef = doc(db, "user", id);
                const userSnap: any = await getDoc(userRef);
                return {
                  userImage: userSnap.data().profile_img_URL,
                  userName: userSnap.data().name,
                  userEmail: userSnap.data().email,
                };
              }),
            );
            setUserData(data);
          };

          await fetchData();
        } else {
          // @ts-ignore
          unsub();
          navigate("/");
        }
      });

    return () => {
      if (isTodoShow) {
        // @ts-ignore
        unsub();
      }
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
  const handleFocus = async (e: any) => {
    if (inputTodoName) {
      await updateDoc(todoRef, {
        name: inputTodoName,
        info: inputTodoInfo,
        modified_date: serverTimestamp(),
      });
    } else {
      // inputTodoName이 없을 때 유효성 검사 통과 못하게
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

  // 담당자 삭제
  const handleDeleteUser = async (email: any) => {
    const userEmailList = userData.map((user) => user.userEmail);
    const updateManagedUser = userEmailList.filter(
      (curEmail: string) => curEmail !== email,
    );
    await updateDoc(todoRef, {
      user_list: updateManagedUser,
      modified_date: serverTimestamp(),
    });
  };

  return isLoaded ? (
    <ProjectModalLayout $isShow={isTodoShow}>
      <ProjectModalTabBox $marginLeft={19.5}>
        <ProjectModalTabBackground $color={todoTabColor} />
        <ProjectModalTabText $top={0.4} $left={3.3}>
          Todo
        </ProjectModalTabText>
      </ProjectModalTabBox>
      <TodoContainer>
        <div>
          <TodoTitle>
            <CommonInputLayout
              type="text"
              placeholder="제목을 입력하세요"
              value={inputTodoName}
              $dynamicFontSize=" 1.5rem"
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
              <div>
                {userData.map((user: any) => (
                  <ManagedUser
                    onClick={() => handleDeleteUser(user.userEmail)}
                    key={user.userName}
                  >
                    <ProfileImg src={user.userImage} alt="User Profile" />
                    <span>{user.userName}</span>
                  </ManagedUser>
                ))}
              </div>
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
              >
                {}
              </CommonTextArea>
            </InfoContainer>
          </div>
        </div>
        <div>
          <TodoTitle>업데이트</TodoTitle>
          <Contour>{}</Contour>
          {/* <MarkdownEditor /> */}
        </div>
      </TodoContainer>
    </ProjectModalLayout>
  ) : null;
}
