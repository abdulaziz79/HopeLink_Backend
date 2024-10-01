import express from "express"
import User from "../Models/User.js"
import { register, getUserById, getUsers, deleteUserById  } from "../Controllers/User.js"

const user = express.Router();
user.post("/register", register)
user.get("/read/all",getUsers)
user.get("/getUserById/:id", getUserById);
user.delete("/delete/:id", deleteUserById)

export default user