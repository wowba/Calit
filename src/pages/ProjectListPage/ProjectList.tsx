import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { db } from "../../firebaseSDK";
import userState from "../../recoil/atoms/login/userDataState";
import InvitationBtn from "./InvitationBtn";
import ProjectCard from "./ProjectCard";

const ProjectListContainer = styled.div`
  display: flex;
  justify-content: center;
`;

export default function ProjectList() {
  const [projectData, setProjectData] = useState([]);
  const userData = useRecoilValue(userState);

  const fetchProjectData = async () => {
    const projects: any = await Promise.all(
      userData.userData.project_list.map(async (projectId: string) => {
        const docRef = doc(db, "project", projectId);
        const docSnap: any = await getDoc(docRef);

        return {
          id: projectId,
          name: docSnap.data().name,
          imgUrl: docSnap.data().project_img_URL,
          projectIntro: docSnap.data().project_intro,
        };
      }),
    );
    setProjectData(projects.filter((project: any) => project !== null));
  };

  useEffect(() => {
    fetchProjectData();
  }, [userData]);

  return (
    <div>
      <h1>ProjectList</h1>
      <InvitationBtn />
      <ProjectListContainer>
        {projectData.map((project: any) => (
          <ProjectCard
            key={project.id}
            projectId={project.id}
            projectImgUrl={project.imgUrl}
            projectName={project.name}
            projectIntro={project.projectIntro}
          />
        ))}
      </ProjectListContainer>
    </div>
  );
}
