import React from "react";
import styled from "styled-components";
import { useSearchParams } from "react-router-dom";

const Btn = styled.button`
  margin: 10px;
  border: 1px solid black;
  background-color: beige;
`;

export default function Project() {
  const [searchParams, setSearchParams] = useSearchParams();

  let isCanbanShow;
  let isTodoShow;

  const handleCalClick = () => {
    setSearchParams();
  };

  const handleCanbanCLick = () => {
    setSearchParams({ canbanID: "1234" });
  };

  const handleTodoCLick = () => {
    setSearchParams({
      canbanID: searchParams.get("canbanID")!,
      todoID: "5678",
    });
  };

  if (searchParams.has("canbanID")) isCanbanShow = true;
  if (searchParams.has("todoID")) isTodoShow = true;

  return (
    <>
      <div>Project</div>
      <Btn type="button" onClick={() => handleCalClick()}>
        calender
      </Btn>
      <Btn type="button" onClick={() => handleCanbanCLick()}>
        canban
      </Btn>
      <Btn type="button" onClick={() => handleTodoCLick()}>
        todo
      </Btn>
      {isCanbanShow ? <div>Canban</div> : null}
      {isTodoShow ? <div>Todo</div> : null}
    </>
  );
}
