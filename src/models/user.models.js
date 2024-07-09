import mongoose, {Schema} from "mongoose";

const userSchema = new Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        index: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true
    },
    password: {
        type: String, 
        required: [true, 'Password is required'],
        unique: true
    }
}, {timestamps: true})

export const user = mongoose.model("user", userSchema);