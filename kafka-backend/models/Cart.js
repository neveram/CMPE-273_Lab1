const mongoose = require("mongoose");

const cart = mongoose.Schema(
  {
    id: { type: String, default: null },
    user: { type: String, default: null },
    quantity: { type: Number, default: null },
    gift: { type: Boolean, default: false },
    giftDescription: { type: String, default: null },
  },
  { collection: "cart" }
);

module.exports = mongoose.model("Cart", cart);
