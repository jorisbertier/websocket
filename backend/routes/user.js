import { User }  from '../models/user.js';
import express from 'express';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
// import connectToDatabase from '../services/database.js';

const router = express.Router()


router.post('/register', async (req, res) => {
    const { name, email, password} = req.body;

    // const db = await connectToDatabase()
    // const users = db.collection('users')
    const errors = {};

    try {
        

        console.log('Connected:', mongoose.connection.readyState); // 1 = connecté
        console.log('Model collection name:', User.collection.name);
        const existingUser = await User.findOne({ email });
        if (existingUser) errors.email = 'Email already in use';

        if (Object.keys(errors).length > 0) {
            return res.status(400).json({ errors });
        }

        if (password.length < 6) {
            errors.password = 'Password must be at least 6 characters';
            return res.status(400).json({ errors });
        }
    
        const hashedPassword = await bcrypt.hash(password, 10);
        const createdAt = new Date()

        const user = new User({
            name,
            email,
            password: hashedPassword,
            createdAt
        })
        if(user.email)

        await user.validate(); 
        await user.save()
        res.status(201).json({ message: 'User created successfully'})

    }catch(e) {
        console.log('Register error: ', e)
        if (e.name === 'ValidationError') {
            const errors = {};
            for (const field in e.errors) {
              errors[field] = e.errors[field].message;
            }
            return res.status(400).json({ errors });
          }
          if (e.code === 11000 && e.keyPattern && e.keyPattern.email) {
            return res.status(400).json({
                errors: {
                    email: 'Email already in use'
                }
            });
        }
        res.status(500).json({ message: 'Server Error'})
    }
})

export default router