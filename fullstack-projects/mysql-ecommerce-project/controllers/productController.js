import pool from '../config/db.js';

// GET all products
export const getAllProducts = async (req, res) => {
    try {
        const { search, category, sort } = req.query;
        let query = 'SELECT * FROM products WHERE 1=1';
        const params = [];

        if (search) {
            query += ' AND (name LIKE ? OR description LIKE ?)';
            params.push(`%${search}%`, `%${search}%`);
        }
        if (category) {
            query += ' AND category = ?';
            params.push(category);
        }

        if (sort === 'price_asc') query += ' ORDER BY price ASC';
        else if (sort === 'price_desc') query += ' ORDER BY price DESC';
        else query += ' ORDER BY created_at DESC';

        const [rows] = await pool.query(query, params);
        res.json({ success: true, count: rows.length, data: rows });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// POST create product
export const createProduct = async (req, res) => {
    try {
        const { name, description, price, stock, category } = req.body;
        if (!name || !price) return res.status(400).json({ success: false, error: 'Name and price are required' });
        const [result] = await pool.query(
            'INSERT INTO products (name, description, price, stock, category) VALUES (?, ?, ?, ?, ?)',
            [name, description || '', price, stock || 0, category || 'other']
        );
        const [product] = await pool.query('SELECT * FROM products WHERE id = ?', [result.insertId]);
        res.status(201).json({ success: true, data: product[0] });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// PUT update product
export const updateProduct = async (req, res) => {
    try {
        const { name, description, price, stock, category } = req.body;
        const [result] = await pool.query(
            'UPDATE products SET name=?, description=?, price=?, stock=?, category=? WHERE id=?',
            [name, description, price, stock, category, req.params.id]
        );
        if (result.affectedRows === 0) return res.status(404).json({ success: false, error: 'Product not found' });
        const [updated] = await pool.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
        res.json({ success: true, data: updated[0] });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// DELETE product
export const deleteProduct = async (req, res) => {
    try {
        const [result] = await pool.query('DELETE FROM products WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ success: false, error: 'Product not found' });
        res.json({ success: true, message: 'Product deleted' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
