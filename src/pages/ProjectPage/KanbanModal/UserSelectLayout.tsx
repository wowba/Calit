/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
/* eslint-disable react/no-unstable-nested-components */
import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import Select from "react-select";
import projectState from "../../../recoil/atoms/project/projectState";
import userListState from "../../../recoil/atoms/userList/userListState";
import CustomUserOptions from "./CustomUserOptions";

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
`;

interface Props {
  userList: Array<string>;
  setUserList: React.Dispatch<React.SetStateAction<any[]>>;
  onBlur: any;
  customUserData?: Array<any>;
  isCustomUserData?: boolean;
}

export default function UserSelectLayout(props: Props) {
  const userListData = useRecoilValue(userListState);

  const { userList, setUserList, onBlur, customUserData, isCustomUserData } =
    props;
  const { user_list: projectUserList } =
    useRecoilValue(projectState).projectData;
  const [userData, setUserData] = useState<any[]>([]);

  // user_list와 userListData를 통해 user 데이터 set
  useEffect(() => {
    const fetchData = async (list: any) => {
      const data = list.map((id: string) => {
        const user = userListData.get(id);
        if (!user.is_kicked) {
          return {
            image: user.profile_img_URL,
            value: user.email,
            label: user.name,
          };
        }
      });
      setUserData(data);
    };

    if (isCustomUserData) {
      fetchData(customUserData);
    } else {
      fetchData(projectUserList);
    }
  }, [userListData]);

  return (
    <Select
      options={userData}
      isMulti
      formatOptionLabel={(option: any) => (
        <ManagedUser>
          <ProfileImg src={option.image} alt="User Profile" />
        </ManagedUser>
      )}
      value={userList}
      onChange={(state: any) => {
        setUserList(state);
      }}
      onBlur={() => {
        onBlur();
      }}
      components={{ Option: CustomUserOptions }}
      styles={{
        multiValue: (baseStyles) => ({
          ...baseStyles,
          padding: "0",
          margin: "-2px -6px -2px -6px",
          backgroundColor: "#fcfcfc",
          transition: "all 0.2s ease",
          ">div:first-of-type": {
            backgroundColor: "#fcfcfc",
            borderRadius: "0.5rem",
          },
          ":hover": {
            margin: "-2px 3px -2px -6px",
            "div+div>svg": { fill: "#595959" },
          },
        }),
        multiValueRemove: (baseStyles) => ({
          ...baseStyles,
          margin: "0",
          padding: "2px 5px 2px 2px",
          height: "auto",
          transition: "all 0.2s ease",
          ":hover": { ">svg": { fill: "#595959" } },
          ">svg": { fill: "transparent", transition: "all 0.2s ease" },
        }),
        control: (baseStyles) => ({
          ...baseStyles,
          minWidth: "10rem",
          transition: "all 0.3s",
          boxShadow: "none",
          backgroundColor: "#fcfcfc",
          border: "1px solid #fcfcfc",
          cursor: "pointer",
          ":hover": { border: "1px solid #fcfcfc" },
          ":focus": { border: "1px solid #fcfcfc" },
        }),
        valueContainer: (baseStyles) => ({
          ...baseStyles,
          paddingRight: "0",
        }),
        container: (baseStyles) => ({
          ...baseStyles,
          flex: "1",
        }),
        indicatorsContainer: (baseStyles) => ({
          ...baseStyles,
          visibility: "hidden",
          width: "0",
        }),
        option: (baseStyles) => ({
          ...baseStyles,
          transition: "all 0.2s ease",
          backgroundColor: "#fff",
          ":hover": { backgroundColor: "#ecebff" },
        }),
      }}
    />
  );
}

UserSelectLayout.defaultProps = {
  customUserData: [],
  isCustomUserData: false,
};