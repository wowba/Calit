import React from "react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useSetRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../../firebaseSDK";
import loginState from "../../recoil/atoms/login/loginState";
import ShrikhandRegular from "../../assets/fonts/Shrikhand-Regular.ttf";
import RobotoRegular from "../../assets/fonts/Roboto-Regular.ttf";
import loginBackground from "../../assets/images/loginBackground.svg";
import googleLoginIcon from "../../assets/icons/googleLoginIcon.svg";
import userDataState from "../../recoil/atoms/login/userDataState";

const LoginLayout = styled.div`
  height: 100vh;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  background-image: url(${loginBackground});
  background-size: 100%;
`;

const LoginTitleParagraph = styled.p`
  @font-face {
    font-family: "ShrikhandRegular";
    src: local("ShrikhandRegular"), url(${ShrikhandRegular});
  }

  font-family: "ShrikhandRegular";
  font-weight: 500;
  font-size: 12.5rem;
  line-height: 100%;

  margin-bottom: 1rem;
`;

const LoginIntroParagraph = styled.p`
  @font-face {
    font-family: "RobotoRegular";
    src: local("RobotoRegular"), url(${RobotoRegular});
  }

  font-family: "RobotoRegular";
  font-weight: 700;
  font-size: 1.5rem;

  margin-bottom: 3rem;
`;

const GoogleLoginBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 1rem;

  background-color: #fbf8f1;
  padding: 0.5rem 1rem 0.5rem 1rem;
  border-radius: 0.5rem;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.24);
`;

const GoogleLoginImg = styled.img`
  width: 2.5rem;
  height: 2.5rem;
`;

const GoogleLoginText = styled.span`
  @font-face {
    font-family: "RobotoRegular";
    src: local("RobotoRegular"), url(${RobotoRegular});
  }

  font-family: "RobotoRegular";
  font-weight: 400;
  font-size: 1.5rem;
`;

export default function Login() {
  const navigate = useNavigate();

  const setLoginState = useSetRecoilState(loginState);
  const setUserDataState = useSetRecoilState(userDataState);

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

        const userRef = doc(db, "user", user.email as string);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          await setDoc(doc(db, "user", user.email as string), {
            project_list: [],
            profile_img_URL: user.photoURL,
            name: user.displayName,
            email: user.email,
            intro: "",
            is_deleted: false,
          });
        }

        return { user };
      })
      .then(async ({ user }) => {
        setLoginState({
          isLogin: true,
          userCredential: JSON.parse(JSON.stringify(user)),
        });
        const userRef = doc(db, "user", user.email as string);
        const userSnap = await getDoc(userRef);
        setUserDataState({
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
    <LoginLayout>
      <LoginTitleParagraph>Calit!</LoginTitleParagraph>
      <LoginIntroParagraph>
        세상에서 가장 쉬운 애자일 협업 툴
      </LoginIntroParagraph>
      <GoogleLoginBtn type="button" onClick={() => handleClickLogin()}>
        <GoogleLoginImg src={googleLoginIcon} alt="googleLoginIcon" />
        <GoogleLoginText>Google 계정으로 로그인</GoogleLoginText>
      </GoogleLoginBtn>
    </LoginLayout>
  );
}
