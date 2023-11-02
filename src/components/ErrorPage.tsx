import React from "react";
import styled from "styled-components";

import { useNavigate } from "react-router-dom";
import ConfirmBtn from "./layout/ConfirmBtnLayout";

type Props = {
  isProject403?: boolean;
  isProject404?: boolean;
  isKanban404?: boolean;
  isTodo404?: boolean;
};

const ErrorLayout = styled.div`
  position: relative;
  height: calc(100% - 4rem);
`;

const ErrorContentBox = styled.div`
  position: absolute;

  left: 50%;
  top: 50%;
  transform: translate(-50%, -70%);

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const ErrorNumber = styled.div`
  font-size: 4rem;
  font-weight: 900;
  line-height: 1.2;
`;

const ErrorInfoBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

const ErrorInfo = styled.div`
  font-weight: 900;
`;

export default function ErrorPage(props: Props) {
  const navigate = useNavigate();

  const { isProject404, isProject403, isKanban404, isTodo404 } = props;

  if (isProject403) {
    return (
      <ErrorLayout>
        <ErrorContentBox>
          <ErrorNumber>403</ErrorNumber>
          <ErrorInfoBox>
            <ErrorInfo>해당 프로젝트의 접근 권한이 없습니다.</ErrorInfo>
            <ConfirmBtn
              type="button"
              $dynamicWidth="16rem"
              onClick={() => navigate("/")}
            >
              Project List 페이지로 돌아가기
            </ConfirmBtn>
          </ErrorInfoBox>
        </ErrorContentBox>
      </ErrorLayout>
    );
  }

  if (isProject404) {
    return (
      <ErrorLayout>
        <ErrorContentBox>
          <ErrorNumber>404</ErrorNumber>
          <ErrorInfoBox>
            <ErrorInfo>해당 프로젝트는 존재하지 않습니다.</ErrorInfo>
            <ConfirmBtn
              type="button"
              $dynamicWidth="16rem"
              onClick={() => navigate("/")}
            >
              Project List 페이지로 돌아가기
            </ConfirmBtn>
          </ErrorInfoBox>
        </ErrorContentBox>
      </ErrorLayout>
    );
  }

  if (isKanban404) {
    return (
      <ErrorLayout>
        <ErrorContentBox>
          <ErrorNumber>404</ErrorNumber>
          <ErrorInfoBox>
            <ErrorInfo>해당 칸반은 존재하지 않습니다.</ErrorInfo>
          </ErrorInfoBox>
        </ErrorContentBox>
      </ErrorLayout>
    );
  }

  if (isTodo404) {
    return (
      <ErrorLayout>
        <ErrorContentBox>
          <ErrorNumber>404</ErrorNumber>
          <ErrorInfoBox>
            <ErrorInfo>해당 투두는 존재하지 않습니다.</ErrorInfo>
          </ErrorInfoBox>
        </ErrorContentBox>
      </ErrorLayout>
    );
  }

  return null;
}

ErrorPage.defaultProps = {
  isProject403: false,
  isProject404: false,
  isKanban404: false,
  isTodo404: false,
};
