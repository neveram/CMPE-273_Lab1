const users = require("../../models/Users");

const jwt = require("jsonwebtoken");
const { secret } = require("../../utils/config");

function handle_request(msg, callback) {
  console.log("Inside Kafka Backend Login");
  console.log("Message: ", msg);
  username = msg.username;
  password = msg.password;
  email = msg.email;
  if (username && password) {
    // Execute SQL query that'll select the account from the database based on the specified username and password
    users.find({ username: username }, function (err, user) {
      if (user.length > 0) {
        console.log("User not Created");
        callback(null, "UNSUCCESS");
      } else {
        users.create({
          username: username,
          email: email,
          password: password,
        });
        console.log("User Created");
        callback(null, "SUCCESS");
      }
    });
  } else {
    callback(null, "Please enter Username and Password!");
    response.end();
  }
}

exports.handle_request = handle_request;
