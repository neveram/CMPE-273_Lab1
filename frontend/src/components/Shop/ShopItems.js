import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { serverUrl } from "../serverurl";

export default function ShopItems(props) {
  const [items, setItems] = useState([[]]);
  const [editImage, setEditImage] = useState("");
  const [editName, setEditName] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editQuantity, setEditQuantity] = useState("");
  const [item, setItem] = useState("");
  const [edit, setEdit] = useState(false);
  const [myshop, setMyShop] = useState(props.shop);
  console.log(myshop);
  const toggleEdit = (item) => {
    setItem(item);
    setEdit(!edit);
    fill(item);
  };

  const deleteItem = (item) => {
    axios.defaults.headers.common["authorization"] =
      localStorage.getItem("token");
    axios.delete(serverUrl + "/deleteitem", {
      data: { id: item._id },
    });
    props.setForce(!props.force);
  };

  const fileHandler = (event) => {
    setEditImage(event.target.files[0]);
  };

  const edititem = (id) => {
    var bodyFormData = new FormData();
    bodyFormData.append("file", editImage);
    bodyFormData.append("shop", myshop);
    bodyFormData.append("name", editName);
    bodyFormData.append("category", editCategory);
    bodyFormData.append("description", editDescription);
    bodyFormData.append("price", editPrice);
    bodyFormData.append("quantity", editQuantity);
    bodyFormData.append("id", id);

    //set the with credentials to true
    axios.defaults.withCredentials = true;
    axios.defaults.headers.common["authorization"] =
      localStorage.getItem("token");
    //make a post request with the user data
    axios.post(serverUrl + "/edititem", bodyFormData).then((response) => {
      if (response.data === "SUCCESS") {
        console.log("Status Code : ", response.status);
        setEdit(false);
      }
      if (response.data === "UNSUCCESS") {
        console.log(response.data);
      }
    });
  };
  useEffect(() => {
    async function getItems() {
      axios.defaults.headers.common["authorization"] =
        localStorage.getItem("token");
      const response = await axios.get(serverUrl + "/getitems", {
        params: { shop: myshop },
      });
      setItems(response.data);
    }
    getItems();
    // console.log(items);
  }, [edit, props.force, item._id]);

  const fill = (item) => {
    setEditImage(item.image);
    setEditName(item.name);
    setEditCategory(item.category);
    setEditDescription(item.description);
    setEditPrice(item.price);
    setEditQuantity(item.quantity);
  };
  return (
    <>
      {items.map((item) => (
        <div className="col-md-3">
          <div className="card" style={{ position: "inherit" }}>
            <img className="card-img-top w-100 d-block" src={item.image} />
            <div className="card-body">
              <h4 className="card-title">{item.name}</h4>
              <p className="card-text">
                <b>Description: </b>
                {item.description}
              </p>
              <p className="card-text">
                <b>Category: </b>
                {item.category}
              </p>
              <p className="card-text">${item.price}</p>
              <p className="card-text">
                <b>Quantity: </b>
                {item.quantity}
              </p>
              <a
                className="btn btn-primary default-button"
                type="button"
                onClick={() => toggleEdit(item)}
              >
                Edit
              </a>
              <a
                className="btn btn-primary default-button"
                type="button"
                onClick={() => deleteItem(item)}
              >
                Delete
              </a>
            </div>
          </div>
        </div>
      ))}
      {edit && (
        <>
          <div className="modal-custom">
            <div onClick={toggleEdit} className="overlay-custom"></div>
            <div className="modal-content">
              <div className="row profile-row justify-content-center mt-2">
                <div className="col-md-8 offset-1">
                  <h2>Edit an item.</h2>
                </div>
                <div className="col-md-1 justify-content-end">
                  <a className="btn mt-2" role="button" onClick={toggleEdit}>
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
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
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
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
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
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                  />
                </div>
              </div>
              <div className="row profile-row justify-content-center mt-2">
                <div className="col-md-8">
                  <label className="form-label ">Description</label>
                  <textarea
                    className="form-control"
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                  ></textarea>
                </div>
              </div>
              <div className="row profile-row justify-content-center mt-2">
                <div className="col-md-8">
                  <label className="form-label">Quantity</label>
                  <input
                    className="form-control"
                    type="number"
                    value={editQuantity}
                    onChange={(e) => setEditQuantity(e.target.value)}
                  />
                </div>
              </div>

              <a
                className="btn default-button mt-3"
                role="button"
                onClick={() => edititem(item._id)}
              >
                Edit
              </a>
            </div>
          </div>
        </>
      )}
    </>
  );
}
