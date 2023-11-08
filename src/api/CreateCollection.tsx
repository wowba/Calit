import { FieldValue, addDoc, collection } from "firebase/firestore";
import { db } from "../firebaseSDK";

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
