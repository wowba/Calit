import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { doc, onSnapshot } from "firebase/firestore";

import { db } from "../../firebaseSDK";
import Header from "../Header";
import loginState from "../../recoil/atoms/login/loginState";
import userDataState from "../../recoil/atoms/login/userDataState";

export default function PrivateRoute() {
  const navigate = useNavigate();
  const { isLogin, userCredential } = useRecoilValue(loginState);
  const setUserDataState = useSetRecoilState(userDataState);

  useEffect(() => {
    if (!isLogin) {
      navigate("/login");
    }
  }, []);

  if (isLogin) {
    useEffect(() => {
      // 1. onSnapShot 메서드로 문서 (유저 정보) 구독
      const userRef = doc(db, "user", userCredential.email);
      const unsub = onSnapshot(userRef, (userDoc) => {
        // 2. 변경시마다 useSetRecoilState를 이용해서 atom 업데이트
        setUserDataState({
          userData: userDoc.data(),
        });
      });
      // 3. 클린업 함수에서 구독 중지 메서드 실행
      return () => unsub();
    }, []);
  }

  return isLogin === true ? (
    <>
      <Header />
      <Outlet />
    </>
  ) : null;
}
