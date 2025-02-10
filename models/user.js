const User = require("./models/User"); // Import the User model

// Register Route (for example)
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  // Create a new user
  const user = new User({
    email,
    password
  });

  await user.save(); // Save user to database
  res.status(201).json({ message: "User registered successfully" });
});
