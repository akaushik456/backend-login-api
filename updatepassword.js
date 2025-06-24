require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./models/user"); // Adjust path if needed

mongoose.connect("mongodb://localhost:27017/your-database", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

const checkPassword = async () => {
  const email = "user@example.com"; // Change this to match your user
  const password = "password123"; // The password you're testing

  try {
    const user = await User.findOne({ email: "user@example.com" });
    console.log(user);
    

    if (!user) {
      console.log("❌ User not found.");
      return;
    }

    console.log("🔍 Stored Hash:", user.password);

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("🔑 Password Match:", isMatch);

    mongoose.disconnect();
  } catch (error) {
    console.error("❌ Error:", error);
    mongoose.disconnect();
  }
};

checkPassword();
