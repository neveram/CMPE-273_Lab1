const users = require("../../models/Users");

const jwt = require("jsonwebtoken");
const { secret } = require("../../utils/config");

function handle_request(msg, callback) {
  console.log("Inside Kafka Backend Login");
  console.log("Message: ", msg);
  users.findOne(
    {
      username: msg.username,
      password: msg.password,
    },
    (error, user) => {
      console.log(user);
      if (error) {
        callback(error, null);
      }
      if (user) {
        const payload = { _id: user._id, username: user.username };
        const token = jwt.sign(payload, secret, {
          expiresIn: 1008000,
        });
        callback(null, "SUCCESS " + "JWT " + token);
      } else {
        callback(null, "Invalid Credentials");
      }
    }
  );
}

exports.handle_request = handle_request;
