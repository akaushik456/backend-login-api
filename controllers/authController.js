const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const SECRET_KEY = process.env.JWT_SECRET || "fallback_secret";

// ✅ User Registration
exports.register = async (req, res) => {
  console.log("📥 Registration Request Body:", req.body);
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email: email.toLowerCase().trim(), password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("❌ Registration Error:", error);
    res.status(500).json({ message: "Failed to register user" });
  }
};

// ✅ User Login
exports.login = async (req, res) => {
  console.log("🟢 Login Request Received:", req.body);
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id, email: user.email }, SECRET_KEY, { expiresIn: "1h" });
    res.json({ message: "Login successful", token });
  } catch (error) {
    console.error("❌ Login Error:", error);
    res.status(500).json({ message: "Failed to login" });
  }
};

// ✅ Forgot Password (Dummy Implementation)
exports.forgotPassword = async (req, res) => {
  return res.status(501).json({ message: "Forgot password feature not implemented yet" });
};

// ✅ Reset Password (Dummy Implementation)
exports.resetPassword = async (req, res) => {
  return res.status(501).json({ message: "Reset password feature not implemented yet" });
};
