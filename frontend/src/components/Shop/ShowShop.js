import React, { useState, useEffect } from "react";
import Navbar from "../Navbar/Navbar";
import Redirect from "../Redirect/Redirect";
import { useLocation } from "react-router";
import ShowShopItems from "./ShowShopItems";
import axios from "axios";
import Footer from "../Footer/Footer";
import { serverUrl } from "../serverurl";

export default function ShowShop() {
  const location = useLocation();
  const shop = location?.state;
  const [owner, setOwner] = useState("");
  useEffect(() => {
    async function getOwner() {
      axios.defaults.headers.common["authorization"] =
        localStorage.getItem("token");
      const response = await axios.get(serverUrl + "/getshopowner", {
        params: { shop: shop },
      });
      setOwner(response.data[0]);
    }
    getOwner();
  }, []);
  return (
    <>
      <Redirect />
      <Navbar />
      <div className="container">
        <div className="row" style={{ borderBottom: "1px solid" }}>
          <div className="col col-md-2">
            <img src={owner.shopimage} width="150" />
          </div>
          <div className="col col-md-3">
            <h1>{shop}</h1>
          </div>
          <div className="col col-md-2 offset-5">
            <h4>Store Owner Details</h4>
            <p>Owner Name: {owner.name}</p>
            <p>Owner Email: {owner.email}</p>
            <p>Owner Phone: {owner.phone}</p>
          </div>
        </div>
        <div className="container">
          {/* <Sales shop={shop} /> */}
          <div className="col-md-12 mt-3">
            <h1>Items</h1>
          </div>
          <div className="row mt-5">
            {shop ? <ShowShopItems shop={shop} /> : ""}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
