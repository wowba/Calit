import React, { useEffect, useRef, useState } from "react";
import {
  DateSelectArg,
  EventClickArg,
  CalendarOptions,
  EventDropArg,
  EventInput,
  EventContentArg,
} from "@fullcalendar/core";
import styled, { css } from "styled-components";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import momentPlugin from "@fullcalendar/moment";
import interactionPlugin, {
  EventResizeDoneArg,
} from "@fullcalendar/interaction";
import { useRecoilState, useRecoilValue } from "recoil";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { SetURLSearchParams } from "react-router-dom";
import _ from "lodash";

import {
  ProjectModalLayout,
  ProjectModalContentBox,
} from "../../../components/layout/ProjectModalLayout";
import CreateKanbanModal from "./CreateKanbanModal";
import kanbanState from "../../../recoil/atoms/kanban/kanbanState";
import fullCalendarDateFormat from "../../../utils/fullCalendarDateFormat";
import { db } from "../../../firebaseSDK";
import getTextColorByBackgroundColor from "../../../utils/getTextColorByBgColor";
import getBorderColorByBackgroundColor from "../../../utils/getBorderColorByBgColor";
import paint from "../../../assets/icons/Pantone.svg";
import CalendarTutorialModal from "./CalendarTutorialModal";
import recentKanbanState from "../../../recoil/atoms/sidebar/recentKanbanState";
import { ReactComponent as TrashIcon } from "../../../assets/icons/Delete.svg";
import TrashModal from "./TrashModal";

const CalendarBox = styled.div`
  height: 100%;
  padding: 0 1rem 0 1rem;

  // FullCalendar 라이브러리 디자인
  .fc {
    width: 100%;
    height: 100%;
  }
  // 달력 헤더 영역
  .fc-toolbar {
    height: 1.5rem;
    margin-top: 1.6rem !important;
    margin-bottom: 1.6rem !important;
    background-color: ${(props) => props.theme.Color.mainWhite};
  }
  // 헤더 각 요소 영역
  .fc-toolbar-chunk {
    display: flex;
    flex-direction: row;
    align-items: center;
    position: relative;
    gap: 2rem;
  }
  // 년,월
  .fc-toolbar-title {
    transform: translateY(0.1rem);
    margin-right: 0.75em;

    font-size: ${(props) => props.theme.Fs.modalTitle};
    font-weight: 700;
    color: ${(props) => props.theme.Color.mainBlack};
  }
  // 버튼 초기화
  .fc .fc-button-primary:disabled {
    background-color: ${(props) => props.theme.Color.mainWhite};
    color: #121212;
    border: none;
    margin: 0;
    &:active {
      outline: none;
      border: none;
    }
  }
  .fc .fc-button-primary {
    background-color: ${(props) => props.theme.Color.mainWhite};
    color: black;
    border: none;
    margin: 0;
    &:active {
      border: none;
      outline: none;
    }
    &:focus {
      border: none;
      outline: none;
    }
  }
  .fc-button {
    &:active {
      margin: 0;
      box-shadow: none !important;
    }
    &:focus {
      box-shadow: none !important;
    }
  }
  // prev, next button
  .fc-prev-button,
  .fc-next-button {
    display: flex;
    align-items: center;
    justify-content: center;

    width: 1.875rem !important;
    height: 1.875rem !important;
    .fc-icon {
      scale: 0.6;
    }
    &:active {
      background-color: #fbdf96 !important;
    }
  }
  // date 각 한칸
  .fc-daygrid-day-top {
    flex-direction: row;
  }
  .fc-daygrid-day {
    padding: 0.5rem;
  }
  .fc-daygrid-day-number {
    font-size: 0.75rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  // 오늘날짜
  .fc,
  .fc-daygrid-day.fc-day-today {
    background-color: transparent;
  }
  .fc-day-today {
    .fc-daygrid-day-top {
      a {
        display: inline-block;
        text-align: center;
        line-height: 0.9;
        color: white;
        font-weight: 600;
        background-color: ${(props) => props.theme.Color.mainColor};
        border-radius: 2rem;
        height: 1rem;
        width: 1.5rem;
      }
    }
    .fc-daygrid-day-number {
      font-size: 0.75rem;
    }
  }
  .fc-theme-standard,
  .fc-scrollgrid {
    border: none;
  }

  // 달력 테이블
  table {
    border: none;
  }
  // 달력 드래그시 배경
  .fc-highlight {
    background: ${(props) => props.theme.Color.activeColor} !important;
  }
  // 주말 빨간색
  .fc-day.fc-day-sat.fc-daygrid-day,
  .fc-day.fc-day-sun.fc-daygrid-day {
    color: red;
  }
  // 요일
  .fc-col-header-cell > .fc-scrollgrid-sync-inner {
    display: flex;
    padding: 0 0 0 0.5rem;
    text-transform: uppercase;

    font-size: ${(props) => props.theme.Fs.default};
    font-weight: 900;
  }
  th {
    line-height: 1.5rem;
    border: none;
    background: ${(props) => props.theme.Color.mainWhite};
    font-size: 0.9rem;
  }
  th:last-child {
    border-right: none;
  }
  // 가로
  tr {
    border: none;
    border-bottom: ${(props) => props.theme.Border.thinBorder};
  }
  // 세로
  td {
    border: none;
  }
  td:last-child {
    border-right: none;
  }
  // 이벤트
  .fc-event-main {
    margin: 0.01rem 0 0.01rem 0.5rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    > div {
      padding: 0.05rem 0.04rem 0 0.04rem;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    &:hover {
      img {
        display: block;
      }
    }
    img {
      display: none;
    }
  }
`;

export const ColorModal = styled.input<{
  $isShow: boolean;
  $top: number;
  $left: number;
}>`
  position: fixed;
  background-color: white;

  box-shadow: 0px 0px 10px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;

  top: ${(props) => `${props.$top}px`};
  left: ${(props) => `${props.$left}px`};

  ${(props) =>
    !props.$isShow &&
    css`
      display: none;
    `}
`;

export const ColorModalBackground = styled.button<{ $isShow: boolean }>`
  position: fixed;

  top: 0;
  left: 0;

  width: 100%;
  height: 100%;

  background-color: transparent;
  z-index: 998;

  cursor: default;
  ${(props) =>
    !props.$isShow &&
    css`
      display: none;
    `}
`;

const TrashBox = styled.div`
  transition: all 0.2s ease;

  width: 1.875rem;
  height: 1.875rem;

  position: absolute;

  top: 1.25rem;
  right: 1rem;

  background-color: ${(props) => props.theme.Color.mainColor};
  border-radius: ${(props) => props.theme.Br.small};

  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    cursor: pointer;
    background-color: ${(props) => props.theme.Color.hoverColor};
  }

  > svg {
    scale: 0.9;
    fill: ${(props) => props.theme.Color.mainWhite};
  }
`;

type Props = {
  setSearchParams: SetURLSearchParams;
};

type ColorModalInfo = {
  top: number;
  left: number;
  color: string;
  selectedKanbanId: string;
  selectedEvent: EventContentArg | null;
};

export default function CalendarModal({ setSearchParams }: Props) {
  const kanbanDataState = useRecoilValue(kanbanState);
  const [isShowCreateKanbanModal, setIsShowCreateKanbanModal] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [colorModalInfo, setColorModalInfo] = useState<ColorModalInfo>({
    top: 0,
    left: 0,
    color: "",
    selectedKanbanId: "",
    selectedEvent: null,
  });
  const [isColorModalShow, setIsColorModalShow] = useState(false);
  const [isTutorialModalShow, setIsTutorialModalShow] = useState(false);
  const [isTrashModalShow, setIsTrashModalShow] = useState(false);

  const [kanbanEvents, setKanbanEvents] = useState(Array<EventInput>);

  const projectId = window.location.pathname.substring(1);
  const [recentKanbanId, setRecentKanbanId] = useRecoilState(recentKanbanState);

  useEffect(() => {
    const data = [...kanbanDataState];
    const result: EventInput[] = data.map((item) => ({
      id: item[0],
      start: fullCalendarDateFormat(item[1].start_date.seconds),
      end: fullCalendarDateFormat(item[1].end_date.seconds + 60 * 60 * 24),
      title: item[1].name,
      backgroundColor: item[1].color,
      textColor: getTextColorByBackgroundColor(item[1].color),
      borderColor: getBorderColorByBackgroundColor(item[1].color),
    }));
    setKanbanEvents(result);
  }, [kanbanDataState]);

  const handleSelect = (info: DateSelectArg) => {
    const calendarApi = info.view.calendar;
    const infoEndDate = info.end;
    infoEndDate.setDate(info.end.getDate() - 1);
    setStartDate(info.start);
    setEndDate(info.end);
    setIsShowCreateKanbanModal(true);
    calendarApi.unselect();
  };

  const handleEventClick = (eventArg: EventClickArg) => {
    const {
      event: { _def: eventInfo },
    } = eventArg;
    setSearchParams({ kanbanID: eventInfo.publicId });

    // local storage에 최근 칸반 주소 저장
    if (projectId in recentKanbanId) {
      // 이미 최근목록에 존재하는 칸반 접속 시 순서 최신화
      if (recentKanbanId[projectId].includes(eventInfo.publicId)) {
        const newIds = recentKanbanId[projectId].filter(
          (id: string) => id !== eventInfo.publicId,
        );
        setRecentKanbanId((prev: any) => ({
          ...prev,
          [projectId]: [...newIds, eventInfo.publicId],
        }));
        return;
      }
      // 최근목록 길이 제한
      if (recentKanbanId[projectId].length >= 7) {
        const newIds = recentKanbanId[projectId].slice(1);
        setRecentKanbanId((prev: any) => ({
          ...prev,
          [projectId]: [...newIds, eventInfo.publicId],
        }));
        return;
      }
    }

    setRecentKanbanId((prev: any) => ({
      ...prev,
      [projectId]: Array.isArray(prev[projectId])
        ? [...prev[projectId], eventInfo.publicId]
        : [eventInfo.publicId],
    }));
  };

  const handleEventDrop = async (eventArg: EventDropArg) => {
    // eslint-disable-next-line no-underscore-dangle
    const { start, end } = eventArg.event._instance!.range;

    const {
      event: { _def: eventInfo },
    } = eventArg;

    const kanbanRef = doc(
      db,
      "project",
      window.location.pathname,
      "kanban",
      eventInfo.publicId,
    );

    end.setDate(end.getDate() - 1);

    await updateDoc(kanbanRef, {
      start_date: start,
      end_date: end,
      modified_date: serverTimestamp(),
    });
  };

  const handleEventResize = async (eventArg: EventResizeDoneArg) => {
    // eslint-disable-next-line no-underscore-dangle
    const { end } = eventArg.event._instance!.range;

    const {
      event: { _def: eventInfo },
    } = eventArg;

    const kanbanRef = doc(
      db,
      "project",
      window.location.pathname,
      "kanban",
      eventInfo.publicId,
    );

    end.setDate(end.getDate() - 1);

    await updateDoc(kanbanRef, {
      end_date: end,
      modified_date: serverTimestamp(),
    });
  };

  function CustomEventContent(eventArg: EventContentArg) {
    const {
      event: { _def: eventInfo },
    } = eventArg;

    const EventTitle = document.createElement("div");
    EventTitle.innerText = eventInfo.title;

    const ModifyIcon = document.createElement("img");
    ModifyIcon.setAttribute("src", paint);
    ModifyIcon.setAttribute("style", "width: 1rem; height: 1rem;");
    ModifyIcon.addEventListener("click", (e: MouseEvent) => {
      e.stopPropagation();
      setColorModalInfo({
        top: ModifyIcon.getBoundingClientRect().top - 16,
        left: ModifyIcon.getBoundingClientRect().left - 16,
        color: eventArg.backgroundColor,
        selectedKanbanId: eventInfo.publicId,
        selectedEvent: eventArg,
      });
      setIsColorModalShow(true);
    });

    const arrayOfDomNodes = [EventTitle, ModifyIcon];
    return { domNodes: arrayOfDomNodes };
  }

  const handleColorModalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setColorModalInfo((prev) => {
      prev.selectedEvent!.event.setProp("backgroundColor", e.target.value);
      prev.selectedEvent!.event.setProp(
        "textColor",
        getTextColorByBackgroundColor(e.target.value),
      );

      prev.selectedEvent!.event.setProp(
        "borderColor",
        getBorderColorByBackgroundColor(e.target.value),
      );
      return {
        ...prev,
        color: e.target.value,
      };
    });
  };

  const handleColorModalthrottle = useRef(
    _.throttle((e: React.ChangeEvent<HTMLInputElement>) => {
      handleColorModalChange(e);
    }, 100),
  );

  const handleModalCloseClick = () => {
    setColorModalInfo((prev) => ({
      ...prev,
    }));
    setIsColorModalShow(false);
  };

  const handleColorModalBlur = async () => {
    const kanbanRef = doc(
      db,
      "project",
      window.location.pathname,
      "kanban",
      colorModalInfo.selectedKanbanId,
    );
    await updateDoc(kanbanRef, {
      color: colorModalInfo.color,
      modified_date: serverTimestamp(),
    });
    handleModalCloseClick();
  };

  const handleTutorialBtnClick = () => {
    setIsTutorialModalShow(true);
  };

  const handleTrashBoxClick = () => {
    setIsTrashModalShow(true);
  };

  const fullCalendarSetting: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin, momentPlugin],
    selectable: true,
    titleFormat: "YYYY. MM",
    headerToolbar: {
      left: "",
      center: "prev title next",
      right: "",
    },
    customButtons: {
      tutorial: {
        text: "i",
        click: handleTutorialBtnClick,
      },
    },
    initialView: "dayGridMonth",
    buttonText: {
      today: "오늘",
    },
    editable: true,
    fixedWeekCount: false,
    events: kanbanEvents,
    select: handleSelect,
    eventClick: handleEventClick,
    eventDrop: handleEventDrop,
    eventResize: handleEventResize,
    eventContent: CustomEventContent,
  };

  return (
    <ProjectModalLayout $isShow>
      <ProjectModalContentBox
        style={{
          position: "relative",
        }}
      >
        <TrashBox onClick={handleTrashBoxClick}>
          <TrashIcon />
        </TrashBox>
        <TrashModal isShow={isTrashModalShow} setIsShow={setIsTrashModalShow} />

        <CalendarBox>
          <FullCalendar
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...fullCalendarSetting}
          />
        </CalendarBox>
        <CreateKanbanModal
          isShow={isShowCreateKanbanModal}
          setIsShow={setIsShowCreateKanbanModal}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
        />
        <CalendarTutorialModal
          isShow={isTutorialModalShow}
          setIsShow={setIsTutorialModalShow}
        />
      </ProjectModalContentBox>
      <ColorModal
        $isShow={isColorModalShow}
        $top={colorModalInfo.top}
        $left={colorModalInfo.left}
        type="color"
        value={colorModalInfo.color}
        onChange={handleColorModalthrottle.current}
        onBlur={handleColorModalBlur}
      />
      <ColorModalBackground
        $isShow={isColorModalShow}
        onClick={handleModalCloseClick}
      />
    </ProjectModalLayout>
  );
}
