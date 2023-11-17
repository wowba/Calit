/* eslint-disable react/no-array-index-key */
import React from "react";
import styled from "styled-components";

const TutorialPaginationLayout = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
  margin: 1rem 0;
`;

const TutorialPaginationButton = styled.button`
  border: none;
  border-radius: 7px;
  padding: 5px 10px;
  margin: 0;
  font-size: 1rem;
  cursor: pointer;

  &[disabled] {
    cursor: revert;
    transform: revert;
  }

  &[aria-current] {
    background: #7064ff;
    font-weight: bold;
    color: white;
    cursor: revert;
    transform: revert;
  }
`;

interface Props {
  total: number;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}

export default function CommonPaginationLayout({
  total,
  page,
  setPage,
}: Props) {
  return (
    <TutorialPaginationLayout>
      <TutorialPaginationButton
        onClick={() => setPage(page - 1)}
        disabled={page === 1}
      >
        &lt;
      </TutorialPaginationButton>
      {Array.from({ length: total }).map((_, i) => (
        <TutorialPaginationButton
          key={i + 1}
          onClick={() => setPage(i + 1)}
          aria-current={page === i + 1 ? "page" : undefined}
        >
          {i + 1}
        </TutorialPaginationButton>
      ))}
      <TutorialPaginationButton
        onClick={() => setPage(page + 1)}
        disabled={page === total}
      >
        &gt;
      </TutorialPaginationButton>
    </TutorialPaginationLayout>
  );
}
