import { atom } from "recoil";

const headerState = atom({
  key: "headerState",
  default: "list",
});

export default headerState;
