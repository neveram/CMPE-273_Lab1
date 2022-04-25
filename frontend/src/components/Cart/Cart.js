import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import Item from "./Item";
import Redirect from "../Redirect/Redirect";
import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { serverUrl } from "../serverurl";

export default function Cart() {
  const [items, setItems] = useState([]);
  const [empty, setEmpty] = useState(false);
  const [total, setTotal] = useState(0);
  const [item, setItem] = useState("");

  useEffect(() => {
    async function getCart() {
      axios.defaults.headers.common["authorization"] =
        localStorage.getItem("token");
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
  }, [item, empty]);
  useEffect(() => {
    async function getTotal() {
      axios.defaults.headers.common["authorization"] =
        localStorage.getItem("token");
      const response = await axios.get(serverUrl + "/getcarttotal", {
        params: { user: Cookies.get("username") },
      });
      if (response.data != "EMPTY") {
        setTotal(response.data);
      } else {
        setTotal(0);
      }
    }

    getTotal();
  }, [item]);

  const addpurchased = () => {
    const data = {
      items: items,
      user: Cookies.get("username"),
    };
    axios.defaults.headers.common["authorization"] =
      localStorage.getItem("token");
    axios.post(serverUrl + "/addpurchased", data).then((response) => {
      if (response.data === "SUCCESS") {
        console.log("Status Code : ", response.status);
      }
      if (response.data === "UNSUCCESS") {
        console.log(response.data);
      }
    });
  };

  return (
    <>
      <Redirect />
      <Navbar />
      <div className="container">
        <div className="row">
          <div className="col-lg-12 p-5 bg-white rounded shadow-sm mb-5">
            {items.length > 0 ? (
              <>
                <h1>Cart</h1>
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th scope="col" className="border-0 bg-light">
                          <div className="p-2 px-3 text-uppercase">Product</div>
                        </th>
                        <th scope="col" className="border-0 bg-light">
                          <div className="py-2 text-uppercase">Price</div>
                        </th>
                        <th scope="col" className="border-0 bg-light">
                          <div className="py-2 text-uppercase">Gift</div>
                        </th>
                        <th scope="col" className="border-0 bg-light">
                          <div className="py-2 text-uppercase">Quantity</div>
                        </th>
                        <th scope="col" className="border-0 bg-light">
                          <div className="py-2 text-uppercase">Remove</div>
                        </th>
                      </tr>
                    </thead>
                    <Item
                      items={items}
                      setItems={setItems}
                      item={item}
                      setItem={setItem}
                    />
                  </table>
                </div>
              </>
            ) : (
              <>
                <h1>Nothing in here.</h1>
                <p>Till then, you can check previous purchases.</p>
                <Link
                  to="/purchased"
                  className="btn btn-dark rounded-pill py-2 btn-block default-button"
                >
                  Previous Purchases
                </Link>
              </>
            )}
          </div>
        </div>
        {items.length > 0 ? (
          <div className="row bg-white rounded shadow-sm">
            <div className="col-lg-6 p-5 bg-white rounded shadow-sm offset-6">
              <div className="bg-light rounded-pill px-4 py-3 text-uppercase font-weight-bold">
                Order summary
              </div>
              <div className="p-4">
                <ul className="list-unstyled mb-4">
                  <li className="d-flex justify-content-between py-3 border-bottom">
                    <strong className="text-muted">Total</strong>
                    <h5 className="font-weight-bold">
                      ${parseFloat(total).toFixed(2)}
                    </h5>
                  </li>
                </ul>

                <Link
                  to="/purchased"
                  className="btn btn-dark rounded-pill py-2 btn-block default-button"
                  onClick={addpurchased}
                >
                  Proceed to checkout
                </Link>
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    </>
  );
}
