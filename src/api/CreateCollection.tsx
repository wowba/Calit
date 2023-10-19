import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebaseSDK";

export const createKanban = async (documentId: string, data: any) => {
  try {
    const docRef = await addDoc(
      collection(db, "project", documentId, "kanban"),
      data,
    );
    const newKanbanId = docRef.id;
    alert("칸반을 생성했습니다");
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
) => {
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
