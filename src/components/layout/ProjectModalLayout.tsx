import styled, { css } from "styled-components";

const ProjectLayout = styled.div`
  position: relative;

  width: calc(100% - 14rem);
  height: 100%;
  padding: 0.75rem 1rem 0 0.5rem;
`;

const ProjectModalLayout = styled.div<{ $isShow: boolean }>`
  transition: all 1s ease;
  position: fixed;

  // 헤더 및 사이드바 CSS 변경시 width, height 수정 요망
  width: calc(100% - 15.5rem);
  height: calc(100% - 5.5rem);

  top: calc(5.75rem);
  ${(props) =>
    !props.$isShow &&
    css`
      top: calc(100% - 0.6rem);
    `};
`;

const ProjectModalTabBox = styled.div<{
  $left: number;
  $color: string;
  $isShow?: boolean;
}>`
  transition: 0.5s ease;
  transition-property: background-color;
  z-index: 998;

  width: 9rem;
  height: 2rem;

  border-radius: 1rem;
  background-color: ${(props) => `${props.$color}`};

  position: fixed;
  left: ${(props) => `${props.$left}rem`};

  top: 3.4rem;

  &:hover {
    cursor: pointer;
    background-color: ${(props) =>
      props.$isShow ? props.theme.Color.yellow1 : props.theme.Color.btnColor2};

    > span {
      color: white;
    }
  }
`;

const ProjectModalTabText = styled.span<{
  $top: number;
  $left: number;
  $color: string;
}>`
  position: absolute;
  top: ${(props) => `${props.$top}rem`};
  left: ${(props) => `${props.$left}rem`};

  font-size: ${(props) => props.theme.Fs.size16};
  font-weight: 800;
  scale: 1.1;

  color: ${(props) => props.$color};
`;
interface Props {
  $isKanbanOrTodoShow?: boolean;
}
const ProjectModalContentBox = styled.div<Props>`
  height: 100%;

  background-color: white;
  border-radius: 0 0.6rem 0 0;
  overflow: scroll;
  transition: box-shadow 0.8s cubic-bezier(0.075, 0.82, 0.165, 1);
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const ProjectLayoutFooter = styled.div`
  position: fixed;
  z-index: 999;
  top: calc(100% - 0.6rem);

  /* 사이드바 width 변경시 수정 필요. */
  width: calc(100% - 15.5rem);
  height: 0.6rem;

  border-radius: 0 0.6rem 0 0;
  background-color: #ffea7a;
`;

export {
  ProjectLayout,
  ProjectModalLayout,
  ProjectModalTabBox,
  ProjectModalTabText,
  ProjectModalContentBox,
  ProjectLayoutFooter,
};
