import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import todoRoutes from './routes/todoRoutes.js';
import { getStats } from './controllers/todoController.js';

const app = express();
const PORT = 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/todos', todoRoutes);
app.get('/api/stats', getStats);

// Start Server
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Mongoose Todo Server running at http://localhost:${PORT}`);
    });
});
