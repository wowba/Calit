import React from "react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useSetRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";

import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../../firebaseSDK";
import loginState from "../../recoil/atoms/login/loginState";
import userState from "../../recoil/atoms/login/userState";

export default function Login() {
  const navigate = useNavigate();

  const setLoginState = useSetRecoilState(loginState);
  const setUserState = useSetRecoilState(userState);

  const provider = new GoogleAuthProvider();

  const handleClickLogin = () => {
    signInWithPopup(auth, provider)
      .then(async (result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        // 이후 구글 로그인 관련 기능이 추가 될 시 활용 예정.
        // const credential = GoogleAuthProvider.credentialFromResult(result);
        // const token = credential!.accessToken;
        // The signed-in user info.
        const { user } = result;
        // IdP data available using getAdditionalUserInfo(result)
        // ...

        const userRef = doc(db, "user", user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          await setDoc(doc(db, "user", user.uid), {
            project_list: [],
            profile_img_URL: user.photoURL,
            name: user.displayName,
            email: user.email,
            intro: "",
            is_deleted: false,
          });
        }

        return { user, userRef };
      })
      .then(async ({ user, userRef }) => {
        const userSnap = await getDoc(userRef);
        setLoginState(true);
        setUserState({
          userCredential: JSON.parse(JSON.stringify(user)),
          userData: userSnap.data(),
        });
        navigate("/");
      })
      .catch((error) => {
        // Handle Errors here.
        // const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        // const { email } = error.customData;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
        // eslint-disable-next-line no-console
        console.log(errorMessage, credential);
      });
  };

  return (
    <div>
      <h1>Calit!</h1>
      <h3>세상에서 가장 쉬운 애자일 협업 툴</h3>
      <div>
        <button type="button" onClick={() => handleClickLogin()}>
          구글 계정으로 로그인
        </button>
      </div>
    </div>
  );
}
