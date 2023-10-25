import React, { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { doc, onSnapshot } from "firebase/firestore";
import styled from "styled-components";
import { useSetRecoilState } from "recoil";

import Sidebar from "../Sidebar";
import { db } from "../../firebaseSDK";
import projectState from "../../recoil/atoms/project/projectState";

const ProjectLayout = styled.div`
  display: flex;
  height: calc(100% - 4rem);
`;

export default function ProjectCheckRoute() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);
  const setProjectDataState = useSetRecoilState(projectState);

  useEffect(() => {
    const projectRef = doc(db, "project", pathname);
    const unsub = onSnapshot(projectRef, (projectDoc) => {
      if (projectDoc.exists() && !projectDoc.data().is_deleted) {
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
