import React, { useState, KeyboardEvent, useEffect } from "react";
import styled from "styled-components";
import {
  // arrayUnion,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { useRecoilValue } from "recoil";
import { ModalArea, ModalTitle } from "../layout/ModalCommonLayout";
import CommonInputLayout from "../layout/CommonInputLayout";
import ConfirmBtn from "../layout/ConfirmBtnLayout";
import closeIcon from "../../assets/icons/closeIcon.svg";
import { db } from "../../firebaseSDK";
import projectState from "../../recoil/atoms/project/projectState";

const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
  // 모달 컴포넌트 영역 클릭시 클릭 이벤트가 부모로 전달되어 컴포넌트가 닫히는 현상 수정
  event.stopPropagation();
};

const BookMarkInputBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const BookMarkLinksBox = styled.ul`
  overflow: auto;
  // height: auto;
  height: 100%;
`;
const BookMarkLinksContentBox = styled.li`
  // display: flex;
  list-style-position: inside;
`;
const BookMarkLinksDeleteIconBox = styled.img`
  display: inline-block;
  padding-left: 10px;
`;

export default function Bookmark() {
  const { bookmark_list: bookMarkList } =
    useRecoilValue(projectState).projectData;
  const [inputUrlValue, setInputUrlValue] = useState("");
  const [inputTextValue, setInputTextValue] = useState("");
  // const [bookMarkData, setBookMarkData] = useState<any>(new Map());
  const [bookMarkData, setBookMarkData] = useState<any>([]);
  const [bookMarkName, setBookMarkName] = useState("");
  const urlQueryString = new URLSearchParams(window.location.search);
  const projectId = window.location.pathname.substring(1);
  const kanbanId = String(urlQueryString.get("kanbanID"));
  const todoId = String(urlQueryString.get("todoID"));
  const projectRef = doc(db, "project", projectId);

  useEffect(() => {
    setInputUrlValue(window.location.href);

    async function fetchBookMarkName() {
      if (todoId !== "null") {
        const todoRef = doc(
          db,
          "project",
          projectId,
          "kanban",
          kanbanId,
          "todo",
          todoId,
        );
        const todoSnap = await getDoc(todoRef);
        console.log("todo ", todoSnap.data());
        setBookMarkName(
          !inputTextValue ? todoSnap.data()?.name : inputTextValue,
        );
      } else if (kanbanId !== "null") {
        const kanbanRef = doc(db, "project", projectId, "kanban", kanbanId);
        const kanbanSnap = await getDoc(kanbanRef);
        console.log("kanban ", kanbanSnap.data());
        setBookMarkName(
          !inputTextValue ? kanbanSnap.data()?.name : inputTextValue,
        );
      } else {
        // const projectRef = doc(db, "project", projectId);
        const projectSnap = await getDoc(projectRef);
        console.log("project ", projectSnap.data());
        setBookMarkName(
          !inputTextValue ? projectSnap.data()?.name : inputTextValue,
        );
      }
    }
    fetchBookMarkName();
  }, [window.location.pathname]);

  useEffect(() => {}, [bookMarkName]);

  // const bookmarkCheck = (path: string) => {
  //   const result = Object.values(bookMarkData).find(
  //     (singleBookMarkPath) => singleBookMarkPath === path,
  //   );
  //   return result;
  // };

  const handleBtnClick = async () => {
    if (inputUrlValue) {
      // if (bookmarkCheck(inputUrlValue)) {
      //   console.log("hi");
      // }

      if (inputTextValue) {
        setBookMarkName(inputTextValue);
      }

      const curBookMarkList = [...bookMarkList];
      curBookMarkList.push({ bookMarkName, inputUrlValue });
      console.log(curBookMarkList);

      const booklist = Object.values(curBookMarkList);
      console.log(booklist);

      setBookMarkData(curBookMarkList);
      // console.log(bookMarkData);
      // const stringifyBookMarkData = JSON.stringify([...bookMarkData]);
      // console.log(stringifyBookMarkData);
      // const parseBookMarkData = JSON.parse(stringifyBookMarkData);
      // console.log(parseBookMarkData);

      // 추가되게끔 고치기

      curBookMarkList.map((cu: any) =>
        console.log(cu.bookMarkName, cu.inputUrlValue),
      );

      await updateDoc(projectRef, {
        bookmark_list: curBookMarkList,
        modified_date: serverTimestamp(),
      });

      setInputUrlValue("");
      setInputTextValue("");
    } else {
      setInputUrlValue("");
      // eslint-disable-next-line no-alert
      alert("URL을 입력해주세요");
    }
  };

  const handleEnterPress = async (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (inputUrlValue) {
        const URLList = [...bookMarkData];
        // URLList.push(inputUrlValue);

        setBookMarkData(URLList);
        setInputUrlValue("");
      } else {
        setInputUrlValue("");
        // eslint-disable-next-line no-alert
        alert("URL을 입력해주세요");
      }
    }
  };

  const handleClickDelete = async (path: string) => {
    // const target = bookMarkData
    console.log(bookMarkData, path);
    const target = bookMarkData.findIndex(
      (item: any) => item.inputUrlValue === path,
    );
    console.log(target);

    bookMarkData.splice(target, 1);
    setBookMarkData(bookMarkData);

    await updateDoc(projectRef, {
      bookmark_list: bookMarkData,
      modified_date: serverTimestamp(),
    });
  };

  return (
    <ModalArea $dynamicWidth="" $dynamicHeight="auto" onClick={handleClick}>
      <ModalTitle>Links</ModalTitle>
      <BookMarkInputBox>
        <CommonInputLayout
          placeholder="URL을 입력해주세요"
          $dynamicWidth="100%"
          $dynamicHeight="2rem"
          $dynamicFontSize="0.9rem"
          $dynamicPadding="4px 4px"
          style={{ backgroundColor: "#efefef", marginBottom: "4px" }}
          value={inputUrlValue}
          onChange={(e) => setInputUrlValue(e.target.value)}
          // onKeyDown={handleEnterPress}
          // readOnly
        />
        <CommonInputLayout
          placeholder="대체 텍스트를 입력해주세요"
          $dynamicWidth="100%"
          $dynamicHeight="2rem"
          $dynamicFontSize="0.9rem"
          $dynamicPadding="4px 4px"
          style={{ backgroundColor: "#efefef", marginBottom: "4px" }}
          value={inputTextValue}
          onChange={(e) => setInputTextValue(e.target.value)}
          onKeyDown={handleEnterPress}
        />
        <ConfirmBtn
          $dynamicWidth="4rem"
          $dynamicHeight="2rem"
          $dynamicMargin="2px"
          onClick={handleBtnClick}
        >
          확인
        </ConfirmBtn>
      </BookMarkInputBox>
      <BookMarkLinksBox>
        {bookMarkData.map((singleBookMark: any) => (
          <BookMarkLinksContentBox key={singleBookMark.inputUrlValue}>
            {singleBookMark.bookMarkName}
            <BookMarkLinksDeleteIconBox
              src={closeIcon}
              onClick={() => handleClickDelete(singleBookMark.inputUrlValue)}
            />
          </BookMarkLinksContentBox>
        ))}
      </BookMarkLinksBox>
    </ModalArea>
  );
}
