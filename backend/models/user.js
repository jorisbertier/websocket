import mongoose from 'mongoose';
import validator from 'validator';


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        validate(v) {
            if(!validator.isEmail(v))  throw new Error('Email is not a valid email address')
        }
    },
    password: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})


const User = mongoose.model('User', userSchema);
export { User };
