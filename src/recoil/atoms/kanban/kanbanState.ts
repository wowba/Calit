import { atom } from "recoil";

const kanbanState = atom({
  key: "kanbanData",
  default: new Map(),
});

export default kanbanState;
