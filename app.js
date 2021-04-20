const express = require("express");
const mysql = require("mysql");
const path = require("path");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");

dotenv.config({
  path: "./.env",
});


const app = express();
const session = require('express-session');

app.use(express.static(path.join(__dirname, "./public")));
app.use(express.urlencoded({
  extended: false
}));
app.use(express.json());
app.use(cookieParser());
app.set("view engine", "ejs");
app.use(session({secret: 'mySecret', resave: false, saveUninitialized: false}));

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB
});

db.connect((err) => {
  if (err) throw err;
  console.log("Connected to database");
});

app.use("/", require("./routes/pages"));
app.use("/auth", require("./routes/auth"));

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});