import express from 'express'
import connectToDatabase from './services/database.js';
import userRoutes from './routes/user.js';
import cors from 'cors'
import cookieParser from 'cookie-parser';
import {Server} from 'socket.io';
import http from 'http';
import { Message } from './models/message.js';
import messageRoutes from './routes/message.js';


const app = express();
const PORT = 3001;

const httpServer = http.createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true,
    }
});

const users = new Map(); // socketId -> userId
const userSockets = new Map(); // userId -> socketId


const corsOptions = {
    origin: 'http://localhost:3000',
    secure: false,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
};

app.use(cookieParser());
app.use(cors(corsOptions)); 
app.get('/', (req, res) => {
    res.send('hello world')
});

app.use(express.json());

await connectToDatabase();

app.use('/api', userRoutes);
app.use('/api/messages', messageRoutes);

app.get('/api/online-users', (req, res) => {
    try {
        const onlineUserIds = Array.from(userSockets.keys()); // userId[]
        res.status(200).json(onlineUserIds);
        console.log('Utilisateurs connectés:', Array.from(userSockets.keys()));
    } catch (err) {
        res.status(500).json({ message: 'Erreur serveur', error: err });
    }
});

io.on('connection', (socket) => {
    console.log('Un utilisateur s\'est connecté')

    // Réception de l'identité de l'utilisateur
    socket.on('identify', (userId) => {
        users.set(socket.id, userId);
        if (!userSockets.has(userId)) {
            userSockets.set(userId, new Set());
        }
        userSockets.get(userId).add(socket.id);
        console.log(`Utilisateur ${userId} connecté via le socket ${socket.id}`);
        //get user is online
        io.emit('user_connected', userId);
        socket.emit('online_users_list', Array.from(userSockets.keys()));
        // for (const onlineUserId of userSockets.keys()) {
        // if (onlineUserId !== userId) {
        //     socket.emit('user_connected', onlineUserId);
        // }
        // }
    });

    socket.on('private_message', async ({ toUserId, fromUserId, message }) => {
        try {
            // 1. Sauvegarde du message
            const newMessage = new Message({ fromUserId, toUserId, message });
            await newMessage.save();

            // 2. Envoi au destinataire (s’il est connecté)
            const toSocketSet = userSockets.get(toUserId);
        if (toSocketSet) {
            for (const socketId of toSocketSet) {
                io.to(socketId).emit('private_message', { fromUserId, toUserId, message });
            }
        }
            console.log(`Message de ${fromUserId} vers ${toUserId} envoyé et sauvegardé.`);
        } catch (err) {
            console.error('Erreur lors de l\'envoi du message :', err);
    }
    });

    socket.on('disconnect', () => {
        const userId = users.get(socket.id);
        if (userId) {
            users.delete(socket.id);
            const sockets = userSockets.get(userId);
            if (sockets) {
                sockets.delete(socket.id);

                // Si plus aucun socket actif pour cet user
                if (sockets.size === 0) {
                    userSockets.delete(userId);
                    io.emit('user_disconnected', userId);
                }
            }
        }
        console.log('Un utilisateur s\'est déconnecté');
    });

    // socket.on('disconnect', () => {
    //     console.log('L\'utilisateur s\'est déconnecté')
    // })
})


httpServer.listen(PORT, ()=> {
    console.log(`Server launched localhost/${PORT}`)
});

