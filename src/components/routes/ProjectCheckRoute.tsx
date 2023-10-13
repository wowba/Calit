import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar";

export default function ProjectCheckRoute() {
  return (
    <>
      <Sidebar />
      <Outlet />
    </>
  );
}
