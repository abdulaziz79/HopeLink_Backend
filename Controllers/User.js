import User from "../Models/User.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export const register = async(req,res)=>{
    const {name, email, password, phone }= req.body;
    try {
        if (!password || typeof password !== 'string' || password.trim().length < 6){
            return res.status(400).json({ error: "Invalid password in the request body" });
        }
        const existingUser= await User.findOne({email});
        if(existingUser){
            return res.status(401).json({ error: "Email already exists" });
        }
        const salt = 10;
        const hashedPass= await bcrypt.hash(password, salt);
        const newUser= new User({
            name,
            email,
            // image:image || null,
            // location:location ||  null,
            phone:phone || null,
            password:hashedPass
        })
        await newUser.save()
        const isSecure= process.env.NODE_ENV === "production"
        const token = jwt.sign({ userId:newUser._id, email:newUser.email, name:newUser.name ,phone:newUser.phone,},process.env.SECRET_KEY, { expiresIn: '24h' })
        res.cookie("token", token, { httpOnly: true, secure:isSecure, sameSite: 'None'});
        res.status(201).json(newUser)
    } catch (error) {
        console.log(error.message)
            res.status(500).json(error.message)
    }
}

export const getUsers =async (req, res)=>{
    try {
        const allUsers = await User.find();
        res.status(200).json(allUsers);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    
}
export const getUserById = async (req, res)=>{
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
          res.status(404).json({ message: "User not found" });
          return;
        }
        res.status(200).json(user);
      } catch (error) {
        res.status(500).json({ message: "key one" + error.message });
      }
}
export const deleteUserById = async(req, res)=>{
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
          res.status(404).json({ message: "User not found" });
          return;
        }
        res.status(200).json({ message: "User deleted successfully" });
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    
}