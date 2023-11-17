import React from "react";
import styled from "styled-components";
import { useRecoilValue } from "recoil";

import defaultProjectImg from "../../assets/images/defaultProjectImg2.jpg";
import projectState from "../../recoil/atoms/project/projectState";
import RecentKanban from "./RecentKanban";

const SidebarLayout = styled.div`
  display: flex;
  position: relative;
  flex-direction: column;
  justify-content: space-between;

  width: 15rem;
  height: 100%;

  padding: 3.5rem 0.5rem 1.25rem 0.5rem;
`;

const ProjectContentBox = styled.div`
  height: 100%;
`;

const ProjectInfoBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  box-shadow: inset 0 7.5rem 3rem -4rem #f9f9f9;
`;

const ProjectTitleParagraph = styled.p`
  font-size: 1.25rem;
  font-weight: 900;
  padding-left: 0.5rem;
  display: table-cell;
`;

const ProjectTitleBox = styled.div`
  display: flex;
  margin: 0.5rem 0 1.5rem 0;
  display: table;
`;

const ProjectTitleBoxLabel = styled.div`
  width: 0.25rem;
  height: 1.3rem;
  background-color: #7064ff;
  border-radius: 7px;
  display: table-cell;
`;
const ProjectProfileImg = styled.img`
  width: 100%;
  height: 9rem;
  object-fit: cover;
  border-radius: 0.5rem;
  z-index: -1;
`;

export default function Sidebar() {
  const { projectData } = useRecoilValue(projectState);
  return (
    <SidebarLayout>
      <ProjectContentBox>
        <ProjectInfoBox>
          <ProjectProfileImg
            src={
              projectData.project_img_URL
                ? projectData.project_img_URL
                : defaultProjectImg
            }
            alt="Project Profile Img"
          />
          <ProjectTitleBox>
            {projectData.name ? <ProjectTitleBoxLabel /> : null}
            <ProjectTitleParagraph>{projectData.name}</ProjectTitleParagraph>
          </ProjectTitleBox>
        </ProjectInfoBox>
        <RecentKanban />
      </ProjectContentBox>
    </SidebarLayout>
  );
}
