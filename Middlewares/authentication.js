import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import bcrypt from "bcrypt"
import User from "../Models/User.js"
dotenv.config()

export const verifyToken = (req, res, next)=>{
    const token = req.cookies.token;
    if(!token){
        return res.status(401).json({error: "Unauthorized or Missing token"})
    }
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded;
        next()
    } catch (error) {
        console.log(error.message)
        res.status(401).json(error.message)
    }
}

//checkk role

export const checkRole = (roles)=>{
    return (req,res, next)=>{
        try {
            if(roles.includes(req.user.role)){
                next();
            }else{
                return res.status(500).send("Access denied. you don't have permission")
            }
        } catch (error) {
            return res.status(404).json({error:404, message:"Not authorized"})
        }
    }
}

//login

export const login = async(req, res)=>{
    const {email, password }= req.body;
    try {
        if(!email || !password){
            return res.status(400).json("all fields are required")
        }
        const user = await User.findOne({email})
        if(!user){
            return res.status(401).json("Invalid email")
        }
        const isValidPassword = await bcrypt.compare(password, user.password)
        if(!isValidPassword){
            return res.status(401).json("Invalid Password")
        }
        const isSecure = process.env.NODE_ENV === "production";
        const token = jwt.sign(
            {userId:user._id, role: user.role, email, name:user.name, image: user.image, phone :user.phone, location:user.location},
            process.env.SECRET_KEY,
            {expiresIn:"48h"}
        )
        return res.cookie("token", token, {
            httpOnly:true,
            secure:isSecure,
            sameSite:"None"
        }).status(200).json({message:"Login successful"})
    } catch (error) {
        res.status(500).json(error.message)
    }
}


export const authenticateUser = (req, res, next) => {
    const token = req.cookies.access_token;
    if (token) {
      next();
    } else {
      res.status(401).json({ message: "Unauthorized" });
    }
  };

  export const loggedInUser = (req, res) => {
    return res.json({ user: req.user }).status(200);
  };

  export const logOut = (req, res) => {
    return res
      .clearCookie("token")
      .status(200)
      .json({ message: "Successfully Logged Out!" });
  };
  