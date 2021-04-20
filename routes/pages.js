const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  resetSessionVars(req);
  res.render("index", req.session);
});

router.get("/register", (req, res) => {
  res.render("register", req.session);
});

router.get("/login", (req, res) => {
  resetSessionVars(req);
  res.render("login", req.session);
});

router.get("/profile", (req, res) => {
  resetSessionVars(req);
  res.render("profile", req.session);
});

module.exports = router;

function resetSessionVars(req) {
  req.session.registerMessage = null;
}