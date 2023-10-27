import React, { useState } from "react";
import styled, { css } from "styled-components";

import { useLocation } from "react-router-dom";
import { serverTimestamp } from "firebase/firestore";
import { createKanban, createTodo } from "../../../api/CreateCollection";
import ConfirmBtn from "../../../components/layout/ConfirmBtnLayout";
import CommonInputLayout from "../../../components/layout/CommonInputLayout";
import DatePicker from "../../../components/DatePicker";

const CreateKanbanModalLayout = styled.div<{ $isShow: boolean }>`
  position: fixed;

  top: calc((100% + 2rem) / 2);
  left: calc((100% + 12rem) / 2);
  transform: translate(-50%, -50%);

  width: 40rem;
  height: 25rem;
  border-radius: 0.9rem;
  box-shadow: 0px 0px 10px 6px rgba(0, 0, 0, 0.3);
  background-color: white;
  padding: 2.5rem 2.5rem 2.5rem 2.5rem;

  z-index: 999;

  ${(props) =>
    !props.$isShow &&
    css`
      display: none;
    `}
`;

const CreateKanbanModalTitleParagraph = styled.p`
  font-size: 1.5rem;
  font-weight: 700;
`;

const CreateKanbanModalInfoBox = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;

  margin-top: 1.5rem;

  & > p {
    width: 10rem;
    font-size: 1.125rem;
    color: #969696;
  }
  & > span {
    font-size: 1.125rem;

    padding-left: 0.25rem;
  }
`;

const CreateKanbanModalBtnBox = styled.div`
  display: flex;
  justify-content: center;

  gap: 2rem;
  margin-top: 1.5rem;
`;

const CreateKanbanModalBackground = styled.button<{ $isShow: boolean }>`
  position: fixed;

  top: 0;
  left: 0;

  width: 100%;
  height: 100%;

  background-color: transparent;
  z-index: 998;

  cursor: default;

  ${(props) =>
    !props.$isShow &&
    css`
      display: none;
    `}
`;

interface Props {
  isShow: boolean;
  setIsShow: React.Dispatch<React.SetStateAction<boolean>>;
  startDate: Date;
  endDate: Date;
  setStartDate: React.Dispatch<React.SetStateAction<Date>>;
  setEndDate: React.Dispatch<React.SetStateAction<Date>>;
}

export default function CreateKanbanModal(props: Props) {
  const location = useLocation();
  const { isShow, setIsShow, startDate, endDate, setStartDate, setEndDate } =
    props;
  const [kanbanName, setKanbanName] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKanbanName(e.target.value);
  };

  const handleCreateBtnClick = async () => {
    const kanbanID = await createKanban(location.pathname, {
      user_list: [],
      stage_list: [],
      name: kanbanName,
      start_date: startDate,
      end_date: endDate,
      created_date: serverTimestamp(),
      modified_date: serverTimestamp(),
      is_deleted: false,
    });
    await createTodo(location.pathname, kanbanID, {
      update_list: [],
      user_list: [],
      name: "dummyTodo",
      order: -1,
      created_date: serverTimestamp(),
      modified_date: serverTimestamp(),
      is_deleted: true,
      stageID: "dummyTodo",
      deadline: new Date(),
      info: "dummy",
    });
    setIsShow(false);
  };

  const handleModalCloseClick = () => {
    setIsShow(false);
  };

  return (
    <>
      <CreateKanbanModalLayout $isShow={isShow}>
        <CreateKanbanModalTitleParagraph>
          칸반 생성
        </CreateKanbanModalTitleParagraph>
        <CreateKanbanModalInfoBox>
          <p>이름</p>
          <CommonInputLayout
            type="text"
            placeholder="이름을 작성하세요"
            onChange={handleInputChange}
            value={kanbanName}
            $dynamicPadding="0.25rem 0.25rem 0.25rem 0.25rem"
            $dynamicWidth="20rem"
            $isHover
          />
        </CreateKanbanModalInfoBox>
        <CreateKanbanModalInfoBox>
          <p>시작일</p>
          <DatePicker
            date={startDate}
            setDate={setStartDate}
            $width="10rem"
            $height="1.5rem"
            $padding="0.25rem 0.25rem 0.25rem 0.25rem"
            $isHover
            $fontsize="1.125rem"
          />
        </CreateKanbanModalInfoBox>
        <CreateKanbanModalInfoBox>
          <p>종료일</p>
          <DatePicker
            date={endDate}
            setDate={setEndDate}
            $width="10rem"
            $height="1.5rem"
            $padding="0.25rem 0.25rem 0.25rem 0.25rem"
            $isHover
            $fontsize="1.125rem"
          />
        </CreateKanbanModalInfoBox>
        <CreateKanbanModalInfoBox>
          <p>담당자</p>
          <select>asdf</select>
        </CreateKanbanModalInfoBox>
        <CreateKanbanModalBtnBox>
          <ConfirmBtn
            $dynamicWidth="4rem"
            $dynamicColor="#D0D0D0"
            onClick={handleModalCloseClick}
          >
            취소
          </ConfirmBtn>
          <ConfirmBtn $dynamicWidth="4rem" onClick={handleCreateBtnClick}>
            생성
          </ConfirmBtn>
        </CreateKanbanModalBtnBox>
      </CreateKanbanModalLayout>
      <CreateKanbanModalBackground
        $isShow={isShow}
        onClick={handleModalCloseClick}
      />
    </>
  );
}
