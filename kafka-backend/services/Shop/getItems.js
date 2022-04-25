const items = require("../../models/Items");

function handle_request(msg, callback) {
  console.log("Inside Kafka Backend Login");
  console.log("Message: ", msg);
  items.find({ shop: msg.shop }, function (err, items) {
    if (err) {
      console.log(err);
    } else {
      callback(null, items);
    }
  });
}

exports.handle_request = handle_request;
