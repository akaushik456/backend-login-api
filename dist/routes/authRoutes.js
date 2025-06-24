"use strict";

var express = require("express");
var _require = require("../controllers/authController"),
  register = _require.register,
  login = _require.login,
  forgotPassword = _require.forgotPassword,
  resetPassword = _require.resetPassword;
var router = express.Router();
router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
module.exports = router;