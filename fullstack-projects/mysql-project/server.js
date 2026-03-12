import express from 'express';
import cors from 'cors';
import { initDB } from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import { getStats } from './controllers/userController.js';

const app = express();
const PORT = 5002;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.get('/api/stats', getStats);

// Start Server
initDB().then(() => {
    app.listen(PORT, () => {
        console.log(`MySQL User Management Server running at http://localhost:${PORT}`);
    });
});
