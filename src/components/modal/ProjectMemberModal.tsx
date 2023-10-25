/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import { doc, getDoc } from "firebase/firestore";
import { useRecoilValue } from "recoil";
import { db } from "../../firebaseSDK";
import { ModalArea, ModalTitle } from "../layout/ModalCommonLayout";
import rightArrow from "../../assets/icons/rightArrow.svg";
import InputCommon from "../layout/InputCommonLayout";
import ConfirmBtn from "../layout/ConfirmBtnLayout";
import projectState from "../../recoil/atoms/project/projectState";

const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
  // 모달 컴포넌트 영역 클릭시 클릭 이벤트가 부모로 전달되어 컴포넌트가 닫히는 현상 수정
  event.stopPropagation();
};

const ModalScrollContainer = styled.div`
  height: 13rem;
  width: 100%;
  overflow: scroll;
`;
const ModalTeamMembers = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  justify-content: center;
  align-items: start;
`;

const ModalMemberContainer = styled.div`
  width: 100%;
  padding: 0.3rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

const UserImage = styled.img`
border-radius: 50%;
width:80%
height:80%
`;

const UserName = styled.div`
  text-align: center;
  font-weight: 700;
`;

const BtnBox = styled.span`
  display: flex;
`;
const InviteBtn = styled.button`
  display: flex;
  margin: 1rem 1rem 0 0;
`;
const GetOutBtn = styled.button`
  display: flex;
  margin: 1rem 0 0 0;
`;

const BtnActionContainer = styled.div``;
const InviteContainer = styled.div``;
const GetOutContainer = styled.div`
  display: flex;
  justify-content: space-around;
`;
const WaitingList = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: 0 0 0.9rem;
`;
const WaitingName = styled.span`
  width: 50%;
`;

export default function ProjectMember() {
  const { projectData } = useRecoilValue(projectState);
  const userList = projectData.user_list;
  const [userData, setUserData] = useState<any[]>([]);
  const [isOpened, setIsOpened] = useState(false);
  const [modalIndex, setModalIndex] = useState();

  // 모달 열고 닫기
  const handleInviteClick = () => {};
  const handleGetOutClick = () => {};

  // user_list 통해 user 데이터 가져오기
  useEffect(() => {
    const fetchData = async () => {
      const data = await Promise.all(
        userList.map(async (userId: string) => {
          const userRef = doc(db, "user", userId);
          const userSnap: any = await getDoc(userRef);
          return {
            userImage: userSnap.data().profile_img_URL,
            userName: userSnap.data().name,
          };
        }),
      );
      setUserData(data);
    };

    fetchData();
  }, [userList]);

  // url에서 프로젝트 아이디 가져오기
  const { pathname } = useLocation();
  // 링크 복사
  const handleCopyClipBoard = async (id: string) => {
    //   await navigator.clipboard.writeText(`calit-2f888.web.app/${id}`);
    await navigator.clipboard.writeText(`localhost:3000${id}`);
  };

  return (
    <ModalArea $dynamicWidth="" $dynamicHeight="auto" onClick={handleClick}>
      <ModalTitle>ProjectMember</ModalTitle>
      <ModalScrollContainer>
        <ModalTeamMembers>
          {userData.map((user: any) => (
            <ModalMemberContainer>
              <UserImage src={user.userImage} alt="사진" />
              <UserName>{user.userName}</UserName>
            </ModalMemberContainer>
          ))}
        </ModalTeamMembers>
      </ModalScrollContainer>
      <BtnBox>
        <InviteBtn type="button" onClick={handleInviteClick}>
          초대하기
          <img src={rightArrow} alt="열기" />
        </InviteBtn>
        <GetOutBtn type="button" onClick={handleGetOutClick}>
          내보내기
          <img src={rightArrow} alt="열기" />
        </GetOutBtn>
      </BtnBox>
      <InviteContainer>
        <InputCommon
          style={{ margin: "1rem 0 0" }}
          $dynamicWidth="100%"
          placeholder="팀원의 Gmail을 입력해주세요"
        />
        <div style={{ fontWeight: 700, margin: "1.5rem 0 0.3rem" }}>
          초대 대기열
        </div>
        <WaitingList>
          <WaitingName>ovo10203</WaitingName>
          <WaitingName>ovo10203</WaitingName>
          <WaitingName>ovo10203</WaitingName>
        </WaitingList>
        <button
          type="button"
          onClick={() => handleCopyClipBoard(pathname)}
          style={{ fontWeight: 700 }}
        >
          🔗Copy Link
        </button>
      </InviteContainer>
      <GetOutContainer>
        <div style={{ margin: "1rem 0" }}>
          <select style={{ height: "100%" }}>
            <option value="">이메일을 선택해주세요</option>
            <option value="1">ovo10203@gmail.com</option>
          </select>
          <ConfirmBtn $dynamicWidth="4rem">확인</ConfirmBtn>
        </div>
      </GetOutContainer>
    </ModalArea>
  );
}
