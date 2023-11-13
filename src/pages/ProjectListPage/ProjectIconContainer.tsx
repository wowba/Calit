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
import { useRecoilState, useRecoilValue } from "recoil";
import Swal from "sweetalert2";
import { db, storage } from "../../firebaseSDK";
import userState from "../../recoil/atoms/login/userDataState";
import settingIcon from "../../assets/icons/settingIcon.svg";
import linkIcon from "../../assets/icons/linkIcon.svg";
import pictureIcon from "../../assets/icons/pictureIcon.svg";
import trashIcon from "../../assets/icons/trashIcon.svg";
import deleteStorageImg from "../../utils/deleteStorageImg";
import handleCopyClipBoard from "../../utils/handleCopyClipBoard";
import CommonSettingModal from "../../components/layout/CommonSettingModal";
import recentKanbanState from "../../recoil/atoms/sidebar/recentKanbanState";

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
const ChangeComponentModal = styled(CommonSettingModal)`
  bottom: -2rem;
  // box-shadow: 11px 21px 75px -24px rgba(0, 0, 0, 1);
  // -webkit-box-shadow: 11px 21px 75px -24px rgba(0, 0, 0, 1);
  // -moz-box-shadow: 11px 21px 75px -24px rgba(0, 0, 0, 1);
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
  const [recentKanbanId, setRecentKanbanId] = useRecoilState(recentKanbanState);

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
  const handleBgImg = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files!.length === 0) return;

    // storage 새 이미지 업로드
    const imgFile = e.target.files![0];
    if (imgFile) {
      const maxSize = 5 * 1024 * 1024; // 5MB 제한
      const fileSize = imgFile.size;
      if (fileSize > maxSize) {
        Swal.fire({
          icon: "error",
          title: "이미지를 다시 업로드해주세요.",
          text: "5mb 이하의 이미지만 업로드 가능합니다.",
        });
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
    // 프로젝트 삭제 알림
    Swal.fire({
      title: "프로젝트를 삭제하시겠습니까?",
      icon: "warning",

      showCancelButton: true,
      confirmButtonColor: "#ee6a6a",
      confirmButtonText: "삭제",
      cancelButtonColor: "lightgray",
      cancelButtonText: "취소",
    }).then(async (result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "프로젝트가 삭제되었습니다.",
          icon: "success",
          confirmButtonText: "확인",
        });

        // 최근 칸반 목록 초기화
        const newRecentList = { ...recentKanbanId };
        delete newRecentList[projectId];
        setRecentKanbanId(newRecentList);
        //   논리적 삭제
        await updateDoc(docRef, {
          is_deleted: true,
        });
        fetchProjectData();
      }
    });
  };

  // // 링크 복사 기능
  // const handleCopyClipBoard = async (id: string) => {
  //   //   await navigator.clipboard.writeText(`calit-2f888.web.app/${id}`);
  //   await navigator.clipboard.writeText(`localhost:3000/${id}`);
  // };

  return (
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
        <ChangeComponentModal $upArrow $dynamicChildMargin="0.01rem">
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
        </ChangeComponentModal>
      )}
    </Container>
  );
}
