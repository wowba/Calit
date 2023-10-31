import React from "react";
import { styled } from "styled-components";
import icon_plus_circle from "../../../assets/icons/icon_plus_circle.svg";
import trashIcon from "../../../assets/icons/trashIcon.svg";

const StageLayout = styled.div`
  display: flex;
  overflow: scroll;
  height: 75vh;
  width: 100vw;
`;

const StageBox = styled.div`
  height: 20rem;
  width: 10rem;
  margin: 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StageInfoBox = styled.div`
  display: flex;
  justify-content: space-between;
  width: 10rem;
  border-bottom: 2px solid #eaeaea;
  margin-bottom: 0.5rem;
`;
const StageContentBox = styled.div`
  box-sizing: border-box;

  height: 60vh;
  width: 10vw;
  padding: 0 0.5rem;

  background: #ededed;
  border: 1px solid #d5d5d5;
  box-shadow: 3px 4px 9px -2px rgba(0, 0, 0, 0.13);
  border-radius: 10px;
  overflow: scroll;
`;

const StageContent = styled.div`
  height: 4rem;
  width: 100%;
  display: flex;
  flex-direction: column;

  border-radius: 10px;
  border: 1px solid #d5d5d5;
  background: #fff;
`;

const StageContentParagraph = styled.p`
  &.title {
    font-weight: bold;
  }
`;

const StageInfoTrashIcon = styled.img`
  height: 1rem;
  width: 1rem;
  cursor: pointer;
`;

const StageInfoPlusIcon = styled.img`
  height: 1rem;
  width: 1rem;
  cursor: pointer;
`;

export default function Stage() {
  return (
    <StageLayout>
      <StageBox>
        <StageInfoBox>
          스테이지 추가하기
          <StageInfoTrashIcon src={trashIcon} alt="스테이지 삭제" />
          <StageInfoPlusIcon src={icon_plus_circle} alt="스테이지 추가" />
        </StageInfoBox>
        <StageContentBox>
          <StageContent>
            <StageContentParagraph />
          </StageContent>
        </StageContentBox>
      </StageBox>
    </StageLayout>
  );
}
