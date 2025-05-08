import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

async function connectToDatabase() {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✅ Connected to MongoDB with Mongoose');
    } catch (error) {
        console.error('❌ Mongoose connection error:', error.message);
        throw error;
    }
}

export default connectToDatabase;