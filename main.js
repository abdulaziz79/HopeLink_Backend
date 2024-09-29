import  express  from "express";
import bodyParser from "body-parser"
import cookieParser from "cookie-parser";
import "dotenv/config"
import cors from "cors"
import dotenv from "dotenv"
import { connectDB } from "./config/Mongo.js";
dotenv.config()

const app=express()
app.use(express.json());

const corsOption={
    origin:'http://localhost:3000',
    credentials:true,
    optionsSuccessStatus:200
}
app.use(cors(corsOption))
app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieParser())

const PORT= process.env.PORT;

app.listen(PORT, (error)=>{
    if(!error) {
        console.log("Server is Running, and App is listening on port "+ PORT) 
    } else {
        console.log("Error: ", error)
    }
})
connectDB()