const users = require("../../models/Users");

function handle_request(msg, callback) {
  console.log("Inside Kafka Backend Login");
  console.log("Message: ", msg);
  users.find({ shop: msg.shop }, function (err, users) {
    if (err) {
      console.log(err);
    } else {
      callback(null, users);
    }
  });
}

exports.handle_request = handle_request;
