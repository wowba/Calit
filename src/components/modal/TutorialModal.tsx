import React, { useEffect, useState } from "react";
import { styled } from "styled-components";
import CommonPaginationLayout from "../layout/CommonPaginationLayout";

const TutorialTextContent = styled.div`
  white-space: pre-line;
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

const TutorialTextTitle = styled.p`
  font-size: 1.1rem;
  font-weight: 900;
  margin-bottom: 10px;
`;

const TutorialTextParagraph = styled.p`
  white-space: pre-line;
  text-align: left;
  max-height: 10rem;
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

const TutorialButtonBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const TutorialExitButton = styled.button`
  bottom: 1rem;
  height: fit-content;
  border-radius: 7px;
  padding: 5px 10px;
  margin: 0;
  background: #7064ff;
  color: white;
  font-size: 1rem;
`;

const ModalContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
`;

const ModalText = styled.div`
  background: white;
  width: 400px;
  min-height: 20rem;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
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

interface Props {
  isShowTutorial: boolean;
  setIsShowTutorial: React.Dispatch<React.SetStateAction<boolean>>;
}
export default function Tutorial({ isShowTutorial, setIsShowTutorial }: Props) {
  const projectId = window.location.pathname.substring(1);
  const tutorialTarget = !projectId
    ? TUTORIAL_LIST_TEXT
    : TUTORIAL_PROJECT_TEXT;

  const handleCloseBtn = () => {
    setIsShowTutorial(false);
  };

  const [posts, setPosts] = useState<object[]>([]);
  const [page, setPage] = useState(1);
  const offset = page - 1;

  useEffect(() => {
    setPosts(tutorialTarget);
  }, []);

  return isShowTutorial ? (
    <ModalContainer>
      <ModalText>
        {posts.slice(offset, page).map((singleElement: any) => (
          <TutorialTextContent key={singleElement.key}>
            <TutorialTextTitle>{singleElement.key}</TutorialTextTitle>
            <TutorialTextParagraph>
              {singleElement.content}
            </TutorialTextParagraph>
          </TutorialTextContent>
        ))}
        <TutorialButtonBox>
          <CommonPaginationLayout
            total={posts.length}
            page={page}
            setPage={setPage}
          />
          <TutorialExitButton onClick={handleCloseBtn}>
            나가기
          </TutorialExitButton>
        </TutorialButtonBox>
      </ModalText>
    </ModalContainer>
  ) : null;
}
