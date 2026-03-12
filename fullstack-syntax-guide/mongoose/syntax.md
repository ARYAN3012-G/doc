# Mongoose (MongoDB) Complete Syntax Guide

A comprehensive reference for MongoDB integration using Mongoose.

---

## 1. Installation

```bash
npm install mongoose
```

---

## 2. Connection Steps (Detailed)

### Basic Connection
```javascript
import mongoose from 'mongoose';

mongoose.connect('mongodb://127.0.0.1:27017/my_database')
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('Connection Error:', err));
```

### Production-Ready Connection (Recommended)
```javascript
import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/my_database');
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;
```

### Connection with Options
```javascript
await mongoose.connect('mongodb://127.0.0.1:27017/my_database', {
    // These are the most common options:
    // (Most are now defaults in Mongoose 8+)
});
```

### MongoDB Atlas (Cloud) Connection
```javascript
// Connection string from MongoDB Atlas dashboard
const MONGO_URI = 'mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/my_database?retryWrites=true&w=majority';
await mongoose.connect(MONGO_URI);
```

### Connection Events
```javascript
mongoose.connection.on('connected', () => console.log('Mongoose connected'));
mongoose.connection.on('error', (err) => console.error('Mongoose error:', err));
mongoose.connection.on('disconnected', () => console.log('Mongoose disconnected'));

// Graceful shutdown
process.on('SIGINT', async () => {
    await mongoose.connection.close();
    process.exit(0);
});
```

---

## 3. Schema Definition (All Types & Validators)

```javascript
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    // String
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        minlength: [2, 'Name must be at least 2 characters'],
        maxlength: [50, 'Name cannot exceed 50 characters']
    },

    // String with enum
    role: {
        type: String,
        enum: ['user', 'admin', 'moderator'],
        default: 'user'
    },

    // Email with regex validation
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
    },

    // Number
    age: {
        type: Number,
        min: [0, 'Age cannot be negative'],
        max: [120, 'Age too high']
    },

    // Boolean
    isActive: {
        type: Boolean,
        default: true
    },

    // Date
    createdAt: {
        type: Date,
        default: Date.now
    },

    // Array of Strings
    hobbies: [String],

    // Array of Objects
    addresses: [{
        street: String,
        city: String,
        state: String,
        pincode: Number
    }],

    // Nested Object
    profile: {
        bio: { type: String, default: '' },
        avatar: { type: String, default: 'default.png' }
    },

    // Reference to another model (for populate)
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }]
}, {
    timestamps: true  // Adds createdAt & updatedAt automatically
});
```

### Schema Types Reference
| Type | Example |
|:---|:---|
| `String` | `'Hello'` |
| `Number` | `42` |
| `Boolean` | `true` |
| `Date` | `new Date()` |
| `Buffer` | Binary data |
| `ObjectId` | Reference to another document |
| `Array` | `[1, 2, 3]` |
| `Mixed` | Any type (`mongoose.Schema.Types.Mixed`) |
| `Map` | Key-value pairs |
| `Decimal128` | High-precision decimals |

---

## 4. Model Creation

```javascript
const User = mongoose.model('User', userSchema);
export default User;
// This creates/uses a collection called 'users' (lowercase, pluralized)
```

---

## 5. CRUD Operations (Complete)

### CREATE
```javascript
// Method 1: create()
const user = await User.create({
    name: 'Aryan',
    email: 'aryan@example.com',
    age: 22
});

// Method 2: new + save()
const user2 = new User({ name: 'Rahul', email: 'rahul@example.com' });
await user2.save();

// Method 3: insertMany (bulk)
await User.insertMany([
    { name: 'User1', email: 'u1@test.com' },
    { name: 'User2', email: 'u2@test.com' }
]);
```

### READ (Find)
```javascript
// Find all
const users = await User.find();

// Find with conditions
const activeUsers = await User.find({ isActive: true });

// Find one
const user = await User.findOne({ email: 'aryan@example.com' });

// Find by ID
const user = await User.findById('64a1b2c3d4e5f6a7b8c9d0e1');

// Select specific fields (projection)
const names = await User.find().select('name email -_id');
// + includes, - excludes

// Sorting
const sorted = await User.find().sort({ createdAt: -1 }); // -1 = descending
const sorted2 = await User.find().sort('name');            // ascending

// Pagination
const page = 1;
const limit = 10;
const users = await User.find()
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ createdAt: -1 });

// Count documents
const total = await User.countDocuments({ isActive: true });

// Check if exists
const exists = await User.exists({ email: 'aryan@example.com' }); // returns _id or null

// Distinct values
const roles = await User.distinct('role'); // ['user', 'admin', 'moderator']
```

### Query Operators
```javascript
// Comparison
await User.find({ age: { $gt: 18 } });     // Greater than
await User.find({ age: { $gte: 18 } });    // Greater than or equal
await User.find({ age: { $lt: 30 } });     // Less than
await User.find({ age: { $lte: 30 } });    // Less than or equal
await User.find({ age: { $ne: 25 } });     // Not equal
await User.find({ role: { $in: ['admin', 'moderator'] } }); // In array
await User.find({ role: { $nin: ['user'] } });               // Not in array

// Logical
await User.find({ $and: [{ age: { $gte: 18 } }, { isActive: true }] });
await User.find({ $or: [{ role: 'admin' }, { role: 'moderator' }] });
await User.find({ age: { $not: { $gt: 30 } } });

// Text search
await User.find({ name: /aryan/i });                // Regex (case-insensitive)
await User.find({ name: { $regex: 'aryan', $options: 'i' } }); // Same thing
```

### UPDATE
```javascript
// Find and Update (returns updated document)
const updated = await User.findByIdAndUpdate(
    id,
    { name: 'New Name', age: 25 },
    { new: true, runValidators: true }
    // new: true → returns the UPDATED document (not the old one)
    // runValidators: true → apply schema validations on update
);

// findOneAndUpdate
const updated2 = await User.findOneAndUpdate(
    { email: 'aryan@example.com' },
    { $set: { name: 'Updated' } },
    { new: true }
);

// Update operators
await User.findByIdAndUpdate(id, {
    $set: { name: 'New' },           // Set field
    $unset: { age: '' },             // Remove field
    $inc: { loginCount: 1 },         // Increment by 1
    $push: { hobbies: 'reading' },   // Add to array
    $pull: { hobbies: 'gaming' },    // Remove from array
    $addToSet: { hobbies: 'cooking' } // Add only if not exists
});

// Update many
await User.updateMany({ isActive: false }, { $set: { role: 'inactive' } });
```

### DELETE
```javascript
// Find and Delete
const deleted = await User.findByIdAndDelete(id);

// Delete one
await User.deleteOne({ email: 'test@test.com' });

// Delete many
await User.deleteMany({ isActive: false });
```

---

## 6. Population (References/Joins)

```javascript
// Post Schema
const postSchema = new mongoose.Schema({
    title: String,
    content: String,
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',      // References the User model
        required: true
    }
});
const Post = mongoose.model('Post', postSchema);

// Create a post
const post = await Post.create({
    title: 'My Post',
    content: 'Hello World',
    author: userId   // Store the user's _id
});

// Populate — Replace ObjectId with actual user data
const populatedPost = await Post.findById(postId).populate('author');
// Now populatedPost.author = { _id: '...', name: 'Aryan', email: '...' }

// Populate with field selection
const post2 = await Post.findById(postId).populate('author', 'name email');
// Only name and email from user

// Multiple populations
const data = await Post.find()
    .populate('author', 'name')
    .populate('comments');

// Nested populate
const post3 = await Post.findById(postId)
    .populate({
        path: 'author',
        select: 'name email',
        populate: { path: 'friends', select: 'name' }
    });
```

---

## 7. Instance Methods & Static Methods

```javascript
// Instance Method — available on document instances
userSchema.methods.getFullName = function() {
    return `${this.firstName} ${this.lastName}`;
};

const user = await User.findById(id);
user.getFullName(); // 'Aryan Kumar'

// Static Method — available on the Model itself
userSchema.statics.findByEmail = function(email) {
    return this.findOne({ email });
};

const user = await User.findByEmail('aryan@example.com');

// Virtual Property (not stored in DB)
userSchema.virtual('fullName').get(function() {
    return `${this.firstName} ${this.lastName}`;
});
```

---

## 8. Middleware (Hooks)

```javascript
// Pre-save — runs BEFORE saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    // Example: Hash password before saving
    const bcrypt = await import('bcrypt');
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Post-save — runs AFTER saving
userSchema.post('save', function(doc) {
    console.log(`User ${doc.name} has been saved`);
});

// Pre-find
userSchema.pre(/^find/, function(next) {
    // 'this' is the query object
    this.find({ isActive: { $ne: false } }); // Auto-filter deleted users
    next();
});

// Pre-remove
userSchema.pre('deleteOne', { document: true }, async function(next) {
    // Clean up related data
    await Post.deleteMany({ author: this._id });
    next();
});
```

---

## 9. Indexing

```javascript
// In schema
userSchema.index({ email: 1 });                  // Single field index
userSchema.index({ name: 1, age: -1 });          // Compound index
userSchema.index({ email: 1 }, { unique: true }); // Unique index
userSchema.index({ name: 'text', bio: 'text' }); // Text index for search

// Or inline in schema definition
email: { type: String, unique: true, index: true }
```
