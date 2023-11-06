import React, { useEffect, useState } from "react";
import { styled } from "styled-components";
// import { useSearchParams } from "react-router-dom";
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
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "@hello-pangea/dnd";
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
  height: 70vh;
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
  stageLists: any; // 삭제예정
  isKanbanShow: boolean;
}

export default function Stage({ stageLists, isKanbanShow }: Props) {
  // const [searchParams, setSearchParams] = useSearchParams();
  const [todoLists, setTodoLists] = useState([]);
  const urlQueryString = new URLSearchParams(window.location.search);
  const projectID = window.location.pathname.substring(1);
  const kanbanID = isKanbanShow
    ? String(urlQueryString.get("kanbanID"))
    : "null";
  const [todoDataState, setTodoDataState] = useRecoilState(todoState);
  const [isStage, setIsStage] = useState(stageLists); // 삭제 예정
  const setKanbanDataState = useSetRecoilState(kanbanState);

  // const [todoData, setTodoData] = useState(todoDataState);
  const addedMap = todoDataState?.todoData?.size
    ? todoDataState.todoData
    : new Map();
  const todoData1 = { todoData: addedMap };

  useEffect(() => {
    if (!isKanbanShow) {
      return;
    }

    const todoQuery = query(
      collection(db, "project", projectID, "kanban", kanbanID, "todo"),
      where("is_deleted", "==", false),
    );

    const unsubTodo = onSnapshot(todoQuery, (todoSnapshot) => {
      const todos: any = [];
      todoSnapshot.docChanges().forEach((change) => {
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

        setTodoDataState(todoData1);
      });
      addedMap.forEach((value: any) => {
        todos.push(value);
        // if (!todos[value.stageID]) {
        //   todos[value.stageID] = [value];
        // } else {
        //   todos[value.stageID].push(value);
        // }
      });

      if (addedMap) {
        // const todos: any = [];
        // stageLists.forEach((singleStage: any) => {
        //   todos[singleStage.name] = [];
        // });

        // console.log(todos);
        // addedMap.forEach((ad: any) => {
        //   console.log(todos);
        //   todos[ad.stageID].push(ad);
        // });

        // console.log(todos);
        setTodoLists(todos);
      }
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
      todo_tag_list: [],
      todo_option_list: [
        {
          label: "긴급🔥",
          value: "긴급🔥",
          color: "#f92f66",
          canDelete: false,
        },
        { label: "FE✨", value: "FE✨", color: "#ddafff", canDelete: false },
        { label: "BE🛠️", value: "BE🛠️", color: "#F5F3BB", canDelete: false },
        {
          label: "UX/UI🎨",
          value: "UX/UI🎨",
          color: "#00FFF5",
          canDelete: false,
        },
      ],
    });
    // console.log("todo created");
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
    await updateDoc(kanbanRef, {
      stage_list: newStage,
    });
    setIsStage(newStage);

    const targetDoc = await getDoc(kanbanRef);
    setKanbanDataState((prev) => {
      prev.set(targetDoc.id, targetDoc.data());
      return new Map([...prev]);
    });
  };

  const getStageListStyle = (isDraggingOver: any) => ({
    background: isDraggingOver ? "lightblue" : "lightgrey",
    display: "flex",
    padding: "8px",
    margin: "12px",
    overflow: "auto",
  });

  const onDragEnd = async (result: DropResult) => {
    // drop이 불가능한 공간으로 드래그한 경우
    if (!result.destination) return;

    // 출발지와 목적지가 같은 경우
    if (
      result.destination.droppableId === result.source.droppableId &&
      result.destination.index === result.source.index
    )
      return;

    if (result.destination) {
      const beforeDragIndex = result.source.index;
      const beforeDragDroppableId = result.source.droppableId;
      const afterDragIndex = result.destination.index;
      const afterDragDroppableId = result.destination.droppableId;

      // 스테이지의 배열 이동
      if (
        beforeDragDroppableId.indexOf("inner") === -1 ||
        afterDragDroppableId.indexOf("inner") === -1
      ) {
        const [selectedStage] = isStage.splice(beforeDragIndex, 1);
        isStage.splice(afterDragIndex, 0, selectedStage);
        setIsStage(isStage);
        const kanbanRef = doc(db, "project", projectID, "kanban", kanbanID);
        await updateDoc(kanbanRef, {
          stage_list: isStage,
        });
        const targetDoc = await getDoc(kanbanRef);
        setKanbanDataState((prev) => {
          prev.set(targetDoc.id, targetDoc.data());
          return new Map([...prev]);
        });
      } else {
        // 투두의 배열 이동
        // console.log("before", todoLists);
      }
    }
  };
  return (
    <StageLayout>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable
          droppableId="stageDroppable"
          key="stageDroppable"
          direction="horizontal"
        >
          {/* eslint-disable-next-line @typescript-eslint/no-unused-vars */}
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              style={getStageListStyle(snapshot.isDraggingOver)}
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...provided.droppableProps}
            >
              {isStage.map((stage: any, index: number) => (
                <Draggable
                  draggableId={stage.order.toString()}
                  index={index}
                  key={stage.order.toString()}
                >
                  {(draggableProvided) => (
                    <div
                      ref={draggableProvided.innerRef}
                      // eslint-disable-next-line react/jsx-props-no-spreading
                      {...draggableProvided.dragHandleProps}
                      // eslint-disable-next-line react/jsx-props-no-spreading
                      {...draggableProvided.draggableProps}
                    >
                      <StageBox key={stage.name}>
                        <StageInfoBox>
                          {stage.name}
                          <StageIconBox>
                            <StageInfoTrashIcon
                              src={trashIcon}
                              alt="스테이지 삭제"
                            />
                            <StageInfoPlusIcon
                              src={icon_plus_circle}
                              alt="투두 추가"
                              onClick={() =>
                                handleTodoAddClick(stage.order, stage.name)
                              }
                            />
                          </StageIconBox>
                        </StageInfoBox>
                        <Droppable
                          droppableId={`inner-${stage.name}`}
                          key={`inner-${stage.name}`}
                          type="sub"
                        >
                          {(innerProvided) => (
                            <div
                              ref={innerProvided.innerRef}
                              // eslint-disable-next-line react/jsx-props-no-spreading
                              {...innerProvided.droppableProps}
                            >
                              <StageContentBox>
                                {todoLists
                                  ?.filter(
                                    (stageTodo: any) =>
                                      stageTodo.stageID === stage.name,
                                  )
                                  .map((todo: any, innerIndex: number) => (
                                    <Draggable
                                      draggableId={`${todo.stageID}-${todo.created_date.seconds}`}
                                      index={innerIndex}
                                      key={`${todo.stageID}-${todo.created_date.seconds}`}
                                    >
                                      {(innerDraggableProvided) => (
                                        <div
                                          ref={innerDraggableProvided.innerRef}
                                          // eslint-disable-next-line react/jsx-props-no-spreading
                                          {...innerDraggableProvided.dragHandleProps}
                                          // eslint-disable-next-line react/jsx-props-no-spreading
                                          {...innerDraggableProvided.draggableProps}
                                        >
                                          <StageContent>
                                            <StageContentParagraph>
                                              {todo.name}
                                            </StageContentParagraph>
                                          </StageContent>
                                        </div>
                                      )}
                                    </Draggable>
                                  ))}
                              </StageContentBox>
                              {innerProvided.placeholder}
                            </div>
                          )}
                        </Droppable>
                      </StageBox>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
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
