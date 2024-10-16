import  express  from "express";
import { createVolunteer, getVolunteer, deleteVolunteer } from "../Controllers/Volunteer.js";
import { verifyToken } from "../Middlewares/authentication.js";

const volunteer = express.Router()

volunteer.post('/add',verifyToken, createVolunteer);
volunteer.get('/get/all',getVolunteer);
volunteer.delete('/delete/:id',verifyToken,deleteVolunteer)

export default volunteer