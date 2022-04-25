import React from "react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Success from "../Success/Success";
import Error from "../Error/Error";
import Cookies from "js-cookie";
import { serverUrl } from "../serverurl";

export default function ProductList() {
  const [items, setItems] = useState([[]]);
  const [favourites, setFavourites] = useState(0);

  const addfavourites = (id) => {
    const data = {
      id: id,
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
  useEffect(() => {
    async function getItems() {
      axios.defaults.headers.common["authorization"] =
        localStorage.getItem("token");
      const response = await axios.get(serverUrl + "/getallitems");
      setItems(response.data);
    }
    getItems();
    console.log(items);
  }, []);
  return (
    <>
      {items.map((item) => (
        <div className="col-md-5">
        <div className="card">
          <img className="card-img-top w-100 d-block" src={item.image} />
          <div className="card-body">
            <h4 className="card-title">{item.name}</h4>
            <p className="card-text">{item.description}</p>
            <p className="card-text">
              <b>Item Category: </b>
              {item.category}
            </p>
            <p className="card-text">${item.price}</p>
            {item.quantity == 0 ? (
              <h3 className="soldout">Sold Out</h3>
            ) : (
              <Link
                className="btn btn-primary default-button"
                type="button"
                to="product"
                state={item}
              >
                Buy
              </Link>
            )}
            <div>
              <a
                className="btn btn-light action-button default-button favourites"
                role="button"
                onClick={() => addfavourites(item.id)}
              >
                Add to Favourites
                </a>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
