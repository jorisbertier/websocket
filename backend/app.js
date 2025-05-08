import express from 'express'
import connectToDatabase from './services/database.js';
import userRoutes from './routes/user.js';
import cors from 'cors'

const app = express();
const PORT = 3001;

const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions)); 
app.get('/', (req, res) => {
    res.send('hello world')
});

app.use(express.json());

await connectToDatabase();

app.use('/api', userRoutes);

app.listen(PORT, ()=> {
    console.log(`Server launched localhost/${PORT}`)
});

