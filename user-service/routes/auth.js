const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");

require("dotenv").config();
const router = express.Router();

// Define User model
const User = sequelize.define("User", {
  email: { type: DataTypes.STRING, unique: true },
  password: { type: DataTypes.STRING }
}, {
  tableName: "users",
  timestamps: false
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
