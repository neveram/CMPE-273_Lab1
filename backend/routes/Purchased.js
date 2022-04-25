"use strict";
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { secret } = require("../utils/config");
const { auth } = require("../utils/passport");
const { checkAuth } = require("../utils/passport");
const users = require("../models/Users");
const items = require("../models/Items");
const favourites = require("../models/Favourites");
const cart = require("../models/Cart");
const purchased = require("../models/Purchased");
const kafka = require("../kafka/client");

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
auth();

router.post("/addpurchased", function (request, response) {
  kafka.make_request("addpurchased", request.body, function (err, results) {
    console.log("in result");

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

router.get("/getpurchased", function (request, response) {
  purchased.find({ user: request.query.user }, function (err, items) {
    if (err) {
      console.log(err);
      response.end("UNSUCCESS");
    } else {
      response.json(items);
    }
  });
});

module.exports = router;
