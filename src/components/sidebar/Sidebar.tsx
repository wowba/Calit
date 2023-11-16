import React from "react";
import styled from "styled-components";
import { useRecoilValue } from "recoil";

import defaultProjectImg from "../../assets/images/deafultProjectImg.jpg";
import projectState from "../../recoil/atoms/project/projectState";
import RecentKanban from "./RecentKanban";

const SidebarLayout = styled.div`
  display: flex;
  position: relative;
  flex-direction: column;
  justify-content: space-between;

  width: 15rem;
  height: 100%;

  padding: 4rem 0.5rem 1.25rem 0.5rem;
`;

const ProjectInfoBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  box-shadow: inset 0px 7rem 3rem -5rem rgba(255, 255, 255, 1);
`;

const ProjectTitleParagraph = styled.p`
  font-size: 1.5rem;
  font-weight: 900;
  margin-left: 0.25rem;
`;

const ProjectTitleBox = styled.div`
  display: flex;
  margin: 0.5rem 0 1.5rem 0;
`;

const ProjectTitleBoxLabel = styled.div`
  width: 0.5rem;
  height: auto;
  background-color: #7064ff;
  border-radius: 9px;
  margin-right: 0.5rem;
`;
const ProjectProfileImg = styled.img`
  width: 100%;
  height: 7rem;
  object-fit: cover;
  border-radius: 0.5rem;
  z-index: -1;
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
        </ProjectInfoBox>
        <ProjectTitleBox>
          <ProjectTitleBoxLabel />
          <ProjectTitleParagraph>{projectData.name}</ProjectTitleParagraph>
        </ProjectTitleBox>
        <RecentKanban />
      </div>
    </SidebarLayout>
  );
}
