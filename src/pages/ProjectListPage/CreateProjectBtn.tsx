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
import Swal from "sweetalert2";
import { useRecoilValue } from "recoil";
import { db } from "../../firebaseSDK";
import userState from "../../recoil/atoms/login/userDataState";
import icon_plus_circle from "../../assets/icons/icon_plus_circle.svg";
import loginState from "../../recoil/atoms/login/loginState";
import { createKanban, createUser } from "../../api/CreateCollection";

const CreateBtn = styled.button`
  display: inline-block;
  min-width: 230px;
  height: 226px;
  border: ${(props) => props.theme.Border.thinBorder};
  border-radius: ${(props) => props.theme.Br.default};
  background-color: #ededed;
  margin: 32px 20px 20px 20px;
  transition: all 0.5s ease;
  &:hover {
    background-color: ${(props) => props.theme.Color.activeColor};
    box-shadow: ${(props) => props.theme.Bs.default};
    -webkit-box-shadow: ${(props) => props.theme.Bs.default};
    -moz-box-shadow: ${(props) => props.theme.Bs.default};
  }
`;

const PlusIcon = styled.img`
  margin: 0 auto;
`;

interface ProjectData {
  user_list: string[];
  invited_list: string[];
  bookmark_list: object[];
  name: string;
  project_intro: string;
  project_img_URL: string;
  created_date: FieldValue;
  modified_date: FieldValue;
  creater: string;
  is_deleted: boolean;
  deleted_kanban_info_list: { id: string; name: string }[];
}

export default function CreateProjectBtn() {
  const { email } = useRecoilValue(userState).userData;
  const { userCredential } = useRecoilValue(loginState);

  const handleClick = async () => {
    // 프로젝트 생성 알림
    Swal.fire({
      title: "새 프로젝트를 생성하시겠습니까?",
      icon: "warning",

      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      confirmButtonText: "생성",
      cancelButtonColor: "#ee6a6a",
      cancelButtonText: "취소",
    }).then(async (result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "프로젝트가 생성되었습니다.",
          icon: "success",
          confirmButtonText: "확인",
        });
        // 새 프로젝트 생성
        const projectData: ProjectData = {
          user_list: [email],
          invited_list: [],
          bookmark_list: [],
          name: "",
          project_intro: "",
          project_img_URL: "",
          created_date: serverTimestamp(),
          modified_date: serverTimestamp(),
          creater: email,
          is_deleted: false,
          deleted_kanban_info_list: [],
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
        });
        // 유저의 project_list 업데이트
        if (userCredential) {
          const userRef = doc(db, "user", userCredential.email);
          await updateDoc(userRef, {
            project_list: arrayUnion(docRef.id),
          });
        }

        await createUser(docRef.id, userCredential.email, {
          email: userCredential.email,
          name: userCredential.displayName,
          intro: "",
          profile_img_URL: userCredential.photoURL,
          is_kicked: false,
        });
      }
    });
  };

  return (
    <CreateBtn onClick={handleClick}>
      <PlusIcon src={icon_plus_circle} alt="추가" />
    </CreateBtn>
  );
}
