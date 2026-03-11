import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';

const app = express();
const PORT = 5002;

// Middleware
app.use(cors());
app.use(express.json());

// MySQL Connection Pool
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'password', // Change this to your password
    database: 'user_db',
    waitForConnections: true,
    connectionLimit: 10
});

// Initialize database
const initDB = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL
            )
        `);
        console.log('MySQL Database Initialized...');
    } catch (err) {
        console.error('Error initializing database:', err);
    }
};
initDB();

// Routes
app.get('/api/users', async (req, res) => {
    const [rows] = await pool.query('SELECT * FROM users');
    res.json(rows);
});

app.post('/api/users', async (req, res) => {
    const { name, email } = req.body;
    const [result] = await pool.query('INSERT INTO users (name, email) VALUES (?, ?)', [name, email]);
    res.status(201).json({ id: result.insertId, name, email });
});

app.delete('/api/users/:id', async (req, res) => {
    await pool.query('DELETE FROM users WHERE id = ?', [req.params.id]);
    res.json({ message: 'User deleted' });
});

app.listen(PORT, () => {
    console.log(`MySQL Project Server running at http://localhost:${PORT}`);
});
