/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import { DateSelectArg } from "@fullcalendar/core";
import styled from "styled-components";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

import {
  ProjectModalLayout,
  ProjectModalTabBackground,
  ProjectModalTabText,
  ProjectModalTabBox,
  ProjectModalContentBox,
} from "../../../components/layout/ProjectModalLayout";
import CreateKanbanModal from "./CreateKanbanModal";

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
    opacity: 1 !important;
    background-color: #ee6a6a !important;
    width: 3rem;
    height: 2rem;
    font-size: 0.8rem;
    color: white !important;
    border-radius: 7px;
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

    font-family: sans-serif;
    padding: 0.2rem 0 0 0;
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
`;

type Props = {
  calendarTabColor: string;
};

export default function CalendarModal({ calendarTabColor }: Props) {
  const [isShowCreateKanbanModal, setIsShowCreateKanbanModal] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleSelect = (info: DateSelectArg) => {
    const calendarApi = info.view.calendar;
    setStartDate(info.startStr);
    setEndDate(info.endStr);
    setIsShowCreateKanbanModal(true);
    // calendarApi.addEvent({
    //   id: "1",
    //   title: "칸반",
    //   start: info.startStr,
    //   end: info.endStr,
    //   allDay: info.allDay,
    // });
    calendarApi.unselect();
  };

  const fullCalendarSetting = {
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
      },
    },
    initialView: "dayGridMonth",
    locale: "ko",
    buttonText: {
      // 버튼 텍스트 변환
      today: "오늘",
    },
    select: handleSelect,
  };

  return (
    <ProjectModalLayout $isShow>
      <ProjectModalTabBox $marginLeft={2}>
        <ProjectModalTabBackground $color={calendarTabColor} />
        <ProjectModalTabText $top={0.4} $left={2.5}>
          Calender
        </ProjectModalTabText>
      </ProjectModalTabBox>
      <ProjectModalContentBox>
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
          endDate={endDate}
        />
      </ProjectModalContentBox>
    </ProjectModalLayout>
  );
}
