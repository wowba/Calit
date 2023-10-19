import React from "react";
import styled from "styled-components";
import rectangle from "../../assets/images/Rectangle.svg";

interface Props {
  $dynamic_url?: string;
}

export const ProjectCardUnit = styled.a<Props>`
  background-image: url(${(props) =>
    props.$dynamic_url ? props.$dynamic_url : "none"});
  display: inline;
  width: 400px;
  min-width: 230px;
  height: 226px;
  border-radius: 13px;
  position: relative;
  background-repeat: no-repeat;
  background-size: 100%;
  margin: 0px 20px;
  overflow: hidden;
`;
const ProjectCardInfo = styled.div`
  width: 400px;
  height: 0px;
  background-color: #ededed;
  border-radius: 3px 3px 13px 13px;
  position: absolute;
  bottom: 0px;
  box-shadow: -1px -3px 76px -18px rgba(0, 0, 0, 0.5);
  -webkit-box-shadow: -1px -3px 76px -18px rgba(0, 0, 0, 0.5);
  -moz-box-shadow: -1px -3px 76px -18px rgba(0, 0, 0, 0.5);
  transition: height 0.3s ease;
  &:hover {
    height: 100px;
  }
`;

const ProjectCardTag = styled.img`
  position: relative;
  top: -31px;
  left: 10px;
`;

const ProjectCardName = styled.p`
  position: absolute;
  top: -28px;
  z-index: 1;
  left: 30px;
  width: 160px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: 700;
`;

const ProjectCardIntro = styled.p`
  margin: -20px 20px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
`;

export default function ProjectCard({
  projectId,
  projectImgUrl,
  projectName,
  projectIntro,
}: any) {
  return (
    <ProjectCardUnit $dynamic_url={projectImgUrl} href={projectId}>
      <ProjectCardInfo className="project-card-info">
        <ProjectCardName>
          {projectName || "제목을 입력해주세요"}
        </ProjectCardName>
        <ProjectCardTag
          className="project-card-tag"
          src={rectangle}
          alt={rectangle}
        />
        <ProjectCardIntro>
          {projectIntro || "프로젝트 소개를 입력해주세요"}
        </ProjectCardIntro>
      </ProjectCardInfo>
    </ProjectCardUnit>
  );
}
