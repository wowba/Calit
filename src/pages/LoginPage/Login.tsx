import React from "react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useSetRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../../firebaseSDK";
import loginState from "../../recoil/atoms/login/loginState";
import loginBackground from "../../assets/images/loginBackground.svg";
import googleLoginIcon from "../../assets/icons/googleLoginIcon.svg";
import userDataState from "../../recoil/atoms/login/userDataState";
import { ReactComponent as loginLogo } from "../../assets/logo/loginLogo.svg";

const LoginLayout = styled.div`
  height: 100vh;
  width: 100vw;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  background-image: url(${loginBackground});
  scale: 1.1;
  background-size: 100%;
  background-repeat: repeat;
  background-position: 50% 10%;

  box-shadow:
    inset 0 6rem 6rem -5rem rgba(0, 0, 0, 0.1),
    inset 0px -11rem 11rem -3rem rgba(255, 255, 255, 1);
`;

const LoginLogo = styled(loginLogo)`
  width: 28rem;

  transform: translateY(-5rem);
`;

const LoginIntroParagraph = styled.p`
  font-weight: 700;
  font-size: 1.25rem;

  margin: 1rem 0 8rem 0;
  transform: translateY(-5rem);
`;

const GoogleLoginBtn = styled.button`
  transition: all 0.5s ease;

  position: fixed;

  bottom: 13.5rem;

  display: flex;
  align-items: center;
  gap: 1rem;

  height: 3.5rem;

  background-color: ${(props) => props.theme.Color.mainColor};
  padding: 1rem 3.5rem 1rem 3.5rem;
  border-radius: 0.5rem;

  margin: 0 0 2rem 0;

  &:hover {
    background-color: ${(props) => props.theme.Color.hoverColor};
  }
`;

const GoogleLoginImgBox = styled.div`
  background-color: ${(props) => props.theme.Color.mainWhite};
  border-radius: 50%;
  width: 1.5rem;
  height: 1.5rem;

  display: flex;
  align-items: center;
  justify-content: center;
`;

const GoogleLoginImg = styled.img`
  width: 1.2rem;
  height: 1.2rem;
`;

const GoogleLoginText = styled.span`
  line-height: 0.3;
  font-weight: 400;
  font-size: 1.5rem;
  color: ${(props) => props.theme.Color.mainWhite};
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
            email: user.email,
            name: user.displayName,
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
      <LoginLogo />
      <LoginIntroParagraph>
        세상에서 가장 쉬운 애자일 협업 툴
      </LoginIntroParagraph>
      <GoogleLoginBtn type="button" onClick={() => handleClickLogin()}>
        <GoogleLoginImgBox>
          <GoogleLoginImg src={googleLoginIcon} alt="googleLoginIcon" />
        </GoogleLoginImgBox>
        <GoogleLoginText>Sign in with Google</GoogleLoginText>
      </GoogleLoginBtn>
    </LoginLayout>
  );
}
