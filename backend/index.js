const express = require("express");
const session = require("express-session");
const cors = require("cors");
const bodyParser = require("body-parser");
const multer = require("multer");
const fs = require("fs");
const mongoose = require("mongoose");
const app = express();
const { checkAuth } = require("./utils/passport");
const users = require("./models/Users");
const items = require("./models/Items");
const favourites = require("./models/Favourites");
const cart = require("./models/Cart");
const purchased = require("./models/Purchased");
var kafka = require("./kafka/client");

require("dotenv").config();

const uri = process.env.ATLAS_URI;
mongoose.connect(uri);
const db = mongoose.connection;
db.once("open", () => {
  console.log("MongoDB database connection established successfully");
});

const fileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log(req);
    if (req.path == "/userupdate") {
      cb(null, "./public/images/users");
    } else if (req.path == "/shopimage") {
      cb(null, "./public/images/shops");
    } else {
      cb(null, "./public/images/items");
    }
  },
  filename: (req, file, cb) => {
    let extArray = file.mimetype.split("/");
    let extension = extArray[extArray.length - 1];
    console.log(file);
    cb(null, file.fieldname + ".jpeg");
  },
});

const upload = multer({ storage: fileStorageEngine });

app.use(express.static("public"));
app.use("/images", express.static("images"));

app.use(cors({ origin: "http://localhost:3000", credentials: true }));

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
// app.use(bodyParser.json());

app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const Auth = require("./routes/Auth");
const User = require("./routes/User");
const Shop = require("./routes/Shop");
const Favourites = require("./routes/Favourites");
const Items = require("./routes/Items");
const Cart = require("./routes/Cart");
const Purchased = require("./routes/Purchased");

app.use("/", Auth);
app.use("/", User);
app.use("/", Shop);
app.use("/", Favourites);
app.use("/", Items);
app.use("/", Cart);
app.use("/", Purchased);

app.listen("3001", () => {});
