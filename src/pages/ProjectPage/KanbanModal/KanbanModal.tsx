import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebaseSDK";
import kanbanState from "../../../recoil/atoms/kanban/kanbanState";
import Stage from "./Stage";
import yearMonthDayFormat from "../../../utils/yearMonthDayFormat";
import trashIcon from "../../../assets/icons/trashIcon.svg";
import {
  ProjectModalLayout,
  ProjectModalTabBackground,
  ProjectModalTabText,
  ProjectModalTabBox,
  ProjectModalContentBox,
} from "../../../components/layout/ProjectModalLayout";

const ProjectKanbanBox = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 1rem;
`;

const ProjectKanbanInfoBox = styled.div``;

const ProjectKanbanInfoInnerBox = styled.div`
  display: flex;
  justify-content: space-between;
`;

const ProjectKanbanTrashIcon = styled.img`
  z-index: 2;
  cursor: pointer;
  padding: 0 1rem;
`;

const ProjectKanbanProgressBox = styled.div``;

const ProjectKanbanInfoParagraph = styled.p`
  font-weight: bold;
  font-size: 1.5rem;
`;

const ProjectKanbanDateParagraph = styled.p`
  font-size: 0.75rem;
`;

type Props = {
  kanbanTabColor: string;
  isKanbanShow: boolean;
};

export default function KanbanModal({ kanbanTabColor, isKanbanShow }: Props) {
  const navigate = useNavigate();

  const kanbanDataState = useRecoilValue(kanbanState);
  const [lastKanbanId, setLastkanbanId] = useState("");

  const projectID = window.location.pathname.substring(1);
  const urlQueryString = new URLSearchParams(window.location.search);
  const kanbanId = isKanbanShow
    ? String(urlQueryString.get("kanbanID"))
    : "null";

  const currentKanban = kanbanDataState.get(kanbanId);

  useEffect(() => {
    if (!isKanbanShow) {
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

  if (!isKanbanShow) {
    return (
      <ProjectModalLayout $isShow={isKanbanShow}>
        <ProjectModalTabBox $marginLeft={10.75}>
          <ProjectModalTabBackground $color={kanbanTabColor} />
          <ProjectModalTabText $top={0.4} $left={2.8}>
            Kanban
          </ProjectModalTabText>
        </ProjectModalTabBox>
        <ProjectModalContentBox>
          <ProjectKanbanBox>
            <ProjectKanbanInfoBox>
              <ProjectKanbanInfoInnerBox>
                <ProjectKanbanInfoParagraph>
                  {kanbanDataState.get(lastKanbanId)?.name}
                </ProjectKanbanInfoParagraph>
                <ProjectKanbanTrashIcon
                  src={trashIcon}
                  alt="칸반 삭제"
                  onClick={() => handleDelete()}
                />
              </ProjectKanbanInfoInnerBox>
              <ProjectKanbanDateParagraph>
                {`${yearMonthDayFormat(
                  kanbanDataState.get(lastKanbanId)?.created_date.seconds,
                )} - ${yearMonthDayFormat(
                  kanbanDataState.get(lastKanbanId)?.end_date.seconds,
                )}`}
              </ProjectKanbanDateParagraph>
            </ProjectKanbanInfoBox>
            <ProjectKanbanProgressBox>
              progress bar 들어갈 공간
            </ProjectKanbanProgressBox>
          </ProjectKanbanBox>
          {kanbanDataState.get(lastKanbanId) ? (
            <Stage
              stageLists={kanbanDataState.get(lastKanbanId).stage_list}
              isKanbanShow={isKanbanShow}
            />
          ) : null}
        </ProjectModalContentBox>
      </ProjectModalLayout>
    );
  }

  if (!currentKanban) {
    return (
      <ProjectModalLayout $isShow={isKanbanShow}>
        <ProjectModalTabBox $marginLeft={10.75}>
          <ProjectModalTabBackground $color={kanbanTabColor} />
          <ProjectModalTabText $top={0.4} $left={2.8}>
            Kanban
          </ProjectModalTabText>
        </ProjectModalTabBox>
        <ProjectModalContentBox>에러페이지 추가 예정</ProjectModalContentBox>
      </ProjectModalLayout>
    );
  }

  return (
    <ProjectModalLayout $isShow={isKanbanShow}>
      <ProjectModalTabBox $marginLeft={10.75}>
        <ProjectModalTabBackground $color={kanbanTabColor} />
        <ProjectModalTabText $top={0.4} $left={2.8}>
          Kanban
        </ProjectModalTabText>
      </ProjectModalTabBox>
      <ProjectModalContentBox>
        <ProjectKanbanBox>
          <ProjectKanbanInfoBox>
            <ProjectKanbanInfoInnerBox>
              <ProjectKanbanInfoParagraph>
                {currentKanban.name}
              </ProjectKanbanInfoParagraph>
              <ProjectKanbanTrashIcon
                src={trashIcon}
                alt="칸반 삭제"
                onClick={() => handleDelete()}
              />
            </ProjectKanbanInfoInnerBox>
            <ProjectKanbanDateParagraph>
              {`${yearMonthDayFormat(
                currentKanban.created_date.seconds,
              )} - ${yearMonthDayFormat(currentKanban.end_date.seconds)}`}
            </ProjectKanbanDateParagraph>
          </ProjectKanbanInfoBox>
          <ProjectKanbanProgressBox>
            progress bar 들어갈 공간
          </ProjectKanbanProgressBox>
        </ProjectKanbanBox>
        <Stage
          stageLists={currentKanban.stage_list}
          isKanbanShow={isKanbanShow}
        />
      </ProjectModalContentBox>
    </ProjectModalLayout>
  );
}
