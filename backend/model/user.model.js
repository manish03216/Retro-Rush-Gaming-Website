import mongoose from "mongoose";
import validator from "validator";

const userSchema = new mongoose.Schema({
    Username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate:[validator.isEmail, 'please enter valid email']
    },
    password: {
        type: String,
        minlength:8,
        required: true,
        select: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    token:{
        type: String
    },
    photo: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true

        },
    }
})
export const User = mongoose.model('User', userSchema)  // User is the name of the model and userSchema is the schema of the model
