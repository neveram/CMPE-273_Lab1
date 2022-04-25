const cart = require("../../models/Cart");
const items = require("../../models/Items");

function handle_request(msg, callback) {
  console.log("Inside Kafka Backend Login");
  console.log("Message: ", msg);
  cart.create(
    {
      id: msg.id,
      user: msg.user,
      quantity: msg.quantity,
    },
    function (err) {
      if (err) {
        console.log(err);
        callback(null, "UNSUCCESS");
      } else {
        items.updateOne(
          { _id: msg.id },
          { $set: { quantity: msg.rquantity } },
          function (err) {
            if (err) {
              console.log(err);
            } else {
              console.log("Item Updated");
            }
          }
        );
        console.log("Item Created");
        callback(null, "SUCCESS");
      }
    }
  );
}

exports.handle_request = handle_request;
