import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../Models/userModel.js';
import { sendResetPasswordEmail } from '../config/emailConfig.js';

const router = express.Router();

// Register route
router.post('/register', async (req, res) => {
    try {
        const { fullName, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const user = new User({
            fullName,
            email,
            password: hashedPassword
        });

        await user.save();

        // Create JWT token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            message: "User created successfully",
            token,
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: "Error creating user" });
    }
});

// Login route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists and explicitly select password field
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Create JWT token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: "Error logging in" });
    }
});

// Forgot password route
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = Date.now() + 3600000; // 1 hour from now

        // Save reset token and expiry to user
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = resetTokenExpiry;
        await user.save();

        // Send reset email
        try {
            const emailSent = await sendResetPasswordEmail(email, resetToken);
            if (emailSent) {
                res.json({ message: "Password reset email sent" });
            } else {
                // If email fails to send, remove the reset token from user
                user.resetPasswordToken = null;
                user.resetPasswordExpires = null;
                await user.save();
                res.status(500).json({ message: "Error sending reset email. Please check email configuration." });
            }
        } catch (emailError) {
            // If email fails to send, remove the reset token from user
            user.resetPasswordToken = null;
            user.resetPasswordExpires = null;
            await user.save();
            console.error('Email sending error:', emailError);
            res.status(500).json({ message: "Error sending reset email. Please check email configuration." });
        }

    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ message: "Error processing request. Please try again later." });
    }
});

// Reset password route
router.post('/reset-password', async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        // Find user by reset token and check if token is expired
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired reset token" });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update user's password and clear reset token fields
        user.password = hashedPassword;
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;
        await user.save();

        res.json({ message: "Password reset successful" });

    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ message: "Error resetting password" });
    }
});

export default router; 