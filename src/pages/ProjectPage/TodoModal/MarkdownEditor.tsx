/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import MDEditor from "@uiw/react-md-editor";
import styled from "styled-components";
import { getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { useRecoilValue } from "recoil";
import userState from "../../../recoil/atoms/login/userDataState";
import UpdateContentBox from "./UpdateContent";

const UpdateContainer = styled.div`
  background-color: #eaeaea;
  height: auto;
  overflow: scroll;
  padding: 1.2rem;
  border-radius: 10px;
  border: 0.5px solid #eaeaea;
`;
const UpdateList = styled.div`
  max-height: 23rem;
  margin: 1rem 0;
`;

interface UpdateContentInterface {
  writer: string;
  detail: string;
  created_date: Date;
  writer_img: string;
}

export default function MarkdownEditor({ todoRef, todoDataState }: any) {
  const [value, setValue] = useState("");
  const { name, profile_img_URL: profileImgUrl } =
    useRecoilValue(userState).userData;

  // update_list db 업데이트
  const handleSubmit = async () => {
    const newUpdateContent: UpdateContentInterface = {
      writer: name,
      detail: value,
      created_date: new Date(),
      writer_img: profileImgUrl,
    };
    const todoSnap: any = await getDoc(todoRef);
    const updateContents = todoSnap.data().update_list;
    updateContents.push(newUpdateContent);
    updateDoc(todoRef, {
      update_list: updateContents,
      modified_date: serverTimestamp(),
    });
    setValue("");
  };

  return (
    <div style={{ height: "80%" }}>
      <UpdateContainer>
        <span>업데이트 입력🌸</span>
        <button type="submit" onClick={handleSubmit}>
          등록
        </button>

        {/* @ts-ignore */}
        <MDEditor value={value} onChange={setValue} preview="edit" />

        <UpdateList>
          {todoDataState.todoData.update_list.map((updateContent: any) => (
            <UpdateContentBox
              key={updateContent.created_date.seconds}
              data={updateContent}
            />
          ))}
        </UpdateList>
      </UpdateContainer>
    </div>
  );
}
