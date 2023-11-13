import React, { useRef, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { doc, updateDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import Swal from "sweetalert2";

import { auth, db, storage } from "../../firebaseSDK";
import { ModalArea } from "../layout/ModalCommonLayout";
import CommonInputLayout from "../layout/CommonInputLayout";
import CommonTextArea from "../layout/CommonTextArea";
import rightArrow from "../../assets/icons/rightArrow.svg";
import loginState from "../../recoil/atoms/login/loginState";
import userData from "../../recoil/atoms/login/userDataState";
import userListState from "../../recoil/atoms/userList/userListState";

const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
  // 모달 컴포넌트 영역 클릭시 클릭 이벤트가 부모로 전달되어 컴포넌트가 닫히는 현상 수정
  event.stopPropagation();
};

const UserProfileImgBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  margin: 0.25rem 0 1.5rem 0;
`;

const UserProfileImg = styled.img`
  border-radius: 50%;
  width: 9rem;
  height: 9rem;

  object-fit: cover;
`;

const UserInfoBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  margin: 0 0 1rem 0;
`;

const LogoutBtn = styled.button`
  display: block;
  margin: auto;
  img {
    transition: transform 0.3s ease;
  }
  &:hover {
    & img {
      transform: translateX(0.3rem);
    }
  }
`;

export default function UserProfile() {
  const navigate = useNavigate();
  const [userDataState, setUserDataState] = useRecoilState(userData);
  const projectId = window.location.pathname.substring(1);
  const userListData = useRecoilValue(userListState);

  const { email: loginEmail }: any = userDataState.userData;
  const {
    email,
    name,
    profile_img_URL: profileImgUrl,
    intro,
  }: any = userListData.get(loginEmail);

  const userRef = doc(db, "project", projectId, "user", email);

  const imgInputRef = useRef<HTMLInputElement>(null);
  const setLoginState = useSetRecoilState(loginState);

  const inputNameRef = useRef<HTMLInputElement>(null);
  const [inputName, setInputName] = useState(name);
  const [inputIntro, setInputIntro] = useState(intro);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputName(e.target.value);
  };

  const handleIntroChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputIntro(e.target.value);
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files!.length === 0) return;

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
    const storageRef = ref(storage, `${projectId}/userImg/${email}`);
    try {
      await deleteObject(storageRef);
      await uploadBytes(storageRef, imgFile);
    } catch {
      await uploadBytes(storageRef, imgFile);
    } finally {
      const url = await getDownloadURL(storageRef);
      await updateDoc(userRef, {
        profile_img_URL: url,
      });
    }
  };

  const handleNameBlur = async () => {
    if (inputName) {
      await updateDoc(userRef, {
        name: inputName,
      });
    }
  };

  const handleIntroBlur = async () => {
    if (inputIntro) {
      await updateDoc(userRef, {
        intro: inputIntro,
      });
    }
  };

  const handleLogoutBtnClick = () => {
    setLoginState({
      isLogin: false,
      userCredential: {},
    });
    setUserDataState({
      userDataState: {},
    });
    navigate("/login");
    signOut(auth);
  };

  return (
    <ModalArea
      $dynamicWidth="16rem"
      $dynamicHeight="auto"
      onClick={handleClick}
    >
      <UserProfileImgBox>
        <UserProfileImg
          src={profileImgUrl}
          alt=""
          onClick={() => imgInputRef.current?.click()}
        />
        <input
          type="file"
          ref={imgInputRef}
          style={{ display: "none" }}
          onChange={handleImageChange}
        />
      </UserProfileImgBox>
      <UserInfoBox>
        <CommonInputLayout
          ref={inputNameRef}
          value={inputName}
          $dynamicWidth="auto"
          style={{ fontWeight: 700 }}
          onChange={handleNameChange}
          onBlur={handleNameBlur}
          onKeyUp={(e) => {
            if (e.key === "Enter") {
              inputNameRef.current!.blur();
            }
          }}
        />
        <CommonTextArea
          value={inputIntro}
          placeholder="자기소개를 입력해 주세요!"
          onChange={handleIntroChange}
          onBlur={handleIntroBlur}
          style={{ fontSize: "0.9rem" }}
        />
      </UserInfoBox>

      <LogoutBtn type="button" onClick={handleLogoutBtnClick}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <span>로그아웃</span> <img src={rightArrow} alt="" />
        </div>
      </LogoutBtn>
    </ModalArea>
  );
}
