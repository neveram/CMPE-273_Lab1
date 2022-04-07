const express = require("express");
const mysql = require("mysql");
const session = require("express-session");
const cors = require("cors");
const bodyParser = require("body-parser");
const multer = require("multer");
const fs = require("fs");

const app = express();

const db = mysql.createConnection({

    user: "admin",
    password: "password",
    database: "etsy_clone",
    host: "etsy.cangdfgfux5k.us-east-1.rds.amazonaws.com",
    port: 3306,

  
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

app.use(cors({ origin: "http://44.203.1.126:3000", credentials: true }));

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
// app.use(bodyParser.json());

db.connect((err) => {
  if (err) {
    throw err;
  }
});

app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/login", function (request, response) {
  // Capture the input fields
  let username = request.body.username;
  let password = request.body.password;
  console.log(request.body);
  // Ensure the input fields exists and are not empty
  if (username && password) {
    // Execute SQL query that'll select the account from the database based on the specified username and password
    db.query(
      "SELECT * FROM users WHERE username = ? AND password = ?",
      [username, password],
      function (error, results, fields) {
        // If there is an issue with the query, output the error
        if (error) throw error;
        // If the account exists
        if (results.length > 0) {
          // Authenticate the user
          response.writeHead(200, {
            "Content-Type": "text/plain",
          });
          // Redirect to home page
          console.log("Correct");
          response.end("SUCCESS");
        } else {
          console.log("Incorrect");

          response.end("UNSUCCESS");
        }
        response.end();
      }
    );
  } else {
    response.send("Please enter Username and Password!");
    response.end();
  }
});

app.post("/register", function (request, response) {
  // Capture the input fields
  let username = request.body.username;
  let email = request.body.email;
  let password = request.body.password;
  console.log(request.body);
  // Ensure the input fields exists and are not empty
  if (username && password) {
    // Execute SQL query that'll select the account from the database based on the specified username and password
    db.query(
      "INSERT INTO `users`(`username`, `password`,`email`) VALUES (?,?,?)",
      [username, password, email],
      function (error, results, fields) {
        // If there is an issue with the query, output the error
        console.log(error);

        console.log(results);
        // If the account exists
        if (error) {
          if (error.errno == 1062) {
            console.log("User not Created");

            response.end("UNSUCCESS");
          }
        }

        if (results) {
          // Authenticate the user
          response.writeHead(200, {
            "Content-Type": "text/plain",
          });
          // Redirect to home page
          console.log("User Created");
          response.end("SUCCESS");
        }
        response.end();
      }
    );
  } else {
    response.send("Please enter Username and Password!");
    response.end();
  }
});

app.get("/getuserdata", function (request, response) {
  let user = request.query.user;
  console.log(user);
  db.query(
    "SELECT * FROM `users` WHERE `username` = ?",
    [user],
    function (err, rows, fields) {
      if (err) {
        throw err;
      } else {
        response.json(rows);
      }
    }
  );
});

app.post("/userupdate", upload.single("file"), function (request, response) {
  let username = request.body.username;
  image = "public/images/users/" + username + ".jpeg";
  fs.rename("public/images/users/file.jpeg", image, function (err) {
    if (err) {
      console.log(err);
    }
    console.log("File Renamed.");
  });
  // console.log(file);
  image = "http://44.203.1.126:3001/images/users/" + username + ".jpeg";
  if (username) {
    db.query(
      "UPDATE `users` SET `image`=?,`name`=?,`email`=?,`phone`=?,`gender`=?,`birthday`=?,`address`=?,`city`=?,`country`=? WHERE `username` = ?",
      [
        image,
        request.body.name,
        request.body.email,
        request.body.phone,
        request.body.gender,
        request.body.birthday,
        request.body.address,
        request.body.city,
        request.body.country,
        username,
      ],
      function (error, results, fields) {
        // If there is an issue with the query, output the error
        console.log(error);
        if (results) {
          // Authenticate the user
          response.writeHead(200, {
            "Content-Type": "text/plain",
          });
          // Redirect to home page
          console.log("User Updated");
          response.end("SUCCESS");
        }
        response.end("UNSUCCESS");
      }
    );
  } else {
    response.send("Please enter Username and Password!");
    response.end();
  }
});

app.post("/checkshop", function (request, response) {
  let shop = request.body.shop;
  let username = request.body.username;

  console.log(request.body);
  // Ensure the input fields exists and are not empty
  if (shop) {
    // Execute SQL query that'll select the account from the database based on the specified username and password
    db.query(
      "UPDATE `users` SET `shop`=? WHERE `username` = ?",
      [shop, username],
      function (error, results, fields) {
        // If there is an issue with the query, output the error

        console.log(results);
        // If the account exists
        if (error) {
          if (error.errno == 1062) {
            console.log("User not Created");

            response.end("UNSUCCESS");
          }
        }

        if (results) {
          // Authenticate the user
          response.writeHead(200, {
            "Content-Type": "text/plain",
          });
          // Redirect to home page
          console.log("Shop Created");
          response.end("SUCCESS");
        }
        response.end();
      }
    );
  } else {
    response.send("Please enter Shop name!");
    response.end();
  }
});

app.post("/shopimage", upload.single("file"), function (request, response) {
  // Capture the input fields
  console.log(request.body);
  // Ensure the input fields exists and are not empty
  image = "public/images/shops/" + request.body.shop + ".jpeg";
  fs.rename("public/images/shops/file.jpeg", image, function (err) {
    if (err) {
      console.log(err);
    }
    console.log("File Renamed.");
  });
  // console.log(file);
  image =
    "http://44.203.1.126:3001/images/shops/" + request.body.shop + ".jpeg";
  // Execute SQL query that'll select the account from the database based on the specified username and password
  db.query(
    "UPDATE `users` SET `shopimage`=? WHERE `shop` = ?",
    [image, request.body.shop],
    function (error, results, fields) {
      // If there is an issue with the query, output the error

      console.log(results);
      // If the account exists
      if (error) {
        throw error;
      }
      if (results) {
        response.writeHead(200, {
          "Content-Type": "text/plain",
        });

        console.log("Item Created");
        response.end("SUCCESS");
      }
      console.log(results);
      response.end("UNSUCCESS");
    }
  );
});

app.post("/additem", upload.single("file"), function (request, response) {
  // Capture the input fields
  console.log(request.body);
  // Ensure the input fields exists and are not empty
  image = "public/images/items/" + request.body.name + ".jpeg";
  fs.rename("public/images/items/file.jpeg", image, function (err) {
    if (err) {
      console.log(err);
    }
    console.log("File Renamed.");
  });
  // console.log(file);
  image =
    "http://44.203.1.126:3001/images/items/" + request.body.name + ".jpeg";
  // Execute SQL query that'll select the account from the database based on the specified username and password
  db.query(
    "INSERT INTO `items`(`image`,`name`, `category`, `price`, `description`, `quantity`, `shop`) VALUES (?,?,?,?,?,?,?)",
    [
      image,
      request.body.name,
      request.body.category,
      request.body.price,
      request.body.description,
      request.body.quantity,
      request.body.shop,
    ],
    function (error, results, fields) {
      // If there is an issue with the query, output the error

      console.log(results);
      // If the account exists
      if (error) {
        throw error;
      }
      if (results) {
        response.writeHead(200, {
          "Content-Type": "text/plain",
        });

        console.log("Item Created");
        response.end("SUCCESS");
      }
      console.log(results);
      response.end("UNSUCCESS");
    }
  );
});

app.post("/edititem", upload.single("file"), function (request, response) {
  // Capture the input fields
  console.log("body: ", request.body);
  image =
    "http://44.203.1.126:3001/images/items/" + request.body.name + ".jpeg";
  fs.rename("public/images/items/file.jpeg", image, function (err) {
    if (err) {
      console.log(err);
    }
    console.log("File Renamed.");
  });

  db.query(
    "UPDATE `items` SET `image`=?,`name`=?,`category`=?,`price`=?,`description`=?,`quantity`=? WHERE `shop` = ? AND `id` = ?",
    [
      image,
      request.body.name,
      request.body.category,
      request.body.price,
      request.body.description,
      request.body.quantity,
      request.body.shop,
      request.body.id,
    ],
    function (error, results, fields) {
      // If there is an issue with the query, output the error
      if (error) {
        throw error;
      }
      // If the account exists
      if (results) {
        // Authenticate the user
        response.writeHead(200, {
          "Content-Type": "text/plain",
        });
        // Redirect to home page
        // console.log(results);
        response.end("SUCCESS");
      }
      response.end("UNSUCCESS");
    }
  );
});

app.delete("/deleteitem", function (req, res) {
  console.log(req.body);
  db.query(
    "DELETE FROM `items` WHERE `id`=?",
    [req.body.id],
    function (error, results, fields) {
      if (error) throw error;
      if (results) {
        res.writeHead(200, {
          "Content-Type": "text/plain",
        });
        res.end("SUCCESS");
      }
      res.end("UNSUCCESS");
    }
  );
});

app.get("/getitems", function (request, response) {
  let shop = request.query.shop;
  db.query(
    "SELECT * FROM `items` WHERE `shop` = ?",
    [shop],
    function (err, rows, fields) {
      if (err) {
        throw err;
      } else {
        // console.log(rows);
        response.json(rows);
      }
    }
  );
});

app.get("/getshopowner", function (request, response) {
  let shop = request.query.shop;
  db.query(
    "SELECT `name`,`email`,`phone`,`shopimage` FROM `users` WHERE `shop` = ?",
    [shop],
    function (err, rows, fields) {
      if (err) {
        throw err;
      } else {
        console.log(rows);
        response.json(rows);
      }
    }
  );
});

app.get("/getallitems", function (request, response) {
  db.query("SELECT * FROM `items`", function (err, rows, fields) {
    if (err) {
      throw err;
    } else {
      console.log(rows);
      response.json(rows);
    }
  });
});

app.post("/addfavourites", function (request, response) {
  // Capture the input fields
  console.log(request.body);

  db.query(
    "INSERT INTO `favourites`(`id`, `user`) VALUES (?,?)",
    [request.body.id, request.body.user],
    function (error, results, fields) {
      // If there is an issue with the query, output the error

      console.log(results);
      // If the account exists
      if (error) {
        if (error.errno == 1062) {
          console.log("Aready Added to Favourites");

          response.end("UNSUCCESS");
        }
      }
      if (results) {
        response.writeHead(200, {
          "Content-Type": "text/plain",
        });

        console.log("Added to Favourites");
        response.end("SUCCESS");
      }
      console.log(results);
      response.end("UNSUCCESS");
    }
  );
});

app.delete("/removefavourite", function (req, res) {
  console.log(req.body);
  db.query(
    "DELETE FROM `favourites` WHERE `id`=? AND `user`=?",
    [req.body.id, req.body.username],
    function (error, results, fields) {
      if (error) throw error;
      if (results) {
        res.writeHead(200, {
          "Content-Type": "text/plain",
        });
        res.end("SUCCESS");
      }
      res.end("UNSUCCESS");
    }
  );
});

app.get("/getfavourites", function (request, response) {
  // Capture the input fields
  console.log(request.query);

  db.query(
    "SELECT `id` FROM `favourites` WHERE `user` = ?",
    [request.query.user],
    function (err, rows, fields) {
      if (err) {
        throw err;
      } else {
        // console.log(rows);
        let array = [];
        rows.map((row) => array.push(row.id));
        // console.log("array: " + array);
        if (array.length > 0) {
          const query =
            "SELECT * FROM `items` WHERE `id` in (?" +
            ",?".repeat(array.length - 1) +
            ")";
          // console.log(query);
          db.query(query, array, function (err, rows, fields) {
            if (err) {
              throw err;
            } else {
              // console.log(rows);
              response.json(rows);
            }
          });
        } else {
          response.end("EMPTY");
        }
      }
    }
  );
});

app.get("/getsearchitems", function (request, response) {
  console.log("request: ", request.query);
  const filter = request.query.filter;
  // const query = ;
  // console.log(query);
  if (filter) {
    if (filter == 1) {
      db.query(
        "SELECT * FROM `items` WHERE `name` LIKE '%" +
          request.query.keyword +
          "%' AND `price` <50",
        function (err, rows, fields) {
          if (err) {
            throw err;
          } else {
            console.log("filter");

            console.log(rows);
            response.json(rows);
          }
        }
      );
    } else if (filter == 2) {
      db.query(
        "SELECT * FROM `items` WHERE `name` LIKE '%" +
          request.query.keyword +
          "%' AND `price` >50 AND `price`<100",
        function (err, rows, fields) {
          if (err) {
            throw err;
          } else {
            console.log("filter");

            console.log(rows);
            response.json(rows);
          }
        }
      );
    } else {
      db.query(
        "SELECT * FROM `items` WHERE `name` LIKE '%" +
          request.query.keyword +
          "%' AND `price` >100",
        function (err, rows, fields) {
          if (err) {
            throw err;
          } else {
            console.log("filter");

            console.log(rows);
            response.json(rows);
          }
        }
      );
    }
  } else {
    db.query(
      "SELECT * FROM `items` WHERE `name` LIKE '%" +
        request.query.keyword +
        "%'",
      function (err, rows, fields) {
        if (err) {
          throw err;
        } else {
          console.log("no filter");

          console.log(rows);
          response.json(rows);
        }
      }
    );
  }
});

app.post("/addcart", function (request, response) {
  // Capture the input fields
  console.log(request.body);

  db.query(
    "INSERT INTO `cart`(`id`, `user`,`quantity`) VALUES (?,?,?)",
    [request.body.id, request.body.user, request.body.quantity],
    function (error, results, fields) {
      // If there is an issue with the query, output the error
      console.log(results);
      // If the account exists
      if (error) {
        if (error.errno == 1062) {
          console.log("Aready Added to Cart");

          response.end("UNSUCCESS");
        }
      }
      if (results) {
        response.writeHead(200, {
          "Content-Type": "text/plain",
        });
        db.query("UPDATE `items` SET `quantity`=? WHERE `id` =?", [
          request.body.rquantity,
          request.body.id,
        ]);
        console.log("Added to Cart");
        response.end("SUCCESS");
      }
      console.log(results);
      response.end("UNSUCCESS");
    }
  );
});

app.get("/getcart", function (request, response) {
  // Capture the input fields
  // console.log(request.query);

  db.query(
    "SELECT `id`,`quantity` FROM `cart` WHERE `user` = ?",
    [request.query.user],
    function (err, rows, fields) {
      if (err) {
        throw err;
      } else {
        // console.log(rows);
        let array = [];
        let q = [];
        rows.map((row) => array.push(row.id));
        rows.map((row) => q.push(row.quantity));

        // console.log("array: " + array);
        if (array.length > 0) {
          const query =
            "SELECT * FROM `items` WHERE `id` in (?" +
            ",?".repeat(array.length - 1) +
            ")";
          // console.log(query);
          db.query(query, array, function (err, rows, fields) {
            if (err) {
              throw err;
            } else {
              rows.map((row, index) => (row.quantity = q[index]));
              // console.log("items: " + rows);
              response.json(rows);
            }
          });
        } else {
          response.end("EMPTY");
        }
      }
    }
  );
});

app.delete("/deletecartitem", function (req, res) {
  console.log(req.body);
  db.query(
    "DELETE FROM `cart` WHERE `id`=? AND `user`=?",
    [req.body.id, req.body.user],
    function (error, results, fields) {
      if (error) throw error;
      if (results) {
        res.writeHead(200, {
          "Content-Type": "text/plain",
        });
        console.log(results);
        db.query(
          "UPDATE `items` SET `quantity`= `quantity` + ? WHERE `id` = ?",
          [req.body.quantity, req.body.id]
        );
        res.end("SUCCESS");
      }
      res.end("UNSUCCESS");
    }
  );
});

app.get("/getcarttotal", function (request, response) {
  // Capture the input fields
  // console.log(request.query);

  db.query(
    "SELECT `id`,`quantity` FROM `cart` WHERE `user` = ?",
    [request.query.user],
    function (err, rows, fields) {
      if (err) {
        throw err;
      } else {
        // console.log(rows);
        let array = [];
        let quantity = [];

        rows.map((row) => array.push(row.id));
        rows.map((row) => quantity.push(row.quantity));

        // console.log("array: " + array);
        if (array.length > 0) {
          const query =
            "SELECT * FROM `items` WHERE `id` in (?" +
            ",?".repeat(array.length - 1) +
            ")";
          // console.log(query);
          db.query(query, array, function (err, rows, fields) {
            if (err) {
              throw err;
            } else {
              let q = 0;
              rows.map((row, index) => (q = row.price * quantity[index] + q));
              // console.log(q);
              response.json(q);
            }
          });
        } else {
          response.end("EMPTY");
        }
      }
    }
  );
});

app.post("/addpurchased", function (request, response) {
  const items = request.body.items;
  items.map((item) => {
    db.query(
      "INSERT INTO `purchased`(`id`, `user`,`quantity`) VALUES (?,?,?)",
      [item.id, request.body.user, item.quantity],
      function (error, results, fields) {
        if (error) {
          throw error;
        }
      }
    );
  });
  items.map((item) => {
    db.query(
      "DELETE FROM `cart` WHERE `id`=? AND `user`=?",
      [item.id, request.body.user],
      function (error, results, fields) {
        if (error) {
          throw error;
        }
      }
    );
  });
  items.map((item) => {
    db.query(
      "UPDATE `items` SET `sold`=`sold`+? WHERE `id` = ?",
      [item.quantity, item.id],
      function (error, results, fields) {
        if (error) {
          throw error;
        }
      }
    );
  });
});

app.get("/getpurchased", function (request, response) {
  // Capture the input fields
  // console.log(request.query);

  db.query(
    "SELECT items.name, items.category, items.price, items.image, purchased.quantity FROM purchased INNER JOIN items ON purchased.id=items.id and purchased.user = ?",
    [request.query.user],
    function (err, rows, fields) {
      if (err) {
        throw err;
      }
      if (rows) {
        console.log(rows);
        response.json(rows);
      }
    }
  );
});

app.listen("3001", () => {});
