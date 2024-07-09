import mongoose from "mongoose";
import {dbname} from "../constants.js";

const connectDB = async() => {
    try {
        const mongoDBUrl = process.env.MONGODB_URI;

        if (!mongoDBUrl) {
            throw new Error('MONGODB_URL is not defined in environment variables');
        }
        const instance = await mongoose.connect(`${process.env.MONGODB_URI}/${dbname}`);

        console.log("MongoDB Connected success!!");
    } catch (error) {
        console.log("MongoDB connection error : ", error);
        throw error;
    }
}

export default connectDB;