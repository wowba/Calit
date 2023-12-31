import {
  FieldValue,
  addDoc,
  collection,
  doc,
  setDoc,
} from "firebase/firestore";
import { db } from "../firebaseSDK";

interface UserData {
  email: string;
  name: string;
  intro: string;
  is_kicked: boolean;
  profile_img_URL: string;
}
interface KanbanData {
  user_list: Array<string>;
  stage_list: Array<Object>;
  name: string;
  start_date: Date;
  end_date: Date;
  created_date: FieldValue;
  modified_date: FieldValue;
  is_deleted: boolean;
  color: string;
}
interface TodoData {
  update_list: Array<Object>;
  user_list: Array<string>;
  stage_id: string;
  name: string;
  created_date: FieldValue;
  modified_date: FieldValue;
  is_deleted: boolean;
  deadline: Date;
  info: string;
  todo_tag_list: Array<Object>;
  todo_option_list: Array<Object>;
}
interface TodoUpdateData {
  writer: string;
  detail: string;
  created_date: FieldValue;
}

export const createUser = async (
  documentId: string,
  userId: string,
  data: UserData,
): Promise<void> => {
  const userRef = doc(db, "project", documentId, "user", userId);
  await setDoc(userRef, data);
};

export const createKanban = async (
  documentId: string,
  data: KanbanData,
): Promise<string> => {
  const docRef = await addDoc(
    collection(db, "project", documentId, "kanban"),
    data,
  );
  const newKanbanId = docRef.id;
  // alert("칸반을 생성했습니다");
  return newKanbanId;
};

export const createTodo = async (
  documentId: string,
  kanbanId: string,
  data: TodoData,
): Promise<string> => {
  const docRef = await addDoc(
    collection(db, "project", documentId, "kanban", kanbanId, "todo"),
    data,
  );
  // alert("투두를 생성했습니다");
  const newTodoId = docRef.id;
  return newTodoId;
};

export const createUpdate = async (
  documentId: string,
  kanbanId: string,
  todoId: string,
  data: TodoUpdateData,
): Promise<string> => {
  const docRef = await addDoc(
    collection(
      db,
      "project",
      documentId,
      "kanban",
      kanbanId,
      "todo",
      todoId,
      "todoUpdate",
    ),
    data,
  );
  // alert("투두 업데이트를 생성했습니다");
  const newTodoUpdateId = docRef.id;
  return newTodoUpdateId;
};
