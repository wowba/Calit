import { atom } from "recoil";

const todoState = atom({
  key: "todoData",
  default: new Map(),
});

export default todoState;
