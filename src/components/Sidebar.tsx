import React from "react";
import styled from "styled-components";
import { useRecoilValue } from "recoil";
import trashIcon from "../assets/icons/trashIcon.svg";
import defaultProjectImg from "../assets/images/deafultProjectImg.jpg";
import projectState from "../recoil/atoms/project/projectState";

const SidebarLayout = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  width: 14rem;
  height: 100%;

  padding: 1rem 1.25rem 1.25rem 1.25rem;
`;

const ProjectInfoBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`;

const ProjectTitleParagraph = styled.p`
  font-size: 1rem;
  font-weight: 900;
  margin-bottom: 0.25rem;
`;

const ProjectProfileImg = styled.img`
  width: 100%;
  height: 7rem;

  object-fit: cover;

  border-radius: 0.5rem;
`;

const TrashBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  width: auto;
  height: 2.5rem;
  background-color: #ffd43b;

  border-radius: 0.3rem;
`;

const TrashBoxImg = styled.img`
  width: 1.5rem;
`;

export default function Sidebar() {
  const { projectData } = useRecoilValue(projectState);
  return (
    <SidebarLayout>
      <ProjectInfoBox>
        <ProjectTitleParagraph>{projectData.name}</ProjectTitleParagraph>
        <ProjectProfileImg
          src={
            projectData.project_img_URL
              ? projectData.project_img_URL
              : defaultProjectImg
          }
          alt="Project Profile Img"
        />
      </ProjectInfoBox>

      <TrashBox>
        <TrashBoxImg src={trashIcon} alt="TrashIcon" />
      </TrashBox>
    </SidebarLayout>
  );
}
