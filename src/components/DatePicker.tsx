import React from "react";
import ReactDatePicker from "react-datepicker";
import { ko } from "date-fns/esm/locale";
import "react-datepicker/dist/react-datepicker.css";
import styled, { css } from "styled-components";

interface Props {
  date: Date;
  onChange: any;
  $width: string;
  $height: string;
  $isHover: boolean;
  $padding: string;
  $fontsize: string;
}

export default function DatePicker(props: Props) {
  const { date, onChange, $width, $height, $isHover, $padding, $fontsize } =
    props;

  const StyledReactDatePicker = styled(ReactDatePicker)`
    transition: all 0.3s ease-in-out;

    width: ${$width};
    height: ${$height};
    padding: ${$padding};

    font-size: ${$fontsize};

    border: 1px solid transparent;
    border-radius: 0.3rem;
    outline: none;

    &:focus {
      border-color: black;
    }

    ${$isHover &&
    css`
      &:hover {
        border-color: black;
      }
    `}
  `;

  return (
    <StyledReactDatePicker
      locale={ko}
      dateFormat="yyyy.MM.dd"
      selected={date}
      onChange={(selectedDate: Date) => onChange(selectedDate)}
    />
  );
}
