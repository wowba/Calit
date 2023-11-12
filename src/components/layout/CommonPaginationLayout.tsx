/* eslint-disable react/no-array-index-key */
import React from "react";
import styled from "styled-components";

const TutorialPaginationLayout = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
  margin: 16px;
`;

const TutorialPaginationButton = styled.button`
  border: none;
  border-radius: 8px;
  padding: 8px;
  margin: 0;
  background: black;
  color: white;
  font-size: 1rem;

  &:hover {
    background: tomato;
    cursor: pointer;
    transform: translateY(-2px);
  }

  &[disabled] {
    background: grey;
    cursor: revert;
    transform: revert;
  }

  &[aria-current] {
    background: deeppink;
    font-weight: bold;
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
