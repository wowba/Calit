import { atom } from "recoil";

const todoLoaded = atom({
  key: "todoLoaded",
  default: true,
});

export default todoLoaded;
