import React, { useState } from "react";
import MDEditor from "@uiw/react-md-editor";
import styled from "styled-components";
import { getDoc, updateDoc } from "firebase/firestore";
import { useRecoilValue } from "recoil";
import settingIcon from "../../../assets/icons/settingIcon.svg";
import yearMonthDayFormat from "../../../utils/yearMonthDayFormat";
import userState from "../../../recoil/atoms/login/userDataState";
import { ChangeComponentModal } from "../../ProjectListPage/ProjectIconContainer";
import trashIcon from "../../../assets/icons/trashIcon.svg";
import pencilIcon from "../../../assets/icons/pencilIcon.svg";
import reloadIcon from "../../../assets/icons/reloadIcon.svg";

const UpdateListHeader = styled.div`
  display: flex;
  justify-content: space-between;
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

const ChangeUpdateModal = styled(ChangeComponentModal)`
  bottom: -2rem;
  right: 0;
  height: 2rem;
  box-shadow: 1px 2px 6px 3px rgba(0, 0, 0, 0.2);
  -webkit-box-shadow: 1px 2px 6px 3px rgba(0, 0, 0, 0.2);
  -moz-box-shadow: 1px 2px 6px 3px rgba(0, 0, 0, 0.2);
  > :first-child {
    margin: 0 0.5rem 0 0;
  }
`;

export default function UpdateContentBox({ todoRef, data, updateIndex }: any) {
  const { name, profile_img_URL: profileImgUrl } =
    useRecoilValue(userState).userData;

  const [markdownContent, setMarkdownContent] = useState(data.detail);
  const [isEditing, setIsEditing] = useState(false);
  const [isSettingOpened, setIsSettingOpened] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [originalMarkdownContent, setOriginalMarkdownContent] = useState(
    data.detail,
  );

  const handleMarkdownChange = (edit: any) => {
    setMarkdownContent(edit);
  };
  // 업데이트 컴포넌트 변경 취소
  const handleCancleClick = () => {
    setMarkdownContent(originalMarkdownContent);
    setIsEditing(!isEditing);
    setIsSettingOpened(!isSettingOpened);
  };
  // 업데이트 컴포넌트 수정
  const handleButtonClick = async () => {
    if (isEditing) {
      const todoSnap: any = await getDoc(todoRef);
      const getUpdateContents = todoSnap.data().update_list.slice().reverse();

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
        update_list: newUpdateContents.slice().reverse(),
      });
      setIsSettingOpened(!isSettingOpened);
    }
    setOriginalMarkdownContent(markdownContent);
    setIsEditing(!isEditing);
  };
  // 업데이트 컴포넌트 삭제
  const handleDeleteClick = async () => {
    const todoSnap: any = await getDoc(todoRef);
    const getUpdateContents = todoSnap.data().update_list.slice().reverse();
    const newUpdateContents = getUpdateContents
      .filter((_: object, index: number) => index !== updateIndex)
      .slice()
      .reverse();
    await updateDoc(todoRef, {
      update_list: newUpdateContents,
    });
    setIsSettingOpened(!isSettingOpened);
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
          <button
            type="button"
            onClick={() => setIsSettingOpened(!isSettingOpened)}
          >
            <img src={settingIcon} alt="설정" />
          </button>
          {isSettingOpened && (
            <ChangeUpdateModal>
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
      <MDEditor
        value={markdownContent}
        onChange={handleMarkdownChange}
        preview={isEditing ? "edit" : "preview"}
      />
    </UpdateContent>
  );
}
