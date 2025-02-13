const express = require("express");
const session = require("express-session");
const cors = require("cors");

const app = express();

// Middleware for CORS and session
app.use(
  cors({
    origin: "http://localhost:5174", // Frontend URL
    credentials: true, // ✅ Important for sending cookies
  })
);

app.use(express.json());

// Configure session
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true, // ✅ Change to true for debugging
    cookie: {
      secure: false, // Set to true in production (HTTPS)
      httpOnly: true, // Prevent JavaScript access
      sameSite: "lax", // Helps with CORS
      maxAge: 1000 * 60 * 60 * 24, // 1 day expiry
    },
  })
);

// Root test route
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// 🔹 POST Login Route (with session debugging)
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  req.session.user = { email }; // Store user in session
  req.session.save(); // ✅ Ensure session is saved

  console.log("Session After Login:", req.session); // ✅ Debugging

  res.json({ message: "Login successful" });
});

// 🔹 POST Logout Route
app.post("/api/auth/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Failed to log out" });
    }
    res.clearCookie("connect.sid");
    res.json({ message: "Logout successful" });
  });
});

// 🔹 GET Check Session Route (with debugging)
app.get("/api/auth/check-session", (req, res) => {
  console.log("Session Data on Check:", req.session); // ✅ Debugging
  if (req.session.user) {
    res.json({ message: "Session active", user: req.session.user });
  } else {
    res.status(401).json({ message: "No active session" });
  }
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
