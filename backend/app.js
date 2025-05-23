import express from 'express'
import connectToDatabase from './services/database.js';
import userRoutes from './routes/user.js';
import cors from 'cors'
import cookieParser from 'cookie-parser';

const app = express();
const PORT = 3001;

const corsOptions = {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};

app.use(cors(corsOptions)); 
app.get('/', (req, res) => {
    res.send('hello world')
});

app.use(express.json());
app.use(cookieParser());

await connectToDatabase();

app.use('/api', userRoutes);

app.listen(PORT, ()=> {
    console.log(`Server launched localhost/${PORT}`)
});

