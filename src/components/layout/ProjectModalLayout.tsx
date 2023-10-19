import styled, { css } from "styled-components";
import RobotoRegular from "../../assets/fonts/Roboto-Regular.ttf";

import { ReactComponent as ProjectModalTabSVG } from "../../assets/ProjectModalTab.svg";

const ProjectModalLayout = styled.div`
  /* 적용이 필수로 보이지만 화면이 다 깨져버림.. */
  /* position: absolute; */

  width: 100%;
  height: 100%;
`;

const ProjectModalTabBox = styled.div`
  position: relative;
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

const ProjectModalContentBox = styled.div<{ $isShadowExist?: boolean }>`
  height: calc(100% - 2rem);

  border-radius: 0 0.6rem 0 0;
  ${(props) =>
    props.$isShadowExist &&
    css`
      box-shadow: 0px 0px 10px 6px rgba(0, 0, 0, 0.1);
    `}

  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const ProjectModalContent = styled.div`
  overflow: scroll;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const ProjectModalFooter = styled.div<{ $isShadowExist?: boolean }>`
  height: 0.6rem;

  border-radius: 0 0.6rem 0 0;
  background-color: #ffea7a;

  ${(props) =>
    props.$isShadowExist &&
    css`
      box-shadow: -2px 4px 20px 0px rgba(0, 0, 0, 0.6);
    `}
`;

export {
  ProjectModalLayout,
  ProjectModalTabBox,
  ProjectModalTabText,
  ProjectModalTabBackground,
  ProjectModalContentBox,
  ProjectModalContent,
  ProjectModalFooter,
};
