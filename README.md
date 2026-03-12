# Full Stack Syntax Guide & Projects

A comprehensive, in-depth reference for full-stack development with modern syntax and practical projects.

## 📁 Syntax Guides (`fullstack-syntax-guide/`)

| Folder | Topics Covered |
|:---|:---|
| [HTML](./fullstack-syntax-guide/html/syntax.md) | Structure, text, links, lists, tables, forms (all input types), semantic elements, media, global attributes, entities |
| [CSS](./fullstack-syntax-guide/css/syntax.md) | All selectors, box model, display, positioning, CSS variables, Flexbox, Grid, typography, colors, shadows, transitions, animations, transforms, responsive design, modern reset |
| [JavaScript](./fullstack-syntax-guide/javascript/syntax.md) | Variables, types, strings, numbers, arrays, objects, functions, destructuring, spread/rest, promises, async/await, ESM, classes, error handling, DOM, Fetch API, localStorage, Map/Set |
| [Node.js](./fullstack-syntax-guide/node/syntax.md) | ESM setup, console, process, fs (promises), path, HTTP server, events, OS, URL, child process, timers, dotenv |
| [Express](./fullstack-syntax-guide/express/syntax.md) | Server setup, all HTTP methods, req/res objects, Router, all middleware types, error handling, file uploads (Multer), CORS, project structure |
| [Mongoose](./fullstack-syntax-guide/mongoose/syntax.md) | Connection steps (local + Atlas), schema types + validators, model creation, all CRUD + query operators, population/joins, instance/static methods, middleware hooks, indexing |
| [MySQL](./fullstack-syntax-guide/mysql/syntax.md) | Connection (simple + pool), DDL/DML, all data types, CRUD with Node.js, all JOINs, subqueries, transactions, indexes, constraints, views, stored procedures, functions |

## 🚀 Projects (`fullstack-projects/`)

| Project | Stack | Key Concepts |
|:---|:---|:---|
| [Todo App](./fullstack-projects/mongoose-project/) | Express + Mongoose | Schema validation, CRUD, filters, priority, toggle, stats |
| [User Management](./fullstack-projects/mysql-project/) | Express + MySQL | CRUD, search, role filter, toggle active, stats |
| [E-Commerce](./fullstack-projects/mysql-ecommerce-project/) | Express + MySQL | Multiple tables, Foreign Keys, JOINs, Transactions, Aggregation, Dashboard |

## ▶️ How to Run

```bash
# Navigate to any project folder
cd fullstack-projects/mongoose-project

# Install dependencies
npm install

# Start the server
node server.js

# Open index.html in your browser
```

### Prerequisites
- **Node.js** installed
- **MongoDB** running locally (for Mongoose project)
- **MySQL** running locally (for MySQL projects) with password: `aryan3012`
- Create databases before running: `CREATE DATABASE user_management;` and `CREATE DATABASE ecommerce_db;`
