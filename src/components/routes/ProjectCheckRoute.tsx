import React, { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
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
import styled from "styled-components";
import { useRecoilValue, useSetRecoilState } from "recoil";

import Sidebar from "../Sidebar";
import { db } from "../../firebaseSDK";
import projectState from "../../recoil/atoms/project/projectState";
import userState from "../../recoil/atoms/login/userDataState";
import kanbanState from "../../recoil/atoms/kanban/kanbanState";
import ErrorPage from "../ErrorPage";

const ProjectLayout = styled.div`
  display: flex;
  height: calc(100% - 4rem);
`;

export default function ProjectCheckRoute() {
  const { pathname } = useLocation();
  const [isProjectLoaded, setIsProjectLoaded] = useState(false);
  const [isKanbanLoaded, setIsKanbanLoaded] = useState(false);
  const setProjectDataState = useSetRecoilState(projectState);
  const setKanbanDataState = useSetRecoilState(kanbanState);
  const { email } = useRecoilValue(userState).userData;

  const [is403, setIs403] = useState(false);
  const [is404, setIs404] = useState(false);

  useEffect(() => {
    // 프로젝트 문서 onSnapshot
    let passed = false;
    const projectRef = doc(db, "project", pathname);
    const unsubProject = onSnapshot(projectRef, async (projectDoc) => {
      // 초대 리스트에 있을경우 동작하는 로직
      if (
        projectDoc.exists() &&
        projectDoc.data().invited_list.includes(email)
      ) {
        passed = true;
        // user의 project_list에 project 추가
        const userRef = doc(db, "user", email);
        const userSnap: any = await getDoc(userRef);
        const projectList = userSnap.data().project_list;
        projectList.push(pathname.replace("/", ""));
        await updateDoc(userRef, {
          project_list: projectList,
        });
        // project의 user_list에 user 추가
        // project의 invited_list에서 user 제거
        const userList = projectDoc.data().user_list;
        const updatedUserList = [...userList];
        updatedUserList.push(email);
        const updatedInvitedList = projectDoc
          .data()
          .invited_list.filter((curUser: string) => curUser !== email);
        await updateDoc(projectRef, {
          user_list: updatedUserList,
          invited_list: updatedInvitedList,
          modified_date: serverTimestamp(),
        });
      }
      // 프로젝트 존재 및 userList 검증
      if (
        projectDoc.exists() &&
        !projectDoc.data().is_deleted &&
        (projectDoc.data().user_list.includes(email) || passed)
      ) {
        setIsProjectLoaded(true);
        setProjectDataState({
          projectData: projectDoc.data(),
        });
      } else if (!projectDoc.exists()) {
        unsubProject();
        setIs404(true);
      } else {
        unsubProject();
        setIs403(true);
      }
    });
    // 칸반 컬렉션 onSnapshot
    const kanbanQuery = query(
      collection(db, "project", pathname, "kanban"),
      where("is_deleted", "==", false),
    );
    const unsubKanban = onSnapshot(kanbanQuery, (kanbanSnapshot) => {
      const addedMap = new Map();
      kanbanSnapshot.docChanges().forEach((change) => {
        // 최초 Snapshot 생성 혹은 사용자가 직접 칸반을 추가했을 때
        if (change.type === "added") {
          addedMap.set(change.doc.id, change.doc.data());
        }
        // 칸반을 수정할 경우
        if (change.type === "modified") {
          setKanbanDataState((prev) => {
            prev.set(change.doc.id, change.doc.data());
            return new Map([...prev]);
          });
        }
        // 칸반이 삭제된 경우 (is_deleted 수정 시 쿼리 결과 변경)
        if (change.type === "removed") {
          setKanbanDataState((prev) => {
            prev.delete(change.doc.id);
            return new Map([...prev]);
          });
        }
      });
      if (addedMap.size > 0) {
        setKanbanDataState((prev) => new Map([...prev, ...addedMap]));
      }
      setIsKanbanLoaded(true);
    });
    // 클린업 함수. 칸반 데이터 초기화 및 실시간 연결 해제
    return () => {
      setKanbanDataState((prev) => {
        prev.clear();
        return prev;
      });
      setProjectDataState({
        projectData: null,
      });
      setIs403(false);
      setIs404(false);
      unsubProject();
      unsubKanban();
    };
  }, [pathname]);

  if (is404) {
    return <ErrorPage isProject404 />;
  }

  if (is403) {
    return <ErrorPage isProject403 />;
  }

  return isProjectLoaded && isKanbanLoaded ? (
    <ProjectLayout>
      <Sidebar />
      <Outlet />
    </ProjectLayout>
  ) : null;
}
