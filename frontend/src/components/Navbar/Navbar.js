import React from "react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import { useLocation } from "react-router";

export default function Navbar(props) {
  let buttons;
  let auth = Cookies.get("auth");
  let location = useLocation();
  console.log(location.pathname);
  const search = (
    <form className="me-auto search-form" target="_self">
      <div className="d-flex align-items-center">
        <label className="form-label d-flex mb-0" htmlFor="search-field">
          <i className="fa fa-search"></i>
        </label>
        <input
          className="form-control search-field"
          type="search"
          id="search-field"
          name="search"
        />
      </div>
    </form>
  );
  if (auth) {
    buttons = (
      <>
        {location.pathname == "/" ? (
          search
        ) : (
          <div className="me-auto search-form"></div>
        )}
        <Link
          className="btn btn-light action-button"
          role="button"
          to="/favourites"
        >
          Favourites
        </Link>

        <Link className="btn btn-light action-button" role="button" to="/cart">
          Cart
        </Link>
        <Link
          className="btn btn-light action-button"
          role="button"
          to="/profile"
        >
          User
        </Link>
        <Link
          className="btn btn-light action-button"
          role="button"
          to="/signout"
        >
          Sign out
        </Link>
      </>
    );
  } else {
    buttons = (
      <>
        <div className="offset-10"></div>
        <Link
          className="btn btn-light action-button offset "
          role="button"
          to="/signin"
        >
          Sign in
        </Link>
        <Link
          className="btn btn-light action-button"
          role="button"
          to="/register"
        >
          Register
        </Link>
      </>
    );
  }
  return (
    <>
      <nav className="navbar navbar-light navbar-expand-lg navigation-clean-search">
        <div className="container">
          <Link className="navbar-brand" to="/">
            Etsy
          </Link>
          <button
            data-bs-toggle="collapse"
            className="navbar-toggler"
            data-bs-target="#navcol-1"
          >
            <span className="visually-hidden">Toggle navigation</span>
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navcol-1">
            <ul className="navbar-nav"></ul>

            {buttons}
          </div>
        </div>
      </nav>
    </>
  );
}
