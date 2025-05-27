import { User }  from '../models/user.js';
import express from 'express';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken'
const router = express.Router()


router.post('/register', async (req, res) => {
    const { name, email, password} = req.body;

    const errors = {};

    try {
        

        console.log('Connected:', mongoose.connection.readyState); // 1 = connected
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
    
        const createdAt = new Date()

        const user = new User({
            name,
            email,
            password,
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

router.post('/login', async(req, res) => {
    const { email, password} = req.body
    console.log('body request', req.body)
    try {
        const user = await User.findOne({email})

        if(!user) {
            res.status(400).json({ message: 'Invalid email'})
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)

        if(!isPasswordValid) {
            res.status(400).json({ message: 'Invalid password'})
        }

        const token = jwt.sign({ id: user._id}, process.env.JWT_SECRET, {
            expiresIn: '1h',
        })
        res.cookie('token', token, {
            httpOnly: true,
            secure: false, // true en prod (https)
            sameSite: 'lax', // ou 'strict'
            maxAge: 3600000, // 1h en ms
        });
        res.status(200).send({ user, token})
        console.log('connecté')
    } catch(e) {
        console.log('Error connexion', e.message)
        res.status(400).send({ message: e.message})
    }
})

router.get('/me', async (req, res) => {
    
    const token = req.cookies.token;
    if(!token) {
        return res.status(401).json({ message: 'Unauthorized'})
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findById(decoded.id).select('-password')
        res.status(200).json(user)
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' })
        console.log(error)
    }
})

export default router