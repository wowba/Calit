import { atom } from "recoil";

interface TodoStateDefault {
  todoData: any;
}

const defaultValue: TodoStateDefault = {
  todoData: null,
};

const singleTodoState = atom({
  key: "singleTodoData",
  default: defaultValue,
});

export default singleTodoState;
