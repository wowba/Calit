import { atom } from "recoil";

interface TodoStateDefault {
  todoData: any;
}

const defaultValue: TodoStateDefault = {
  todoData: null,
};

const todoState = atom({
  key: "todoData",
  default: defaultValue,
});

export default todoState;
