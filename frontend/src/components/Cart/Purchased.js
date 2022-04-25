import React from "react";
import Navbar from "../Navbar/Navbar";
import Redirect from "../Redirect/Redirect";
import PurchasedItem from "./PurchasedItem";
import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { serverUrl } from "../serverurl";

export default function Purchased() {
  const [pageSize, setPageSize] = React.useState(5);
  const [pageNumber, setPageNumber] = React.useState(1);
  const [page, setPage] = useState(false);
  const [items, setItems] = useState([[]]);
  const [empty, setEmpty] = useState(false);
  const [force, setForce] = useState(false);

  Array.prototype.chunk = function (n) {
    if (!this.length) {
      return [];
    }
    return [this.slice(0, n)].concat(this.slice(n).chunk(n));
  };
  // console.log([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].chunk(5));

  useEffect(() => {
    async function getPurchased() {
      axios.defaults.headers.common["authorization"] =
        localStorage.getItem("token");
      const response = await axios.get(serverUrl + "/getpurchased", {
        params: { user: Cookies.get("username") },
      });
      if (response.data != "EMPTY") {
        console.log(response.data);
        setItems(response.data.chunk(pageSize));
        console.log(items);
      } else {
        setEmpty(true);
      }
    }
    getPurchased();
  }, [pageSize]);

  const togglePage = () => {
    setPage(!page);
  };

  return (
    <>
      <Redirect />
      <Navbar />
      <div className="container">
        <div className="row">
          <div className="col-lg-12 p-5 bg-white rounded shadow-sm mb-5">
            <h1>Purchase History</h1>
            <div className="dropdown">
              <button
                className="btn btn-secondary dropdown-toggle offset-10"
                type="button"
                id="dropdownMenuButton"
                data-toggle="dropdown"
                aria-haspopup="true"
                onClick={togglePage}
              >
                Page size
              </button>

              {page && (
                <div
                  className="dropdown"
                  aria-labelledby="dropdownMenuButton"
                  style={{ border: "1px solid #6C757D" }}
                >
                  <a
                    className="dropdown-item"
                    href="#nogo"
                    onClick={() => {
                      setPageSize(2);
                      togglePage();
                    }}
                  >
                    2
                  </a>
                  <a
                    className="dropdown-item"
                    href="#nogo"
                    onClick={() => {
                      setPageSize(5);
                      togglePage();
                    }}
                  >
                    5
                  </a>
                  <a
                    className="dropdown-item"
                    href="#nogo"
                    onClick={() => {
                      setPageSize(10);
                      togglePage();
                    }}
                  >
                    10
                  </a>
                </div>
              )}
            </div>
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
                      <div className="py-2 text-uppercase">Quantity</div>
                    </th>
                    <th scope="col" className="border-0 bg-light">
                      <div className="py-2 text-uppercase">Gift</div>
                    </th>
                  </tr>
                </thead>
                <PurchasedItem
                  pageSize={pageSize}
                  pageNumber={pageNumber}
                  items={items}
                  empty={empty}
                />
                {pageNumber > 1 && (
                  <button
                    className="btn btn-primary"
                    onClick={() => setPageNumber(pageNumber - 1)}
                  >
                    {" "}
                    Previous Page{" "}
                  </button>
                )}
                {pageNumber != items.length && (
                  <button
                    className="btn btn-primary"
                    onClick={() => setPageNumber(pageNumber + 1)}
                  >
                    {" "}
                    Next Page{" "}
                  </button>
                )}
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
