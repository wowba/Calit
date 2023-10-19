import React from "react";
import styled from "styled-components";
import icon_plus_circle from "../../assets/icons/icon_plus_circle.svg";

const CreateBtn = styled.button`
  display: inline;
  width: 400px;
  min-width: 230px;
  height: 226px;
  border-radius: 13px;
  background-color: #ededed;
  margin: 0 20px;
`;

const PlusIcon = styled.img`
  margin: 0 auto;
`;

export default function CreateProjectBtn() {
  const handleClick = () => {};

  return (
    <CreateBtn onClick={handleClick}>
      <PlusIcon src={icon_plus_circle} alt="추가" />
    </CreateBtn>
  );
}
