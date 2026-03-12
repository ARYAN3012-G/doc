import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';

const app = express();
const PORT = 5003;

// ─── Middleware ────────────────────────────────
app.use(cors());
app.use(express.json());

// ─── MySQL Connection Pool ────────────────────
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'aryan3012',
    database: 'ecommerce_db',
    waitForConnections: true,
    connectionLimit: 10
});

// ─── Initialize Database (Multiple Tables) ───
const initDB = async () => {
    try {
        // Products table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS products (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                description TEXT,
                price DECIMAL(10, 2) NOT NULL,
                stock INT DEFAULT 0,
                category ENUM('electronics', 'clothing', 'books', 'food', 'other') DEFAULT 'other',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Customers table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS customers (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                phone VARCHAR(15),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Orders table (with FOREIGN KEYS)
        await pool.query(`
            CREATE TABLE IF NOT EXISTS orders (
                id INT AUTO_INCREMENT PRIMARY KEY,
                customer_id INT NOT NULL,
                product_id INT NOT NULL,
                quantity INT NOT NULL DEFAULT 1,
                total_price DECIMAL(10, 2) NOT NULL,
                status ENUM('pending', 'confirmed', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
                order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
                FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
            )
        `);

        console.log('E-commerce Database Initialized ✓');
    } catch (err) {
        console.error('DB Init Error:', err.message);
    }
};

// ═══════════════════════════════════════════════
// PRODUCT ROUTES
// ═══════════════════════════════════════════════

// GET all products (with search & category filter)
app.get('/api/products', async (req, res) => {
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
});

// POST create product
app.post('/api/products', async (req, res) => {
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
});

// PUT update product
app.put('/api/products/:id', async (req, res) => {
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
});

// DELETE product
app.delete('/api/products/:id', async (req, res) => {
    try {
        const [result] = await pool.query('DELETE FROM products WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ success: false, error: 'Product not found' });
        res.json({ success: true, message: 'Product deleted' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ═══════════════════════════════════════════════
// CUSTOMER ROUTES
// ═══════════════════════════════════════════════

app.get('/api/customers', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM customers ORDER BY created_at DESC');
        res.json({ success: true, data: rows });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/api/customers', async (req, res) => {
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
});

app.delete('/api/customers/:id', async (req, res) => {
    try {
        const [result] = await pool.query('DELETE FROM customers WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ success: false, error: 'Customer not found' });
        res.json({ success: true, message: 'Customer deleted' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ═══════════════════════════════════════════════
// ORDER ROUTES (JOINs, Transactions)
// ═══════════════════════════════════════════════

// GET all orders (with JOIN to get customer name & product name)
app.get('/api/orders', async (req, res) => {
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
});

// POST place order (with TRANSACTION — reduces stock atomically)
app.post('/api/orders', async (req, res) => {
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
});

// PATCH update order status
app.patch('/api/orders/:id/status', async (req, res) => {
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
});

// DELETE order
app.delete('/api/orders/:id', async (req, res) => {
    try {
        const [result] = await pool.query('DELETE FROM orders WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ success: false, error: 'Order not found' });
        res.json({ success: true, message: 'Order deleted' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ─── Dashboard Stats (Aggregation queries) ────
app.get('/api/dashboard', async (req, res) => {
    try {
        const [[{ totalProducts }]] = await pool.query('SELECT COUNT(*) as totalProducts FROM products');
        const [[{ totalCustomers }]] = await pool.query('SELECT COUNT(*) as totalCustomers FROM customers');
        const [[{ totalOrders }]] = await pool.query('SELECT COUNT(*) as totalOrders FROM orders');
        const [[{ totalRevenue }]] = await pool.query('SELECT COALESCE(SUM(total_price), 0) as totalRevenue FROM orders WHERE status != "cancelled"');
        const [[{ pendingOrders }]] = await pool.query("SELECT COUNT(*) as pendingOrders FROM orders WHERE status = 'pending'");

        // Top selling products
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
});

// ─── Start Server ─────────────────────────────
initDB().then(() => {
    app.listen(PORT, () => {
        console.log(`E-commerce Server running at http://localhost:${PORT}`);
    });
});
