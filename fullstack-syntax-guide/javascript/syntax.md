# JavaScript Modern Syntax (ES6+)

Focusing on ES Modules and asynchronous patterns.

## Variables & Scoping
```javascript
let count = 0;       // Block-scoped, reassignable
const MAX = 100;     // Block-scoped, read-only
```

## Arrow Functions
```javascript
const add = (a, b) => a + b;
const greet = name => `Hello, ${name}`;
```

## Destructuring & Spread
```javascript
const user = { name: 'Aryan', age: 25, role: 'Admin' };
const { name, ...rest } = user; // rest = { age: 25, role: 'Admin' }

const arr = [1, 2, 3];
const newArr = [...arr, 4, 5]; // Spread operator
```

## ES Modules (Latest)
```javascript
// file: math.js
export const multiply = (a, b) => a * b;
export default function subtract(a, b) { return a - b; }

// file: main.js
import subtract, { multiply } from './math.js';
```

## Promises & Async/Await
```javascript
const fetchData = async () => {
    try {
        const response = await fetch('https://api.example.com/data');
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};
```

## Template Literals
```javascript
const name = "World";
console.log(`Hello ${name}! 2 + 2 is ${2+2}`);
```
