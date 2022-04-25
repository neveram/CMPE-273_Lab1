const users = require("../../models/Users");

function handle_request(msg, callback) {
  console.log("Inside Kafka Backend Login");
  console.log("Message: ", msg);
  users.find({ username: msg.user }, function (err, user) {
    if (err) {
      throw err;
    } else {
      callback(null, user);
    }
  });
}

exports.handle_request = handle_request;
