import React from "react";
import { ModalArea } from "../layout/ModalCommonLayout";

const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
  // 모달 컴포넌트 영역 클릭시 클릭 이벤트가 부모로 전달되어 컴포넌트가 닫히는 현상 수정
  event.stopPropagation()
}

export default function Bookmark() {
  return (
    <ModalArea
      $dynamicWidth=""
      $dynamicHeight=""
      onClick={handleClick}
    >
      <div>BookMark</div>
    </ModalArea>
  );
}
