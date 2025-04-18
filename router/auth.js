const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
const User = require("../models/User");
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

// Register
router.post("/register", async (req, res) => {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ msg: "User exists" });

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hash });

    const token = jwt.sign({ id: user._id }, JWT_SECRET);
    res.cookie("token", token, { httpOnly: true }).json(user);
});

// Login
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, JWT_SECRET);
    res.cookie("token", token, { httpOnly: true }).json(user);
});

// Profile
router.get("/profile", async (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.json(null);

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.id).select("-password");
        res.json(user);
    } catch (err) {
        res.json(null);
    }
});

// Logout
router.post("/logout", (req, res) => {
    res.clearCookie("token").json({ msg: "Logged out" });
});

// Delete account
router.delete("/delete", async (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ msg: "Unauthorized" });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        await User.findByIdAndDelete(decoded.id);
        res.clearCookie("token").json({ msg: "User deleted" });
    } catch (err) {
        res.status(400).json({ msg: "Invalid token" });
    }
});


module.exports = router;
