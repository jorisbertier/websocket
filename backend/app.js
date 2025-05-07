import express from 'express'
import connectToDatabase from './services/database.js';
// import userRoutes from './routes/user.js';

const app = express();
const PORT = 3000;

// app.get('/', (req, res) => {
//     res.send('hello world')
// });

// app.use(express.json());

// app.use('/api/users', userRoutes);

app.listen(PORT, ()=> {
    console.log(`Server launched localhost/${PORT}`)
});

connectToDatabase()