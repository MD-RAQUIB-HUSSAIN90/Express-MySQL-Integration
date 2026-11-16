 require("dotenv").config();
const { faker } = require("@faker-js/faker");
const mysql = require("mysql2");
const express = require("express");
const app = express();
const port = 3000;
const path = require("path");

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

// Inserting new data
// let q = "INSERT INTO user (id, username, email, password) VALUES ?";
// let data = [];
// for (let i = 1; i <= 100; i++) {
//   data.push(getRandomUser()); // 100 fake users will be generated and inserted into the database
// }

// Creating a simple express server

app.get("/", (req, res) => {
  let q = "SELECT COUNT(*)FROM user";

  try {
    connection.query(q, (err, results) => {
      if (err) throw err;
      let count = results[0]["COUNT(*)"];
      res.render("home", { count });
    });
  } catch (err) {
    console.log(err);
    res.send("some error in database");
  }

  connection.end();
});

app.get("/user", (req, res) => {
  let q = "SELECT * FROM user";

  try {
    connection.query(q, (err, results) => {
      if (err) throw err;
      let data = results;
      console.log(data);
      res.render("user", { users: data });
    });
  } catch (err) {
    res.send("some error in database");
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// try {
//   connection.query(q, [data], (err, results) => {
//     if (err) throw err;
//     console.log(results);
//   });
// } catch (err) {
//   console.log(err);
// }

// connection.end();
