const express = require("express");
const mysql = require("mysql");
var cors = require("cors");
bodyParser = require("body-parser");

const port = process.env.PORT || 5000; // port number

// for local database Wamp / xampp

// const db = mysql.createConnection({
//   host: "localhost",
//   user: "yogupta",
//   password: "yogupta@123",
//   database: "yogupta",
// });

// wamp server

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "alpha",
});

// for online mysql database - https://remotemysql.com/

// const db = mysql.createConnection({
//   host: "remotemysql.com",
//   user: "IKz5qwZw0G",
//   password: "NVmr1s1500",
//   database: "IKz5qwZw0G",
// });

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("mysql connected... ");
});

const app = express(); // app or instance of express

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.use(express.json()); // accept data in json format
app.use(express.urlencoded()); // decode the data sent through form
app.use(express.static("public")); // serve static files from this folder

// tell our app to listen for any request on PORT
app.listen(port, (err) => {
  if (!err) {
    console.log(`Server started by yogesh on port ${port}`);
  } else {
    console.log(err);
  }
});

app.get("/", (req, res) => {
  res.send("This is server home page");
});

app.get("/form", (req, res) => {
  res.sendFile(__dirname + "/public/form.html");
});

// get data from frontend, insert into the database
// CREATE
app.post("/formPost", (req, res) => {
  console.log(req.body);
  let data = req.body;
  let sql = "INSERT INTO alpha SET ?";
  let query = db.query(sql, data, (err, result) => {
    if (err) throw err;
    console.log(result);
  });
  res.send("OKay");
});

// another example of entering manual data into the mySQL

app.get("/db_manual", (req, res) => {
  let data = {
    fname: "Manual",
    age: "34",
    city: "Data Entry",
    country: "from Express",
  };
  let sql = "INSERT INTO alpha SET ?";
  let query = db.query(sql, data, (err, result) => {
    if (err) throw err;
    console.log(result);
  });
  res.send("Data Inserted into the db");
});

// READ data from database
app.get("/read_db/", (req, res) => {
  let sql = `SELECT * FROM alpha`;
  let query = db.query(sql, (err, result) => {
    if (err) throw err;
    res.send(result); // result of the query. Gives the entire object with id of 5.
    console.log("from fetch api", result);
  });
});

// Update - works

app.patch("/update_db", (req, res) => {
  let data = { id: 6 };
  let sql = "UPDATE alpha SET fname='shabnam' WHERE ?";
  let query = db.query(sql, data, (err, result) => {
    if (err) throw err;
    res.send(result);
    console.log(result);
  });
});

// Update user

app.put("/update_user/:id", (req, res) => {
  let new_fname = req.body.fname;
  let new_age = req.body.age;
  let new_city = req.body.city;
  let new_country = req.body.country;

  let sql = `UPDATE alpha SET fname='${new_fname}', age='${new_age}', city='${new_city}', country='${new_country}' WHERE id=${req.params.id}`;
  let query = db.query(sql, (err, result) => {
    if (err) throw err;
    res.send(result);
    console.log(result);
  });
});

// Delete

app.delete("/delete/:id", (req, res) => {
  let id = req.params.id;
  console.log(id);
  let sql = "DELETE FROM alpha WHERE id = ?";
  let query = db.query(sql, id, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});
