import React from "react";
import { styled } from "styled-components";
import ShrikhandRegular from "../assets/fonts/Shrikhand-Regular.ttf";

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

export default function Header() {
  return (
    <HeaderLayout>
      <HeaderLogoParagraph>Calit!</HeaderLogoParagraph>
    </HeaderLayout>
  );
}
