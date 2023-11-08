import React, { useState, KeyboardEvent, useEffect } from "react";
import styled from "styled-components";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
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
  overflow: scroll;
  height: 60%;
  margin-top: 5px;
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
    background-color: transparent;
  }
`;
const BookMarkLinksContentBox = styled.li`
  list-style-position: inside;
  padding: 0px 0px 2px 10px;
`;

const BookMarkLinksParagraph = styled.p`
  display: inline;
  cursor: pointer;
`;

const BookMarkLinksDeleteIconBox = styled.img`
  display: inline;
  padding-left: 10px;
`;

export default function Bookmark() {
  const { bookmark_list: bookMarkList } =
    useRecoilValue(projectState).projectData;
  const [inputUrlValue, setInputUrlValue] = useState("");
  const [inputTextValue, setInputTextValue] = useState("");
  const [bookMarkData, setBookMarkData] = useState<any[]>([]);
  const projectId = window.location.pathname.substring(1);
  const projectRef = doc(db, "project", projectId);

  useEffect(() => {
    if (bookMarkList) {
      setBookMarkData([...bookMarkList]);
    }
  }, [window.location.href]);

  const bookmarkCheck = (path: string) => {
    const check = bookMarkData.findIndex((item: any) => item.value === path);
    const result: boolean = check > -1;
    return result;
  };

  const handleBtnClick = async () => {
    if (inputUrlValue) {
      // 같은 주소가 중복해서 북마크 등록되지 않게 검증
      if (bookmarkCheck(inputUrlValue)) {
        // eslint-disable-next-line no-alert
        alert("이미 등록된 주소입니다.");
        return;
      }

      const curBookMarkList = [...bookMarkData];

      if (inputTextValue) {
        curBookMarkList.push({ name: inputTextValue, value: inputUrlValue });
      } else {
        curBookMarkList.push({ name: inputUrlValue, value: inputUrlValue });
      }
      setBookMarkData(curBookMarkList);

      await updateDoc(projectRef, {
        bookmark_list: curBookMarkList,
        modified_date: serverTimestamp(),
      });

      setInputUrlValue("");
      setInputTextValue("");
    } else {
      // eslint-disable-next-line no-alert
      alert("URL 주소를 입력해주세요.");
    }
  };

  const handleEnterPress = async (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleBtnClick();
    }
  };

  const handleClickDelete = async (path: string) => {
    const target = bookMarkData.findIndex((item: any) => item.value === path);

    bookMarkData.splice(target, 1);
    setBookMarkData(bookMarkData);

    await updateDoc(projectRef, {
      bookmark_list: bookMarkData,
      modified_date: serverTimestamp(),
    });
  };

  const handleClickNavigate = (path: string) => {
    if (!path.includes("//")) {
      window.open(`https://${path}`);
    } else {
      window.open(path);
    }
  };

  const lengthChecker = (word: string) => {
    const returnWord = word.length > 30 ? `${word.substring(0, 30)}...` : word;
    return returnWord;
  };

  return (
    <ModalArea
      $dynamicWidth="25rem"
      $dynamicHeight="25rem"
      onClick={handleClick}
    >
      <ModalTitle>Links</ModalTitle>
      <BookMarkInputBox>
        <CommonInputLayout
          placeholder="URL을 입력해주세요"
          $dynamicWidth="100%"
          $dynamicHeight="2rem"
          $dynamicFontSize="0.9rem"
          $dynamicPadding="4px 4px"
          style={{ border: "1px solid black", marginBottom: "4px" }}
          value={inputUrlValue}
          onChange={(e) => setInputUrlValue(e.target.value)}
          onKeyDown={handleEnterPress}
          $isHover
        />
        <CommonInputLayout
          placeholder="대체 텍스트를 입력해주세요"
          $dynamicWidth="100%"
          $dynamicHeight="2rem"
          $dynamicFontSize="0.9rem"
          $dynamicPadding="4px 4px"
          style={{ border: "1px solid black", marginBottom: "4px" }}
          value={inputTextValue}
          onChange={(e) => setInputTextValue(e.target.value)}
          onKeyDown={handleEnterPress}
          $isHover
        />
        <ConfirmBtn
          $dynamicWidth="4rem"
          $dynamicHeight="2rem"
          $dynamicMargin="2px"
          onClick={handleBtnClick}
        >
          등록
        </ConfirmBtn>
      </BookMarkInputBox>
      <BookMarkLinksBox>
        {bookMarkData.map((singleBookMark: any) => (
          <BookMarkLinksContentBox key={singleBookMark.value}>
            <BookMarkLinksParagraph
              onClick={() => handleClickNavigate(singleBookMark.value)}
            >
              {lengthChecker(singleBookMark.name)}
            </BookMarkLinksParagraph>

            <BookMarkLinksDeleteIconBox
              src={closeIcon}
              onClick={() => handleClickDelete(singleBookMark.value)}
            />
          </BookMarkLinksContentBox>
        ))}
      </BookMarkLinksBox>
    </ModalArea>
  );
}
