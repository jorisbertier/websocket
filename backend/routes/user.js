import { User }  from '../models/user.js';
import express from 'express';
import bcrypt from 'bcrypt';
import connectToDatabase from '../services/database.js';

const router = express.Router()


router.post('/register', async (req, res) => {
    const { name, email, password} = req.body;

    const db = await connectToDatabase()
    const users = db.collection('users')

    try {

        const hashedPassword = await bcrypt.hash(password, 10);
        const createdAt = new Date()

        const user = new User({
            name,
            email,
            password: hashedPassword,
            createdAt
        })

        users.insertOne(user)
        res.status(201).json({ message: 'User created successfully'})

    }catch(e) {
        console.log('Register error: ', e)
        res.status(500).json({ message: 'Server Error'})
    }
})

export default router