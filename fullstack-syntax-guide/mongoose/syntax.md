# Mongoose (MongoDB) Syntax Guide

Comprehensive guide for MongoDB integration using Mongoose.

## 1. Connection Steps
```javascript
import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const conn = await mongoose.connect('mongodb://localhost:27017/my_database');
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;
```

## 2. Defining a Schema & Model
```javascript
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true },
    age: Number,
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
export default User;
```

## 3. CRUD Operations
```javascript
// Create
const newUser = await User.create({ name: 'Aryan', email: 'aryan@example.com' });

// Read (Find)
const users = await User.find({ age: { $gte: 18 } });
const user = await User.findById(id);

// Update
const updatedUser = await User.findByIdAndUpdate(id, { name: 'New Name' }, { new: true });

// Delete
await User.findByIdAndDelete(id);
```

## 4. Middleware (Pre-save hooks)
```javascript
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    // Hash password here...
    next();
});
```
