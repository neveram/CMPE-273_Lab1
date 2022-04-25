const cart = require("../../models/Cart");
const items = require("../../models/Items");
const purchased = require("../../models/Purchased");

function handle_request(msg, callback) {
  console.log("Inside Kafka Backend Login");
  console.log("Message: ", msg);
  const i = msg.items;
  i.map((item) => {
    // console.log("purchsed item: ", item);
    items.findById(item._id, (err, row) => {
      if (err) {
        console.log(err);
        callback(null, "UNSUCCESS");
      } else {
        // console.log(row);
        cart.find({ user: msg.user, id: item._id }, (err, r) => {
          if (err) {
            console.log(err);
            callback(null, "UNSUCCESS");
          } else {
            console.log("cart item: ", r[0].gift);
            purchased.create(
              {
                id: item._id,
                user: msg.user,
                quantity: item.quantity,
                name: row.name,
                price: row.price,
                image: row.image,
                shop: row.shop,
                category: row.category,
                description: row.description,
                gift: r[0].gift,
                giftDescription: r[0].giftDescription,
              },
              function (err) {
                if (err) {
                  console.log(err);
                  callback(null, "UNSUCCESS");
                } else {
                  console.log("Item Created");
                  // response.end("SUCCESS");
                  i.map((item) => {
                    cart.deleteOne(
                      { id: item._id, user: msg.user },
                      function (err) {
                        if (err) {
                          console.log(err);
                        } else {
                          console.log("Item Deleted");
                        }
                      }
                    );
                  });
                }
              }
            );
          }
        });
      }
    });
    callback(null, "SUCCESS");
  });

  i.map((item) => {
    items.updateOne(
      { _id: item._id },
      { $inc: { sold: item.quantity } },
      function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log("Item Updated");
        }
      }
    );
  });
}

exports.handle_request = handle_request;
