import pool from '../config/db.js';

// GET all customers
export const getAllCustomers = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM customers ORDER BY created_at DESC');
        res.json({ success: true, data: rows });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// POST create customer
export const createCustomer = async (req, res) => {
    try {
        const { name, email, phone } = req.body;
        if (!name || !email) return res.status(400).json({ success: false, error: 'Name and email required' });
        const [result] = await pool.query(
            'INSERT INTO customers (name, email, phone) VALUES (?, ?, ?)',
            [name, email, phone || null]
        );
        const [customer] = await pool.query('SELECT * FROM customers WHERE id = ?', [result.insertId]);
        res.status(201).json({ success: true, data: customer[0] });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') return res.status(400).json({ success: false, error: 'Email already exists' });
        res.status(500).json({ success: false, error: error.message });
    }
};

// DELETE customer
export const deleteCustomer = async (req, res) => {
    try {
        const [result] = await pool.query('DELETE FROM customers WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ success: false, error: 'Customer not found' });
        res.json({ success: true, message: 'Customer deleted' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
