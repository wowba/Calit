import React from "react";
import { styled } from "styled-components";
import member from "../assets/icons/headerMemberIcon.svg";
import bookmark from "../assets/icons/headerBookmarkIcon.svg";
import info from "../assets/icons/headerInfoIcon.svg";
import bell from "../assets/icons/headerBellIcon.svg";
// 20231016 남현준
// 유저 프로필 아이콘 들어올 자리 - 현재는 샘플 이미지 넣음, 프로필 컴포넌트 구현시 유저 이미지 적용 예정
import profile from "../assets/icons/headerProfileSampleIcon.svg";

const HeaderBox = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0rem 1rem 0rem 1rem;
`;

const HeaderIconBox = styled.div`
  display: flex;
  align-items: center;

  img:not(:last-of-type) {
    padding-right: 1rem;
  }
`;

const icons = [
  { name: "member", logo: member },
  { name: "bookmark", logo: bookmark },
  { name: "info", logo: info },
  { name: "bell", logo: bell },
  { name: "profile", logo: profile },
];

export default function Header() {
  return (
    <HeaderBox>
      <div> logo </div>
      <HeaderIconBox>
        {icons.map((icon) => (
          <img src={icon.logo} alt={icon.name} />
        ))}
      </HeaderIconBox>
    </HeaderBox>
  );
}
