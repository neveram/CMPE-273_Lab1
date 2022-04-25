const cart = require("../../models/Cart");
const items = require("../../models/Items");

function handle_request(msg, callback) {
  console.log("Inside Kafka Backend Login");
  console.log("Message: ", msg);
  cart.find({ user: msg.user }, function (err, rows) {
    if (err) {
      console.log(err);
      callback(null, "EMPTY");
    } else {
      let array = [];
      let quantity = [];
      rows.map((row) => array.push(row.id));
      rows.map((row) => quantity.push(row.quantity));
      if (array.length > 0) {
        items.find({ _id: { $in: array } }, function (err, items) {
          if (err) {
            console.log(err);
            callback(null, "EMPTY");
          } else {
            let q = 0;
            items.map((item, index) => (q = item.price * quantity[index] + q));
            // console.log("items: " + items);
            callback(null, q);
          }
        });
      }
    }
  });
}

exports.handle_request = handle_request;
