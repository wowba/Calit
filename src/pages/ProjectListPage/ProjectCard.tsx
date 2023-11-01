import React, { useState } from "react";
import styled from "styled-components";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "../../firebaseSDK";
import rectangle from "../../assets/images/Rectangle.svg";
import ProjectIconContainer from "./ProjectIconContainer";
import CommonInputLayout from "../../components/layout/CommonInputLayout";
import CommonTextArea from "../../components/layout/CommonTextArea";

interface Props {
  $dynamic_url?: string;
}

export const ProjectCardUnit = styled.div`
  display: inline;
  width: 400px;
  min-width: 230px;
  height: 226px;
  border-radius: 13px;
  position: relative;
  background-repeat: no-repeat;
  background-size: 100%;
  margin: 20px;
  overflow: hidden;
`;
const ProjectCardBgImg = styled.a<Props>`
  background-image: url(${(props) =>
    props.$dynamic_url
      ? props.$dynamic_url
      : "https://i.pinimg.com/564x/ad/36/d7/ad36d788f88de7de91122c7317449371.jpg"});
  display: inline-block;
  width: 400px;
  min-width: 230px;
  height: 226px;
  position: relative;
  background-repeat: no-repeat;
  background-size: cover;
  overflow: hidden;
`;

const ProjectCardInfo = styled.div<{ isTextInputActive: boolean }>`
  width: 400px;
  height: ${(props) => (props.isTextInputActive ? "110px" : "0px")};
  background-color: #ededed;
  border-radius: 3px 3px 13px 13px;
  position: absolute;
  bottom: ${(props) => (props.isTextInputActive ? "-5px" : "0px")};
  justify-contents: center;
  box-shadow: -1px -3px 76px -18px rgba(0, 0, 0, 0.5);
  -webkit-box-shadow: -1px -3px 76px -18px rgba(0, 0, 0, 0.5);
  -moz-box-shadow: -1px -3px 76px -18px rgba(0, 0, 0, 0.5);
  transition: all 0.5s ease;
  &:hover {
    height: 110px;
    bottom: -5px;
  }
`;

const ProjectCardTag = styled.img`
  position: relative;
  top: -31px;
  left: 10px;
`;

export default function ProjectCard({
  projectId,
  projectImgUrl,
  projectName,
  projectIntro,
  fetchProjectData,
}: any) {
  const [inputNameValue, setInputNameValue] = useState(projectName);
  const [inputIntroValue, setInputIntroValue] = useState(projectIntro);
  const [isTextInputActive, setIsTextInputActive] = useState(false);

  const handleTitleBlur = async () => {
    if (inputNameValue) {
      const docRef = doc(db, "project", projectId);
      await updateDoc(docRef, {
        name: inputNameValue,
        modified_date: serverTimestamp(),
      });
    }
  };
  const handleIntroBlur = async () => {
    setIsTextInputActive(false);
    if (inputIntroValue) {
      const docRef = doc(db, "project", projectId);
      await updateDoc(docRef, {
        project_intro: inputIntroValue,
        modified_date: serverTimestamp(),
      });
    }
  };
  const handleIntroFocus = () => {
    setIsTextInputActive(true);
  };

  return (
    <ProjectCardUnit>
      <ProjectCardBgImg $dynamic_url={projectImgUrl} href={projectId} />
      <ProjectIconContainer
        projectId={projectId}
        fetchProjectData={fetchProjectData}
      />
      <ProjectCardInfo
        className="project-card-info"
        isTextInputActive={isTextInputActive}
      >
        <CommonInputLayout
          $isHover
          $dynamicWidth="10rem"
          $dynamicPadding="2px 4px"
          placeholder="제목을 입력해주세요"
          style={{
            zIndex: "5",
            position: "absolute",
            top: "-26px",
            left: "30px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            fontWeight: "700",
            fontSize: "1rem",
            backgroundColor: "#eaeaea",
          }}
          onChange={(e) => setInputNameValue(e.target.value)}
          onBlur={handleTitleBlur}
          value={inputNameValue}
        />
        <ProjectCardTag
          className="project-card-tag"
          src={rectangle}
          alt={rectangle}
        />
        <CommonTextArea
          $dynamicWidth="97%"
          placeholder="프로젝트 소개를 입력해주세요"
          style={{
            position: "absolute",
            top: "10px",
            left: "6px",
            height: "85px",
            fontSize: "0.9rem",
          }}
          onChange={(e) => setInputIntroValue(e.target.value)}
          onBlur={handleIntroBlur}
          onFocus={handleIntroFocus}
          value={inputIntroValue}
        />
      </ProjectCardInfo>
    </ProjectCardUnit>
  );
}
