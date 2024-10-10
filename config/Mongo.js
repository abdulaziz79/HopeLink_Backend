import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config(); // Ensure .env variables are loaded

const DB_URL= process.env.DB_URL

export const connectDB=()=>{
    mongoose.connect(DB_URL)
    .then(()=>{
        console.log('Database connected')
    }).catch((error)=>{
        console.log(error)
        process.exit(1);
    })
}
