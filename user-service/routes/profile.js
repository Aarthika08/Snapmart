const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const User = require("../models/User");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, "../uploads/profile_pics");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});
const upload = multer({ storage });

// GET /api/profile
router.get("/", authMiddleware, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ["id", "name", "email", "profile_picture", "created_at","phone","bio","role","address","city","state","postal_code","website"]
    });
    
//id, name, email, profile_picture,phone,bio,role,city,state,postal_code,website,created_at
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", details: error.message });
  }
});

// PUT /api/profile
router.put("/", authMiddleware, async (req, res) => {
  try {
    const { name,phone,address,bio } = req.body;
    await User.update(
      { name,phone,address,bio },
      { where: { id: req.user.id } }
    );
    res.json({ message: "Profile updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", details: error.message });
  }
});

// POST /api/profile/pic
router.post("/pic", authMiddleware, upload.single("profile_picture"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const imagePath = `/uploads/profile_pics/${req.file.filename}`;
    await User.update(
      { profile_picture: imagePath },
      { where: { id: req.user.id } }
    );

    res.json({ message: "Profile picture updated", path: imagePath });
  } catch (error) {
    res.status(500).json({ message: "Server error", details: error.message });
  }
});


router.delete("/pic", authMiddleware, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (!user.profile_picture) return res.status(400).json({ message: "No profile picture to delete" });

    const filePath = path.join(__dirname, "../uploads/profile_pics", path.basename(user.profile_picture));
    fs.unlink(filePath, (err) => {
      if (err) console.warn("⚠️ Could not delete file:", err.message);
      else console.log("🗑️ Profile picture deleted:", user.profile_picture);
    });

    await User.update({ profile_picture: null }, { where: { id: req.user.id } });

    res.json({ message: "Profile picture deleted" });
  } catch (error) {
    console.error("❌ Error deleting profile picture:", error);
    res.status(500).json({ message: "Server error", details: error.message });
  }
});



module.exports = router;
