import React, { useState } from "react";
import styled from "styled-components";
import {
  Timestamp,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useRecoilValue } from "recoil";
import { db, storage } from "../../firebaseSDK";
import userState from "../../recoil/atoms/login/userDataState";
import loginState from "../../recoil/atoms/login/loginState";
import settingIcon from "../../assets/icons/settingIcon.svg";
import linkIcon from "../../assets/icons/linkIcon.svg";
import pictureIcon from "../../assets/icons/pictureIcon.svg";
import trashIcon from "../../assets/icons/trashIcon.svg";
import Arrow from "../../assets/images/Arrow.svg";

const Container = styled.div`
  display: flex;
  position: absolute;
  top: 1rem;
  right: 1rem;
`;
const SettingIcon = styled.img`
  z-index: 2;
  cursor: pointer;
`;
const LinkIcon = styled.img`
  z-index: 2;
  cursor: pointer;
`;
const ChangeCardModal = styled.div`
  display: flex;
  background-color: #ededed;
  border-radius: 4px;
  padding: 0.3rem 0.5rem;
  position: absolute;
  bottom: -2rem;
  box-shadow: 11px 21px 75px -24px rgba(0, 0, 0, 1);
  -webkit-box-shadow: 11px 21px 75px -24px rgba(0, 0, 0, 1);
  -moz-box-shadow: 11px 21px 75px -24px rgba(0, 0, 0, 1);
  z-index: 2;
  &:before {
    content: url(${Arrow});
    position: absolute;
    top: -1rem;
    right: 0.35rem;
    fill: #d9d9d9;
  }
`;

const ChangePicInput = styled.input`
  display: none;
`;
const ChangeIcon = styled.img`
  z-index: 2;
  cursor: pointer;
  margin: 0 0.2rem 0 0;
  width: 100%;
  height: 100%;
`;
const DeleteIcon = styled.img`
  z-index: 2;
  cursor: pointer;
  margin: 0 0 0 0.2rem;
`;

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
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

export default function ProjectIconContainer({ projectId }: any) {
  const [isOpened, setIsOpened] = useState(false);
  const [isChanged, setIsChanged] = useState(false);
  const { email, project_list: projectList } =
    useRecoilValue(userState).userData;
  const [isQualifed, setIsQualifed] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const { userCredential } = useRecoilValue(loginState);

  const docRef = doc(db, "project", projectId);

  // 설정 권한 존재 여부 확인
  const checkQualification = async () => {
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      if (email === docSnap.data().user_list[0]) {
        setIsQualifed(true);
      }
    }
  };
  checkQualification();

  // 설정 버튼 클릭 시 동작
  const handleClick = () => {
    setIsOpened(!isOpened);
  };

  // 이미지 수정 버튼 클릭 시 동작
  const handleBgImg = async (e: any) => {
    const imgFile = e.target.files[0];
    const storageRef = ref(
      storage,
      `projectBgImg/${Timestamp.fromDate(new Date()).toMillis()}_${
        imgFile.name
      }`,
    );
    await uploadBytes(storageRef, imgFile);
    const url = await getDownloadURL(storageRef);
    await updateDoc(docRef, {
      project_img_URL: url,
      modified_date: serverTimestamp(),
    });
    setIsChanged(true);
  };
  console.log(isChanged);

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
  const handleOpen = () => {
    setOpenModal(true);
  };
  const handleCloseBtn = () => {
    setOpenModal(false);
  };

  return (
    <>
      <Container>
        <LinkIcon src={linkIcon} alt="공유" />
        {isQualifed && (
          <SettingIcon src={settingIcon} alt="설정" onClick={handleClick} />
        )}
        {isOpened && (
          <ChangeCardModal>
            <label htmlFor="file-input">
              <ChangeIcon src={pictureIcon} alt="변경" />
              {}
              <ChangePicInput
                id="file-input"
                type="file"
                accept="image/"
                onChange={handleBgImg}
              />
            </label>

            <DeleteIcon src={trashIcon} alt="삭제" onClick={handleOpen} />
          </ChangeCardModal>
        )}
      </Container>
      {openModal && (
        <ModalContainer>
          <ModalContent>
            <p>삭제하시겠습니까?</p>
            <button type="button" onClick={handleDelete}>
              삭제
            </button>
            <button type="button" onClick={handleCloseBtn}>
              취소
            </button>
          </ModalContent>
        </ModalContainer>
      )}
    </>
  );
}
