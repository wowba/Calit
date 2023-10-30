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
  height: auto;
  overflow: scroll;
  padding: 1.2rem;
  border-radius: 10px;
  border: 0.5px solid #eaeaea;
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

// function Button() {
//   const { preview, dispatch } = useContext(EditorContext);
//   const click = () => {
//     dispatch!({
//       preview: preview === "edit" ? "preview" : "edit"
//     });
//   };
//   if (preview === "edit") {
//     return (
//       <svg width="12" height="12" viewBox="0 0 520 520" onClick={click}>
//         <polygon
//           fill="currentColor"
//           points="0 71.293 0 122 319 122 319 397 0 397 0 449.707 372 449.413 372 71.293"
//         />
//         <polygon
//           fill="currentColor"
//           points="429 71.293 520 71.293 520 122 481 123 481 396 520 396 520 449.707 429 449.413"
//         />
//       </svg>
//     );
//   }
//   return (
//     <svg width="12" height="12" viewBox="0 0 520 520" onClick={click}>
//       <polygon
//         fill="currentColor"
//         points="0 71.293 0 122 38.023 123 38.023 398 0 397 0 449.707 91.023 450.413 91.023 72.293"
//       />
//       <polygon
//         fill="currentColor"
//         points="148.023 72.293 520 71.293 520 122 200.023 124 200.023 397 520 396 520 449.707 148.023 450.413"
//       />
//     </svg>
//   );
// }

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
        <AddUpdateTitle>
          <span
            style={{
              fontWeight: "900",
              fontSize: "1.2rem",
            }}
          >
            업데이트 등록
          </span>
          <ConfirmBtn
            type="submit"
            onClick={handleSubmit}
            $dynamicWidth="3.5rem"
          >
            등록
          </ConfirmBtn>
        </AddUpdateTitle>

        {/* @ts-ignore */}
        <MDEditor value={value} onChange={setValue} preview="edit" />
        <span
          style={{
            fontWeight: "900",
            fontSize: "1.2rem",
            margin: "1.5rem 0 0",
            display: "inline-block",
          }}
        >
          업데이트 내역
        </span>
        <UpdateList>
          {todoDataState.todoData.update_list
            .slice()
            .reverse()
            .map((updateContent: any, index: number) => (
              <UpdateContentBox
                key={updateContent.created_date.seconds}
                data={updateContent}
                todoRef={todoRef}
                updateIndex={index}
              />
            ))}
          {/* <UpdateContent>
          <MDEditor.Markdown
            source={value}
            style={{ whiteSpace: "pre-wrap" }}
          />
        </UpdateContent> */}
        </UpdateList>
      </UpdateContainer>
    </div>
  );
}
