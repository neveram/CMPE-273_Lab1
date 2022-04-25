import React, { useState } from "react";
import Navbar from "../Navbar/Navbar";
import Error from "../Error/Error";
import axios from "axios";
import Cookies from "js-cookie";
import { Navigate } from "react-router";
import { serverUrl } from "../serverurl";
import jwt_decode from "jwt-decode";

export default function SignIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [auth, setAuth] = useState(false);
  const [invalid, setInvalid] = useState(false);

  const [redirect, setRedirect] = useState(Cookies.get("auth"));

  const login = () => {
    const data = {
      username: username,
      password: password,
    };
    //set the with credentials to true
    axios.defaults.withCredentials = true;
    //make a post request with the user data
    axios.post(serverUrl + "/login", data).then((response) => {
      if (response.data.split(" ")[0] === "SUCCESS") {
        setAuth(true);
        console.log("Status Code : ", response.status);
        Cookies.set("username", username, { expires: 1 });
        Cookies.set("password", password, { expires: 1 });
        Cookies.set("auth", true, { expires: 1 });
        console.log(response.data.split(" ")[2]);
        var decoded = jwt_decode(response.data.split(" ")[2]);
        localStorage.setItem(
          "token",
          response.data.split(" ").slice(1).join(" ")
        );
        console.log(decoded);
        console.log(decoded.username);
        setRedirect(true);
      } else {
        setAuth(false);
      }
      if (response.data === "UNSUCCESS") {
        setInvalid(true);
        console.log(response.data);
      }
    });
  };

  return (
    <>
      {redirect ? <Navigate to={"/"} /> : ""}
      <Navbar loggedin={true} />
      <form className="form-signin">
        <h1 className="h3 mb-3 font-weight-normal">Please sign in</h1>
        <label htmlFor="inputUsername" className="sr-only">
          Username
        </label>
        <input
          type="text"
          id="inputEmail"
          className="form-control"
          placeholder="Username"
          required=""
          autoFocus=""
          name="email"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <label htmlFor="inputPassword" className="sr-only">
          Password
        </label>
        <input
          type="password"
          id="inputPassword"
          className="form-control"
          placeholder="Password"
          required=""
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <a
          className="btn btn-lg btn-block default-button mt-2"
          type="submit"
          onClick={login}
        >
          Sign in
        </a>
      </form>
      {invalid ? <Error message="Invalid Credentials" /> : ""}
    </>
  );
}
