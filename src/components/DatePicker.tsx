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

const StyledReactDatePicker = styled(ReactDatePicker)<Props>`
  transition: all 0.3s ease-in-out;
  background-color: #fcfcfc;
  width: ${(props) => props.$width};
  height: ${(props) => props.$height};
  padding: ${(props) => props.$padding};

  font-size: ${(props) => props.$fontsize};

  border: none;
  border-radius: 0.3rem;
  outline: none;

  &:focus {
    /* border-color: #adadad; */
  }

  ${(props) =>
    props.$isHover &&
    css`
      &:hover {
        /* border-color: #adadad; */
      }
    `}
`;

export default function DatePicker(props: Props) {
  const { date, onChange, $width, $height, $isHover, $padding, $fontsize } =
    props;

  return (
    <StyledReactDatePicker
      locale={ko}
      dateFormat="yyyy.MM.dd"
      selected={date}
      onChange={(selectedDate: Date) => onChange(selectedDate)}
      // @ts-ignore
      $width={$width}
      $height={$height}
      $isHover={$isHover}
      $padding={$padding}
      $fontsize={$fontsize}
    />
  );
}
