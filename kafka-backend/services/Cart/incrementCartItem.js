const cart = require("../../models/Cart");
const items = require("../../models/Items");

function handle_request(msg, callback) {
  console.log("Inside Kafka Backend Login");
  console.log("Message: ", msg);
  cart.updateOne(
    { id: msg.id, user: msg.user },
    { $inc: { quantity: 1 } },
    function (err) {
      if (err) {
        console.log(err);
        callback(null, "UNSUCCESS");
      } else {
        items.updateOne(
          { _id: msg.id },
          { $inc: { quantity: -1 } },
          function (err) {
            if (err) {
              console.log(err);
              callback(null, "UNSUCCESS");
            } else {
              console.log("Item Quantity Incremented");
            }
          }
        );

        console.log("Item Quantity Incremented");
        callback(null, "SUCCESS");
      }
    }
  );
}

exports.handle_request = handle_request;
