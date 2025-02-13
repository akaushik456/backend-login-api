const express = require('express');
const bodyParser = require('body-parser');
const User = require('../models/User'); // Assuming you have a User model
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const app = express();

app.use(bodyParser.json());

// Forgot Password Endpoint
app.post('/api/auth/forgot-password', async (req, res) => {
  const { email } = req.body;
  
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate reset token
    const resetToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    user.resetToken = resetToken;
    await user.save();

    // Send email with reset link
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'your-email@gmail.com', // Use environment variables for security
        pass: 'your-email-password',
      },
    });

    const resetLink = `http://yourfrontendurl.com/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: 'your-email@gmail.com',
      to: email,
      subject: 'Password Reset Request',
      text: `Click the link to reset your password: ${resetLink}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({ message: 'Failed to send email' });
      }
      res.status(200).json({ message: 'Reset link sent' });
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Listen on port
app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
