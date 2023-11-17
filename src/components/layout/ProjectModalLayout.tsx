import styled, { css } from "styled-components";

const ProjectLayout = styled.div`
  position: relative;

  width: calc(100% - 14rem);
  height: 100%;
  padding: 1.75rem 1rem 1rem 0;
`;

const ProjectModalLayout = styled.div<{ $isShow: boolean }>`
  transition: all 1s ease;
  position: fixed;

  // 헤더 및 사이드바 CSS 변경시 width, height 수정 요망
  width: calc(100% - 16rem);
  height: calc(100% - 8rem);

  top: calc(7rem);
  ${(props) =>
    !props.$isShow &&
    css`
      top: 100%;
    `};

  border: ${(props) => props.theme.Border.thickBorder};
  border-radius: ${(props) => props.theme.Br.default};
`;

const ProjectModalTabBox = styled.div<{
  $left: number;
  $color: string;
  $isShow?: boolean;
  $textColor: string;
}>`
  transition: all 0.5s ease;
  z-index: 998;

  width: 7rem;
  /* height: 2rem; */

  border-radius: 2rem;
  background-color: ${(props) => `${props.$color}`};

  position: fixed;
  left: ${(props) => `${props.$left}rem`};
  top: 4rem;

  color: ${(props) => props.$textColor};
  padding: 0.2rem 0;
  text-align: center;
  font-size: ${(props) => props.theme.Fs.default};
  font-weight: 600;
  scale: 1.1;

  &:hover {
    ${(props) =>
      props.$isShow
        ? css`
            cursor: pointer;
            background-color: ${(innerProps) =>
              innerProps.theme.Color.mainColor};
            color: ${(innerProps) => innerProps.theme.Color.mainWhite};
          `
        : css`
            cursor: not-allowed;
          `}
  }
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
  ProjectModalContentBox,
};
