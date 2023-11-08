import styled, { css } from "styled-components";

import { ReactComponent as ProjectModalTabSVG } from "../../assets/ProjectModalTab.svg";

const ProjectModalLayout = styled.div<{ $isShow: boolean }>`
  transition: all 1s ease;
  position: fixed;

  // 헤더 및 사이드바 CSS 변경시 width, height 수정 요망
  width: calc(100% - 14rem);
  height: calc(100% - 5.5rem);

  top: calc(5.75rem);
  ${(props) =>
    !props.$isShow &&
    css`
      top: calc(100% - 0.6rem);
    `};
`;

const ProjectModalTabContainer = styled.div`
  display: flex;
`;

const ProjectModalTabBox = styled.div<{
  $left: number;
  $isShow?: boolean;
}>`
  transition: all 1s ease;
  z-index: 1000;

  width: 9rem;
  position: absolute;
  left: ${(props) => `${props.$left}rem`};

  top: 0.75rem;
  ${(props) =>
    !props.$isShow &&
    css`
      top: calc(100% - 1.5rem);
    `};

  &:hover {
    cursor: pointer;
    > svg {
      fill: ${(props) =>
        props.$isShow
          ? props.theme.Color.yellow1
          : props.theme.Color.btnColor2};
    }
  }
`;

const ProjectModalTabBackground = styled(ProjectModalTabSVG)<{
  $color: string;
}>`
  transition: all 0.2s ease;

  width: 9rem;
  height: 2rem;
  fill: ${(props) => `${props.$color}`};
`;

const ProjectModalTabText = styled.span<{ $top: number; $left: number }>`
  position: absolute;
  top: ${(props) => `${props.$top}rem`};
  left: ${(props) => `${props.$left}rem`};

  font-size: ${(props) => props.theme.Fs.size16};
  font-weight: 800;
  scale: 1.1;
`;

const ProjectModalContentBox = styled.div`
  height: 100%;

  background-color: white;
  border-radius: 0.6rem 0.6rem 0 0;
  box-shadow: 0px 0px 10px 6px rgba(0, 0, 0, 0.1);

  overflow: scroll;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

export {
  ProjectModalLayout,
  ProjectModalTabContainer,
  ProjectModalTabBox,
  ProjectModalTabText,
  ProjectModalTabBackground,
  ProjectModalContentBox,
};
