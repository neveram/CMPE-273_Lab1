const users = require("../../models/Users");
const { backendURL } = require("../../utils/config");

function handle_request(msg, callback) {
  console.log("Inside Kafka Backend Login");
  console.log("Message: ", msg);
  const username = msg.username;
  console.log(username);

  const image = backendURL + "/images/users/" + username + ".jpeg";
  if (username) {
    users.updateOne(
      { username: username },
      {
        $set: {
          image: image,
          name: msg.name,
          email: msg.email,
          phone: msg.phone,
          gender: msg.gender,
          birthday: msg.birthday,
          address: msg.address,
          city: msg.city,
          country: msg.country,
        },
      },
      function (err, user) {
        if (err) {
          callback(err, null);
        } else {
          // Redirect to home page
          console.log("User Updated");
          callback(null, "SUCCESS");
        }
      }
    );
  } else {
    callback(null, "Please enter Username and Password!");
  }
}

exports.handle_request = handle_request;
