import React from "react";
import Navbar from "../Navbar/Navbar";
import Redirect from "../Redirect/Redirect";
import Item from "./Item";

export default function Purchased() {
  return (
    <>
      <Redirect />
      <Navbar />
      <div className="container">
        <div className="row">
          <div className="col-lg-12 p-5 bg-white rounded shadow-sm mb-5">
            <h1>Previous Orders</h1>
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
                  </tr>
                </thead>
                <Item history={true} />
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
