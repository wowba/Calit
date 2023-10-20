import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { styled } from "styled-components";
import ShrikhandRegular from "../assets/fonts/Shrikhand-Regular.ttf";

// 모달
import ProjectMember from "./modal/ProjectMemberModal";
import BookMark from "./modal/BookMarkModal";
import Tutorial from "./modal/TutorialModal";
import Log from "./modal/LogModal";
import UserProfile from "./modal/UserProfileModal";

// 모달 공통 컴포넌트
import ModalCommon from "./layout/ModalCommonLayout";

const HeaderLayout = styled.div`
  height: 9vh;
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

  div:not(:last-of-type) {
    margin-right: 1rem;
  }
  img:hover {
    cursor: pointer;
  }
`;

const modals = [
  <ProjectMember />,
  <BookMark />,
  <Tutorial />,
  <Log />,
  <UserProfile />,
];

export default function Header() {
  const location = useLocation();
  // const [selectedIcon, setSelectedIcon] = useState("");
  const [selectedModal, setSelectedModal] = useState<number>();
  let pageType = "list";
  if (location.pathname !== "/") {
    pageType = "project";
  }

  const clickModal = (idx: number) => {
    setSelectedModal(idx);
    console.log(idx, selectedModal);
  };

  // const selectModal = (idx: number) => idx;

  // const selectModal = (idx: number) => {
  //   setSelectedModal(idx);
  //   return selectedModal;
  // };

  // const handleClick = (data: any) => {
  //   const modalData = data;
  //   setSelectedIcon(modalData.name);
  // };

  // const handleModal = (idx: number) => {
  //   console.log("input", idx);
  //   console.log("before", selectedModal);
  //   setSelectedModal(idx);
  //   console.log("after", selectedModal);
  // };

  return (
    <HeaderLayout>
      <HeaderLogoParagraph>Calit!</HeaderLogoParagraph>
      <HeaderIconBox>
        {pageType === "list" ? (
          <div>1</div>
        ) : (
          // ? icons
          //     .filter((icon) => icon.type.includes(pageType))
          //     .map((icon, index) => (
          //       <ModalCommon
          //         key={icon.name}
          //         modalIndex={index}
          //         modalName={icon.name}
          //         modalIcon={icon.route}
          //         modalSelected={selectedIcon}
          //       >
          //         <button
          //           type="button"
          //           key={icon.name}
          //           onClick={() => handleClick(icon)}
          //         >
          //           <img src={icon.route} alt={icon.name} />
          //         </button>
          //       </ModalCommon>
          //     ))
          modals.map((modal, index) => (
            <ModalCommon modalSelected={selectedModal} modalIndex={index}>
              <div onClick={() => clickModal(index)} aria-hidden="true">
                {modal}
              </div>
            </ModalCommon>

            // <ModalCommon
            //   key={modal.name}
            //   modalIndex={index}
            //   modalName={modal.name}
            //   modalmodal={modal.route}
            //   modalSelected={selectedIcon}
            // >
            //   <button
            //     type="button"
            //     key={icon.name}
            //     onClick={() => handleClick(icon)}
            //   >
            //     <img src={icon.route} alt={icon.name} />
            //   </button>
            // </ModalCommon>
          ))
        )}
      </HeaderIconBox>
    </HeaderLayout>
  );
}
