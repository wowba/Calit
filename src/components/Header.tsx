import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { styled } from "styled-components";
import ShrikhandRegular from "../assets/fonts/Shrikhand-Regular.ttf";

// 모달 아이콘
import memberIcon from "../assets/icons/headerMemberIcon.svg";
import bookmarkIcon from "../assets/icons/headerBookmarkIcon.svg";
import tutorialIcon from "../assets/icons/headerInfoIcon.svg";
import logIcon from "../assets/icons/headerBellIcon.svg";
import profileIcon from "../assets/icons/headerProfileSampleIcon.svg";

// 모달
import ProjectMember from "./modal/ProjectMemberModal";
import BookMark from "./modal/BookMarkModal";
import Tutorial from "./modal/TutorialModal";
import Log from "./modal/LogModal";
import UserProfile from "./modal/UserProfileModal";

// 모달 공통 컴포넌트
import ModalCommon from "./layout/ModalCommonLayout";

const HeaderLayout = styled.div`
  height: 4rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0rem 1rem 0rem 1rem;
  border-bottom: 1px solid #000000;
`;

const HeaderLogoParagraph = styled.p`
  @font-face {
    font-family: "ShrikhandRegular";
    src: local("ShrikhandRegular"), url(${ShrikhandRegular});
  }

  font-family: "ShrikhandRegular";
  font-weight: 500;
  font-size: 2rem;
`;

const HeaderIconBox = styled.div`
  display: flex;
  align-items: center;
  height: 100%;

  > div:not(:last-of-type) {
    margin-right: 1rem;
  }
  img:hover {
    cursor: pointer;
  }
`;

const HeaderModalBox = styled.div`
  height: 100%;
`;

const modals = [
  {
    icon: memberIcon,
    type: "project",
    content: <ProjectMember />,
  },
  {
    icon: bookmarkIcon,
    type: "project",
    content: <BookMark />,
  },
  {
    icon: tutorialIcon,
    type: "list",
    content: <Tutorial />,
  },
  {
    icon: logIcon,
    type: "project",
    content: <Log />,
  },
  {
    icon: profileIcon,
    type: "list",
    content: <UserProfile />,
  },
];

export default function Header() {
  const location = useLocation();
  const [selectedModal, setSelectedModal] = useState(-1);
  let pageType = "list";
  if (location.pathname !== "/") {
    pageType = "project";
  }
  const listPageModals = modals.filter((modal) => modal.type === pageType);

  const handleClick = (idx: number) => {
    setSelectedModal(idx);
  };

  return (
    <HeaderLayout>
      <HeaderLogoParagraph>Calit!</HeaderLogoParagraph>
      <HeaderIconBox>
        {(pageType === "list" ? listPageModals : modals).map((modal, index) => (
          <HeaderModalBox key={modal.icon} onClick={() => handleClick(index)}>
            <ModalCommon modalSelected={selectedModal} modalIndex={index}>
              <>
                {modal.icon}
                {modal.content}
              </>
            </ModalCommon>
          </HeaderModalBox>
        ))}
      </HeaderIconBox>
    </HeaderLayout>
  );
}
