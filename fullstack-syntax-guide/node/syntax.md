# Node.js & Express Syntax Guide

Modern Node.js (ESM) and Express framework.

## Node.js ESM Setup
To use ESM (`import/export`), add `"type": "module"` to `package.json`.

## Express Basic Server
```javascript
import express from 'express';
const app = express();
const PORT = 3000;

// Middleware for JSON
app.use(express.json());

// Basic Route
app.get('/', (req, res) => {
    res.send('Hello World');
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
```

## Routing with Express Router
```javascript
// routes/userRoutes.js
import express from 'express';
const router = express.Router();

router.get('/:id', (req, res) => {
    const id = req.params.id; // URL parameter
    const query = req.query.search; // Query string ?search=...
    res.json({ id, query });
});

export default router;

// server.js
import userRoutes from './routes/userRoutes.js';
app.use('/users', userRoutes);
```

## Common Middleware
```javascript
// Custom Middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Built-in Middleware
app.use(express.static('public')); // Serve static files
```
