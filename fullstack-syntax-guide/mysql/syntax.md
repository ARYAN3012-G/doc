# MySQL Complete Syntax Guide (Node.js)

A comprehensive reference using the `mysql2/promise` library for async/await support.

---

## 1. Installation

```bash
npm install mysql2
```

---

## 2. Connection Steps (Detailed)

### Simple Connection
```javascript
import mysql from 'mysql2/promise';

const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'aryan3012',
    database: 'my_database'
});

const [rows] = await connection.query('SELECT * FROM users');
console.log(rows);
await connection.end(); // Close connection
```

### Connection Pool (Recommended for Production)
```javascript
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'aryan3012',
    database: 'my_database',
    waitForConnections: true,
    connectionLimit: 10,       // Max simultaneous connections
    queueLimit: 0,             // 0 = no limit on queued requests
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
});

export default pool;
```

### Using Pool in Routes
```javascript
import pool from './db.js';

// Automatic connection management — pool handles acquire/release
const [rows] = await pool.query('SELECT * FROM users');
```

### Test Connection
```javascript
const testConnection = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('MySQL Connected Successfully!');
        connection.release(); // Release back to pool
    } catch (error) {
        console.error('MySQL Connection Failed:', error.message);
        process.exit(1);
    }
};
testConnection();
```

---

## 3. Database & Table Management (SQL)

```sql
-- Create Database
CREATE DATABASE IF NOT EXISTS my_database;
USE my_database;

-- Drop Database
DROP DATABASE IF EXISTS my_database;

-- Create Table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    age INT DEFAULT 0,
    role ENUM('user', 'admin', 'moderator') DEFAULT 'user',
    is_active BOOLEAN DEFAULT TRUE,
    salary DECIMAL(10, 2),
    bio TEXT,
    avatar BLOB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Alter Table
ALTER TABLE users ADD COLUMN phone VARCHAR(15);
ALTER TABLE users DROP COLUMN phone;
ALTER TABLE users MODIFY COLUMN name VARCHAR(200);
ALTER TABLE users RENAME COLUMN name TO full_name;
ALTER TABLE users RENAME TO members;

-- Drop Table
DROP TABLE IF EXISTS users;

-- Truncate (delete all data, keep structure)
TRUNCATE TABLE users;

-- Show Tables
SHOW TABLES;

-- Describe Table Structure
DESCRIBE users;
```

### Data Types Reference
| Type | Description | Example |
|:---|:---|:---|
| `INT` | Integer | `42` |
| `BIGINT` | Large integer | `9999999999` |
| `FLOAT` | Floating point | `3.14` |
| `DOUBLE` | Double precision | `3.14159265` |
| `DECIMAL(p,s)` | Fixed-point | `DECIMAL(10,2)` = up to 99999999.99 |
| `VARCHAR(n)` | Variable-length string | `VARCHAR(255)` |
| `CHAR(n)` | Fixed-length string | `CHAR(10)` |
| `TEXT` | Long text | Large content |
| `BOOLEAN` | True/False | `TRUE` or `FALSE` |
| `DATE` | Date | `'2026-03-12'` |
| `DATETIME` | Date + Time | `'2026-03-12 08:30:00'` |
| `TIMESTAMP` | Auto-updating date+time | `CURRENT_TIMESTAMP` |
| `ENUM` | Predefined options | `ENUM('a','b','c')` |
| `BLOB` | Binary large object | Files, images |
| `JSON` | JSON data | `'{"key":"val"}'` |

---

## 4. CRUD Operations

### CREATE (INSERT)
```sql
-- Insert single row
INSERT INTO users (name, email, age) VALUES ('Aryan', 'aryan@test.com', 22);

-- Insert multiple rows
INSERT INTO users (name, email, age) VALUES
    ('Rahul', 'rahul@test.com', 25),
    ('Priya', 'priya@test.com', 23),
    ('Amit', 'amit@test.com', 28);
```

**In Node.js:**
```javascript
// Single insert
const [result] = await pool.query(
    'INSERT INTO users (name, email, age) VALUES (?, ?, ?)',
    ['Aryan', 'aryan@test.com', 22]
);
console.log('Inserted ID:', result.insertId);
console.log('Affected rows:', result.affectedRows);

// Bulk insert
const users = [['Rahul', 'rahul@test.com', 25], ['Priya', 'priya@test.com', 23]];
const [result] = await pool.query(
    'INSERT INTO users (name, email, age) VALUES ?',
    [users]
);
```

### READ (SELECT)
```sql
-- All columns
SELECT * FROM users;

-- Specific columns
SELECT name, email FROM users;

-- With conditions
SELECT * FROM users WHERE age > 18;
SELECT * FROM users WHERE name = 'Aryan';
SELECT * FROM users WHERE age BETWEEN 20 AND 30;
SELECT * FROM users WHERE role IN ('admin', 'moderator');
SELECT * FROM users WHERE email LIKE '%@gmail.com';    -- Ends with @gmail.com
SELECT * FROM users WHERE name LIKE 'A%';              -- Starts with A
SELECT * FROM users WHERE name LIKE '%yan%';            -- Contains 'yan'
SELECT * FROM users WHERE age IS NULL;
SELECT * FROM users WHERE age IS NOT NULL;

-- Sorting
SELECT * FROM users ORDER BY name ASC;
SELECT * FROM users ORDER BY created_at DESC;

-- Limit & Offset (Pagination)
SELECT * FROM users LIMIT 10;              -- First 10
SELECT * FROM users LIMIT 10 OFFSET 20;   -- Skip 20, get next 10 (page 3)

-- Distinct
SELECT DISTINCT role FROM users;

-- Count, Sum, Avg, Min, Max
SELECT COUNT(*) AS total FROM users;
SELECT AVG(age) AS avg_age FROM users;
SELECT SUM(salary) AS total_salary FROM users;
SELECT MIN(age) AS youngest, MAX(age) AS oldest FROM users;

-- Group By
SELECT role, COUNT(*) AS count FROM users GROUP BY role;
SELECT role, COUNT(*) AS count FROM users GROUP BY role HAVING count > 5;

-- Aliases
SELECT name AS user_name, email AS user_email FROM users;
```

**In Node.js:**
```javascript
// Simple query
const [rows] = await pool.query('SELECT * FROM users');

// Parameterized query (prevents SQL injection!)
const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [userId]);

// Multiple conditions
const [rows] = await pool.query(
    'SELECT * FROM users WHERE age > ? AND role = ? ORDER BY name LIMIT ?',
    [18, 'user', 10]
);
```

### UPDATE
```sql
UPDATE users SET name = 'New Name' WHERE id = 1;
UPDATE users SET age = age + 1 WHERE id = 1;
UPDATE users SET role = 'admin', is_active = TRUE WHERE email = 'aryan@test.com';
```

**In Node.js:**
```javascript
const [result] = await pool.query(
    'UPDATE users SET name = ?, age = ? WHERE id = ?',
    ['New Name', 25, 1]
);
console.log('Changed rows:', result.changedRows);
```

### DELETE
```sql
DELETE FROM users WHERE id = 1;
DELETE FROM users WHERE is_active = FALSE;
```

**In Node.js:**
```javascript
const [result] = await pool.query('DELETE FROM users WHERE id = ?', [userId]);
console.log('Deleted rows:', result.affectedRows);
```

---

## 5. JOINs (Complete)

```sql
-- Example tables:
-- users: id, name, email
-- orders: id, user_id, product, amount

-- INNER JOIN (only matching rows from both tables)
SELECT users.name, orders.product, orders.amount
FROM users
INNER JOIN orders ON users.id = orders.user_id;

-- LEFT JOIN (all users, even without orders)
SELECT users.name, orders.product
FROM users
LEFT JOIN orders ON users.id = orders.user_id;

-- RIGHT JOIN (all orders, even without matching user)
SELECT users.name, orders.product
FROM users
RIGHT JOIN orders ON users.id = orders.user_id;

-- Multiple JOINs
SELECT u.name, o.product, p.price
FROM users u
JOIN orders o ON u.id = o.user_id
JOIN products p ON o.product_id = p.id;

-- JOIN with conditions
SELECT u.name, o.product, o.amount
FROM users u
JOIN orders o ON u.id = o.user_id
WHERE o.amount > 500
ORDER BY o.amount DESC;
```

**In Node.js:**
```javascript
const [rows] = await pool.query(`
    SELECT u.name, o.product, o.amount 
    FROM users u 
    INNER JOIN orders o ON u.id = o.user_id 
    WHERE o.amount > ?
    ORDER BY o.amount DESC
`, [500]);
```

---

## 6. Subqueries

```sql
-- Subquery in WHERE
SELECT * FROM users WHERE id IN (
    SELECT user_id FROM orders WHERE amount > 1000
);

-- Subquery as a column
SELECT name,
    (SELECT COUNT(*) FROM orders WHERE orders.user_id = users.id) AS order_count
FROM users;

-- Subquery in FROM
SELECT avg_amount FROM (
    SELECT AVG(amount) AS avg_amount FROM orders GROUP BY user_id
) AS subquery;
```

---

## 7. Transactions

```javascript
const connection = await pool.getConnection();
try {
    await connection.beginTransaction();

    // Transfer money from user 1 to user 2
    await connection.query('UPDATE accounts SET balance = balance - ? WHERE id = ?', [100, 1]);
    await connection.query('UPDATE accounts SET balance = balance + ? WHERE id = ?', [100, 2]);

    // Insert transfer record
    await connection.query(
        'INSERT INTO transfers (from_id, to_id, amount) VALUES (?, ?, ?)',
        [1, 2, 100]
    );

    await connection.commit(); // All succeed → save
    console.log('Transaction successful');
} catch (error) {
    await connection.rollback(); // Any error → undo all
    console.error('Transaction failed:', error);
} finally {
    connection.release(); // Return connection to pool
}
```

---

## 8. Indexes & Constraints

```sql
-- Primary Key
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY
);

-- Foreign Key
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
-- ON DELETE CASCADE: When user is deleted, their orders are also deleted
-- ON DELETE SET NULL: Set user_id to NULL when user is deleted
-- ON DELETE RESTRICT: Prevent deleting user if orders exist

-- Unique Constraint
ALTER TABLE users ADD UNIQUE (email);

-- Index (for faster searches)
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_name_age ON users(name, age);  -- Compound index

-- Drop Index
DROP INDEX idx_users_email ON users;
```

---

## 9. Views

```sql
-- Create a view (virtual table)
CREATE VIEW active_users AS
SELECT id, name, email FROM users WHERE is_active = TRUE;

-- Use a view like a table
SELECT * FROM active_users;

-- Drop a view
DROP VIEW active_users;
```

---

## 10. Stored Procedures

```sql
-- Create Procedure
DELIMITER //
CREATE PROCEDURE GetUsersByRole(IN userRole VARCHAR(20))
BEGIN
    SELECT * FROM users WHERE role = userRole;
END //
DELIMITER ;

-- Call Procedure
CALL GetUsersByRole('admin');
```

**In Node.js:**
```javascript
const [rows] = await pool.query('CALL GetUsersByRole(?)', ['admin']);
```

---

## 11. Useful Functions

```sql
-- String Functions
SELECT UPPER(name), LOWER(email), LENGTH(name), CONCAT(name, ' - ', email) FROM users;
SELECT TRIM('  hello  '), SUBSTRING(name, 1, 3), REPLACE(name, 'old', 'new') FROM users;

-- Date Functions
SELECT NOW(), CURDATE(), CURTIME();
SELECT DATE_FORMAT(created_at, '%d-%m-%Y') FROM users;
SELECT DATEDIFF(NOW(), created_at) AS days_since_joined FROM users;
SELECT DATE_ADD(NOW(), INTERVAL 30 DAY);

-- Conditional
SELECT name, IF(age >= 18, 'Adult', 'Minor') AS category FROM users;
SELECT name,
    CASE role
        WHEN 'admin' THEN 'Administrator'
        WHEN 'user' THEN 'Regular User'
        ELSE 'Unknown'
    END AS role_label
FROM users;

-- COALESCE (first non-null value)
SELECT COALESCE(phone, email, 'No contact') AS contact FROM users;
```
