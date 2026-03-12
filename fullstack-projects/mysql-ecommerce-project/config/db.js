import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'aryan3012',
    database: 'ecommerce_db',
    waitForConnections: true,
    connectionLimit: 10
});

export default pool;
