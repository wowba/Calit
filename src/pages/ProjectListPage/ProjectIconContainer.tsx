import React, { useState } from "react";
import styled from "styled-components";
import {
  Timestamp,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useRecoilValue } from "recoil";
import { db, storage } from "../../firebaseSDK";
import userState from "../../recoil/atoms/login/userDataState";
import settingIcon from "../../assets/icons/settingIcon.svg";
import linkIcon from "../../assets/icons/linkIcon.svg";
import pictureIcon from "../../assets/icons/pictureIcon.svg";
import trashIcon from "../../assets/icons/trashIcon.svg";
import Arrow from "../../assets/images/Arrow.svg";
import DeleteModal from "./DeleteModal";
import deleteStorageImg from "../../utils/deleteStorageImg";

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

export default function ProjectIconContainer({
  projectId,
  fetchProjectData,
}: any) {
  const [isOpened, setIsOpened] = useState(false);
  const { email } = useRecoilValue(userState).userData;
  const [isQualifed, setIsQualifed] = useState(false);
  const [openModal, setOpenModal] = useState(false);

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
    // storage 새 이미지 업로드
    const imgFile = e.target.files[0];
    if (imgFile) {
      const maxSize = 5 * 1024 * 1024; // 5MB 제한
      const fileSize = imgFile.size;
      if (fileSize > maxSize) {
        // eslint-disable-next-line
        alert("5mb 이하의 이미지만 업로드 가능합니다.");
        return;
      }
    }
    const storageRef = ref(
      storage,
      `projectBgImg/${Timestamp.fromDate(new Date()).toMillis()}_${projectId}`,
    );
    await uploadBytes(storageRef, imgFile);
    // storage 기존 이미지 삭제
    deleteStorageImg(docRef);

    // firestore 새 이미지 주소 업데이트
    const url = await getDownloadURL(storageRef);
    await updateDoc(docRef, {
      project_img_URL: url,
      modified_date: serverTimestamp(),
    });
    fetchProjectData();
  };

  const handleOpen = () => {
    setOpenModal(true);
  };

  // 링크 복사 기능
  const handleCopyClipBoard = async (id: string) => {
    try {
      //   await navigator.clipboard.writeText(`calit-2f888.web.app/${id}`);
      await navigator.clipboard.writeText(`localhost:3000/${id}`);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Container>
        <LinkIcon
          src={linkIcon}
          alt="공유"
          onClick={() => handleCopyClipBoard(projectId)}
        />
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
        <DeleteModal
          projectId={projectId}
          openModal={openModal}
          setOpenModal={setOpenModal}
          fetchProjectData={fetchProjectData}
        />
      )}
    </>
  );
}
