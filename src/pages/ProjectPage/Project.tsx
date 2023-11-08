import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useSearchParams } from "react-router-dom";

import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useSetRecoilState } from "recoil";
import CalendarModal from "./CalendarModal/CalendarModal";
import KanbanModal from "./KanbanModal/KanbanModal";
import TodoModal from "./TodoModal/TodoModal";
import { db } from "../../firebaseSDK";
import todoState from "../../recoil/atoms/todo/todoState";
import {
  ProjectModalTabBackground,
  ProjectModalTabBox,
  ProjectModalTabContainer,
  ProjectModalTabText,
} from "../../components/layout/ProjectModalLayout";

const ProjectLayout = styled.div`
  position: relative;

  width: 100%;
  height: 100%;
  padding: 0.75rem 1.75rem 0 0.5rem;
`;

const ProjectLayoutFooter = styled.div`
  position: fixed;
  z-index: 999;
  top: calc(100% - 0.6rem);

  /* 사이드바 width 변경시 수정 필요. */
  width: calc(100% - 14rem);
  height: 0.6rem;

  border-radius: 0 0.6rem 0 0;
  background-color: #ffea7a;
  box-shadow: -2px 4px 20px 0px rgba(0, 0, 0, 0.6);
`;

export default function Project() {
  const [searchParams, setSearchParams] = useSearchParams();
  const setTestTodoDataState = useSetRecoilState(todoState);

  const [isKanbanShow, setIsKanbanShow] = useState(false);
  const [isTodoShow, setIsTodoShow] = useState(false);

  let calendarTabColor = "#FFD43B";
  let kanbanTabColor = "#ffea7a";
  let todoTabColor = "#ffea7a";

  if (searchParams.has("kanbanID")) {
    calendarTabColor = "#ffea7a";
    kanbanTabColor = "#FFD43B";
    if (searchParams.has("todoID")) {
      todoTabColor = "#FFD43B";
      kanbanTabColor = "#ffea7a";
    }
  }

  const handleCalendarTabClick = () => {
    setSearchParams();
  };

  const handleKanbanTabClick = () => {
    if (searchParams.has("kanbanID"))
      setSearchParams({
        kanbanID: searchParams.get("kanbanID")!,
      });
  };

  useEffect(() => {
    if (!searchParams.has("kanbanID")) {
      return;
    }
    setTestTodoDataState(new Map());
    const projectID = window.location.pathname.substring(1);
    const kanbanID = searchParams.get("kanbanID");
    const todoQuery = query(
      collection(db, "project", projectID, "kanban", kanbanID!, "todo"),
      where("is_deleted", "==", false),
    );

    const unsubTodo = onSnapshot(todoQuery, (todoSnapshot) => {
      const addedMap = new Map();
      todoSnapshot.docChanges().forEach((change) => {
        // 최초 Snapshot 생성 혹은 사용자가 직접 투두를 추가했을 때
        if (change.type === "added") {
          addedMap.set(change.doc.id, change.doc.data());
        }
        // 투두를 수정할 경우
        if (change.type === "modified") {
          setTestTodoDataState((prev) => {
            prev.set(change.doc.id, change.doc.data());
            return new Map([...prev]);
          });
        }
        // 투두가 삭제된 경우 (is_deleted 수정 시 쿼리 결과 변경)
        if (change.type === "removed") {
          setTestTodoDataState((prev) => {
            prev.delete(change.doc.id);
            return new Map([...prev]);
          });
        }
      });
      if (addedMap.size > 0) {
        setTestTodoDataState((prev) => new Map([...prev, ...addedMap]));
      }
      setIsKanbanShow(true);
      if (searchParams.has("todoID")) {
        setIsTodoShow(true);
      }
    });

    // eslint-disable-next-line consistent-return
    return () => {
      setIsKanbanShow(false);
      unsubTodo();
    };
  }, [searchParams.get("kanbanID")]);

  useEffect(() => {
    if (isKanbanShow && searchParams.has("todoID")) {
      setIsTodoShow(true);
    }
    return () => {
      setIsTodoShow(false);
    };
  }, [searchParams.get("todoID"), isKanbanShow]);

  return (
    <ProjectLayout>
      {/* 각 모달 탭 */}
      <ProjectModalTabContainer>
        <ProjectModalTabBox
          $left={1.5}
          onClick={handleCalendarTabClick}
          $isShow
        >
          <ProjectModalTabBackground $color={calendarTabColor} />
          <ProjectModalTabText $top={0.28} $left={2.5}>
            Calender
          </ProjectModalTabText>
        </ProjectModalTabBox>
        <ProjectModalTabBox
          $left={10.25}
          $isShow={isKanbanShow}
          onClick={handleKanbanTabClick}
        >
          <ProjectModalTabBackground $color={kanbanTabColor} />
          <ProjectModalTabText $top={0.28} $left={2.8}>
            Kanban
          </ProjectModalTabText>
        </ProjectModalTabBox>
        <ProjectModalTabBox $left={19} $isShow={isTodoShow}>
          <ProjectModalTabBackground $color={todoTabColor} />
          <ProjectModalTabText $top={0.28} $left={3.3}>
            Todo
          </ProjectModalTabText>
        </ProjectModalTabBox>
      </ProjectModalTabContainer>

      {/* 캘린더 */}
      <CalendarModal setSearchParams={setSearchParams} />
      {/* 칸반 */}
      <KanbanModal isKanbanShow={isKanbanShow} />
      {/* 투두 */}
      <TodoModal isTodoShow={isTodoShow} />
      <ProjectLayoutFooter />
    </ProjectLayout>
  );
}
