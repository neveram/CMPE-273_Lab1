import React, { useState } from "react";
import Navbar from "../Navbar/Navbar";
import Redirect from "../Redirect/Redirect";
import { Link, useLocation } from "react-router-dom";
import Success from "../Success/Success";
import Error from "../Error/Error";
import Cookies from "js-cookie";
import axios from "axios";
import Footer from "../Footer/Footer";
import { serverUrl } from "../serverurl";

export default function ProductPage() {
  const location = useLocation();
  const item = location?.state;
  console.log(item);
  const [quantity, setQuantity] = useState(1);
  const [favourites, setFavourites] = useState(0);
  const [cart, setCart] = useState(0);

  const addfavourites = () => {
    const data = {
      id: item._id,
      user: Cookies.get("username"),
    };
    axios.defaults.headers.common["authorization"] =
      localStorage.getItem("token");
    axios.post(serverUrl + "/addfavourites", data).then((response) => {
      if (response.data === "SUCCESS") {
        console.log("Status Code : ", response.status);
        setFavourites(1);
      }
      if (response.data === "UNSUCCESS") {
        console.log(response.data);
        setFavourites(2);
      }
    });
  };

  const addcart = () => {
    const data = {
      id: item._id,
      user: Cookies.get("username"),
      quantity: quantity,
      rquantity: item.quantity - quantity,
    };
    axios.defaults.headers.common["authorization"] =
      localStorage.getItem("token");
    axios.post(serverUrl + "/addcart", data).then((response) => {
      if (response.data === "SUCCESS") {
        console.log("Status Code : ", response.status);
        setCart(1);
      }
      if (response.data === "UNSUCCESS") {
        console.log(response.data);
        setCart(2);
      }
    });
  };
  return (
    <>
      <Redirect />
      <Navbar />
      <div className="container">
        <div className="row">
          <div className="col-md-12 mt-3">
            <h1>Product Page</h1>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <img src={item.image} width="500" />
          </div>
          <div className="col-md-6">
            <Link to={"/showshop"} state={item.shop}>
              {item.shop}
            </Link>
            <h1>{item.name}</h1>
            <p>
              <strong>{item.price}$</strong>
            </p>
            <p>Description: {item.description}</p>
            <label>Quantity</label>
            <input
              className="form-control"
              type="number"
              min="1"
              max={item.quantity}
              value={quantity}
              onChange={(e) => {
                setQuantity(e.target.value);
              }}
            ></input>

            <div className="row mt-2">
              <div className="col-md-6">
                <a
                  className="btn btn-light action-button default-button"
                  role="button"
                  onClick={addcart}
                >
                  Add to Cart
                </a>
              </div>
              <div className="col-md-6">
                <a
                  className="btn btn-light action-button default-button"
                  role="button"
                  onClick={addfavourites}
                >
                  Add to Favourites
                </a>
              </div>

              {favourites == 0 ? (
                ""
              ) : favourites == 2 ? (
                <Error message="Already added" />
              ) : (
                <Success message="Added to Favourites!" />
              )}

              {cart == 0 ? (
                ""
              ) : cart == 2 ? (
                <Error message="Already added" />
              ) : (
                <Success message="Added to Cart!" />
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
