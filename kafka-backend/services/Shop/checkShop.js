const users = require("../../models/Users");
const items = require("../../models/Items");

function handle_request(msg, callback) {
  console.log("Inside Kafka Backend Login");
  console.log("Message: ", msg);
  const username = msg.username;
  const shop = msg.shop;
  console.log(username);

  if (shop) {
    // Execute SQL query that'll select the account from the database based on the specified username and password
    users.find({ shop: shop }, function (err, user) {
      if (err) {
        callback(err, null);
      } else {
        if (user.length > 0) {
          callback(null, "UNSUCCESS");
        } else {
          users.updateOne(
            { username: username },
            { $set: { shop: shop } },
            function (err) {
              if (err) {
                console.log("Shop not Created");

                callback(null, "UNSUCCESS");
              } else {
                // Redirect to home page
                console.log("Shop Created");
                callback(null, "SUCCESS");
              }
            }
          );
        }
      }
    });
  } else {
    callback(null, "Please enter Username and Password!");
  }
}

exports.handle_request = handle_request;
