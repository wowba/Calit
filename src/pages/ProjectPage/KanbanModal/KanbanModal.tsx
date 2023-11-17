import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { doc, updateDoc } from "firebase/firestore";

import Swal from "sweetalert2";
import { db } from "../../../firebaseSDK";
import kanbanState from "../../../recoil/atoms/kanban/kanbanState";
import yearMonthDayFormat from "../../../utils/yearMonthDayFormat";
import {
  ProjectModalLayout,
  ProjectModalContentBox,
} from "../../../components/layout/ProjectModalLayout";
import ErrorPage from "../../../components/ErrorPage";
import KanbanStageBox from "./KanbanStageBox";
import CommonInputLayout from "../../../components/layout/CommonInputLayout";
import projectState from "../../../recoil/atoms/project/projectState";
import todoLoaded from "../../../recoil/atoms/sidebar/todoLoaded";
import LoadingPage from "../../../components/LoadingPage";
import recentKanbanState from "../../../recoil/atoms/sidebar/recentKanbanState";
import UserSelectLayout from "./UserSelectLayout";
import dots from "../../../assets/icons/dots.svg";
import KanbanMoreModal from "./KanbanMoreModal";
import asyncDelay from "../../../utils/asyncDelay";

const KanbanContainer = styled(ProjectModalContentBox)<{
  $isKanbanShow: boolean;
}>`
  padding: 2rem 2rem 0.5rem 2rem;
`;

const KanbanInfoLayout = styled.div`
  display: flex;
  justify-content: space-between;
`;

const KanbanInfoBox = styled.div`
  display: flex;
  gap: 0.875rem;
`;

const KanbanTitlePointer = styled.div`
  margin: 0.4rem 0 0 0;

  width: 0.25rem;
  height: 1.3rem;
  background-color: ${(props) => props.theme.Color.mainColor};

  border-radius: ${(props) => props.theme.Br.small};
`;

const KanbanInfoInnerBox = styled.div`
  display: flex;
  justify-content: space-between;
`;

const KanbanProgressBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;

  > p {
    width: 3rem;
    font-size: ${(props) => props.theme.Fs.modalTitle};
  }
`;

const KanbanProgress = styled.div`
  width: 19rem;
  height: 0.6rem;

  border: ${(props) => props.theme.Border.thickBorder};
  border-radius: ${(props) => props.theme.Br.small};
`;

const KanbanProgressInner = styled.div<{ $percentage: number }>`
  transition: all 0.5s ease;

  width: ${(props) => `${props.$percentage}%`};
  height: 100%;
  background-color: ${(props) => props.theme.Color.mainColor};
  border-radius: ${(props) => props.theme.Br.small};
`;

const KanbanDateParagraph = styled.p`
  font-size: 0.75rem;
  margin: 0 0 0 0.125rem;

  transform: translateY(-0.125rem);
`;

const MoreBtn = styled.img`
  width: 1rem;
  height: 1rem;

  &:hover {
    cursor: pointer;
  }
`;

type Props = {
  isKanbanShow: boolean;
};

export default function KanbanModal({ isKanbanShow }: Props) {
  const navigate = useNavigate();
  const kanbanNameInputRef = useRef<HTMLInputElement>(null);

  const kanbanDataState = useRecoilValue(kanbanState);
  // const userListData = useRecoilValue(userListState);

  const [lastKanbanId, setLastkanbanId] = useState("");

  const [progress, setProgress] = useState([0, 0]);
  const [inputKanbanName, setInputKanbanName] = useState("");
  const [userList, setUserList] = useState<any[]>([]);

  const [isKanbanMoreModalShow, setIsKanbanMoreModalShow] = useState(false);

  const projectId = window.location.pathname.substring(1);
  const urlQueryString = new URLSearchParams(window.location.search);
  const kanbanId = isKanbanShow
    ? String(urlQueryString.get("kanbanID"))
    : "null";
  const kanbanRef = doc(db, "project", projectId, "kanban", kanbanId);

  const currentKanban =
    kanbanDataState.get(kanbanId) || kanbanDataState.get(lastKanbanId);

  const { deleted_kanban_info_list: deletedKanbanIdList } =
    useRecoilValue(projectState).projectData;

  const isLoaded = useRecoilValue(todoLoaded);

  const [recentKanbanId, setRecentKanbanId] = useRecoilState(recentKanbanState);

  useEffect(() => {
    if (!isKanbanShow || kanbanId === "null" || !currentKanban) {
      return;
    }
    setLastkanbanId(kanbanId);
    setInputKanbanName(currentKanban.name);
    setUserList(currentKanban.user_list);
  }, [kanbanId, isKanbanShow, currentKanban]);

  const handleDelete = async () => {
    navigate(`/${projectId}`);
    await asyncDelay(600);
    const projectRef = doc(db, "project", projectId);
    const deletedKanbanInfo = {
      id: kanbanId,
      name: currentKanban.name,
      color: currentKanban.color,
    };
    await updateDoc(projectRef, {
      deleted_kanban_info_list: [deletedKanbanInfo, ...deletedKanbanIdList],
    });
    // 사이드바 최근 칸반 목록에서 삭제
    const newIds = recentKanbanId[projectId].filter(
      (id: string) => id !== kanbanId,
    );
    setRecentKanbanId((prev: any) => ({
      ...prev,
      [projectId]: [...newIds],
    }));

    await updateDoc(kanbanRef, {
      is_deleted: true,
    });

    setIsKanbanMoreModalShow(false);
  };

  const handleKanbanInputBlur = async () => {
    if (inputKanbanName) {
      await updateDoc(kanbanRef, {
        name: inputKanbanName,
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "칸반 이름을 입력해 주세요.",
        text: "칸반을 빈 이름으로 수정할 수 없습니다.",
      });
    }
  };

  if (!currentKanban) {
    return (
      <ProjectModalLayout $isShow={isKanbanShow}>
        <ProjectModalContentBox>
          <ErrorPage isKanban404 />
        </ProjectModalContentBox>
      </ProjectModalLayout>
    );
  }
  if (!isLoaded) {
    return (
      <ProjectModalLayout $isShow>
        <ProjectModalContentBox>
          <LoadingPage />
        </ProjectModalContentBox>
      </ProjectModalLayout>
    );
  }

  return (
    <ProjectModalLayout $isShow={isKanbanShow}>
      <KanbanContainer id="kanbanModalContentBox" $isKanbanShow={isKanbanShow}>
        <KanbanInfoLayout>
          <KanbanInfoBox>
            <KanbanTitlePointer />
            <div>
              <KanbanInfoInnerBox>
                <CommonInputLayout
                  ref={kanbanNameInputRef}
                  value={inputKanbanName}
                  type="text"
                  placeholder="제목을 입력하세요"
                  $dynamicFontSize=" 1.2rem"
                  $dynamicPadding="1rem 0.5rem"
                  style={{ fontWeight: "900" }}
                  onChange={(e) => setInputKanbanName(e.target.value)}
                  onBlur={handleKanbanInputBlur}
                  onKeyUp={(e) => {
                    if (e.key === "Enter") {
                      kanbanNameInputRef.current!.blur();
                    }
                  }}
                />
              </KanbanInfoInnerBox>
              <KanbanDateParagraph>
                {`${yearMonthDayFormat(
                  currentKanban.start_date.seconds,
                )} - ${yearMonthDayFormat(currentKanban.end_date.seconds)}`}
              </KanbanDateParagraph>
            </div>
          </KanbanInfoBox>
          <div
            style={{
              display: "flex",
              gap: "2rem",
              justifyContent: "center",
              alignItems: "center",
              margin: "0 1rem 0 0",
            }}
          >
            <UserSelectLayout
              userList={userList}
              setUserList={setUserList}
              kanbanRef={kanbanRef}
            />
            <KanbanProgressBox>
              <KanbanProgress>
                <KanbanProgressInner
                  $percentage={
                    progress[0] ? (progress[1] / progress[0]) * 100 : 0
                  }
                />
              </KanbanProgress>
              <p>
                {progress[0]
                  ? Math.floor((progress[1] / progress[0]) * 100)
                  : 0}
                %
              </p>
            </KanbanProgressBox>
            <MoreBtn
              src={dots}
              alt="dots"
              onClick={() => setIsKanbanMoreModalShow(true)}
            />
          </div>
        </KanbanInfoLayout>
        <KanbanStageBox
          stageList={currentKanban.stage_list}
          isKanbanShow={isKanbanShow}
          setProgress={setProgress}
        />
      </KanbanContainer>
      <KanbanMoreModal
        isShow={isKanbanMoreModalShow}
        setIsShow={setIsKanbanMoreModalShow}
        handleDeleteKanban={handleDelete}
      />
    </ProjectModalLayout>
  );
}
