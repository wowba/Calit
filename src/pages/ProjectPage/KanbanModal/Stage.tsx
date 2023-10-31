import React, { useEffect, useState } from "react";
import { styled } from "styled-components";
import { useSearchParams } from "react-router-dom";
import {
  collection,
  onSnapshot,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useRecoilState, useSetRecoilState } from "recoil";
import { createTodo } from "../../../api/CreateCollection";
import todoState from "../../../recoil/atoms/todo/todoState";
import icon_plus_circle from "../../../assets/icons/icon_plus_circle.svg";
import trashIcon from "../../../assets/icons/trashIcon.svg";
import { db } from "../../../firebaseSDK";

const StageLayout = styled.div`
  display: flex;
  overflow: scroll;
  height: 75vh;
  width: 100vw;
`;

const StageBox = styled.div`
  height: 20rem;
  width: 10rem;
  margin: 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StageInfoBox = styled.div`
  display: flex;
  justify-content: space-between;
  width: 10rem;
  border-bottom: 2px solid #eaeaea;
  margin-bottom: 0.5rem;
`;
const StageContentBox = styled.div`
  box-sizing: border-box;

  height: 60vh;
  width: 10vw;
  padding: 0 0.5rem;

  background: #ededed;
  border: 1px solid #d5d5d5;
  box-shadow: 3px 4px 9px -2px rgba(0, 0, 0, 0.13);
  border-radius: 10px;
  overflow: scroll;
`;

const StageContent = styled.div`
  height: 4rem;
  width: 100%;
  display: flex;
  flex-direction: column;

  border-radius: 10px;
  border: 1px solid #d5d5d5;
  background: #fff;
`;

const StageContentParagraph = styled.p`
  &.title {
    font-weight: bold;
  }
`;

const StageIconBox = styled.div`
  display: flex;
`;

const StageInfoTrashIcon = styled.img`
  height: 1rem;
  width: 1rem;
  cursor: pointer;
`;

const StageInfoPlusIcon = styled.img`
  height: 1rem;
  width: 1rem;
  cursor: pointer;
`;

interface Props {
  stageLists: any;
}

export default function Stage({ stageLists }: Props) {
  const [searchParams] = useSearchParams();
  const [todoLists, setTodoLists] = useState<any[]>();
  const projectID = window.location.pathname.substring(1)!;
  const kanbanID = searchParams.get("kanbanID")!;
  // const [todoDataState] = useRecoilState(todoState);
  // const [todoData, setTodoData] = useState(todoDataState);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const setTodoDataState = useSetRecoilState(todoState);

  // console.log(stageLists, todoLists);

  useEffect(() => {
    const todoQuery = query(
      collection(db, "project", projectID, "kanban", kanbanID, "todo"),
      where("is_deleted", "==", false),
    );

    // setTodoDataState({ todoData: new Map() });
    const unsubTodo = onSnapshot(todoQuery, (todoSnapshot) => {
      const addedMap = new Map();
      const todos: any[] = [];
      todoSnapshot.docChanges().forEach((change) => {
        // console.log(change.type);
        todos.push(change.doc.data());
        if (change.type === "added") {
          addedMap.set(change.doc.id, change.doc.data());
        }

        // if (change.type === "modified") {
        //   setTodoDataState((prev) => {
        //     prev.set(change.doc.id, change.doc.data());
        //     return new Map([...prev]);
        //   });
        // }
        // // 칸반이 삭제된 경우 (is_deleted 수정 시 쿼리 결과 변경)
        // if (change.type === "removed") {
        //   setTodoDataState((prev) => {
        //     prev.delete(change.doc.id);
        //     return new Map([...prev]);
        //   });
        // }

        // if (addedMap.size > 0) {
        //   setTodoDataState((todoData) => new Map([...prev, ...addedMap]));
        // }
        setTodoLists(todos);
      });
    });

    return () => {
      unsubTodo();
    };
  }, [kanbanID]);

  const handleTodoClick = async (stageOrder: number, stageName: string) => {
    await createTodo(projectID, kanbanID, {
      update_list: [],
      user_list: [],
      name: "테스트투두",
      order: stageOrder,
      created_date: serverTimestamp(),
      modified_date: serverTimestamp(),
      is_deleted: false,
      stageID: stageName,
      deadline: new Date(),
      info: "내용",
    });
  };

  return (
    <StageLayout>
      {stageLists.map((stage: any) => (
        <StageBox>
          <StageInfoBox>
            {stage.name}
            <StageIconBox>
              <StageInfoTrashIcon src={trashIcon} alt="스테이지 삭제" />
              <StageInfoPlusIcon
                src={icon_plus_circle}
                alt="투두 추가"
                onClick={() => handleTodoClick(stage.order, stage.name)}
              />
            </StageIconBox>
          </StageInfoBox>
          <StageContentBox>
            {todoLists
              ?.filter((stageTodo: any) => stageTodo.stageID === stage.name)
              .map((todo: any) => (
                <StageContent>
                  <StageContentParagraph>
                    {todo.name}
                    {todo.info}
                  </StageContentParagraph>
                </StageContent>
              ))}
          </StageContentBox>
        </StageBox>
      ))}

      <StageBox>
        <StageInfoBox>
          스테이지 추가하기
          <StageInfoTrashIcon src={trashIcon} alt="스테이지 삭제" />
          <StageInfoPlusIcon src={icon_plus_circle} alt="스테이지 추가" />
        </StageInfoBox>
        <StageContentBox>
          <StageContent>
            <StageContentParagraph />
          </StageContent>
        </StageContentBox>
      </StageBox>
    </StageLayout>
  );
}
