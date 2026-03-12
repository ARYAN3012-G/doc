# JavaScript Complete Syntax Guide (ES6+)

A comprehensive reference for modern JavaScript with examples for every concept.

---

## 1. Variables & Data Types

```javascript
// Variables (let & const — NEVER use var in modern JS)
let count = 0;            // Block-scoped, can be reassigned
const MAX = 100;          // Block-scoped, cannot be reassigned
const user = { name: 'A' }; // Object reference is const, properties can change
user.name = 'B';          // ✅ This works

// Data Types
const str = "Hello";          // String
const num = 42;               // Number
const float = 3.14;           // Number (no separate float type)
const big = 9007199254740991n; // BigInt
const bool = true;            // Boolean
const nothing = null;         // Null (intentional absence)
let x;                        // Undefined (unassigned)
const sym = Symbol('id');     // Symbol (unique identifier)
const obj = { key: 'value' }; // Object
const arr = [1, 2, 3];       // Array (technically an object)

// Type checking
typeof "hello"    // "string"
typeof 42         // "number"
typeof true       // "boolean"
typeof undefined  // "undefined"
typeof null       // "object" (historical bug)
typeof {}         // "object"
typeof []         // "object"
Array.isArray([]) // true (correct way to check array)
```

---

## 2. Strings

```javascript
const name = "Aryan";

// Template Literals (backticks)
const greeting = `Hello, ${name}! You have ${5 + 3} messages.`;
const multiLine = `
    Line 1
    Line 2
    Line 3
`;

// String Methods
name.length;                  // 5
name.toUpperCase();           // "ARYAN"
name.toLowerCase();           // "aryan"
name.charAt(0);               // "A"
name[0];                      // "A"
name.indexOf('y');            // 2
name.includes('ry');          // true
name.startsWith('Ar');        // true
name.endsWith('an');          // true
name.slice(1, 3);             // "ry" (start, end - exclusive)
name.substring(1, 3);         // "ry"
"  hello  ".trim();           // "hello"
"  hello  ".trimStart();      // "hello  "
"  hello  ".trimEnd();        // "  hello"
"hello".repeat(3);            // "hellohellohello"
"hello world".replace('world', 'JS');  // "hello JS"
"a,b,c".split(',');           // ["a", "b", "c"]
"hello".padStart(10, '*');    // "*****hello"
"hello".padEnd(10, '-');      // "hello-----"
```

---

## 3. Numbers & Math

```javascript
// Number Methods
Number.parseInt("42px");      // 42
Number.parseFloat("3.14em");  // 3.14
Number.isInteger(5);          // true
Number.isNaN(NaN);            // true
(3.14159).toFixed(2);         // "3.14" (string)

// Math Object
Math.PI;                      // 3.14159...
Math.round(4.5);              // 5
Math.ceil(4.1);               // 5 (round up)
Math.floor(4.9);              // 4 (round down)
Math.trunc(4.9);              // 4 (remove decimal)
Math.abs(-5);                 // 5
Math.max(1, 5, 3);            // 5
Math.min(1, 5, 3);            // 1
Math.pow(2, 3);               // 8
Math.sqrt(16);                // 4
Math.random();                // 0 to 0.999...
Math.floor(Math.random() * 10) + 1; // Random 1-10
```

---

## 4. Arrays (Complete)

```javascript
const fruits = ['apple', 'banana', 'cherry'];

// Adding & Removing
fruits.push('date');          // Add to end → ['apple','banana','cherry','date']
fruits.pop();                 // Remove from end → returns 'date'
fruits.unshift('avocado');    // Add to start
fruits.shift();               // Remove from start
fruits.splice(1, 1);         // Remove 1 item at index 1
fruits.splice(1, 0, 'blueberry'); // Insert at index 1 without removing

// Searching
fruits.indexOf('banana');     // Index or -1
fruits.includes('cherry');    // true/false
fruits.find(f => f.startsWith('b'));    // First match or undefined
fruits.findIndex(f => f === 'cherry'); // Index of first match or -1

// Iteration
fruits.forEach((fruit, index) => console.log(index, fruit));

// Transformation (returns NEW array, doesn't modify original)
const upper = fruits.map(f => f.toUpperCase());
const long = fruits.filter(f => f.length > 5);
const total = [1,2,3,4].reduce((sum, num) => sum + num, 0); // 10
const sorted = [...fruits].sort();          // Alphabetical
const reversed = [...fruits].reverse();

// Check conditions
[1,2,3].every(n => n > 0);   // true (ALL must pass)
[1,2,3].some(n => n > 2);    // true (at least ONE passes)

// Flat & FlatMap
[[1,2],[3,4]].flat();         // [1,2,3,4]
[1,2,3].flatMap(x => [x, x*2]); // [1,2, 2,4, 3,6]

// Spread & Destructuring
const copy = [...fruits];                   // Shallow copy
const [first, second, ...rest] = fruits;   // Destructure
const merged = [...arr1, ...arr2];          // Merge arrays

// Array.from
Array.from("hello");          // ['h','e','l','l','o']
Array.from({length: 5}, (_, i) => i); // [0,1,2,3,4]
```

---

## 5. Objects (Complete)

```javascript
// Object creation
const user = {
    name: 'Aryan',
    age: 22,
    'full-name': 'Aryan Kumar',   // Key with special characters
    greet() {                      // Method shorthand
        return `Hi, I'm ${this.name}`;
    }
};

// Access
user.name;               // Dot notation
user['full-name'];       // Bracket notation (required for special keys)

// Add/Modify/Delete
user.email = 'a@b.com';  // Add
user.age = 23;            // Modify
delete user.age;          // Delete

// Object Methods
Object.keys(user);        // ['name', 'age', 'email', ...]
Object.values(user);      // ['Aryan', 23, 'a@b.com', ...]
Object.entries(user);     // [['name','Aryan'], ['age',23], ...]
Object.assign({}, user);  // Shallow copy
Object.freeze(user);      // Prevent any modifications
Object.seal(user);        // Prevent add/delete, but allow modify

// Destructuring
const { name, age, email = 'N/A' } = user;  // With default value
const { name: userName } = user;             // Rename variable

// Spread
const updated = { ...user, age: 25 };        // Copy and override
const merged = { ...obj1, ...obj2 };          // Merge objects

// Computed property names
const key = 'color';
const config = { [key]: 'blue' }; // { color: 'blue' }

// Optional chaining
const street = user?.address?.street; // undefined (no error if missing)

// Nullish coalescing
const displayName = user.nickname ?? 'Anonymous'; // Use right side if left is null/undefined
```

---

## 6. Functions

```javascript
// Function Declaration (hoisted)
function add(a, b) {
    return a + b;
}

// Function Expression (NOT hoisted)
const multiply = function(a, b) {
    return a * b;
};

// Arrow Functions
const subtract = (a, b) => a - b;          // Implicit return
const greet = name => `Hello, ${name}`;    // Single param, no parens needed
const getUser = () => ({ name: 'Aryan' }); // Return object (wrap in parens)
const doStuff = (a, b) => {               // Multi-line needs braces + return
    const result = a + b;
    return result;
};

// Default Parameters
const greetUser = (name = 'Guest') => `Hello, ${name}`;

// Rest Parameters (collect remaining args)
const sum = (...numbers) => numbers.reduce((a, b) => a + b, 0);
sum(1, 2, 3, 4); // 10

// IIFE (Immediately Invoked Function Expression)
(function() {
    console.log('Runs immediately!');
})();

// Higher-Order Functions (functions that take/return functions)
const createMultiplier = (factor) => (num) => num * factor;
const double = createMultiplier(2);
double(5); // 10
```

---

## 7. Destructuring (Advanced)

```javascript
// Array Destructuring
const [a, b, c] = [10, 20, 30];
const [first, , third] = [1, 2, 3];        // Skip elements
const [head, ...tail] = [1, 2, 3, 4];      // head=1, tail=[2,3,4]
const [x = 0, y = 0] = [5];                // Defaults: x=5, y=0

// Swap variables
let m = 1, n = 2;
[m, n] = [n, m]; // m=2, n=1

// Object Destructuring
const { name, age } = { name: 'Aryan', age: 22 };
const { name: userName, age: userAge } = user;   // Rename
const { address: { city } = {} } = user;          // Nested with default

// Function Parameter Destructuring
function printUser({ name, age, role = 'User' }) {
    console.log(`${name}, ${age}, ${role}`);
}
printUser({ name: 'Aryan', age: 22 });
```

---

## 8. Spread & Rest Operators

```javascript
// Spread (...) — Expands iterable
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const combined = [...arr1, ...arr2];   // [1,2,3,4,5,6]

const obj1 = { a: 1 };
const obj2 = { b: 2 };
const merged = { ...obj1, ...obj2 };   // { a: 1, b: 2 }

// Spread in function calls
Math.max(...[1, 5, 3]); // 5

// Rest (...) — Collects into array/object
const [first, ...remaining] = [1, 2, 3, 4]; // first=1, remaining=[2,3,4]
const { id, ...otherProps } = { id: 1, name: 'A', age: 22 };
// id=1, otherProps={name:'A', age:22}

function logAll(first, ...rest) {
    console.log(first);  // First argument
    console.log(rest);   // Array of remaining
}
```

---

## 9. Promises & Async/Await

```javascript
// Creating a Promise
const myPromise = new Promise((resolve, reject) => {
    const success = true;
    if (success) {
        resolve('Data loaded!');
    } else {
        reject('Error occurred!');
    }
});

// Consuming a Promise
myPromise
    .then(data => console.log(data))
    .catch(err => console.error(err))
    .finally(() => console.log('Done'));

// Async/Await (cleaner syntax for Promises)
const fetchData = async () => {
    try {
        const response = await fetch('https://api.example.com/data');
        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error('Fetch failed:', error.message);
    }
};

// Promise.all — Run in parallel, wait for ALL
const [users, posts] = await Promise.all([
    fetch('/api/users').then(r => r.json()),
    fetch('/api/posts').then(r => r.json())
]);

// Promise.allSettled — Run all, get results even if some fail
const results = await Promise.allSettled([promise1, promise2, promise3]);
results.forEach(r => {
    if (r.status === 'fulfilled') console.log(r.value);
    else console.log(r.reason);
});

// Promise.race — First to settle wins
const fastest = await Promise.race([fetch(url1), fetch(url2)]);
```

---

## 10. ES Modules (ESM)

```javascript
// Named Export (can have multiple)
// file: utils.js
export const add = (a, b) => a + b;
export const subtract = (a, b) => a - b;
export function multiply(a, b) { return a * b; }

// Default Export (one per file)
// file: User.js
export default class User {
    constructor(name) { this.name = name; }
}

// Named Import
import { add, subtract } from './utils.js';

// Import with rename
import { add as sum } from './utils.js';

// Default Import
import User from './User.js';

// Import all
import * as MathUtils from './utils.js';
MathUtils.add(1, 2);

// Dynamic Import (lazy loading)
const module = await import('./heavy-module.js');
module.doSomething();
```

> **Note:** To use ESM in Node.js, add `"type": "module"` to `package.json`.

---

## 11. Classes

```javascript
class Animal {
    // Constructor
    constructor(name, sound) {
        this.name = name;
        this.sound = sound;
    }

    // Method
    speak() {
        return `${this.name} says ${this.sound}`;
    }

    // Getter
    get info() {
        return `${this.name} (${this.sound})`;
    }

    // Setter
    set nickname(value) {
        this._nickname = value;
    }

    // Static method (called on class, not instance)
    static create(name, sound) {
        return new Animal(name, sound);
    }
}

// Inheritance
class Dog extends Animal {
    constructor(name, breed) {
        super(name, 'Woof'); // Call parent constructor
        this.breed = breed;
    }

    fetch(item) {
        return `${this.name} fetches the ${item}`;
    }
}

// Usage
const dog = new Dog('Buddy', 'Labrador');
dog.speak();   // "Buddy says Woof"
dog.fetch('ball'); // "Buddy fetches the ball"
console.log(dog instanceof Dog);    // true
console.log(dog instanceof Animal); // true
```

---

## 12. Error Handling

```javascript
// try...catch...finally
try {
    const data = JSON.parse('invalid json');
} catch (error) {
    console.error('Error name:', error.name);       // SyntaxError
    console.error('Error message:', error.message);  // Unexpected token...
    console.error('Stack trace:', error.stack);
} finally {
    console.log('This always runs');
}

// Throwing custom errors
function divide(a, b) {
    if (b === 0) throw new Error('Division by zero is not allowed');
    return a / b;
}

// Custom Error Class
class ValidationError extends Error {
    constructor(field, message) {
        super(message);
        this.name = 'ValidationError';
        this.field = field;
    }
}

throw new ValidationError('email', 'Invalid email format');
```

---

## 13. DOM Manipulation

```javascript
// Selecting Elements
document.getElementById('myId');
document.querySelector('.myClass');          // First match
document.querySelectorAll('.myClass');       // All matches (NodeList)
document.getElementsByClassName('myClass');  // HTMLCollection
document.getElementsByTagName('p');

// Creating & Inserting Elements
const div = document.createElement('div');
div.textContent = 'Hello!';
div.innerHTML = '<strong>Hello!</strong>';
div.className = 'card';
div.id = 'myCard';
div.setAttribute('data-id', '42');
div.style.color = 'blue';
div.classList.add('active');
div.classList.remove('hidden');
div.classList.toggle('dark-mode');
div.classList.contains('active');   // true/false

document.body.appendChild(div);
parent.insertBefore(newNode, referenceNode);
parent.removeChild(child);
element.remove();   // Modern way

// Event Listeners
const btn = document.querySelector('#myBtn');
btn.addEventListener('click', (event) => {
    event.preventDefault();     // Prevent default action
    event.stopPropagation();   // Stop bubbling
    console.log(event.target); // Element that fired event
    console.log(event.type);   // 'click'
});

// Common Events: click, dblclick, mouseover, mouseout, keydown, keyup,
//                input, change, submit, focus, blur, scroll, load, resize

// Event Delegation (attach to parent, handle child events)
document.querySelector('#list').addEventListener('click', (e) => {
    if (e.target.matches('li')) {
        console.log('Clicked:', e.target.textContent);
    }
});
```

---

## 14. Fetch API

```javascript
// GET Request
const response = await fetch('https://api.example.com/users');
const data = await response.json();

// POST Request
const newUser = await fetch('https://api.example.com/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Aryan', email: 'a@b.com' })
});

// PUT Request
await fetch('https://api.example.com/users/1', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Updated Name' })
});

// DELETE Request
await fetch('https://api.example.com/users/1', { method: 'DELETE' });
```

---

## 15. Local Storage & Session Storage

```javascript
// localStorage — persists even after browser close
localStorage.setItem('theme', 'dark');
const theme = localStorage.getItem('theme');   // 'dark'
localStorage.removeItem('theme');
localStorage.clear();                          // Remove all

// Store objects (must stringify/parse)
localStorage.setItem('user', JSON.stringify({ name: 'Aryan', age: 22 }));
const user = JSON.parse(localStorage.getItem('user'));

// sessionStorage — cleared when tab/browser closes
sessionStorage.setItem('token', 'abc123');
sessionStorage.getItem('token');
```

---

## 16. Map, Set, WeakMap, WeakSet

```javascript
// Map — key-value pairs, keys can be ANY type
const map = new Map();
map.set('name', 'Aryan');
map.set(42, 'answer');
map.get('name');            // 'Aryan'
map.has('name');            // true
map.delete('name');
map.size;                   // Number of entries
map.forEach((val, key) => console.log(key, val));
for (const [key, val] of map) { console.log(key, val); }

// Set — unique values only
const set = new Set([1, 2, 3, 3, 4]); // {1, 2, 3, 4}
set.add(5);
set.has(3);     // true
set.delete(3);
set.size;       // 4

// Remove duplicates from array
const unique = [...new Set([1, 1, 2, 3, 3])]; // [1, 2, 3]
```

---

## 17. Useful Patterns

```javascript
// Ternary Operator
const status = age >= 18 ? 'Adult' : 'Minor';

// Short-circuit evaluation
const name = user?.name || 'Anonymous';
const config = userConfig ?? defaultConfig;  // Nullish coalescing

// Optional chaining
const city = user?.address?.city;          // undefined if any part is null
const first = arr?.[0];                    // Safe array access
const result = obj?.method?.();            // Safe function call

// for...of (arrays, strings, maps, sets)
for (const item of [1, 2, 3]) { console.log(item); }
for (const char of 'hello') { console.log(char); }

// for...in (object keys)
for (const key in { a: 1, b: 2 }) { console.log(key); }
```
