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

io.on('connection', (socket) => {
    console.log('Un utilisateur s\'est connecté')

    // socket.on('message', (msg) => {
    //     console.log('Message reçu :', msg);
    //     io.emit('message', msg);
    // });
       // Réception de l'identité de l'utilisateur
    socket.on('identify', (userId) => {
        users.set(socket.id, userId);
        userSockets.set(userId, socket.id);
        console.log(`Utilisateur ${userId} connecté via le socket ${socket.id}`);
    });

    socket.on('private_message', async ({ toUserId, fromUserId, message }) => {
        try {
            // 1. Sauvegarde du message
            const newMessage = new Message({ fromUserId, toUserId, message });
            await newMessage.save();

            // 2. Envoi au destinataire (s’il est connecté)
            const toSocketId = userSockets.get(toUserId);
        if (toSocketId) {
            io.to(toSocketId).emit('private_message', { fromUserId, message });
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
            userSockets.delete(userId);
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

