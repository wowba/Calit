import React, { useEffect, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import Swal from "sweetalert2";
import { styled } from "styled-components";
import headerState from "../../recoil/atoms/header/headerState";
import tutorialCalendarState from "../../recoil/atoms/tutorial/tutorialCalendarState";
import tutorialState from "../../recoil/atoms/tutorial/tutorialState";
import CommonPaginationLayout from "../layout/CommonPaginationLayout";

const TutorialTextContent = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
`;

const TutorialTextTitle = styled.p`
  font-size: 1.1rem;
  font-weight: 900;
  margin-bottom: 10px;
`;

const TutorialTextParagraph = styled.p`
  height: 100%;
  display: flex;
  align-items: center;
  text-align: left;
  white-space: pre-line;
  word-break: keep-all;
  padding-left: 0.5rem;
  font-size: ${(props) => props.theme.Fs.default};
`;

const TutorialButtonBox = styled.div`
  display: flex;
  justify-content: space-around;
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
  font-size: ${(props) => props.theme.Fs.default};
  &:hover {
    background-color: ${(props) => props.theme.Color.hoverColor};
  }
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
  height: 20rem;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
`;

const TUTORIAL_LIST_TEXT = [
  {
    key: "프로젝트?",
    content: `Calit은 프로젝트를 통한 애자일 협업 툴입니다. 

    간편하게 프로젝트를 만들고, 팀원들을 초대해 업무를 시작해보세요!`,
  },
  {
    key: "프로젝트에 참여하기",
    content: `공유받은 프로젝트 링크를 주소창에 바로 입력하거나, 초대링크로 입장 버튼을 선택하고서 붙여넣어 프로젝트에 참여할 수 있습니다.`,
  },
  {
    key: "프로젝트 다루기",
    content:
      "자신이 생성한 프로젝트인 경우, 프로젝트 우측 상단의 더 보기 아이콘을 선택해 프로젝트의 배경 이미지를 변경하거나, 프로젝트를 삭제할 수 있습니다.",
  },
];

const TUTORIAL_PROJECT_TEXT = [
  {
    key: "프로젝트 멤버",
    content: `상단 우측의 멤버 아이콘을 통해 프로젝트에 참여중인 팀원을 확인할 수 있습니다.

      gmail을 통해 새로운 사용자를 초대할 수 있고, 자신이 생성한 프로젝트라면 팀원을 프로젝트에서 내보낼 수 있습니다.`,
  },
  {
    key: "북마크",
    content: `상단 우측의 북마크 아이콘을 통해 북마크를 등록할 수 있습니다. 
    
    프로젝트에 필요한 링크를 자유롭게 관리해보세요!`,
  },
  {
    key: "프로필",
    content: `상단 우측의 프로필 아이콘을 통해 자신의 프로필을 편집하고, 로그아웃하거나 진행중인 프로젝트에서 나갈 수 있습니다.`,
  },
  {
    key: "캘린더 & 사이드바",
    content: `캘린더에서 칸반을 생성하고, 드래그해 일정을 변경할 수 있습니다. 이름과 담당자를 지정해 팀원들에게 업무를 할당해보세요!

    좌측의 사이드바에서는 프로젝트 정보와 최근 방문한 칸반 보드를 확인할 수 있습니다.`,
  },
  {
    key: "칸반 보드 & 투두",
    content: `칸반 보드에서는 스테이지를 활용해 분업 및 협업을 진행하고, 진행 상황에 대한 모니터링을 할 수 있습니다.

    투두에서는 진행할 업무에 대한 상세한 설정이 가능합니다. 
    업데이트되는 업무 진행사항을 마크다운 에디터를 통해 기록해보세요!
    `,
  },
];

interface Props {
  isShowTutorial: boolean;
  setIsShowTutorial: React.Dispatch<React.SetStateAction<boolean>>;
  isTutorialRestoreClick: boolean;
  setIsTutorialRestoreClick: React.Dispatch<React.SetStateAction<boolean>>;
}
export default function Tutorial({
  isShowTutorial,
  setIsShowTutorial,
  isTutorialRestoreClick,
  setIsTutorialRestoreClick,
}: Props) {
  const projectId = window.location.pathname.substring(1);
  const tutorialTarget = !projectId
    ? TUTORIAL_LIST_TEXT
    : TUTORIAL_PROJECT_TEXT;
  const currentHeaderState = useRecoilValue(headerState);
  const setMainTutorialState = useSetRecoilState(tutorialState);
  const setCalendarTutorialState = useSetRecoilState(tutorialCalendarState);
  const mainTutorialData = useRecoilValue(tutorialState).isMainTutorial;
  const calendarTutorialData = useRecoilValue(
    tutorialCalendarState,
  ).isCalendarTutorial;
  const [isTutorialDataShow, setIsTutorialDataShow] = useState(false); // 튜토리얼 데이터 state
  const targetName = currentHeaderState === "list" ? "Calit" : "프로젝트";

  const [posts, setPosts] = useState<object[]>([]);
  const [page, setPage] = useState(1);
  const offset = page - 1;

  // 튜토리얼 안내 문구 세팅
  const fetchTutorialData = () => {
    const targetData =
      currentHeaderState === "list" ? mainTutorialData : calendarTutorialData;
    if (!targetData) {
      Swal.fire({
        icon: "info",
        title: `${targetName}에 오신 것을 환영합니다!`,
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
        confirmButtonText: "튜토리얼 보기",
        confirmButtonColor: "#7064FF",
      }).then((result) => {
        // 튜토리얼 보기 선택
        if (result.isConfirmed) {
          setPage(1); // 첫 페이지로 초기화
          setIsTutorialDataShow(true);
        }
        setIsShowTutorial(false);
      });
    }
  };

  // 튜토리얼 다시 보기
  const handleRestoreTutorial = () => {
    Swal.fire({
      icon: "question",
      title: `튜토리얼을 다시 보시겠습니까?`,
      confirmButtonText: "다시 보기",
      confirmButtonColor: "#7064FF",
      cancelButtonText: "취소",
      cancelButtonColor: "#B0B0B0",
      showCancelButton: true,
      allowOutsideClick: false,
      allowEscapeKey: false,
      allowEnterKey: false,
    }).then((result) => {
      // 다시보기 버튼 선택
      if (result.isConfirmed) {
        setPage(1);
        setIsTutorialDataShow(true);
      }

      // 다시보기 버튼 state 초기화
      setIsTutorialRestoreClick(false);
    });
  };

  // 나가기 버튼을 통한 튜토리얼 다시보지 않기 처리
  const handleCloseBtn = () => {
    if (currentHeaderState === "list") {
      setMainTutorialState({
        isMainTutorial: true,
      });
    } else {
      setCalendarTutorialState({
        isCalendarTutorial: true,
      });
    }

    setIsTutorialDataShow(false);
    setIsShowTutorial(false);
  };

  useEffect(() => {
    // 튜토리얼에서 보여질 데이터 세팅
    setPosts(tutorialTarget);
  }, [currentHeaderState]);

  // 헤더에서 넘겨받은 state에 따라 튜토리얼 안내 문구 세팅
  useEffect(() => {
    if (isShowTutorial) {
      fetchTutorialData();
    }
  }, [isShowTutorial]);

  // 헤더에서 튜토리얼 다시 보기 버튼 선택시 동작
  useEffect(() => {
    if (isTutorialRestoreClick) {
      handleRestoreTutorial();
    }
  }, [isTutorialRestoreClick]);

  return isTutorialDataShow ? (
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
