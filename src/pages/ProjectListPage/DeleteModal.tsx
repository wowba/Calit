import React from "react";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
} from "firebase/firestore";
import styled from "styled-components";
import { useRecoilValue } from "recoil";
import { db } from "../../firebaseSDK";
import userState from "../../recoil/atoms/login/userDataState";
import loginState from "../../recoil/atoms/login/loginState";
import deleteStorageImg from "../../utils/deleteStorageImg";
import ConfirmBtn from "../../components/layout/ConfirmBtnLayout";

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
}: any) {
  const { userCredential } = useRecoilValue(loginState);
  const { project_list: projectList } = useRecoilValue(userState).userData;
  const docRef = doc(db, "project", projectId);

  // 삭제 버튼 클릭 시 동작
  const handleDelete = async () => {
    setOpenModal(false);
    // 유저의 프로젝트 리스트 변경
    const filteredList = projectList.filter(
      (item: any) => !(item === projectId),
    );
    const userRef = doc(db, "user", userCredential.uid);
    await updateDoc(userRef, {
      project_list: filteredList,
    });
    // storage 프로젝트 카드 이미지 삭제
    deleteStorageImg(docRef);
    // 프로젝트 삭제
    const kanbanQuery = query(collection(db, "project", projectId, "kanban"));
    const querySnapshot = await getDocs(kanbanQuery);
    querySnapshot.forEach(async (kanbanDoc) => {
      const kanbanDocRef = doc(
        db,
        "project",
        projectId,
        "kanban",
        kanbanDoc.id,
      );
      // 논리적 삭제로 변경할 시 사용할 코드
      //  await updateDoc(kanbanDocRef, {
      //    is_deleted: true,
      //  });
      const todoQuery = query(
        collection(db, "project", projectId, "kanban", kanbanDoc.id, "todo"),
      );
      const todoQuerySnapshot = await getDocs(todoQuery);
      todoQuerySnapshot.forEach(async (todoDoc) => {
        const todoDocRef = doc(
          db,
          "project",
          projectId,
          "kanban",
          kanbanDoc.id,
          "todo",
          todoDoc.id,
        );
        await deleteDoc(todoDocRef);
      });
      await deleteDoc(kanbanDocRef);
    });
    // 로그 기능 구현 시 여기에 삭제 알람 동작 구현
    await deleteDoc(docRef);
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
            dynamicWidth="3rem"
            dynamicMargin="0.5rem"
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
