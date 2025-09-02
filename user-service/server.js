// server.js
const express = require('express');
const multer = require('multer');
require('dotenv').config();
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require("path");
const sequelize = require("./config/db");
const app = express();
const PORT = process.env.PORT || 5001;
const authMiddleware = require('./middleware/authMiddleware');
const router = express.Router();
// const profileRoutes = require('./routes/profile');
app.use(express.json());
app.use(bodyParser.json());


// PostgreSQL connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

// const multer  = require('multer');
const storage = multer.diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    }
  });
  const upload = multer({ storage });

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// JWT Secret Key
const JWT_SECRET = process.env.JWT_SECRET || 'secret123';

// ✅ CORS Middleware (must be before routes)
app.use(cors({
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));
// app.options('*', cors());

// Middleware


// ====================== Auth Middleware ======================
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Access token missing' });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid or expired token' });
        req.user = user;
        next();
    });
}

// ====================== Auth Routes ======================
app.post('/register', async (req, res) => {
    console.log('📩 Incoming register data:', req.body);
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Missing name, email, or password' });
    }
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query(
            'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email',
            [name, email, hashedPassword]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error registering user');
    }
});

app.post('/login', async (req, res) => {
    console.log('📩 Incoming login data:', req.body);
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Missing email or password' });
    }
    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(400).json({ message: 'User not found' });
        }
        const user = result.rows[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign(
            { id: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: '12h' }
        );
        res.json({ message: 'Login successful', token });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error logging in');
    }
});

// ====================== Protected Profile Route ======================

// ✅ Get profile (PostgreSQL)
// app.get('/api/profile', authenticateToken, async (req, res) => {
//   try {
//     const { rows } = await pool.query(
//       'SELECT id, name, email, profile_picture FROM users WHERE id = $1',
//       [req.user.id]
//     );
//     if (rows.length === 0) return res.status(404).json({ error: 'User not found' });
//     res.json(rows[0]);
//   } catch (err) {
//     console.error('❌ Error fetching profile:', err);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// ✅ Upload profile picture (PostgreSQL)
// app.post('/api/profile/pic', authenticateToken, upload.single('profile_picture'), async (req, res) => {
//   try {
//     if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

//     const profile_picture = `/uploads/${req.file.filename}`;

//     await pool.query(
//       'UPDATE users SET profile_picture = $1 WHERE id = $2',
//       [profile_picture, req.user.id]
//     );

//     res.json({ message: 'Profile picture updated!', profile_picture });
//   } catch (err) {
//     console.error('❌ Error updating profile picture:', err);
//     res.status(500).json({ error: 'Server error' });
//   }
// });


// ====================== Profile Routes ======================

// Profile routes

// / Get profile1 correct one 
app.get('/api/profile', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, email, phone,bio,role,address,city,state,postal_code,website,created_at,profile_picture FROM users WHERE id = $1',
      [req.user.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching profile:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/profile', authMiddleware, async (req, res) => {
  try {
    const { name,address,phone,bio } = req.body;
    if (!name) return res.status(400).json({ error: 'Name is required' });

    await pool.query(
     `UPDATE users 
       SET name = $1, address = $2, phone = $3, bio = $4
       WHERE id = $5`,
      [name, address, phone, bio, req.user.id]
    );

    res.json({ message: 'Profile updated successfully' });
  } catch (err) {
    console.error('Error updating profile:', err);
    res.status(500).json({ error: 'Server error' });
  }
});
app.put('/api/profile/pic', authMiddleware, upload.single('profile_picture'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const profile_picture = `/uploads/${req.file.filename}`;

    await pool.query(
      'UPDATE users SET profile_picture = $1 WHERE id = $2',
      [profile_picture, req.user.id]
    );

    res.json({ message: 'Profile picture updated!', profile_picture });
  } catch (err) {
    console.error('Error updating profile picture:', err);
    res.status(500).json({ error: 'Server error' });
  }
});




//to  Delete whole account 
// app.delete('/api/profile', authenticateToken, async (req, res) => {
//   try {
//     await pool.query('DELETE FROM users WHERE id = $1', [req.user.id]);
//     res.json({ message: 'Profile deleted successfully' });
//   } catch (err) {
//     console.error('❌ Error deleting profile:', err);
//     res.status(500).json({ error: 'Server error' });
//   }
// });


// Soft delete profile picture
// app.delete('/api/profile/pic', authMiddleware, async (req, res) => {
//   try {
//     // 1️⃣ Check if user has a profile picture
//     const result = await pool.query(
//       'SELECT profile_picture FROM users WHERE id = $1',
//       [req.user.id]
//     );
//     const currentPic = result.rows[0]?.profile_picture;

//     if (!currentPic) return res.status(400).json({ message: 'No profile picture to delete' });

//     // 2️⃣ Soft delete: set profile_picture to NULL in DB
//     await pool.query(
//       'UPDATE users SET profile_picture = NULL WHERE id = $1',
//       [req.user.id]
//     );

//     res.json({ message: 'Profile picture deleted (soft delete)' });
//   } catch (err) {
//     console.error('❌ Error soft deleting profile picture:', err);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

const fs = require('fs');
// Hard delete profile picture
app.delete('/api/profile/pic', authMiddleware, async (req, res) => {
  try {
    // 1️⃣ Get current profile picture path
    const result = await pool.query(
      'SELECT profile_picture FROM users WHERE id = $1',
      [req.user.id]
    );
    const currentPic = result.rows[0]?.profile_picture;

    if (!currentPic) return res.status(400).json({ message: 'No profile picture to delete' });

    // 2️⃣ Delete the file from uploads folder
    const filePath = path.join(__dirname, currentPic); // make sure path is correct
    fs.unlink(filePath, (err) => {
      if (err) console.warn('⚠️ Could not delete file:', err.message);
      else console.log('🗑️ Profile picture deleted from server:', currentPic);
    });

    // 3️⃣ Update DB
    await pool.query(
      'UPDATE users SET profile_picture = NULL WHERE id = $1',
      [req.user.id]
    );

    res.json({ message: 'Profile picture deleted (hard delete)' });
  } catch (err) {
    console.error('❌ Error hard deleting profile picture:', err);
    res.status(500).json({ error: 'Server error' });
  }
});


// ====================== DB Test ======================
sequelize.authenticate()
    .then(() => console.log("✅ Database connected"))
    .catch(err => console.error("❌ DB connection error:", err));


// server.js
app.use(express.static(path.join(__dirname, 'dist/snapmart-ui')));

// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'dist/snapmart-ui/index.html'));
// });

//profilepage


// Start Server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));


let blacklistedTokens = [];

app.post('/api/logout', (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (token) {
    blacklistedTokens.push(token);
  }
  res.json({ message: 'Logged out' });
});

// // Middleware check
// function authMiddleware(req, res, next) {
//   const token = req.headers['authorization']?.split(' ')[1];
//   if (!token || blacklistedTokens.includes(token)) {
//     return res.status(401).json({ message: 'Unauthorized' });
//   }
  // verify token
  // next();
// }
