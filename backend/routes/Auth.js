"use strict";
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { secret } = require("../utils/config");
const { auth } = require("../utils/passport");
const users = require("../models/Users");
var kafka = require("../kafka/client");

auth();

//Route to handle Post Request Call
router.post("/login", async (req, res) => {
  kafka.make_request("login", req.body, function (err, results) {
    console.log("in result");
    console.log(results);
    if (err) {
      console.log("Inside err");
      console.log(err);
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

router.post("/register", function (request, response) {
  kafka.make_request("register", request.body, function (err, results) {
    console.log("in result");
    console.log(results);
    if (err) {
      console.log("Inside err");
      console.log(err);
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

//   // Capture the input fields
//   let username = request.body.username;
//   let email = request.body.email;
//   let password = request.body.password;
//   console.log(request.body);
//   // Ensure the input fields exists and are not empty
//   if (username && password) {
//     // Execute SQL query that'll select the account from the database based on the specified username and password
//     users.find({ username: username }, function (err, user) {
//       if (user.length > 0) {
//         console.log("User not Created");
//         response.end("UNSUCCESS");
//       } else {
//         users.create({
//           username: username,
//           email: email,
//           password: password,
//         });
//         console.log("User Created");
//         response.end("SUCCESS");
//       }
//     });
//   } else {
//     response.send("Please enter Username and Password!");
//     response.end();
//   }
// });

module.exports = router;
