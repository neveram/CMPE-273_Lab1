const mongoose = require("mongoose");

const favourites = mongoose.Schema({
  id: { type: String, default: null },
  user: { type: String, default: null },
});

module.exports = mongoose.model("Favourites", favourites);
