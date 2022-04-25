import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { serverUrl } from "../serverurl";

export default function Sales({ shop }) {
  const [items, setItems] = useState([[]]);
  useEffect(() => {
    async function getItems() {
      axios.defaults.headers.common["authorization"] =
        localStorage.getItem("token");
      const response = await axios.get(serverUrl + "/getitems", {
        params: { shop: shop },
      });
      setItems(response.data);
    }
    getItems();
    // console.log(items);
  }, [shop]);
  return (
    <div className="row">
      <div className="col-md-12 " style={{ borderBottom: "1px solid" }}>
        <h3>Sales Details</h3>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th scope="col" className="border-0 bg-light">
              <div className="p-2 px-3 text-uppercase">Product</div>
            </th>
            <th scope="col" className="border-0 bg-light">
              <div className="py-2 text-uppercase">Sales</div>
            </th>
            <th scope="col" className="border-0 bg-light">
              <div className="py-2 text-uppercase">Quantity</div>
            </th>
          </tr>
        </thead>
        {console.log(items)}

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
                    <span className="text-muted font-weight-normal font-italic d-block">
                      Category: {item.category}
                    </span>
                  </div>
                </div>
              </th>
              <td className="border-0 align-middle">
                <strong>${item.sold * item.price}</strong>
              </td>
              <td className="border-0 align-middle">
                <strong>{item.sold}</strong>
              </td>
            </tr>
          </tbody>
        ))}
      </table>
    </div>
  );
}
