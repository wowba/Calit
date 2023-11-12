import React, { useState } from "react";
import { styled } from "styled-components";
import { useRecoilValue } from "recoil";
import { useNavigate } from "react-router-dom";
import userData from "../recoil/atoms/login/userDataState";

import { ReactComponent as headerLogo } from "../assets/logo/headerLogo.svg";

// 모달 아이콘
import memberIcon from "../assets/icons/headerMemberIcon.svg";
import bookmarkIcon from "../assets/icons/headerBookmarkIcon.svg";
import tutorialIcon from "../assets/icons/headerInfoIcon.svg";
// import logIcon from "../assets/icons/headerBellIcon.svg";

// 모달
import ProjectMember from "./modal/ProjectMemberModal";
import BookMark from "./modal/BookMarkModal";
import Tutorial from "./modal/TutorialModal";
// import Log from "./modal/LogModal";
import UserProfile from "./modal/UserProfileModal";

// 모달 공통 컴포넌트
import ModalCommon from "./layout/ModalCommonLayout";
import headerState from "../recoil/atoms/header/headerState";
import userListState from "../recoil/atoms/userList/userListState";

interface Props {
  $whichPage?: string;
}
const HeaderLayout = styled.div<Props>`
  height: 3rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${(props) =>
    props.$whichPage === "list" ? " 0rem calc(6rem + 20px)" : "0rem 1rem"};
  border-bottom: 1.5px solid #ebebeb;
  transition: padding 0.8s ease;
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
  cursor: pointer;
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
  // {
  //   key: "log",
  //   icon: <img style={{ width: "1.5rem" }} src={logIcon} alt="modalIcon" />,
  //   type: "project",
  //   content: <Log />,
  // },
  {
    key: "profile",
    icon: "userProfile",
    type: "project",
    content: <UserProfile />,
  },
];

export default function Header() {
  const currentHeaderState = useRecoilValue(headerState);

  const userDataState = useRecoilValue(userData);
  const { email: loginEmail }: any = userDataState.userData;
  const userListData = useRecoilValue(userListState);

  const [selectedModal, setSelectedModal] = useState(-1);
  const navigate = useNavigate();

  const listPageModals = modals.filter(
    (modal) => modal.type === currentHeaderState,
  );

  const handleClick = (idx: number) => {
    setSelectedModal(idx);
  };

  return (
    <HeaderLayout $whichPage={currentHeaderState}>
      <HeaderLogo onClick={() => navigate("/")} />
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
                      src={userListData.get(loginEmail).profile_img_URL}
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
