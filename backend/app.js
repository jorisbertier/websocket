import express from 'express'
import connectToDatabase from './services/database.js';
import userRoutes from './routes/user.js';
import cors from 'cors'
import cookieParser from 'cookie-parser';
import {Server} from 'socket.io';
import http from 'http';


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

io.on('connection', (socket) => {
    console.log('Un utilisateur s\'est connecté')

    socket.on('message', (msg) => {
        console.log('Message reçu :', msg);
        io.emit('message', msg);
    });

    socket.on('disconnect', () => {
        console.log('L\'utilisateur s\'est déconnecté')
    })
})


httpServer.listen(PORT, ()=> {
    console.log(`Server launched localhost/${PORT}`)
});

