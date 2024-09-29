import mongoose from "mongoose";

const DB_URL= process.env.DB_URL

export const connectDB=()=>{
    mongoose.connect(DB_URL)
    .then(()=>{
        console.log('Database connected')
    }).catch((error)=>{
        console.log(error)
    })
}