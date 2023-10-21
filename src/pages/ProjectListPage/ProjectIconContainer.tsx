import React from "react";
import styled from "styled-components";
import settingIcon from "../../assets/icons/settingIcon.svg";
import linkIcon from "../../assets/icons/linkIcon.svg";

const Container = styled.div`
  display: flex;
  position: absolute;
  top: 1rem;
  right: 1rem;
`;
const SettingIcon = styled.img`
  z-index: 3;
  cursor: pointer;
`;
const LinkIcon = styled.img`
  z-index: 3;
  cursor: pointer;
`;

export default function ProjectIconContainer() {
  return (
    <Container>
      <LinkIcon src={linkIcon} alt="공유" />
      <SettingIcon src={settingIcon} alt="설정" />
    </Container>
  );
}
