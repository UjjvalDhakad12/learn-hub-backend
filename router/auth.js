const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
const User = require("../models/User"); // this is user model. require kiya hai
require('dotenv').config();

//use jwt srcret key env file se
const JWT_SECRET = process.env.JWT_SECRET;

// Register
router.post("/register", async (req, res) => {
    //usernmae email password body se liya gaya hai
    const { username, email, password } = req.body;

    //check kiya hai koi use pahle se to nahi hai.
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ msg: "User exists" });

    //password ko hash kiya hai  using by bcrypt
    const hash = await bcrypt.hash(password, 10);

    //user create kiya hai password hash rakha hai
    const user = await User.create({ username, email, password: hash });

    //token diya hai
    const token = jwt.sign({ id: user._id }, JWT_SECRET);
    res.cookie("token", token, { httpOnly: true }).json(user);
});

// Login
router.post("/login", async (req, res) => {
    //email or password liya hai body se
    const { email, password } = req.body;
    //user find kiy hai use hai ya nahi
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found" });
    //password ko compare kar rahe hai
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    //token de rahe hai
    const token = jwt.sign({ id: user._id }, JWT_SECRET);
    res.cookie("token", token, { httpOnly: true }).json(user);
});

// Profile// Get user profile route
router.get("/profile", async (req, res) => {
    // Get token from cookies
    const token = req.cookies.token;
    if (!token) return res.json(null);

    try {
        // Verify token using JWT_SECRET
        const decoded = jwt.verify(token, JWT_SECRET);

        // Find user by decoded id and exclude password field
        const user = await User.findById(decoded.id).select("-password");

        // Send user data as response
        res.json(user);
    } catch (err) {
        // If error, send null
        res.json(null);
    }
});

// Logout
// Logout route
router.post("/logout", (req, res) => {
    // Clear the token cookie and send a logout message
    res.clearCookie("token").json({ msg: "Logged out" });
});

// Delete account route
router.delete("/delete", async (req, res) => {
    // Get token from cookies
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ msg: "Unauthorized" });

    try {
        // Verify the token
        const decoded = jwt.verify(token, JWT_SECRET);

        // Delete the user from the database
        await User.findByIdAndDelete(decoded.id);

        // Clear the token cookie and send a success message
        res.clearCookie("token").json({ msg: "User deleted" });
    } catch (err) {
        // If token is invalid, send an error message
        res.status(400).json({ msg: "Invalid token" });
    }
});



module.exports = router;
