import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";

import loginState from "../../recoil/atoms/login/loginState";

export default function PublicRoute() {
  const navigate = useNavigate();

  const loginStateValue = useRecoilValue(loginState);

  useEffect(() => {
    if (loginStateValue) {
      navigate("/");
    }
  }, []);

  return loginStateValue === true ? null : <Outlet />;
}
