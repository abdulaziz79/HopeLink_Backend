import User from "../Models/User.js"
import bcrypt from "bcrypt"
import House from "../Models/House.js";
import Supplies from "../Models/Supplies.js";
import jwt from "jsonwebtoken"

// export const register = async(req,res)=>{
//     const {name, email, password, phone }= req.body;
//     try {
//         if (!password || typeof password !== 'string' || password.trim().length < 6){
//             return res.status(400).json({ error: "Password must be at least 6 characters long" });
//         }
//         const existingUser= await User.findOne({email});
//         if(existingUser){
//             return res.status(401).json({ error: "Email already exists" });
//         }
//         const salt = 10;
//         const hashedPass= await bcrypt.hash(password, salt);
//         const newUser= new User({
//             name,
//             email,
//             // image:image || null,
//             // location:location ||  null,
//             phone:phone || null,
//             password:hashedPass
//         })
//         await newUser.save()
//         const isSecure= process.env.NODE_ENV === "production"
//         const token = jwt.sign({ userId:newUser._id, email:newUser.email, name:newUser.name ,phone:newUser.phone,},process.env.SECRET_KEY, { expiresIn: '24h' })
//         res.cookie("token", token, { httpOnly: true, secure:isSecure, sameSite: 'None'});
//         res.status(201).json(newUser)
//     } catch (error) {
//         console.log(error.message)
//             res.status(500).json(error.message)
//     }
// }
export const register = async (req, res) => {
  const { name, email, password,role} = req.body;
  try {
      // Check if password exists and is at least 6 characters long
      if (!password || typeof password !== 'string' || password.trim().length < 6) {
          return res.status(400).json({ error: "Password must be at least 6 characters long" });
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
          return res.status(401).json({ error: "Email already exists" });
      }

      // Hash the password
      const saltRounds = 10;
      const hashedPass = await bcrypt.hash(password, saltRounds);

      // Create a new user object
      const newUser = new User({
          name,
          email,
          role,
          password: hashedPass
      });

      // Save the new user in the database
      await newUser.save();

      // Generate JWT token
      const token = jwt.sign(
          { userId: newUser._id, email: newUser.email, name: newUser.name, role:newUser.role},
          process.env.SECRET_KEY,
          { expiresIn: '24h' }
      );

      // Set the token as a cookie
      const isSecure = process.env.NODE_ENV === "production";
      res.cookie("token", token, { httpOnly: true, secure: true, sameSite: 'None' });
        // console.log(token)
      // Return the created user
      res.status(201).json(newUser);

  } catch (error) {
      console.log(error.message);
      res.status(500).json(error.message);
  }
};

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

export const getByUserId = async (req, res) => {
  const id=req.params.id
  try {
    const userPosts= await House.find({userId: id}).populate("userId").sort({createdAt:-1})
    // const usersUserId = users.map(user=> user._id)
    // const userPosts = await Posts.find({userId: {$in: usersUserId}}).populate("userId")
    res.json(userPosts);
  } catch (error) {
    console.error(error);
    res.status(500).json(error.message);
  }
};

