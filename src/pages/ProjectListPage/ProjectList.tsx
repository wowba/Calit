/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { db } from "../../firebaseSDK";
import userState from "../../recoil/atoms/login/userDataState";
import InvitationBtn from "./InvitationBtn";
import ProjectCard from "./ProjectCard";
import CreateProjectBtn from "./CreateProjectBtn";

const ProjectListContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  justify-content: center;
  margin: 20px;
`;

export default function ProjectList() {
  const [projectData, setProjectData] = useState([]);
  const { project_list, name, project_img_URL, project_intro }: any =
    useRecoilValue(userState).userData;

  const fetchProjectData = async () => {
    const projects: any = await Promise.all(
      project_list.map(async (projectId: string) => {
        const docRef = doc(db, "project", projectId);
        const docSnap: any = await getDoc(docRef);

        if (docSnap.exists()) {
          if (docSnap.data().is_deleted === false) {
            return {
              id: projectId,
              name: docSnap.data().name,
              imgUrl: docSnap.data().project_img_URL,
              projectIntro: docSnap.data().project_intro,
            };
          }
        }
        return null;
      }),
    );

    setProjectData(projects.filter((project: any) => project !== null));
  };

  useEffect(() => {
    fetchProjectData();
  }, [name, project_img_URL, project_intro]);

  return (
    <div>
      <h1>ProjectList</h1>
      <InvitationBtn />
      <ProjectListContainer>
        <CreateProjectBtn />
        {projectData.map((project: any) => (
          <ProjectCard
            key={project.id}
            projectId={project.id}
            projectImgUrl={project.imgUrl}
            projectName={project.name}
            projectIntro={project.projectIntro}
            fetchProjectData={fetchProjectData}
          />
        ))}
      </ProjectListContainer>
    </div>
  );
}
