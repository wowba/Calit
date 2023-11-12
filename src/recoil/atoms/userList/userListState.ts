import { atom } from "recoil";

const userListState = atom({
  key: "userListData",
  default: new Map(),
});

export default userListState;
