import React, { useState } from "react";
import MDEditor from "@uiw/react-md-editor";
import styled from "styled-components";
import { getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { useRecoilValue } from "recoil";
import userState from "../../../recoil/atoms/login/userDataState";
import UpdateContentBox from "./UpdateContent";
import ConfirmBtn from "../../../components/layout/ConfirmBtnLayout";

const AddUpdateTitle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 0 0.7rem;
`;
const UpdateContainer = styled.div`
  background-color: #eaeaea;
  height: 80%;
  overflow: scroll;
  padding: 1.2rem 1.2rem 0 1.2rem;
  border-radius: 10px;
  border: 0.5px solid #eaeaea;
  &::-webkit-scrollbar {
    width: 8px;
    overflow-y: scroll;
    border-radius: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.3);
    border-radius: 6px;
  }
  &::-webkit-scrollbar-corner {
    background: transparent;
  }
`;
const UpdateList = styled.div`
  max-height: 23rem;
  margin: 0 0 1rem;
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
    updateContents.unshift(newUpdateContent);
    updateDoc(todoRef, {
      update_list: updateContents,
      modified_date: serverTimestamp(),
    });
    setValue("");
  };

  return (
    <div style={{ height: "80%" }}>
      <UpdateContainer>
        <AddUpdateTitle>
          <span
            style={{
              fontWeight: "900",
              fontSize: "0.9rem",
            }}
          >
            업데이트 등록
          </span>
          <ConfirmBtn
            type="submit"
            onClick={handleSubmit}
            $dynamicWidth="3.5rem"
            $dynamicHeight="2rem"
            style={{ fontSize: "0.9rem" }}
          >
            등록
          </ConfirmBtn>
        </AddUpdateTitle>

        {/* @ts-ignore */}
        <MDEditor value={value} onChange={setValue} preview="edit" />
        <span
          style={{
            fontWeight: "900",
            fontSize: "0.9rem",
            margin: "1.5rem 0 0",
            display: "inline-block",
          }}
        >
          업데이트 내역
        </span>
        <UpdateList>
          {todoDataState.todoData.update_list.map(
            (updateContent: any, index: number) => (
              <UpdateContentBox
                key={updateContent.created_date.seconds}
                data={updateContent}
                todoRef={todoRef}
                updateIndex={index}
              />
            ),
          )}
        </UpdateList>
      </UpdateContainer>
    </div>
  );
}
