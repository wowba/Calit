import React from "react";
import styled from "styled-components";

import calendarGif from "../assets/icons/calendar.gif";

const LoadingLayout = styled.div`
  position: relative;
  height: calc(100% - 4rem);
`;

const LoadingGif = styled.img`
  position: absolute;

  left: 50%;
  top: 50%;
  transform: translate(-50%, -70%);

  scale: 1.5;
`;

export default function LoadingPage() {
  return (
    <LoadingLayout>
      <LoadingGif src={calendarGif} alt="" />
    </LoadingLayout>
  );
}
