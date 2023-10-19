import React, { useState, KeyboardEvent } from "react";
import styled from "styled-components";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "../../firebaseSDK";
import rectangle from "../../assets/images/Rectangle.svg";

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
  margin: 0px 20px;
  overflow: hidden;
`;
const ProjectCardBgImg = styled.a<Props>`
  background-image: url(${(props) =>
    props.$dynamic_url ? props.$dynamic_url : "none"});
  display: inline-block;
  width: 400px;
  min-width: 230px;
  height: 226px;
  position: relative;
  background-repeat: no-repeat;
  background-size: cover;
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
  cursor: pointer;
`;
const ProjectCardNameInput = styled.input`
  position: absolute;
  top: -28px;
  z-index: 1;
  left: 30px;
  width: 160px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: 700;
  border: none;
  -webkit-border-radius: 4px;
  padding: 0 8px;
  background: #fafafa;
  margin: 2px;
`;

const ProjectCardIntro = styled.p`
  margin: -20px 20px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  cursor: pointer;
`;

const ProjectCardIntroInput = styled.input`
  margin: -20px 20px;
  width: 100%;
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
  const [isNameChangeable, setIsNameChangeable] = useState(false);
  const [isIntroChangeable, setIsIntroChangeable] = useState(false);
  const [inputNameValue, setInputNameValue] = useState(projectName);
  const [inputIntroValue, setInputIntroValue] = useState(projectIntro);

  const handleNameChangeable = () => {
    setIsNameChangeable(!isNameChangeable);
  };
  const handleInputChangeable = () => {
    setIsIntroChangeable(!isIntroChangeable);
  };

  const handleEnterPress = async (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const docRef = doc(db, "project", projectId);
      await updateDoc(docRef, {
        name: inputNameValue,
        project_intro: inputIntroValue,
        modified_date: serverTimestamp(),
      });
      if (isNameChangeable) {
        handleNameChangeable();
      } else if (isIntroChangeable) {
        handleInputChangeable();
      }
    }
  };

  return (
    <ProjectCardUnit>
      <ProjectCardBgImg $dynamic_url={projectImgUrl} href={projectId}>
        {}
      </ProjectCardBgImg>
      <ProjectCardInfo className="project-card-info">
        {isNameChangeable ? (
          <ProjectCardNameInput
            value={inputNameValue}
            onChange={(e) => setInputNameValue(e.target.value)}
            onKeyDown={handleEnterPress}
          />
        ) : (
          <ProjectCardName onClick={handleNameChangeable}>
            {inputNameValue || "제목을 입력해주세요"}
          </ProjectCardName>
        )}
        <ProjectCardTag
          className="project-card-tag"
          src={rectangle}
          alt={rectangle}
        />
        {isIntroChangeable ? (
          <ProjectCardIntroInput
            value={inputIntroValue}
            onChange={(e) => setInputIntroValue(e.target.value)}
            onKeyDown={handleEnterPress}
          />
        ) : (
          <ProjectCardIntro onClick={handleInputChangeable}>
            {inputIntroValue || "프로젝트 소개를 입력해주세요"}
          </ProjectCardIntro>
        )}
      </ProjectCardInfo>
    </ProjectCardUnit>
  );
}
