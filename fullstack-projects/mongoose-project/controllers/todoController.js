import Todo from '../models/Todo.js';

// GET all todos
export const getAllTodos = async (req, res) => {
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
};

// GET single todo
export const getTodoById = async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);
        if (!todo) return res.status(404).json({ success: false, error: 'Todo not found' });
        res.json({ success: true, data: todo });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// POST create todo
export const createTodo = async (req, res) => {
    try {
        const todo = await Todo.create(req.body);
        res.status(201).json({ success: true, data: todo });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// PUT update todo
export const updateTodo = async (req, res) => {
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
};

// PATCH toggle completed
export const toggleTodo = async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);
        if (!todo) return res.status(404).json({ success: false, error: 'Todo not found' });
        todo.completed = !todo.completed;
        await todo.save();
        res.json({ success: true, data: todo });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// DELETE single todo
export const deleteTodo = async (req, res) => {
    try {
        const todo = await Todo.findByIdAndDelete(req.params.id);
        if (!todo) return res.status(404).json({ success: false, error: 'Todo not found' });
        res.json({ success: true, message: 'Todo deleted' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// DELETE all completed
export const clearCompleted = async (req, res) => {
    try {
        const result = await Todo.deleteMany({ completed: true });
        res.json({ success: true, message: `${result.deletedCount} completed todos deleted` });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// GET stats
export const getStats = async (req, res) => {
    try {
        const total = await Todo.countDocuments();
        const completed = await Todo.countDocuments({ completed: true });
        const pending = total - completed;
        const highPriority = await Todo.countDocuments({ priority: 'high', completed: false });
        res.json({ success: true, data: { total, completed, pending, highPriority } });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
