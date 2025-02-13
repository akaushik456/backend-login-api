const express = require("express");
const session = require("express-session");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt"); // For password hashing
const User = require("./models/user"); // Import User model

const app = express();

// MongoDB Connection
mongoose
  .connect("mongodb://localhost:27017/your-database", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Middleware
app.use(
  cors({
    origin: "http://localhost:5174", // Frontend URL
    credentials: true,
  })
);
app.use(express.json());

// Session setup
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Change to true in production with HTTPS
      httpOnly: true,
    },
  })
);

// Root Route
app.get("/", (req, res) => {
  res.send("🚀 Server is running!");
});

// ✅ **User Registration (Signup)**
app.post("/api/auth/register", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  if (password.length < 6 || !/\d/.test(password)) {
    return res.status(400).json({
      message: "Password must be at least 6 characters and contain a number.",
    });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("❌ Registration Error:", error);
    res.status(500).json({ message: "Failed to register user" });
  }
});

// ✅ **User Login**
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Store user session
    req.session.user = { email: user.email };

    res.json({ message: "Login successful", token: "dummy-token" });
  } catch (error) {
    console.error("❌ Login Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ✅ **Check Session**
app.get("/api/auth/check-session", (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  res.json({ message: "Session active", user: req.session.user });
});

// ✅ **Logout**
app.post("/api/auth/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Failed to log out" });
    }
    res.clearCookie("connect.sid");
    res.json({ message: "Logout successful" });
  });
});

// Start Server
app.listen(5000, () => {
  console.log("🚀 Server running on http://localhost:5000");
});
