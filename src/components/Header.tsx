import React from "react";
import { styled } from "styled-components";
import { useLocation } from "react-router-dom";
import member from "../assets/icons/headerMemberIcon.svg";
import bookmark from "../assets/icons/headerBookmarkIcon.svg";
import info from "../assets/icons/headerInfoIcon.svg";
import bell from "../assets/icons/headerBellIcon.svg";
// 20231016 남현준
// 유저 프로필 아이콘 들어올 자리 - 현재는 샘플 이미지 넣음, 프로필 컴포넌트 구현시 유저 이미지 적용 예정
import profile from "../assets/icons/headerProfileSampleIcon.svg";
import ModalCommon from "./layout/ModalCommonLayout";

const HeaderBox = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0rem 1rem 0rem 1rem;
  border-bottom: 1px solid #000000;
`;

const HeaderLogoBox = styled.div`
  display: flex;
  align-items: center;

  @import url("https://fonts.googleapis.com/css2?family=Shrikhand&family=Ubuntu&display=swap");
  font-family: "Shrikhand", serif;
  font-style: italic;
  font-weight: bold;
  font-size: 2rem;
`;

const HeaderIconBox = styled.div`
  display: flex;
  align-items: center;
`;

const icons = [
  { name: "member", type: "project", logo: member, route: member },
  { name: "bookmark", type: "project", logo: bookmark, route: bookmark },
  { name: "info", type: "list", logo: info, route: info },
  { name: "bell", type: "project", logo: bell, route: bell },
  { name: "profile", type: "list", logo: profile, route: profile },
];

export default function Header() {
  const location = useLocation();
  let pageType = "list";
  if (location.pathname !== "/") {
    pageType = "project";
  }

  return (
    <HeaderBox>
      <HeaderLogoBox>Calit!</HeaderLogoBox>
      <HeaderIconBox>
        {pageType === "list"
          ? icons
              .filter((icon) => icon.type.includes(pageType))
              .map((icon) => (
                <ModalCommon modalName={icon.name} modalIcon={icon.route} />
              ))
          : icons.map((icon) => (
              <ModalCommon modalName={icon.name} modalIcon={icon.route} />
            ))}
      </HeaderIconBox>
    </HeaderBox>
  );
}
