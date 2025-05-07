import {MongoClient} from 'mongodb'
import dotenv from 'dotenv';

dotenv.config();

const client = new MongoClient(process.env.MONGO_URL);

async function connectToDatabase() {
    try {
        await client.connect();
        console.log("✅ Connected to MongoDB");
        const db = client.db('websocket');
        return db;
    } catch (error) {
        console.error("❌ MongoDB connection error:", error);
    }
}

export default connectToDatabase;
