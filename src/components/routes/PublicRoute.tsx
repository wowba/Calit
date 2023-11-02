import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";

import loginState from "../../recoil/atoms/login/loginState";
import LoadingPage from "../LoadingPage";

export default function PublicRoute() {
  const navigate = useNavigate();

  const { isLogin } = useRecoilValue(loginState);

  useEffect(() => {
    if (isLogin) {
      navigate("/");
    }
  }, []);

  return isLogin ? <LoadingPage /> : <Outlet />;
}
