import React, { useState } from "react";
import { styled } from "styled-components";
import { useRecoilValue } from "recoil";
import userData from "../recoil/atoms/login/userDataState";

import { ReactComponent as headerLogo } from "../assets/logo/headerLogo.svg";

// 모달 아이콘
import memberIcon from "../assets/icons/headerMemberIcon.svg";
import bookmarkIcon from "../assets/icons/headerBookmarkIcon.svg";
import tutorialIcon from "../assets/icons/headerInfoIcon.svg";
import logIcon from "../assets/icons/headerBellIcon.svg";

// 모달
import ProjectMember from "./modal/ProjectMemberModal";
import BookMark from "./modal/BookMarkModal";
import Tutorial from "./modal/TutorialModal";
import Log from "./modal/LogModal";
import UserProfile from "./modal/UserProfileModal";

// 모달 공통 컴포넌트
import ModalCommon from "./layout/ModalCommonLayout";
import headerState from "../recoil/atoms/header/headerState";

const HeaderLayout = styled.div`
  height: 3rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0rem 1rem 0rem 1rem;
  border-bottom: 1.5px solid #ebebeb;
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

const HeaderLogo = styled(headerLogo)`
  height: 1.8rem;
`;

const modals = [
  {
    key: "member",
    icon: <img style={{ width: "1.5rem" }} src={memberIcon} alt="modalIcon" />,
    type: "project",
    content: <ProjectMember />,
  },
  {
    key: "bookmark",
    icon: (
      <img style={{ width: "1.5rem" }} src={bookmarkIcon} alt="modalIcon" />
    ),
    type: "project",
    content: <BookMark />,
  },
  {
    key: "tutorial",
    icon: (
      <img style={{ width: "1.5rem" }} src={tutorialIcon} alt="modalIcon" />
    ),
    type: "list",
    content: <Tutorial />,
  },
  {
    key: "log",
    icon: <img style={{ width: "1.5rem" }} src={logIcon} alt="modalIcon" />,
    type: "project",
    content: <Log />,
  },
  {
    key: "profile",
    icon: "userProfile",
    type: "list",
    content: <UserProfile />,
  },
];

export default function Header() {
  const currentHeaderState = useRecoilValue(headerState);

  const userDataState = useRecoilValue(userData);
  const { profile_img_URL: profileImgUrl }: any = userDataState.userData;
  const [selectedModal, setSelectedModal] = useState(-1);

  const listPageModals = modals.filter(
    (modal) => modal.type === currentHeaderState,
  );

  const handleClick = (idx: number) => {
    setSelectedModal(idx);
  };

  return (
    <HeaderLayout>
      <HeaderLogo />
      <HeaderIconBox>
        {(currentHeaderState === "list" ? listPageModals : modals).map(
          (modal, index) => (
            <HeaderModalBox key={modal.key} onClick={() => handleClick(index)}>
              <ModalCommon modalSelected={selectedModal} modalIndex={index}>
                <>
                  {modal.icon === "userProfile" ? (
                    <img
                      style={{
                        width: "2rem",
                        height: "2rem",
                        objectFit: "cover",
                        borderRadius: "50%",
                      }}
                      src={profileImgUrl}
                      alt="modalIcon"
                    />
                  ) : (
                    modal.icon
                  )}
                  {modal.content}
                </>
              </ModalCommon>
            </HeaderModalBox>
          ),
        )}
      </HeaderIconBox>
    </HeaderLayout>
  );
}
