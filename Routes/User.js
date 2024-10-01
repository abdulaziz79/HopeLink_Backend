import express from "express"
import User from "../Models/User.js"
import { register, getUserById, getUsers, deleteUserById  } from "../Controllers/User.js"

const User = express.Router();
User.post("/register", register)
User.get("/read/all",getUsers)
User.get("/getUserById/:id", getUserById);
User.delete("/delete/:id", deleteUserById)

export default User