var connection = new require("./kafka/Connection");
//topics files
//var signin = require('./services/signin.js');
const mongoose = require("mongoose");

var login = require("./services/Auth/login.js");
var register = require("./services/Auth/register.js");
var getUserData = require("./services/User/getUserData.js");
var userUpdate = require("./services/User/userUpdate.js");
var checkshop = require("./services/Shop/checkShop.js");
var shopimage = require("./services/Shop/shopImage.js");
var additem = require("./services/Shop/addItem.js");
var edititem = require("./services/Shop/editItem.js");
var getitems = require("./services/Shop/getItems.js");
var getshopowner = require("./services/Shop/getShopOwner.js");
var getallitems = require("./services/Items/getAllItems.js");
var getsearchitems = require("./services/Items/getSearchItems.js");
var addcart = require("./services/Cart/addCart.js");
var getcarttotal = require("./services/Cart/getCartTotal.js");
var incrementcartitem = require("./services/Cart/incrementCartItem.js");
var addpurchased = require("./services/Purchased/addPurchased.js");
var addfavourites = require("./services/Favourites/addFavourites.js");

require("dotenv").config();
const uri = process.env.ATLAS_URI;
const options = {
  useMongoClient: true,
};
mongoose.connect(uri);
const db = mongoose.connection;
db.once("open", () => {
  console.log("MongoDB database connection established successfully");
});

function handleTopicRequest(topic_name, fname) {
  //var topic_name = 'root_topic';
  var consumer = connection.getConsumer(topic_name);
  var producer = connection.getProducer();
  console.log("server is running ");
  consumer.on("message", function (message) {
    console.log("message received for " + topic_name + " ", fname);
    console.log(JSON.stringify(message.value));
    var data = JSON.parse(message.value);

    fname.handle_request(data.data, function (err, res) {
      console.log("after handle" + res);
      var payloads = [
        {
          topic: data.replyTo,
          messages: JSON.stringify({
            correlationId: data.correlationId,
            data: res,
          }),
          partition: 0,
        },
      ];
      producer.send(payloads, function (err, data) {
        console.log(data);
      });
      return;
    });
  });
}
// Add your TOPICs here
//first argument is topic name
//second argument is a function that will handle this topic request
handleTopicRequest("login", login);
handleTopicRequest("register", register);
handleTopicRequest("getuserdata", getUserData);
handleTopicRequest("userupdate", userUpdate);
handleTopicRequest("checkshop", checkshop);
handleTopicRequest("shopimage", shopimage);
handleTopicRequest("additem", additem);
handleTopicRequest("edititem", edititem);
handleTopicRequest("getitems", getitems);
handleTopicRequest("getshopowner", getshopowner);
handleTopicRequest("getallitems", getallitems);
handleTopicRequest("getsearchitems", getsearchitems);
handleTopicRequest("addcart", addcart);
handleTopicRequest("getcarttotal", getcarttotal);
handleTopicRequest("incrementcartitem", incrementcartitem);
handleTopicRequest("addpurchased", addpurchased);
handleTopicRequest("addfavourites", addfavourites);
