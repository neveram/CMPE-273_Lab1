"use strict";
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { secret } = require("../utils/config");
const { auth } = require("../utils/passport");
const { checkAuth } = require("../utils/passport");
const fs = require("fs");
const users = require("../models/Users");
const items = require("../models/Items");
const kafka = require("../kafka/client");
const { backendURL } = require("../utils/config");

const multer = require("multer");
const fileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log(req);
    if (req.path == "/userupdate") {
      cb(null, "./public/images/users");
    } else if (req.path == "/shopimage") {
      cb(null, "./public/images/shops");
    } else {
      cb(null, "./public/images/items");
    }
  },
  filename: (req, file, cb) => {
    let extArray = file.mimetype.split("/");
    let extension = extArray[extArray.length - 1];
    console.log(file);
    cb(null, file.fieldname + ".jpeg");
  },
});

const upload = multer({ storage: fileStorageEngine });
let image;
auth();

router.post("/checkshop", function (request, response) {
  kafka.make_request("checkshop", request.body, function (err, results) {
    console.log("in result");
    console.log(results);
    if (err) {
      console.log("Inside err");
      response.json({
        status: "error",
        msg: "System Error, Try Again.",
      });
    } else {
      console.log("Inside else");
      response.end(results);
    }
  });
});

router.post("/shopimage", upload.single("file"), function (request, response) {
  // Capture the input fields
  console.log(request.body);
  // Ensure the input fields exists and are not empty
  image = "public/images/shops/" + request.body.shop + ".jpeg";
  fs.rename("public/images/shops/file.jpeg", image, function (err) {
    if (err) {
      console.log(err);
    }
    console.log("File Renamed.");
  });
  // console.log(file);
  image = backendURL + "/images/shops/" + request.body.shop + ".jpeg";
  // Execute SQL query that'll select the account from the database based on the specified username and password
  kafka.make_request("shopimage", request.body, function (err, results) {
    console.log("in result");
    console.log(results);
    if (err) {
      console.log("Inside err");
      response.json({
        status: "error",
        msg: "System Error, Try Again.",
      });
    } else {
      console.log("Inside else");
      response.end(results);
    }
  });
});

router.post("/additem", upload.single("file"), function (request, response) {
  // Capture the input fields
  console.log(request.body);
  // Ensure the input fields exists and are not empty
  image = "public/images/items/" + request.body.name + ".jpeg";
  fs.rename("public/images/items/file.jpeg", image, function (err) {
    if (err) {
      console.log(err);
    }
    console.log("File Renamed.");
  });
  // console.log(file);
  image = backendURL + "/images/items/" + request.body.name + ".jpeg";
  // Execute SQL query that'll select the account from the database based on the specified username and password
  kafka.make_request("additem", request.body, function (err, results) {
    console.log("in result");
    console.log(results);
    if (err) {
      response.json({
        status: "error",
        msg: "System Error, Try Again.",
      });
    } else {
      response.end(results);
    }
  });
});

router.post("/edititem", upload.single("file"), function (request, response) {
  // Capture the input fields
  console.log("body: ", request.body);
  image = backendURL + "/images/items/" + request.body.name + ".jpeg";
  fs.rename("public/images/items/file.jpeg", image, function (err) {
    if (err) {
      console.log(err);
    }
    console.log("File Renamed.");
  });
  kafka.make_request("edititem", request.body, function (err, results) {
    console.log("in result");
    console.log(results);
    if (err) {
      response.json({
        status: "error",
        msg: "System Error, Try Again.",
      });
    } else {
      response.end(results);
    }
  });
});

router.delete("/deleteitem", function (req, res) {
  console.log(req.body);

  items.deleteOne({ _id: req.body.id }, function (err) {
    if (err) {
      console.log("Item not Deleted");
    } else {
      console.log("Item Deleted");
    }
  });
});

router.get("/getitems", function (request, response) {
  kafka.make_request("getitems", request.query, function (err, results) {
    console.log("in result");
    console.log(results);
    if (err) {
      console.log("Inside err");
      response.json({
        status: "error",
        msg: "System Error, Try Again.",
      });
    } else {
      console.log("Inside else");
      response.json(results);
    }
  });
});

router.get("/getshopowner", function (request, response) {
  kafka.make_request("getshopowner", request.query, function (err, results) {
    console.log("in result");
    console.log(results);
    if (err) {
      console.log("Inside err");
      response.json({
        status: "error",
        msg: "System Error, Try Again.",
      });
    } else {
      console.log("Inside else");
      response.json(results);
    }
  });
});

module.exports = router;
