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
  margin: 0 0 0.5rem;
`;
const UpdateContainer = styled.div`
  height: calc(100% - 3.2rem);
  overflow: scroll;
  padding: 1.2rem 0.5rem 0 0.5rem;
  border-radius: 10px;
  border: 0.5px solid white;
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

interface Props {
  todoRef: any;
  todoDataState: any;
  isUpdateClick: boolean;
  setIsUpdateClick: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function MarkdownEditor({
  todoRef,
  todoDataState,
  isUpdateClick,
  setIsUpdateClick,
}: Props) {
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
    setIsUpdateClick((prev) => !prev);
  };

  return (
    <UpdateContainer>
      {isUpdateClick && (
        <>
          <MDEditor
            // @ts-ignore
            onChange={setValue}
            value={value}
            preview="edit"
          />
          <AddUpdateTitle>
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
        </>
      )}

      {todoDataState.update_list.length ? (
        <UpdateList>
          {todoDataState.update_list.map(
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
      ) : (
        !isUpdateClick && <p>업데이트 내역이 없습니다.</p>
      )}
    </UpdateContainer>
  );
}
