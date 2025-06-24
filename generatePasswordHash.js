// ✅ Login Route (with correct password comparison)
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
  
    console.log('✅ Login successful');
    
    // Generate a JWT token
    const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return res.json({ message: "Login successful", token });
});
