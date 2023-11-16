import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import Swal from "sweetalert2";
import CalendarModal from "./CalendarModal/CalendarModal";
import KanbanModal from "./KanbanModal/KanbanModal";
import TodoModal from "./TodoModal/TodoModal";
import { db } from "../../firebaseSDK";
import todoState from "../../recoil/atoms/todo/todoState";
import tutorialCalendarState from "../../recoil/atoms/tutorial/tutorialCalendarState";
import {
  ProjectLayout,
  ProjectModalTabBox,
} from "../../components/layout/ProjectModalLayout";
import todoLoaded from "../../recoil/atoms/sidebar/todoLoaded";
import Tutorial from "../../components/modal/TutorialModal";

export default function Project() {
  const [searchParams, setSearchParams] = useSearchParams();
  const setTodoDataState = useSetRecoilState(todoState);
  const tutorialData = useRecoilValue(tutorialCalendarState).isCalendarTutorial;
  const setTutorialState = useSetRecoilState(tutorialCalendarState);
  const [isShowTutorial, setIsShowTutorial] = useState(false);

  const [isKanbanShow, setIsKanbanShow] = useState(false);
  const [isTodoShow, setIsTodoShow] = useState(false);

  const [isLoaded, setIsLoaded] = useRecoilState(todoLoaded);

  let calendarTabColor = "#7064FF";
  let calendarTextColor = "#FCFCFC";

  let kanbanTabColor = "transparent";
  let kanbanTextColor = "#B0B0B0";

  let todoTabColor = "transparent";
  let todoTextColor = "#B0B0B0";

  if (searchParams.has("kanbanID")) {
    calendarTabColor = "transparent";
    calendarTextColor = "#7064FF";

    kanbanTabColor = "#7064FF";
    kanbanTextColor = "#FCFCFC";
    if (searchParams.has("todoID")) {
      todoTabColor = "#7064FF";
      todoTextColor = "#FCFCFC";

      kanbanTabColor = "transparent";
      kanbanTextColor = "#7064FF";
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

  // 모달 텍스트 가운데 중앙 정렬
  // 리스트페이지에서도 아이콘 넣기

  // 캘린더 튜토리얼
  const fetchTutorialData = () => {
    if (!tutorialData) {
      Swal.fire({
        icon: "info",
        title: "프로젝트에 오신 것을 환영합니다!",
        text: "상단 헤더 모달들이 궁금하시다면, 하단의 튜토리얼 보기 버튼을 눌러주세요!",
        showCancelButton: true,
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
        confirmButtonText: "튜토리얼 보기",
        cancelButtonText: "다시보지 않기",
      }).then((result) => {
        if (result.isConfirmed) {
          setIsShowTutorial(true);
        }

        // 다시보지 않기 선택
        if (result.isDismissed) {
          setTutorialState({
            isCalendarTutorial: true,
          });
        }
      });
    }
  };

  // 캘린더 튜토리얼
  useEffect(() => {
    fetchTutorialData();
  }, []);

  useEffect(() => {
    if (!searchParams.has("kanbanID")) {
      return;
    }
    setTodoDataState(new Map());
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
          setTodoDataState((prev) => {
            prev.set(change.doc.id, change.doc.data());
            return new Map([...prev]);
          });
        }
        // 투두가 삭제된 경우 (is_deleted 수정 시 쿼리 결과 변경)
        if (change.type === "removed") {
          setTodoDataState((prev) => {
            prev.delete(change.doc.id);
            return new Map([...prev]);
          });
        }
      });
      if (addedMap.size > 0) {
        setTodoDataState((prev) => new Map([...prev, ...addedMap]));
      }
      setIsKanbanShow(true);
      if (searchParams.has("todoID")) {
        setIsTodoShow(true);
      }
      setIsLoaded(true);
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
      <ProjectModalTabBox
        $left={15.2}
        onClick={handleCalendarTabClick}
        $isShow
        $color={calendarTabColor}
        $textColor={calendarTextColor}
      >
        Calender
      </ProjectModalTabBox>
      <ProjectModalTabBox
        $left={24.7}
        $isShow={isLoaded ? isKanbanShow : true}
        onClick={handleKanbanTabClick}
        $color={kanbanTabColor}
        $textColor={kanbanTextColor}
      >
        Kanban
      </ProjectModalTabBox>
      <ProjectModalTabBox
        $left={34.2}
        $isShow={isTodoShow}
        $color={todoTabColor}
        $textColor={todoTextColor}
      >
        Todo
      </ProjectModalTabBox>

      {/* 캘린더 */}
      <CalendarModal setSearchParams={setSearchParams} />
      {/* 칸반 */}
      <KanbanModal isKanbanShow={isKanbanShow} />
      {/* 투두 */}
      <TodoModal isTodoShow={isTodoShow} />
      <Tutorial
        isShowTutorial={isShowTutorial}
        setIsShowTutorial={setIsShowTutorial}
      />
    </ProjectLayout>
  );
}
