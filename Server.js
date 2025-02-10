const express = require("express");
const cors = require("cors");

const app = express();

// Enable CORS for all origins
app.use(cors({
    origin: 'http://localhost:5173',
  }));

// Parse JSON request bodies
app.use(express.json()); 

// Root endpoint (for testing)
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// Login endpoint
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  console.log("Received data:", req.body); // Debugging log
  res.json({ message: "Login successful" }); // Your actual logic here
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
