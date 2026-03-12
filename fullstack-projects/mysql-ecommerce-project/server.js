import express from 'express';
import cors from 'cors';
import initDB from './config/initDB.js';
import productRoutes from './routes/productRoutes.js';
import customerRoutes from './routes/customerRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import { getDashboard } from './controllers/orderController.js';

const app = express();
const PORT = 5003;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/products', productRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/orders', orderRoutes);
app.get('/api/dashboard', getDashboard);

// Start Server
initDB().then(() => {
    app.listen(PORT, () => {
        console.log(`E-commerce Server running at http://localhost:${PORT}`);
    });
});
