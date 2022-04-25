const mongoose = require("mongoose");

const items = mongoose.Schema({
  name: { type: String, default: null },
  price: { type: Number, default: null },
  image: { type: String, default: null },
  description: { type: String, default: null },
  category: { type: String, default: null },
  shop: { type: String, default: null },
  quantity: { type: Number, default: null },
  sold: { type: Number, default: 0 },
});

module.exports = mongoose.model("Items", items);
