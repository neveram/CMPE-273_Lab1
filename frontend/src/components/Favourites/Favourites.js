import React from "react";
import Navbar from "../Navbar/Navbar";
import ProductList from "../Home/ProductList";
import { Link } from "react-router-dom";
import Redirect from "../Redirect/Redirect";
import FavouritesProductList from "./FavouritesProductList";
import Footer from "../Footer/Footer";

export default function Favourites() {
  return (
    <>
      <Redirect />
      <Navbar loggedin={false} />
      <div className="container">
        <div className="row mt-3">
          <div className="col col-md-3">
            <h1>Favourites</h1>
          </div>
          <div className="col col-md-4 offset-5">
            <form className="me-auto search-form" target="_self">
              <div className="d-flex align-items-center">
                <label
                  className="form-label d-flex mb-0"
                  htmlFor="search-field"
                >
                  <i className="fa fa-search" style={{ margin: "5px" }}></i>
                </label>
                <input
                  className="form-control search-field"
                  type="search"
                  id="search-field"
                  name="search"
                />
              </div>
            </form>
          </div>
        </div>
        <hr />
        <div className="row mt-3">
          <FavouritesProductList />
        </div>
      </div>
      <Footer />
    </>
  );
}
