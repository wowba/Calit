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
import yearMonthDayFormat from "../../../utils/yearMonthDayFormat";
import { db } from "../../../firebaseSDK";
import getTextColorByBackgroundColor from "../../../utils/getTextColorByBgColor";
import getBorderColorByBackgroundColor from "../../../utils/getBorderColorByBgColor";
import paint from "../../../assets/icons/paint.svg";
import CalendarTutorialModal from "./CalendarTutorialModal";
import recentKanbanState from "../../../recoil/atoms/sidebar/recentKanbanState";

const CalendarBox = styled.div`
  height: 100%;
  padding: 0 1rem 1.6rem 1rem;

  // FullCalendar 라이브러리 디자인
  .fc {
    width: 100%;
    height: 100%;
  }
  // 달력 헤더 영역
  .fc-toolbar {
    height: 1.5rem;
    margin-top: 1rem !important;
    margin-bottom: 1rem !important;
  }
  // 헤더 각 요소 영역
  .fc-toolbar-chunk {
    display: flex;
    flex-direction: row;
    align-items: center;
    position: relative;
  }
  // 년,월
  .fc-toolbar-title {
    transform: translateY(0.1rem);
    margin-right: 0.75em;
    font-size: 1rem;
    font-weight: 700;
  }
  // 버튼 초기화
  .fc .fc-button-primary:disabled {
    background-color: white;
    color: #121212;
    border: none;
    margin: 0;
    &:active {
      outline: none;
      border: none;
    }
  }
  .fc .fc-button-primary {
    background-color: white;
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
  // 오늘 button
  .fc-today-button {
    transition: all 0.2s;
    opacity: 1 !important;
    background-color: #ee6a6a !important;
    width: 3rem;
    height: 2rem;
    font-size: 0.8rem;
    color: white !important;
    border-radius: 7px;
    &:hover {
      background-color: #d05f5f !important;
    }
    &:active {
      background-color: #f69c9c !important;
    }
  }
  // 튜토리얼 버튼
  .fc-toolbar-chunk:last-child {
    margin-left: 1.2rem;
  }
  .fc-tutorial-button {
    width: 1.8rem;
    height: 1.8rem;
    border: solid 0.1rem #121212 !important;
    border-radius: 50%;

    padding: 0.125rem 0 0 0;
    font-weight: 900;
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
      size: 0.9375rem;
    }
    &:active {
      background-color: #fbdf96 !important;
    }
  }
  // date 각 한칸
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
        display: flex;
        justify-content: center;
        align-items: center;
        color: white;
        font-weight: 600;
        background-color: #ee6a6a;
        border-radius: 15%;
      }
    }
    .fc-daygrid-day-number {
      font-size: 0.75rem;
    }
  }
  .fc-daygrid,
  .fc-timegrid {
    border: 0.0313rem solid black;
    border-radius: 0.25rem;
  }
  .fc-theme-standard,
  .fc-scrollgrid {
    border: none;
  }

  // 달력 테이블
  table {
    border: none;
  }
  // 요일
  th {
    line-height: 1.5rem;
    border: none;
    border-right: 0.0313rem solid black;
    background: #f5f5f5;
    border-radius: 0.25rem;
    font-size: 0.9rem;
  }
  th:last-child {
    border-right: none;
  }
  // 가로
  tr {
    border: none;
    border-bottom: 0.0313rem solid black;
  }
  // 세로
  td {
    border: none;
    border-right: 0.0313rem solid black;
  }
  td:last-child {
    border-right: none;
  }
  // 이벤트
  .fc-event-main {
    margin: 0 0 0 0.25rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    > div {
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

  const [kanbanEvents, setKanbanEvents] = useState(Array<EventInput>);

  const projectId = window.location.pathname.substring(1);
  const [recentKanbanId, setRecentKanbanId] = useRecoilState(recentKanbanState);

  useEffect(() => {
    const data = [...kanbanDataState];
    const result: EventInput[] = data.map((item) => ({
      id: item[0],
      start: yearMonthDayFormat(item[1].start_date.seconds),
      end: yearMonthDayFormat(item[1].end_date.seconds + 60 * 60 * 24),
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

  const fullCalendarSetting: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    selectable: true,
    headerToolbar: {
      left: "today",
      center: "prev title next",
      right: "tutorial",
    },
    customButtons: {
      tutorial: {
        text: "i",
        click: handleTutorialBtnClick,
      },
    },
    initialView: "dayGridMonth",
    locale: "ko",
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
          boxShadow: " 0px 0px 25px 5px rgba(0, 0, 0, 0.1)",
          position: "relative",
        }}
      >
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
