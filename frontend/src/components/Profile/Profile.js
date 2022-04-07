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
              className="btn btn-primary default-button"
            >
              Previous Purchases
            </Link>
        <div className="row">
          <div className="col-md-12 mt-3">
            <img src={userData.image} width="150px"></img>
            <h1>{userData.username}</h1>
            <p>Email: {userData.email}</p>
            <p>Phone: +1 {userData.phone}</p>
            {/* <p>{userData.gender}</p> */}
            {/* <p>{userData.birthday.slice(0, 10)}</p> */}
            <b>Address:</b>
            <p>{userData.address}</p>
            <p>Country: { userData.country}</p>
            
          </div>
        </div>
      </div>
    </>
  );
}
