/* eslint-disable consistent-return */
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

import Sidebar from "../sidebar/Sidebar";
import { db } from "../../firebaseSDK";
import projectState from "../../recoil/atoms/project/projectState";
import userState from "../../recoil/atoms/login/userDataState";
import kanbanState from "../../recoil/atoms/kanban/kanbanState";
import ErrorPage from "../ErrorPage";
import headerState from "../../recoil/atoms/header/headerState";
import LoadingPage from "../LoadingPage";
import userListState from "../../recoil/atoms/userList/userListState";
import { createUser } from "../../api/CreateCollection";

const ProjectLayout = styled.div`
  display: flex;
  height: calc(100% - 4rem);
`;

export default function ProjectCheckRoute() {
  const { pathname } = useLocation();

  const [isProjectLoaded, setIsProjectLoaded] = useState(false);
  const [isKanbanLoaded, setIsKanbanLoaded] = useState(false);
  const [isUserListLoaded, setIsUserListLoaded] = useState(false);

  const setProjectDataState = useSetRecoilState(projectState);
  const setKanbanDataState = useSetRecoilState(kanbanState);
  const setUserDataState = useSetRecoilState(userListState);

  const { email: loginEmail } = useRecoilValue(userState).userData;

  const [isInviteChecked, setIsInviteChecked] = useState(false);
  const [is403, setIs403] = useState(false);
  const [is404, setIs404] = useState(false);

  const setHeaderState = useSetRecoilState(headerState);

  // 초대 리스트 현황 및 프로젝트 유저 리스트 현황 체크
  useEffect(() => {
    const projectRef = doc(db, "project", pathname);

    const checkInvite = async () => {
      const projectDoc = await getDoc(projectRef);
      // 초대 리스트 검증
      if (
        projectDoc.exists() &&
        projectDoc.data().invited_list.includes(loginEmail)
      ) {
        // user의 project_list에 project 추가
        const userRef = doc(db, "user", loginEmail);
        const userSnap: any = await getDoc(userRef);
        const {
          project_list: projectList,
          email,
          name,
          profile_img_URL: profileImgUrl,
        } = userSnap.data();
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
        // project의 user 하위 컬렉션에 초대된 유저 추가
        await createUser(pathname, email, {
          email,
          name,
          intro: "",
          profile_img_URL: profileImgUrl,
          is_kicked: false,
        });
        setIsInviteChecked(true);
      }
      // 유저 리스트 검증
      else if (
        projectDoc.exists() &&
        projectDoc.data().user_list.includes(loginEmail)
      ) {
        setIsInviteChecked(true);
      } else if (!projectDoc.exists()) {
        setIs404(true);
      } else {
        setIs403(true);
      }
    };
    checkInvite();

    return () => {
      setIs403(false);
      setIs404(false);
      setIsInviteChecked(false);
    };
  }, [pathname]);

  useEffect(() => {
    // 프로젝트 초대 현황 로직 우선 확인
    if (!isInviteChecked) return;
    // 프로젝트 문서 onSnapshot
    const projectRef = doc(db, "project", pathname);
    const unsubProject = onSnapshot(projectRef, async (projectSnapshot) => {
      // 프로젝트 is_deleted 확인
      if (projectSnapshot.exists() && !projectSnapshot.data().is_deleted) {
        setIsProjectLoaded(true);
        setProjectDataState({
          projectData: projectSnapshot.data(),
        });
      } else {
        unsubProject();
        setIs404(true);
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
    // 유저 컬렉션 onSnapshot
    const userQuery = query(collection(db, "project", pathname, "user"));
    const unsubUserList = onSnapshot(userQuery, (userSnapshot) => {
      const addedMap = new Map();
      userSnapshot.docChanges().forEach((change) => {
        // 최초 Snapshot 생성 혹은 프로젝트에 유저가 추가된 경우
        if (change.type === "added") {
          addedMap.set(change.doc.id, change.doc.data());
        }
        // 유저를 수정할 경우
        if (change.type === "modified") {
          setUserDataState((prev) => {
            prev.set(change.doc.id, change.doc.data());
            return new Map([...prev]);
          });
        }
      });
      if (addedMap.size > 0) {
        setUserDataState((prev) => new Map([...prev, ...addedMap]));
      }
      setIsUserListLoaded(true);
      setHeaderState("project");
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
      setUserDataState((prev) => {
        prev.clear();
        return prev;
      });
      setIs404(false);
      unsubProject();
      unsubKanban();
      unsubUserList();
      setHeaderState("list");
    };
  }, [pathname, isInviteChecked]);

  if (is404) {
    return <ErrorPage isProject404 />;
  }

  if (is403) {
    return <ErrorPage isProject403 />;
  }

  return isProjectLoaded && isKanbanLoaded && isUserListLoaded ? (
    <ProjectLayout>
      <Sidebar />
      <Outlet />
    </ProjectLayout>
  ) : (
    <LoadingPage />
  );
}
