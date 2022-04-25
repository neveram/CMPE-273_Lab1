import React from "react";
import { Navigate } from "react-router";
import Cookies from "js-cookie";

export default function SignOut() {
  Cookies.remove("auth");
  localStorage.clear();
  return <Navigate to="/signin" />;
}
