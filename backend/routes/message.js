import express from 'express';
import { Message } from '../models/message.js';

const router = express.Router();

router.get('/conversations/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const messages = await Message.find({
        $or: [
            { fromUserId: userId},
            { toUserId: userId }
        ]
        })

        const interlocutorsSet = new Set();

        messages.forEach((msg) => {
            if (msg.fromUserId !== userId) interlocutorsSet.add(msg.fromUserId.toString());
            if (msg.toUserId !== userId) interlocutorsSet.add(msg.toUserId.toString());
        });
        
        const interlocutors = Array.from(interlocutorsSet);
        console.log('interloutors:', interlocutors)
        res.json(interlocutors);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur:', error });
    }
});

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
            text: msg.message,
            timeStamp: msg.timeStamp
        }));


        res.json(formatted);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur:', error });
    }
});


export default router;
