import jwt from 'jsonwebtoken';
import { User } from '../models/user.js';

export default async function auth(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: 'No token found in cookies' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        req.user = user;
        next();
    } catch (err) {
        console.error(err);
        res.status(401).json({ message: 'Invalid token' });
    }
}
