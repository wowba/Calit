import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { styled } from "styled-components";
import ShrikhandRegular from "../assets/fonts/Shrikhand-Regular.ttf";
import member from "../assets/icons/headerMemberIcon.svg";
import bookmark from "../assets/icons/headerBookmarkIcon.svg";
import info from "../assets/icons/headerInfoIcon.svg";
import bell from "../assets/icons/headerBellIcon.svg";
// 20231016 남현준
// 유저 프로필 아이콘 들어올 자리 - 현재는 샘플 이미지 넣음, 프로필 컴포넌트 구현시 유저 이미지 적용 예정
import profile from "../assets/icons/headerProfileSampleIcon.svg";
import ModalCommon from "./layout/ModalCommonLayout";

const HeaderLayout = styled.div`
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

  button > img:not(:last-of-type) {
    padding-right: 1rem;
  }
  img:hover {
    cursor: pointer;
  }
`;

const icons = [
  {
    name: "member",
    type: "project",
    route: member,
  },
  {
    name: "bookmark",
    type: "project",
    route: bookmark,
  },
  {
    name: "info",
    type: "list",
    route: info,
  },
  {
    name: "bell",
    type: "project",
    route: bell,
  },
  {
    name: "profile",
    type: "list",
    route: profile,
  },
];

export default function Header() {
  const location = useLocation();
  const [selectedIcon, setSelectedIcon] = useState("");
  let pageType = "list";
  if (location.pathname !== "/") {
    pageType = "project";
  }

  const handleClick = (data: any) => {
    const modalData = data;
    setSelectedIcon(modalData.name);
  };

  return (
    <HeaderLayout>
      <HeaderLogoParagraph>Calit!</HeaderLogoParagraph>
      <HeaderIconBox>
        {pageType === "list"
          ? icons
              .filter((icon) => icon.type.includes(pageType))
              .map((icon, index) => (
                <ModalCommon
                  key={icon.name}
                  modalIndex={index}
                  modalName={icon.name}
                  modalIcon={icon.route}
                  modalSelected={selectedIcon}
                >
                  <button
                    type="button"
                    key={icon.name}
                    onClick={() => handleClick(icon)}
                  >
                    <img src={icon.route} alt={icon.name} />
                  </button>
                </ModalCommon>
              ))
          : icons.map((icon, index) => (
              <ModalCommon
                key={icon.name}
                modalIndex={index}
                modalName={icon.name}
                modalIcon={icon.route}
                modalSelected={selectedIcon}
              >
                <button
                  type="button"
                  key={icon.name}
                  onClick={() => handleClick(icon)}
                >
                  <img src={icon.route} alt={icon.name} />
                </button>
              </ModalCommon>
            ))}
      </HeaderIconBox>
    </HeaderLayout>
  );
}
