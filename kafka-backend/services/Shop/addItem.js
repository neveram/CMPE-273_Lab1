const users = require("../../models/Users");
const items = require("../../models/Items");
const { backendURL } = require("../../utils/config");

function handle_request(msg, callback) {
  console.log("Inside Kafka Backend Login");
  console.log("Message: ", msg);
  const name = msg.name;

  image = backendURL + "/images/items/" + name + ".jpeg";

  if (name) {
    items.create(
      {
        image: image,
        name: name,
        category: msg.category,
        price: msg.price,
        description: msg.description,
        quantity: msg.quantity,
        shop: msg.shop,
      },
      function (err, item) {
        if (err) {
          console.log(err);
          callback(null, "UNSUCCESS");
        } else {
          console.log("Item Created");
          callback(null, "SUCCESS");
        }
      }
    );
  } else {
    callback(null, "Please enter Item name!");
  }
}

exports.handle_request = handle_request;
