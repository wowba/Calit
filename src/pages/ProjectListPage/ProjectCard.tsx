import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";

import { db } from "../../firebaseSDK";
import CommonInputLayout from "../../components/layout/CommonInputLayout";
import defaultProjectImg from "../../assets/images/deafultProjectImg.jpg";
import dots from "../../assets/icons/dots.svg";
import ProjectCardMoreModal from "./ProjectCardMoreModal";

interface Props {
  $dynamic_url?: string;
}

const ProjectCardUnit = styled.div`
  min-width: 230px;
  height: 226px;
  border: ${(props) => props.theme.Border.thinBorder};

  border-radius: ${(props) => props.theme.Br.default};
  position: relative;
  margin: 0 20px 20px 20px;
  overflow: hidden;
  transition:
    box-shadow 0.7s,
    border 0.7s;
  &:hover {
    cursor: pointer;
    box-shadow: ${(props) => props.theme.Bs.default};
    -webkit-box-shadow: ${(props) => props.theme.Bs.default};
    -moz-box-shadow: ${(props) => props.theme.Bs.default};
    border: 1px solid #c9c9c9;
  }
`;

const ProjectCardBgImg = styled.img<Props>`
  width: 100%;
  height: 100%;
`;

export default function ProjectCard({
  projectId,
  projectImgUrl,
  projectName,
  fetchProjectData,
  creater,
}: any) {
  const navigate = useNavigate();
  const [inputNameValue, setInputNameValue] = useState(projectName);

  const [isProjectCardMoreModalShow, setIsProjectCardMoreModalShow] =
    useState(false);

  const handleTitleBlur = async () => {
    if (inputNameValue) {
      const docRef = doc(db, "project", projectId);
      await updateDoc(docRef, {
        name: inputNameValue,
        modified_date: serverTimestamp(),
      });
    }
  };

  const dynamicUrl = projectImgUrl || defaultProjectImg;

  return (
    <div style={{ position: "relative" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          margin: "0 32px 0 24px",
        }}
      >
        <CommonInputLayout
          $dynamicWidth="calc(100% - 2rem)"
          $dynamicHeight="2rem"
          $dynamicPadding="2px 4px"
          placeholder="제목을 입력해주세요"
          maxLength={20}
          style={{
            fontWeight: "900",
          }}
          onChange={(e) => setInputNameValue(e.target.value)}
          onBlur={handleTitleBlur}
          value={inputNameValue}
        />
        <button
          type="button"
          onClick={() => setIsProjectCardMoreModalShow(true)}
        >
          <img src={dots} alt="more" />
        </button>
      </div>

      <ProjectCardUnit
        onClick={() => {
          navigate(`/${projectId}`);
        }}
      >
        <ProjectCardBgImg src={dynamicUrl} alt="project img" />
      </ProjectCardUnit>
      <ProjectCardMoreModal
        isShow={isProjectCardMoreModalShow}
        setIsShow={setIsProjectCardMoreModalShow}
        projectId={projectId}
        fetchProjectData={fetchProjectData}
        creater={creater}
      />
    </div>
  );
}
