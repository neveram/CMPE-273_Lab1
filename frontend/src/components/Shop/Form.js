import React from "react";

export default function Form() {
  return (
    <>
      <div className="row profile-row justify-content-center">
        <div className="col-md-8">
          <label className="form-label">Item Image</label>
          <div className="avatar">
            <div className="avatar-bg center"></div>
          </div>
          <input className="form-control" type="file" name="avatar-file" />
        </div>
      </div>
      <div className="row profile-row justify-content-center mt-2">
        <div className="col-md-8">
          <label className="form-label">Item Name</label>
          <input className="form-control" type="text" />
        </div>
      </div>
      <div className="row profile-row justify-content-center mt-2">
        <div className="col-md-8">
          <label className="form-label">Category</label>
          <select className="form-select" defaultValue={"DEFAULT"}>
            <option value="DEFAULT" disabled>
              SELECT CATEGORY
            </option>
            <option value="Afghanistan">Shoes</option>
            <option value="Åland Islands">Cloths</option>
          </select>
        </div>
      </div>
      <div className="row profile-row justify-content-center mt-2">
        <div className="col-md-8">
          <label className="form-label">Price</label>
          <input className="form-control" type="number" />
        </div>
      </div>
      <div className="row profile-row justify-content-center mt-2">
        <div className="col-md-8">
          <label className="form-label ">Description</label>
          <textarea className="form-control"></textarea>
        </div>
      </div>
      <div className="row profile-row justify-content-center mt-2">
        <div className="col-md-8">
          <label className="form-label">Quantity</label>
          <input className="form-control" type="number" />
        </div>
      </div>
    </>
  );
}
