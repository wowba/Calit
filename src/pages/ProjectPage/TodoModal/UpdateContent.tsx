import React, { useEffect, useState } from "react";
import MDEditor from "@uiw/react-md-editor";
import styled from "styled-components";
import { getDoc, updateDoc } from "firebase/firestore";
import settingIcon from "../../../assets/icons/settingIconBlack.svg";
import yearMonthDayFormat from "../../../utils/yearMonthDayFormat";
import trashIcon from "../../../assets/icons/trashIcon.svg";
import pencilIcon from "../../../assets/icons/pencilIcon.svg";
import reloadIcon from "../../../assets/icons/reloadIcon.svg";
import CommonSettingModal from "../../../components/layout/CommonSettingModal";

const UpdateListHeader = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  align-items: center;
`;
const ManagedUser = styled.div`
  display: flex;
`;
const SettingContainer = styled.div`
  display: flex;
  position: relative;
`;

const Contour = styled.div`
  background-color: #eaeaea;
  height: 0.1rem;
  border-radius: 1px;
  margin: 0.5rem auto;
`;
const UpdateContent = styled.div`
  margin: 1rem 0 1rem;
  border-radius: 10px;
  background-color: white;
  padding: 1rem;
`;

const ChangeUpdateModal = styled(CommonSettingModal)`
  bottom: -2.5rem;
  right: -0.2rem;
  height: 2rem;
`;

export default function UpdateContentBox({ todoRef, data, updateIndex }: any) {
  const [markdownContent, setMarkdownContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isSettingOpened, setIsSettingOpened] = useState(false);

  const handleMarkdownChange = (edit: any) => {
    setMarkdownContent(edit);
  };
  // 업데이트 컴포넌트 변경 취소
  const handleCancleClick = () => {
    setIsEditing(!isEditing);
    setIsSettingOpened(!isSettingOpened);
  };
  // 업데이트 컴포넌트 수정
  const handleButtonClick = async () => {
    if (isEditing) {
      const todoSnap: any = await getDoc(todoRef);
      const getUpdateContents = todoSnap.data().update_list;

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
      setIsSettingOpened(!isSettingOpened);
    }
    setIsEditing(!isEditing);
  };
  // 업데이트 컴포넌트 삭제
  const handleDeleteClick = async () => {
    const todoSnap: any = await getDoc(todoRef);
    const getUpdateContents = todoSnap.data().update_list;
    const newUpdateContents = getUpdateContents.filter(
      (_: object, index: number) => index !== updateIndex,
    );
    await updateDoc(todoRef, {
      update_list: newUpdateContents,
    });
    setIsSettingOpened(!isSettingOpened);
  };

  useEffect(() => {
    setMarkdownContent(data.detail);
  }, [todoRef, isEditing]);

  return (
    <UpdateContent>
      <UpdateListHeader>
        <ManagedUser>
          <img
            src={data.writer_img}
            alt="프로필사진"
            style={{
              width: "1.5rem",
              height: "1.5rem",
              objectFit: "cover",
              borderRadius: "50%",
              margin: "0 0.5rem 0 0",
            }}
          />
          {data.writer}
        </ManagedUser>
        <SettingContainer>
          <span>{yearMonthDayFormat(data.created_date.seconds)}</span>
          <button
            type="button"
            onClick={() => setIsSettingOpened(!isSettingOpened)}
            style={{ margin: "0 0 0 0.5rem" }}
          >
            <img src={settingIcon} alt="설정" />
          </button>
          {isSettingOpened && (
            <ChangeUpdateModal $upArrow>
              {isEditing ? (
                <>
                  <button type="button" onClick={handleButtonClick}>
                    <img src={pencilIcon} alt="완료" />
                  </button>
                  <button
                    type="button"
                    onClick={handleCancleClick}
                    style={{ margin: "0 0.5rem 0 0" }}
                  >
                    <img src={reloadIcon} alt="취소" />
                  </button>
                </>
              ) : (
                <button type="button" onClick={handleButtonClick}>
                  <img src={pencilIcon} alt="수정" />
                </button>
              )}

              <button type="button" onClick={handleDeleteClick}>
                <img src={trashIcon} alt="삭제" />
              </button>
            </ChangeUpdateModal>
          )}
        </SettingContainer>
      </UpdateListHeader>
      <Contour />
      {isEditing ? (
        <MDEditor
          value={markdownContent}
          onChange={handleMarkdownChange}
          preview={isEditing ? "edit" : "preview"}
          hideToolbar={false}
        />
      ) : (
        <MDEditor
          value={markdownContent}
          onChange={handleMarkdownChange}
          preview={isEditing ? "edit" : "preview"}
          // eslint-disable-next-line react/jsx-boolean-value
          hideToolbar={true}
        />
      )}
    </UpdateContent>
  );
}
