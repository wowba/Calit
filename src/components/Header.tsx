import React, { useState } from "react";
import { styled } from "styled-components";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";

import userData from "../recoil/atoms/login/userDataState";
import { ReactComponent as headerLogo } from "../assets/logo/headerLogo.svg";

// 헤더 아이콘
import logoutIcon from "../assets/headerIcon/logout.svg";
// import tutorialIcon from "../assets/headerIcon/tutorial.svg";
import bookmarkIcon from "../assets/headerIcon/bookmark.svg";
import memberIcon from "../assets/headerIcon/member.svg";
// import logIcon from "../assets/headerIcon/log.svg"

// 모달
import ProjectMember from "./modal/ProjectMemberModal";
import BookMark from "./modal/BookMarkModal";
// import Tutorial from "./modal/TutorialModal";
import UserProfile from "./modal/UserProfileModal";
// import Log from "./modal/LogModal";

// 모달 공통 컴포넌트
import ModalCommon from "./layout/ModalCommonLayout";
import headerState from "../recoil/atoms/header/headerState";
import userListState from "../recoil/atoms/userList/userListState";
import loginState from "../recoil/atoms/login/loginState";
import { auth } from "../firebaseSDK";

interface Props {
  $whichPage?: string;
}
const HeaderLayout = styled.div<Props>`
  height: 3rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${(props) =>
    props.$whichPage === "list" ? " 0rem 124px" : "0rem 1rem"};
  border-bottom: ${(props) => props.theme.Border.thickBorder};
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
    icon: <img style={{ height: "1.5rem" }} src={memberIcon} alt="modalIcon" />,
    content: <ProjectMember />,
  },
  {
    key: "bookmark",
    icon: (
      <img style={{ height: "1.5rem" }} src={bookmarkIcon} alt="modalIcon" />
    ),
    content: <BookMark />,
  },
  // {
  //   key: "tutorial",
  //   icon: (
  //     <img style={{ width: "1.5rem" }} src={tutorialIcon} alt="modalIcon" />
  //   ),
  //   content: <Tutorial />,
  // },
  // {
  //   key: "log",
  //   icon: <img style={{ width: "1.5rem" }} src={logIcon} alt="modalIcon" />,
  //   content: <Log />,
  // },
  {
    key: "profile",
    icon: "userProfile",
    content: <UserProfile />,
  },
];

const listPageModals = [
  // {
  //   key: "tutorial",
  //   icon: (
  //     <img style={{ width: "1.5rem" }} src={tutorialIcon} alt="modalIcon" />
  //   ),
  //   content: <Tutorial />,
  // },
  {
    key: "logout",
    icon: <img style={{ width: "1.5rem" }} src={logoutIcon} alt="logout" />,
    content: null,
  },
];

export default function Header() {
  const currentHeaderState = useRecoilValue(headerState);

  const [selectedModal, setSelectedModal] = useState(-1);
  const navigate = useNavigate();

  const setLoginState = useSetRecoilState(loginState);
  const [userDataState, setUserDataState] = useRecoilState(userData);
  const { email: loginEmail }: any = userDataState.userData;
  const userListData = useRecoilValue(userListState);

  const handleClick = (idx: number) => {
    setSelectedModal(idx);
  };

  const handleLogoutBtnClick = () => {
    setLoginState({
      isLogin: false,
      userCredential: {},
    });
    setUserDataState({
      userDataState: {},
    });
    navigate("/login");
    signOut(auth);
  };

  return (
    <HeaderLayout $whichPage={currentHeaderState}>
      <HeaderLogo onClick={() => navigate("/")} />
      <HeaderIconBox>
        {(currentHeaderState === "list" ? listPageModals : modals).map(
          (modal, index) => (
            <HeaderModalBox
              key={modal.key}
              onClick={
                modal.key === "logout"
                  ? handleLogoutBtnClick
                  : () => handleClick(index)
              }
            >
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
