const items = require("../../models/Items");

function handle_request(msg, callback) {
  console.log("Inside Kafka Backend Login");
  console.log("Message: ", msg);
  filter = msg.filter;
  if (filter) {
    if (filter == 1) {
      items.find(
        {
          $and: [{ name: { $regex: msg.keyword } }, { price: { $lt: 50 } }],
        },
        function (err, items) {
          if (err) {
            callback(err, null);
          } else {
            callback(null, items);
          }
        }
      );
    } else if (filter == 2) {
      items.find(
        {
          $and: [
            { name: { $regex: msg.keyword } },
            { $and: [{ price: { $gt: 50 } }, { price: { $lt: 100 } }] },
          ],
        },
        function (err, items) {
          if (err) {
            callback(err, null);
          } else {
            callback(null, items);
          }
        }
      );
    } else {
      items.find(
        {
          $and: [{ name: { $regex: msg.keyword } }, { price: { $gt: 100 } }],
        },
        function (err, items) {
          if (err) {
            callback(err, null);
          } else {
            callback(null, items);
          }
        }
      );
    }
  } else {
    items.find({ name: { $regex: msg.keyword } }, function (err, items) {
      if (err) {
        callback(err, null);
      } else {
        console.log("no filter");
        console.log(items);
        callback(null, items);
      }
    });
  }
}

exports.handle_request = handle_request;
