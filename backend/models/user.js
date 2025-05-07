import { mongoose } from 'mongoose';
import {validator} from 'validator';

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
            if(!validator.isEmail(v))  throw new error('Email is not a valid email address')
        }
    },
    password: {
        type: String,
        required: true,
    }
})
module.exports = mongoose.model('User',userSchema)
