const mongoose = require("mongoose");

const purchased = mongoose.Schema(
  {
    id: { type: String, default: null },
    user: { type: String, default: null },
    name: { type: String, default: null },
    price: { type: Number, default: null },
    image: { type: String, default: null },
    description: { type: String, default: null },
    category: { type: String, default: null },
    shop: { type: String, default: null },
    quantity: { type: Number, default: null },
    sold: { type: Number, default: 0 },
    gift: { type: Boolean, default: false },
    giftDescription: { type: String, default: null },
  },
  { collection: "purchased" }
);

module.exports = mongoose.model("Purchased", purchased);
