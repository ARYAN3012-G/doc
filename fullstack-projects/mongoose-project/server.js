import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();
const PORT = 5001;

// ─── Middleware ────────────────────────────────
app.use(cors());
app.use(express.json());

// ─── MongoDB Connection ───────────────────────
const connectDB = async () => {
    try {
        const conn = await mongoose.connect('mongodb://127.0.0.1:27017/todo-project');
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`MongoDB Connection Error: ${error.message}`);
        process.exit(1);
    }
};

// ─── Schema & Model ───────────────────────────
const todoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        minlength: [1, 'Title cannot be empty'],
        maxlength: [200, 'Title too long']
    },
    description: {
        type: String,
        trim: true,
        default: ''
    },
    completed: {
        type: Boolean,
        default: false
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    }
}, {
    timestamps: true // adds createdAt & updatedAt
});

const Todo = mongoose.model('Todo', todoSchema);

// ─── Routes ───────────────────────────────────

// GET all todos (with optional filter)
app.get('/api/todos', async (req, res) => {
    try {
        const { completed, priority, sort } = req.query;
        const filter = {};
        if (completed !== undefined) filter.completed = completed === 'true';
        if (priority) filter.priority = priority;

        const sortOrder = sort === 'oldest' ? { createdAt: 1 } : { createdAt: -1 };
        const todos = await Todo.find(filter).sort(sortOrder);
        res.json({ success: true, count: todos.length, data: todos });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET single todo
app.get('/api/todos/:id', async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);
        if (!todo) return res.status(404).json({ success: false, error: 'Todo not found' });
        res.json({ success: true, data: todo });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// POST create todo
app.post('/api/todos', async (req, res) => {
    try {
        const todo = await Todo.create(req.body);
        res.status(201).json({ success: true, data: todo });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// PUT update todo
app.put('/api/todos/:id', async (req, res) => {
    try {
        const todo = await Todo.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!todo) return res.status(404).json({ success: false, error: 'Todo not found' });
        res.json({ success: true, data: todo });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// PATCH toggle completed
app.patch('/api/todos/:id/toggle', async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);
        if (!todo) return res.status(404).json({ success: false, error: 'Todo not found' });
        todo.completed = !todo.completed;
        await todo.save();
        res.json({ success: true, data: todo });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// DELETE single todo
app.delete('/api/todos/:id', async (req, res) => {
    try {
        const todo = await Todo.findByIdAndDelete(req.params.id);
        if (!todo) return res.status(404).json({ success: false, error: 'Todo not found' });
        res.json({ success: true, message: 'Todo deleted' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// DELETE all completed todos
app.delete('/api/todos', async (req, res) => {
    try {
        const result = await Todo.deleteMany({ completed: true });
        res.json({ success: true, message: `${result.deletedCount} completed todos deleted` });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ─── Stats endpoint ───────────────────────────
app.get('/api/stats', async (req, res) => {
    try {
        const total = await Todo.countDocuments();
        const completed = await Todo.countDocuments({ completed: true });
        const pending = total - completed;
        const highPriority = await Todo.countDocuments({ priority: 'high', completed: false });
        res.json({ success: true, data: { total, completed, pending, highPriority } });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ─── Start Server ─────────────────────────────
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Mongoose Todo Server running at http://localhost:${PORT}`);
    });
});
