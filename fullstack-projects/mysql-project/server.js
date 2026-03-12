import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';

const app = express();
const PORT = 5002;

// ─── Middleware ────────────────────────────────
app.use(cors());
app.use(express.json());

// ─── MySQL Connection Pool ────────────────────
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'aryan3012',
    database: 'user_management',
    waitForConnections: true,
    connectionLimit: 10
});

// ─── Initialize Database ─────────────────────
const initDB = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                age INT DEFAULT 0,
                role ENUM('user', 'admin', 'moderator') DEFAULT 'user',
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);
        console.log('MySQL Database Initialized ✓');
    } catch (err) {
        console.error('DB Init Error:', err.message);
    }
};

// ─── Routes ───────────────────────────────────

// GET all users (with search & filter)
app.get('/api/users', async (req, res) => {
    try {
        const { search, role, sort } = req.query;
        let query = 'SELECT * FROM users WHERE 1=1';
        const params = [];

        if (search) {
            query += ' AND (name LIKE ? OR email LIKE ?)';
            params.push(`%${search}%`, `%${search}%`);
        }
        if (role) {
            query += ' AND role = ?';
            params.push(role);
        }

        query += sort === 'oldest' ? ' ORDER BY created_at ASC' : ' ORDER BY created_at DESC';

        const [rows] = await pool.query(query, params);
        res.json({ success: true, count: rows.length, data: rows });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET single user
app.get('/api/users/:id', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ success: false, error: 'User not found' });
        res.json({ success: true, data: rows[0] });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// POST create user
app.post('/api/users', async (req, res) => {
    try {
        const { name, email, age, role } = req.body;
        if (!name || !email) return res.status(400).json({ success: false, error: 'Name and email are required' });
        const [result] = await pool.query(
            'INSERT INTO users (name, email, age, role) VALUES (?, ?, ?, ?)',
            [name, email, age || 0, role || 'user']
        );
        const [newUser] = await pool.query('SELECT * FROM users WHERE id = ?', [result.insertId]);
        res.status(201).json({ success: true, data: newUser[0] });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ success: false, error: 'Email already exists' });
        }
        res.status(500).json({ success: false, error: error.message });
    }
});

// PUT update user
app.put('/api/users/:id', async (req, res) => {
    try {
        const { name, email, age, role } = req.body;
        const [result] = await pool.query(
            'UPDATE users SET name = ?, email = ?, age = ?, role = ? WHERE id = ?',
            [name, email, age, role, req.params.id]
        );
        if (result.affectedRows === 0) return res.status(404).json({ success: false, error: 'User not found' });
        const [updated] = await pool.query('SELECT * FROM users WHERE id = ?', [req.params.id]);
        res.json({ success: true, data: updated[0] });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// PATCH toggle active
app.patch('/api/users/:id/toggle', async (req, res) => {
    try {
        await pool.query('UPDATE users SET is_active = NOT is_active WHERE id = ?', [req.params.id]);
        const [updated] = await pool.query('SELECT * FROM users WHERE id = ?', [req.params.id]);
        if (updated.length === 0) return res.status(404).json({ success: false, error: 'User not found' });
        res.json({ success: true, data: updated[0] });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// DELETE user
app.delete('/api/users/:id', async (req, res) => {
    try {
        const [result] = await pool.query('DELETE FROM users WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ success: false, error: 'User not found' });
        res.json({ success: true, message: 'User deleted' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Stats
app.get('/api/stats', async (req, res) => {
    try {
        const [[{ total }]] = await pool.query('SELECT COUNT(*) as total FROM users');
        const [[{ active }]] = await pool.query('SELECT COUNT(*) as active FROM users WHERE is_active = TRUE');
        const [[{ admins }]] = await pool.query("SELECT COUNT(*) as admins FROM users WHERE role = 'admin'");
        res.json({ success: true, data: { total, active, inactive: total - active, admins } });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ─── Start Server ─────────────────────────────
initDB().then(() => {
    app.listen(PORT, () => {
        console.log(`MySQL User Management Server running at http://localhost:${PORT}`);
    });
});
