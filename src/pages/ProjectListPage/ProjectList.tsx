import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { db } from "../../firebaseSDK";
import userState from "../../recoil/atoms/login/userDataState";
import InvitationBtn from "./InvitationBtn";
import ProjectCard from "./ProjectCard";
import CreateProjectBtn from "./CreateProjectBtn";
import ProjectListIcon from "../../assets/logo/ProjectlistLogo.svg";

const ProjectListTitle = styled.div`
  font-size: 2rem;
  font-weight: 900;
  > img {
    scale: 85%;
    margin: 0 0 0 0.6rem;
  }
`;
const ProjectListContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(33%, auto));
  justify-content: center;
  margin: 20px 0px;
`;

export default function ProjectList() {
  const [projectData, setProjectData] = useState([]);
  const {
    project_list: projectList,
    name,
    project_img_URL: projectImgUrl,
    project_intro: projectIntro,
  }: any = useRecoilValue(userState).userData;

  const fetchProjectData = async () => {
    const projects: any = await Promise.all(
      projectList.map(async (projectId: string) => {
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
  }, [name, projectImgUrl, projectIntro, projectList]);

  return (
    <div style={{ margin: "2.5rem 8%" }}>
      <ProjectListTitle>
        <img src={ProjectListIcon} alt="Project List" />
      </ProjectListTitle>
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
