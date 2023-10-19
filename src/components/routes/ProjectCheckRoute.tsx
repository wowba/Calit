import React from "react";
import { Outlet } from "react-router-dom";
import styled from "styled-components";

import Sidebar from "../Sidebar";

const ProjectLayout = styled.div`
  display: flex;
  height: calc(100% - 4rem);
`;

export default function ProjectCheckRoute() {
  return (
    <ProjectLayout>
      <Sidebar />
      <Outlet />
    </ProjectLayout>
  );
}
