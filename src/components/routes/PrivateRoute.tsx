import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";

import Header from "../Header";
import loginState from "../../recoil/atoms/login/loginState";

export default function PrivateRoute() {
  const navigate = useNavigate();
  const loginStateValue = useRecoilValue(loginState);

  useEffect(() => {
    if (!loginStateValue) {
      navigate("/login");
    }
  });

  return loginStateValue === true ? (
    <>
      <Header />
      <Outlet />
    </>
  ) : null;
}
