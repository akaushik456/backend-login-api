require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const rateLimit = require("express-rate-limit");
const User = require("./models/user");

const app = express();
const SECRET_KEY = process.env.JWT_SECRET || "fallback_secret";

// ✅ Middleware
app.use(express.json());
// app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(cors());

// ✅ MongoDB Connection
mongoose.connect("mongodb://localhost:27017/your-database", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

// ✅ Root Route (Fixes Cannot GET /)
app.get("/", (req, res) => {
  res.send("🚀 Server is running!");
});

// ✅ Rate Limiter
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Too many login attempts, try again later."
});

// ✅ JWT Authentication Middleware
const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = user;
    next();
  });
};

// ✅ Register API
app.post("/api/auth/register", async (req, res) => {
  console.log("📥 Register Request Received:", req.body); // Debugging

  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      console.log("⚠️ Missing fields:", { name, email, password });
      return res.status(400).json({ message: "All fields are required." });
    }

    console.log("🔍 Checking if user already exists...");
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });

    if (existingUser) {
      console.log("⚠️ User already exists:", existingUser.email);
      return res.status(400).json({ message: "User already exists." });
    }

    console.log("🔐 Hashing password...");
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log("🆕 Creating new user...");
    const newUser = new User({
      name,
      email: email.toLowerCase().trim(),
      password: hashedPassword,
    });

    await newUser.save();
    console.log("✅ User saved successfully!");

    const token = jwt.sign({ userId: newUser._id, email: newUser.email }, SECRET_KEY, { expiresIn: "1h" });

    res.status(201).json({ message: "User registered successfully!", token });

  } catch (error) {
    console.error("❌ Register Error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});



// ✅ Login API
app.post("/api/auth/login", loginLimiter, async (req, res) => {
  console.log("📥 Login Request Body:", req.body); // Debugging
  
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    const token = jwt.sign({ userId: user._id, email: user.email }, SECRET_KEY, { expiresIn: "1h" });

    res.json({ message: "Login successful!", token });

  } catch (error) {
    console.error("❌ Login Error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});


// ✅ Logout API
app.post("/api/auth/logout", (req, res) => {
  try {
    res.clearCookie("token"); // If using cookies
    res.json({ message: "Logout successful!" });
  } catch (error) {
    console.error("❌ Logout Error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});


// ✅ Check Session API
app.get("/api/auth/check-session", authenticateToken, (req, res) => {
  res.json({ message: "Session active", user: req.user });
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
