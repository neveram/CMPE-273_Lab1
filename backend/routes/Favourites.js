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

router.post("/addfavourites", function (request, response) {
  kafka.make_request("addfavourites", request.body, function (err, results) {
    console.log("in result");

    if (err) {
      console.log("Inside err");
      response.status(500).send({ message: "Internal server error" });
    } else {
      response.status(200).send(results);
    }
  });
});

// Capture the input fields
//   console.log(request.body);
//   favourites.create(
//     { id: request.body.id, user: request.body.user },
//     function (err, item) {
//       if (err) {
//         console.log(err);
//         response.end("UNSUCCESS");
//       } else {
//         response.writeHead(200, {
//           "Content-Type": "text/plain",
//         });
//         console.log("Item Created");
//         response.end("SUCCESS");
//       }
//     }
//   );
// });

router.delete("/removefavourite", function (req, res) {
  console.log(req.body);

  favourites.deleteOne(
    { id: req.body.id, username: req.body.username },
    function (err) {
      if (err) {
        console.log("Item not Deleted");
        res.end("UNSUCCESS");
      } else {
        console.log("Item Deleted");
        res.writeHead(200, {
          "Content-Type": "text/plain",
        });
        res.end("SUCCESS");
      }
    }
  );
});

router.get("/getfavourites", function (request, response) {
  // Capture the input fields
  console.log(request.query);

  favourites.find({ user: request.query.user }, async (err, rows) => {
    if (err) {
      console.log(err);
      response.end("EMPTY");
    } else {
      let array = [];
      // console.log("rows: " + rows);
      rows.map((row) => array.push(row.id));
      // console.log("array: " + array);
      if (array.length > 0) {
        items.find({ _id: { $in: array } }, function (err, items) {
          if (err) {
            // console.log(err);
            response.end("EMPTY");
          } else {
            // console.log("items: " + items);
            response.json(items);
          }
        });
      } else {
        response.end("EMPTY");
      }
    }
  });
});

module.exports = router;
