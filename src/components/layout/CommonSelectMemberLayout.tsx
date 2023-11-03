import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { doc, getDoc } from "firebase/firestore";
import styled from "styled-components";
import Select from "react-select";

import projectState from "../../recoil/atoms/project/projectState";
import { db } from "../../firebaseSDK";

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

interface Props {
  userList: Array<string>;
  setUserList: React.Dispatch<React.SetStateAction<any[]>>;
  onBlur: any;
  customUserData?: Array<any>;
}

export default function CommonSelectMemberLayout(props: Props) {
  const { userList, setUserList, onBlur, customUserData } = props;
  const { user_list: projectUserList } =
    useRecoilValue(projectState).projectData;
  const [userData, setUserData] = useState<any[]>([]);

  // user_list 통해 user 데이터 가져오기
  useEffect(() => {
    const fetchData = async () => {
      const data = await Promise.all(
        projectUserList.map(async (id: string) => {
          const userRef = doc(db, "user", id);
          const userSnap: any = await getDoc(userRef);
          return {
            image: userSnap.data().profile_img_URL,
            value: userSnap.data().email,
            label: userSnap.data().name,
          };
        }),
      );
      setUserData(data);
    };
    if (customUserData) {
      setUserData(customUserData);
    } else {
      fetchData();
    }
  }, [projectUserList]);

  return (
    <Select
      options={userData}
      isMulti
      // eslint-disable-next-line react/no-unstable-nested-components
      formatOptionLabel={(option: any) => (
        <ManagedUser>
          <ProfileImg src={option.image} alt="User Profile" />
          <span>{option.label}</span>
        </ManagedUser>
      )}
      value={userList}
      onChange={(state: any) => {
        setUserList(state);
      }}
      onBlur={() => {
        onBlur();
      }}
      styles={{
        multiValue: (baseStyles) => ({
          ...baseStyles,
          padding: "0",
          margin: "0",
          border: "1px solid black",
          borderRadius: "0.5rem",
          backgroundColor: "transparent",
        }),
        multiValueRemove: (baseStyles) => ({
          ...baseStyles,
          borderRadius: "0.5rem",
        }),
        control: (baseStyles) => ({
          ...baseStyles,
          width: "auto",
          transition: "all 0.3s",
          boxShadow: "none",
          border: "1px solid transparent",
          ":hover": { border: "1px solid black" },
          ":focus": { border: "1px solid black" },
        }),
        valueContainer: (baseStyles) => ({
          ...baseStyles,
          paddingRight: "0",
        }),
      }}
    />
  );
}

CommonSelectMemberLayout.defaultProps = {
  customUserData: [],
};
