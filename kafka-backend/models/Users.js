const mongoose = require("mongoose");

const users = mongoose.Schema({
  username: String,
  password: String,
  image: { type: String, default: null },
  name: { type: String, default: null },
  email: String,
  phone: { type: String, default: null },
  gender: { type: String, default: null },
  birthday: { type: String, default: null },
  address: { type: String, default: null },
  city: { type: String, default: null },
  country: { type: String, default: null },
  shop: { type: String, default: null },
  shopimage: { type: String, default: null },
});

module.exports = mongoose.model("Users", users);
