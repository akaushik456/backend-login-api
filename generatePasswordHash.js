// Login Route (with MongoDB user)
app.post("/api/auth/login", async (req, res) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }
  
    // Find the user in the database
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
  
    console.log(`Attempting login for email: ${email}`); // Debugging log
  
    // Compare entered password with hashed password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      console.log('Password did not match'); // Debugging log
      return res.status(400).json({ message: "Invalid credentials" });
    }
  
    console.log('Login successful'); // Debugging log
    const token = "your_jwt_token_here"; // Generate token
    return res.json({ message: "Login successful", token });
  });
  