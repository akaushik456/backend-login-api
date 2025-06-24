const bcrypt = require("bcryptjs");

const enteredPassword = "password123"; // Password you're testing
const storedHash = "$2b$10$SZtubjkm2QC8dL.yUH6V8eaCkyTd5PtneDYCTYsWO5dVXCelV5D9G"; // Your stored hash

bcrypt.compare(enteredPassword, storedHash, (err, result) => {
  if (err) {
    console.error("❌ Error:", err);
  } else if (result) {
    console.log("✅ Password is correct!");
  } else {
    console.log("❌ Invalid credentials.");
  }
});
