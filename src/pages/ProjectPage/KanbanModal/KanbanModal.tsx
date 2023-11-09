import React, { useEffect, useState } from "react";
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

const KanbanInfoLayout = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 1rem 1rem 0.5rem 1rem;
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

const KanbanProgressBox = styled.div``;

const KanbanInfoParagraph = styled.p`
  font-weight: bold;
  font-size: 1.5rem;
`;

const KanbanDateParagraph = styled.p`
  font-size: 0.75rem;
`;

type Props = {
  isKanbanShow: boolean;
};

export default function KanbanModal({ isKanbanShow }: Props) {
  const navigate = useNavigate();

  const kanbanDataState = useRecoilValue(kanbanState);
  const [lastKanbanId, setLastkanbanId] = useState("");

  const projectID = window.location.pathname.substring(1);
  const urlQueryString = new URLSearchParams(window.location.search);
  const kanbanId = isKanbanShow
    ? String(urlQueryString.get("kanbanID"))
    : "null";

  const currentKanban =
    kanbanDataState.get(kanbanId) || kanbanDataState.get(lastKanbanId);

  useEffect(() => {
    if (!isKanbanShow || kanbanId === "null") {
      return;
    }
    setLastkanbanId(kanbanId);
  }, [kanbanId, isKanbanShow]);

  const handleDelete = async () => {
    const kanbanRef = doc(db, "project", projectID, "kanban", kanbanId);
    await updateDoc(kanbanRef, {
      is_deleted: true,
    });
    navigate(`/${projectID}`);
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
      <ProjectModalContentBox
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
              <KanbanInfoParagraph>{currentKanban.name}</KanbanInfoParagraph>
              <KanbanTrashIcon
                src={trashIcon}
                alt="칸반 삭제"
                onClick={() => handleDelete()}
              />
            </KanbanInfoInnerBox>
            <KanbanDateParagraph>
              {`${yearMonthDayFormat(
                currentKanban.created_date.seconds,
              )} - ${yearMonthDayFormat(currentKanban.end_date.seconds)}`}
            </KanbanDateParagraph>
          </KanbanInfoBox>
          <KanbanProgressBox>progress bar 들어갈 공간</KanbanProgressBox>
        </KanbanInfoLayout>
        <KanbanStageBox
          stageList={currentKanban.stage_list}
          isKanbanShow={isKanbanShow}
        />
      </ProjectModalContentBox>
    </ProjectModalLayout>
  );
}
