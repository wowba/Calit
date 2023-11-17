import React, { useState, KeyboardEvent } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import { doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { useRecoilValue } from "recoil";
import Swal from "sweetalert2";

import { db } from "../../firebaseSDK";
import { ModalArea, ModalTitle } from "../layout/ModalCommonLayout";
import rightArrow from "../../assets/icons/rightArrow.svg";
import ConfirmBtn from "../layout/ConfirmBtnLayout";
import projectState from "../../recoil/atoms/project/projectState";
import handleCopyClipBoard from "../../utils/handleCopyClipBoard";
import closeIcon from "../../assets/icons/closeIcon.svg";
import userState from "../../recoil/atoms/login/userDataState";
import CommonSelectMemberLayout from "../layout/CommonSelectMemberLayout";
import CommonInputLayout from "../layout/CommonInputLayout";
import userListState from "../../recoil/atoms/userList/userListState";

const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
  // 모달 컴포넌트 영역 클릭시 클릭 이벤트가 부모로 전달되어 컴포넌트가 닫히는 현상 수정
  event.stopPropagation();
};

const ModalScrollContainer = styled.div`
  height: 13rem;
  width: 100%;
  overflow: scroll;
  &::-webkit-scrollbar {
    width: 8px;
    overflow-y: scroll;
    border-radius: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.3);
    border-radius: 6px;
  }
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
  width: 3.5rem;
  height: 3.5rem;
  object-fit: cover;
`;

const UserName = styled.div`
  text-align: center;
  font-weight: 400;

  font-size: ${(props) => props.theme.Fs.default};
`;

const BtnBox = styled.span`
  display: flex;
`;

interface Props {
  $modalIndex: number;
}
const InviteBtn = styled.button<Props>`
  display: flex;
  margin: 1rem 1rem 0 0;
  > img {
    transition: transform 0.3s ease;
    ${({ $modalIndex }) => $modalIndex === 1 && "transform: rotate(90deg);"}
  }

  font-size: ${(props) => props.theme.Fs.default};
`;
const GetOutBtn = styled.button<Props>`
  display: flex;
  margin: 1rem 0 0;
  > img {
    transition: transform 0.3s ease;
    ${({ $modalIndex }) => $modalIndex === 2 && "transform: rotate(90deg);"}
  }
  font-size: ${(props) => props.theme.Fs.default};
`;

const BtnActionContainer = styled.div`
  padding: 1.5rem 0 1rem;
`;
const InviteContainer = styled.div`
  display: flex;
  align-items: center;
`;
const GetOutContainer = styled.div`
  display: flex;
  justify-content: space-around;
`;

const WaitingList = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: column-reverse;
  margin: 0 0 0.9rem;

  font-size: ${(props) => props.theme.Fs.default};
  color: ${(props) => props.theme.Color.mainGray};
`;
const WaitingContainer = styled.div`
  display: flex;
`;
const WaitingName = styled.span`
  margin: 0 0.3rem 0.3rem;
`;

export default function ProjectMemberModal() {
  const { invited_list: invitedList, creater } =
    useRecoilValue(projectState).projectData;

  const [inputEmailValue, setInputEmailValue] = useState("");
  const [modalIndex, setModalIndex] = useState(0);

  const { email: userId } = useRecoilValue(userState).userData;
  const [nameList, setNameList] = useState<any[]>([]);

  const userListData = useRecoilValue(userListState);
  const userData: { userImage: string; userName: string }[] = [];
  const userList: string[] = [];

  // Key prop warning
  // 자꾸 key prop 에러가 발생... 해결 방법을 찾지 못함
  userListData.forEach((user) => {
    if (!user.is_kicked) {
      userData.push({
        userImage: user.profile_img_URL,
        userName: user.name,
      });
      userList.push(user.email);
    }
  });

  const filteredUserList = userList.filter((user: string) => user !== creater);

  // 모달 열고 닫기
  const handleInviteClick = () => {
    if (modalIndex === 1) {
      setModalIndex(0);
    } else {
      setModalIndex(1);
    }
  };
  const handleGetOutClick = () => {
    if (modalIndex === 2) {
      setModalIndex(0);
    } else {
      setModalIndex(2);
    }
  };

  // url에서 project id 가져오기 (링크 복사 기능)
  const { pathname } = useLocation();
  const projectId = pathname.substring(1);

  const docRef = doc(db, "project", pathname);
  // 이메일 입력 후 Enter 누를 시 동작
  const handleEnterPress = async (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (inputEmailValue.includes("@gmail.com")) {
        const curInvitedList = [...invitedList];
        if (
          userListData.get(inputEmailValue) ||
          curInvitedList.includes(inputEmailValue)
        ) {
          Swal.fire({
            icon: "error",
            title: "이미 초대된 사용자입니다.",
            text: "같은 사용자를 중복 초대할 수 없습니다.",
          });
          setInputEmailValue("");
          return;
        }

        curInvitedList.push(inputEmailValue);
        await updateDoc(docRef, {
          invited_list: curInvitedList,
          modified_date: serverTimestamp(),
        });
        setInputEmailValue("");
      } else {
        Swal.fire({
          icon: "error",
          title: "gmail 주소를 입력해주세요.",
          text: "프로젝트에 초대할 사용자의 gmail을 입력해주세요.",
        });
        setInputEmailValue("");
      }
    }
  };
  const handleBtnClick = async () => {
    if (inputEmailValue.includes("@gmail.com")) {
      const curInvitedList = [...invitedList];
      curInvitedList.push(inputEmailValue);
      await updateDoc(docRef, {
        invited_list: curInvitedList,
        modified_date: serverTimestamp(),
      });
      setInputEmailValue("");
    } else {
      Swal.fire({
        icon: "error",
        title: "gmail 주소를 입력해주세요.",
        text: "프로젝트에 초대할 사용자의 gmail을 입력해주세요.",
      });
    }
    setInputEmailValue("");
  };

  // 삭제 버튼
  const handleDelete = async (email: string) => {
    const updateInvitedList = invitedList.filter(
      (curEmail: string) => curEmail !== email,
    );
    await updateDoc(docRef, {
      invited_list: updateInvitedList,
      modified_date: serverTimestamp(),
    });
  };

  // 내보내기
  const handleUserList = async () => {
    if (nameList) {
      // 유저의 project_list에서 프로젝트 삭제
      nameList.map(async (selected: any) => {
        const userRef = doc(db, "user", selected.value);
        const userSnap: any = await getDoc(userRef);
        const projectList = userSnap.data().project_list;
        if (projectList.includes(projectId)) {
          const updateProjectList = projectList.filter(
            (project: string) => project !== projectId,
          );
          await updateDoc(userRef, {
            project_list: updateProjectList,
          });
        }
        // user 의 is_kicked = true 변경
        const projectUserRef = doc(
          db,
          "project",
          projectId,
          "user",
          selected.value,
        );
        await updateDoc(projectUserRef, {
          is_kicked: true,
        });
      });
      // 프로젝트의 user_list에서 유저 삭제
      const valuesArray = nameList.map((item) => item.value);
      const updatedUsers = userList.filter(
        (curUser: string) => !valuesArray.includes(curUser),
      );
      await updateDoc(docRef, {
        user_list: updatedUsers,
        modified_date: serverTimestamp(),
      });
      setNameList([]);
    }
  };

  return (
    <ModalArea $dynamicWidth="" $dynamicHeight="auto" onClick={handleClick}>
      <ModalTitle>ProjectMember</ModalTitle>
      <ModalScrollContainer>
        <ModalTeamMembers>
          {userData.map((user: any) => (
            <ModalMemberContainer key={user.userImage}>
              <UserImage key={user.userImage} src={user.userImage} alt="사진" />
              <UserName key={user.userName}>{user.userName}</UserName>
            </ModalMemberContainer>
          ))}
        </ModalTeamMembers>
      </ModalScrollContainer>
      <BtnBox>
        <InviteBtn
          $modalIndex={modalIndex}
          type="button"
          onClick={handleInviteClick}
        >
          초대하기
          <img src={rightArrow} alt="열기" />
        </InviteBtn>
        {creater === userId && (
          <GetOutBtn
            $modalIndex={modalIndex}
            type="button"
            onClick={handleGetOutClick}
          >
            내보내기
            <img src={rightArrow} alt="열기" />
          </GetOutBtn>
        )}
      </BtnBox>
      <BtnActionContainer>
        {modalIndex === 1 && (
          <>
            <InviteContainer>
              <CommonInputLayout
                placeholder="팀원의 Gmail을 입력해주세요"
                $dynamicWidth="100%"
                $dynamicHeight="2rem"
                $dynamicFontSize="0.9rem"
                $dynamicPadding="0px 4px"
                style={{ backgroundColor: "#efefef" }}
                value={inputEmailValue}
                onChange={(e) => setInputEmailValue(e.target.value)}
                onKeyUp={handleEnterPress}
              />
              <ConfirmBtn
                $dynamicWidth="4rem"
                $dynamicHeight="2rem"
                $dynamicMargin="2px"
                onClick={handleBtnClick}
              >
                확인
              </ConfirmBtn>
            </InviteContainer>
            <div
              style={{
                fontWeight: 700,
                margin: "1.5rem 0 0.3rem",
                fontSize: "0.875rem",
              }}
            >
              초대 대기열
            </div>
            <WaitingList>
              {invitedList.length === 0 ? "초대된 사람이 없습니다." : ""}
              {invitedList.map((email: string) => (
                <WaitingContainer key={email}>
                  <WaitingName>{email.split("@")[0]}</WaitingName>
                  <button type="button" onClick={() => handleDelete(email)}>
                    <img src={closeIcon} alt="삭제" />
                  </button>
                </WaitingContainer>
              ))}
            </WaitingList>
            <button
              type="button"
              onClick={() => handleCopyClipBoard(projectId)}
              style={{ fontWeight: 400, fontSize: "0.875rem" }}
            >
              🔗 Copy Link
            </button>
          </>
        )}
        {modalIndex === 2 && (
          <GetOutContainer>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              {/* <SelectInput
                style={{ height: "100%", display: "inline-block" }}
                onChange={(e) => setSelectedUser(e.target.value)}
                value={selectedUser}
              >
                <option value="">이메일을 선택해주세요</option>
                {userList.map(
                  (email: string) =>
                    email !== userId && (
                      <option key={email} value={email}>
                        {email}
                      </option>
                    ),
                )}
              </SelectInput> */}
              <CommonSelectMemberLayout
                userList={nameList}
                setUserList={setNameList}
                onBlur={() => false}
                customUserData={filteredUserList}
                isCustomUserData
              />
              <ConfirmBtn
                $dynamicWidth="3rem"
                $dynamicHeight="2rem"
                onClick={handleUserList}
                style={{ margin: "2px" }}
              >
                확인
              </ConfirmBtn>
            </div>
          </GetOutContainer>
        )}
      </BtnActionContainer>
    </ModalArea>
  );
}
