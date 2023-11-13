import React, { useEffect, useState } from "react";
import { styled } from "styled-components";
import { ModalArea, ModalTitle } from "../layout/ModalCommonLayout";
import CommonPaginationLayout from "../layout/CommonPaginationLayout";

const TutorialTextLayout = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 20rem;
`;
const TutorialTextContent = styled.div`
  white-space: pre-line;
  max-height: 15rem;
  overflow: scroll;

  &::-webkit-scrollbar {
    width: 8px;
    overflow-y: scroll;
    border-radius: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.3);
    border-radius: 6px;
  }
  &::-webkit-scrollbar-corner {
    background-color: transparent;
  }
`;
const TutorialTextParagraph = styled.p`
  font-size: 1.1rem;
  font-weight: 900;
  margin-bottom: 10px;
`;

const TUTORIAL_LIST_TEXT = [
  { key: "Calit?", content: "세상에서 가장 쉬운 협업 툴 Calit!" },
  {
    key: "프로젝트 만들기",
    content: "하단의 + 버튼을 통해 프로젝트 추가가 가능합니다.",
  },
  {
    key: "프로젝트 공유하기",
    content: `프로젝트 카드 우측 상단의 클립보드 아이콘을 선택해 해당 프로젝트의 주소를 공유할 수 있습니다.`,
  },
  {
    key: "프로젝트 삭제하기",
    content:
      "자신이 생성한 프로젝트인 경우, 프로젝트 카드 우측 상단의 톱니바퀴 아이콘을 선택해 프로젝트의 배경 이미지를 변경하거나, 프로젝트를 삭제할 수 있습니다.",
  },
  {
    key: "프로젝트 참여하기",
    content:
      "공유받은 링크를 주소창에 바로 입력하거나, 초대링크로 입장 버튼을 클릭한 뒤 붙여넣어 프로젝트에 참여할 수 있습니다.",
  },
];

const TUTORIAL_PROJECT_TEXT = [
  {
    key: "프로젝트 멤버 모달",
    content: `프로젝트에 참여중인 사용자들의 정보를 확인할 수 있습니다.
      초대하기 버튼을 선택해 프로젝트에 새로운 사용자를 초대할 수 있습니다.
      프로젝트를 생성한 사용자는 내보내기 버튼을 통해 사용자를 프로젝트에서 내보낼 수 있습니다.`,
  },
  {
    key: "북마크 모달",
    content: `URL을 입력해 북마크를 등록할 수 있습니다.
      북마크는 프로젝트 단위로 공유되기 때문에, 프로젝트에 참여중인 모든 사용자가 확인하고 추가하거나 제거할 수 있습니다.`,
  },
  {
    key: "프로필 모달",
    content:
      "프로필 이미지, 사용자 이름, 사용자 소개 글의 편집 및 로그아웃이 가능합니다.",
  },
];

const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
  // 모달 컴포넌트 영역 클릭시 클릭 이벤트가 부모로 전달되어 컴포넌트가 닫히는 현상 수정
  event.stopPropagation();
};

export default function Tutorial() {
  const projectId = window.location.pathname.substring(1);
  const tutorialTitle = !projectId ? "List" : "Project";
  const tutorialTarget = !projectId
    ? TUTORIAL_LIST_TEXT
    : TUTORIAL_PROJECT_TEXT;

  const [posts, setPosts] = useState<object[]>([]);
  const [page, setPage] = useState(1);
  const offset = page - 1;

  useEffect(() => {
    setPosts(tutorialTarget);
  }, []);

  return (
    <ModalArea $dynamicWidth="" $dynamicHeight="auto" onClick={handleClick}>
      <ModalTitle>{`${tutorialTitle} Tutorial`}</ModalTitle>
      <TutorialTextLayout>
        {posts.slice(offset, page).map((singleElement: any) => (
          <TutorialTextContent key={singleElement.key}>
            <TutorialTextParagraph>{singleElement.key}</TutorialTextParagraph>
            {singleElement.content}
          </TutorialTextContent>
        ))}
        <CommonPaginationLayout
          total={posts.length}
          page={page}
          setPage={setPage}
        />
      </TutorialTextLayout>
    </ModalArea>
  );
}
