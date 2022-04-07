import React from "react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { serverUrl } from "../serverurl";

export default function Item({ item, setItem, history }) {
  const [items, setItems] = useState([[]]);
  const [empty, setEmpty] = useState(false);

  useEffect(() => {
    if (history) {
      async function getPurchased() {
        const response = await axios.get(serverUrl + "/getpurchased", {
          params: { user: Cookies.get("username") },
        });
        if (response.data != "EMPTY") {
          setItems(response.data);
        } else {
          setEmpty(true);
        }
      }
      getPurchased();
    } else {
      async function getCart() {
        const response = await axios.get(serverUrl + "/getcart", {
          params: { user: Cookies.get("username") },
        });
        if (response.data != "EMPTY") {
          setItems(response.data);
        } else {
          setEmpty(true);
        }
      }

      getCart();
    }
  }, [item]);

  const deleteItem = (item) => {
    axios.delete(serverUrl + "/deletecartitem", {
      data: {
        id: item.id,
        user: Cookies.get("username"),
        quantity: item.quantity,
      },
    });
    setItem(item);
  };
  return (
    <>
      {empty ? (
        ""
      ) : (
        <>
          {items.map((item) => (
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
                      {/* <span className="text-muted font-weight-normal font-italic d-block">
                        Category: {item.category}
                      </span> */}
                    </div>
                  </div>
                </th>
                <td className="border-0 align-middle">
                  <strong>${item.price}</strong>
                </td>
                <td className="border-0 align-middle">
                  <strong>{item.quantity}</strong>
                </td>
                {history ? (
                  ""
                ) : (
                  <td className="border-0 align-middle">
                    <a className="text-dark" onClick={() => deleteItem(item)}>
                      <i className="fa fa-trash"></i>
                    </a>
                  </td>
                )}
              </tr>
            </tbody>
          ))}
        </>
      )}
    </>
  );
}
