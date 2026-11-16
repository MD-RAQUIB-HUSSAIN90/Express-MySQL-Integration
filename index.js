require("dotenv").config();
const { faker } = require("@faker-js/faker");
const mysql = require("mysql2");
const express = require("express");
const app = express();
const port = 3000;
const path = require("path");
const methodOverride = require("method-override");

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
});

let getRandomUser = () => {
  return [
    faker.string.uuid(),
    faker.person.fullName(),
    faker.internet.email(),
    faker.internet.password(),
  ];
};

// Creating a simple express server

app.get("/", (req, res) => {
  let q = "SELECT COUNT(*)FROM user";

  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let count = result[0]["COUNT(*)"];
      res.render("home", { count });
    });
  } catch (err) {
    console.log(err);
    res.send("some error in database");
  }
});

// Show Route..............................

app.get("/user", (req, res) => {
  let q = "SELECT * FROM user";

  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let users = result;
      res.render("showusers", { users });
    });
  } catch (err) {
    console.log(err);
    res.send("some error in database");
  }
});

// Show edit Route

app.get("/user/:id/edit", (req, res) => {
  let { id } = req.params;
  let q = `SELECT  * FROM user WHERE id='${id}'`;
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let user = result[0];
      console.log(result);
      res.render("edit.ejs", { user });
    });
  } catch (err) {
    console.log(err);
    res.send("some error in database");
  }
});

// Update (DB) route

app.patch("/user/:id", (req, res) => {
  res.send("update route");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
