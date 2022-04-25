import React, { useEffect, useState } from "react";
import Navbar from "../Navbar/Navbar";
import ProductList from "../Home/ProductList";
import { Link } from "react-router-dom";
import Redirect from "../Redirect/Redirect";
import Cookies from "js-cookie";
import { serverUrl } from "../serverurl";
const axios = require("axios");

export default function Profile() {
  const [userData, setUserData] = useState("");

  let shop;

  useEffect(() => {
    async function getUserData() {
      axios.defaults.headers.common["authorization"] =
        localStorage.getItem("token");
      const response = await axios.get(serverUrl + "/getuserdata", {
        params: { user: Cookies.get("username") },
      });
      setUserData(response.data[0]);
    }
    getUserData();
  }, []);

  console.log(userData);

  if (userData.shop == null) {
    shop = (
      <Link
        className="btn btn-primary default-button"
        to="/checkshop"
        role="button"
      >
        Create Shop
      </Link>
    );
  } else {
    shop = (
      <Link className="btn btn-primary default-button" to="/shop" role="button">
        Shop
      </Link>
    );
  }

  return (
    <>
      <Redirect />
      <Navbar loggedin={false} />
      <div className="container">
        <div className="row">
          <div className="col-md-12 mt-3">
            <img src={userData.image} width="150px"></img>
            <h1>{userData.username}</h1>
            <p>{userData.email}</p>
            <p>{userData.phone}</p>
            <p>{userData.gender}</p>
            {/* <p>{userData.birthday.slice(0, 10)}</p> */}
            <p>{userData.address}</p>
            <p>{userData.city}</p>
            <p>{userData.country}</p>
            <Link
              className="btn btn-primary default-button"
              to="/update"
              role="button"
              state={userData}
            >
              Update Profile
            </Link>
            {shop}
            <Link
              to="/purchased"
              className="btn btn-dark rounded-pill py-2 btn-block default-button"
            >
              Previous Purchases
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
