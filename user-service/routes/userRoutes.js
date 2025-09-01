const express = require('express');
const router = express.Router();
const { getProfile } = require('../config/profileController');
const authenticate = require('../middleware/authMiddleware');

// Get profile (protected)
router.get('/profilepage', authenticate, getProfile);


module.exports = router;
