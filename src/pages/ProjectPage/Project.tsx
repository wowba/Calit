import React from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";

const Btn = styled.button`
  margin: 10px;
  border: 1px solid black;
  background-color: beige;
`;

export default function Project() {
  const location = useLocation();

  const handleCanbanCLick = (url: string) => {
    window.history.pushState(null, "", location.pathname + url);
  };

  const handleTodoCLick = (url: string) => {
    window.history.pushState(null, "", location.pathname + url);
  };

  return (
    <>
      <div>Project</div>
      <Btn type="button" onClick={() => handleCanbanCLick("/canbanID")}>
        canban
      </Btn>
      <Btn type="button" onClick={() => handleTodoCLick("/todoID")}>
        todo
      </Btn>
    </>
  );
}
