"use strict";

var bcrypt = require("bcryptjs");
var enteredPassword = "password123"; // Password you're testing
var storedHash = "$2b$10$SZtubjkm2QC8dL.yUH6V8eaCkyTd5PtneDYCTYsWO5dVXCelV5D9G"; // Your stored hash

bcrypt.compare(enteredPassword, storedHash, function (err, result) {
  if (err) {
    console.error("❌ Error:", err);
  } else if (result) {
    console.log("✅ Password is correct!");
  } else {
    console.log("❌ Invalid credentials.");
  }
});