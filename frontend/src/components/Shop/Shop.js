import React from "react";
import { useState, useEffect } from "react";
import Navbar from "../Navbar/Navbar";
import Form from "./Form";
import Redirect from "../Redirect/Redirect";
import axios from "axios";
import Cookies from "js-cookie";
import ShopItems from "./ShopItems";
import Sales from "./Sales";
import Footer from "../Footer/Footer";
import { serverUrl } from "../serverurl";

export default function Shop() {
  const [add, setAdd] = useState(false);

  const [userData, setUserData] = useState([]);
  const [addImage, setAddImage] = useState("");
  const [addShopImage, setAddShopImage] = useState("");
  const [addName, setAddName] = useState("");
  const [addCategory, setAddCategory] = useState("");
  const [addDescription, setAddDescription] = useState("");
  const [addPrice, setAddPrice] = useState("");
  const [addQuantity, setAddQuantity] = useState("");
  const [force, setForce] = useState(false);

  const shop = userData.shop;

  useEffect(() => {
    async function getUserData() {
      axios.defaults.headers.common["authorization"] =
        localStorage.getItem("token");
      const response = await axios.get(serverUrl + "/getuserdata", {
        params: { user: Cookies.get("username") },
      });
      setUserData(response.data[0]);
    }

    getUserData();
    console.log(userData.shopimage);
  }, [force]);

  const toggleAdd = () => {
    setAdd(!add);
  };

  const fileHandler = (event) => {
    setAddImage(event.target.files[0]);
  };

  const fileHandlerShop = (event) => {
    setAddShopImage(event.target.files[0]);
  };

  const shopimage = () => {
    var bodyFormData = new FormData();
    bodyFormData.append("file", addShopImage);
    bodyFormData.append("shop", shop);

    //set the with credentials to true
    axios.defaults.withCredentials = true;
    //make a post request with the user data
    axios.post(serverUrl + "/shopimage", bodyFormData).then((response) => {
      if (response.data === "SUCCESS") {
        console.log("Status Code : ", response.status);
        setForce(!force);
      }
      if (response.data === "UNSUCCESS") {
        console.log(response.data);
      }
    });
  };

  const additem = () => {
    var bodyFormData = new FormData();
    bodyFormData.append("file", addImage);
    bodyFormData.append("shop", shop);
    bodyFormData.append("name", addName);
    bodyFormData.append("category", addCategory);
    bodyFormData.append("description", addDescription);
    bodyFormData.append("price", addPrice);
    bodyFormData.append("quantity", addQuantity);

    //set the with credentials to true
    axios.defaults.withCredentials = true;
    //make a post request with the user data
    axios.post(serverUrl + "/additem", bodyFormData).then((response) => {
      if (response.data === "SUCCESS") {
        console.log("Status Code : ", response.status);
        setAdd(false);
        setAddName("");
        setAddCategory("");
        setAddDescription("");
        setAddPrice("");
        setAddQuantity("");
        setForce(!force);
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
        <div className="row" style={{ borderBottom: "1px solid" }}>
          <div className="col col-md-2">
            <div className="row">
              <img src={userData.shopimage} />
              <div className="col-md-12">
                <div className="avatar">
                  <div className="avatar-bg center"></div>
                </div>
                <input
                  className="form-control"
                  type="file"
                  name="file"
                  onChange={fileHandlerShop}
                />
                <a
                  className="btn default-button mt-3"
                  role="button"
                  onClick={shopimage}
                >
                  Image Upload
                </a>
              </div>
            </div>
          </div>
          <div className="col col-md-3">
            <h1>{userData.shop}</h1>

            <a
              className="btn btn-light default-button"
              role="button"
              onClick={toggleAdd}
            >
              Add Items
            </a>
          </div>
          <div className="col col-md-2 offset-5">
            <h4>Store Owner Details</h4>
            <p>Owner Name: {userData.name}</p>
            <p>Owner Email: {userData.email}</p>
            <p>Owner Phone: {userData.phone}</p>
          </div>
        </div>
        {add && (
          <div className="modal-custom">
            <div onClick={toggleAdd} className="overlay-custom"></div>
            <div className="modal-content">
              <div className="row profile-row justify-content-center mt-2">
                <div className="col-md-8 offset-1">
                  <h2>Add an item.</h2>
                </div>
                <div className="col-md-1 justify-content-end">
                  <a className="btn mt-2" role="button" onClick={toggleAdd}>
                    ❌
                  </a>
                </div>
              </div>
              <div className="row profile-row justify-content-center">
                <div className="col-md-8">
                  <label className="form-label">Item Image</label>
                  <div className="avatar">
                    <div className="avatar-bg center"></div>
                  </div>
                  <input
                    className="form-control"
                    type="file"
                    name="file"
                    onChange={fileHandler}
                  />
                </div>
              </div>
              <div className="row profile-row justify-content-center mt-2">
                <div className="col-md-8">
                  <label className="form-label">Item Name</label>
                  <input
                    className="form-control"
                    type="text"
                    value={addName}
                    onChange={(e) => setAddName(e.target.value)}
                  />
                </div>
              </div>
              <div className="row profile-row justify-content-center mt-2">
                <div className="col-md-8">
                  <label className="form-label">Category</label>
                  <input
                    list="category"
                    id="category-list"
                    name="category"
                    className="form-select"
                    defaultValue={""}
                    value={addCategory}
                    onChange={(e) => setAddCategory(e.target.value)}
                  />

                  <datalist id="category">
                    <option value="Clothing & Shoes">Clothing & Shoes</option>
                    <option value="Computers">Computers</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Entertainment & Arts">
                      Entertainment & Arts
                    </option>
                    <option value="Food & Gifts">Food & Gifts</option>
                    <option value="Health & Beauty">Health & Beauty</option>
                  </datalist>
                </div>
              </div>
              <div className="row profile-row justify-content-center mt-2">
                <div className="col-md-8">
                  <label className="form-label">Price</label>
                  <input
                    className="form-control"
                    type="number"
                    step="0.01"
                    value={addPrice}
                    onChange={(e) => setAddPrice(e.target.value)}
                  />
                </div>
              </div>
              <div className="row profile-row justify-content-center mt-2">
                <div className="col-md-8">
                  <label className="form-label ">Description</label>
                  <textarea
                    className="form-control"
                    value={addDescription}
                    onChange={(e) => setAddDescription(e.target.value)}
                  ></textarea>
                </div>
              </div>
              <div className="row profile-row justify-content-center mt-2">
                <div className="col-md-8">
                  <label className="form-label">Quantity</label>
                  <input
                    className="form-control"
                    type="number"
                    value={addQuantity}
                    onChange={(e) => setAddQuantity(e.target.value)}
                  />
                </div>
              </div>
              <a
                className="btn default-button mt-3"
                role="button"
                onClick={additem}
              >
                Add
              </a>
            </div>
          </div>
        )}
      </div>
      <div className="container">
        <Sales shop={shop} />
        <div className="col-md-12 mt-3">
          <h1>Items</h1>
        </div>
        <div className="row mt-5">
          {shop ? (
            <ShopItems shop={shop} force={force} setForce={setForce} />
          ) : (
            ""
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
