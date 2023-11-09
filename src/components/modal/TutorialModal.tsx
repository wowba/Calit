import React from "react";
// import { styled } from "styled-components";
import { ModalArea, ModalTitle } from "../layout/ModalCommonLayout";

import TutorialText from "./TutorialText";

const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
  // 모달 컴포넌트 영역 클릭시 클릭 이벤트가 부모로 전달되어 컴포넌트가 닫히는 현상 수정
  event.stopPropagation();
};

// 프로젝트 리스트 페이지에서의 튜토리얼, 캘린더에서의 튜토리얼
// 소개, 입장, 생성, 삭제
// 멤버모달, 북마크모달, 프로필모달
export default function Tutorial() {
  const projectId = window.location.pathname.substring(1);
  const target = !projectId ? "List" : "Project";
  return (
    <ModalArea $dynamicWidth="" $dynamicHeight="auto" onClick={handleClick}>
      <ModalTitle>{`${target} Tutorial`}</ModalTitle>
      <TutorialText tutorialTarget={target} />
    </ModalArea>
  );
}
