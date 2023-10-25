import React, { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import styled from "styled-components";
import { useRecoilValue, useSetRecoilState } from "recoil";

import Sidebar from "../Sidebar";
import { db } from "../../firebaseSDK";
import projectState from "../../recoil/atoms/project/projectState";
import userState from "../../recoil/atoms/login/userDataState";

const ProjectLayout = styled.div`
  display: flex;
  height: calc(100% - 4rem);
`;

export default function ProjectCheckRoute() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);
  const setProjectDataState = useSetRecoilState(projectState);
  const { email } = useRecoilValue(userState).userData;

  useEffect(() => {
    let passed = false;
    const projectRef = doc(db, "project", pathname);
    const unsub = onSnapshot(projectRef, async (projectDoc) => {
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
        setIsLoaded(true);
        setProjectDataState({
          projectData: projectDoc.data(),
        });
      } else {
        unsub();
        navigate("/");
      }
    });
    return () => unsub();
  }, [pathname]);

  return isLoaded === true ? (
    <ProjectLayout>
      <Sidebar />
      <Outlet />
    </ProjectLayout>
  ) : null;
}
