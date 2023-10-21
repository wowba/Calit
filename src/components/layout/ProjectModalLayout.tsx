import styled, { css } from "styled-components";
import RobotoRegular from "../../assets/fonts/Roboto-Regular.ttf";

import { ReactComponent as ProjectModalTabSVG } from "../../assets/ProjectModalTab.svg";

const ProjectModalLayout = styled.div<{ $isShow: boolean }>`
  transition: all 1s ease;
  position: fixed;

  // 헤더 및 사이드바 CSS 변경시 width, height 수정 요망
  width: calc(100% - 14rem);
  height: calc(100% - 7rem);

  top: calc(5rem);
  ${(props) =>
    !props.$isShow &&
    css`
      top: calc(100% - 2.6rem);
    `};
`;

const ProjectModalTabBox = styled.div<{ $marginLeft: number }>`
  position: relative;
  margin-left: ${(props) => `${props.$marginLeft}rem`};
`;

const ProjectModalTabBackground = styled(ProjectModalTabSVG)<{
  $color: string;
}>`
  width: 9rem;
  height: 2rem;
  fill: ${(props) => `${props.$color}`};
`;

const ProjectModalTabText = styled.span<{ $top: number; $left: number }>`
  position: absolute;
  top: ${(props) => `${props.$top}rem`};
  left: ${(props) => `${props.$left}rem`};

  @font-face {
    font-family: "RobotoRegular";
    src: local("RobotoRegular"), url(${RobotoRegular});
  }

  font-size: 1rem;
  font-weight: 700;
`;

const ProjectModalContentBox = styled.div`
  height: 100%;

  border-radius: 0.6rem 0.6rem 0 0;
  box-shadow: 0px 0px 10px 6px rgba(0, 0, 0, 0.1);

  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const ProjectModalContent = styled.div`
  background-color: white;
  border-radius: 0.6rem 0.6rem 0 0;

  overflow: scroll;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

export {
  ProjectModalLayout,
  ProjectModalTabBox,
  ProjectModalTabText,
  ProjectModalTabBackground,
  ProjectModalContentBox,
  ProjectModalContent,
};