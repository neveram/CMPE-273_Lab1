import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";
import { serverUrl } from "../serverurl";

export default function ShowShopItems(props) {
  const [items, setItems] = useState([[]]);

  const [item, setItem] = useState("");

  const [myshop, setMyShop] = useState(props.shop);
  console.log(myshop);

  useEffect(() => {
    async function getItems() {
      axios.defaults.headers.common["authorization"] =
        localStorage.getItem("token");
      const response = await axios.get(serverUrl + "/getitems", {
        params: { shop: myshop },
      });
      setItems(response.data);
    }
    getItems();
    // console.log(items);
  }, []);

  return (
    <>
      {items.map((item) => (
        <div className="col-md-3">
          <div className="card" style={{ position: "inherit" }}>
            <img className="card-img-top w-100 d-block" src={item.image} />
            <div className="card-body">
              <h4 className="card-title">{item.name}</h4>
              <p className="card-text">
                <b>Description: </b>
                {item.description}
              </p>
              <p className="card-text">
                <b>Category: </b>
                {item.category}
              </p>
              <p className="card-text">${item.price}</p>
              <p className="card-text">
                <b>Quantity: </b>
                {item.quantity}
              </p>
              {item.quantity == 0 ? (
                <h3 className="soldout">Sold Out</h3>
              ) : (
                <Link
                  className="btn btn-primary default-button"
                  type="button"
                  to="/product"
                  state={item}
                >
                  Buy
                </Link>
              )}
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
