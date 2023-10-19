import React from "react";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import styled from "styled-components";
import { useRecoilValue } from "recoil";
import { db } from "../../firebaseSDK";
import userState from "../../recoil/atoms/login/userDataState";
import icon_plus_circle from "../../assets/icons/icon_plus_circle.svg";
import loginState from "../../recoil/atoms/login/loginState";
import { createKanban } from "../../api/CreateCollection";

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

interface ProjectData {
  user_list: string[];
  invited_list: string[];
  name: string;
  project_intro: string;
  project_img_URL: string;
  created_date: any;
  modified_date: any;
  creater: string;
  is_deleted: boolean;
}

export default function CreateProjectBtn() {
  const { name, email } = useRecoilValue(userState).userData;
  const { userCredential } = useRecoilValue(loginState);

  const handleClick = async () => {
    // 새 프로젝트 생성
    const projectData: ProjectData = {
      user_list: [email],
      invited_list: [],
      name: "",
      project_intro: "",
      project_img_URL: "",
      created_date: serverTimestamp(),
      modified_date: serverTimestamp(),
      creater: name,
      is_deleted: false,
    };

    const docRef = await addDoc(collection(db, "project"), projectData);
    // onSnapshot 감시를 위한 dummy kanban
    createKanban(docRef.id, {
      name: "dummyKanban",
      is_deleted: true,
    });
    // 유저의 project_list 업데이트
    const userRef = doc(db, "user", userCredential.uid);
    await updateDoc(userRef, {
      project_list: arrayUnion(docRef.id),
    });

    alert("프로젝트가 생성되었습니다!");
  };

  return (
    <CreateBtn onClick={handleClick}>
      <PlusIcon src={icon_plus_circle} alt="추가" />
    </CreateBtn>
  );
}
