const favourites = require("../../models/Favourites");

function handle_request(msg, callback) {
  console.log("Inside Kafka Backend Login");
  console.log("Message: ", msg);
  favourites.create({ id: msg.id, user: msg.user }, function (err, item) {
    if (err) {
      console.log(err);
      callback(null, "UNSUCCESS");
    } else {
      console.log("Item Created");
      callback(null, "SUCCESS");
    }
  });
}

exports.handle_request = handle_request;
