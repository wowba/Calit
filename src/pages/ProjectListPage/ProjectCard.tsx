import React from "react";
import styled from "styled-components";
import rectangle from "../../assets/Rectangle.svg";

interface Props {
  dynamic_url?: string;
}

const ProjectCardUnit = styled.div.attrs<Props>((props) => ({
  style: {
    backgroundImage: props.dynamic_url ? `url(${props.dynamic_url})` : "none",
  },
}))<Props>`
  display: inline;
  width: 400px;
  height: 226px;
  border-radius: 13px;
  position: relative;
  background-repeat: no-repeat;
  background-size: 100%;
  margin: 20px;
`;
const ProjectCardInfo = styled.div`
  width: 400px;
  height: 0px;
  background-color: #f5f5f5;
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
  top: -32px;
  left: 10px;
`;

const ProjectCardName = styled.p`
  position: absolute;
  top: -30px;
  z-index: 1;
  left: 30px;
`;

export default function ProjectCard({ projectImgUrl, projectName }: any) {
  return (
    <ProjectCardUnit dynamic_url={projectImgUrl}>
      <ProjectCardInfo className="project-card-info">
        <ProjectCardName>{projectName}</ProjectCardName>
        <ProjectCardTag
          className="project-card-tag"
          src={rectangle}
          alt={rectangle}
        />
      </ProjectCardInfo>
    </ProjectCardUnit>
  );
}
