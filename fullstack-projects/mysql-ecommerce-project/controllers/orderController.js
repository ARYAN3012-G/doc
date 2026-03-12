import pool from '../config/db.js';

// GET all orders (with JOINs)
export const getAllOrders = async (req, res) => {
    try {
        const { status } = req.query;
        let query = `
            SELECT o.id, o.quantity, o.total_price, o.status, o.order_date,
                   c.name AS customer_name, c.email AS customer_email,
                   p.name AS product_name, p.price AS product_price
            FROM orders o
            JOIN customers c ON o.customer_id = c.id
            JOIN products p ON o.product_id = p.id
        `;
        const params = [];
        if (status) {
            query += ' WHERE o.status = ?';
            params.push(status);
        }
        query += ' ORDER BY o.order_date DESC';

        const [rows] = await pool.query(query, params);
        res.json({ success: true, count: rows.length, data: rows });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// POST place order (with TRANSACTION)
export const createOrder = async (req, res) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const { customer_id, product_id, quantity } = req.body;
        if (!customer_id || !product_id || !quantity) {
            return res.status(400).json({ success: false, error: 'customer_id, product_id, and quantity are required' });
        }

        // Check stock
        const [[product]] = await connection.query('SELECT * FROM products WHERE id = ?', [product_id]);
        if (!product) throw new Error('Product not found');
        if (product.stock < quantity) throw new Error(`Insufficient stock. Only ${product.stock} available.`);

        const total_price = product.price * quantity;

        // Insert order
        const [result] = await connection.query(
            'INSERT INTO orders (customer_id, product_id, quantity, total_price) VALUES (?, ?, ?, ?)',
            [customer_id, product_id, quantity, total_price]
        );

        // Reduce stock
        await connection.query('UPDATE products SET stock = stock - ? WHERE id = ?', [quantity, product_id]);

        await connection.commit();

        const [order] = await pool.query(`
            SELECT o.*, c.name AS customer_name, p.name AS product_name 
            FROM orders o JOIN customers c ON o.customer_id = c.id JOIN products p ON o.product_id = p.id 
            WHERE o.id = ?
        `, [result.insertId]);
        res.status(201).json({ success: true, data: order[0] });
    } catch (error) {
        await connection.rollback();
        res.status(400).json({ success: false, error: error.message });
    } finally {
        connection.release();
    }
};

// PATCH update order status
export const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ success: false, error: `Status must be one of: ${validStatuses.join(', ')}` });
        }
        const [result] = await pool.query('UPDATE orders SET status = ? WHERE id = ?', [status, req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ success: false, error: 'Order not found' });
        res.json({ success: true, message: `Order status updated to ${status}` });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// DELETE order
export const deleteOrder = async (req, res) => {
    try {
        const [result] = await pool.query('DELETE FROM orders WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ success: false, error: 'Order not found' });
        res.json({ success: true, message: 'Order deleted' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// GET dashboard stats (Aggregation)
export const getDashboard = async (req, res) => {
    try {
        const [[{ totalProducts }]] = await pool.query('SELECT COUNT(*) as totalProducts FROM products');
        const [[{ totalCustomers }]] = await pool.query('SELECT COUNT(*) as totalCustomers FROM customers');
        const [[{ totalOrders }]] = await pool.query('SELECT COUNT(*) as totalOrders FROM orders');
        const [[{ totalRevenue }]] = await pool.query('SELECT COALESCE(SUM(total_price), 0) as totalRevenue FROM orders WHERE status != "cancelled"');
        const [[{ pendingOrders }]] = await pool.query("SELECT COUNT(*) as pendingOrders FROM orders WHERE status = 'pending'");

        const [topProducts] = await pool.query(`
            SELECT p.name, SUM(o.quantity) as total_sold, SUM(o.total_price) as revenue
            FROM orders o JOIN products p ON o.product_id = p.id
            WHERE o.status != 'cancelled'
            GROUP BY p.id, p.name
            ORDER BY total_sold DESC LIMIT 5
        `);

        res.json({
            success: true,
            data: { totalProducts, totalCustomers, totalOrders, totalRevenue, pendingOrders, topProducts }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
