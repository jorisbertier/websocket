import mongoose from 'mongoose';
import validator from 'validator';


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 2
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
        minlength: 6
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

userSchema.methods.toJSON = function() {
    const user = this.toObject()

    delete user.password;
    return user
}

const User = mongoose.model('User', userSchema, 'users');
export { User };
