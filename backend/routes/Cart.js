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

router.post("/addcart", function (request, response) {
  // Capture the input fields
  console.log(request.body);
  kafka.make_request("addcart", request.body, function (err, results) {
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

router.get("/getcart", function (request, response) {
  // Capture the input fields
  // console.log(request.query);

  cart.find({ user: request.query.user }, function (err, rows) {
    if (err) {
      console.log(err);
      response.end("EMPTY");
    } else {
      let array = [];
      let q = [];
      rows.map((row) => array.push(row.id));
      rows.map((row) => q.push(row.quantity));
      if (array.length > 0) {
        items.find({ _id: { $in: array } }, function (err, items) {
          if (err) {
            console.log(err);
          } else {
            items.map((item, index) => (item.quantity = q[index]));
            // console.log("items: " + items);
            response.json(items);
          }
        });
      }
    }
  });
});

router.delete("/deletecartitem", function (req, res) {
  console.log(req.body);
  cart.deleteOne({ id: req.body.id, user: req.body.user }, function (err) {
    if (err) {
      console.log(err);
    } else {
      items.updateOne(
        { _id: req.body.id },
        { $inc: { quantity: req.body.quantity } },
        function (err) {
          console.log(err);
          console.log("Item Deleted");
          res.writeHead(200, {
            "Content-Type": "text/plain",
          });
          res.end("SUCCESS");
        }
      );
    }
  });
});

router.get("/getcarttotal", function (request, response) {
  // Capture the input fields
  // console.log(request.query);
  kafka.make_request("getcarttotal", request.query, function (err, results) {
    console.log("in result");

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

router.put("/incrementcartitem", function (req, res) {
  console.log(req.body);
  kafka.make_request("incrementcartitem", req.body, function (err, results) {
    console.log("in result");

    if (err) {
      console.log("Inside err");
      res.json({
        status: "error",
        msg: "System Error, Try Again.",
      });
    } else {
      console.log("Inside else");
      res.end(results);
    }
  });
});

router.put("/decrementcartitem", function (req, res) {
  console.log(req.body);
  cart.updateOne(
    { id: req.body.id, user: req.body.user },
    { $inc: { quantity: -1 } },
    function (err) {
      if (err) {
        console.log(err);
      } else if (req.body.quantity == 1) {
        cart.deleteOne(
          { id: req.body.id, user: req.body.user },
          function (err) {
            if (err) {
              console.log(err);
            } else {
              items.updateOne(
                { _id: req.body.id },
                { $inc: { quantity: 1 } },
                function (err) {
                  if (err) {
                    console.log(err);
                  } else {
                    console.log("Item Deleted");
                  }
                }
              );
              res.writeHead(200, { "Content-Type": "text/plain" });
              console.log("Item Deleted");
              res.end("SUCCESS");
            }
          }
        );
      } else {
        items.updateOne(
          { _id: req.body.id },
          { $inc: { quantity: 1 } },
          function (err) {
            if (err) {
              console.log(err);
            } else {
              console.log("Item Quantity Decremented");
            }
          }
        );
        res.writeHead(200, { "Content-Type": "text/plain" });
        console.log("Item Quantity Decremented");
        res.end("SUCCESS");
      }
    }
  );
});

router.put("/addgift", function (req, res) {
  console.log(req.body);
  cart.updateOne(
    { id: req.body.id, user: req.body.user },
    {
      $set: { gift: req.body.gift, giftDescription: req.body.giftDescription },
    },
    function (err) {
      if (err) {
        console.log(err);
      } else {
        console.log("Gift Added");
        res.writeHead(200, { "Content-Type": "text/plain" });
        res.end("SUCCESS");
      }
    }
  );
});

module.exports = router;
