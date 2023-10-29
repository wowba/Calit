/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import MDEditor from "@uiw/react-md-editor";
import styled from "styled-components";
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
  margin: 2rem 0;
  border-radius: 10px;
  background-color: white;
  padding: 1rem;
`;

export default function UpdateContentBox({ data }: any) {
  const { name, profile_img_URL: profileImgUrl } =
    useRecoilValue(userState).userData;

  const [markdownContent, setMarkdownContent] = useState(data.detail);

  const handleMarkdownChange = (edit: any) => {
    setMarkdownContent(edit);
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
          <img src={settingIcon} alt="설정" />
        </SettingContainer>
      </UpdateListHeader>
      <Contour />
      <MDEditor
        value={markdownContent}
        /* @ts-ignore */
        onChange={handleMarkdownChange}
        preview="preview"
      />
    </UpdateContent>
  );
}
