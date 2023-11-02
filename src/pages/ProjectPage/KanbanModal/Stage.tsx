import React, { useEffect, useState } from "react";
import { styled } from "styled-components";
import { useSearchParams } from "react-router-dom";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useRecoilState, useSetRecoilState } from "recoil";
import { createTodo } from "../../../api/CreateCollection";
import todoState from "../../../recoil/atoms/todo/todoState";
import kanbanState from "../../../recoil/atoms/kanban/kanbanState";
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
  align-items: center;
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
  display: none;
`;

const StageInfoPlusIcon = styled.img`
  height: 1rem;
  width: 1rem;
  cursor: pointer;
`;

interface Props {
  stageLists: any;
  isKanbanShow: boolean;
}

export default function Stage({ stageLists, isKanbanShow }: Props) {
  const [searchParams] = useSearchParams();
  const [todoLists, setTodoLists] = useState<any[]>();
  const projectID = window.location.pathname.substring(1)!;
  const kanbanID = searchParams.get("kanbanID")!;
  const [todoDataState, setTodoDataState] = useRecoilState(todoState);
  const [isStage, setIsStage] = useState(stageLists);
  const setKanbanDataState = useSetRecoilState(kanbanState);
  console.log(todoDataState);
  // const [todoData, setTodoData] = useState(todoDataState);
  const addedMap = todoDataState?.todoData?.size
    ? todoDataState.todoData
    : new Map();
  const todoData1 = { todoData: addedMap };
  console.log(addedMap, todoData1, todoLists);

  const todoQuery = query(
    collection(db, "project", projectID, "kanban", kanbanID, "todo"),
    where("is_deleted", "==", false),
  );

  useEffect(() => {
    if (!isKanbanShow) {
      return;
    }

    // setTodoDataState({ todoData: new Map() });
    const unsubTodo = onSnapshot(todoQuery, (todoSnapshot) => {
      console.log("before", todoDataState);
      // const addedMap = new Map();
      // const todoData = {"todoData": todoDataState?.todoData?.size ? todoDataState.todoData: addedMap}

      const todos: any[] = [];
      todoSnapshot.docChanges().forEach((change) => {
        // todos.push(change.doc.data());
        if (change.type === "added") {
          addedMap.set(change.doc.id, change.doc.data());
        }

        if (change.type === "modified") {
          addedMap.set(change.doc.id, change.doc.data());
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          setTodoDataState((todoData: any | Map<any, any>) => {
            addedMap.set(change.doc.id, change.doc.data());
            return todoData1;
          });
        }
        if (change.type === "removed") {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          setTodoDataState((todoData: any | Map<any, any>) => {
            addedMap.delete(change.doc.id);
            return todoData1;
          });
        }

        // if (addedMap.size > 0) {
        //     // setTodoDataState((todoData) => new Map([...prev, ...addedMap]));
        //     setTodoDataState(todoData1);
        //   }

        // [...addedMap].map((xx: any) => todos.push(xx[1]))
        setTodoDataState(todoData1);
      });
      addedMap.forEach((value: any) => {
        todos.push(value);
      });
      setTodoLists(todos);
      return () => {
        unsubTodo();
      };
    });
  }, [kanbanID]);

  const handleTodoAddClick = async (stageOrder: number, stageName: string) => {
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
    console.log("todo created");
  };

  const handleGoTodoClick = (todo: any) => {
    console.log("clicked info: ", todo);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const todoData = todoDataState;
    console.log([todoData][0].todoData);
  };

  const handleAddStageClick = async () => {
    const kanbanRef = doc(db, "project", projectID, "kanban", kanbanID);
    const newStage = isStage
      .concat({
        name: `새 스테이지 ${isStage.length - 2}`,
        order: isStage.length,
        created_date: new Date(),
        modified_date: new Date(),
      })
      .sort((a: any, b: any) => b.order - a.order);
    console.log(kanbanRef);
    await updateDoc(kanbanRef, {
      stage_list: newStage,
    });
    setIsStage(newStage);
    console.log(newStage);

    const targetDoc = await getDoc(kanbanRef);
    console.log(targetDoc.data());
    setKanbanDataState((prev) => {
      prev.set(targetDoc.id, targetDoc.data());
      return new Map([...prev]);
    });
  };

  return (
    <StageLayout>
      {isStage.map((stage: any) => (
        <StageBox key={stage.name}>
          <StageInfoBox>
            {stage.name}
            <StageIconBox>
              <StageInfoTrashIcon src={trashIcon} alt="스테이지 삭제" />
              <StageInfoPlusIcon
                src={icon_plus_circle}
                alt="투두 추가"
                onClick={() => handleTodoAddClick(stage.order, stage.name)}
              />
            </StageIconBox>
          </StageInfoBox>
          <StageContentBox>
            {todoLists
              ?.filter((stageTodo: any) => stageTodo.stageID === stage.name)
              .map((todo: any, index: number) => (
                <StageContent
                  key={`${todo.stageID}-${index.toString()}`}
                  onClick={() => handleGoTodoClick(todo)}
                >
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
          <StageInfoPlusIcon
            src={icon_plus_circle}
            alt="스테이지 추가"
            onClick={() => handleAddStageClick()}
          />
        </StageInfoBox>
        <StageContentBox />
      </StageBox>
    </StageLayout>
  );
}
