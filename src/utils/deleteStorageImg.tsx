import { getDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { storage } from "../firebaseSDK";

const deleteStorageImg = async (docRef: any) => {
  const docSnap: any = await getDoc(docRef);
  if (docSnap.exists() && docSnap.data().project_img_URL) {
    const currentUrl = docSnap.data().project_img_URL;
    const startIndex = currentUrl.lastIndexOf("%2F") + 3;
    const fileName = currentUrl.substring(
      startIndex,
      currentUrl.indexOf("?alt=media"),
    );
    const curStorageRef = ref(storage, `projectBgImg/${fileName}`);
    deleteObject(curStorageRef);
  }
};

export default deleteStorageImg;
