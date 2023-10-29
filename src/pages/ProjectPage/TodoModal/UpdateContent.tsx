import React, { useState } from "react";
import MDEditor from "@uiw/react-md-editor";
import styled from "styled-components";
import { getDoc, updateDoc } from "firebase/firestore";
import { useRecoilValue } from "recoil";
import settingIcon from "../../../assets/icons/settingIcon.svg";
import yearMonthDayFormat from "../../../utils/yearMonthDayFormat";
import userState from "../../../recoil/atoms/login/userDataState";

const UpdateListHeader = styled.div`
  display: flex;
  justify-content: space-between;
`;
const ManagedUser = styled.div`
  display: flex;
`;
const SettingContainer = styled.div`
  display: flex;
`;

const Contour = styled.div`
  background-color: #eaeaea;
  height: 0.2rem;
  border-radius: 1px;
  margin: 0.5rem auto;
`;
const UpdateContent = styled.div`
  margin: 1rem 0 2rem;
  border-radius: 10px;
  background-color: white;
  padding: 1rem;
`;

export default function UpdateContentBox({ todoRef, data, updateIndex }: any) {
  const { name, profile_img_URL: profileImgUrl } =
    useRecoilValue(userState).userData;

  const [markdownContent, setMarkdownContent] = useState(data.detail);
  const [isEditing, setIsEditing] = useState(false);

  const handleMarkdownChange = (edit: any) => {
    setMarkdownContent(edit);
  };

  const handleButtonClick = async () => {
    if (isEditing) {
      const todoSnap: any = await getDoc(todoRef);
      const getUpdateContents = todoSnap.data().update_list;
      // 변경된 데이터가 반영된 배열 생성
      const newUpdateContents = getUpdateContents.map(
        (updateContent: object, index: number) => {
          if (index === updateIndex) {
            return {
              ...updateContent,
              detail: markdownContent,
            };
          }
          return updateContent;
        },
      );
      await updateDoc(todoRef, {
        update_list: newUpdateContents,
      });
    }
    setIsEditing(!isEditing);
  };

  return (
    <UpdateContent>
      <UpdateListHeader>
        <ManagedUser>
          <img
            src={profileImgUrl}
            alt="프로필사진"
            style={{
              width: "3rem",
              height: "3rem",
              objectFit: "cover",
              borderRadius: "50%",
            }}
          />
          {name}
        </ManagedUser>
        <SettingContainer>
          <span>{yearMonthDayFormat(data.created_date.seconds)}</span>
          <button type="button" onClick={handleButtonClick}>
            <img src={settingIcon} alt="설정" />
          </button>
        </SettingContainer>
      </UpdateListHeader>
      <Contour />
      <MDEditor
        value={markdownContent}
        onChange={handleMarkdownChange}
        preview={isEditing ? "edit" : "preview"}
      />
    </UpdateContent>
  );
}
