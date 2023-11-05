import React from "react";
import {
  FieldValue,
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
  max-width: 400px;
  min-width: 230px;
  height: 226px;
  border: 1px solid transparent;
  border-radius: 13px;
  background-color: #ededed;
  margin: 20px;
  transition:
    box-shadow 0.7s,
    border 0.7s;
  &:hover {
    box-shadow: 0px 16px 48px 0px rgba(0, 0, 0, 0.176);
    -webkit-box-shadow: 0px 16px 48px 0px rgba(0, 0, 0, 0.176);
    -moz-box-shadow: 0px 16px 48px 0px rgba(0, 0, 0, 0.176);
    border: 1px solid #c9c9c9;
  }
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
  created_date: FieldValue;
  modified_date: FieldValue;
  creater: string;
  is_deleted: boolean;
}

export default function CreateProjectBtn() {
  const { email } = useRecoilValue(userState).userData;
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
      creater: email,
      is_deleted: false,
    };

    const docRef = await addDoc(collection(db, "project"), projectData);
    // onSnapshot 감시를 위한 dummy kanban
    createKanban(docRef.id, {
      user_list: [],
      stage_list: [],
      start_date: new Date(),
      end_date: new Date(),
      created_date: serverTimestamp(),
      modified_date: serverTimestamp(),
      name: "dummyKanban",
      is_deleted: true,
      color: "#3888d8",
      tag_list: [
        { label: "긴급🔥", value: "긴급🔥", color: "#f92f66" },
        { label: "FE✨", value: "FE✨", color: "#ddafff" },
        { label: "BE🛠️", value: "FE✨", color: "#F5F3BB" },
        { label: "UX/UI🎨", value: "FE✨", color: "#00FFF5" },
      ],
    });
    // 유저의 project_list 업데이트
    if (userCredential) {
      const userRef = doc(db, "user", userCredential.email);
      await updateDoc(userRef, {
        project_list: arrayUnion(docRef.id),
      });
    }

    // alert("프로젝트가 생성되었습니다!");
  };

  return (
    <CreateBtn onClick={handleClick}>
      <PlusIcon src={icon_plus_circle} alt="추가" />
    </CreateBtn>
  );
}
