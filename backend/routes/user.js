import { User }  from '../models/user.js';
import express from 'express';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken'
const router = express.Router()


router.post('/register', async (req, res) => {
    const { name, email, pseudo, password} = req.body;

    const errors = {};

    try {
        

        console.log('Connected:', mongoose.connection.readyState); // 1 = connected
        console.log('Model collection name:', User.collection.name);
        const existingUser = await User.findOne({ email });
        const existingPseudo = await User.findOne({ pseudo });
        if (existingUser) errors.email = 'Email already in use';
        if (existingPseudo) errors.pseudo = 'Pseudo already in use';

        if (Object.keys(errors).length > 0) {
            return res.status(400).json({ errors });
        }
        
        if (pseudo.length < 4) {
            errors.pseudo = 'Pseudo must be at least 4 characters';
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
            pseudo,
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
            return res.status(400).json({ message: 'Invalid password'})
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

router.post('/logout', async(req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
    });

    res.status(200).json({ message: 'Logout successful' });
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

router.get('/usersList', async (req, res) => {
    
    // const token = req.cookies.token;
    // if(!token) {
    //     return res.status(401).json({ message: 'Unauthorized'})
    // }
    
    try {
        // const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const users = await User.find({}, { pseudo: 1 });
        res.status(200).json(users)
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' })
        console.log(error)
    }
})

router.post('/friendRequest', async (req, res) => {
    const { fromUserId, toUserIdPseudo} = req.body

    if(!fromUserId || !toUserIdPseudo) {
        return res.status(400).json({ message : 'Missing Data'})
    }
    try {
        const user = await User.findOne({ pseudo : toUserIdPseudo});
        if(!user) return res.status(400).json({ message: 'User not found'})

        if(!user.friendRequests) user.friendRequests = []

        if(user.friendRequests.includes(fromUserId)) {
            return res.status(400).json({message : 'Request already sent'})
        }
        user.friendRequests.push(fromUserId); 
        await user.save()

        console.log('Request sent')
        res.status(200).json({ message: 'Request sent'})
    } catch (error) {
        res.status(500).json({ message: 'Server error' })
        console.log(error)
    }
})

router.post('/friendRequest/accept', async (req, res) => {
    const { fromUserId, toUserId} = req.body

    if(!fromUserId || !toUserId) {
        return res.status(400).json({ message : 'Missing Data'})
    }
    try {
        const user = await User.findById(toUserId);
        const fromUser = await User.findById(fromUserId);
        if(!user || !fromUser) return res.status(404).json({ message: 'User not found'})

        if(!user.friends) user.friends = [];
        if (!fromUser.friends) fromUser.friends = [];

        if(!user.friendRequests.includes(fromUserId)) {
            return res.status(400).json({message : 'No such fiend request'})
        }
        
        if(!user.friends.includes(fromUserId)) {
            user.friends.push(fromUserId);
        }
    
        if (!fromUser.friends.includes(toUserId)) {
            fromUser.friends.push(toUserId);
        }

        user.friendRequests = user.friendRequests.filter(
            (id) => id.toString() != fromUserId
        )
        await user.save()
        await fromUser.save()

        console.log('Friend request accepted')
        res.status(200).json({ message: 'Friend request accepted'})
    } catch (error) {
        res.status(500).json({ message: 'Server error' })
        console.log(error)
    }
})

export default router