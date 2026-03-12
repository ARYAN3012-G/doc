import { pool } from '../config/db.js';

// GET all users (with search & filter)
export const getAllUsers = async (req, res) => {
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
};

// GET single user
export const getUserById = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ success: false, error: 'User not found' });
        res.json({ success: true, data: rows[0] });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// POST create user
export const createUser = async (req, res) => {
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
};

// PUT update user
export const updateUser = async (req, res) => {
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
};

// PATCH toggle active
export const toggleUser = async (req, res) => {
    try {
        await pool.query('UPDATE users SET is_active = NOT is_active WHERE id = ?', [req.params.id]);
        const [updated] = await pool.query('SELECT * FROM users WHERE id = ?', [req.params.id]);
        if (updated.length === 0) return res.status(404).json({ success: false, error: 'User not found' });
        res.json({ success: true, data: updated[0] });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// DELETE user
export const deleteUser = async (req, res) => {
    try {
        const [result] = await pool.query('DELETE FROM users WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ success: false, error: 'User not found' });
        res.json({ success: true, message: 'User deleted' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// GET stats
export const getStats = async (req, res) => {
    try {
        const [[{ total }]] = await pool.query('SELECT COUNT(*) as total FROM users');
        const [[{ active }]] = await pool.query('SELECT COUNT(*) as active FROM users WHERE is_active = TRUE');
        const [[{ admins }]] = await pool.query("SELECT COUNT(*) as admins FROM users WHERE role = 'admin'");
        res.json({ success: true, data: { total, active, inactive: total - active, admins } });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
