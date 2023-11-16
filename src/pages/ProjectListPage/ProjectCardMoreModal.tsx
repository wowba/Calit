import React, { useEffect, useRef } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import styled, { css } from "styled-components";

import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Timestamp, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import Swal from "sweetalert2";
import userState from "../../recoil/atoms/login/userDataState";
import recentKanbanState from "../../recoil/atoms/sidebar/recentKanbanState";
import deleteStorageImg from "../../utils/deleteStorageImg";
import handleCopyClipBoard from "../../utils/handleCopyClipBoard";
import { db, storage } from "../../firebaseSDK";

const ProjectCardMoreModalLayout = styled.div<{
  $isShow: boolean;
  $isCreater: boolean;
}>`
  position: absolute;

  top: -7.5rem;
  top: ${(props) => (props.$isCreater ? "-7.5rem" : "-2.5rem")};
  right: 1.125rem;

  width: 10rem;
  background-color: ${(props) => props.theme.Color.mainWhite};

  border: ${(props) => props.theme.Border.thinBorder};
  border-radius: ${(props) => props.theme.Br.default};
  box-shadow: ${(props) => props.theme.Bs.default};

  z-index: 999;

  display: flex;
  flex-direction: column;

  ${(props) =>
    !props.$isShow &&
    css`
      display: none;
    `}
`;

const ModalInnerBtn = styled.button`
  width: 100%;

  text-align: start;
  padding: 0.4rem 0.6rem;

  border-bottom: ${(props) => props.theme.Border.thinBorder};
`;

const ChangePicInput = styled.input`
  display: none;
`;

interface Props {
  isShow: boolean;
  setIsShow: React.Dispatch<React.SetStateAction<boolean>>;
  projectId: string;
  fetchProjectData: any;
  creater: string;
}

export default function ProjectCardMoreModal(props: Props) {
  const { isShow, setIsShow, projectId, fetchProjectData, creater } = props;

  // 모달 팝업 로직
  const wrapperRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const sweetAlertComponent =
      document.getElementsByClassName("swal2-container");
    function handleClickOutside(e: MouseEvent): void {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node) &&
        !sweetAlertComponent[0]
      ) {
        setIsShow(false);
      }
    }
    document.addEventListener("mouseup", handleClickOutside);
    return () => {
      document.removeEventListener("mouseup", handleClickOutside);
    };
  }, [wrapperRef]);

  // 컴포넌트 메인 로직
  const imgInputRef = useRef<HTMLInputElement>(null);
  const { email } = useRecoilValue(userState).userData;
  const isCreater = email === creater;
  const [recentKanbanId, setRecentKanbanId] = useRecoilState(recentKanbanState);
  const docRef = doc(db, "project", projectId);

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
      confirmButtonColor: "#7064FF",
      confirmButtonText: "삭제",
      cancelButtonColor: "#B0B0B0",
      cancelButtonText: "취소",
    }).then(async (result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "프로젝트가 삭제되었습니다.",
          icon: "success",
          confirmButtonText: "확인",
          confirmButtonColor: "#7064FF",
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

  return (
    <ProjectCardMoreModalLayout
      ref={wrapperRef}
      $isShow={isShow}
      $isCreater={isCreater}
    >
      <ModalInnerBtn
        type="button"
        onClick={() => handleCopyClipBoard(projectId)}
      >
        링크 복사하기
      </ModalInnerBtn>
      {isCreater ? (
        <>
          <ModalInnerBtn
            type="button"
            onClick={() => imgInputRef.current!.click()}
          >
            이미지 변경
          </ModalInnerBtn>
          <ChangePicInput
            ref={imgInputRef}
            id="file-input"
            type="file"
            accept="image/"
            onChange={handleBgImg}
          />
          <ModalInnerBtn type="button" onClick={handleOpen}>
            삭제하기
          </ModalInnerBtn>
        </>
      ) : null}
    </ProjectCardMoreModalLayout>
  );
}
