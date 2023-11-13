import React, { useEffect, useRef, useState } from "react";
import styled, { css } from "styled-components";
import CommonPaginationLayout from "../../../components/layout/CommonPaginationLayout";
import { ModalTitle } from "../../../components/layout/ModalCommonLayout";

const CalendarTutorialModalLayout = styled.div<{ $isShow: boolean }>`
  position: absolute;

  top: 17rem;
  left: calc(100% - 14rem);
  transform: translate(-50%, -50%);

  width: 26.3rem;
  height: auto;
  border-radius: 7px;
  box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.3);
  background-color: white;
  padding: 2.5rem 2.5rem 2.5rem 2.5rem;

  z-index: 999;

  ${(props) =>
    !props.$isShow &&
    css`
      display: none;
    `}
`;

const TutorialTextBox = styled.div`
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

interface Props {
  isShow: boolean;
  setIsShow: React.Dispatch<React.SetStateAction<boolean>>;
}

const TUTORIAL_CALENDER_TEXT = [
  {
    key: "프로젝트 캘린더",
    content: `프로젝트의 캘린더 안에서는 현재 진행중인 칸반 보드들을 확인할 수 있습니다.

    상단 중앙의 < > 아이콘을 선택해 월 단위의 이동이 가능하고, 좌측 상단의 오늘 버튼을 통해 현재 날짜로 돌아올 수 있습니다.`,
  },
  {
    key: "칸반 보드란?",
    content:
      "칸반 보드는 작업을 시각화하고, 진행 중인 작업을 제한하며 효율성(또는 흐름)를 최대화하는 애자일 프로젝트 관리 도구입니다. ",
  },
  {
    key: "칸반 보드 만들기",
    content: `달력의 현재 월 안에서 원하는 일정만큼 드래그해 칸반 생성 모달을 열 수 있습니다.

    칸반 생성 모달에서는 칸반의 이름, 색상, 시작일과 종료일, 그리고 담당자를 지정할 수 있습니다.
    `,
  },
  {
    key: "칸반 보드 꾸미기",
    content: `각 칸반 보드에 마우스를 올려 나타나는 롤러 아이콘을 선택해 칸반의 색상을 변경할 수 있습니다.`,
  },
  {
    key: "칸반 보드 일정 조정하기",
    content: `캘린더 내에서 칸반을 다른 날짜로 드래그하거나, 칸반 보드의 우측 테두리에 마우스를 올리면 나타나는 -> 포인터를 통해 진행중인 칸반 보드의 일정을 수정할 수 있습니다. `,
  },
];

export default function CalendarTutorialModal(props: Props) {
  const { isShow, setIsShow } = props;
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [posts, setPosts] = useState<object[]>([]);
  const [page, setPage] = useState(1);
  const offset = page - 1;

  useEffect(() => {
    setPosts(TUTORIAL_CALENDER_TEXT);
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent): void {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setIsShow(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  return (
    <CalendarTutorialModalLayout ref={wrapperRef} $isShow={isShow}>
      <ModalTitle>Calendar Tutorial</ModalTitle>
      <TutorialTextBox>
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
      </TutorialTextBox>
    </CalendarTutorialModalLayout>
  );
}
