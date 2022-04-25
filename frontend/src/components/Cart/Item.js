import React from "react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { serverUrl } from "../serverurl";

export default function Item({ items, setItems, item, setItem, pageSize }) {
  // const [items, setItems] = useState([[]]);
  const [empty, setEmpty] = useState(false);
  const [force, setForce] = useState(false);
  const [gift, setGift] = useState({});
  const [giftDescription, setGiftDescription] = useState({});

  Array.prototype.chunk = function (n) {
    if (!this.length) {
      return [];
    }
    return [this.slice(0, n)].concat(this.slice(n).chunk(n));
  };
  // console.log([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].chunk(5));

  // useEffect(() => {
  //   async function getCart() {
  //     axios.defaults.headers.common["authorization"] =
  //       localStorage.getItem("token");
  //     const response = await axios.get(serverUrl + "/getcart", {
  //       params: { user: Cookies.get("username") },
  //     });
  //     if (response.data != "EMPTY") {
  //       setItems(response.data);
  //     } else {
  //       setEmpty(true);
  //     }
  //   }

  //   getCart();
  // }, [item]);

  const deleteItem = (item) => {
    axios.defaults.headers.common["authorization"] =
      localStorage.getItem("token");
    axios.delete(serverUrl + "/deletecartitem", {
      data: {
        id: item._id,
        user: Cookies.get("username"),
        quantity: item.quantity,
      },
    });
    setItem(item);
    setForce(!force);
  };

  const increment = (item) => {
    console.log(item);
    axios.defaults.headers.common["authorization"] =
      localStorage.getItem("token");
    axios.put(serverUrl + "/incrementcartitem", {
      id: item._id,
      user: Cookies.get("username"),
    });
    setItem(item);
    setForce(!force);
  };

  const decrement = (item) => {
    axios.defaults.headers.common["authorization"] =
      localStorage.getItem("token");
    axios.put(serverUrl + "/decrementcartitem", {
      id: item._id,
      quantity: item.quantity,
      user: Cookies.get("username"),
    });
    setItem(item);
    setForce(!force);
  };

  const addGift = (value, key) => {
    setGift({ ...gift, [key]: value });
  };

  const addGiftDescription = (value, key) => {
    setGiftDescription({ ...gift, [key]: value });
  };

  const addGiftToCart = (key, item) => {
    axios.defaults.headers.common["authorization"] =
      localStorage.getItem("token");
    axios.put(serverUrl + "/addgift", {
      id: item._id,
      user: Cookies.get("username"),
      gift: gift[key],
      giftDescription: giftDescription[key],
    });
    setGift({ ...gift, [key]: "" });
    setGiftDescription({ ...giftDescription, [key]: "" });
    setForce(!force);
  };

  return (
    <>
      {empty ? (
        ""
      ) : (
        <>
          {items.map((item, key) => (
            <tbody>
              <tr>
                <th scope="row" className="border-0">
                  <div className="p-2">
                    <img
                      src={item.image}
                      alt=""
                      width="70"
                      className="img-fluid rounded shadow-sm"
                    />
                    <div className="ml-3 d-inline-block align-middle">
                      <h5 className="mb-0">
                        {" "}
                        <a
                          href="#"
                          className="text-dark d-inline-block align-middle"
                        >
                          {item.name}
                        </a>
                      </h5>
                      <span className="text-muted font-weight-normal font-italic d-block">
                        Category: {item.category}
                      </span>
                    </div>
                  </div>
                </th>
                <td className="border-0 align-middle">
                  <strong>${item.price}</strong>
                </td>
                <td>
                  <input
                    type="checkbox"
                    checked={item.gift}
                    onChange={(e) => {
                      addGift(e.target.checked, key);
                    }}
                  />
                  <input
                    type="text"
                    value={item.giftDescription}
                    onChange={(e) => addGiftDescription(e.target.value, key)}
                  />
                  <button onClick={() => addGiftToCart(key, item)}>
                    Add Gift
                  </button>
                </td>
                <td className="border-0 align-middle">
                  <button onClick={() => decrement(item)}>
                    <i className="fa-solid fa-minus"></i>
                  </button>
                  <strong>{item.quantity}</strong>
                  <button onClick={() => increment(item)}>
                    <i className="fa-solid fa-plus"></i>
                  </button>
                </td>
                <td className="border-0 align-middle">
                  <a className="text-dark" onClick={() => deleteItem(item)}>
                    <i className="fa fa-trash"></i>
                  </a>
                </td>
              </tr>
            </tbody>
          ))}
        </>
      )}
    </>
  );
}
