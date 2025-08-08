require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const port = process.env.PORT || 5001;

// Middleware
app.use(bodyParser.json());

// PostgreSQL connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

// JWT Secret Key
const JWT_SECRET = process.env.JWT_SECRET || 'secret123';

// Routes
app.get('/', (req, res) => {
    res.send('User Service is running...');
});

// Register
app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Hash password
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

// Login
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

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
            { expiresIn: '1h' }
        );

        res.json({ message: 'Login successful', token });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error logging in');
    }
});

// Start server
app.listen(port, () => {
    console.log(`User Service running on port ${port}`);
});
