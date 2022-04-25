import React from "react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { serverUrl } from "../serverurl";

export default function FavouritesProductList() {
  const [items, setItems] = useState([[]]);
  const [empty, setEmpty] = useState(false);
  const [remove, setRemove] = useState("");

  useEffect(() => {
    async function getFavourites() {
      axios.defaults.headers.common["authorization"] =
        localStorage.getItem("token");
      const response = await axios.get(serverUrl + "/getfavourites", {
        params: { user: Cookies.get("username") },
      });
      if (response.data != "EMPTY") {
        setItems(response.data);
      } else {
        setEmpty(true);
      }
    }

    getFavourites();
  }, [remove]);

  const removefavourite = (item) => {
    axios.delete(serverUrl + "/removefavourite", {
      data: { id: item._id, username: Cookies.get("username") },
    });
    setRemove(item);
  };

  return (
    <>
      {empty ? (
        ""
      ) : (
        <>
          {items.map((item) => (
            <div className="col-md-3">
              <div className="card">
                <img className="card-img-top w-100 d-block" src={item.image} />
                <div className="card-body">
                  <h4 className="card-title">{item.name}</h4>
                  <p className="card-text">{item.description}</p>
                  <p className="card-text">
                    <b>Category: </b>
                    {item.category}
                  </p>
                  <p className="card-text">${item.price}</p>
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
                  <a
                    className="btn btn-primary default-button"
                    type="button"
                    onClick={() => removefavourite(item)}
                  >
                    Remove
                  </a>
                </div>
              </div>
            </div>
          ))}
        </>
      )}
    </>
  );
}
