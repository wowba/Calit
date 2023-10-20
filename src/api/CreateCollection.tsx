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
}

export const createKanban = async (
  documentId: string,
  data: KanbanData,
): Promise<string> => {
  try {
    const docRef = await addDoc(
      collection(db, "project", documentId, "kanban"),
      data,
    );
    const newKanbanId = docRef.id;
    // alert("칸반을 생성했습니다");
    return newKanbanId;
  } catch (error) {
    console.error("칸반을 생성하는 데 오류가 발생했습니다.", error);
    throw error;
  }
};

export const createTodo = async (
  documentId: string,
  kanbanId: string,
  data: any,
): Promise<void> => {
  try {
    await addDoc(
      collection(db, "project", documentId, "kanban", kanbanId, "todo"),
      data,
    );
    alert("투두를 생성했습니다");
  } catch (error) {
    console.error("투두를 생성하는 데 오류가 발생했습니다.", error);
    throw error;
  }
};
