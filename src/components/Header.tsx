import React from "react";
import { styled } from "styled-components";

const HeaderBox = styled.div`
  display: flex;
  justify-content: space-between;
`;

export default function Header() {
  return (
    <HeaderBox>
      <div> logo </div>
      <div> icons </div>
    </HeaderBox>
  );
}
