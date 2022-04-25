const users = require("../../models/Users");
const items = require("../../models/Items");
const { backendURL } = require("../../utils/config");

function handle_request(msg, callback) {
  console.log("Inside Kafka Backend Login");
  console.log("Message: ", msg);

  image = backendURL + "/images/items/" + msg.name + ".jpeg";

  items.updateOne(
    { $and: [{ _id: msg.id }, { shop: msg.shop }] },
    {
      $set: {
        image: image,
        name: msg.name,
        category: msg.category,
        price: msg.price,
        description: msg.description,
        quantity: msg.quantity,
        shop: msg.shop,
      },
    },
    function (err) {
      if (err) {
        console.log("Item Image not Updated");
        callback(null, "UNSUCCESS");
      } else {
        console.log("Item Image Updated");
        callback(null, "SUCCESS");
      }
    }
  );
}

exports.handle_request = handle_request;
