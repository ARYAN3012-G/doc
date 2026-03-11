# MySQL Syntax Guide (Node.js)

Integration using the `mysql2/promise` library for async/await support.

## 1. Connection Steps
```javascript
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'my_database',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export default pool;
```

## 2. Basic SQL CRUD in Node.js
```javascript
// CREATE
const [result] = await pool.query(
    'INSERT INTO users (name, email) VALUES (?, ?)', 
    ['Aryan', 'aryan@example.com']
);

// READ
const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [1]);

// UPDATE
await pool.query('UPDATE users SET name = ? WHERE id = ?', ['New Name', 1]);

// DELETE
await pool.query('DELETE FROM users WHERE id = ?', [1]);
```

## 3. Advanced Queries (JOINs)
```javascript
const [data] = await pool.query(`
    SELECT users.name, orders.amount 
    FROM users 
    JOIN orders ON users.id = orders.user_id
`);
```

## 4. Schema Definition (SQL)
```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```
