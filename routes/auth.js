const express = require("express");
const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");


const router = express.Router();
const saltRounds = 10;

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB
});

router.post("/register", (req, res) => {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  //update using destructuring(?)

  db.query("SELECT email FROM users WHERE email = ?", [email], (err, results) => {
    if (err) throw err;
    if (results.length > 0) {
      req.session.registerMessage = "That email is already in use";
      return res.redirect("/register");
    }
  });

  db.query("INSERT INTO users SET ?", {
    username: username,
    email: email,
    password: password
  }, (err, results) => {
    if (err) throw err;
    req.session.registerMessage = "User registered successfully";
    return res.redirect("/register");
  });
});

router.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return res.status(400).render("login", { 
      message: "Please enter an email and password"
    });
  }

  db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {

    if (!results || password != results[0].password) {
      return res.status(401).render("login", {
        message: "Email or password incorrect"
      });
    }
    const id = results[0].userID;
    
    // const token = jwt.sign({
    //   id: id,
    // }, process.env.JWT_KEY, {
    //   expiresIn: process.env.JWT_EXPIRE_LENGTH
    // });

    // const cookieOptions = {
    //   expires: new Date(
    //     //converts cookie length into milliseconds
    //     Date.now() + process.env.JWT_COOKIE_EXPIRE_LENGTH * 24 * 60 * 60 * 1000
    //   ),
    //   httpOnly: true
    // }

    // res.cookie("acc", token, cookieOptions);
    
    req.session.userid = id;
    req.session.user = results[0].username;

    res.status(200).redirect("/profile");
  });

});


module.exports = router; 