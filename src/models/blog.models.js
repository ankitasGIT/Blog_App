import mongoose, {Schema} from "mongoose";

const blogSchema = new Schema({
    title: {
        type: String, 
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String //url
    },
    user_id:{
        type: mongoose.Types.ObjectId,
        ref: "user",
        required: [true, 'user id is required']
    }
}, {timestamps : true})

export const blog = mongoose.model("blog", blogSchema);