/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useRef, useState } from "react";
import styled from "styled-components";
// import TagContainer from "./TagContainer";
import { db } from "../../../firebaseSDK";

const CustomOptionContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  padding: 0 0.5rem;
  transition: all 0.2s ease;
  &:hover {
    background-color: #ecebff;
  }
`;
const ManagedUser = styled.div`
  border-radius: 8px;
  display: inline-block;
  white-space: nowrap;
`;

const ProfileImg = styled.img`
  border-radius: 50%;
  width: 1.5rem;
  height: 1.5rem;
  display: inline-block;
  vertical-align: middle;
  margin: 0 0.5rem 0 0;
`;

export default function CustomOptions({
  innerRef,
  innerProps,
  data: { label, image },
}: any) {
  return (
    <CustomOptionContainer
      ref={innerRef}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...innerProps}
      className="custom-option"
    >
      <ManagedUser>
        <ProfileImg src={image} alt="User Profile" />
        <span>{label}</span>
      </ManagedUser>
    </CustomOptionContainer>
  );
}
