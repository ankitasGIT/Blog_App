import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

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
    },
    refreshtoken: {
        type: String
    },
    blogs: [
        {
            type: mongoose.Types.ObjectId,
            ref: "blog"
        }
    ]
}, {timestamps: true})


userSchema.pre("save", async function(next){
    if(!this.isModified("password"))
        return next();
    // if(!this.isModified('password'))
    //     return null;
    this.password = await bcrypt.hash(this.password, 10);
    return next();
})

// userSchema.methods.isPasswordCorrect = async function (password){
//     return await bcrypt.compare(password, this.password);
// }

userSchema.methods.generateAccessTokens = function (){
    return jwt.sign({
        _id: this.id,
        email: this.email,
        username: this.username
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }
)
}

userSchema.methods.generateRefreshTokens = function (){
    return jwt.sign({
        _id: this.id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }
)
}

export const user = mongoose.model("user", userSchema);