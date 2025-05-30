import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export const connectDB = async (req,res) => {
    try {
        const MONGO_URI = process.env.MONGO_URL;
        const connection  = await mongoose.connect(MONGO_URI);
        // console.log(connection)
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.log(error);
    }
}
