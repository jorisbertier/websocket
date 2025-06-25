import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    fromUserId: { type: String, required: true },
    toUserId: { type: String, required: true },
    message: { type: String, required: true },
    timeStamp: {type: Date, default: Date.now}
})

const Message = mongoose.model('Message', messageSchema);
export { Message };