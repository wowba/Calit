/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { doc, updateDoc } from "firebase/firestore";
import styled from "styled-components";
import { useRecoilState } from "recoil";
import { db } from "../../firebaseSDK";
// import userState from "../../recoil/atoms/login/userDataState";
// import loginState from "../../recoil/atoms/login/loginState";
// import deleteStorageImg from "../../utils/deleteStorageImg";
import ConfirmBtn from "../../components/layout/ConfirmBtnLayout";
import recentKanbanState from "../../recoil/atoms/sidebar/recentKanbanState";

// 모달
const ModalContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
`;

const ModalContent = styled.div`
  background: white;
  width: 300px;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const CancelBtn = styled.button`
  height: 38px;
  width: 3rem;
  border-radius: 7px;
  border: 1px solid #ee6a6a;
  margin: 0.5rem;
  &:hover {
    transition: all 0.5s;
    background-color: #d05f5f;
    color: white;
  }
`;

export default function DeleteModal({
  projectId,
  openModal,
  setOpenModal,
  fetchProjectData,
}: any) {
  const docRef = doc(db, "project", projectId);
  const [recentKanbanId, setRecentKanbanId] = useRecoilState(recentKanbanState);

  // 삭제 버튼 클릭 시 동작
  const handleDelete = async () => {
    setOpenModal(false);
    // 최근 칸반 목록 초기화
    const newRecentList = { ...recentKanbanId };
    delete newRecentList[projectId];
    setRecentKanbanId(newRecentList);
    //   논리적 삭제
    await updateDoc(docRef, {
      is_deleted: true,
    });
    fetchProjectData();
  };

  const handleCloseBtn = () => {
    setOpenModal(false);
  };

  return (
    <>
      {openModal} && (
      <ModalContainer>
        <ModalContent>
          <p>삭제하시겠습니까?</p>
          <ConfirmBtn
            $dynamicWidth="3rem"
            $dynamicMargin="0.5rem"
            onClick={handleDelete}
          >
            삭제
          </ConfirmBtn>

          <CancelBtn onClick={handleCloseBtn}>취소</CancelBtn>
        </ModalContent>
      </ModalContainer>
      )
    </>
  );
}
