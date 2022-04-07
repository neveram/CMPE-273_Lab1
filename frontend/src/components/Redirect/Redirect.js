import React from "react";
import { Navigate } from "react-router";
import Cookies from "js-cookie";

export default function Redirect() {
  const redirect = Cookies.get("auth");
  return <>{!redirect ? <Navigate to={"/signin"} /> : ""}</>;
}
