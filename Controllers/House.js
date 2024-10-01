import House from "../Models/House.js";
import User from "../Models/User.js";
import mongoose from "mongoose";

export const createPost = async (req, res) => {
    console.log(req.body)
    console.log("userrrr",req.user.userId)
      try {
        const { userId,description, location, categoryId } = req.body;
        const newPost = new Posts({
            description,
            location,
            userId:req.user.userId,
            categoryId
          })
          const savedPost = await newPost.save();

          res.status(201).json(savedPost);
        } catch (error) {
          console.error(error);
          res.status(500).json(error.message);
        }
      };  

      

export const getPosts = async (req, res)=>{
    try {
        const posts = await House.find().populate("userId")
        if(posts){
            res.status(200).json(users)
        }
    } catch (error) {
        res.status(404).json(error.message)
    }
}
export const deletePostById = async(req, res)=>{
    const { id } = req.params
    try {
      const deletedPost = await Posts.findByIdAndDelete(id)
      if(!deletedPost){
        return res.status(404).json("post not found")

      }
      res.status(200).json(deletedPost)
    } catch (error) {
      res.status(400).json(error.message)
    }
  }