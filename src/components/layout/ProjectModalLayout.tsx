import styled, { css } from "styled-components";

const ProjectLayout = styled.div`
  position: relative;

  width: calc(100% - 14rem);
  height: 100%;
  padding: 0.75rem 1rem 0 0;
`;

const ProjectModalLayout = styled.div<{ $isShow: boolean }>`
  transition: all 1s ease;
  position: fixed;

  // 헤더 및 사이드바 CSS 변경시 width, height 수정 요망
  width: calc(100% - 16rem);
  height: calc(100% - 7rem);

  top: calc(7rem);
  ${(props) =>
    !props.$isShow &&
    css`
      top: 100%;
    `};

  border-radius: 0.6rem;
  border: 1.5px solid ${(props) => props.theme.Color.thickBorderColor};
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

  top: 4.1rem;

  &:hover {
    cursor: pointer;
    background-color: ${(props) =>
      props.$isShow
        ? props.theme.Color.mainColor
        : props.theme.Color.inactiveGray};

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

  font-size: ${(props) => props.theme.Fs.size20};
  font-weight: 900;
  scale: 1.1;

  color: ${(props) => props.$color};
`;
interface Props {
  $isKanbanOrTodoShow?: boolean;
}

const ProjectModalContentBox = styled.div<Props>`
  height: 100%;

  background-color: ${(props) => props.theme.Color.mainWhite};
  border-radius: 0.6rem;
  overflow: scroll;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

export {
  ProjectLayout,
  ProjectModalLayout,
  ProjectModalTabBox,
  ProjectModalTabText,
  ProjectModalContentBox,
};
