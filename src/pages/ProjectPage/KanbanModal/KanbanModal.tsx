/* eslint-disable no-alert */
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
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

const KanbanContainer = styled(ProjectModalContentBox)`
  padding: 2rem;
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

  useEffect(() => {
    if (!isKanbanShow || kanbanId === "null" || !currentKanban) {
      return;
    }
    setLastkanbanId(kanbanId);
    setInputKanbanName(currentKanban.name);
  }, [kanbanId, isKanbanShow, currentKanban]);

  const handleDelete = async () => {
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

  return (
    <ProjectModalLayout $isShow={isKanbanShow}>
      <KanbanContainer id="kanbanModalContentBox">
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
                currentKanban.created_date.seconds,
              )} - ${yearMonthDayFormat(currentKanban.end_date.seconds)}`}
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
