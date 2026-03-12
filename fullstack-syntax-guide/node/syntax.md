# Node.js Complete Syntax Guide

A comprehensive reference for Node.js core modules and patterns.

---

## 1. Setup: ESM in Node.js

To use modern `import/export` syntax, add this to `package.json`:
```json
{
    "type": "module"
}
```

Or use the `.mjs` file extension.

---

## 2. Console

```javascript
console.log('Standard output');
console.error('Error output');
console.warn('Warning');
console.table([{ name: 'Aryan', age: 22 }, { name: 'Rahul', age: 25 }]);
console.time('timer');
// ...some code...
console.timeEnd('timer');   // timer: 5.123ms
console.dir(object, { depth: null }); // Deep inspect object
```

---

## 3. Process Object

```javascript
// Environment Variables
process.env.NODE_ENV;                // 'development' or 'production'
process.env.PORT;                    // Custom env variable

// Command Line Arguments
process.argv;                        // [nodePath, filePath, ...args]
process.argv.slice(2);               // Only user arguments

// Working Directory
process.cwd();                       // Current working directory

// Exit
process.exit(0);                     // Success
process.exit(1);                     // Error

// Platform info
process.platform;                    // 'win32', 'linux', 'darwin'
process.version;                     // v20.x.x
```

---

## 4. File System (fs)

```javascript
import { readFile, writeFile, appendFile, unlink, mkdir, readdir, stat, rename, copyFile } from 'fs/promises';

// Read File
const data = await readFile('file.txt', 'utf-8');
console.log(data);

// Write File (overwrites)
await writeFile('output.txt', 'Hello World!', 'utf-8');

// Append to File
await appendFile('log.txt', 'New log entry\n', 'utf-8');

// Delete File
await unlink('temp.txt');

// Create Directory
await mkdir('new-folder', { recursive: true });

// Read Directory Contents
const files = await readdir('./my-folder');
console.log(files); // ['file1.txt', 'file2.txt']

// File Info (stats)
const info = await stat('file.txt');
console.log(info.size);         // Size in bytes
console.log(info.isFile());     // true
console.log(info.isDirectory()); // false
console.log(info.mtime);       // Last modified time

// Rename / Move File
await rename('old.txt', 'new.txt');

// Copy File
await copyFile('source.txt', 'dest.txt');
```

**Example: Read JSON file**
```javascript
import { readFile, writeFile } from 'fs/promises';

const rawData = await readFile('data.json', 'utf-8');
const jsonData = JSON.parse(rawData);
jsonData.newField = 'value';
await writeFile('data.json', JSON.stringify(jsonData, null, 2));
```

---

## 5. Path Module

```javascript
import path from 'path';

path.join('folder', 'subfolder', 'file.txt');    // 'folder/subfolder/file.txt'
path.resolve('folder', 'file.txt');               // Absolute path
path.basename('/home/user/file.txt');             // 'file.txt'
path.basename('/home/user/file.txt', '.txt');     // 'file' (without ext)
path.dirname('/home/user/file.txt');              // '/home/user'
path.extname('script.js');                        // '.js'
path.parse('/home/user/file.txt');
// { root: '/', dir: '/home/user', base: 'file.txt', ext: '.txt', name: 'file' }

// Get current file's directory (ESM equivalent of __dirname)
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
```

---

## 6. HTTP Module (raw Node.js server)

```javascript
import http from 'http';

const server = http.createServer((req, res) => {
    const { method, url } = req;

    if (method === 'GET' && url === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end('<h1>Hello World</h1>');
    } else if (method === 'GET' && url === '/api/data') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Hello API' }));
    } else {
        res.writeHead(404);
        res.end('Not Found');
    }
});

server.listen(3000, () => console.log('Server running on port 3000'));
```

---

## 7. Events Module

```javascript
import { EventEmitter } from 'events';

const emitter = new EventEmitter();

// Register listener
emitter.on('userJoined', (username) => {
    console.log(`${username} has joined!`);
});

// Register one-time listener
emitter.once('firstVisit', () => {
    console.log('Welcome for the first time!');
});

// Emit event
emitter.emit('userJoined', 'Aryan');
emitter.emit('firstVisit');

// Remove listener
const handler = () => console.log('hi');
emitter.on('greet', handler);
emitter.removeListener('greet', handler);
```

---

## 8. OS Module

```javascript
import os from 'os';

os.platform();      // 'win32', 'linux', 'darwin'
os.arch();          // 'x64', 'arm64'
os.cpus();          // Array of CPU core info
os.cpus().length;   // Number of CPU cores
os.totalmem();      // Total memory in bytes
os.freemem();       // Free memory in bytes
os.homedir();       // User home directory
os.hostname();      // System hostname
os.tmpdir();        // Temp directory path
os.uptime();        // System uptime in seconds
os.networkInterfaces(); // Network interfaces info
```

---

## 9. URL Module

```javascript
const myUrl = new URL('https://example.com:8080/path/page?name=aryan&age=22#section');

myUrl.href;           // Full URL string
myUrl.protocol;       // 'https:'
myUrl.hostname;       // 'example.com'
myUrl.port;           // '8080'
myUrl.pathname;       // '/path/page'
myUrl.search;         // '?name=aryan&age=22'
myUrl.hash;           // '#section'

// Search Params
myUrl.searchParams.get('name');     // 'aryan'
myUrl.searchParams.has('age');      // true
myUrl.searchParams.append('city', 'Mumbai');
myUrl.searchParams.delete('age');
myUrl.searchParams.forEach((val, key) => console.log(key, val));
```

---

## 10. Child Process

```javascript
import { exec, execSync, spawn } from 'child_process';

// exec — runs shell command, buffers output
exec('ls -la', (error, stdout, stderr) => {
    if (error) { console.error(error); return; }
    console.log(stdout);
});

// execSync — synchronous version
const output = execSync('node --version', { encoding: 'utf-8' });
console.log(output); // v20.x.x

// spawn — for streaming large output
const child = spawn('ping', ['localhost']);
child.stdout.on('data', (data) => console.log(`stdout: ${data}`));
child.stderr.on('data', (data) => console.error(`stderr: ${data}`));
child.on('close', (code) => console.log(`exited with code ${code}`));
```

---

## 11. Timers

```javascript
// setTimeout — run once after delay
const id1 = setTimeout(() => console.log('After 2s'), 2000);
clearTimeout(id1); // Cancel

// setInterval — run repeatedly
const id2 = setInterval(() => console.log('Every 1s'), 1000);
clearInterval(id2); // Cancel

// setImmediate — run after current I/O events
setImmediate(() => console.log('Immediately after I/O'));

// process.nextTick — run before any I/O (highest priority)
process.nextTick(() => console.log('Next tick'));
```

---

## 12. dotenv (Environment Variables)

```bash
npm install dotenv
```

**.env file:**
```
PORT=5000
DB_URI=mongodb://localhost:27017/mydb
SECRET_KEY=mysecretkey123
```

**Usage:**
```javascript
import 'dotenv/config';
// OR
import dotenv from 'dotenv';
dotenv.config();

console.log(process.env.PORT);       // 5000
console.log(process.env.DB_URI);     // mongodb://...
console.log(process.env.SECRET_KEY); // mysecretkey123
```
