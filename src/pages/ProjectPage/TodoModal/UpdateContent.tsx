import React, { useEffect, useState } from "react";
import MDEditor from "@uiw/react-md-editor";
import styled from "styled-components";
import { getDoc, updateDoc } from "firebase/firestore";
import { useRecoilValue } from "recoil";
import dotsIcon from "../../../assets/icons/dots.svg";
import yearMonthDayFormat from "../../../utils/yearMonthDayFormat";
import userListState from "../../../recoil/atoms/userList/userListState";
import TodoUpdateMoreModal from "./TodoUpdateMoreModal";
import ConfirmBtn from "../../../components/layout/ConfirmBtnLayout";

const UpdateListHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0.5rem;
  height: 2rem;
`;
const ManagedUser = styled.div`
  display: flex;
  font-size: 1rem;
  font-weight: 600;
`;
const SettingContainer = styled.div`
  display: flex;
  align-items: center;
  position: relative;
`;

const UpdateContent = styled.div`
  margin: 0.5rem 0;
  border-radius: 10px;
  background-color: ${(props) => props.theme.mainWhite};
  padding: 0.5rem 0;
`;

const CustomMDEditor = styled.div`
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  .w-md-editor-preview {
    padding: 10px;
    p {
      font-size: 14px !important;
      font-family: "Helvetica Neue", Helvetica, Arial, sans-serif !important;
      line-height: 21px;
    }
  }
  .w-md-editor-text {
    line-height: unset;
  }
  .w-md-editor .title {
    line-height: unset !important;
    font-size: unset !important;
    font-weight: unset !important;
  }
`;

export default function UpdateContentBox({ todoRef, data, updateIndex }: any) {
  const [markdownContent, setMarkdownContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isSettingOpened, setIsSettingOpened] = useState(false);
  const [areButtonsShown, setAreButtonsShown] = useState(false);

  const userListData = useRecoilValue(userListState);
  const creatorData = userListData.get(data.writer);

  const handleMarkdownChange = (edit: any) => {
    setMarkdownContent(edit);
  };
  // 업데이트 컴포넌트 변경 취소
  const handleCancleClick = () => {
    setIsEditing(!isEditing);
    setIsSettingOpened(false);
    setAreButtonsShown(!areButtonsShown);
  };
  // 업데이트 컴포넌트 수정
  const handleModifyClick = async () => {
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
    setIsSettingOpened(false);
    setIsEditing(!isEditing);
    setAreButtonsShown(!areButtonsShown);
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
            src={creatorData.profile_img_URL}
            alt="프로필사진"
            style={{
              width: "1.5rem",
              height: "1.5rem",
              objectFit: "cover",
              borderRadius: "50%",
              margin: "0 0.5rem 0 0",
            }}
          />
          {creatorData.name}
        </ManagedUser>
        <SettingContainer>
          {areButtonsShown && (
            <div>
              <ConfirmBtn
                type="submit"
                onClick={handleModifyClick}
                $dynamicWidth="3.5rem"
                $dynamicHeight="2rem"
                style={{ fontSize: "0.9rem" }}
              >
                <span>변경</span>
              </ConfirmBtn>
              <ConfirmBtn
                type="submit"
                onClick={handleCancleClick}
                $dynamicWidth="3.5rem"
                $dynamicHeight="2rem"
                $dynamicMargin="0 0.7rem 0 0.3rem"
                $dynamicColor="#F9F9F9"
                $fontColor="#7064FF"
                style={{ fontSize: "0.9rem", border: "1px solid #7064FF" }}
              >
                <span>취소</span>
              </ConfirmBtn>
            </div>
          )}
          <div style={{ fontSize: "0.8rem", color: "gray" }}>
            {yearMonthDayFormat(data.created_date.seconds)}
          </div>
          <button
            type="button"
            onClick={() => setIsSettingOpened(!isSettingOpened)}
            style={{ margin: "0 0 0 0.5rem" }}
          >
            <img
              src={dotsIcon}
              alt="설정"
              style={{
                margin: "0 0.3rem 0 0.5rem",
                width: "1rem",
                height: "1rem",
              }}
            />
          </button>
          <TodoUpdateMoreModal
            isShow={isSettingOpened}
            setIsShow={setIsSettingOpened}
            handleDeleteClick={handleDeleteClick}
            handleModifyClick={handleModifyClick}
          />
        </SettingContainer>
      </UpdateListHeader>
      {isEditing ? (
        <MDEditor
          value={markdownContent}
          onChange={handleMarkdownChange}
          preview={isEditing ? "edit" : "preview"}
          hideToolbar={false}
          style={{ height: "5rem" }}
        />
      ) : (
        <CustomMDEditor>
          <MDEditor
            style={{ fontFamily: "Roboto" }}
            value={markdownContent}
            onChange={handleMarkdownChange}
            preview={isEditing ? "edit" : "preview"}
            // eslint-disable-next-line react/jsx-boolean-value
            hideToolbar={true}
          />
        </CustomMDEditor>
      )}
    </UpdateContent>
  );
}
