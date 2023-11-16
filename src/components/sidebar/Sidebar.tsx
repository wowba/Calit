import React from "react";
import styled from "styled-components";
import { useRecoilValue } from "recoil";

import defaultProjectImg from "../../assets/images/deafultProjectImg.jpg";
import tutorialIcon from "../../assets/headerIcon/tutorial.svg";
import projectState from "../../recoil/atoms/project/projectState";
import RecentKanban from "./RecentKanban";

const SidebarLayout = styled.div`
  display: flex;
  position: relative;
  flex-direction: column;
  justify-content: space-between;

  width: 15rem;
  height: 100%;

  padding: 4rem 1.25rem 1.25rem 1.25rem;
`;

const ProjectInfoBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`;

const ProjectTitleParagraph = styled.p`
  font-size: 1.5rem;
  font-weight: 900;
  margin: 0.25rem 0 2.8rem 0;
`;

const ProjectProfileImg = styled.img`
  width: 100%;
  height: 7rem;
  object-fit: cover;
  border-radius: 0.5rem;
`;

export default function Sidebar() {
  const { projectData } = useRecoilValue(projectState);
  return (
    <SidebarLayout>
      <div style={{ height: "100%" }}>
        <ProjectInfoBox>
          <ProjectProfileImg
            src={
              projectData.project_img_URL
                ? projectData.project_img_URL
                : defaultProjectImg
            }
            alt="Project Profile Img"
          />
          <ProjectTitleParagraph>{projectData.name}</ProjectTitleParagraph>
        </ProjectInfoBox>
        <RecentKanban />
        <TutorialBox>
          <TutorialImg
            src={tutorialIcon}
            alt="TutorialIcon"
            onClick={handleRestoreTutorial}
          />
        </TutorialBox>
      </div>
    </SidebarLayout>
  );
}
