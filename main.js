import  express  from "express";
import bodyParser from "body-parser"
import cookieParser from "cookie-parser";
import "dotenv/config"
import cors from "cors"
import dotenv from "dotenv"
import { connectDB } from "./config/Mongo.js";
dotenv.config()
import router from "./Routes/User.js";
import Supplies from "./Routes/Supplies.js";
import RequestSupplies from "./Routes/RequestSupplies.js";
import House from "./Routes/House.js"
import { loggedInUser } from "./Middlewares/authentication.js";
import { verifyToken } from "./Middlewares/authentication.js";
import volunteer from "./Routes/Volunteer.js";
const app=express()
app.use(express.json());

app.use("/images", express.static('Public/images'))

const corsOption={
    // origin:'http://localhost:3000',
    origin:process.env.FRONT_END_LINK,
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

// Define routes
app.use("/user", router)
app.use("/supplies", Supplies)
app.use("/requestSupplies",RequestSupplies)
app.use("/houses",House )
app.use("/logged-in-user",verifyToken, loggedInUser)
app.use('/volunteer',volunteer)
