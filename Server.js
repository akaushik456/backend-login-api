const express = require("express");
const session = require("express-session");
const cors = require("cors");

const app = express();

// Set up CORS and session
app.use(
  cors({
    origin: "http://localhost:5174", // Frontend URL
    credentials: true,  // Allow credentials (cookies)
  })
);

app.use(express.json());

app.use(
  session({
    secret: "your-secret-key",  // Secret key for signing session ID
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set to true if using https
      httpOnly: true,  // Prevent JavaScript from accessing the cookie
      maxAge: 1000 * 60 * 60 * 24,  // Cookie expiry time (1 day)
    },
  })
);

// Root endpoint for testing
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// POST route for login
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  // Store session data
  req.session.user = { email };  // Store user info in session

  res.json({ message: "Login successful", token: "dummy-token" });
});

// POST route for logout
app.post("/api/auth/logout", (req, res) => {
  // Destroy the session cookie when logging out
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Failed to log out" });
    }
    res.clearCookie("connect.sid"); // Clear the session cookie
    res.json({ message: "Logout successful" });
  });
});

// GET route to check session
app.get("/api/auth/check-session", (req, res) => {
  if (req.session.user) {
    res.json({ message: "Session active", user: req.session.user });
  } else {
    res.status(400).json({ message: "No active session" });
  }
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
