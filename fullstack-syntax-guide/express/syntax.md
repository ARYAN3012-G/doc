# Express.js Complete Syntax Guide

A comprehensive reference for the Express web framework.

---

## 1. Basic Server Setup

```javascript
import express from 'express';
const app = express();
const PORT = process.env.PORT || 3000;

// Built-in Middleware
app.use(express.json());                          // Parse JSON body
app.use(express.urlencoded({ extended: true }));  // Parse form data
app.use(express.static('public'));                // Serve static files

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
```

---

## 2. Routing (All HTTP Methods)

```javascript
// GET — Retrieve data
app.get('/', (req, res) => {
    res.send('Hello World');
});

// POST — Create data
app.post('/api/users', (req, res) => {
    const { name, email } = req.body;
    res.status(201).json({ name, email });
});

// PUT — Replace entire resource
app.put('/api/users/:id', (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;
    res.json({ id, name, email });
});

// PATCH — Partial update
app.patch('/api/users/:id', (req, res) => {
    const { id } = req.params;
    res.json({ id, ...req.body });
});

// DELETE — Remove data
app.delete('/api/users/:id', (req, res) => {
    res.json({ message: `User ${req.params.id} deleted` });
});

// ALL — Match any HTTP method
app.all('/secret', (req, res) => {
    res.send('Accessing the secret section');
});
```

---

## 3. Request Object (req)

```javascript
app.get('/api/users/:id', (req, res) => {
    // URL Parameters
    req.params.id;            // '/api/users/42' → '42'

    // Query Strings
    // /api/users?page=2&limit=10
    req.query.page;           // '2'
    req.query.limit;          // '10'

    // Request Body (POST/PUT/PATCH)
    req.body;                 // { name: 'Aryan', email: 'a@b.com' }
    req.body.name;

    // Headers
    req.headers;              // All headers
    req.headers['content-type'];
    req.get('Authorization'); // Get specific header

    // Request Info
    req.method;               // 'GET', 'POST', etc.
    req.url;                  // '/api/users/42'
    req.path;                 // '/api/users/42'
    req.hostname;             // 'localhost'
    req.ip;                   // Client IP address
    req.protocol;             // 'http' or 'https'

    // Cookies (requires cookie-parser middleware)
    req.cookies;
});
```

---

## 4. Response Object (res)

```javascript
app.get('/example', (req, res) => {
    // Send responses
    res.send('Text response');                    // Auto content-type
    res.json({ message: 'JSON response' });       // JSON
    res.status(201).json({ id: 1 });              // Status + JSON
    res.sendStatus(204);                          // Status only (No Content)

    // HTML
    res.send('<h1>Hello HTML</h1>');

    // File
    res.sendFile('/absolute/path/to/file.html');
    res.download('/path/to/file.pdf');            // Triggers download

    // Redirect
    res.redirect('/new-url');
    res.redirect(301, '/permanent-new-url');

    // Set headers
    res.set('X-Custom-Header', 'value');
    res.type('json');                             // Set Content-Type

    // Cookies
    res.cookie('token', 'abc123', {
        httpOnly: true,
        maxAge: 3600000,  // 1 hour in ms
        secure: true
    });
    res.clearCookie('token');
});

// Status Codes Reference
// 200 - OK
// 201 - Created
// 204 - No Content
// 301 - Moved Permanently
// 302 - Found (Redirect)
// 400 - Bad Request
// 401 - Unauthorized
// 403 - Forbidden
// 404 - Not Found
// 500 - Internal Server Error
```

---

## 5. Express Router (Modular Routing)

```javascript
// routes/userRoutes.js
import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
    res.json({ message: 'All users' });
});

router.get('/:id', (req, res) => {
    res.json({ message: `User ${req.params.id}` });
});

router.post('/', (req, res) => {
    res.status(201).json(req.body);
});

router.put('/:id', (req, res) => {
    res.json({ id: req.params.id, ...req.body });
});

router.delete('/:id', (req, res) => {
    res.json({ message: `Deleted user ${req.params.id}` });
});

export default router;

// server.js
import userRoutes from './routes/userRoutes.js';
app.use('/api/users', userRoutes);
// Now:
// GET    /api/users       → all users
// GET    /api/users/42    → user 42
// POST   /api/users       → create user
// PUT    /api/users/42    → update user 42
// DELETE /api/users/42    → delete user 42
```

---

## 6. Middleware

### Built-in Middleware
```javascript
app.use(express.json());                          // Parse JSON request body
app.use(express.urlencoded({ extended: true }));  // Parse form data
app.use(express.static('public'));                // Serve static files from 'public/' folder
```

### Custom Middleware (Application-Level)
```javascript
// Logger middleware — runs on EVERY request
const logger = (req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();  // MUST call next() to pass to next middleware/route
};
app.use(logger);
```

### Route-Level Middleware
```javascript
// Auth check — only applied to specific routes
const authenticate = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }
    // verify token logic here...
    next();
};

// Apply to single route
app.get('/api/profile', authenticate, (req, res) => {
    res.json({ user: 'Aryan' });
});

// Apply to all routes in a router
router.use(authenticate);
```

### Third-Party Middleware
```javascript
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';

app.use(cors());                // Enable Cross-Origin requests
app.use(morgan('dev'));         // HTTP request logger
app.use(helmet());             // Security headers
```

---

## 7. Error Handling Middleware

```javascript
// Error-handling middleware has 4 parameters: (err, req, res, next)
// MUST be defined AFTER all routes

// Custom error class
class AppError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
    }
}

// Throw errors in routes
app.get('/api/users/:id', (req, res, next) => {
    try {
        const user = findUser(req.params.id);
        if (!user) throw new AppError(404, 'User not found');
        res.json(user);
    } catch (error) {
        next(error);  // Pass error to error handler
    }
});

// Async error wrapper (avoids try-catch in every route)
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

app.get('/api/data', asyncHandler(async (req, res) => {
    const data = await fetchData();  // If this throws, error handler catches it
    res.json(data);
}));

// Global Error Handler (place at the END of all routes)
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    console.error(err.stack);
    res.status(statusCode).json({
        success: false,
        error: message
    });
});

// 404 Handler (place BEFORE error handler)
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Route not found' });
});
```

---

## 8. File Uploads with Multer

```bash
npm install multer
```

```javascript
import multer from 'multer';

// Storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
    }
});

// File filter
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);   // Accept
    } else {
        cb(new Error('Only images are allowed'), false); // Reject
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB max
});

// Single file upload
app.post('/upload', upload.single('avatar'), (req, res) => {
    console.log(req.file);  // { filename, path, mimetype, size, ... }
    res.json({ file: req.file.filename });
});

// Multiple files
app.post('/upload-many', upload.array('photos', 5), (req, res) => {
    console.log(req.files); // Array of file objects
    res.json({ count: req.files.length });
});
```

---

## 9. CORS Configuration

```bash
npm install cors
```

```javascript
import cors from 'cors';

// Allow all origins
app.use(cors());

// Allow specific origin
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// Multiple origins
app.use(cors({
    origin: ['http://localhost:3000', 'https://myapp.com']
}));
```

---

## 10. Complete Express App Structure

```
project/
├── server.js           # Entry point
├── package.json
├── .env
├── routes/
│   ├── userRoutes.js
│   └── productRoutes.js
├── controllers/
│   ├── userController.js
│   └── productController.js
├── models/
│   ├── User.js
│   └── Product.js
├── middleware/
│   ├── auth.js
│   └── errorHandler.js
├── config/
│   └── db.js
└── public/             # Static files (HTML, CSS, images)
```

**Example: server.js**
```javascript
import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```
