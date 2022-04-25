import React from "react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

export default function PurchasedItem({
  items,
  setItem,
  pageSize,
  pageNumber,
  empty,
}) {
  return (
    <>
      {empty ? (
        ""
      ) : (
        <>
          {items[pageNumber - 1].map((item) => (
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
                <td className="border-0 align-middle">
                  <strong>{item.quantity}</strong>
                </td>
                <td className="border-0 align-middle">
                  <strong>{item.gift ? "Yes" : "No"}</strong>
                  <br />
                  <strong>
                    {item.giftDescription ? item.giftDescription : ""}
                  </strong>
                </td>
              </tr>
            </tbody>
          ))}
        </>
      )}
    </>
  );
}
