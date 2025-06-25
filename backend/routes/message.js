import express from 'express';
import { Message } from '../models/message.js';

const router = express.Router();

// Récupérer tous les messages entre deux utilisateurs
router.get('/:userId/:friendId', async (req, res) => {
    const { userId, friendId } = req.params;

    try {
        const messages = await Message.find({
        $or: [
            { fromUserId: userId, toUserId: friendId },
            { fromUserId: friendId, toUserId: userId }
        ]
        }).sort({ timestamp: 1 });

        const formatted = messages.map(msg => ({
            from: msg.fromUserId,
            text: msg.message
        }));


        res.json(formatted);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur:', error });
    }
});

export default router;
