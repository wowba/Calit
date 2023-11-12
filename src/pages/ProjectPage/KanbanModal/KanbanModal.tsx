/* eslint-disable no-alert */
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { doc, updateDoc } from "firebase/firestore";

import { db } from "../../../firebaseSDK";
import kanbanState from "../../../recoil/atoms/kanban/kanbanState";
import yearMonthDayFormat from "../../../utils/yearMonthDayFormat";
import trashIcon from "../../../assets/icons/trashIcon.svg";
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

const KanbanContainer = styled(ProjectModalContentBox)`
  padding: 2rem 2rem 0.5rem 2rem;
`;

const KanbanInfoLayout = styled.div`
  display: flex;
  justify-content: space-between;
`;

const KanbanInfoBox = styled.div``;

const KanbanInfoInnerBox = styled.div`
  display: flex;
  justify-content: space-between;
`;

const KanbanTrashIcon = styled.img`
  z-index: 2;
  cursor: pointer;
  padding: 0 1rem;
`;

const KanbanProgressBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
`;

const KanbanProgress = styled.progress`
  width: 15rem;
`;

const KanbanDateParagraph = styled.p`
  font-size: 0.75rem;
`;

type Props = {
  isKanbanShow: boolean;
};

export default function KanbanModal({ isKanbanShow }: Props) {
  const navigate = useNavigate();
  const kanbanNameInputRef = useRef<HTMLInputElement>(null);

  const kanbanDataState = useRecoilValue(kanbanState);
  const [lastKanbanId, setLastkanbanId] = useState("");

  const [progress, setProgress] = useState([0, 0]);
  const [inputKanbanName, setInputKanbanName] = useState("");

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
  }, [kanbanId, isKanbanShow, currentKanban]);

  const handleDelete = async () => {
    const projectRef = doc(db, "project", projectId);
    const deletedKanbanInfo = {
      id: kanbanId,
      name: currentKanban.name,
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

    navigate(`/${projectId}`);
  };

  const handleKanbanInputBlur = async () => {
    if (inputKanbanName) {
      await updateDoc(kanbanRef, {
        name: inputKanbanName,
      });
    } else {
      alert("이름을 입력해 주세요");
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
      <KanbanContainer
        id="kanbanModalContentBox"
        style={{
          boxShadow: isKanbanShow
            ? "none"
            : "0px 0px 10px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <KanbanInfoLayout>
          <KanbanInfoBox>
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
              <KanbanTrashIcon
                src={trashIcon}
                alt="칸반 삭제"
                onClick={handleDelete}
              />
            </KanbanInfoInnerBox>
            <KanbanDateParagraph>
              {`${yearMonthDayFormat(
                currentKanban.start_date.seconds,
              )} - ${yearMonthDayFormat(
                currentKanban.end_date.seconds - 60 * 60 * 24,
              )}`}
            </KanbanDateParagraph>
          </KanbanInfoBox>
          <KanbanProgressBox>
            <KanbanProgress value={progress[1]} max={progress[0]} />
            {progress[1]} / {progress[0]}
          </KanbanProgressBox>
        </KanbanInfoLayout>
        <KanbanStageBox
          stageList={currentKanban.stage_list}
          isKanbanShow={isKanbanShow}
          setProgress={setProgress}
        />
      </KanbanContainer>
    </ProjectModalLayout>
  );
}
