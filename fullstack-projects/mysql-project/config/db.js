import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'aryan3012',
    database: 'user_management',
    waitForConnections: true,
    connectionLimit: 10
});

// Test connection
const testConnection = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('MySQL Connected Successfully ✓');
        connection.release();
    } catch (error) {
        console.error('MySQL Connection Failed:', error.message);
        process.exit(1);
    }
};

// Initialize table
const initDB = async () => {
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
    console.log('User table initialized ✓');
};

export { pool, testConnection, initDB };
